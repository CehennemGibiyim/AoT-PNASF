// AoT-PNASF — Spec Planlayıcı (Atölye → Spec)
//
// Destiny Board fame eşikleri data/fame-table.js, craft fame tablosu
// data/craft-fame.js ve eşya reçeteleri data/craft-gear.js dosyalarından gelir.
// Savaş spec'i: hedefe kaç kill/saat kaldığını hesaplar.
// Üretim spec'i: aynı tier/enchant'ta hangi eşyayı üretmek fame başına en ucuz,
// malzeme fiyatları canlı marketten alınarak sıralanır.
//
// Kaynaklar: mahhov/albion-fame (fame eşikleri), albiononlinegrind.com
// (craft fame), ao-bin-dumps items.json (reçeteler), AODP (fiyatlar).

interface GearSatir { b: string; s: string; r: [number, number, number, [string, number][]][] }
interface Fiyat { min: number; sehir: string }

const $ = <T extends HTMLElement = HTMLElement>(s: string): T | null => document.querySelector<T>(s);
const sayi = (n: number): string => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(Math.round(n));
const para = (n: number): string => (n < 0 ? '-' : '') + sayi(Math.abs(n)) + ' g';

const FAME = (): { normal: number[]; elite: number[] } =>
  (window as any).AO_FAME || { normal: [], elite: [] };
const CRAFT_FAME = (): { satirlar: (string | number)[][] } =>
  (window as any).AO_CRAFT_FAME || { satirlar: [] };
const GEAR = (): GearSatir[] => (window as any).AO_CRAFT_GEAR || [];
const ITEMS = (): { id: string; tr: string; en: string }[] => (window as any).AO_ITEMS || [];

const SINIF_INDEX: Record<string, number> = { '2h': 1, '1h': 2, armor: 3, small: 4 };
const SINIF_AD: Record<string, string> = {
  '2h': 'İki elli silah', '1h': 'Tek elli silah', armor: 'Göğüslük / çanta', small: 'Kask / ayakkabı / pelerin / sol el',
};
const SEHIRLER = ['Caerleon', 'Bridgewatch', 'Martlock', 'Thetford', 'Fort Sterling', 'Lymhurst', 'Brecilien'];

let mod: 'savas' | 'craft' = 'savas';
let seviye = 1;
let hedef = 100;
let sinif = '2h';
let tier = 6;
let enchant = 0;
let sehir = 'Caerleon';
let fameKill = 1000;
let killDk = 6;
let fiyatlar = new Map<string, Fiyat>();
let sonIstek = 0;
let yukleniyor = false;
let kuruldu = false;
let urlAktif = false;

function sunucu(): string {
  const harita: Record<string, string> = {
    europe: 'europe.albion-online-data.com',
    americas: 'west.albion-online-data.com',
    asia: 'east.albion-online-data.com',
  };
  return harita[localStorage.getItem('aot-server') || 'europe'] || harita.europe;
}

function itemId(base: string, t: number, e: number): string {
  return `T${t}_${base}${e > 0 ? '@' + e : ''}`;
}

function adBul(base: string): string {
  const kayit = ITEMS().find((x) => x.id === base);
  if (kayit) return kayit.tr || kayit.en || base;
  return base.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, (h) => h.toUpperCase());
}

function malzemeAdi(id: string): string {
  const temel = id.replace(/^T\d+_/, '').replace(/_LEVEL\d+$/, '');
  return adBul(temel);
}

/** a seviyesinden b seviyesine gereken fame (1→100 normal, 100→120 elite). */
function fameHesap(a: number, b: number): number {
  const f = FAME();
  const bas = Math.max(1, Math.min(a, b));
  const bit = Math.max(1, b);
  let toplam = 0;
  for (let l = bas; l < bit; l++) {
    if (l < 100) toplam += f.normal[l - 1] || 0;
    else toplam += f.elite[l - 100] || 0;
  }
  return toplam;
}

function craftFame(t: number, e: number, s: string): number {
  const satir = CRAFT_FAME().satirlar.find((r) => String(r[0]) === `${t}.${e}`);
  if (!satir) return 0;
  return Number(satir[SINIF_INDEX[s]] || 0);
}

