// AoT-PNASF — Fame Geçmişi (Atölye → Oyuncu & Lonca)
//
// data/archive/fame.json günlük iş tarafından üretilir: savaş arşivinde en çok
// kill fame toplayan oyuncular ve loncalar her gün gameinfo profilinden
// okunur. Bu panel yaşam boyu fame toplamlarının gün gün değişimini çizer.
//
// Veri uydurulmaz: grafik yalnızca arşivdeki gerçek snapshot'lardan oluşur ve
// ilk kayıttan itibaren büyür. Lonca profilinde oyun yalnızca kill/death fame
// yayımladığı için lonca grafiği bu iki değerle sınırlıdır.

const SUNUCU_ANAHTAR: Record<string, string> = { europe: 'eu', americas: 'us', asia: 'asia' };
const RENKLER = ['#00d4aa', '#7cc4ff', '#d4af37', '#ff6b6b', '#b794f6'];
const $ = <T extends HTMLElement = HTMLElement>(s: string): T | null => document.querySelector<T>(s);

interface Olcum {
  g: string;
  pve?: number; topla?: number; uretim?: number; balik?: number; ciftlik?: number;
  kill?: number; death?: number; uye?: number;
}
interface Kayit { id: string; ad: string; lonca?: string; ittifak?: string; gecmis: Olcum[]; }
interface Seri { ad: string; renk: string; deger: (o: Olcum) => number; }

const tam = (n: number): string => new Intl.NumberFormat('tr-TR').format(Math.round(Number(n) || 0));

/** Grafik ekseni için kısa sayı: 3,25 Mr · 940 Mn · 12,4 B */
function kisa(n: number): string {
  const x = Math.abs(Number(n) || 0);
  if (x >= 1e9) return `${(n / 1e9).toFixed(2).replace('.', ',')} Mr`;
  if (x >= 1e6) return `${(n / 1e6).toFixed(1).replace('.', ',')} Mn`;
  if (x >= 1e3) return `${(n / 1e3).toFixed(1).replace('.', ',')} B`;
  return tam(n);
}

const yuzde = (n: number): string => `${n >= 0 ? '+' : ''}${n.toFixed(1).replace('.', ',')}%`;

const gunKisa = (g: string): string => {
  const p = String(g || '').split('-');
  return p.length === 3 ? `${p[2]}.${p[1]}` : String(g || '');
};

function sunucu(): string {
  return SUNUCU_ANAHTAR[localStorage.getItem('aot-server') || 'europe'] || 'eu';
}

function seriler(tur: 'oyuncu' | 'lonca'): Seri[] {
  if (tur === 'lonca') {
    return [
      { ad: 'Kill fame', renk: RENKLER[3], deger: (o) => Number(o.kill) || 0 },
      { ad: 'Death fame', renk: RENKLER[0], deger: (o) => Number(o.death) || 0 },
    ];
  }
  return [
    { ad: 'PvE', renk: RENKLER[0], deger: (o) => Number(o.pve) || 0 },
    { ad: 'Toplama', renk: RENKLER[1], deger: (o) => Number(o.topla) || 0 },
    { ad: 'Üretim', renk: RENKLER[2], deger: (o) => Number(o.uretim) || 0 },
    { ad: 'Kill fame', renk: RENKLER[3], deger: (o) => Number(o.kill) || 0 },
  ];
}

