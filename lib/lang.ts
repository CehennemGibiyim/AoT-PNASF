// AoT-PNASF — Dil Sistemi v2
// settings.js ile entegre — 9 dil destekli

// Sayfa yüklenince localStorage'dan dili oku ve uygula
document.addEventListener('DOMContentLoaded', () => {
  const lang = localStorage.getItem('aot-lang') || 'tr';
  _applyLang(lang);
});

// Tüm sayfalarda çalışan merkezi dil uygulama fonksiyonu
function _applyLang(lang) {
  // 1. data-tr / data-en / data-ru / data-de / data-fr vb. elementler
  document.querySelectorAll('[data-tr]').forEach(el => {
    const val = el.dataset[lang] || el.dataset.en || el.dataset.tr;
    if (val) el.textContent = val;
  });

  // 2. Placeholder'lar (data-ph-tr, data-ph-en vb.)
  document.querySelectorAll('[data-ph-tr]').forEach(el => {
    const key = 'ph' + lang.charAt(0).toUpperCase() + lang.slice(1);
    el.placeholder = el.dataset[key] || el.dataset.phEn || el.dataset.phTr || '';
  });

  // 3. Select option'ları (data-tr attribute'u olan)
  document.querySelectorAll('select option[data-tr]').forEach(el => {
    const val = el.dataset[lang] || el.dataset.en || el.dataset.tr;
    if (val) el.textContent = val;
  });

  // 4. Navbar settings göstergesi
  const indicator = document.getElementById('settingsLangIndicator');
  if (indicator) {
    const flags = {tr:'🇹🇷',en:'🇬🇧',ru:'🇷🇺',de:'🇩🇪',fr:'🇫🇷',pl:'🇵🇱',pt:'🇵🇹',es:'🇪🇸',kr:'🇰🇷',it:'🇮🇹',ja:'🇯🇵',zh:'🇨🇳',id:'🇮🇩',ar:'🇸🇦'};
    indicator.textContent = (flags[lang] || '🌐') + ' ' + lang.toUpperCase();
  }

  // 5. Eski langLabel (geriye uyumluluk)
  const ll = document.getElementById('langLabel');
  if (ll) ll.textContent = lang.toUpperCase();

  // 6. html lang attribute
  const htmlLangs = { kr: 'ko', zh: 'zh-Hans' };
  document.documentElement.lang = htmlLangs[lang] || lang;

  // 7. Settings panel butonlarını güncelle
  document.querySelectorAll('.lang-opt').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
}

// settings.js ve settings-panel.js tarafından çağrılır
function applyLang(lang) {
  localStorage.setItem('aot-lang', lang);
  _applyLang(lang);
}

// Eski toggleLang geriye uyumluluk
function toggleLang() {
  const current = localStorage.getItem('aot-lang') || 'tr';
  const next = current === 'tr' ? 'en' : 'tr';
  applyLang(next);
}

// --- Modül dönüşümü: üst düzey semboller window üzerinden paylaşılır ---
declare global {
  var _applyLang: any;
  var applyLang: any;
  var toggleLang: any;
}

let _applyLang_windowOverride: any;
let applyLang_windowOverride: any;
let toggleLang_windowOverride: any;

Object.defineProperty(window, '_applyLang', {
  get: () => (_applyLang_windowOverride !== undefined ? _applyLang_windowOverride : _applyLang),
  set: (value) => { _applyLang_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'applyLang', {
  get: () => (applyLang_windowOverride !== undefined ? applyLang_windowOverride : applyLang),
  set: (value) => { applyLang_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'toggleLang', {
  get: () => (toggleLang_windowOverride !== undefined ? toggleLang_windowOverride : toggleLang),
  set: (value) => { toggleLang_windowOverride = value; },
  configurable: true, enumerable: true });

export {};
