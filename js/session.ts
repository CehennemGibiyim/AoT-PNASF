// AoT-PNASF — Oturum dinleyicisi paneli (masaüstü)
//
// Bu panel yalnızca Electron kabuğunda çalışır: ana süreçteki SessionStore ve
// 127.0.0.1 alıcısı preload üzerinden `window.aotSession` olarak açılır.
// Web sürümünde köprü yoktur; panel bunu açıkça söyler ve pasif kalır.

type OturumOlay = {
  tur: string;
  zaman: string;
  ad?: string;
  adet?: number;
  deger?: number;
  fame?: number;
  miktar?: number;
  alan?: string;
};

type OturumOzet = {
  aktif: boolean;
  basladi: string | null;
  bitti: string | null;
  sure: number;
  dps: number;
  fameSaat: number;
  silverSaat: number;
  toplam: { silver: number; fame: number; kills: number; deaths: number; hasar: number; loot: number };
  fame: { pve: number; pvp: number; gather: number; craft: number };
  olaylar: OturumOlay[];
};

type OturumKopru = {
  durum: () => Promise<OturumOzet>;
  baslat: () => Promise<OturumOzet>;
  bitir: () => Promise<OturumOzet>;
  temizle: () => Promise<OturumOzet>;
  bilgi: () => Promise<{ port: number; token: string; dosya: string }>;
  onUpdate: (cb: (ozet: OturumOzet) => void) => () => void;
};

declare global {
  interface Window { aotSession?: OturumKopru; }
}

const sec = <T extends HTMLElement = HTMLElement>(s: string): T | null => document.querySelector<T>(s);
const sayi = (n: number): string => new Intl.NumberFormat('tr-TR').format(Math.round(Number(n) || 0));

function sureMetni(saniye: number): string {
  const s = Math.max(0, Math.round(saniye));
  const sa = Math.floor(s / 3600);
  const dk = Math.floor((s % 3600) / 60);
  const sn = s % 60;
  return sa ? `${sa}s ${String(dk).padStart(2, '0')}dk` : `${dk}dk ${String(sn).padStart(2, '0')}sn`;
}