function satirlar(s: string, t: number, e: number): { base: string; mats: [string, number][]; focus: number }[] {
  const liste: { base: string; mats: [string, number][]; focus: number }[] = [];
  for (const g of GEAR()) {
    if (g.s !== s) continue;
    for (const [gt, ge, focus, mats] of g.r) {
      if (gt === t && ge === e) liste.push({ base: g.b, mats, focus });
    }
  }
  return liste;
}

async function fiyatCek(ids: string[]): Promise<void> {
  const eksik = Array.from(new Set(ids)).filter((id) => !fiyatlar.has(id));
  if (!eksik.length) return;
  const istek = (window as any).AOTMarketNetwork?.request;
  if (typeof istek !== 'function') return;
  yukleniyor = true;
  try {
    for (let i = 0; i < eksik.length; i += 80) {
      const parca = eksik.slice(i, i + 80);
      const url = `https://${sunucu()}/api/v2/stats/prices/${parca.join(',')}.json`
        + `?locations=${encodeURIComponent(SEHIRLER.join(','))}&qualities=1`;
      const yanit = await istek(url);
      const govde = typeof yanit?.json === 'function' ? await yanit.json() : yanit;
      for (const s of Array.isArray(govde) ? govde : []) {
        if (!s?.item_id || !(s.sell_price_min > 0)) continue;
        const onceki = fiyatlar.get(s.item_id);
        if (!onceki || s.sell_price_min < onceki.min) {
          fiyatlar.set(s.item_id, { min: s.sell_price_min, sehir: s.city || sehir });
        }
      }
    }
    sonIstek = Date.now();
  } catch {
    /* fiyat yoksa tablo maliyetsiz gösterilir */
  } finally {
    yukleniyor = false;
  }
}

function kart(b: string, d: string, a: string, renk = ''): string {
  return `<div style="flex:1;min-width:132px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:10px 12px">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted)">${b}</div>
    <div style="font-size:17px;font-weight:800;margin-top:3px;${renk}">${d}</div>
    <div style="font-size:10px;color:var(--text-muted);margin-top:2px">${a}</div>
  </div>`;
}

function kontroller(): string {
  const tierSec = [4, 5, 6, 7, 8].map((t) => `<option value="${t}"${t === tier ? ' selected' : ''}>T${t}</option>`).join('');
  const efsunSec = [0, 1, 2, 3, 4].map((e) => `<option value="${e}"${e === enchant ? ' selected' : ''}>${e === 0 ? 'Normal' : '.' + e}</option>`).join('');
  const sinifSec = Object.keys(SINIF_AD).map((s) => `<option value="${s}"${s === sinif ? ' selected' : ''}>${SINIF_AD[s]}</option>`).join('');
  const sehirSec = SEHIRLER.map((s) => `<option value="${s}"${s === sehir ? ' selected' : ''}>${s}</option>`).join('');
  return `
    <div class="tp-controls" style="flex-wrap:wrap;gap:8px">
      <div class="tp-btn-group">
        <button type="button" class="tp-btn ${mod === 'savas' ? 'active' : ''}" data-spec-mod="savas">⚔️ Savaş spec</button>
        <button type="button" class="tp-btn ${mod === 'craft' ? 'active' : ''}" data-spec-mod="craft">🏭 Üretim spec</button>
      </div>
      <label class="tp-slider-label" style="gap:6px"><span>Seviye</span>
        <input type="number" id="specSeviye" min="1" max="120" value="${seviye}" style="width:64px;background:#141414;border:1px solid #333;border-radius:6px;padding:5px 7px;color:#fff;font-size:12px"></label>
      <label class="tp-slider-label" style="gap:6px"><span>Hedef</span>
        <input type="number" id="specHedef" min="2" max="120" value="${hedef}" style="width:64px;background:#141414;border:1px solid #333;border-radius:6px;padding:5px 7px;color:#fff;font-size:12px"></label>
      ${mod === 'savas' ? `
      <label class="tp-slider-label" style="gap:6px"><span>Fame / kill</span>
        <input type="number" id="specFameKill" min="1" step="100" value="${fameKill}" style="width:82px;background:#141414;border:1px solid #333;border-radius:6px;padding:5px 7px;color:#fff;font-size:12px"></label>
      <label class="tp-slider-label" style="gap:6px"><span>Kill / dk</span>
        <input type="number" id="specKillDk" min="0.1" step="0.5" value="${killDk}" style="width:64px;background:#141414;border:1px solid #333;border-radius:6px;padding:5px 7px;color:#fff;font-size:12px"></label>` : `
      <label class="tp-slider-label" style="gap:6px"><span>Tier</span>
        <select id="specTier" style="background:#141414;border:1px solid #333;border-radius:6px;padding:5px 7px;color:#fff;font-size:12px">${tierSec}</select></label>
      <label class="tp-slider-label" style="gap:6px"><span>Efsun</span>
        <select id="specEnchant" style="background:#141414;border:1px solid #333;border-radius:6px;padding:5px 7px;color:#fff;font-size:12px">${efsunSec}</select></label>
      <label class="tp-slider-label" style="gap:6px"><span>Sınıf</span>
        <select id="specSinif" style="background:#141414;border:1px solid #333;border-radius:6px;padding:5px 7px;color:#fff;font-size:12px">${sinifSec}</select></label>
      <label class="tp-slider-label" style="gap:6px"><span>Şehir</span>
        <select id="specSehir" style="background:#141414;border:1px solid #333;border-radius:6px;padding:5px 7px;color:#fff;font-size:12px">${sehirSec}</select></label>`}
    </div>`;
}

