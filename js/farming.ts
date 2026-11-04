// AoT-PNASF — Çiftlik / Ada Kârı (Atölye → Çiftlik)
//
// data/farming-data.js (ao-bin-dumps: farmableitem + loot + farmingmodifiers)
// ürünlerini canlı tohum/ürün fiyatlarıyla birleştirir: döngü süresi, focus,
// hasat aralığı, tohum dönüş şansı ve şehir çiftlik bonusu ile kâr/saat hesaplar.

interface Urun {
  id: string; urun: string; n: string; e: string; t: number; tur: string;
  sure: number; focus: number; bonus: number; az: number; cok: number;
  tohumSans: number; fame: number; sehir: Record<string, number>;
}
interface Fiyat { item_id: string; city: string; quality: number; sell_price_min: number; buy_price_max: number; }

const SEHIRLER = ['Caerleon', 'Bridgewatch', 'Martlock', 'Thetford', 'Fort Sterling', 'Lymhurst', 'Brecilien'];
const $ = <T extends HTMLElement = HTMLElement>(s: string): T | null => document.querySelector<T>(s);
const dil = (): string => localStorage.getItem('aot-lang') || 'tr';
const sayi = (n: number): string => new Intl.NumberFormat('tr-TR').format(Math.round(n));

const urunler = (): Urun[] => (window as any).AO_FARMING || [];
let secili = '';
let sehir = 'Caerleon';
let bonus = 0;
let tohumDonus = 0;
let fiyatlar = new Map<string, Fiyat[]>();
let yukleniyor = false;
let sonIstek = 0;
let kuruldu = false;

function sunucu(): string {
  const harita: Record<string, string> = {
    europe: 'europe.albion-online-data.com',
    americas: 'west.albion-online-data.com',
    asia: 'east.albion-online-data.com',
  };
  return harita[localStorage.getItem('aot-server') || 'europe'] || harita.europe;
}
const satis = (id: string): number => (fiyatlar.get(id) || []).filter((f) => f.sell_price_min > 0).sort((a, b) => a.sell_price_min - b.sell_price_min)[0]?.sell_price_min || 0;
const alis = (id: string): number => (fiyatlar.get(id) || []).filter((f) => f.buy_price_max > 0).sort((a, b) => b.buy_price_max - a.buy_price_max)[0]?.buy_price_max || 0;

function kayit(): Urun | undefined {
  return urunler().find((u) => u.id === secili);
}

async function fiyatlariCek(): Promise<void> {
  if (yukleniyor) return;
  const u = kayit();
  if (!u) return;
  const kimlikler = Array.from(new Set([u.id, u.urun].filter(Boolean)));
  yukleniyor = true;
  durum('Fiyatlar alınıyor…');
  try {
    const istek = (window as any).AOTMarketNetwork?.request;
    if (typeof istek !== 'function') throw new Error('market katmanı yok');
    const url = `https://${sunucu()}/api/v2/stats/prices/${kimlikler.join(',')}.json`
      + `?locations=${encodeURIComponent(SEHIRLER.join(','))}&qualities=1`;
    const yanit = await istek(url);
    const govde = typeof yanit?.json === 'function' ? await yanit.json() : yanit;
    const satirlar: Fiyat[] = Array.isArray(govde) ? govde : [];
    fiyatlar = new Map();
    for (const s of satirlar) {
      if (!s?.item_id) continue;
      fiyatlar.set(s.item_id, [...(fiyatlar.get(s.item_id) || []), s]);
    }
    sonIstek = Date.now();
    durum(`Son güncelleme ${new Date(sonIstek).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`);
    ciz();
  } catch {
    durum('Fiyatlar alınamadı — bağlantıyı kontrol edin.');
  } finally {
    yukleniyor = false;
  }
}

function durum(mesaj: string): void {
  const el = $('#ciftlikDurum');
  if (el) el.textContent = mesaj;
}