function saat(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function kutu(baslik: string, deger: string, alt: string, renk: string): string {
  return `<div style="border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:10px 12px;background:rgba(255,255,255,0.02)">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted)">${baslik}</div>
    <div style="font-size:18px;font-weight:700;color:${renk};margin-top:2px">${deger}</div>
    <div style="font-size:10px;color:var(--text-muted);margin-top:1px">${alt}</div>
  </div>`;
}

function ciz(o: OturumOzet): void {
  const durum = sec('#oturumDurum');
  if (durum) {
    durum.textContent = o.aktif
      ? `● Oturum açık — ${o.basladi ? saat(o.basladi) : ''} başladı`
      : o.bitti
        ? `■ Oturum bitti — ${o.bitti ? saat(o.bitti) : ''}`
        : 'Henüz oturum yok. Başlat’a basın veya alıcıya olay gönderin.';
    durum.style.color = o.aktif ? '#00d4aa' : '';
  }

  const kpi = sec('#oturumKpi');
  if (kpi) {
    kpi.innerHTML = [
      kutu('Süre', sureMetni(o.sure), o.aktif ? 'devam ediyor' : 'son oturum', '#fff'),
      kutu('Fame', sayi(o.toplam.fame), `saatte ${sayi(o.fameSaat)}`, '#00d4aa'),
      kutu('Loot değeri', `${sayi(o.toplam.silver)} gümüş`, `${o.toplam.loot} parça · saatte ${sayi(o.silverSaat)}`, '#ffb84d'),
      kutu('K / D', `${o.toplam.kills} / ${o.toplam.deaths}`, `${sayi(o.toplam.hasar)} hasar`, '#ff6b6b'),
      kutu('DPS', sayi(o.dps), 'oturum ortalaması', '#7aa2ff'),
    ].join('');
  }

  const olaylar = sec('#oturumOlaylar');
  if (olaylar) {
    if (!o.olaylar.length) {
      olaylar.innerHTML = `<p style="font-size:11.5px;color:var(--text-muted);padding:10px">Henüz olay yok. Alıcıya gönderilen loot/kill/fame olayları burada listelenir.</p>`;
    } else {
      const satir = (e: OturumOlay): string => {
        const etiket: Record<string, string> = { loot: '💰 Loot', kill: '⚔️ Kill', death: '💀 Ölüm', fame: '★ Fame', damage: '🎯 Hasar' };
        const detay = e.tur === 'loot'
          ? `${e.ad || 'Eşya'} × ${e.adet || 1} · ${sayi(e.deger || 0)} gümüş`
          : e.tur === 'kill' || e.tur === 'death'
            ? `${e.ad || ''} ${e.fame ? `· ${sayi(e.fame)} fame` : ''}`
            : e.tur === 'fame'
              ? `${sayi(e.miktar || 0)} ${e.alan || 'pve'}`
              : `${sayi(e.miktar || 0)} hasar`;
        return `<div style="display:grid;grid-template-columns:92px 1fr 64px;gap:8px;padding:6px 10px;font-size:11.5px;border-bottom:1px solid rgba(255,255,255,0.05)">
          <span style="color:var(--text-muted)">${etiket[e.tur] || e.tur}</span>
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${detay}</span>
          <span style="text-align:right;color:var(--text-muted);font-size:10px">${saat(e.zaman)}</span>
        </div>`;
      };
      olaylar.innerHTML = `<div style="border:1px solid rgba(255,255,255,0.08);border-radius:9px;overflow:hidden">${o.olaylar.map(satir).join('')}</div>`;
    }
  }
}

function bilgiCiz(bilgi: { port: number; token: string }): void {
  const kutuEl = sec('#oturumAlici');
  if (!kutuEl) return;
  if (!bilgi.port) {
    kutuEl.innerHTML = `<p style="font-size:11px;color:#ff6b6b">Yerel alıcı başlatılamadı (port 0). Uygulamayı yeniden başlatın.</p>`;
    return;
  }
  const adres = `http://127.0.0.1:${bilgi.port}/olay`;
  kutuEl.innerHTML = `
    <div style="border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:10px 12px;font-size:11px;color:var(--text-muted);line-height:1.6">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
        <strong style="color:var(--text)">Yerel alıcı</strong>
        <button type="button" id="oturumKopyala" style="background:transparent;border:1px solid #3a3a3a;color:#ccc;border-radius:6px;padding:4px 8px;font-size:10.5px;cursor:pointer">Kopyala</button>
      </div>
      <div style="margin-top:4px"><code>POST ${adres}</code> · <code>Authorization: Bearer …</code></div>
      <div style="margin-top:2px">Yalnızca 127.0.0.1 dinler; token her açılışta yenilenir. Gövde: <code>{"tur":"loot","ad":"T6 Deri","adet":2,"birimDeger":500}</code></div>
    </div>`;
  sec('#oturumKopyala')?.addEventListener('click', async () => {
    const komut = `curl -X POST ${adres} -H "Authorization: Bearer ${bilgi.token}" -H "Content-Type: application/json" -d '{"tur":"loot","ad":"T6 Deri","adet":2,"birimDeger":500}'`;
    try {
      await navigator.clipboard.writeText(komut);
      const btn = sec('#oturumKopyala');
      if (btn) btn.textContent = 'Kopyalandı ✓';
    } catch {
      window.prompt('Kopyalamak için seçin:', komut);
    }
  });
}

async function baslat(): Promise<void> {
  const kopru = window.aotSession;
  const durum = sec('#oturumDurum');
  if (!kopru) {
    if (durum) durum.textContent = 'Oturum dinleyicisi yalnızca masaüstü (Electron) uygulamasında çalışır.';
    const kpi = sec('#oturumKpi');
    if (kpi) kpi.innerHTML = '';
    return;
  }

  try {
    ciz(await kopru.durum());
  } catch { /* köprü hazır değil */ }

  try { bilgiCiz(await kopru.bilgi()); } catch { /* yoksay */ }

  sec('#oturumBaslat')?.addEventListener('click', async () => { ciz(await kopru.baslat()); });
  sec('#oturumBitir')?.addEventListener('click', async () => { ciz(await kopru.bitir()); });
  sec('#oturumTemizle')?.addEventListener('click', async () => { ciz(await kopru.temizle()); });

  kopru.onUpdate(ciz);

  // Süre ve DPS, olay gelmese de ilerlesin.
  setInterval(async () => {
    const kart = sec('#oturumKpi');
    if (!kart || !kart.children.length) return;
    try { ciz(await kopru.durum()); } catch { /* yoksay */ }
  }, 5000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { void baslat(); }, { once: true });
} else {
  void baslat();
}

export {};
