/* ==========================================================================
   サイト生成スクリプト
   ------------------------------------------------------------------------
   bukken.json の物件データから、以下を自動生成します。
     - js/properties-data.js(物件一覧・チャットボット共通のデータ)
     - images/UMxxx.svg(物件ごとのダミー外観イラスト)
     - properties.html(物件一覧ページ)
     - property-UMxxx.html(物件詳細ページ、1件につき1ページ)
     - scripts/pickup-snippet.html / contact-options-snippet.html
       (index.html・contact.html は手動更新のため、参考スニペットのみ出力)

   使い方: bukken.json を編集したら、このファイルがあるフォルダの一つ上
   (大阪不動産サイト/)で次を実行してください。
     node scripts/generate-site.js

   物件の間取り・エリア・こだわり条件の種類を増やす場合は、
   下記の AREA_OPTIONS / MADORI_OPTIONS / FEATURE_OPTIONS も
   あわせて更新してください(物件一覧の絞り込みUIとチャットボットの
   条件選択パネルの両方がここを参照します)。
   ========================================================================== */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const bukken = JSON.parse(fs.readFileSync(path.join(ROOT, "bukken.json"), "utf8"));

function extractStation(access) {
  const m = access.match(/^([^\s]+駅)/);
  return m ? m[1] : access;
}
function extractNeighborhood(address) {
  const m = address.match(/大阪市北区([^0-9一二三四五六七八九十]+)/);
  return m ? m[1].trim() : "";
}

const RENT_BANDS = [
  { key: "0-80000", label: "〜8万円", min: 0, max: 80000 },
  { key: "80000-100000", label: "8万円〜10万円", min: 80000, max: 100000 },
  { key: "100000-130000", label: "10万円〜13万円", min: 100000, max: 130000 },
  { key: "130000-160000", label: "13万円〜16万円", min: 130000, max: 160000 },
  { key: "160000-999999999", label: "16万円〜", min: 160000, max: Infinity },
];

// 物件一覧の絞り込み・チャットボットの条件選択パネルの双方で使う共通の選択肢。
// ここを1箇所にまとめることで、両者の選択肢がずれるのを防ぐ。
const AREA_OPTIONS = ["梅田駅", "大阪駅", "中津駅"];
const MADORI_OPTIONS = ["1K", "1DK", "2DK", "1LDK", "2LDK", "3LDK"];
const FEATURE_OPTIONS = ["ペット可", "オートロック", "宅配ボックス", "浴室乾燥", "床暖房", "ネット無料"];

function getRentBand(rent) {
  const band = RENT_BANDS.find((b) => rent >= b.min && rent < b.max) || RENT_BANDS[RENT_BANDS.length - 1];
  return band.key;
}

const properties = bukken.properties.map((p) => {
  const station = extractStation(p.access);
  const neighborhood = extractNeighborhood(p.address);
  const areaKeywords = Array.from(new Set([station, station.replace("駅", ""), neighborhood].filter(Boolean)));
  const rentManYen = Math.round((p.rent / 1000)) / 10; // e.g. 118000 -> 11.8
  return {
    id: p.id,
    name: p.name,
    station,
    areaKeywords,
    neighborhood,
    address: p.address,
    access: p.access,
    rent: p.rent,
    rentBand: getRentBand(p.rent),
    maintenanceFee: p.maintenanceFee,
    rentManYen,
    layout: p.layout,
    areaSqm: p.areaSqm,
    age: p.age,
    features: p.features,
    description: p.description,
    url: `property-${p.id}.html`,
    image: `images/${p.id}.svg`,
  };
});

// ---------------------------------------------------------------------------
// 1. js/properties-data.js
// ---------------------------------------------------------------------------
const dataJs = `/* ==========================================================================
   物件データ(bukken.json由来のダミー賃貸物件情報)
   物件一覧・チャットボットの双方から参照する共通データです。
   ========================================================================== */

const RENT_BANDS = ${JSON.stringify(RENT_BANDS.map(({ key, label }) => ({ key, label })), null, 2)};
const AREA_OPTIONS = ${JSON.stringify(AREA_OPTIONS)};
const MADORI_OPTIONS = ${JSON.stringify(MADORI_OPTIONS)};
const FEATURE_OPTIONS = ${JSON.stringify(FEATURE_OPTIONS)};

const PROPERTIES = ${JSON.stringify(properties, null, 2)};
`;
fs.writeFileSync(path.join(ROOT, "js", "properties-data.js"), dataJs, "utf8");
console.log("wrote js/properties-data.js");

