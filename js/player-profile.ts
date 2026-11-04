// AoT-PNASF — Oyuncu & Lonca Profili (Atölye → Oyuncu)
//
// Resmî Albion gameinfo API'sinden oyuncu/lonca arar, istatistik kartı ve son
// kill/death akışını gösterir. Fame geçmişi tarayıcıda günlük anlık görüntü
// olarak saklanır (localStorage) ve mini grafikle çizilir — sunucu tarafında
// geçmiş tutan bir API olmadığı için grafik sizin kayıtlarınızdan oluşur.

const SUNUCULAR: Record<string, string> = {
  europe: 'https://gameinfo-ams.albiononline.com/api/gameinfo',
  americas: 'https://gameinfo.albiononline.com/api/gameinfo',
  asia: 'https://gameinfo-sgp.albiononline.com/api/gameinfo',
};
const DEPO = 'aot-profil-gecmis';
const $ = <T extends HTMLElement = HTMLElement>(s: string): T | null => document.querySelector<T>(s);
const dil = (): string => localStorage.getItem('aot-lang') || 'tr';
const sayi = (n: number): string => new Intl.NumberFormat('tr-TR').format(Math.round(Number(n) || 0));

interface GecmisKaydi { gun: string; killFame: number; deathFame: number; }

let tur: 'player' | 'guild' = 'player';
let kuruldu = false;

function sunucu(): string {
  return SUNUCULAR[localStorage.getItem('aot-server') || 'europe'] || SUNUCULAR.europe;
}

async function istekYap(url: string): Promise<any> {
  const hedefler = [
    url,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  ];
  let sonHata: any = null;
  for (const hedef of hedefler) {
    try {
      const kontrol = new AbortController();
      const zaman = setTimeout(() => kontrol.abort(), 8000);
      const yanit = await fetch(hedef, { signal: kontrol.signal });
      clearTimeout(zaman);
      if (!yanit.ok) throw new Error(`HTTP ${yanit.status}`);
      return await yanit.json();
    } catch (hata) {
      sonHata = hata;
    }
  }
  throw sonHata || new Error('Albion API erişilemedi');
}

function durum(mesaj: string, hata = false): void {
  const el = $('#profilDurum');
  if (!el) return;
  el.textContent = mesaj;
  el.style.color = hata ? '#ff6b6b' : 'var(--text-muted)';
}

function gecmisOku(): Record<string, GecmisKaydi[]> {
  try { return JSON.parse(localStorage.getItem(DEPO) || '{}') || {}; } catch { return {}; }
}

function gecmisYaz(veri: Record<string, GecmisKaydi[]>): void {
  try { localStorage.setItem(DEPO, JSON.stringify(veri)); } catch { /* depolama kapalı */ }
}

function anlikKaydet(id: string, killFame: number, deathFame: number): void {
  const tumu = gecmisOku();
  const liste = tumu[id] || [];
  const gun = new Date().toISOString().slice(0, 10);
  const yeni = liste.filter((k) => k.gun !== gun);
  yeni.push({ gun, killFame, deathFame });
  tumu[id] = yeni.slice(-90);
  gecmisYaz(tumu);
}

