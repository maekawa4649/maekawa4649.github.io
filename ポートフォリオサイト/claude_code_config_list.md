# Claude Code `/config` 設定一覧

`/config` コマンドで確認できる設定キーとその説明一覧です。
使い方: `/config key=value [key=value ...]`

| 設定キー | 指定可能な値 | 説明 |
|---|---|---|
| `agentPushNotifEnabled` | `true`\|`false` | サブエージェント実行時のプッシュ通知を有効/無効にする |
| `artifacts` | `true`\|`false` | Artifacts機能（HTML/Markdownの成果物を生成・共有）の有効/無効 |
| `askUserQuestionTimeout` | `never`\|`60s`\|`5m`\|`10m` | ユーザーへの確認質問（AskUserQuestion）の応答待ちタイムアウト時間 |
| `autoCompact` | `true`\|`false` | 会話が長くなった際に自動で要約（コンパクト化）するかどうか |
| `autoConnectIde` | `true`\|`false` | VSCode等のIDE拡張機能への自動接続 |
| `autoScroll` | `true`\|`false` | 出力表示時に自動でスクロールするか |
| `checkpoints` | `true`\|`false` | 作業状態のチェックポイント保存/復元機能の有効/無効 |
| `chrome` | `true`\|`false` | Chromeブラウザ連携機能の有効/無効 |
| `copyFullResponse` | `true`\|`false` | 応答をコピーする際に全文をコピーするか |
| `copyOnSelect` | `true`\|`false` | テキスト選択時に自動でクリップボードにコピーするか |
| `defaultToAgentsView` | `true`\|`false` | 起動時にデフォルトでエージェント一覧ビューを表示するか |
| `editor` | `normal`\|`vim` | 入力エディタの操作モード |
| `externalEditorContext` | `true`\|`false` | 外部エディタで開いているコンテキストを取り込むか |
| `gitignore` | `true`\|`false` | ファイル探索時に`.gitignore`の内容を尊重するか |
| `inputNeededNotifEnabled` | `true`\|`false` | ユーザーの入力待ち状態になった際の通知を有効にするか |
| `language` | 任意の値 | 応答言語の指定 |
| `leftArrowOpensAgents` | `true`\|`false` | 左矢印キー入力でエージェント一覧を開くか |
| `model` | `default`\|`sonnet`\|`opus`\|`haiku`\|`fable`\|`best`\|`sonnet[1m]`\|`fable[1m]`\|`opusplan` | 使用するモデルの指定（`[1m]`は拡張コンテキスト版、`opusplan`はプラン専用モデル） |
| `notifChannel` | `auto`\|`iterm2`\|`terminal_bell`\|`iterm2_with_bell`\|`kitty`\|`ghostty`\|`notifications_disabled` | 通知を送る先のチャンネル（ターミナル種別） |
| `outputStyle` | `default`\|`Proactive`\|`Explanatory`\|`Learning` | 応答の出力スタイル（説明の詳しさや積極性の傾向） |
| `permissionMode` | `default`\|`plan`\|`acceptEdits`\|`auto`\|`dontAsk` | ツール実行時の権限確認モード（`dontAsk`は確認をほぼスキップするバイパス寄りの設定） |
| `prStatus` | `true`\|`false` | GitHub PRのステータス表示機能 |
| `progressBar` | `true`\|`false` | 処理中のプログレスバー表示 |
| `promptSuggestionEnabled` | `true`\|`false` | 入力時のプロンプト候補表示 |
| `recap` | `true`\|`false` | セッションの要約（recap）機能の有効/無効 |
| `reduceMotion` | `true`\|`false` | UIアニメーションを減らすか（アクセシビリティ設定） |
| `remoteControl` | `true`\|`false`\|`default` | リモートからの操作（remote control）機能 |
| `switchModelsOnFlag` | `true`\|`false` | 特定のフラグ指定時にモデルを自動切替するか |
| `theme` | `auto`\|`dark`\|`light`\|`light-daltonized`\|`dark-daltonized`\|`light-ansi`\|`dark-ansi` | 配色テーマ（`daltonized`は色覚特性対応版） |
| `thinking` | `true`\|`false` | 思考プロセス（Extended Thinking）の表示 |
| `tips` | `true`\|`false` | 起動時などのヒント表示 |
| `turnDuration` | `true`\|`false` | 各ターンの所要時間表示 |
| `useAutoModeDuringPlan` | `true`\|`false` | プランモード中にauto権限モードを併用するか |
| `verbose` | `true`\|`false` | 詳細なログ・出力の表示 |
| `workflowKeywordTriggerEnabled` | `true`\|`false` | 特定キーワードによるワークフロー自動トリガーの有効/無効 |
| `workflowSizeGuideline` | `unrestricted`\|`small`\|`medium`\|`large` | ワークフローの規模に関するガイドライン設定 |
| `workflows` | `true`\|`false` | ワークフロー機能全体の有効/無効 |
| `worktreeBaseRef` | `fresh`\|`head` | git worktree作成時のベース参照（新規か現在のHEADか） |

> 注: 一部の説明はキー名と選択肢から推測したものです。正確な仕様は公式ドキュメントも合わせてご確認ください。
