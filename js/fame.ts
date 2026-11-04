// AoT-PNASF — Fame Planlayıcı (Atölye → Fame)
//
// Hedef fame'e ulaşmak için kaç yaratık kesmek / kaç saat oynamak gerektiğini
// hesaplar. Yaratık fame değerleri gerçek oyun verisinden (data/mobs-data.js)
// seçilir; hız (kill/dk) kullanıcı tarafından ayarlanır.
//
// Not: Destiny board seviye eşikleri resmî dökümlerde yayınlanmadığı için
// hedef fame elle girilir; hazır düğmeler yaygın hedefleri kolaylaştırır.

import { yukle } from './mobs';

const $ = <T extends HTMLElement = HTMLElement>(s: string): T | null => document.querySelector<T>(s);
const sayi = (n: number): string => new Intl.NumberFormat('tr-TR').format(Math.round(n));

interface Mob { ad: string; tier: number; faction: string; can: number; hasar: number; fame: number; kategori: string; }

let moblar: Mob[] = [];
let seciliMob: Mob | null = null;
let hedefFame = 1_000_000;
let killDk = 6;
let gunlukSaat = 2;
let kuruldu = false;

function sonucHesapla(): void {
  const kutu = $('#fameSonuc');
  if (!kutu) return;
  const mobFame = Number(($('#fameMobFame') as HTMLInputElement)?.value) || seciliMob?.fame || 0;
  const kill = Math.max(0.1, killDk);
  if (!mobFame || !hedefFame) {
    kutu.innerHTML = '<p style="padding:14px;font-size:12px;color:var(--text-muted)">Hedef fame ve yaratık fame değeri girin.</p>';
    return;
  }
  const adet = Math.ceil(hedefFame / mobFame);
  const dakika = adet / kill;
  const saat = dakika / 60;
  const gun = gunlukSaat > 0 ? saat / gunlukSaat : 0;
  const saatlikFame = kill * 60 * mobFame;

  const kart = (b: string, d: string, a: string) => `<div style="flex:1;min-width:130px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:10px 12px">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted)">${b}</div>
    <div style="font-size:16px;font-weight:800;margin-top:3px">${d}</div>
    <div style="font-size:10px;color:var(--text-muted);margin-top:2px">${a}</div>
  </div>`;

  kutu.innerHTML = `
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${kart('Gereken kill', sayi(adet), `${sayi(mobFame)} fame / kill`)}
      ${kart('Toplam süre', `${saat.toFixed(1)} saat`, `${sayi(dakika)} dakika`)}
      ${kart('Gün sayısı', `${gun.toFixed(1)} gün`, `günde ${gunlukSaat} saat`)}
      ${kart('Fame / saat', sayi(saatlikFame), `${kill} kill/dk`)}
    </div>
    <p style="font-size:10.5px;color:var(--text-muted);margin-top:8px;line-height:1.7">
      Hesap, seçilen yaratığın <strong>fame</strong> değeri ve sabit kill hızı üzerinden yapılır; ölüm, bekleme, yol ve
      grup paylaşımı hesaba katılmaz. Destiny board seviye eşikleri resmî dökümlerde yayınlanmadığı için hedef fame'i
      kendiniz girersiniz (ör. bir spec seviyesi için oyunda gördüğünüz kalan fame).
    </p>
  `;
}

function onerileriGizle(): void {
  const kutu = $('#fameOneri');
  if (kutu) { kutu.style.display = 'none'; kutu.innerHTML = ''; }
}

function oneriGoster(): void {
  const arama = ($('#fameMobArama') as HTMLInputElement | null)?.value.trim().toLowerCase() || '';
  const kutu = $('#fameOneri');
  if (!kutu) return;
  if (arama.length < 2) { onerileriGizle(); return; }

  const bulunan = moblar.filter((m) => m.fame > 0 && m.ad.toLowerCase().includes(arama)).slice(0, 12);
  if (!bulunan.length) { onerileriGizle(); return; }

  kutu.innerHTML = '';
  for (const m of bulunan) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('role', 'option');
    btn.style.cssText = 'display:flex;justify-content:space-between;gap:10px;width:100%;background:transparent;border:0;padding:6px 10px;color:#f5f5f5;font-size:12px;text-align:left;cursor:pointer';
    btn.innerHTML = `<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m.ad}</span>
      <span style="color:#d4af37;white-space:nowrap">T${m.tier} · ★ ${sayi(m.fame)}</span>`;
    btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(212,175,55,0.14)'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = 'transparent'; });
    btn.addEventListener('click', () => {
      seciliMob = m;
      const a = $('#fameMobArama') as HTMLInputElement | null;
      if (a) a.value = m.ad;
      const f = $('#fameMobFame') as HTMLInputElement | null;
      if (f) f.value = String(m.fame);
      onerileriGizle();
      sonucHesapla();
    });
    kutu.appendChild(btn);
  }
  kutu.style.display = 'block';
}

function kurKontroller(): void {
  $('#fameMobArama')?.addEventListener('input', oneriGoster);
  document.addEventListener('click', (ev) => {
    if (!(ev.target as HTMLElement)?.closest('#fameMobArama, #fameOneri')) onerileriGizle();
  });

  $('#fameHedef')?.addEventListener('input', (ev) => {
    hedefFame = Math.max(0, Number((ev.target as HTMLInputElement).value) || 0);
    sonucHesapla();
  });
  document.querySelectorAll<HTMLElement>('[data-fame-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      hedefFame = Number(btn.dataset.famePreset) || 0;
      const h = $('#fameHedef') as HTMLInputElement | null;
      if (h) h.value = String(hedefFame);
      sonucHesapla();
    });
  });
  $('#fameKill')?.addEventListener('input', (ev) => {
    killDk = Math.max(0.1, Number((ev.target as HTMLInputElement).value) || 0.1);
    sonucHesapla();
  });
  $('#fameSaat')?.addEventListener('input', (ev) => {
    gunlukSaat = Math.max(0, Number((ev.target as HTMLInputElement).value) || 0);
    sonucHesapla();
  });
  $('#fameMobFame')?.addEventListener('input', () => sonucHesapla());

  document.querySelectorAll<HTMLElement>('.atolye-sekme[data-atolye="fame"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      kur();
      if (!moblar.length) void yukle().then((liste) => { moblar = liste; }).catch(() => {});
    });
  });
}

export function kur(): void {
  if (kuruldu) return;
  if (!$('#fameHedef')) return;
  kuruldu = true;
  kurKontroller();
  sonucHesapla();
  void yukle().then((liste) => { moblar = liste; }).catch(() => {});
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', kur, { once: true });
} else {
  kur();
}

export {};