function sehirBonusu(): number {
  const u = kayit();
  if (!u) return 0;
  return Math.round((u.sehir?.[sehir] || 0) * 1000) / 10; // %
}

function hesapla(u: Urun): { kar: number; saatlik: number; maliyet: number; gelir: number; adet: number } {
  const tohumFiyat = satis(u.id);
  const urunFiyat = satis(u.urun);
  const beklenen = ((u.az + u.cok) / 2) * (1 + bonus / 100);
  const tohumMaliyet = tohumFiyat * (1 - tohumDonus / 100);
  const gelir = beklenen * urunFiyat;
  const kar = gelir - tohumMaliyet;
  const saat = u.sure / 3600;
  return { kar, saatlik: saat > 0 ? kar / saat : 0, maliyet: tohumMaliyet, gelir, adet: beklenen };
}

function kart(baslik: string, deger: string, alt = '', renk = ''): string {
  return `<div style="flex:1;min-width:128px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:10px 12px">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted)">${baslik}</div>
    <div style="font-size:16px;font-weight:800;margin-top:3px;${renk}">${deger}</div>
    ${alt ? `<div style="font-size:10px;color:var(--text-muted);margin-top:2px">${alt}</div>` : ''}
  </div>`;
}

function ciz(): void {
  const kutu = $('#ciftlikSonuc');
  if (!kutu) return;
  const u = kayit();
  if (!u) { kutu.innerHTML = ''; return; }

  const h = hesapla(u);
  const tohumFiyat = satis(u.id);
  const urunFiyat = satis(u.urun);
  const saat = u.sure / 3600;

  // Aynı şehir/bonus ile tüm ürünleri sırala (fiyatı olanlar)
  const siralama = urunler()
    .map((x) => ({ u: x, ...hesapla(x) }))
    .filter((x) => satis(x.u.id) > 0 && satis(x.u.urun) > 0)
    .sort((a, b) => b.saatlik - a.saatlik)
    .slice(0, 8);

  kutu.innerHTML = `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      ${kart('Tohum maliyeti', sayi(h.maliyet), tohumFiyat ? `${sayi(tohumFiyat)} × (1−${tohumDonus}%)` : 'fiyat yok')}
      ${kart('Beklenen hasat', `${h.adet.toFixed(1)} adet`, `${u.az}–${u.cok} × (1+${bonus}%)`)}
      ${kart('Hasat geliri', sayi(h.gelir), urunFiyat ? `${sayi(urunFiyat)}/adet` : 'fiyat yok')}
      ${kart('Kâr / döngü', sayi(h.kar), `${saat.toFixed(1)} saat`, h.kar >= 0 ? 'color:#00d4aa' : 'color:#ff6b6b')}
      ${kart('Saatlik kâr', sayi(h.saatlik), `${u.focus} focus · T${u.t}`, h.saatlik >= 0 ? 'color:#00d4aa' : 'color:#ff6b6b')}
    </div>

    <div style="border:1px solid rgba(255,255,255,0.08);border-radius:9px;overflow:hidden">
      <div style="padding:7px 10px;font-size:10px;text-transform:uppercase;color:var(--text-muted);border-bottom:1px solid rgba(255,255,255,0.1)">
        ${sehir} için en kârlı 8 ürün (aynı bonus ve tohum dönüşüyle)
      </div>
      ${siralama.map((x) => `
        <div style="display:grid;grid-template-columns:1fr 90px 100px 100px;gap:8px;padding:6px 10px;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.05)">
          <span>T${x.u.t} · ${dil() === 'tr' ? x.u.n : x.u.e}</span>
          <span style="text-align:right;color:var(--text-muted)">T${x.u.t}</span>
          <span style="text-align:right">${sayi(x.kar)}</span>
          <span style="text-align:right;color:${x.saatlik >= 0 ? '#00d4aa' : '#ff6b6b'}">${sayi(x.saatlik)}/sa</span>
        </div>`).join('') || '<div style="padding:12px;font-size:12px;color:var(--text-muted)">Fiyat verisi yok.</div>'}
    </div>

    <p style="font-size:10.5px;color:var(--text-muted);margin-top:8px;line-height:1.7">
      ${u.tur === 'animal' ? '🐄 Hayvan' : '🌱 Bitki'} · büyüme ${(u.sure / 3600).toFixed(1)} saat · focus maliyeti ${u.focus} ·
      tohum dönüş şansı ${(u.tohumSans * 100).toFixed(0)}% · hasat başına ${u.fame} fame.
      Şehir bonusu veriden gelir (${sehir}: %${sehirBonusu()}); sulama/ada bonusunu elle ekleyebilirsiniz.
      Fiyatlar kalite 1 satış fiyatıdır; ada masrafları (tohum, su, işçi) hesaba katılmaz.
    </p>
  `;
}

