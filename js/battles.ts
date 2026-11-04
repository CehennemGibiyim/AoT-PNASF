// AoT-PNASF — Savaş Özetleri (Atölye → Savaşlar)
//
// Resmî Albion API'sinde "battle report" uç noktası yok; bu panel son kill
// akışını (/events) konum + 10 dakikalık zaman penceresine göre kümeler ve
// büyük çatışmaları özetler: toplam fame, kill sayısı, katılımcı ve loncalar.
// Sonuçlar yaklaşık özettir, oyun içi savaş raporunun yerini tutmaz.

const SUNUCULAR: Record<string, string> = {
  europe: 'https://gameinfo-ams.albiononline.com/api/gameinfo',
  americas: 'https://gameinfo.albiononline.com/api/gameinfo',
  asia: 'https://gameinfo-sgp.albiononline.com/api/gameinfo',
};
const $ = <T extends HTMLElement = HTMLElement>(s: string): T | null => document.querySelector<T>(s);
const sayi = (n: number): string => new Intl.NumberFormat('tr-TR').format(Math.round(Number(n) || 0));

let kuruldu = false;
let yukleniyor = false;

function sunucu(): string {
  return SUNUCULAR[localStorage.getItem('aot-server') || 'europe'] || SUNUCULAR.europe;
}

async function iste(url: string): Promise<any> {
  const hedefler = [url, `https://corsproxy.io/?${encodeURIComponent(url)}`, `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`];
  let sonHata: any = null;
  for (const hedef of hedefler) {
    try {
      const kontrol = new AbortController();
      const zaman = setTimeout(() => kontrol.abort(), 9000);
      const yanit = await fetch(hedef, { signal: kontrol.signal });
      clearTimeout(zaman);
      if (!yanit.ok) throw new Error(`HTTP ${yanit.status}`);
      return await yanit.json();
    } catch (hata) { sonHata = hata; }
  }
  throw sonHata || new Error('Albion API erişilemedi');
}

function durum(mesaj: string, hata = false): void {
  const el = $('#savasDurum');
  if (!el) return;
  el.textContent = mesaj;
  el.style.color = hata ? '#ff6b6b' : 'var(--text-muted)';
}

interface Kume {
  yer: string; baslangic: number; bitis: number;
  kill: number; fame: number; oyuncu: Set<string>; loncalar: Map<string, number>;
}

function kumele(olaylar: any[]): Kume[] {
  const kumeler: Kume[] = [];
  const sirali = olaylar
    .filter((e) => e?.TimeStamp && e?.Location)
    .sort((a, b) => new Date(a.TimeStamp).getTime() - new Date(b.TimeStamp).getTime());

  for (const olay of sirali) {
    const zaman = new Date(olay.TimeStamp).getTime();
    const yer = String(olay.Location);
    const mevcut = kumeler.find((k) => k.yer === yer && zaman - k.bitis <= 10 * 60 * 1000);
    const fame = Number(olay.TotalVictimKillFame) || 0;
    const kume = mevcut || { yer, baslangic: zaman, bitis: zaman, kill: 0, fame: 0, oyuncu: new Set<string>(), loncalar: new Map<string, number>() };
    kume.kill += 1;
    kume.fame += fame;
    kume.bitis = Math.max(kume.bitis, zaman);
    for (const kisi of [olay.Killer, ...(Array.isArray(olay.Participants) ? olay.Participants : [])]) {
      if (!kisi?.Name) continue;
      kume.oyuncu.add(kisi.Name);
      if (kisi.GuildName) kume.loncalar.set(kisi.GuildName, (kume.loncalar.get(kisi.GuildName) || 0) + 1);
    }
    if (!mevcut) kumeler.push(kume);
  }

  return kumeler
    .filter((k) => k.oyuncu.size >= 4 || k.fame >= 100_000)
    .sort((a, b) => b.fame - a.fame)
    .slice(0, 10);
}

function ciz(kumeler: Kume[], toplam: number): void {
  const kutu = $('#savasListe');
  if (!kutu) return;
  if (!kumeler.length) {
    kutu.innerHTML = `<p style="padding:14px;font-size:12px;color:var(--text-muted)">Son ${toplam} olayda büyük çatışma kümesi bulunamadı. Birkaç dakika sonra yenileyin.</p>`;
    return;
  }
  kutu.innerHTML = `
    <div style="padding:6px 10px;font-size:10px;text-transform:uppercase;color:var(--text-muted);border-bottom:1px solid rgba(255,255,255,0.1)">
      Son ${toplam} kill olayından ${kumeler.length} çatışma kümesi
    </div>
    ${kumeler.map((k) => {
      const sure = Math.max(1, Math.round((k.bitis - k.baslangic) / 60000));
      const loncalar = Array.from(k.loncalar.entries()).sort((a, b) => b[1] - a[1])
        .map(([ad, adet]) => `${ad} (${adet})`).slice(0, 3).join(' · ') || 'loncasız';
      const zaman = new Date(k.baslangic).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      return `<div style="padding:8px 10px;border-bottom:1px solid rgba(255,255,255,0.05)">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline">
          <strong style="font-size:12.5px">${k.yer}</strong>
          <span style="color:#d4af37;font-size:12px">★ ${sayi(k.fame)}</span>
        </div>
        <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px">
          ${zaman} · ${k.kill} kill · ${k.oyuncu.size} oyuncu · ~${sure} dk
        </div>
        <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${loncalar}</div>
      </div>`;
    }).join('')}
    <p style="padding:8px 10px;font-size:10px;color:var(--text-muted);line-height:1.6">
      Resmî API savaş raporu yayınlamadığı için bu liste son kill akışının konum + 10 dk kümesidir; kesin savaş sonucu değildir.
    </p>`;
}