function savasCiz(): string {
  const gereken = fameHesap(seviye, hedef);
  if (!gereken) {
    return '<p style="padding:14px;font-size:12px;color:#ffb84d">Hedef seviye mevcut seviyeden büyük olmalı.</p>';
  }
  const kill = Math.ceil(gereken / Math.max(1, fameKill));
  const saat = kill / (Math.max(0.1, killDk) * 60);
  const gun = saat / 2;
  const f = FAME();
  return `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      ${kart('Gereken fame', sayi(gereken), `${seviye} → ${hedef} · tablo ${f.normal.length + f.elite.length} seviye`)}
      ${kart('Gereken kill', sayi(kill), `${sayi(fameKill)} fame / kill`)}
      ${kart('Toplam süre', `${saat.toFixed(1)} saat`, `${killDk} kill/dk`)}
      ${kart('Günde 2 saat', `${gun.toFixed(1)} gün`, 'sabit hız varsayımı')}
    </div>
    <p class="tp-format-desc" style="line-height:1.7;margin:0">
      Fame eşikleri destiny board tablosundan gelir (1→100 normal, 100→120 elite). Kill hızı ve fame/kill elle
      ayarlanır; <strong>Yaratıklar</strong> sekmesinden yaratık fame değerine bakabilirsin.
      Bu bir üst sınır tahminidir: ölüm, yol ve grup paylaşımı hesaba katılmaz.
    </p>`;
}

