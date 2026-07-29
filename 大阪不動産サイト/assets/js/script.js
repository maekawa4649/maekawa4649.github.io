/* ==========================================================================
   大阪不動産ナビ サイト共通スクリプト
   - モバイルナビの開閉
   - お問い合わせフォームの入力チェック
   - 物件一覧の絞り込み
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initContactForm();
  initPropertyFilter();
});

/**
 * ヘッダーのハンバーガーメニュー開閉(スマホ表示用)
 */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".global-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // メニュー内のリンクをタップしたら閉じる(スマホでの誤操作防止)
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/**
 * お問い合わせフォームの簡易バリデーション。
 * バックエンドを持たないダミーサイトのため、送信時はページ遷移せず
 * 入力内容をチェックしたうえで完了メッセージを表示する。
 */
function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const successBox = document.querySelector("#form-success");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const requiredFields = form.querySelectorAll("[data-required]");
    let firstInvalid = null;

    requiredFields.forEach((field) => {
      const row = field.closest(".form-row");
      const value = field.value.trim();
      let isValid = value.length > 0;

      // メールアドレスは簡易フォーマットチェックも行う
      if (isValid && field.type === "email") {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      row.classList.toggle("has-error", !isValid);

      if (!isValid && !firstInvalid) {
        firstInvalid = field;
      }
    });

    if (firstInvalid) {
      successBox?.classList.remove("show");
      firstInvalid.focus();
      return;
    }

    // 実際の送信処理(API連携など)はバックエンド実装後に追加する想定
    form.reset();
    successBox?.classList.add("show");
    successBox?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/**
 * 物件一覧ページの絞り込み。
 * エリア/間取り/こだわり条件はチェックボックスの複数選択、賃料上限はプルダウン(単一選択)。
 * バックエンドを持たないため、各物件カードの data-* 属性を
 * JavaScript側で読み取りクライアントサイドで絞り込みを行う。
 * チェックボックス項目内の複数選択は「いずれかに一致(OR)」、項目をまたぐ場合は「すべてに一致(AND)」。
 * こだわり条件のみ、選んだ条件をすべて満たす物件だけを表示する(AND)。
 * 賃料上限は「選んだ金額以下」の物件だけを表示する。
 */
function initPropertyFilter() {
  const bar = document.querySelector("#filter-bar");
  if (!bar) return;

  const cards = Array.from(document.querySelectorAll(".property-grid .property-card"));
  const countEl = document.querySelector("#result-count");
  const areaEls = Array.from(document.querySelectorAll('input[name="area"]'));
  const madoriEls = Array.from(document.querySelectorAll('input[name="madori"]'));
  const featureEls = Array.from(document.querySelectorAll('input[name="feature"]'));
  const rentSelect = document.querySelector('select[name="rentmax"]');
  const allCheckboxes = [...areaEls, ...madoriEls, ...featureEls];

  // URLパラメータ(トップページの検索ボックスからの遷移)を初期値に反映
  const params = new URLSearchParams(window.location.search);
  function checkFromParam(paramName, elements) {
    params.getAll(paramName).forEach((value) => {
      const checkbox = elements.find((el) => el.value === value);
      if (checkbox) checkbox.checked = true;
    });
  }
  checkFromParam("area", areaEls);
  checkFromParam("madori", madoriEls);
  checkFromParam("feature", featureEls);

  if (rentSelect) {
    const rentParam = params.get("rentmax");
    if (rentParam && Array.from(rentSelect.options).some((opt) => opt.value === rentParam)) {
      rentSelect.value = rentParam;
    }
  }

  function checkedValues(elements) {
    return elements.filter((el) => el.checked).map((el) => el.value);
  }

  function applyFilter() {
    const activeAreas = checkedValues(areaEls);
    const activeMadoris = checkedValues(madoriEls);
    const activeFeatures = checkedValues(featureEls);
    const rentMax = rentSelect && rentSelect.value ? Number(rentSelect.value) : null;
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardFeatures = card.dataset.features ? card.dataset.features.split(",") : [];
      const matchesArea = activeAreas.length === 0 || activeAreas.includes(card.dataset.area);
      const matchesMadori = activeMadoris.length === 0 || activeMadoris.includes(card.dataset.madori);
      const matchesRent = rentMax === null || Number(card.dataset.rent) <= rentMax;
      const matchesFeatures = activeFeatures.every((f) => cardFeatures.includes(f));
      const isVisible = matchesArea && matchesMadori && matchesRent && matchesFeatures;

      card.style.display = isVisible ? "" : "none";
      if (isVisible) visibleCount += 1;
    });

    if (countEl) countEl.textContent = String(visibleCount);
  }

  bar.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  bar.querySelector("#f-reset")?.addEventListener("click", () => {
    allCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    if (rentSelect) rentSelect.value = "";
    applyFilter();
  });

  // チェックボックス/プルダウンは選んだ瞬間に絞り込みを反映する
  allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilter);
  });
  rentSelect?.addEventListener("change", applyFilter);

  applyFilter();
}
