// AoT-PNASF — Üretim Kârı (Atölye → Üretim)
//
// Rafine, yemek, iksir ve kasap reçetelerini gerçek oyun verisinden
// (data/production-data.js ← ao-bin-dumps) okur; canlı market fiyatlarıyla
// malzeme maliyeti, gelir, kâr, marj ve saatlik kâr hesaplar.
//
// Geri dönüş oranı (resource return rate) kullanıcı tarafından ayarlanır:
// şehir bonusu + uzmanlık şehri eşleşmesi otomatik önerilir, elle değiştirilebilir.

interface Recete {
  n: string; e: string; t: number; lvl: number;
  cat: 'refine' | 'cook' | 'alchemy' | 'butcher';
  o: number; s: number; f: number; sec: number;
  m: [string, number][];
}
interface Sehir {
  id: string; ad: string; rafine: number; uretim: number;
  uzmanlik: string; uzmanlikOran: number; kasap: string; kasapOran: number;
}
interface Fiyat {
  item_id: string; city: string; quality: number;
  sell_price_min: number; buy_price_max: number;
}

const TIP: Record<string, { ad: string; simge: string }> = {
  refine: { ad: 'Rafine', simge: '⛏️' },
  cook: { ad: 'Yemek', simge: '🍲' },
  alchemy: { ad: 'İksir', simge: '⚗️' },
  butcher: { ad: 'Kasap', simge: '🥩' },
};
const SEHIRLER = ['Caerleon', 'Bridgewatch', 'Martlock', 'Thetford', 'Fort Sterling', 'Lymhurst', 'Brecilien', 'Black Market'];
const KAYNAK_ADI: Record<string, string> = {
  ore: 'Maden (ore)', wood: 'Odun (wood)', rock: 'Taş (rock)', hide: 'Deri (hide)', fiber: 'Elyaf (fiber)',
};

const $ = <T extends HTMLElement = HTMLElement>(s: string): T | null => document.querySelector<T>(s);
const dil = (): string => localStorage.getItem('aot-lang') || 'tr';
const sayi = (n: number): string => new Intl.NumberFormat('tr-TR').format(Math.round(n));
const yuzde = (n: number): string => `${(n * 100).toFixed(1)}%`;

const veri = (): { sehirler: Sehir[]; receteler: Record<string, Recete> } =>
  (window as any).AO_PRODUCTION || { sehirler: [], receteler: {} };

let tip: keyof typeof TIP = 'refine';
let secili = '';
let sehir = 'Caerleon';
let geriDonus = 18;
let istasyonUcreti = 0;
let fiyatlar = new Map<string, Fiyat[]>();
let sonIstek = 0;
let yukleniyor = false;
let kuruldu = false;

function sunucu(): string {
  const harita: Record<string, string> = {
    europe: 'europe.albion-online-data.com',
    americas: 'west.albion-online-data.com',
    asia: 'east.albion-online-data.com',
  };
  return harita[localStorage.getItem('aot-server') || 'europe'] || harita.europe;
}

function kaynakKategorisi(receteId: string): string {
  if (receteId.includes('METALBAR') || receteId.includes('ORE')) return 'ore';
  if (receteId.includes('PLANKS') || receteId.includes('WOOD')) return 'wood';
  if (receteId.includes('STONEBLOCK') || receteId.includes('ROCK')) return 'rock';
  if (receteId.includes('LEATHER') || receteId.includes('HIDE')) return 'hide';
  if (receteId.includes('CLOTH') || receteId.includes('FIBER')) return 'fiber';
  return '';
}

function kategoriListesi(): [string, Recete][] {
  return Object.entries(veri().receteler)
    .filter(([, r]) => r.cat === tip && r.t >= 2)
    .sort((a, b) => a[1].t - b[1].t || (a[1].lvl || 0) - (b[1].lvl || 0));
}

function etiket(id: string, r: Recete): string {
  const seviye = r.lvl ? ` .${r.lvl}` : '';
  return `T${r.t}${seviye} · ${dil() === 'tr' ? r.n : r.e}`;
}

function enIyiSatis(id: string): Fiyat | null {
  const liste = (fiyatlar.get(id) || []).filter((f) => f.sell_price_min > 0);
  return liste.sort((a, b) => a.sell_price_min - b.sell_price_min)[0] || null;
}
function enIyiAlis(id: string): Fiyat | null {
  const liste = (fiyatlar.get(id) || []).filter((f) => f.buy_price_max > 0);
  return liste.sort((a, b) => b.buy_price_max - a.buy_price_max)[0] || null;
}

async function fiyatlariCek(): Promise<void> {
  const recete = veri().receteler[secili];
  if (!recete || yukleniyor) return;
  const kimlikler = Array.from(new Set([secili, ...recete.m.map(([id]) => id)]));
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
    durum('Fiyatlar alınamadı — bağlantıyı kontrol edip yeniden deneyin.');
  } finally {
    yukleniyor = false;
  }
}