function cizgi(liste: GecmisKaydi[]): string {
  if (liste.length < 2) {
    return `<p style="font-size:11px;color:var(--text-muted);margin-top:6px">
      Fame geçmişi için en az 2 günlük kayıt gerekir; her gün "Bugünü kaydet" ile biriktirebilirsiniz.</p>`;
  }
  const degerler = liste.map((k) => k.killFame);
  const enAz = Math.min(...degerler);
  const enCok = Math.max(...degerler);
  const ara = Math.max(1, enCok - enAz);
  const noktalar = degerler.map((d, i) => {
    const x = (i / (degerler.length - 1)) * 100;
    const y = 32 - ((d - enAz) / ara) * 28;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return `<svg viewBox="0 0 100 36" preserveAspectRatio="none" style="width:100%;height:54px;margin-top:6px">
      <polyline points="${noktalar}" fill="none" stroke="#00d4aa" stroke-width="1.2" vector-effect="non-scaling-stroke"></polyline>
    </svg>
    <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted)">
      <span>${liste[0].gun} · ${sayi(liste[0].killFame)}</span>
      <span>${liste[liste.length - 1].gun} · ${sayi(degerler[degerler.length - 1])}</span>
    </div>`;
}

function kart(baslik: string, deger: string, alt = ''): string {
  return `<div style="min-width:118px;flex:1;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:9px 11px">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted)">${baslik}</div>
    <div style="font-size:15px;font-weight:800;margin-top:2px">${deger}</div>
    ${alt ? `<div style="font-size:10px;color:var(--text-muted)">${alt}</div>` : ''}
  </div>`;
}

function olaySatiri(ev: any, tip: 'kill' | 'death'): string {
  const karsi = tip === 'kill' ? ev.Victim : ev.Killer;
  const fame = Number(ev.TotalVictimKillFame) || 0;
  const zaman = ev.TimeStamp ? new Date(ev.TimeStamp).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
  return `<div style="display:flex;justify-content:space-between;gap:10px;padding:5px 10px;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.05)">
    <span style="color:${tip === 'kill' ? '#00d4aa' : '#ff6b6b'};white-space:nowrap">${tip === 'kill' ? '⚔ öldürdü' : '☠ öldü'}</span>
    <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${karsi?.Name || '—'}${karsi?.GuildName ? ` <span style="color:var(--text-muted);font-size:10px">[${karsi.GuildName}]</span>` : ''}</span>
    <span style="color:#d4af37;white-space:nowrap">★ ${sayi(fame)}</span>
    <span style="color:var(--text-muted);white-space:nowrap;font-size:10px">${zaman}</span>
  </div>`;
}

async function profilCiz(oyuncu: any): Promise<void> {
  const kutu = $('#profilSonuc');
  if (!kutu || !oyuncu?.Id) return;
  const y = oyuncu.LifetimeStatistics || {};
  const toplama = Object.values((y.Gathering || {}) as Record<string, any>).reduce((t: number, g: any) => t + (Number(g?.Total) || 0), 0);
  const gecmis = gecmisOku()[oyuncu.Id] || [];
  durum('Son kill/death akışı alınıyor…');

  let olaylar: any[] = [];
  try {
    const [kills, deaths] = await Promise.all([
      istekYap(`${sunucu()}/players/${oyuncu.Id}/kills?limit=6&offset=0`).catch(() => []),
      istekYap(`${sunucu()}/players/${oyuncu.Id}/deaths?limit=6&offset=0`).catch(() => []),
    ]);
    olaylar = [
      ...(Array.isArray(kills) ? kills.map((e) => ({ e, tip: 'kill' as const })) : []),
      ...(Array.isArray(deaths) ? deaths.map((e) => ({ e, tip: 'death' as const })) : []),
    ].sort((a, b) => new Date(b.e.TimeStamp).getTime() - new Date(a.e.TimeStamp).getTime()).slice(0, 10);
  } catch { /* akış opsiyonel */ }

  kutu.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;flex-wrap:wrap">
      <div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#d4af37,#8a6d1f);display:flex;align-items:center;justify-content:center;font-weight:900;color:#141006">${(oyuncu.Name || '?').slice(0, 2).toUpperCase()}</div>
      <div>
        <div style="font-size:16px;font-weight:800">${oyuncu.Name}</div>
        <div style="font-size:11px;color:var(--text-muted)">
          ${oyuncu.GuildName ? `${oyuncu.GuildName}` : (dil() === 'tr' ? 'Loncasız' : 'No guild')}
          ${oyuncu.AllianceName ? ` · ${oyuncu.AllianceName}` : ''}
        </div>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      ${kart('Kill fame', sayi(oyuncu.KillFame))}
      ${kart('Death fame', sayi(oyuncu.DeathFame))}
      ${kart('K/D oranı', (Number(oyuncu.FameRatio) || 0).toFixed(2))}
      ${kart('Ort. item power', sayi(oyuncu.AverageItemPower))}
      ${kart('PvE fame', sayi(y?.PvE?.Total ?? 0), `Mists ${sayi(y?.PvE?.Mists ?? 0)}`)}
      ${kart('Toplayıcılık', sayi(toplama), `Zanaat ${sayi(y?.Crafting?.Total ?? 0)}`)}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
      <div style="border:1px solid rgba(255,255,255,0.08);border-radius:9px;overflow:hidden">
        <div style="padding:6px 10px;font-size:10px;text-transform:uppercase;color:var(--text-muted);border-bottom:1px solid rgba(255,255,255,0.1)">Son olaylar</div>
        ${olaylar.map((o) => olaySatiri(o.e, o.tip)).join('') || '<div style="padding:10px;font-size:11px;color:var(--text-muted)">Olay bulunamadı.</div>'}
      </div>
      <div style="border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:8px 10px">
        <div style="font-size:10px;text-transform:uppercase;color:var(--text-muted)">Kill fame geçmişi (yerel)</div>
        ${cizgi(gecmis)}
        <button type="button" id="profilKaydet" style="margin-top:8px;background:var(--accent);color:#141006;border:0;border-radius:6px;padding:5px 10px;font:700 11px/1 system-ui;cursor:pointer">Bugünü kaydet</button>
      </div>
    </div>
  `;

  kutu.querySelector('#profilKaydet')?.addEventListener('click', () => {
    anlikKaydet(oyuncu.Id, Number(oyuncu.KillFame) || 0, Number(oyuncu.DeathFame) || 0);
    durum('Bugünün fame değeri kaydedildi.');
    void profilCiz({ ...oyuncu });
  });
  durum(`Son güncelleme ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`);
}

async function loncaCiz(lonca: any): Promise<void> {
  const kutu = $('#profilSonuc');
  if (!kutu || !lonca?.Id) return;
  durum('Lonca üyeleri alınıyor…');
  let uyeler: any[] = [];
  try {
    const sonuc = await istekYap(`${sunucu()}/guilds/${lonca.Id}/members`);
    uyeler = Array.isArray(sonuc) ? sonuc : [];
  } catch { /* üye listesi opsiyonel */ }

  const killFame = Number(lonca.killFame ?? lonca.KillFame) || 0;
  const deathFame = Number(lonca.DeathFame ?? lonca.deathFame) || 0;

  kutu.innerHTML = `
    <div style="margin-bottom:10px">
      <div style="font-size:16px;font-weight:800">${lonca.Name}</div>
      <div style="font-size:11px;color:var(--text-muted)">${lonca.AllianceName || (dil() === 'tr' ? 'İttifaksız' : 'No alliance')}</div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      ${kart('Üye', sayi(lonca.MemberCount))}
      ${kart('Kill fame', sayi(killFame))}
      ${kart('Death fame', sayi(deathFame))}
      ${kart('K/D oranı', (killFame / Math.max(1, deathFame)).toFixed(2))}
    </div>
    <div style="border:1px solid rgba(255,255,255,0.08);border-radius:9px;overflow:hidden">
      <div style="padding:6px 10px;font-size:10px;text-transform:uppercase;color:var(--text-muted);border-bottom:1px solid rgba(255,255,255,0.1)">Üyeler (kill fame sırasıyla ilk 25)</div>
      ${uyeler.slice().sort((a, b) => (b.KillFame || 0) - (a.KillFame || 0)).slice(0, 25).map((u) => `
        <div style="display:grid;grid-template-columns:1fr 100px 70px;gap:8px;padding:5px 10px;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.05)">
          <span>${u.Name}</span>
          <span style="text-align:right;color:#d4af37">★ ${sayi(u.KillFame)}</span>
          <span style="text-align:right;color:var(--text-muted)">${u.GuildRole || ''}</span>
        </div>`).join('') || '<div style="padding:10px;font-size:11px;color:var(--text-muted)">Üye listesi alınamadı.</div>'}
    </div>
  `;
  durum(`Son güncelleme ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`);
}

async function ara(): Promise<void> {
  const girdi = ($('#profilArama') as HTMLInputElement | null)?.value.trim();
  if (!girdi) return;
  durum('Aranıyor…');
  $('#profilSonuc')!.innerHTML = '';
  try {
    const sonuc = await istekYap(`${sunucu()}/search?q=${encodeURIComponent(girdi)}`);
    if (tur === 'guild') {
      const loncalar = Array.isArray(sonuc?.guilds) ? sonuc.guilds : [];
      if (!loncalar.length) { durum(`"${girdi}" adlı lonca bulunamadı.`, true); return; }
      const tam = loncalar.find((l: any) => String(l.Name).toLowerCase() === girdi.toLowerCase()) || loncalar[0];
      const detay = await istekYap(`${sunucu()}/guilds/${tam.Id}`).catch(() => tam);
      await loncaCiz(detay?.Id ? detay : tam);
    } else {
      const oyuncular = Array.isArray(sonuc?.players) ? sonuc.players : [];
      if (!oyuncular.length) { durum(`"${girdi}" adlı oyuncu bulunamadı.`, true); return; }
      const tam = oyuncular.find((p: any) => String(p.Name).toLowerCase() === girdi.toLowerCase()) || oyuncular[0];
      const detay = await istekYap(`${sunucu()}/players/${tam.Id}`).catch(() => tam);
      await profilCiz(detay?.Id ? detay : tam);
    }
  } catch {
    durum('Albion API erişilemedi — birkaç saniye sonra tekrar deneyin.', true);
  }
}

function kurKontroller(): void {
  document.querySelectorAll<HTMLElement>('[data-profil-tur]').forEach((btn) => {
    btn.addEventListener('click', () => {
      tur = btn.dataset.profilTur as 'player' | 'guild';
      document.querySelectorAll<HTMLElement>('[data-profil-tur]').forEach((b) => b.classList.toggle('active', b === btn));
      const girdi = $('#profilArama') as HTMLInputElement | null;
      if (girdi) girdi.placeholder = tur === 'guild' ? 'Lonca adı yazın…' : 'Oyuncu adı yazın…';
    });
  });
  $('#profilAra')?.addEventListener('click', () => { void ara(); });
  $('#profilArama')?.addEventListener('keydown', (ev) => {
    if ((ev as KeyboardEvent).key === 'Enter') { ev.preventDefault(); void ara(); }
  });
}

export function kur(): void {
  if (kuruldu) return;
  if (!$('#profilArama')) return;
  kuruldu = true;
  kurKontroller();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', kur, { once: true });
} else {
  kur();
}

export {};
