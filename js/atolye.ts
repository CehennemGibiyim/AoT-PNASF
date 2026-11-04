// AoT-PNASF — Atölye sekme değiştirici
//
// Atölye içindeki paneller (Üretim / Çiftlik / Fame / Yaratıklar / Oyuncu)
// kendi `.atolye-panel` sınıflarını kullanır; böylece Araçlar sekmesinin
// `.tool-panel` mantığıyla çakışmaz.

(() => {
  'use strict';

  const $$ = (sel: string) => Array.from(document.querySelectorAll<HTMLElement>(sel));

  function sec(hedef: string): void {
    $$('.atolye-sekme').forEach((b) => {
      const aktif = b.dataset.atolye === hedef;
      b.classList.toggle('active', aktif);
      b.setAttribute('aria-selected', aktif ? 'true' : 'false');
    });
    $$('.atolye-panel').forEach((p) => p.classList.remove('active'));
    document.getElementById(`atolye-${hedef}`)?.classList.add('active');
  }

  $$('.atolye-sekme').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.atolye) sec(btn.dataset.atolye);
    });
  });

  // #atolye/uretim gibi bağlantılarla doğrudan panele git
  try {
    const parca = (location.hash || '').replace('#', '').split('/');
    const hedef = (parca[1] || '').split('?')[0];
    if (parca[0] === 'atolye' && hedef) {
      const btn = document.querySelector<HTMLElement>(`.atolye-sekme[data-atolye="${hedef}"]`);
      btn?.click();
    }
  } catch (_) { /* yoksay */ }
})();

export {};