function durum(mesaj: string): void {
  const el = $('#uretimDurum');
  if (el) el.textContent = mesaj;
}

function otomatikOran(): number {
  const recete = veri().receteler[secili];
  const s = veri().sehirler.find((x) => x.ad === sehir);
  if (!recete || !s) return 0;
  if (recete.cat === 'refine') {
    const kategori = kaynakKategorisi(secili);
    return Math.round((s.rafine + (s.uzmanlik === kategori ? s.uzmanlikOran : 0)) * 100);
  }
  if (recete.cat === 'butcher') {
    return Math.round((s.uretim + s.kasapOran) * 100);
  }
  return Math.round(s.uretim * 100);
}

function kontrolKur(): void {
  const secim = $('#uretimRecete') as HTMLSelectElement | null;
  if (!secim) return;

  document.querySelectorAll<HTMLElement>('[data-uretim-tip]').forEach((btn) => {
    btn.addEventListener('click', () => {
      tip = btn.dataset.uretimTip as keyof typeof TIP;
      document.querySelectorAll<HTMLElement>('[data-uretim-tip]').forEach((b) => b.classList.toggle('active', b === btn));
      secimDoldur();
    });
  });

  const sehirSecim = $('#uretimSehir') as HTMLSelectElement | null;
  if (sehirSecim) {
    sehirSecim.value = sehir;
    sehirSecim.addEventListener('change', () => {
      sehir = sehirSecim.value;
      geriDonus = otomatikOran();
      const oran = $('#uretimOran') as HTMLInputElement | null;
      if (oran) oran.value = String(geriDonus);
      ciz();
    });
  }

  secim.addEventListener('change', () => {
    secili = secim.value;
    geriDonus = otomatikOran();
    const oran = $('#uretimOran') as HTMLInputElement | null;
    if (oran) oran.value = String(geriDonus);
    ciz();
    void fiyatlariCek();
  });

  $('#uretimOran')?.addEventListener('input', (ev) => {
    geriDonus = Math.max(0, Math.min(90, Number((ev.target as HTMLInputElement).value) || 0));
    ciz();
  });
  $('#uretimUcret')?.addEventListener('input', (ev) => {
    istasyonUcreti = Math.max(0, Number((ev.target as HTMLInputElement).value) || 0);
    ciz();
  });
  $('#uretimYenile')?.addEventListener('click', () => { void fiyatlariCek(); });

  document.querySelectorAll<HTMLElement>('.atolye-sekme[data-atolye="uretim"]').forEach((btn) => {
    btn.addEventListener('click', () => { kur(); if (!fiyatlar.size) void fiyatlariCek(); });
  });
}

function secimDoldur(): void {
  const secim = $('#uretimRecete') as HTMLSelectElement | null;
  if (!secim) return;
  const liste = kategoriListesi();
  secim.innerHTML = liste
    .map(([id, r]) => `<option value="${id}">${etiket(id, r)}</option>`)
    .join('');
  const mevcut = liste.find(([id]) => id === secili);
  // Varsayılan: T4 taban reçete (yoksa ilk kayıt)
  const varsayilan = liste.find(([id, r]) => r.t === 4 && !r.lvl) || liste.find(([, r]) => !r.lvl) || liste[0];
  secili = mevcut ? secili : (varsayilan?.[0] || '');
  if (secili) secim.value = secili;
  geriDonus = otomatikOran();
  const oran = $('#uretimOran') as HTMLInputElement | null;
  if (oran) oran.value = String(geriDonus);
  ciz();
  if (secili) void fiyatlariCek();
}

function kart(baslik: string, deger: string, alt = '', renk = ''): string {
  return `<div style="flex:1;min-width:132px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:10px 12px">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted)">${baslik}</div>
    <div style="font-size:17px;font-weight:800;margin-top:3px;${renk}">${deger}</div>
    ${alt ? `<div style="font-size:10px;color:var(--text-muted);margin-top:2px">${alt}</div>` : ''}
  </div>`;
}

