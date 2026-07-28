/* ==========================================================================
   物件おすすめチャットウィジェット
   ------------------------------------------------------------------------
   ※ これは外部AI APIを使わない「ルールベース」の簡易チャットです。
     - フリーテキスト入力は、文中のキーワードを抽出して絞り込みます。
     - 「条件で探す」パネルは、物件一覧ページと同じチェックボックスで
       条件を選び、選んだ内容をそのまま(あいまい判定なしで)反映します。
     js/properties-data.js の PROPERTIES / RENT_BANDS / AREA_OPTIONS /
     MADORI_OPTIONS / FEATURE_OPTIONS を、このファイルより先に読み込んでいる
     前提です。
   ========================================================================== */

const QUICK_REPLIES = [
  "賃料10万円以下",
  "梅田駅で探す",
  "ペット可の物件",
  "とりあえずおすすめを見る",
];

// フリーテキスト解析用(条件パネルより広めに、駅名以外の町名も拾う)
const AREA_KEYWORDS = ["梅田", "大阪駅", "中津", "茶屋町", "堂島", "豊崎", "芝田", "角田町", "堂山町", "鶴野町", "曽根崎"];
const FEATURE_KEYWORDS = [
  "ペット可",
  "オートロック",
  "宅配ボックス",
  "浴室乾燥",
  "床暖房",
  "ネット無料",
  "タワマン",
  "エレベーター",
  "独立洗面台",
  "IHコンロ",
  "追い焚き",
];

document.addEventListener("DOMContentLoaded", initChatWidget);

function initChatWidget() {
  if (typeof PROPERTIES === "undefined") return;

  const widget = buildWidgetDom();
  document.body.appendChild(widget);

  const toggle = widget.querySelector(".chat-toggle");
  const panel = widget.querySelector(".chat-panel");
  const closeBtn = widget.querySelector(".chat-close");
  const condToggle = widget.querySelector(".chat-cond-toggle");
  const condPanel = widget.querySelector(".chat-conditions");
  const condSubmit = widget.querySelector(".chat-cond-submit");
  const condReset = widget.querySelector(".chat-cond-reset");
  const form = widget.querySelector(".chat-input-form");
  const input = widget.querySelector("#chat-input");
  const quickWrap = widget.querySelector(".chat-quick-replies");
  const messages = widget.querySelector(".chat-messages");

  let greeted = false;

  function openPanel() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    if (!greeted) {
      greeted = true;
      appendMessage(
        messages,
        "bot",
        "こんにちは!梅田・大阪駅・中津エリアの賃貸物件探しをお手伝いする簡易チャットです。\n上の「条件で探す」から選ぶか、エリア・賃料・間取り・こだわり条件などを文章で教えてください。\n例:「梅田 1LDK 12万円以下 ペット可」"
      );
    }
    input.focus();
  }

  function closePanel() {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    if (panel.hidden) openPanel();
    else closePanel();
  });
  closeBtn.addEventListener("click", closePanel);

  // 「条件で探す」パネルの開閉
  condToggle.addEventListener("click", () => {
    const isOpen = !condPanel.hidden;
    condPanel.hidden = isOpen;
    condToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  condReset.addEventListener("click", () => {
    condPanel.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.checked = false;
    });
  });

  // 「この条件でおすすめを見る」:パネルで選んだ条件をそのまま検索に反映する
  condSubmit.addEventListener("click", () => {
    const conditions = readConditions(condPanel);
    const summary = describeConditions(conditions);
    appendMessage(messages, "user", summary ? `条件で探す: ${summary}` : "条件で探す(条件なし)");

    const matches = findMatchesByConditions(conditions);
    if (matches.length === 0) {
      appendMessage(
        messages,
        "bot",
        "選んだ条件に合う物件が見つかりませんでした。条件の数を減らすと見つかりやすくなります。"
      );
    } else {
      appendMessage(messages, "bot", `選んだ条件に合う物件が${matches.length}件見つかりました。`);
      appendPropertyCards(messages, matches.slice(0, 3));
    }
    condPanel.hidden = true;
    condToggle.setAttribute("aria-expanded", "false");
  });

  quickWrap.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      handleUserMessage(messages, btn.textContent);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    handleUserMessage(messages, text);
    input.value = "";
  });
}

