/* AoT-PNASF — Yerel i18n Motoru v1
 *
 * Eski sistem `window.miniappI18n` adlı harici bir SDK'ya bağlıydı ve GitHub
 * Pages'de hiç yüklenmediği için dil seçimi hiçbir işe yaramıyordu.
 * Bu modül tamamen yereldir: locales/ui-i18n.json sözlüğünü yükler,
 * data-i18n / data-i18n-ph özniteliklerini uygular, window.t() sağlar,
 * dinamik (JS ile eklenen) içerikleri MutationObserver ile yakalar,
 * eşya adlarını AOTItemLocales üzerinden seçili dile çevirir.
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'aot-lang';
  const SUPPORTED = ['tr', 'en', 'ru', 'de', 'fr', 'pl', 'pt', 'es', 'kr', 'it', 'ja', 'zh', 'id', 'ar'];
  const HTML_LANG = { kr: 'ko', zh: 'zh-Hans', id: 'id', ar: 'ar' };
  const RTL_LANGS = ['ar'];

  let dictionary = {};   // { key: { tr:'..', en:'..', ... } }
  let currentLang = 'tr';
  let readyPromise = null;
  let observer = null;

  function normalize(lang) {
    const code = String(lang || '').toLowerCase().split('-')[0];
    return SUPPORTED.includes(code) ? code : 'tr';
  }

  function readStored() {
    try { return normalize(localStorage.getItem(STORAGE_KEY) || 'tr'); } catch (_) { return 'tr'; }
  }

  // ─── Sözlük yükleme ────────────────────────────────────────
  async function loadDictionary() {
    if (Object.keys(dictionary).length) return dictionary;
    try {
      const response = await fetch('locales/ui-i18n.json', { cache: 'force-cache' });
      if (response.ok) dictionary = await response.json();
    } catch (_) { /* sözlük yoksa sadece fallback çalışır */ }
    return dictionary;
  }

  // ─── Çeviri arama ──────────────────────────────────────────
  function translate(key, fallback) {
    const entry = dictionary[key];
    if (entry) {
      const value = entry[currentLang] || entry.en || entry.tr;
      if (typeof value === 'string' && value) return value;
    }
    return fallback === undefined ? key : fallback;
  }

  // ─── Statik DOM uygulama ───────────────────────────────────
  function applyToElement(el) {
    if (el.nodeType !== 1) return;
    // 1) data-i18n → sözlük anahtarı
    if (el.hasAttribute && el.hasAttribute('data-i18n')) {
      const key = el.getAttribute('data-i18n');
      const value = translate(key, null);
      if (value !== null) el.textContent = value;
    }
    // 2) data-i18n-ph → placeholder
    if (el.hasAttribute && el.hasAttribute('data-i18n-ph')) {
      const value = translate(el.getAttribute('data-i18n-ph'), null);
      if (value !== null && 'placeholder' in el) el.placeholder = value;
    }
    // 3) data-i18n-title → title
    if (el.hasAttribute && el.hasAttribute('data-i18n-title')) {
      const value = translate(el.getAttribute('data-i18n-title'), null);
      if (value !== null) el.setAttribute('title', value);
    }
    // 4) Eski çok-dilli öznitelikler: data-tr / data-en / data-ru ... (sayfalar için)
    const legacy = el.attributes;
    if (legacy) {
      for (let i = 0; i < legacy.length; i++) {
        const attr = legacy[i];
        if (!/^data-(tr|en|ru|de|fr|pl|pt|es|kr|it|ja|zh|id|ar)$/.test(attr.name)) continue;
        const wanted = attr.name.slice(5);
        if (wanted === currentLang && attr.value) { el.textContent = attr.value; break; }
      }
      // fallback: seçili dil yoksa en → tr
      if (!el.textContentMatches) {
        /* no-op: sadece okunabilirlik */
      }
    }
  }

  function apply(root) {
    const scope = root || document;
    if (!scope) return;
    if (scope.querySelectorAll) {
      scope.querySelectorAll('[data-i18n],[data-i18n-ph],[data-i18n-title],[data-tr]').forEach(applyToElement);
    }
    if (scope.matches && scope.matches('[data-i18n],[data-i18n-ph],[data-i18n-title],[data-tr]')) {
      applyToElement(scope);
    }
    // html lang
    document.documentElement.lang = HTML_LANG[currentLang] || currentLang;
    // RTL diller (Arapça) için yön
    if (RTL_LANGS.includes(currentLang)) document.documentElement.setAttribute('dir', 'rtl');
    else document.documentElement.removeAttribute('dir');
  }

  // ─── Dinamik içerik yakalama ───────────────────────────────
  function startObserver() {
    if (observer || typeof MutationObserver === 'undefined') return;
    observer = new MutationObserver((mutations) => {
      let needsPass = false;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) { needsPass = true; break; }
        }
        if (needsPass) break;
      }
      if (needsPass) apply(document);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  // ─── Dışa açılan API ───────────────────────────────────────
  async function init() {
    currentLang = readStored();
    await loadDictionary();
    apply(document);
    startObserver();
    return currentLang;
  }

  async function setLang(lang) {
    const next = normalize(lang);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (_) { /* private mode */ }
    currentLang = next;
    await loadDictionary();
    apply(document);

    // Eşya adlarını seçili dile geçir (locales/items-<lang>.json)
    try {
      if (window.AOTItemLocales && typeof window.AOTItemLocales.setLang === 'function') {
        await window.AOTItemLocales.setLang(next);
      }
    } catch (_) { /* eşya dil paketi yoksa Türkçe kalır */ }

    // Modüller yeniden çizilsin diye olay yay
    window.dispatchEvent(new CustomEvent('aot:langchange', { detail: { lang: next } }));
    window.dispatchEvent(new CustomEvent('app_settings_updated'));

    // Dinamik olarak çizilmiş Türkçe içeriklerin tamamını yenilemek için
    // sayfayı yeniden yükleyelim (önbellekten hızlıdır).
    setTimeout(() => { window.location.reload(); }, 250);
    return next;
  }

  // window.t / window._ — tüm modüller bu ikisini kullanır
  window.t = function (key, fallback) { return translate(key, fallback); };
  window._ = function (key, fallback) { return translate(key, fallback); };
  window.i18nHTML = function (htmlString) {
    const temp = document.createElement('div');
    temp.innerHTML = htmlString;
    apply(temp);
    return temp.innerHTML;
  };

  window.AOTi18n = {
    SUPPORTED,
    init,
    setLang,
    apply,
    translate,
    get lang() { return currentLang; },
    get ready() { return readyPromise; }
  };

  // Uygulama başlatma
  readyPromise = init();
  // Body henüz yoksa DOMContentLoaded'da tekrar uygula
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => apply(document));
  }
})();

export {};