// --- Arşiv (data/archive/*.json, GitHub Actions günlük günceller) ---
const ARSIV_ANAHTAR: Record<string, string> = { europe: 'eu', americas: 'us', asia: 'asia' };

function zaman(iso: string): string {
  try {
    return new Date(iso).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

async function arsivYukle(): Promise<void> {
  const savasKutu = $('#savasArsiv');
  const metaKutu = $('#savasMeta');
  if (!savasKutu && !metaKutu) return;
  const anahtar = ARSIV_ANAHTAR[localStorage.getItem('aot-server') || 'europe'] || 'eu';
  let b: any = null;
  let m: any = null;
  try { b = await (await fetch('data/archive/battles.json', { cache: 'no-cache' })).json(); } catch { /* yok */ }
  try { m = await (await fetch('data/archive/meta.json', { cache: 'no-cache' })).json(); } catch { /* yok */ }

  if (savasKutu) {
    const sunucuVeri = b?.servers?.[anahtar];
    const liste = (sunucuVeri?.battles || []).slice(0, 8);
    if (!liste.length) {
      savasKutu.innerHTML = '';
    } else {
      savasKutu.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin:4px 0 8px;flex-wrap:wrap">
          <strong style="font-size:13px">📚 Arşiv savaşları</strong>
          <span style="font-size:10px;color:var(--text-muted)">${b.generatedAt ? zaman(b.generatedAt) : ''} · gameinfo /battles · günlük snapshot</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;margin-bottom:14px">
          ${liste.map((x: any) => `
            <div style="border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:10px;background:rgba(255,255,255,0.02)">
              <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted)">
                <span>${zaman(x.t)}</span><span>#${x.id}</span>
              </div>
              <div style="display:flex;gap:10px;margin:6px 0;font-size:12px">
                <span><strong style="color:#ff6b6b">${sayi(x.k)}</strong> kill</span>
                <span><strong style="color:#00d4aa">${sayi(x.f)}</strong> fame</span>
                <span style="color:var(--text-muted)">${x.p} oyuncu</span>
              </div>
              ${(x.g || []).map((g: any) => `<div style="display:grid;grid-template-columns:1fr 34px 34px 70px;gap:6px;font-size:11px;padding:2px 0">
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${g[0]}${g[1] ? ` <span style="color:var(--text-muted);font-size:9px">[${g[1]}]</span>` : ''}</span>
                <span style="text-align:right;color:#00d4aa">${g[2]}K</span>
                <span style="text-align:right;color:#ff6b6b">${g[3]}D</span>
                <span style="text-align:right;color:var(--text-muted);font-size:10px">${sayi(g[4])}</span>
              </div>`).join('')}
              ${(x.pl || []).length ? `<div style="margin-top:5px;font-size:10px;color:var(--text-muted);line-height:1.5">
                ${x.pl.slice(0, 3).map((p: any) => `${p[0]} ${p[2]}K/${p[3]}D`).join(' · ')}
              </div>` : ''}
            </div>`).join('')}
        </div>`;
    }
  }

  if (metaKutu) {
    const silahlar = (m?.servers?.[anahtar]?.weapons || []).slice(0, 10);
    if (!silahlar.length) {
      metaKutu.innerHTML = '';
    } else {
      metaKutu.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin:4px 0 8px;flex-wrap:wrap">
          <strong style="font-size:13px">⚖️ Silah meta — kazanma oranı</strong>
          <span style="font-size:10px;color:var(--text-muted)">${m.servers?.[anahtar]?.sample || 0} kill örneği · arşiv</span>
        </div>
        <div style="border:1px solid rgba(255,255,255,0.08);border-radius:9px;overflow:hidden;margin-bottom:14px">
          ${silahlar.map((w: any) => {
            const renk = w.wr >= 55 ? '#00d4aa' : w.wr >= 45 ? '#ffb84d' : '#ff6b6b';
            return `<div style="display:grid;grid-template-columns:1fr 54px 56px 44px;gap:8px;padding:6px 10px;font-size:11.5px;border-bottom:1px solid rgba(255,255,255,0.05);align-items:center">
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${w.ad}</span>
              <span style="height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden"><span style="display:block;height:100%;width:${Math.min(100, w.wr)}%;background:${renk}"></span></span>
              <span style="text-align:right;color:${renk};font-weight:700">${w.wr.toFixed(1)}%</span>
              <span style="text-align:right;color:var(--text-muted);font-size:10px">${w.k + w.d}</span>
            </div>`;
          }).join('')}
        </div>`;
    }
  }
}

async function yukle(): Promise<void> {
  if (yukleniyor) return;
  yukleniyor = true;
  durum('Son kill akışı alınıyor…');
  try {
    const olaylar = await iste(`${sunucu()}/events?limit=51&offset=0`);
    const liste = Array.isArray(olaylar) ? olaylar : [];
    const kumeler = kumele(liste);
    durum(`Son güncelleme ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`);
    ciz(kumeler, liste.length);
  } catch {
    durum('Albion API erişilemedi — birkaç saniye sonra tekrar deneyin.', true);
  } finally {
    yukleniyor = false;
  }
}

export function kur(): void {
  if (kuruldu) return;
  if (!$('#savasListe')) return;
  kuruldu = true;
  void arsivYukle();
  $('#savasYenile')?.addEventListener('click', () => { void yukle(); void arsivYukle(); });
  document.querySelectorAll<HTMLElement>('.atolye-sekme[data-atolye="savaslar"]').forEach((btn) => {
    btn.addEventListener('click', () => { void yukle(); });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', kur, { once: true });
} else {
  kur();
}

export {};
