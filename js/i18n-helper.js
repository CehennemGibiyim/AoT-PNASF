// i18n Helper - Otomatik Çeviri Sistemi
// Bu dosya tüm .js dosyalarında kullanılabilir

// Çeviri fonksiyonu - kısa kullanım: _('key')
window._ = function(key, fallback) {
  if (window.miniappI18n) return window.miniappI18n.t(key);
  return fallback || `[${key}]`;
};

// String template içinde kullanım
window.t = function(key, fallback) {
  if (window.miniappI18n) return window.miniappI18n.t(key);
  return fallback || key;
};

// Dinamik HTML oluştururken otomatik çeviri
window.i18nHTML = function(htmlString) {
  const temp = document.createElement('div');
  temp.innerHTML = htmlString;
  if (window.miniappI18n) {
    temp.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = window.miniappI18n.t(key) || el.textContent;
    });
  }
  return temp.innerHTML;
};

console.log('✅ i18n Helper yüklendi');