/** Yüzde değişim grafiği: seriler farklı büyüklükte olduğu için ilk güne göre normalize edilir. */
function grafik(kayit: Kayit, tur: 'oyuncu' | 'lonca'): string {
  const liste = (kayit.gecmis || []).slice().sort((a, b) => String(a.g).localeCompare(String(b.g)));
  if (liste.length < 2) {
    return `<p style="font-size:11px;color:var(--text-muted);margin:8px 0 0">
      Fame geçmişi ilk günü biriktirdi (${liste[0] ? gunKisa(liste[0].g) : '—'}). Grafik, arşiv ikinci günü eklediğinde çizilir;
      günlük iş her sabah 05:17 UTC'de çalışır.</p>`;
  }

  const seri = seriler(tur);
  const cizgiler = seri.map((s, i) => {
    const ilk = s.deger(liste[0]);
    const noktalar = liste.map((o, j) => {
      const x = 34 + (j / (liste.length - 1)) * 278;
      const oran = ilk > 0 ? ((s.deger(o) - ilk) / ilk) * 100 : 0;
      return { x, oran };
    });
    return { ...s, renk: RENKLER[i] || s.renk, ilk, son: s.deger(liste[liste.length - 1]), noktalar };
  }).filter((s) => s.ilk > 0 || s.son > 0);

  const tumOranlar = cizgiler.flatMap((s) => s.noktalar.map((n) => n.oran));
  const enAz = Math.min(0, ...tumOranlar);
  const enCok = Math.max(0.5, ...tumOranlar);
  const aciklik = Math.max(0.5, enCok - enAz);
  const y = (oran: number): number => 106 - ((oran - enAz) / aciklik) * 92;

  const izgara = [0, 0.5, 1].map((k) => {
    const oran = enAz + aciklik * k;
    return `<line x1="34" y1="${y(oran).toFixed(1)}" x2="312" y2="${y(oran).toFixed(1)}" stroke="rgba(255,255,255,0.07)" stroke-width="0.7"/>
      <text x="31" y="${(y(oran) + 2.5).toFixed(1)}" text-anchor="end" font-size="6.5" fill="rgba(255,255,255,0.45)">${yuzde(oran)}</text>`;
  }).join('');

  const cizim = cizgiler.map((s) => {
    const nokta = s.noktalar.map((n) => `${n.x.toFixed(1)},${y(n.oran).toFixed(1)}`).join(' ');
    const son = s.noktalar[s.noktalar.length - 1];
    return `<polyline points="${nokta}" fill="none" stroke="${s.renk}" stroke-width="1.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
      <circle cx="${son.x.toFixed(1)}" cy="${y(son.oran).toFixed(1)}" r="2" fill="${s.renk}"/>`;
  }).join('');

  const efsane = cizgiler.map((s) => {
    const artis = s.son - s.ilk;
    const oran = s.ilk > 0 ? (artis / s.ilk) * 100 : 0;
    return `<span style="display:inline-flex;align-items:center;gap:5px;font-size:10.5px;color:var(--text-muted)">
      <span style="width:7px;height:7px;border-radius:50%;background:${s.renk};display:inline-block"></span>
      ${s.ad} <strong style="color:var(--text)">${kisa(s.son)}</strong>
      <span style="color:${artis >= 0 ? '#00d4aa' : '#ff6b6b'}">${artis >= 0 ? '+' : ''}${kisa(artis)} (${yuzde(oran)})</span>
    </span>`;
  }).join('');

  return `
    <div style="border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:10px;background:rgba(255,255,255,0.02)">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-size:10px;color:var(--text-muted)">
        <span>İlk güne göre değişim · ${liste.length} günlük kayıt</span>
        <span>${gunKisa(liste[0].g)} → ${gunKisa(liste[liste.length - 1].g)}</span>
      </div>
      <svg viewBox="0 0 320 118" preserveAspectRatio="none" role="img"
        aria-label="${kayit.ad} fame değişim grafiği, ${liste.length} gün" style="width:100%;height:150px;margin-top:4px">
        ${izgara}${cizim}
        <text x="34" y="116" font-size="6.5" fill="rgba(255,255,255,0.45)">${gunKisa(liste[0].g)}</text>
        <text x="312" y="116" text-anchor="end" font-size="6.5" fill="rgba(255,255,255,0.45)">${gunKisa(liste[liste.length - 1].g)}</text>
      </svg>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:2px">${efsane}</div>
    </div>`;
}

function tablo(kayit: Kayit, tur: 'oyuncu' | 'lonca'): string {
  const liste = (kayit.gecmis || []).slice().sort((a, b) => String(a.g).localeCompare(String(b.g)));
  if (!liste.length) return '';
  const ilk = liste[0];
  const son = liste[liste.length - 1];
  const satirlar = seriler(tur).map((s) => {
    const a = s.deger(ilk);
    const b = s.deger(son);
    const fark = b - a;
    return `<tr>
      <td style="padding:4px 8px;color:var(--text-muted)">${s.ad}</td>
      <td style="padding:4px 8px;text-align:right">${tam(a)}</td>
      <td style="padding:4px 8px;text-align:right;color:${fark >= 0 ? '#00d4aa' : '#ff6b6b'}">${fark >= 0 ? '+' : ''}${tam(fark)}</td>
    </tr>`;
  });

  if (tur === 'lonca') {
    satirlar.push(`<tr>
      <td style="padding:4px 8px;color:var(--text-muted)">Üye</td>
      <td style="padding:4px 8px;text-align:right">${tam(Number(son.uye) || 0)}</td>
      <td style="padding:4px 8px;text-align:right;color:var(--text-muted)">${tam((Number(son.uye) || 0) - (Number(ilk.uye) || 0))}</td>
    </tr>`);
  } else {
    const diger = (Number(son.balik) || 0) + (Number(son.ciftlik) || 0);
    if (diger > 0) {
      satirlar.push(`<tr>
        <td style="padding:4px 8px;color:var(--text-muted)">Balık + çiftlik</td>
        <td style="padding:4px 8px;text-align:right">${tam(diger)}</td>
        <td style="padding:4px 8px;text-align:right;color:var(--text-muted)">—</td>
      </tr>`);
    }
  }

  return `<table style="width:100%;border-collapse:collapse;font-size:11px;margin-top:8px">
    <thead><tr style="font-size:9px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted)">
      <th style="text-align:left;padding:3px 8px;font-weight:600">Değer</th>
      <th style="text-align:right;padding:3px 8px;font-weight:600">${gunKisa(ilk.g)}</th>
      <th style="text-align:right;padding:3px 8px;font-weight:600">Değişim</th>
    </tr></thead>
    <tbody>${satirlar.join('')}</tbody>
  </table>`;
}