// ---------------------------------------------------------------------------
// 2. images/UMxxx.svg (ダミー建物イメージ)
// ---------------------------------------------------------------------------
const palette = [
  ["#7c93bd", "#c8d3e6", "#16294f", "#c99a68"],
  ["#8fa4c9", "#d3ddec", "#2a3f6b", "#f0e3cf"],
  ["#a3b6d6", "#e0e7f2", "#0c1a33", "#c99a68"],
  ["#889fc7", "#cfdaeb", "#16294f", "#e6d3b3"],
  ["#95a8cd", "#d8e1ee", "#2a3f6b", "#c99a68"],
  ["#7f96bf", "#cad5e8", "#0c1a33", "#f0e3cf"],
];

function buildingSvg(label, sub, colors) {
  const [sky1, sky2, building, accent] = colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${sky1}"/>
      <stop offset="100%" stop-color="${sky2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#sky)"/>
  <rect x="0" y="470" width="800" height="130" fill="#e7e0d1"/>
  <g fill="${building}">
    <rect x="120" y="230" width="160" height="240" rx="4"/>
    <rect x="300" y="150" width="200" height="320" rx="4"/>
    <rect x="520" y="270" width="150" height="200" rx="4"/>
  </g>
  <g fill="${accent}" opacity="0.85">
    <g>
      <rect x="140" y="250" width="22" height="22"/><rect x="178" y="250" width="22" height="22"/><rect x="216" y="250" width="22" height="22"/>
      <rect x="140" y="290" width="22" height="22"/><rect x="178" y="290" width="22" height="22"/><rect x="216" y="290" width="22" height="22"/>
      <rect x="140" y="330" width="22" height="22"/><rect x="178" y="330" width="22" height="22"/><rect x="216" y="330" width="22" height="22"/>
      <rect x="140" y="370" width="22" height="22"/><rect x="178" y="370" width="22" height="22"/><rect x="216" y="370" width="22" height="22"/>
    </g>
    <g>
      <rect x="320" y="170" width="24" height="24"/><rect x="364" y="170" width="24" height="24"/><rect x="408" y="170" width="24" height="24"/><rect x="452" y="170" width="24" height="24"/>
      <rect x="320" y="214" width="24" height="24"/><rect x="364" y="214" width="24" height="24"/><rect x="408" y="214" width="24" height="24"/><rect x="452" y="214" width="24" height="24"/>
      <rect x="320" y="258" width="24" height="24"/><rect x="364" y="258" width="24" height="24"/><rect x="408" y="258" width="24" height="24"/><rect x="452" y="258" width="24" height="24"/>
      <rect x="320" y="302" width="24" height="24"/><rect x="364" y="302" width="24" height="24"/><rect x="408" y="302" width="24" height="24"/><rect x="452" y="302" width="24" height="24"/>
      <rect x="320" y="346" width="24" height="24"/><rect x="364" y="346" width="24" height="24"/><rect x="408" y="346" width="24" height="24"/><rect x="452" y="346" width="24" height="24"/>
    </g>
    <g>
      <rect x="540" y="290" width="20" height="20"/><rect x="576" y="290" width="20" height="20"/><rect x="612" y="290" width="20" height="20"/>
      <rect x="540" y="326" width="20" height="20"/><rect x="576" y="326" width="20" height="20"/><rect x="612" y="326" width="20" height="20"/>
      <rect x="540" y="362" width="20" height="20"/><rect x="576" y="362" width="20" height="20"/><rect x="612" y="362" width="20" height="20"/>
    </g>
  </g>
  <text x="400" y="540" text-anchor="middle" font-family="'Noto Sans JP','Hiragino Sans',sans-serif" font-size="26" font-weight="700" fill="#16294f">${label}</text>
  <text x="400" y="570" text-anchor="middle" font-family="'Noto Sans JP','Hiragino Sans',sans-serif" font-size="16" fill="#6b6f76">${sub}</text>
</svg>
`;
}

properties.forEach((p, i) => {
  const colors = palette[i % palette.length];
  const svg = buildingSvg(p.name, "IMAGE SAMPLE", colors);
  fs.writeFileSync(path.join(ROOT, "images", `${p.id}.svg`), svg, "utf8");
});
console.log(`wrote ${properties.length} placeholder images`);

// ---------------------------------------------------------------------------
// 共通ヘッダー / フッター
// ---------------------------------------------------------------------------
function header(activeNav) {
  const navItem = (href, label) => {
    const current = activeNav === label ? ' aria-current="page"' : "";
    return `        <li><a href="${href}"${current}>${label}</a></li>`;
  };
  return `<header class="site-header">
  <div class="container">
    <a href="index.html" class="site-logo">
      <span class="logo-main">大阪不動産ナビ</span>
      <span class="logo-sub">運営者:田中一郎</span>
    </a>
    <nav class="global-nav" id="global-nav">
      <ul>
${navItem("index.html", "ホーム")}
${navItem("properties.html", "物件一覧")}
${navItem("about.html", "運営者について")}
${navItem("contact.html", "お問い合わせ")}
        <li><a href="https://lin.ee/xxxxxxx" class="nav-line-link" target="_blank" rel="noopener">LINEで相談</a></li>
      </ul>
    </nav>
    <div class="header-tel">
      <span>お電話でのお問い合わせ</span>
      <span class="tel-number">06-1234-5678</span>
      <a href="https://lin.ee/xxxxxxx" class="btn-line btn-line-sm" target="_blank" rel="noopener">LINEで相談</a>
    </div>
    <button class="nav-toggle" aria-label="メニューを開く" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>`;
}

const footer = `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-logo">大阪不動産ナビ</div>
        <p class="footer-desc">大阪市北区(梅田・大阪駅・中津エリア)の賃貸物件を中心にご紹介している、個人運営の不動産情報サイトです。宅地建物取引士の資格を持つ運営者本人が、直接お話をお伺いしながらお部屋探しをサポートします。</p>
      </div>
      <div>
        <h4>サイトメニュー</h4>
        <ul>
          <li><a href="index.html">ホーム</a></li>
          <li><a href="properties.html">物件一覧</a></li>
          <li><a href="about.html">運営者について</a></li>
          <li><a href="contact.html">お問い合わせ</a></li>
        </ul>
      </div>
      <div>
        <h4>取扱エリア</h4>
        <ul>
          <li>梅田駅エリア</li>
          <li>大阪駅エリア</li>
          <li>中津駅エリア</li>
          <li>大阪市北区一帯</li>
        </ul>
      </div>
      <div>
        <h4>運営者・連絡先</h4>
        <ul>
          <li>運営者:田中 一郎(宅地建物取引士)</li>
          <li>TEL: 06-1234-5678</li>
          <li><a href="https://lin.ee/xxxxxxx" target="_blank" rel="noopener">LINEで友だち追加</a></li>
          <li>活動エリア:大阪市北区(梅田・大阪駅・中津エリア中心)</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      &copy; 2026 大阪不動産ナビ 田中一郎(個人が運営するサイトです。掲載情報はサンプルです)
    </div>
  </div>
</footer>

<script src="js/properties-data.js"></script>
<script src="js/script.js"></script>
<script src="js/chatbot.js"></script>
</body>
</html>
`;

const yen = (n) => n.toLocaleString("ja-JP");

// ---------------------------------------------------------------------------
// 3. 物件一覧カード(properties.html用)
// ---------------------------------------------------------------------------
function propertyCard(p, badge) {
  const badgeHtml = badge ? `\n          <span class="badge">${badge}</span>` : "";
  return `      <a class="property-card" href="${p.url}" data-area="${p.station}" data-madori="${p.layout}" data-rent="${p.rent}" data-rent-band="${p.rentBand}" data-features="${p.features.join(",")}">
        <div class="thumb">${badgeHtml}
          <img src="${p.image}" alt="${p.name} 外観イメージ">
        </div>
        <div class="body">
          <div class="area">${p.address} / ${p.access}</div>
          <h3>${p.name}</h3>
          <div class="price">${p.rentManYen}<span>万円/月</span></div>
          <div class="meta">
            <span>${p.layout}</span>
            <span>${p.areaSqm}㎡</span>
            <span>${p.age}</span>
          </div>
        </div>
      </a>`;
}

const cardsHtml = properties.map((p) => propertyCard(p, null)).join("\n\n");

const propertiesHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>物件一覧 | 大阪不動産ナビ</title>
<meta name="description" content="大阪市北区(梅田・大阪駅・中津エリア)の賃貸物件一覧。エリア・間取り・賃料・こだわり条件から絞り込んで、理想のお部屋を探せます。">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

${header("物件一覧")}

<div class="breadcrumb">
  <div class="container">
    <a href="index.html">ホーム</a> &gt; <span class="current">物件一覧</span>
  </div>
</div>

<section class="section" style="padding-top:48px;">
  <div class="container">
    <div class="section-head" style="margin-bottom:32px;">
      <span class="eyebrow">PROPERTIES</span>
      <h2>物件一覧</h2>
      <p>大阪市北区(梅田・大阪駅・中津エリア)の賃貸物件を掲載しています。条件を選んで絞り込みできます。</p>
    </div>

    <form class="filter-bar" id="filter-bar">
      <div class="filter-group">
        <span class="filter-group-title">エリア(最寄り駅)</span>
        <div class="filter-checks">
${AREA_OPTIONS.map((v) => `          <label><input type="checkbox" name="area" value="${v}">${v}</label>`).join("\n")}
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-group-title">間取り</span>
        <div class="filter-checks">
${MADORI_OPTIONS.map((v) => `          <label><input type="checkbox" name="madori" value="${v}">${v}</label>`).join("\n")}
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-group-title">賃料</span>
        <div class="filter-checks">
${RENT_BANDS.map((b) => `          <label><input type="checkbox" name="rentband" value="${b.key}">${b.label}</label>`).join("\n")}
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-group-title">こだわり条件</span>
        <div class="filter-checks">
${FEATURE_OPTIONS.map((v) => `          <label><input type="checkbox" name="feature" value="${v}">${v}</label>`).join("\n")}
        </div>
      </div>
      <div class="filter-actions">
        <button type="button" id="f-reset" class="btn btn-outline" style="color:#16294f; border-color:#16294f;">条件をリセット</button>
      </div>
    </form>

    <p class="result-count"><strong id="result-count">${properties.length}</strong> 件の物件が見つかりました</p>

    <div class="property-grid">
${cardsHtml}
    </div>
  </div>
</section>

<section class="cta-band">
  <div class="container">
    <h2>ご希望の条件に合う物件が見つからない場合も</h2>
    <p>非公開物件のご紹介も可能です。お気軽にご相談ください。</p>
    <div class="hero-actions" style="justify-content:center;">
      <a href="contact.html" class="btn btn-outline">お問い合わせフォームへ</a>
      <a href="https://lin.ee/xxxxxxx" class="btn btn-line" target="_blank" rel="noopener">LINEで友だち追加</a>
    </div>
  </div>
</section>

${footer}`;

fs.writeFileSync(path.join(ROOT, "properties.html"), propertiesHtml, "utf8");
console.log("wrote properties.html");

// ---------------------------------------------------------------------------
// 4. 物件詳細ページ(property-UMxxx.html) x15
// ---------------------------------------------------------------------------
function relatedCards(current) {
  const others = properties.filter((p) => p.id !== current.id);
  // 同じ最寄り駅を優先しつつ3件選ぶ
  const sameStation = others.filter((p) => p.station === current.station);
  const rest = others.filter((p) => p.station !== current.station);
  const picks = [...sameStation, ...rest].slice(0, 3);
  return picks.map((p) => `      <a class="property-card" href="${p.url}">
        <div class="thumb"><img src="${p.image}" alt="${p.name} 外観イメージ"></div>
        <div class="body">
          <div class="area">${p.address} / ${p.access}</div>
          <h3>${p.name}</h3>
          <div class="price">${p.rentManYen}<span>万円/月</span></div>
          <div class="meta"><span>${p.layout}</span><span>${p.areaSqm}㎡</span><span>${p.age}</span></div>
        </div>
      </a>`).join("\n");
}

function detailPage(p) {
  const featureBadges = p.features.map((f) => `<span class="feature-tag">${f}</span>`).join("");
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${p.name} | 大阪不動産ナビ</title>
<meta name="description" content="${p.address}、${p.access}の賃貸物件。${p.layout}・${p.areaSqm}㎡・賃料${p.rentManYen}万円/月。">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

${header("物件一覧")}

<div class="breadcrumb">
  <div class="container">
    <a href="index.html">ホーム</a> &gt; <a href="properties.html">物件一覧</a> &gt; <span class="current">${p.name}</span>
  </div>
</div>

<div class="detail-header">
  <div class="container">
    <div class="area">${p.address} / ${p.access}</div>
    <h1>${p.name}</h1>
  </div>
</div>

<div class="container">
  <div class="detail-gallery">
    <div class="main-photo">
      <img src="${p.image}" alt="${p.name} 外観イメージ">
    </div>
    <div class="sub-photos">
      <div><img src="images/room-a.svg" alt="リビングルームのイメージ"></div>
      <div><img src="images/room-b.svg" alt="キッチンのイメージ"></div>
    </div>
  </div>

  <div class="detail-layout">
    <div class="detail-main">
      <table class="spec-table">
        <tr><th>賃料</th><td>${yen(p.rent)}円/月</td></tr>
        <tr><th>管理費</th><td>${yen(p.maintenanceFee)}円/月</td></tr>
        <tr><th>所在地</th><td>${p.address}(住所非公開)</td></tr>
        <tr><th>アクセス</th><td>${p.access}</td></tr>
        <tr><th>間取り</th><td>${p.layout}</td></tr>
        <tr><th>専有面積</th><td>${p.areaSqm}㎡</td></tr>
        <tr><th>築年数</th><td>${p.age}</td></tr>
        <tr><th>契約形態</th><td>普通建物賃貸借</td></tr>
        <tr><th>敷金・礼金</th><td>要相談(サンプル)</td></tr>
        <tr><th>こだわり条件</th><td><div class="feature-tags">${featureBadges}</div></td></tr>
        <tr><th>備考</th><td>本物件情報はサイト構成確認用のサンプルデータです。</td></tr>
      </table>

      <div class="detail-desc">
        <h2>物件の特徴</h2>
        <p>${p.description}</p>
      </div>
    </div>

    <aside class="detail-side">
      <div class="price-box">
        <div class="price">${p.rentManYen}万円<span style="font-size:1rem; font-weight:400;">/月</span></div>
        <div class="price-note">管理費 ${yen(p.maintenanceFee)}円/月は別途必要です</div>
        <a href="contact.html" class="btn btn-primary btn-block">この物件の内見を申し込む</a>
        <a href="tel:0612345678" class="btn btn-navy btn-block">電話で問い合わせる(06-1234-5678)</a>
      </div>
    </aside>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">RELATED</span>
      <h2>その他のおすすめ物件</h2>
    </div>
    <div class="property-grid">
${relatedCards(p)}
    </div>
  </div>
</section>

${footer}`;
}

properties.forEach((p) => {
  fs.writeFileSync(path.join(ROOT, `property-${p.id}.html`), detailPage(p), "utf8");
});
console.log(`wrote ${properties.length} detail pages`);

// ---------------------------------------------------------------------------
// 5. index.html pickup 用スニペット & contact.html select 用スニペット出力
// ---------------------------------------------------------------------------
const pickupIds = ["UM012", "UM003", "UM001"]; // タワー / ペット可 / 定番1LDK
const pickupHtml = pickupIds
  .map((id, i) => {
    const p = properties.find((x) => x.id === id);
    const badges = ["新着", "ペット可", "おすすめ"];
    return propertyCard(p, badges[i]);
  })
  .join("\n\n");

fs.writeFileSync(path.join(__dirname, "pickup-snippet.html"), pickupHtml, "utf8");
console.log("wrote scripts/pickup-snippet.html (index.htmlのおすすめ物件へ手動組み込み用・任意)");

const optionsHtml = properties
  .map((p) => `            <option value="${p.name}">${p.name}</option>`)
  .join("\n");
fs.writeFileSync(path.join(__dirname, "contact-options-snippet.html"), optionsHtml, "utf8");
console.log("wrote scripts/contact-options-snippet.html (contact.htmlのお問い合わせ物件セレクトへ手動組み込み用)");

console.log("\n--- 完了 ---");
