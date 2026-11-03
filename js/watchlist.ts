// AoT-PNASF — Fiyat Takip Listesi (Araçlar → Fiyat Takibi)
//
// Rakiplerde (albionfreemarket, albionanalyser, albioncodex) standart olan
// "izleme listesi" bizde yoktu. Bu modül eşyaları listeye ekler, tüm
// şehirlerin en iyi satış/alış fiyatını tek istekle çeker ve hedef fiyat
// girildiğinde hedefe ulaşınca satırı işaretler.
//
// Veri: albion-online-data.com (window.AOTMarketNetwork üzerinden, önbellekli).

interface TakipKaydi {
  id: string;        // taban kimlik: MAIN_SWORD
  ad: string;        // görünen ad
  tier: number;
  ench: number;
  hedef?: number;    // hedef satış fiyatı (gümüş)
}

interface FiyatSatiri {
  item_id: string;
  city: string;
  quality: number;
  sell_price_min: number;
  sell_price_min_date: string;
  buy_price_max: number;
  buy_price_max_date: string;
}

const DEPO_ANAHTARI = 'aot-watchlist';
const SEHIRLER = [
  'Caerleon', 'Bridgewatch', 'Martlock', 'Thetford', 'Fort Sterling', 'Lymhurst',
  'Brecilien', 'Black Market',
];
const AZAMI_KAYIT = 40;
const BAYAT_MS = 5 * 60 * 1000;

let kayitlar: TakipKaydi[] = [];
let fiyatlar = new Map<string, FiyatSatiri[]>();
let sonGuncelleme = 0;
let yukleniyor = false;
let kuruldu = false;

const $ = <T extends HTMLElement = HTMLElement>(sel: string): T | null => document.querySelector<T>(sel);
const dil = (): string => localStorage.getItem('aot-lang') || 'tr';

function sayi(n: number): string {
  return new Intl.NumberFormat('tr-TR').format(Math.round(n));
}

function tamKimlik(kayit: TakipKaydi): string {
  const tier = `T${kayit.tier}`;
  const ench = kayit.ench > 0 ? `_LEVEL${kayit.ench}` : '';
  // AO_ITEMS kimlikleri taban (tier'sız); bazı kayıtlar zaten T8_ ile gelebilir.
  const taban = kayit.id.replace(/^T\d+_/, '').replace(/_LEVEL\d+$/, '');
  return `${tier}_${taban}${ench}`;
}

function adGoster(kayit: TakipKaydi): string {
  return `${kayit.ad}${kayit.ench > 0 ? ` .${kayit.ench}` : ''} · T${kayit.tier}`;
}

function yukle(): void {
  try {
    const ham = JSON.parse(localStorage.getItem(DEPO_ANAHTARI) || '[]');
    kayitlar = Array.isArray(ham)
      ? ham.filter((k: any) => k && typeof k.id === 'string').slice(0, AZAMI_KAYIT).map((k: any) => ({
          id: String(k.id),
          ad: String(k.ad || k.id),
          tier: Number(k.tier) || 8,
          ench: Number(k.ench) || 0,
          hedef: Number(k.hedef) > 0 ? Number(k.hedef) : undefined,
        }))
      : [];
  } catch {
    kayitlar = [];
  }
}

function kaydet(): void {
  try {
    localStorage.setItem(DEPO_ANAHTARI, JSON.stringify(kayitlar));
  } catch { /* depolama kapalı */ }
}

function aktifSunucu(): string {
  const s = localStorage.getItem('aot-server') || 'europe';
  const harita: Record<string, string> = {
    europe: 'europe.albion-online-data.com',
    americas: 'west.albion-online-data.com',
    asia: 'east.albion-online-data.com',
  };
  return (window as any).AppConfig?.server ? harita[(window as any).AppConfig.server] || harita.europe : harita[s] || harita.europe;
}

