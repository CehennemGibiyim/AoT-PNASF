// AoT-PNASF — Yetenek Veritabanı (Atölye → Yetenekler)
//
// data/spells-db.js (ao-bin-dumps spells.json + localization TR-TR) tembel
// yüklenir: 492 oyuncu yeteneğinin Türkçe adı, açıklaması, enerji/cooldown,
// cast süresi, menzili ve hedef tipi aranabilir. Yaratık/sistem yetenekleri
// veri üretiminde ayıklanır.

const $ = <T extends HTMLElement = HTMLElement>(s: string): T | null => document.querySelector<T>(s);
const sayi = (n: number): string => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(Number(n) || 0);
const metin = (s: string): string => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] || c));

interface Yetenek {
  id: string; ad: string; aciklama: string; tur: string;
  enerji: number; cast: number; cd: number; menzil: number; hedef: string;
}

let yukleme: Promise<Yetenek[]> | null = null;
let veri: Yetenek[] = [];
let gosterilen = 60;
let acik: string | null = null;
let kuruldu = false;

function yukle(): Promise<Yetenek[]> {
  if (veri.length) return Promise.resolve(veri);
  if (yukleme) return yukleme;
  yukleme = new Promise((cozum, hata) => {
    const hazir = (window as any).AO_SPELLS;
    const isle = (ham: any) => {
      veri = (Array.isArray(ham) ? ham : []).map(satirdan);
      cozum(veri);
    };
    if (Array.isArray(hazir)) { isle(hazir); return; }
    const betik = document.createElement('script');
    betik.src = 'data/spells-db.js';
    betik.async = true;
    betik.onload = () => isle((window as any).AO_SPELLS);
    betik.onerror = () => hata(new Error('Yetenek verisi yüklenemedi'));
    document.head.appendChild(betik);
  });
  return yukleme;
}

function satirdan(ham: any): Yetenek {
  // [id, ad, aciklama, tur, enerji, cast, cd, menzil, hedef]
  if (Array.isArray(ham)) {
    return {
      id: String(ham[0] || ''), ad: String(ham[1] || ''), aciklama: String(ham[2] || ''), tur: String(ham[3] || ''),
      enerji: Number(ham[4]) || 0, cast: Number(ham[5]) || 0, cd: Number(ham[6]) || 0,
      menzil: Number(ham[7]) || 0, hedef: String(ham[8] || ''),
    };
  }
  return { id: '', ad: '', aciklama: '', tur: '', enerji: 0, cast: 0, cd: 0, menzil: 0, hedef: '' };
}

function filtrele(): Yetenek[] {
  const arama = (($('#yetenekArama') as HTMLInputElement)?.value || '').trim().toLowerCase();
  const tur = ($('#yetenekTur') as HTMLSelectElement)?.value || '';
  return veri.filter((y) =>
    (!tur || y.tur === tur)
    && (!arama || y.ad.toLowerCase().includes(arama) || y.aciklama.toLowerCase().includes(arama))
  );
}

function satir(y: Yetenek): string {
  const detay = acik === y.id
    ? `<div style="padding:8px 10px 10px;font-size:11.5px;line-height:1.65;color:var(--text-muted);border-top:1px solid rgba(255,255,255,0.06)">
        ${y.aciklama ? metin(y.aciklama) : 'Bu yetenek için açıklama metni dökümde yok.'}
        <div style="margin-top:4px;font-size:10px;opacity:0.7">Hasar/süre değerleri item power'a göre ölçeklenir; dökümde ham değer tutulmaz. Kimlik: ${metin(y.id)}</div>
      </div>`
    : '';
  return `<div class="yetenek-kayit" data-yetenek="${metin(y.id)}">
    <div style="display:grid;grid-template-columns:1fr 58px 66px 56px 56px 62px;gap:8px;padding:6px 10px;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.05);align-items:center;cursor:pointer">
      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${metin(y.ad)}">${acik === y.id ? '▾' : '▸'} ${metin(y.ad)}</span>
      <span style="color:var(--text-muted);font-size:10.5px">${metin(y.tur)}</span>
      <span style="text-align:right;color:#7db8ff" title="Enerji">⚡ ${y.enerji ? sayi(y.enerji) : '—'}</span>
      <span style="text-align:right;color:var(--text-muted)" title="Cast süresi">${y.cast ? sayi(y.cast) + 's' : '—'}</span>
      <span style="text-align:right;color:var(--text-muted)" title="Cooldown">${y.cd ? sayi(y.cd) + 's' : '—'}</span>
      <span style="text-align:right;color:var(--text-muted)" title="Menzil">${y.menzil ? sayi(y.menzil) : '—'}</span>
    </div>
    ${detay}
  </div>`;
}

function ciz(): void {
  const kutu = $('#yetenekListe');
  if (!kutu) return;
  const liste = filtrele();
  const dilim = liste.slice(0, gosterilen);
  kutu.innerHTML = `
    <div style="display:flex;justify-content:space-between;padding:7px 10px;font-size:10.5px;color:var(--text-muted);border-bottom:1px solid rgba(255,255,255,0.1)">
      <span>${sayi(liste.length)} yetenek bulundu</span><span>${veri.length ? sayi(veri.length) + ' kayıt yüklü' : ''}</span>
    </div>
    ${dilim.map(satir).join('') || '<div style="padding:14px;font-size:12px;color:var(--text-muted)">Eşleşen yetenek yok.</div>'}
    ${liste.length > gosterilen ? `<div style="padding:8px 10px"><button type="button" id="yetenekDaha" style="background:transparent;border:1px solid #3a3a3a;color:#ccc;border-radius:6px;padding:5px 10px;font-size:11px;cursor:pointer">Daha fazla göster (${sayi(liste.length - gosterilen)})</button></div>` : ''}
  `;
  kutu.querySelector('#yetenekDaha')?.addEventListener('click', () => { gosterilen += 100; ciz(); });
  kutu.querySelectorAll<HTMLElement>('.yetenek-kayit').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.dataset.yetenek || null;
      acik = acik === id ? null : id;
      ciz();
    });
  });
}

export function kur(): void {
  if (kuruldu) return;
  if (!$('#yetenekArama')) return;
  kuruldu = true;

  const durum = $('#yetenekDurum');
  if (durum) durum.textContent = 'Yetenek verisi yükleniyor…';

  void yukle().then(() => {
    if (durum) durum.textContent = `${sayi(veri.length)} yetenek yüklendi · ao-bin-dumps + TR yerelleştirme`;
    ciz();
  }).catch(() => {
    if (durum) durum.textContent = 'Yetenek verisi yüklenemedi.';
  });

  $('#yetenekArama')?.addEventListener('input', () => { gosterilen = 60; ciz(); });
  $('#yetenekTur')?.addEventListener('change', () => { gosterilen = 60; ciz(); });

  document.querySelectorAll<HTMLElement>('.atolye-sekme[data-atolye="yetenekler"]').forEach((btn) => {
    btn.addEventListener('click', () => kur());
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', kur, { once: true });
} else {
  kur();
}

export {};
