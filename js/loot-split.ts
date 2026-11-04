// AoT-PNASF — Loot Paylaşımı (Atölye → Paylaşım)
//
// Partiyle toplanan loot'u eşya bazında canlı market fiyatıyla değerler ve
// oyuncu sayısına böler. Kayıtlar cihazda (localStorage) saklanır; sunucu yok.
// Fiyat kaynağı AODP sell_price_min (en ucuz ilan), kalite 1.

interface PaylasimKalem { id: string; ad: string; adet: number }
interface Fiyat { min: number; sehir: string }

const $ = <T extends HTMLElement = HTMLElement>(s: string): T | null => document.querySelector<T>(s);
const sayi = (n: number): string => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(Math.round(n));

const KEY = 'aot-loot-paylasim';
const SUNUCULAR: Record<string, string> = {
  europe: 'europe.albion-online-data.com',
  americas: 'west.albion-online-data.com',
  asia: 'east.albion-online-data.com',
};
const KONUMLAR = 'Caerleon,Bridgewatch,Martlock,Thetford,Fort Sterling,Lymhurst,Brecilien';

let kalemler: PaylasimKalem[] = [];
let oyuncu = 5;
let fiyatlar = new Map<string, Fiyat>();
let tier = 6;
let kuruldu = false;

function yukle(): void {
  try {
    const ham = localStorage.getItem(KEY);
    if (!ham) return;
    const veri = JSON.parse(ham);
    if (Array.isArray(veri.kalemler)) kalemler = veri.kalemler.filter((x: any) => x?.id);
    if (Number(veri.oyuncu) > 0) oyuncu = Number(veri.oyuncu);
  } catch { /* yoksay */ }
}
function kaydet(): void {
  try { localStorage.setItem(KEY, JSON.stringify({ kalemler, oyuncu })); } catch { /* yoksay */ }
}

function sunucu(): string {
  return SUNUCULAR[localStorage.getItem('aot-server') || 'europe'] || SUNUCULAR.europe;
}

function adBul(id: string): string {
  const temel = id.replace(/^T\d+_/, '').replace(/@\d+$/, '');
  const kayit = ((window as any).AO_ITEMS || []).find((x: any) => x.id === temel);
  return kayit ? (kayit.tr || kayit.en || temel) : temel;
}

async function fiyatCek(): Promise<void> {
  const eksik = Array.from(new Set(kalemler.map((k) => k.id))).filter((id) => !fiyatlar.has(id));
  if (!eksik.length) return;
  const istek = (window as any).AOTMarketNetwork?.request;
  if (typeof istek !== 'function') return;
  try {
    for (let i = 0; i < eksik.length; i += 80) {
      const parca = eksik.slice(i, i + 80);
      const url = `https://${sunucu()}/api/v2/stats/prices/${parca.join(',')}.json?locations=${encodeURIComponent(KONUMLAR)}&qualities=1`;
      const yanit = await istek(url);
      const govde = typeof yanit?.json === 'function' ? await yanit.json() : yanit;
      for (const s of Array.isArray(govde) ? govde : []) {
        if (!s?.item_id || !(s.sell_price_min > 0)) continue;
        const onceki = fiyatlar.get(s.item_id);
        if (!onceki || s.sell_price_min < onceki.min) fiyatlar.set(s.item_id, { min: s.sell_price_min, sehir: s.city });
      }
    }
  } catch { /* fiyat yoksa 0 gösterilir */ }
  ciz();
}

function liste(dil: string): string {
  return ((window as any).AO_ITEMS || [])
    .filter((x: any) => x.cat !== 'misc')
    .slice(0, 900)
    .map((x: any) => `<option value="${(dil === 'tr' ? x.tr : x.en) || x.en}">${x.id}</option>`)
    .join('');
}