async function fiyatCek(): Promise<void> {
  if (yukleniyor || !kayitlar.length) return;
  yukleniyor = true;
  baslikGuncelle('Fiyatlar alınıyor…');

  const kimlikler = Array.from(new Set(kayitlar.map(tamKimlik)));
  const url = `https://${aktifSunucu()}/api/v2/stats/prices/${kimlikler.join(',')}.json`
    + `?locations=${encodeURIComponent(SEHIRLER.join(','))}&qualities=1`;

  try {
    const istek = (window as any).AOTMarketNetwork?.request;
    if (typeof istek !== 'function') throw new Error('market katmanı hazır değil');
    // AOTMarketNetwork.request önbellekli bir yanıt nesnesi döndürür (fetch benzeri).
    const yanit = await istek(url);
    const veri = typeof yanit?.json === 'function' ? await yanit.json() : yanit;
    const satirlar: FiyatSatiri[] = Array.isArray(veri) ? veri : [];
    fiyatlar = new Map();
    for (const satir of satirlar) {
      if (!satir?.item_id) continue;
      const liste = fiyatlar.get(satir.item_id) || [];
      liste.push(satir);
      fiyatlar.set(satir.item_id, liste);
    }
    sonGuncelleme = Date.now();
    ciz();
    baslikGuncelle(null);
  } catch {
    baslikGuncelle(dil() === 'tr'
      ? 'Fiyatlar alınamadı. İnternet bağlantınızı kontrol edip yeniden deneyin.'
      : 'Prices could not be loaded. Check your connection and retry.');
    if (!fiyatlar.size) ciz();
  } finally {
    yukleniyor = false;
  }
}

function enIyiSatis(satirlar: FiyatSatiri[] | undefined): FiyatSatiri | null {
  if (!satirlar?.length) return null;
  return satirlar
    .filter((s) => s.sell_price_min > 0)
    .sort((a, b) => a.sell_price_min - b.sell_price_min)[0] || null;
}

function enIyiAlis(satirlar: FiyatSatiri[] | undefined): FiyatSatiri | null {
  if (!satirlar?.length) return null;
  return satirlar
    .filter((s) => s.buy_price_max > 0)
    .sort((a, b) => b.buy_price_max - a.buy_price_max)[0] || null;
}

function baslikGuncelle(mesaj: string | null): void {
  const el = $('#watchMeta');
  if (!el) return;
  if (mesaj) { el.textContent = mesaj; return; }
  const zaman = sonGuncelleme
    ? new Date(sonGuncelleme).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    : '—';
  el.textContent = `${kayitlar.length} eşya takipte · son güncelleme ${zaman}`;
}

function satirOlustur(kayit: TakipKaydi): HTMLElement {
  const satirlar = fiyatlar.get(tamKimlik(kayit));
  const satis = enIyiSatis(satirlar);
  const alis = enIyiAlis(satirlar);
  const hedefeUlasildi = Boolean(kayit.hedef && satis && satis.sell_price_min <= kayit.hedef);

  const satir = document.createElement('div');
  satir.className = 'watch-row';
  satir.dataset.id = kayit.id;
  satir.style.cssText = [
    'display:grid',
    'grid-template-columns:40px minmax(140px,1.6fr) minmax(120px,1fr) minmax(120px,1fr) minmax(110px,0.9fr) 34px',
    'align-items:center',
    'gap:10px',
    'padding:8px 10px',
    'border-bottom:1px solid rgba(255,255,255,0.07)',
    kayit.hedef ? (hedefeUlasildi ? 'background:rgba(0,212,170,0.12)' : '') : '',
  ].filter(Boolean).join(';');

  const ikon = (window as any).aoItemImg?.(kayit.id, kayit.tier, kayit.ench, 40) || '';
  satir.innerHTML = `
    <img src="${ikon}" alt="" loading="lazy" width="34" height="34" style="border-radius:6px;background:rgba(255,255,255,0.04)">
    <div style="min-width:0">
      <div style="font-weight:700;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${adGoster(kayit)}</div>
      <div style="font-size:10px;color:var(--text-muted);font-family:ui-monospace,monospace">${tamKimlik(kayit)}</div>
    </div>
    <div style="font-size:12px">
      <div style="color:var(--text-muted);font-size:10px">En iyi satış</div>
      ${satis
        ? `<strong style="color:${hedefeUlasildi ? '#00d4aa' : 'var(--accent)'}">${sayi(satis.sell_price_min)}</strong> <span style="color:var(--text-muted);font-size:10px">${satis.city}</span>`
        : '<span style="color:var(--text-muted)">veri yok</span>'}
    </div>
    <div style="font-size:12px">
      <div style="color:var(--text-muted);font-size:10px">En iyi alış</div>
      ${alis
        ? `<strong>${sayi(alis.buy_price_max)}</strong> <span style="color:var(--text-muted);font-size:10px">${alis.city}</span>`
        : '<span style="color:var(--text-muted)">veri yok</span>'}
    </div>
    <label style="font-size:10px;color:var(--text-muted);display:block">
      Hedef
      <input type="number" min="0" step="1000" value="${kayit.hedef ?? ''}" placeholder="—"
        data-hedef="${kayit.id}"
        style="width:100%;margin-top:2px;background:#141414;border:1px solid #333;border-radius:5px;padding:3px 6px;color:#fff;font-size:11px">
      ${hedefeUlasildi ? '<span style="color:#00d4aa;font-weight:700">🎯 hedefte</span>' : ''}
    </label>
    <button type="button" data-sil="${kayit.id}" aria-label="${kayit.ad} takipten çıkar"
      style="background:transparent;border:0;color:#a3a3a3;cursor:pointer;font-size:15px">✕</button>
  `;

  satir.querySelector<HTMLInputElement>('[data-hedef]')?.addEventListener('change', (ev) => {
    const hedef = Number((ev.target as HTMLInputElement).value);
    const kayitIndex = kayitlar.findIndex((k) => k.id === kayit.id);
    if (kayitIndex < 0) return;
    kayitlar[kayitIndex].hedef = hedef > 0 ? hedef : undefined;
    kaydet();
    ciz();
  });

  satir.querySelector<HTMLButtonElement>('[data-sil]')?.addEventListener('click', () => {
    kayitlar = kayitlar.filter((k) => k.id !== kayit.id);
    kaydet();
    ciz();
    baslikGuncelle(null);
  });

  return satir;
}