async function craftCiz(): Promise<string> {
  const gereken = fameHesap(seviye, hedef);
  const fCraft = craftFame(tier, enchant, sinif);
  if (!fCraft) return '<p style="padding:14px;font-size:12px;color:#ffb84d">Bu tier/efsun için craft fame bulunamadı.</p>';
  const liste = satirlar(sinif, tier, enchant);
  if (!liste.length) return '<p style="padding:14px;font-size:12px;color:#ffb84d">Bu sınıf için reçete bulunamadı.</p>';

  const malzemeler = Array.from(new Set(liste.flatMap((x) => x.mats.map(([id]) => id))));
  const ciktiIdler = liste.map((x) => itemId(x.base, tier, enchant));
  await fiyatCek([...malzemeler, ...ciktiIdler]);

  const hesaplar = liste.map((x) => {
    const malzemeMaliyet = x.mats.reduce((t, [id, adet]) => t + (fiyatlar.get(id)?.min || 0) * adet, 0);
    const satis = fiyatlar.get(itemId(x.base, tier, enchant))?.min || 0;
    const crafts = Math.ceil(gereken / fCraft);
    const net = malzemeMaliyet - satis;
    return { ...x, malzemeMaliyet, satis, crafts, net, fameBasi: net / fCraft };
  });

  const fiyatli = hesaplar.filter((x) => x.malzemeMaliyet > 0);
  const sirali = (fiyatli.length ? fiyatli : hesaplar).sort((a, b) => a.fameBasi - b.fameBasi).slice(0, 12);
  const enIyi = sirali[0];
  const toplamNet = enIyi ? enIyi.net * enIyi.crafts : 0;

  const satirHtml = sirali.map((x, i) => {
    const renk = i === 0 ? '#00d4aa' : '#ddd';
    const fiyatYok = !x.malzemeMaliyet;
    return `<div style="display:grid;grid-template-columns:26px 1fr 88px 96px 96px;gap:8px;padding:6px 10px;font-size:11.5px;border-bottom:1px solid rgba(255,255,255,0.05);align-items:center">
      <span style="color:var(--text-muted)">${i + 1}</span>
      <span style="color:${renk};font-weight:${i === 0 ? '700' : '500'}">${adBul(x.base)}<span style="color:var(--text-muted);font-size:10px"> · ${x.focus} focus</span></span>
      <span style="text-align:right">${fiyatYok ? '<span style="color:#ff6b6b">fiyat yok</span>' : sayi(x.malzemeMaliyet)}</span>
      <span style="text-align:right">${fiyatYok ? '—' : sayi(x.net)}</span>
      <span style="text-align:right;color:${x.fameBasi < 0 ? '#00d4aa' : '#ccc'}">${fiyatYok ? '—' : para(x.fameBasi) + '/fame'}</span>
    </div>`;
  }).join('');

  const baslik = `<div style="display:grid;grid-template-columns:26px 1fr 88px 96px 96px;gap:8px;padding:6px 10px;font-size:10px;text-transform:uppercase;color:var(--text-muted);border-bottom:1px solid rgba(255,255,255,0.1)">
      <span>#</span><span>Eşya</span><span style="text-align:right">Malzeme</span><span style="text-align:right">Net maliyet</span><span style="text-align:right">Silver / fame</span>
    </div>`;

  return `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      ${kart('Gereken fame', sayi(gereken), `${seviye} → ${hedef}`)}
      ${kart('Fame / craft', sayi(fCraft), `T${tier}${enchant ? '.' + enchant : ''} · ${SINIF_AD[sinif]}`)}
      ${kart('Gereken craft', sayi(enIyi?.crafts || 0), enIyi ? adBul(enIyi.base) : '—')}
      ${kart('Tahmini net', enIyi ? para(toplamNet) : '—', enIyi && enIyi.net < 0 ? 'üretim kâr bırakıyor' : 'satış geliri düşülmüş', toplamNet < 0 ? 'color:#00d4aa' : '')}
    </div>
    <div style="border:1px solid rgba(255,255,255,0.08);border-radius:9px;overflow:hidden">${baslik}${satirHtml}</div>
    <p class="tp-format-desc" style="line-height:1.7;margin:8px 0 0">
      Sıralama <strong>fame başına net maliyete</strong> göre: malzeme alışı (en ucuz şehir) − üretilen eşyanın satışı.
      Negatif değer üretimin fame kazandırırken kâr bıraktığı anlamına gelir. Fiyatlar AODP'den, ${fiyatlar.size} eşya/malzeme
      için alındı${sonIstek ? ` (${new Date(sonIstek).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })})` : ''}.
      Reçeteler ao-bin-dumps, craft fame tablosu Albion Grind kaynaklıdır.
    </p>`;
}

async function ciz(): Promise<void> {
  urlYaz();
  const kutu = $('#specSonuc');
  if (!kutu) return;
  if (!FAME().normal?.length) {
    kutu.innerHTML = '<p style="padding:14px;font-size:12px;color:#ffb84d">Fame tablosu yüklenemedi (data/fame-table.js).</p>';
    return;
  }
  kutu.innerHTML = mod === 'savas' ? savasCiz() : await craftCiz();
}

