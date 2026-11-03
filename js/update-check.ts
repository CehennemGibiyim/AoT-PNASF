// Yeni sürüm bildirimi.
//
// GitHub Releases üzerinden en son sürümü okur; kurulu sürümden yeniyse
// sağ altta "Yeni sürüm" rozeti gösterir ve indirme sayfasını açar.
//
// Neden sessiz (otomatik) kurulum değil?
//   Windows paketleri kod imzalı değil. İmzasız bir paketi kullanıcının
//   haberi olmadan indirip çalıştırmak SmartScreen/güvenlik açısından
//   doğru değil; imzalama sertifikası eklendiğinde electron-updater /
//   Tauri updater ile sessiz güncellemeye geçilebilir (bkz. desktop/SIGNING.md).

import { APP_VERSION } from './app-info';

const DEPO = 'CehennemGibiyim/AoT-PNASF';
const KONTROL_ANAHTARI = 'aot-update-check';
const YOKSAYILAN_ANAHTAR = 'aot-update-dismissed';
const KONTROL_ARALIGI_MS = 6 * 60 * 60 * 1000; // 6 saat

interface SurumBilgisi {
  surum: string;
  sayfa: string;
}

function surumParcala(surum: string): number[] {
  return surum
    .replace(/^v/i, '')
    .split(/[.\-+]/)
    .map((p) => parseInt(p, 10))
    .map((n) => (Number.isFinite(n) ? n : 0));
}

/** a > b ise pozitif, eşitse 0, küçükse negatif. */
export function surumKarsilastir(a: string, b: string): number {
  const pa = surumParcala(a);
  const pb = surumParcala(b);
  const uzunluk = Math.max(pa.length, pb.length);
  for (let i = 0; i < uzunluk; i += 1) {
    const fark = (pa[i] || 0) - (pb[i] || 0);
    if (fark !== 0) return fark;
  }
  return 0;
}

function rozetOlustur(bilgi: SurumBilgisi): void {
  if (document.getElementById('aotUpdateBadge')) return;
  const rozet = document.createElement('div');
  rozet.id = 'aotUpdateBadge';
  rozet.setAttribute('role', 'status');
  rozet.style.cssText = [
    'position:fixed',
    'left:16px',
    'bottom:16px',
    'z-index:9998',
    'display:flex',
    'align-items:center',
    'gap:10px',
    'max-width:min(92vw,420px)',
    'padding:10px 12px',
    'border-radius:10px',
    'border:1px solid rgba(212,175,55,0.45)',
    'background:rgba(14,12,6,0.96)',
    'box-shadow:0 8px 24px rgba(0,0,0,0.45)',
    'color:#f5f5f5',
    'font:500 12px/1.45 system-ui,sans-serif',
  ].join(';');
  rozet.innerHTML = `
    <span aria-hidden="true" style="font-size:15px">⬆</span>
    <span style="flex:1">Yeni sürüm hazır: <strong>v${bilgi.surum}</strong> <span style="color:#a3a3a3">(kurulu v${APP_VERSION})</span></span>
    <a href="${bilgi.sayfa}" target="_blank" rel="noopener noreferrer" style="flex:none;background:#d4af37;color:#141006;border-radius:7px;padding:6px 10px;font:700 11px/1 system-ui,sans-serif;text-decoration:none">İndir</a>
    <button type="button" aria-label="Güncelleme bildirimini kapat" style="flex:none;background:transparent;border:0;color:#a3a3a3;font-size:14px;cursor:pointer;padding:0 2px">✕</button>
  `;
  rozet.querySelector('button')?.addEventListener('click', () => {
    try {
      localStorage.setItem(YOKSAYILAN_ANAHTAR, bilgi.surum);
    } catch { /* depolama kapalı */ }
    rozet.remove();
  });
  document.body.appendChild(rozet);
}

async function enSonSurumuGetir(): Promise<SurumBilgisi | null> {
  try {
    const onbellek = JSON.parse(localStorage.getItem(KONTROL_ANAHTARI) || 'null');
    if (onbellek && typeof onbellek.zaman === 'number' && Date.now() - onbellek.zaman < KONTROL_ARALIGI_MS) {
      return onbellek.veri || null;
    }
  } catch { /* bozuk önbellek */ }

  try {
    const yanit = await fetch(`https://api.github.com/repos/${DEPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!yanit.ok) return null;
    const veri = await yanit.json();
    const etiket = typeof veri?.tag_name === 'string' ? veri.tag_name : '';
    const sayfa = typeof veri?.html_url === 'string' ? veri.html_url : '';
    if (!etiket || !sayfa) return null;
    const bilgi: SurumBilgisi = { surum: etiket.replace(/^v/i, ''), sayfa };
    try {
      localStorage.setItem(KONTROL_ANAHTARI, JSON.stringify({ zaman: Date.now(), veri: bilgi }));
    } catch { /* depolama kapalı */ }
    return bilgi;
  } catch {
    return null;
  }
}

async function kontrolEt(): Promise<void> {
  if (typeof fetch !== 'function') return;
  const bilgi = await enSonSurumuGetir();
  if (!bilgi || !bilgi.surum) return;
  if (surumKarsilastir(bilgi.surum, APP_VERSION) <= 0) return;

  let yoksayilan = '';
  try {
    yoksayilan = localStorage.getItem(YOKSAYILAN_ANAHTAR) || '';
  } catch { /* depolama kapalı */ }
  if (yoksayilan === bilgi.surum) return;

  if (document.body) rozetOlustur(bilgi);
  else document.addEventListener('DOMContentLoaded', () => rozetOlustur(bilgi), { once: true });
}

// Açılıştan hemen sonra değil, uygulama yerleştikten sonra kontrol et.
if (document.readyState === 'complete') {
  setTimeout(() => { void kontrolEt(); }, 2500);
} else {
  window.addEventListener('load', () => { setTimeout(() => { void kontrolEt(); }, 2500); }, { once: true });
}