function secimDoldur(): void {
  const secim = $('#ciftlikUrun') as HTMLSelectElement | null;
  if (!secim) return;
  const liste = urunler().slice().sort((a, b) => a.t - b.t || a.id.localeCompare(b.id));
  secim.innerHTML = liste.map((u) => `<option value="${u.id}">T${u.t} · ${dil() === 'tr' ? u.n : u.e}</option>`).join('');
  if (!secili || !liste.some((u) => u.id === secili)) secili = liste[0]?.id || '';
  secim.value = secili;
  bonus = sehirBonusu();
  tohumDonus = Math.round((kayit()?.tohumSans || 0) * 100);
  const b = $('#ciftlikBonus') as HTMLInputElement | null;
  if (b) b.value = String(bonus);
  const t = $('#ciftlikDonus') as HTMLInputElement | null;
  if (t) t.value = String(tohumDonus);
  ciz();
}

export function kur(): void {
  if (kuruldu) return;
  if (!$('#ciftlikUrun')) return;
  kuruldu = true;

  const sehirSecim = $('#ciftlikSehir') as HTMLSelectElement | null;
  if (sehirSecim) {
    sehirSecim.innerHTML = SEHIRLER.map((s) => `<option value="${s}">${s}</option>`).join('');
    sehirSecim.value = sehir;
    sehirSecim.addEventListener('change', () => {
      sehir = sehirSecim.value;
      bonus = sehirBonusu();
      const b = $('#ciftlikBonus') as HTMLInputElement | null;
      if (b) b.value = String(bonus);
      ciz();
    });
  }

  const secim = $('#ciftlikUrun') as HTMLSelectElement | null;
  secim?.addEventListener('change', () => {
    secili = secim.value;
    bonus = sehirBonusu();
    tohumDonus = Math.round((kayit()?.tohumSans || 0) * 100);
    const b = $('#ciftlikBonus') as HTMLInputElement | null;
    if (b) b.value = String(bonus);
    const t = $('#ciftlikDonus') as HTMLInputElement | null;
    if (t) t.value = String(tohumDonus);
    ciz();
    void fiyatlariCek();
  });

  $('#ciftlikBonus')?.addEventListener('input', (ev) => {
    bonus = Math.max(0, Math.min(200, Number((ev.target as HTMLInputElement).value) || 0));
    ciz();
  });
  $('#ciftlikDonus')?.addEventListener('input', (ev) => {
    tohumDonus = Math.max(0, Math.min(100, Number((ev.target as HTMLInputElement).value) || 0));
    ciz();
  });
  $('#ciftlikYenile')?.addEventListener('click', () => { void fiyatlariCek(); });

  document.querySelectorAll<HTMLElement>('.atolye-sekme[data-atolye="ciftlik"]').forEach((btn) => {
    btn.addEventListener('click', () => { kur(); if (!fiyatlar.size) void fiyatlariCek(); });
  });

  secimDoldur();
  void fiyatlariCek();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', kur, { once: true });
} else {
  kur();
}

export {};