function ciz(): void {
  const kutu = $('#paylasimApp');
  if (!kutu) return;
  const dil = localStorage.getItem('aot-lang') || 'tr';
  const toplam = kalemler.reduce((t, k) => t + (fiyatlar.get(k.id)?.min || 0) * k.adet, 0);
  const kisiBasi = oyuncu > 0 ? toplam / oyuncu : 0;
  const fiyatsiz = kalemler.filter((k) => !fiyatlar.get(k.id)?.min).length;

  kutu.innerHTML = `
    <div class="tp-controls" style="flex-wrap:wrap;gap:8px;align-items:flex-end">
      <label class="tp-slider-label" style="gap:6px"><span>Tier</span>
        <select id="paylasTier" style="background:#141414;border:1px solid #333;border-radius:6px;padding:6px 8px;color:#fff;font-size:12px">
          ${[4, 5, 6, 7, 8].map((t) => `<option value="${t}"${t === tier ? ' selected' : ''}>T${t}</option>`).join('')}
        </select></label>
      <input type="search" id="paylasAra" list="paylasListe" autocomplete="off" placeholder="Eşya ara (ör. Geniş Kılıç)…"
        style="flex:1;min-width:200px;background:#141414;border:1px solid #333;border-radius:6px;padding:7px 9px;color:#fff;font-size:12.5px">
      <datalist id="paylasListe">${liste(dil)}</datalist>
      <input type="number" id="paylasAdet" min="1" max="9999" value="1" aria-label="Adet"
        style="width:76px;background:#141414;border:1px solid #333;border-radius:6px;padding:6px 8px;color:#fff;font-size:12px">
      <button type="button" id="paylasEkle" style="background:var(--accent);color:#141006;border:0;border-radius:6px;padding:7px 12px;font:700 12px/1 system-ui;cursor:pointer">Ekle</button>
      <label class="tp-slider-label" style="gap:6px"><span>Oyuncu</span>
        <input type="number" id="paylasOyuncu" min="1" max="100" value="${oyuncu}" aria-label="Oyuncu sayısı"
          style="width:64px;background:#141414;border:1px solid #333;border-radius:6px;padding:6px 8px;color:#fff;font-size:12px"></label>
      <button type="button" id="paylasTemizle" style="background:transparent;border:1px solid #3a3a3a;color:#aaa;border-radius:6px;padding:7px 10px;font-size:11.5px;cursor:pointer">Temizle</button>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0">
      <div style="flex:1;min-width:150px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:10px 12px">
        <div style="font-size:10px;text-transform:uppercase;color:var(--text-muted)">Toplam loot değeri</div>
        <div style="font-size:18px;font-weight:800;margin-top:3px">${sayi(toplam)} 🥈</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px">${kalemler.length} kalem${fiyatsiz ? ` · ${fiyatsiz} fiyatsız` : ''}</div>
      </div>
      <div style="flex:1;min-width:150px;background:rgba(0,212,170,0.06);border:1px solid rgba(0,212,170,0.25);border-radius:9px;padding:10px 12px">
        <div style="font-size:10px;text-transform:uppercase;color:var(--text-muted)">Kişi başı</div>
        <div style="font-size:18px;font-weight:800;margin-top:3px;color:#00d4aa">${sayi(kisiBasi)} 🥈</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px">${oyuncu} oyuncu · eşit pay</div>
      </div>
    </div>
    <div style="border:1px solid rgba(255,255,255,0.08);border-radius:9px;overflow:hidden">
      ${kalemler.length ? kalemler.map((k, i) => {
        const f = fiyatlar.get(k.id);
        return `<div style="display:grid;grid-template-columns:1fr 60px 96px 96px 64px;gap:8px;padding:7px 10px;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.05);align-items:center">
          <span>${k.ad}<span style="color:var(--text-muted);font-size:10px"> · ${k.id}</span></span>
          <span style="text-align:right">${k.adet}</span>
          <span style="text-align:right">${f ? sayi(f.min) : '<span style="color:#ff6b6b">yok</span>'}</span>
          <span style="text-align:right">${f ? sayi(f.min * k.adet) : '—'}</span>
          <button type="button" data-paylas-sil="${i}" style="background:transparent;border:1px solid #3a3a3a;color:#aaa;border-radius:5px;padding:3px 6px;font-size:10px;cursor:pointer">Sil</button>
        </div>`;
      }).join('') : '<p style="padding:14px;font-size:11.5px;color:var(--text-muted);margin:0">Kalem ekleyin; fiyatlar AODP’den otomatik çekilir.</p>'}
    </div>
    <p class="tp-format-desc" style="line-height:1.7;margin:8px 0 0">
      Değerleme en ucuz satış ilanı üzerinden yapılır; pazar vergisi, ağırlık ve pay farkları hesaba katılmaz.
      Kayıtlar yalnızca bu cihazda tutulur.
    </p>`;

  const ara = $('#paylasAra') as HTMLInputElement | null;
  const adaGore = (deger: string): any => {
    const d = deger.trim().toLocaleLowerCase('tr');
    return ((window as any).AO_ITEMS || []).find((x: any) =>
      (x.tr || '').toLocaleLowerCase('tr') === d || (x.en || '').toLocaleLowerCase('tr') === d || x.id === deger.trim().toUpperCase());
  };
  const ekle = (): void => {
    const kayit = ara ? adaGore(ara.value) : null;
    if (!kayit) {
      if (ara) ara.setCustomValidity('Listeden bir eşya seçin');
      ara?.reportValidity();
      return;
    }
    ara?.setCustomValidity('');
    const adet = Math.max(1, Math.min(9999, Number(($('#paylasAdet') as HTMLInputElement | null)?.value) || 1));
    const id = `T${tier}_${kayit.id}`;
    const mevcut = kalemler.find((k) => k.id === id);
    if (mevcut) mevcut.adet += adet;
    else kalemler.push({ id, ad: kayit.tr || kayit.en || kayit.id, adet });
    if (ara) ara.value = '';
    kaydet();
    ciz();
    void fiyatCek();
  };
  $('#paylasEkle')?.addEventListener('click', ekle);
  ara?.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') ekle(); });
  $('#paylasTier')?.addEventListener('change', (ev) => { tier = Number((ev.target as HTMLSelectElement).value) || 6; });
  $('#paylasOyuncu')?.addEventListener('input', (ev) => {
    oyuncu = Math.max(1, Math.min(100, Number((ev.target as HTMLInputElement).value) || 1));
    kaydet();
    ciz();
  });
  $('#paylasTemizle')?.addEventListener('click', () => {
    kalemler = [];
    fiyatlar = new Map();
    kaydet();
    ciz();
  });
  kutu.querySelectorAll<HTMLElement>('[data-paylas-sil]').forEach((btn) => {
    btn.addEventListener('click', () => {
      kalemler.splice(Number(btn.dataset.paylasSil), 1);
      kaydet();
      ciz();
    });
  });
}

export function kur(): void {
  if (kuruldu) return;
  if (!$('#paylasimApp')) return;
  kuruldu = true;
  yukle();
  ciz();
  void fiyatCek();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', kur, { once: true });
} else {
  kur();
}

export {};
