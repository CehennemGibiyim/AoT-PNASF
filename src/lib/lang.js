// AoT-PNASF — Dil Sistemi (TR / EN)
let currentLang = localStorage.getItem('aot-lang') || 'tr';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('aot-lang', lang);
  document.getElementById('langLabel').textContent = lang.toUpperCase();
  document.querySelectorAll('[data-tr]').forEach(el => {
    el.textContent = lang === 'tr' ? el.dataset.tr : el.dataset.en;
  });
  document.querySelectorAll('[data-tr-placeholder]').forEach(el => {
    el.placeholder = lang === 'tr' ? el.dataset.trPlaceholder : el.dataset.enPlaceholder;
  });
}

function toggleLang() {
  applyLang(currentLang === 'tr' ? 'en' : 'tr');
}

document.addEventListener('DOMContentLoaded', () => applyLang(currentLang));