function buildWidgetDom() {
  const wrap = document.createElement("div");
  wrap.className = "chat-widget";
  wrap.innerHTML = `
    <button type="button" class="chat-toggle" aria-expanded="false" aria-controls="chat-panel">
      💬 <span class="label">物件を相談する</span>
    </button>
    <div class="chat-panel" id="chat-panel" hidden>
      <div class="chat-header">
        <div>
          <h3>物件おすすめチャット</h3>
          <p>キーワードから自動でおすすめする簡易チャットです</p>
        </div>
        <div class="chat-header-actions">
          <button type="button" class="chat-cond-toggle" aria-expanded="false">条件で探す</button>
          <button type="button" class="chat-close" aria-label="チャットを閉じる">&times;</button>
        </div>
      </div>
      <div class="chat-conditions" hidden>
        ${buildConditionGroup("エリア", "area", AREA_OPTIONS)}
        ${buildConditionGroup("間取り", "madori", MADORI_OPTIONS)}
        ${buildConditionGroup("賃料", "rentband", RENT_BANDS.map((b) => b.key), RENT_BANDS.map((b) => b.label))}
        ${buildConditionGroup("こだわり条件", "feature", FEATURE_OPTIONS)}
        <div class="chat-cond-actions">
          <button type="button" class="chat-cond-reset">リセット</button>
          <button type="button" class="chat-cond-submit btn btn-navy">この条件でおすすめを見る</button>
        </div>
      </div>
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-quick-replies">
        ${QUICK_REPLIES.map((q) => `<button type="button">${q}</button>`).join("")}
      </div>
      <form class="chat-input-form">
        <input type="text" id="chat-input" placeholder="例:梅田 1LDK 12万円以下" autocomplete="off">
        <button type="submit">送信</button>
      </form>
      <p class="chat-disclaimer">※ ルールベースの自動応答です。掲載物件情報はサンプルです。</p>
    </div>
  `;
  return wrap;
}

function buildConditionGroup(title, name, values, labels) {
  const items = values
    .map((v, i) => `<label><input type="checkbox" data-cond="${name}" value="${v}">${labels ? labels[i] : v}</label>`)
    .join("");
  return `<div class="chat-cond-group">
    <span class="chat-cond-title">${title}</span>
    <div class="chat-cond-checks">${items}</div>
  </div>`;
}

/** 条件パネルのチェック状態を { area: [], madori: [], rentband: [], feature: [] } の形で取得する */
function readConditions(condPanel) {
  const result = { area: [], madori: [], rentband: [], feature: [] };
  condPanel.querySelectorAll('input[type="checkbox"]:checked').forEach((cb) => {
    const key = cb.dataset.cond;
    if (result[key]) result[key].push(cb.value);
  });
  return result;
}

/** 選択した条件を「梅田駅 / 1LDK / 8万円〜10万円 / ペット可」のような読める文字列にする */
function describeConditions(conditions) {
  const rentLabels = conditions.rentband.map((key) => {
    const band = RENT_BANDS.find((b) => b.key === key);
    return band ? band.label : key;
  });
  return [...conditions.area, ...conditions.madori, ...rentLabels, ...conditions.feature].join(" / ");
}

/** 条件パネルで選ばれた値をそのまま(あいまい判定なしで)物件データに照合する */
function findMatchesByConditions(conditions) {
  return PROPERTIES.filter((p) => {
    if (conditions.area.length > 0 && !conditions.area.includes(p.station)) return false;
    if (conditions.madori.length > 0 && !conditions.madori.includes(p.layout)) return false;
    if (conditions.rentband.length > 0 && !conditions.rentband.includes(p.rentBand)) return false;
    if (conditions.feature.length > 0 && !conditions.feature.every((f) => p.features.includes(f))) return false;
    return true;
  });
}

