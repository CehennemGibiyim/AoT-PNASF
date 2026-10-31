/* AoT-PNASF — Çoklu dil eşya adı yükleyicisi.
 *
 * locales/items-<lang>.json dosyalarını (scripts/build-item-locales.cjs üretilir)
 * seçili dil için yükler ve eşya adlarını o dile çevirir.
 *
 * Kullanım:
 *   await AOTItemLocales.load('de');          // Almanca paketini yükle
 *   AOTItemLocales.apply(window.AO_ITEMS);    // AO_ITEMS.tr alanlarını güncelle
 *   AOTItemLocales.getName('T6_BAG', null);   // "T6_BAG" için yerel ad
 */
(() => {
  'use strict';

  // Desteğe alınan site dil kodları (tr hariç — Türkçe veri zaten AO_ITEMS içinde)
  const LANG_CODES = ['en', 'ru', 'de', 'fr', 'pl', 'pt', 'es', 'kr', 'it', 'ja', 'zh', 'id', 'ar'];
  const packs = Object.create(null);
  let names = null;
  let activeLang = 'tr';

  // Sayfa kökünü script src'sinden türet (index.html ve pages/ altından da çalışır)
  const rootUrl = (() => {
    const script = document.currentScript;
    if (script && script.src) return new URL('../', script.src);
    return new URL('./', window.location.href);
  })();

  async function fetchPack(lang) {
    if (packs[lang]) return packs[lang];
    const url = new URL(`locales/items-${lang}.json`, rootUrl);
    const response = await fetch(url.toString(), { cache: 'force-cache' });
    if (!response.ok) throw new Error(`Dil paketi HTTP ${response.status}: ${url.pathname}`);
    const data = await response.json();
    if (!data || typeof data !== 'object') throw new Error('Dil paketi bozuk');
    packs[lang] = data;
    return data;
  }

  async function load(lang) {
    const code = LANG_CODES.includes(lang) ? lang : 'tr';
    activeLang = code;
    if (code === 'tr') {
      names = null;
      return true;
    }
    names = await fetchPack(code);
    return true;
  }

  function getName(itemId, fallback) {
    if (!names || !itemId) return fallback === undefined ? itemId : fallback;
    const base = String(itemId).replace(/@\d+$/, '');
    const found = names[base] || names[itemId] || names[base.replace(/^T\d+_/, '')];
    if (found) return found;
    return fallback === undefined ? itemId : fallback;
  }

  // AO_ITEMS üzerindeki Türkçe adları seçili dilin adlarıyla değiştirir.
  // Orijinal Türkçe değer korunur (aot-lang 'tr' olursa geri alınır).
  function apply(items) {
    if (!Array.isArray(items)) return 0;
    let updated = 0;
    for (const item of items) {
      if (!item || !item.id) continue;
      if (Object.prototype.hasOwnProperty.call(item, '__trOriginal') === false) {
        item.__trOriginal = item.tr;
      }
      const localized = activeLang === 'tr' ? item.__trOriginal : getName(item.id, null);
      const next = localized || item.__trOriginal;
      if (next !== undefined && item.tr !== next) {
        item.tr = next;
        updated++;
      }
    }
    return updated;
  }

  // Dil değişince çağrılır: paketi yükle, uygula, dinleyicilere haber ver.
  async function setLang(lang) {
    await load(lang);
    const updated = apply(window.AO_ITEMS);
    window.dispatchEvent(new CustomEvent('item_lang_changed', { detail: { lang: activeLang, updated } }));
    return updated;
  }

  window.AOTItemLocales = {
    LANG_CODES,
    load,
    setLang,
    getName,
    apply,
    get lang() { return activeLang; },
    get ready() { return activeLang === 'tr' || Boolean(names); }
  };
  window.aotItemName = (itemId, fallback) => getName(itemId, fallback);

  // Paket hazır olur olmaz AO_ITEMS'e uygula (öğe verisi geç yüklense de)
  function applyIfReady() {
    if (!Array.isArray(window.AO_ITEMS)) return 0;
    return apply(window.AO_ITEMS);
  }
  window.addEventListener('items_data_loaded', () => {
    if (activeLang === 'tr') return;
    applyIfReady();
  });

  // Sayfa açılışında seçili dili hazırla
  const initialLang = localStorage.getItem('aot-lang') || 'tr';
  if (LANG_CODES.includes(initialLang)) {
    load(initialLang)
      .then(() => applyIfReady())
      .catch((error) => console.warn('Eşya dil paketi yüklenemedi:', error.message));
  }
})();