function ciz(kok: HTMLElement, veri: any, anahtar: string, tur: 'oyuncu' | 'lonca', seciliId: string): void {
  const sunucuVeri = veri?.servers?.[anahtar];
  const liste: Kayit[] = (tur === 'lonca' ? sunucuVeri?.loncalar : sunucuVeri?.oyuncular) || [];
  kok.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin:2px 0 8px">
      <strong style="font-size:13px">📈 Fame geçmişi — arşiv</strong>
      <span style="font-size:10px;color:var(--text-muted)">
        ${veri?.generatedAt ? new Date(veri.generatedAt).toLocaleDateString('tr-TR') : ''} · gameinfo /players · günlük snapshot
      </span>
    </div>
    <div class="tp-controls" style="flex-wrap:wrap;gap:8px;margin-bottom:8px">
      <div class="tp-btn-group">
        <button type="button" class="tp-btn ${tur === 'oyuncu' ? 'active' : ''}" data-fame-tur="oyuncu">👤 Oyuncular</button>
        <button type="button" class="tp-btn ${tur === 'lonca' ? 'active' : ''}" data-fame-tur="lonca">🛡️ Loncalar</button>
      </div>
      <select id="fameSecim" aria-label="Fame geçmişi gösterilecek kayıt"
        style="flex:1;min-width:190px;background:#141414;border:1px solid #333;border-radius:6px;padding:7px 9px;color:#fff;font-size:12.5px">
        ${liste.map((k) => `<option value="${k.id}" ${k.id === seciliId ? 'selected' : ''}>${k.ad}${k.lonca ? ` — ${k.lonca}` : (k.ittifak ? ` — ${k.ittifak}` : '')}</option>`).join('')}
      </select>
    </div>
    <div id="fameGrafik"></div>
    <p style="font-size:10px;color:var(--text-muted);margin:8px 0 0">
      İzlenenler: savaş arşivinde en çok kill fame toplayan oyuncular ve loncalar. Değerler yaşam boyu toplamdır;
      arşiv her gün 05:17 UTC'de bir snapshot ekler. Lonca için oyun yalnızca kill/death fame yayımlar.
    </p>`;

  const secili = liste.find((k) => k.id === seciliId) || liste[0];
  const grafikKok = kok.querySelector<HTMLElement>('#fameGrafik');
  if (grafikKok) {
    grafikKok.innerHTML = secili
      ? grafik(secili, tur) + tablo(secili, tur)
      : `<p style="font-size:11px;color:var(--text-muted)">Bu sunucu için arşiv kaydı yok; günlük iş çalışınca oluşur.</p>`;
  }

  kok.querySelectorAll<HTMLElement>('[data-fame-tur]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const yeniTur = btn.dataset.fameTur as 'oyuncu' | 'lonca';
      ciz(kok, veri, anahtar, yeniTur, '');
    });
  });
  kok.querySelector<HTMLSelectElement>('#fameSecim')?.addEventListener('change', (ev) => {
    const id = (ev.target as HTMLSelectElement).value;
    const k = liste.find((x) => x.id === id);
    if (k && grafikKok) grafikKok.innerHTML = grafik(k, tur) + tablo(k, tur);
  });
}

async function yukle(): Promise<void> {
  const kok = $('#fameGecmis');
  if (!kok) return;
  const anahtar = sunucu();
  try {
    const yanit = await fetch('data/archive/fame.json', { cache: 'no-cache' });
    if (!yanit.ok) throw new Error(`HTTP ${yanit.status}`);
    const veri = await yanit.json();
    const mevcut = veri?.servers?.[anahtar];
    const varOlan = mevcut && (mevcut.oyuncular?.length || mevcut.loncalar?.length)
      ? anahtar
      : Object.keys(veri?.servers || {}).find((k) => (veri.servers[k]?.oyuncular?.length || 0) > 0) || anahtar;
    ciz(kok, veri, varOlan, 'oyuncu', '');
  } catch {
    kok.innerHTML = `<p style="font-size:11px;color:var(--text-muted)">
      Fame arşivi henüz yayımlanmadı; günlük arşiv işi ilk çalışmasını tamamlayınca burada görünür.</p>`;
  }
}

export function kur(): void {
  const kok = $('#fameGecmis');
  if (!kok) return;
  void yukle();
  document.querySelectorAll<HTMLElement>('.atolye-sekme[data-atolye="oyuncu"]').forEach((btn) => {
    btn.addEventListener('click', () => { if (!kok.dataset.yuklendi) void yukle(); });
  });
  kok.dataset.yuklendi = '1';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', kur, { once: true });
} else {
  kur();
}

export {};