function ciz(): void {
  const tablo = $('#watchTable');
  if (!tablo) return;

  if (!kayitlar.length) {
    tablo.innerHTML = `
      <div style="padding:22px 16px;text-align:center;color:var(--text-muted);font-size:12.5px;line-height:1.8">
        Takip listesi boş. Yukarıdan eşya arayıp ekleyin; fiyatlar tüm şehirler için tek istekle çekilir.<br>
        <button type="button" id="watchOrnek" style="margin-top:10px;background:var(--accent);color:#141006;border:0;border-radius:7px;padding:7px 12px;font:700 11px/1 system-ui;cursor:pointer">
          Örnek liste ekle (T8 kılıç, T8 pelerin, T6 iksir)
        </button>
      </div>`;
    tablo.querySelector('#watchOrnek')?.addEventListener('click', () => {
      ornekEkle();
    });
    return;
  }

  tablo.innerHTML = '';
  const basliklar = document.createElement('div');
  basliklar.style.cssText = 'display:grid;grid-template-columns:40px minmax(140px,1.6fr) minmax(120px,1fr) minmax(120px,1fr) minmax(110px,0.9fr) 34px;gap:10px;padding:6px 10px;font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted);border-bottom:1px solid rgba(255,255,255,0.12)';
  basliklar.innerHTML = '<span></span><span>Eşya</span><span>Satış</span><span>Alış</span><span>Hedef</span><span></span>';
  tablo.appendChild(basliklar);
  for (const kayit of kayitlar) tablo.appendChild(satirOlustur(kayit));

  const alt = document.createElement('div');
  alt.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:10px;font-size:11px;color:var(--text-muted)';
  const alarmSayisi = kayitlar.filter((k) => {
    const s = enIyiSatis(fiyatlar.get(tamKimlik(k)));
    return Boolean(k.hedef && s && s.sell_price_min <= k.hedef);
  }).length;
  alt.innerHTML = `<span>${alarmSayisi ? `🎯 ${alarmSayisi} eşya hedef fiyatta` : 'Hedef fiyat girerek alarm kurabilirsiniz.'}</span>
    <button type="button" id="watchTemizle" style="background:transparent;border:1px solid #3a3a3a;color:#a3a3a3;border-radius:6px;padding:4px 9px;font-size:10.5px;cursor:pointer">Listeyi temizle</button>`;
  alt.querySelector('#watchTemizle')?.addEventListener('click', () => {
    kayitlar = [];
    kaydet();
    fiyatlar.clear();
    ciz();
    baslikGuncelle(null);
  });
  tablo.appendChild(alt);
}

