// AoT-PNASF — Yaratık Veritabanı (Atölye → Yaratıklar)
//
// data/mobs-data.js (ao-bin-dumps mobs.json) tembel yüklenir: 5.479 yaratığın
// adı, tier'ı, faction'ı, canı, hasarı ve fame değeri aranabilir.
// Aynı yükleyiciyi fame planlayıcı da kullanır (window.AOTMobs).

const $ = <T extends HTMLElement = HTMLElement>(s: string): T | null => document.querySelector<T>(s);
const sayi = (n: number): string => new Intl.NumberFormat('tr-TR').format(Math.round(n));

interface Mob { ad: string; tier: number; faction: string; can: number; hasar: number; fame: number; kategori: string; }

let yukleme: Promise<Mob[]> | null = null;
let veri: Mob[] = [];
let gosterilen = 50;
let kuruldu = false;

export function yukle(): Promise<Mob[]> {
  if (veri.length) return Promise.resolve(veri);
  if (yukleme) return yukleme;
  yukleme = new Promise((cozum, hata) => {
    const mevcut = (window as any).AO_MOBS;
    if (Array.isArray(mevcut)) {
      veri = mevcut.map(satirdan);
      cozum(veri);
      return;
    }
    const betik = document.createElement('script');
    betik.src = 'data/mobs-data.js';
    betik.async = true;
    betik.onload = () => {
      veri = ((window as any).AO_MOBS || []).map(satirdan);
      cozum(veri);
    };
    betik.onerror = () => hata(new Error('Yaratık verisi yüklenemedi'));
    document.head.appendChild(betik);
  });
  return yukleme;
}

function satirdan(ham: any): Mob {
  // [ad, tier, faction, can, hasar, fame, kategori]
  if (Array.isArray(ham)) {
    return { ad: String(ham[0] || ''), tier: Number(ham[1]) || 0, faction: String(ham[2] || ''), can: Number(ham[3]) || 0, hasar: Number(ham[4]) || 0, fame: Number(ham[5]) || 0, kategori: String(ham[6] || '') };
  }
  return { ad: String(ham.ad || ''), tier: Number(ham.tier) || 0, faction: String(ham.faction || ''), can: Number(ham.can) || 0, hasar: Number(ham.hasar) || 0, fame: Number(ham.fame) || 0, kategori: String(ham.kategori || '') };
}

function filtrele(): Mob[] {
  const arama = (($('#mobArama') as HTMLInputElement)?.value || '').trim().toLowerCase();
  const tier = ($('#mobTier') as HTMLSelectElement)?.value || '';
  const faction = ($('#mobFaction') as HTMLSelectElement)?.value || '';
  return veri.filter((m) =>
    (!arama || m.ad.toLowerCase().includes(arama))
    && (!tier || String(m.tier) === tier)
    && (!faction || m.faction === faction)
  ).sort((a, b) => b.tier - a.tier || b.fame - a.fame);
}

function ciz(): void {
  const kutu = $('#mobListe');
  if (!kutu) return;
  const liste = filtrele();
  const dilim = liste.slice(0, gosterilen);

  kutu.innerHTML = `
    <div style="display:flex;justify-content:space-between;padding:7px 10px;font-size:10.5px;color:var(--text-muted);border-bottom:1px solid rgba(255,255,255,0.1)">
      <span>${sayi(liste.length)} yaratık bulundu</span><span>${veri.length ? sayi(veri.length) + ' kayıt yüklü' : ''}</span>
    </div>
    ${dilim.map((m) => `
      <div style="display:grid;grid-template-columns:1fr 46px 90px 84px 84px 90px;gap:8px;padding:6px 10px;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.05);align-items:center">
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${m.ad}">${m.ad}</span>
        <span style="text-align:right;color:var(--text-muted)">T${m.tier}</span>
        <span style="color:var(--text-muted);font-size:11px">${m.faction || '—'}</span>
        <span style="text-align:right" title="Can">❤ ${sayi(m.can)}</span>
        <span style="text-align:right" title="Saldırı hasarı">🗡 ${sayi(m.hasar)}</span>
        <span style="text-align:right;color:#d4af37" title="Fame">★ ${sayi(m.fame)}</span>
      </div>`).join('') || '<div style="padding:14px;font-size:12px;color:var(--text-muted)">Eşleşen yaratık yok.</div>'}
    ${liste.length > gosterilen ? `<div style="padding:8px 10px"><button type="button" id="mobDaha" style="background:transparent;border:1px solid #3a3a3a;color:#ccc;border-radius:6px;padding:5px 10px;font-size:11px;cursor:pointer">Daha fazla göster (${sayi(liste.length - gosterilen)})</button></div>` : ''}
  `;
  kutu.querySelector('#mobDaha')?.addEventListener('click', () => { gosterilen += 100; ciz(); });
}

export function kur(): void {
  if (kuruldu) return;
  if (!$('#mobArama')) return;
  kuruldu = true;

  const durum = $('#mobDurum');
  if (durum) durum.textContent = 'Yaratık verisi yükleniyor…';

  void yukle().then(() => {
    if (durum) durum.textContent = `${sayi(veri.length)} yaratık yüklendi · ao-bin-dumps`;
    const factions = Array.from(new Set(veri.map((m) => m.faction).filter(Boolean))).sort();
    const secim = $('#mobFaction') as HTMLSelectElement | null;
    if (secim) secim.innerHTML = '<option value="">Tüm faction\'lar</option>' + factions.map((f) => `<option value="${f}">${f}</option>`).join('');
    const tier = $('#mobTier') as HTMLSelectElement | null;
    if (tier) tier.innerHTML = '<option value="">Tüm tier\'lar</option>' + [2, 3, 4, 5, 6, 7, 8].map((t) => `<option value="${t}">T${t}</option>`).join('');
    ciz();
  }).catch(() => {
    if (durum) durum.textContent = 'Yaratık verisi yüklenemedi.';
  });

  $('#mobArama')?.addEventListener('input', () => { gosterilen = 50; ciz(); });
  $('#mobTier')?.addEventListener('change', () => { gosterilen = 50; ciz(); });
  $('#mobFaction')?.addEventListener('change', () => { gosterilen = 50; ciz(); });

  document.querySelectorAll<HTMLElement>('.atolye-sekme[data-atolye="moblar"]').forEach((btn) => {
    btn.addEventListener('click', () => kur());
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', kur, { once: true });
} else {
  kur();
}

export {};