function ciz(): void {
  const kutu = $('#uretimSonuc');
  if (!kutu) return;
  const recete = veri().receteler[secili];
  if (!recete) {
    kutu.innerHTML = '<p style="padding:16px;font-size:12px;color:var(--text-muted)">Reçete seçin.</p>';
    return;
  }

  const oran = Math.max(0, Math.min(0.9, geriDonus / 100));
  let maliyet = 0;
  const malzemeSatirlari = recete.m.map(([id, adet]) => {
    const enUcuz = enIyiSatis(id);
    const birim = enUcuz?.sell_price_min || 0;
    const net = adet * (1 - oran);
    maliyet += birim * net;
    return { id, adet, birim, net, sehir: enUcuz?.city || '—' };
  });

  const satis = enIyiSatis(secili);
  const alis = enIyiAlis(secili);
  const toplamMaliyet = maliyet + istasyonUcreti;
  const gelir = recete.o * (satis?.sell_price_min || 0);
  const gelirAninda = recete.o * (alis?.buy_price_max || 0);
  const kar = gelir - toplamMaliyet;
  const karAninda = gelirAninda - toplamMaliyet;
  const birimKar = kar / recete.o;
  const marj = gelir > 0 ? kar / gelir : 0;
  const sureDk = recete.sec; // veri dakika cinsinden
  const saatlik = sureDk > 0 ? (kar / (sureDk / 60)) : 0;

  const fiyatYok = !satis && !alis;

  kutu.innerHTML = `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      ${kart('Malzeme maliyeti', sayi(toplamMaliyet), `geri dönüş ${yuzde(oran)} · ücret ${sayi(istasyonUcreti)}`)}
      ${kart('Gelir (pazar)', sayi(gelir), satis ? `${satis.city} · ${sayi(satis.sell_price_min)}/adet` : 'fiyat yok')}
      ${kart('Kâr / işlem', sayi(kar), karAninda !== kar ? `anında satışta ${sayi(karAninda)}` : '', kar >= 0 ? 'color:#00d4aa' : 'color:#ff6b6b')}
      ${kart('Kâr / adet', sayi(birimKar), `marj ${yuzde(marj)}`)}
      ${kart('Saatlik kâr', sayi(saatlik), `${recete.o} adet / ${sureDk} dk`)}
    </div>

    ${fiyatYok ? '<p style="font-size:11.5px;color:#ffb84d;margin-bottom:8px">Bu eşya için fiyat bulunamadı; farklı bir reçete deneyin veya yenileyin.</p>' : ''}

    <div style="border:1px solid rgba(255,255,255,0.08);border-radius:9px;overflow:hidden">
      <div style="display:grid;grid-template-columns:1fr 70px 110px 110px;gap:8px;padding:6px 10px;font-size:10px;text-transform:uppercase;color:var(--text-muted);border-bottom:1px solid rgba(255,255,255,0.1)">
        <span>Malzeme</span><span style="text-align:right">Adet</span><span style="text-align:right">Birim</span><span style="text-align:right">Maliyet</span>
      </div>
      ${malzemeSatirlari.map((m) => `
        <div style="display:grid;grid-template-columns:1fr 70px 110px 110px;gap:8px;padding:6px 10px;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.05)">
          <span>${dil() === 'tr' ? (veri().receteler[m.id]?.n || m.id) : (veri().receteler[m.id]?.e || m.id)}
            <span style="color:var(--text-muted);font-size:10px">${m.sehir}</span></span>
          <span style="text-align:right">${m.adet}${oran > 0 ? ` <span style="color:#00d4aa;font-size:10px">(−${(m.adet * oran).toFixed(1)})</span>` : ''}</span>
          <span style="text-align:right">${m.birim ? sayi(m.birim) : '<span style="color:#ff6b6b">yok</span>'}</span>
          <span style="text-align:right">${m.birim ? sayi(m.birim * m.net) : '—'}</span>
        </div>`).join('')}
    </div>

    <p style="font-size:10.5px;color:var(--text-muted);margin-top:8px;line-height:1.7">
      ${TIP[recete.cat].simge} ${TIP[recete.cat].ad} · ${sehir} · ${recete.o} adet çıktı · ${recete.f} focus ·
      ${recete.s > 0 ? `${sayi(recete.s)} gümüş reçete ücreti · ` : ''}süre ${recete.sec} dk (oyun verisi).
      Geri dönüş oranı şehir bonusu + uzmanlık eşleşmesinden önerilir; focus ve kalite farkını elle ayarlayabilirsiniz.
      ${recete.cat === 'refine' && KAYNAK_ADI[kaynakKategorisi(secili)] ? `Bu şehirde <strong>${KAYNAK_ADI[kaynakKategorisi(secili)]}</strong> uzmanlığı geçerli.` : ''}
    </p>
  `;
}

export function kur(): void {
  if (kuruldu) return;
  if (!$('#uretimRecete')) return;
  kuruldu = true;

  const sehirSecim = $('#uretimSehir') as HTMLSelectElement | null;
  const s = veri();
  if (sehirSecim) {
    sehirSecim.innerHTML = s.sehirler.map((x) => `<option value="${x.ad}">${x.ad}</option>`).join('');
    sehirSecim.value = sehir;
  }
  secimDoldur();
  kontrolKur();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', kur, { once: true });
} else {
  kur();
}

export {};