function ornekEkle(): void {
  const ekle = (id: string, ad: string, tier: number, ench = 0) => {
    if (kayitlar.some((k) => k.id === id && k.tier === tier && k.ench === ench)) return;
    if (kayitlar.length >= AZAMI_KAYIT) return;
    kayitlar.push({ id, ad, tier, ench });
  };
  ekle('MAIN_SWORD', dil() === 'tr' ? 'Kılıç' : 'Sword', 8);
  ekle('CAPE', dil() === 'tr' ? 'Pelerin' : 'Cape', 8);
  ekle('POTION_HEAL', dil() === 'tr' ? 'İyileştirme İksiri' : 'Healing Potion', 6);
  kaydet();
  ciz();
  void fiyatCek();
}

function onerileriGizle(): void {
  const kutu = $('#watchSuggest');
  if (kutu) { kutu.style.display = 'none'; kutu.innerHTML = ''; }
}

function oneriGoster(sorgu: string): void {
  const kutu = $('#watchSuggest');
  if (!kutu) return;
  const q = sorgu.trim().toLowerCase();
  if (q.length < 2) { onerileriGizle(); return; }

  const esyalar: any[] = Array.isArray((window as any).AO_ITEMS) ? (window as any).AO_ITEMS : [];
  const bulunan = esyalar
    .filter((e) => `${e.tr || ''} ${e.en || ''} ${e.id || ''}`.toLowerCase().includes(q))
    .slice(0, 8);

  if (!bulunan.length) {
    kutu.innerHTML = '<div style="padding:8px 10px;font-size:11px;color:#a3a3a3">Eşya bulunamadı</div>';
    kutu.style.display = 'block';
    return;
  }

  kutu.innerHTML = '';
  for (const esya of bulunan) {
    const tier = Array.isArray(esya.tiers) && esya.tiers.length ? Math.max(...esya.tiers) : 8;
    const ad = dil() === 'tr' ? (esya.tr || esya.en || esya.id) : (esya.en || esya.tr || esya.id);
    const ikon = (window as any).aoItemImg?.(esya.id, tier, 0, 32) || '';
    const secenek = document.createElement('button');
    secenek.type = 'button';
    secenek.setAttribute('role', 'option');
    secenek.style.cssText = 'display:flex;align-items:center;gap:8px;width:100%;background:transparent;border:0;padding:6px 10px;color:#f5f5f5;font-size:12px;text-align:left;cursor:pointer';
    secenek.innerHTML = `<img src="${ikon}" alt="" width="24" height="24" loading="lazy" style="border-radius:5px">
      <span style="flex:1">${ad}</span><span style="font-size:10px;color:#a3a3a3">T${tier}</span>`;
    secenek.addEventListener('mouseenter', () => { secenek.style.background = 'rgba(212,175,55,0.14)'; });
    secenek.addEventListener('mouseleave', () => { secenek.style.background = 'transparent'; });
    secenek.addEventListener('click', () => {
      if (kayitlar.length >= AZAMI_KAYIT) {
        baslikGuncelle(`Liste dolu (en fazla ${AZAMI_KAYIT} eşya).`);
        return;
      }
      if (kayitlar.some((k) => k.id === esya.id)) {
        baslikGuncelle(`${ad} zaten listede.`);
        return;
      }
      kayitlar.push({ id: String(esya.id), ad, tier, ench: 0 });
      kaydet();
      const arama = $('#watchSearch') as HTMLInputElement | null;
      if (arama) arama.value = '';
      onerileriGizle();
      ciz();
      void fiyatCek();
    });
    kutu.appendChild(secenek);
  }
  kutu.style.display = 'block';
}

function kur(): void {
  if (kuruldu) return;
  const arama = $('#watchSearch') as HTMLInputElement | null;
  if (!arama) return;
  kuruldu = true;
  yukle();

  arama.addEventListener('input', () => oneriGoster(arama.value));
  arama.addEventListener('focus', () => { if (arama.value.trim().length >= 2) oneriGoster(arama.value); });
  document.addEventListener('click', (ev) => {
    if (!(ev.target as HTMLElement)?.closest('#watchSearch, #watchSuggest')) onerileriGizle();
  });

  $('#watchRefresh')?.addEventListener('click', () => { void fiyatCek(); });

  document.querySelectorAll<HTMLElement>('.tools-tab[data-tool-tab="watch"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      kur();
      ciz();
      baslikGuncelle(null);
      if (!sonGuncelleme || Date.now() - sonGuncelleme > BAYAT_MS) void fiyatCek();
    });
  });

  ciz();
  baslikGuncelle(null);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', kur, { once: true });
} else {
  kur();
}

export {};
