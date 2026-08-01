"""
PostToolUse フック用の軽量HTML構文チェッカー。

Write/Edit 後のツール結果(JSON)を標準入力から受け取り、対象が *.html なら
タグの閉じ忘れ・対応の取れない閉じタグがないかを Python 標準ライブラリの
html.parser だけで検査する(外部依存を増やさないための方針)。
<script>/<style> の中身は html.parser が自動的にCDATA扱いするため、
JS/CSS内の "<" "> " を誤ってタグと誤認することはない。
"""

import sys
import json
import os
from html.parser import HTMLParser

VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}


class BalanceChecker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag not in VOID_TAGS:
            self.stack.append((tag, self.getpos()[0]))

    def handle_endtag(self, tag):
        if not self.stack:
            self.errors.append(f"対応する開始タグのない閉じタグ </{tag}> (line {self.getpos()[0]})")
            return
        if self.stack[-1][0] == tag:
            self.stack.pop()
            return
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                for unclosed_tag, line in self.stack[i + 1:]:
                    self.errors.append(f"タグ <{unclosed_tag}> が閉じられていません (line {line})")
                self.stack = self.stack[:i]
                return
        self.errors.append(f"対応する開始タグのない閉じタグ </{tag}> (line {self.getpos()[0]})")


def main():
    # Windows既定のコンソールコードページ(cp932など)で日本語パスの読み取りや
    # JSON出力が文字化けするのを防ぐ
    sys.stdin.reconfigure(encoding="utf-8")
    sys.stdout.reconfigure(encoding="utf-8")

    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0

    tool_input = data.get("tool_input") or {}
    tool_response = data.get("tool_response") or {}
    file_path = tool_input.get("file_path") or tool_response.get("filePath")

    if not file_path or not file_path.lower().endswith(".html"):
        return 0
    if not os.path.isfile(file_path):
        return 0

    with open(file_path, encoding="utf-8") as f:
        content = f.read()

    checker = BalanceChecker()
    checker.feed(content)
    checker.close()

    for tag, line in checker.stack:
        checker.errors.append(f"タグ <{tag}> が閉じられていません (line {line})")

    if checker.errors:
        lines = "\n".join(f"- {e}" for e in checker.errors[:10])
        message = f"[HTML構文チェック] {file_path} でタグの不整合が見つかりました:\n{lines}"
        print(json.dumps({"systemMessage": message}, ensure_ascii=False))

    return 0


if __name__ == "__main__":
    sys.exit(main())