function handleUserMessage(messages, text) {
  appendMessage(messages, "user", text);

  if (/line|ライン/i.test(text)) {
    appendMessage(messages, "bot", "LINEでのご相談も歓迎です。下のボタンからお気軽にどうぞ。");
    appendLineButton(messages);
    return;
  }
  if (/電話|でんわ|tel/i.test(text)) {
    appendMessage(messages, "bot", "お電話でのお問い合わせは 06-1234-5678(受付 9:00〜18:00、水曜定休)までどうぞ。");
    return;
  }
  if (/こんにちは|はじめまして|よろしく|hello/i.test(text)) {
    appendMessage(
      messages,
      "bot",
      "こんにちは!エリアや賃料、間取り、こだわり条件を教えていただくとおすすめ物件を絞り込めます。\n「条件で探す」から選んでいただくこともできます。"
    );
    return;
  }

  const filters = parseQuery(text);
  const hasFilter = Object.keys(filters).length > 0;

  if (!hasFilter) {
    appendMessage(
      messages,
      "bot",
      "条件をうまく読み取れなかったので、まずは人気の物件を3件ご紹介しますね。\n「条件で探す」から選んでいただくと、確実に絞り込めます。"
    );
    appendPropertyCards(messages, PROPERTIES.slice(0, 3));
    return;
  }

  const matches = findMatches(filters);
  if (matches.length === 0) {
    appendMessage(
      messages,
      "bot",
      "ご希望に近い条件の物件が見つかりませんでした。賃料を上げる・こだわり条件を減らすなど条件を変えて、もう一度お試しください。"
    );
    return;
  }

  appendMessage(messages, "bot", `ご希望に近い物件が${matches.length}件見つかりました。`);
  appendPropertyCards(messages, matches.slice(0, 3));
}

/**
 * 入力テキストからエリア・間取り・賃料上限・こだわり条件のキーワードを抽出する。
 * 高度な自然言語理解ではなく、単純な部分一致・正規表現によるルールベース処理。
 */
function parseQuery(text) {
  const filters = {};

  const foundArea = AREA_KEYWORDS.find((k) => text.includes(k));
  if (foundArea) filters.area = foundArea;

  const madoriMatch = text.match(/([1-4])\s*(LDK|DK|K)/i);
  if (madoriMatch) filters.madori = `${madoriMatch[1]}${madoriMatch[2].toUpperCase()}`;

  const priceMatch = text.match(/([0-9,]+)\s*万/);
  if (priceMatch) filters.maxRent = Number(priceMatch[1].replace(/,/g, "")) * 10000;

  const foundFeatures = FEATURE_KEYWORDS.filter((f) => text.includes(f));
  if (foundFeatures.length > 0) filters.features = foundFeatures;

  return filters;
}

function findMatches(filters) {
  return PROPERTIES.filter((p) => {
    if (filters.area && !p.areaKeywords.some((tag) => tag.includes(filters.area) || filters.area.includes(tag))) {
      return false;
    }
    if (filters.madori && p.layout !== filters.madori) return false;
    if (filters.maxRent && p.rent > filters.maxRent) return false;
    if (filters.features && !filters.features.every((f) => p.features.includes(f))) return false;
    return true;
  });
}

function appendMessage(messages, sender, text) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

function appendPropertyCards(messages, list) {
  list.forEach((p) => {
    const card = document.createElement("div");
    card.className = "chat-property-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name} 外観イメージ">
      <div class="body">
        <h4>${p.name}</h4>
        <div class="price">${p.rentManYen}万円/月</div>
        <div class="meta">${p.layout} / ${p.areaSqm}㎡ / ${p.access}</div>
        <a class="btn btn-navy" href="${p.url}">詳細を見る</a>
      </div>
    `;
    messages.appendChild(card);
  });
  messages.scrollTop = messages.scrollHeight;
}

function appendLineButton(messages) {
  const wrap = document.createElement("div");
  wrap.className = "chat-bubble bot";
  wrap.innerHTML = `<a href="https://lin.ee/xxxxxxx" target="_blank" rel="noopener" class="btn btn-line btn-line-sm">LINEで友だち追加</a>`;
  messages.appendChild(wrap);
  messages.scrollTop = messages.scrollHeight;
}