function urlOku(): void {
  try {
    const sorgu = decodeURIComponent(location.hash.replace(/^#/, '')).split('?')[1];
    if (!sorgu) return;
    const p = new URLSearchParams(sorgu);
    const m = p.get('mod');
    if (m === 'savas' || m === 'craft') mod = m;
    const t = Number(p.get('t'));
    if (t >= 4 && t <= 8) tier = t;
    const e = Number(p.get('e'));
    if (e >= 0 && e <= 4) enchant = e;
    const sn = p.get('s');
    if (sn && SINIF_AD[sn]) sinif = sn;
    const sv = Number(p.get('sv'));
    if (sv >= 1 && sv <= 120) seviye = sv;
    const hd = Number(p.get('hd'));
    if (hd >= 2 && hd <= 120) hedef = hd;
    urlAktif = true;
  } catch (_) { /* yoksay */ }
}

function urlYaz(): void {
  if (!urlAktif) return;
  try {
    const p = new URLSearchParams({ mod, t: String(tier), e: String(enchant), s: sinif, sv: String(seviye), hd: String(hedef) });
    history.replaceState(null, '', `#atolye/spec?${p.toString()}`);
  } catch (_) { /* yoksay */ }
}

function durum(mesaj: string): void {
  const el = $('#specDurum');
  if (el) el.textContent = mesaj;
}

function kontrolKur(): void {
  document.querySelectorAll<HTMLElement>('[data-spec-mod]').forEach((btn) => {
    btn.addEventListener('click', () => {
      mod = btn.dataset.specMod as 'savas' | 'craft';
      modCiz();
    });
  });
  $('#specSeviye')?.addEventListener('input', (ev) => {
    seviye = Math.max(1, Math.min(120, Number((ev.target as HTMLInputElement).value) || 1));
    void ciz();
  });
  $('#specHedef')?.addEventListener('input', (ev) => {
    hedef = Math.max(2, Math.min(120, Number((ev.target as HTMLInputElement).value) || 100));
    void ciz();
  });
  $('#specFameKill')?.addEventListener('input', (ev) => {
    fameKill = Math.max(1, Number((ev.target as HTMLInputElement).value) || 1000);
    void ciz();
  });
  $('#specKillDk')?.addEventListener('input', (ev) => {
    killDk = Math.max(0.1, Number((ev.target as HTMLInputElement).value) || 6);
    void ciz();
  });
  $('#specTier')?.addEventListener('change', (ev) => {
    tier = Number((ev.target as HTMLSelectElement).value) || 6;
    void ciz();
  });
  $('#specEnchant')?.addEventListener('change', (ev) => {
    enchant = Number((ev.target as HTMLSelectElement).value) || 0;
    void ciz();
  });
  $('#specSinif')?.addEventListener('change', (ev) => {
    sinif = (ev.target as HTMLSelectElement).value || '2h';
    void ciz();
  });
  $('#specSehir')?.addEventListener('change', (ev) => {
    sehir = (ev.target as HTMLSelectElement).value || 'Caerleon';
    void ciz();
  });
}

function modCiz(): void {
  const kutu = $('#specKontroller');
  if (kutu) kutu.innerHTML = kontroller();
  kontrolKur();
  durum(mod === 'craft' ? 'Fiyatlar alınıyor…' : '');
  void ciz().then(() => durum(''));
}

export function kur(): void {
  if (kuruldu) return;
  if (!$('#atolye-spec')) return;
  kuruldu = true;
  urlOku();
  modCiz();
  $('#specPaylas')?.addEventListener('click', async () => {
    urlYaz();
    try {
      await navigator.clipboard.writeText(location.href);
      durum('Bağlantı kopyalandı.');
    } catch {
      durum('Bağlantı adres çubuğunda güncellendi; elle kopyalayın.');
    }
  });
  $('#atolye-spec')?.addEventListener('pointerdown', () => { urlAktif = true; }, { once: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', kur, { once: true });
} else {
  kur();
}

export {};
