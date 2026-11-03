// AoT-PNASF — Araçlar Modülü (Aşama 7/9)
// Party Builder · PvP Killboard Analizi · Avalon & HCE Rehberi
// Veri: data/tools-data.js (window.AO_TOOLS_DATA) + Albion gameinfo API + data/pvp-feed.json

(() => {
  'use strict';

  const getLang = () => localStorage.getItem('aot-lang') || 'tr';
  const L = (o: any): string => (!o ? '' : (getLang() === 'tr' ? o.tr : o.en) || o.en || o.tr || '');
  const DATA = (): any => (window as any).AO_TOOLS_DATA || null;
  const $ = (sel: string) => document.querySelector<HTMLElement>(sel);
  const $$ = (sel: string) => Array.from(document.querySelectorAll<HTMLElement>(sel));

  // ────────────────────────────────────────────────────────────
  // ANA SEKME DEĞİŞTİRME
  // ────────────────────────────────────────────────────────────
  function initTabs() {
    $$('.tools-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.tools-tab').forEach((b) => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
        $$('.tool-panel').forEach((p) => p.classList.remove('active'));
        const panel = $(`#tool-${btn.dataset.toolTab}`);
        if (panel) panel.classList.add('active');
        if (btn.dataset.toolTab === 'killboard' && !kbLoaded) loadKillboard();
      });
    });
  }

  // ────────────────────────────────────────────────────────────
  // PARTY BUILDER
  // ────────────────────────────────────────────────────────────
  const ROLE_ICONS: Record<string, string> = {
    tank: '🛡️', healer: '💚', support: '✨', melee: '⚔️', ranged: '🏹'
  };
  const ROLE_NAMES: Record<string, { tr: string; en: string }> = {
    tank:    { tr: 'Tank',            en: 'Tank' },
    healer:  { tr: 'Şifacı',          en: 'Healer' },
    support: { tr: 'Destek',          en: 'Support' },
    melee:   { tr: 'Melee DPS',       en: 'Melee DPS' },
    ranged:  { tr: 'Ranged DPS',      en: 'Ranged DPS' }
  };

  let partyFormatId = 'small';

  function currentFormat(): any {
    const data = DATA();
    if (!data) return null;
    const size = Number(($('#partySize') as HTMLInputElement)?.value || 7);
    const wanted = size <= 9 ? 'small' : 'zvz';
    return data.party.formats.find((f: any) => f.id === (partyFormatId === wanted ? partyFormatId : wanted)) ||
           data.party.formats.find((f: any) => f.id === wanted);
  }

  function renderParty() {
    const data = DATA();
    if (!data) return;
    const sizeInput = $('#partySize') as HTMLInputElement;
    const size = Number(sizeInput?.value || 7);
    const sizeVal = $('#partySizeVal');
    if (sizeVal) sizeVal.textContent = String(size);

    // Boyuta göre format seçimi (≤9 küçük ölçek, ≥10 ZvZ)
    const wanted = size <= 9 ? 'small' : 'zvz';
    if (partyFormatId !== wanted) partyFormatId = wanted;

    // Format butonlarını senkronize et
    $$('#partyFormats .tp-btn').forEach((b) => b.classList.toggle('active', b.dataset.format === partyFormatId));

    const fmt = currentFormat();
    if (!fmt) return;
    const desc = $('#partyFormatDesc');
    if (desc) desc.textContent = L(fmt.desc);

    // Rol kartları — nominal orana göre ölçekleme
    const rolesBox = $('#partyRoles');
    if (rolesBox) {
      const scale = size / fmt.nominal;
      rolesBox.innerHTML = fmt.roles.map((r: any) => {
        const count = r.count > 0 ? Math.max(1, Math.round(r.count * scale)) : 0;
        const name = L(ROLE_NAMES[r.role] || { tr: r.role, en: r.role });
        const weapons = (r.weapons || []).map((w: string) => `<span class="tp-weapon">${w}</span>`).join('');
        return `<div class="tp-role-card">
          <div class="tp-role-head">
            <span class="tp-role-name">${ROLE_ICONS[r.role] || '🎯'} ${name}</span>
            <span class="tp-role-count">×${count}</span>
          </div>
          <div class="tp-weapons">${weapons}</div>
          <div class="tp-role-note">${L(r.note)}</div>
        </div>`;
      }).join('');
    }

    // Sinerjiler
    const synBox = $('#partySynergies');
    if (synBox) {
      synBox.innerHTML = data.party.synergies.map((s: any) => `<div class="tp-syn">
        <div class="tp-syn-title">${L(s.title)}</div>
        <div class="tp-syn-desc">${L(s.desc)}</div>
      </div>`).join('');
    }

    // Yemek & İksir
    const consBox = $('#partyConsumables');
    if (consBox) {
      consBox.innerHTML = data.party.consumables.map((c: any) => `<div class="tp-cons-row">
        <span class="tp-cons-role">${L(c.role)}</span>
        <span class="tp-cons-food">🍽️ ${c.food}</span>
        <span class="tp-cons-potion">🧪 ${L(c.potion)}</span>
      </div>`).join('');
    }
  }

  function initPartyBuilder() {
    const data = DATA();
    if (!data) return;
    const fmtBox = $('#partyFormats');
    if (fmtBox) {
      fmtBox.innerHTML = data.party.formats.map((f: any, i: number) =>
        `<button class="tp-btn${i === 0 ? ' active' : ''}" data-format="${f.id}">${L(f.label)}</button>`
      ).join('');
      $$('#partyFormats .tp-btn').forEach((b) => b.addEventListener('click', () => {
        partyFormatId = b.dataset.format || 'small';
        const slider = $('#partySize') as HTMLInputElement;
        if (slider) slider.value = partyFormatId === 'small' ? '7' : '20';
        renderParty();
      }));
    }
    const slider = $('#partySize');
    if (slider) slider.addEventListener('input', renderParty);
    renderParty();
  }

  // ────────────────────────────────────────────────────────────
  // KILLBOARD ANALİZİ (Aşama 9)
  // ────────────────────────────────────────────────────────────
  const GI_HOSTS: Record<string, string> = {
    us: 'gameinfo.albiononline.com',
    eu: 'gameinfo-ams.albiononline.com',
    asia: 'gameinfo-sgp.albiononline.com'
  };

  let kbServer = 'eu';
  let kbWindow = 6; // saat; 0 = tümü
  let kbLoaded = false;
  let kbEvents: any[] = [];
  let kbSource = 'live'; // live | feed
  let kbFetchedAt = '';
  let kbWeaponSide: 'killer' | 'victim' = 'killer';
  const kbCharts: Record<string, any> = {};

  // Tek sayfa mimarisinde uygulama kökte çalışır; eski `../data/...` yolu 404
  // veriyordu. Üç olası kökü sırayla dener, ilk çalışanı kullanır.
  const FEED_PATHS = ['data/pvp-feed.json', '../data/pvp-feed.json', './data/pvp-feed.json'];
  // gameinfo API tarayıcıya Access-Control-Allow-Origin göndermediğinde her
  // sunucu değişiminde 7 istek boşa gitmesin diye bir kez kilitlenir.
  let liveBlocked = false;

  async function fetchJson(url: string, ms = 12000): Promise<any> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally { clearTimeout(timer); }
  }

  async function fetchFirstJson(paths: string[], ms = 9000): Promise<{ json: any; path: string } | null> {
    for (const p of paths) {
      try {
        const sep = p.includes('?') ? '&' : '?';
        return { json: await fetchJson(`${p}${sep}t=${Date.now()}`, ms), path: p };
      } catch (_) { /* sıradaki yol */ }
    }
    return null;
  }

  interface EventSet { events: any[]; source: 'live' | 'feed'; fetchedAt: string; }

  function toEvent(e: any): any {
    return {
      ts: new Date(e.t ?? e.timestamp),
      killerIP: Math.round(e.k ?? e.killerIP ?? 0),
      victimIP: Math.round(e.v ?? e.victimIP ?? 0),
      weapon: e.w ?? e.weapon ?? '',
      victimWeapon: e.wv ?? e.victimWeapon ?? e.equipment?.MainHand?.type ?? '',
      fame: Number(e.f ?? e.totalFame ?? 0) || 0,
      partySize: Number(e.p ?? e.partySize ?? 1) || 1,
      killer: e.n ?? e.killer ?? '?',
      victim: e.nv ?? e.victim ?? '?'
    };
  }

  /** Canlı API → yoksa bot feed'i (3 sunucu, ~240 olay) */
  async function loadEventSet(server: string): Promise<EventSet> {
    let events: any[] = [];

    if (!liveBlocked) {
      try {
        const host = GI_HOSTS[server];
        const offsets = [0, 51, 102, 153, 204, 255, 306]; // 7 sayfa ≈ 357 olay
        const pages = await Promise.all(offsets.map((o) =>
          fetchJson(`https://${host}/api/gameinfo/events?limit=51&offset=${o}`, 9000).catch(() => null)
        ));
        const seen = new Set<string>();
        pages.forEach((raw) => {
          if (!Array.isArray(raw)) return;
          raw.forEach((e: any) => {
            const id = String(e.EventId || '');
            if (id && seen.has(id)) return;
            if (id) seen.add(id);
            const ts = new Date(e.TimeStamp);
            if (isNaN(ts.getTime())) return;
            events.push(toEvent({
              timestamp: e.TimeStamp,
              killerIP: e.Killer?.AverageItemPower || 0,
              victimIP: e.Victim?.AverageItemPower || 0,
              weapon: e.Killer?.Equipment?.MainHand?.Type || '',
              victimWeapon: e.Victim?.Equipment?.MainHand?.Type || '',
              fame: e.TotalVictimKillFame || 0,
              partySize: (e.GroupMembers?.length || 0) + 1,
              killer: e.Killer?.Name || '?',
              victim: e.Victim?.Name || '?'
            }));
          });
        });
        if (!events.length) liveBlocked = true;
      } catch (_) {
        liveBlocked = true; // CORS/ağ engeli → bir daha denenmez
      }
    }

    let source: 'live' | 'feed' = 'live';
    let fetchedAt = new Date().toISOString();

    if (!events.length) {
      const hit = await fetchFirstJson(FEED_PATHS);
      const feed = hit?.json;
      fetchedAt = feed?.fetchedAt || '';
      const srv = feed?.servers?.[server];
      if (srv) {
        if (Array.isArray(srv.analysis) && srv.analysis.length) {
          // Sıkı dizi biçimi: [ts, killerIP, victimIP, killerW, victimW, fame, party, killer, victim]
          events = srv.analysis.map((a: any) => Array.isArray(a)
            ? toEvent({ t: a[0], k: a[1], v: a[2], w: a[3], wv: a[4], f: a[5], p: a[6], n: a[7], nv: a[8] })
            : toEvent(a)
          ).filter((e: any) => !isNaN(e.ts.getTime()));
        } else {
          // Eski feed biçimi: recentKills + topKills
          const kills = [...(srv.recentKills || []), ...(srv.topKills || [])];
          const seenK = new Set<string>();
          events = kills.filter((k: any) => {
            if (!k?.id || seenK.has(k.id)) return false;
            seenK.add(k.id);
            return true;
          }).map(toEvent).filter((e: any) => !isNaN(e.ts.getTime()));
        }
      }
      source = 'feed';
    }

    events.sort((a, b) => b.ts.getTime() - a.ts.getTime());
    return { events, source, fetchedAt };
  }

  async function loadKillboard(force = false) {
    const statsBox = $('#kbStats');
    kbLoaded = true;
    if (statsBox && !kbEvents.length) statsBox.innerHTML = '<div class="kb-empty">…</div>';
    const srcLine = $('#kbSourceLine');
    if (srcLine) srcLine.textContent = getLang() === 'tr' ? 'Veri çekiliyor…' : 'Fetching data…';

    const set = await loadEventSet(kbServer);
    kbEvents = set.events;
    kbSource = set.source;
    kbFetchedAt = set.fetchedAt;
    renderKillboard(force);
  }

  function renderSourceLine(el: HTMLElement | null, count: number) {
    if (!el) return;
    const tr = getLang() === 'tr';
    const stamp = kbFetchedAt ? new Date(kbFetchedAt) : null;
    const when = stamp && !isNaN(stamp.getTime())
      ? stamp.toLocaleString(tr ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
      : '—';
    const badge = kbSource === 'live'
      ? (tr ? 'canlı API' : 'live API')
      : (tr ? 'bot feed\'i' : 'bot feed');
    el.innerHTML = `<span class="kb-source-badge ${kbSource}">${badge}</span> ${count} ${tr ? 'olay' : 'events'} · ${tr ? 'güncelleme' : 'updated'} ${when}`;
  }

  function renderKillboard(_force = false) {
    const statsBox = $('#kbStats');
    if (!statsBox) return;

    if (!kbEvents.length) {
      renderSourceLine($('#kbSourceLine'), 0);
      statsBox.innerHTML = `<div class="kb-empty">${
        getLang() === 'tr'
          ? 'Bu sunucu için veri bulunamadı. Canlı API tarayıcıdan engellenmiş olabilir; bot feed\'i birkaç saatte bir yenilenir. Farklı bir sunucu deneyin veya ⟳ Yenile ile tekrar deneyin.'
          : 'No data for this server. The live API may be blocked in the browser; the bot feed refreshes every few hours. Try another server or press ⟳ Refresh.'
      }</div>`;
      Object.keys(kbCharts).forEach((k) => { try { kbCharts[k].destroy(); } catch (_) {} });
      return;
    }
    renderSourceLine($('#kbSourceLine'), kbEvents.length);

    // ── Uyarlanabilir bucket: yoğun sunucuda dakikalık, sakin dönemde saatlik ──
    const now = Date.now();
    const windowMs = kbWindow > 0 ? kbWindow * 3600000 : Infinity;
    const inWindow = kbEvents.filter((e) => now - e.ts.getTime() <= windowMs);
    const evts = inWindow.length ? inWindow : kbEvents;
    const minTs = Math.min(...evts.map((e) => e.ts.getTime()));
    const maxTs = Math.max(...evts.map((e) => e.ts.getTime()));
    const spanMs = maxTs - minTs;
    const bucketMs = spanMs <= 2 * 3600000 ? 300000 : 3600000; // 5 dk veya 1 saat
    const tr0 = getLang() === 'tr';
    const spanText = spanMs >= 3600000
      ? (tr0 ? `son ${Math.max(1, Math.round(spanMs / 3600000))} saat` : `last ${Math.max(1, Math.round(spanMs / 3600000))}h`)
      : (tr0 ? `son ${Math.max(1, Math.round(spanMs / 60000))} dakika` : `last ${Math.max(1, Math.round(spanMs / 60000))}m`);
    const unitLabel = bucketMs === 300000
      ? (tr0 ? `5 Dakikalık Kill Dağılımı (${spanText})` : `5-Minute Kill Distribution (${spanText})`)
      : (tr0 ? `Saatlik Kill Dağılımı (${spanText})` : `Hourly Kill Distribution (${spanText})`);
    const ipUnitLabel = bucketMs === 300000
      ? (tr0 ? `5 Dakikalık Ort. IP (Killer vs Victim)` : `5-Minute Avg IP (Killer vs Victim)`)
      : (tr0 ? `Saatlik Ort. IP (Killer vs Victim)` : `Hourly Avg IP (Killer vs Victim)`);
    const titleHourly = document.getElementById('kbTitleHourly');
    if (titleHourly) titleHourly.textContent = unitLabel;
    const titleIP = document.getElementById('kbTitleIP');
    if (titleIP) titleIP.textContent = ipUnitLabel;

    // ── İstatistik kartları ──
    const total = evts.length;
    const avgK = Math.round(evts.reduce((s, e) => s + e.killerIP, 0) / total);
    const avgV = Math.round(evts.reduce((s, e) => s + e.victimIP, 0) / total);
    const avgDiff = avgK - avgV;
    const solo = evts.filter((e) => e.partySize <= 1).length;
    const weaponCount: Record<string, number> = {};
    const weaponKey = kbWeaponSide === 'killer' ? 'weapon' : 'victimWeapon';
    evts.forEach((e) => { const w = e[weaponKey]; if (w) weaponCount[w] = (weaponCount[w] || 0) + 1; });
    const topWeapon = Object.entries(weaponCount).sort((a, b) => b[1] - a[1])[0];
    const tr = getLang() === 'tr';

    statsBox.innerHTML = [
      { v: String(total), l: tr ? 'Toplam Kill' : 'Total Kills' },
      { v: String(avgK), l: tr ? 'Ort. Killer IP' : 'Avg Killer IP' },
      { v: String(avgV), l: tr ? 'Ort. Victim IP' : 'Avg Victim IP' },
      { v: (avgDiff > 0 ? '+' : '') + avgDiff, l: tr ? 'Ort. IP Farkı' : 'Avg IP Diff' },
      { v: topWeapon ? topWeapon[0].split('_').pop() : '—', l: (tr ? 'En Çok Silah · ' : 'Top Weapon · ') + (kbWeaponSide === 'killer' ? (tr ? 'öldüren' : 'killer') : (tr ? 'ölen' : 'victim')) },
      { v: `${Math.round(solo / total * 100)}%`, l: tr ? 'Solo Kill Oranı' : 'Solo Kill Rate' }
    ].map((s) => `<div class="kb-stat"><div class="kb-stat-val">${s.v}</div><div class="kb-stat-label">${s.l}</div></div>`).join('');

    // ── Bucket dizilimi ──
    const startTs = windowMs === Infinity ? minTs : Math.max(minTs, now - windowMs);
    const startBucket = Math.floor(startTs / bucketMs) * bucketMs;
    const labels: string[] = [];
    const killBuckets: number[] = [];
    const killerIPBuckets: number[] = [];
    const victimIPBuckets: number[] = [];
    for (let t = startBucket; t <= now && labels.length < 60; t += bucketMs) {
      const bucketEvents = evts.filter((e) => e.ts.getTime() >= t && e.ts.getTime() < t + bucketMs);
      labels.push(new Date(t).toLocaleTimeString(tr ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' }));
      killBuckets.push(bucketEvents.length);
      killerIPBuckets.push(bucketEvents.length ? Math.round(bucketEvents.reduce((s, e) => s + e.killerIP, 0) / bucketEvents.length) : 0);
      victimIPBuckets.push(bucketEvents.length ? Math.round(bucketEvents.reduce((s, e) => s + e.victimIP, 0) / bucketEvents.length) : 0);
    }

    drawChart('kbChartHourly', 'bar', labels, [
      { label: tr ? 'Kill' : 'Kills', data: killBuckets, backgroundColor: 'rgba(201,168,76,0.65)', borderColor: '#c9a84c', borderWidth: 1 }
    ]);
    drawChart('kbChartIP', 'line', labels, [
      { label: tr ? 'Killer IP' : 'Killer IP', data: killerIPBuckets, borderColor: '#4cc38a', backgroundColor: 'rgba(76,195,138,0.12)', tension: 0.3, spanGaps: true },
      { label: tr ? 'Victim IP' : 'Victim IP', data: victimIPBuckets, borderColor: '#e5534b', backgroundColor: 'rgba(229,83,75,0.12)', tension: 0.3, spanGaps: true }
    ]);

    // ── Silah dağılımı (top 10) ──
    const topWeapons = Object.entries(weaponCount).sort((a, b) => b[1] - a[1]).slice(0, 10);
    drawChart('kbChartWeapons', 'bar', topWeapons.map(([w]) => w.split('_').pop() || w), [
      {
        label: (kbWeaponSide === 'killer' ? (tr ? 'Öldüren silahı' : 'Killer weapon') : (tr ? 'Ölen silahı' : 'Victim weapon'))
          + (kbSource === 'live' ? (tr ? ' (canlı)' : ' (live)') : (tr ? ' (bot feed\'i)' : ' (bot feed)')),
        data: topWeapons.map(([, c]) => c),
        backgroundColor: 'rgba(96,145,224,0.6)', borderColor: '#6091e0', borderWidth: 1
      }
    ], true);
  }

  function drawChart(canvasId: string, type: string, labels: string[], datasets: any[], horizontal = false) {
    const ChartLib = (window as any).Chart;
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) return;
    if (!ChartLib) {
      const wrap = canvas.parentElement;
      if (wrap && !wrap.querySelector('.kb-empty')) {
        wrap.innerHTML = `<div class="kb-empty">${getLang() === 'tr' ? 'Grafik kitaplığı yüklenemedi (CDN erişimi kapalı olabilir).' : 'Chart library could not load (CDN may be blocked).'}</div>`;
      }
      return;
    }
    if (kbCharts[canvasId]) { try { kbCharts[canvasId].destroy(); } catch (_) {} }
    ChartLib.defaults.color = '#9aa0a6';
    ChartLib.defaults.borderColor = 'rgba(255,255,255,0.07)';
    kbCharts[canvasId] = new ChartLib(canvas, {
      type,
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: horizontal ? 'y' : 'x',
        plugins: { legend: { labels: { boxWidth: 12, font: { size: 11 } } } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  function initKillboard() {
    $$('#kbServers .tp-btn').forEach((b) => b.addEventListener('click', () => {
      $$('#kbServers .tp-btn').forEach((x) => x.classList.toggle('active', x === b));
      kbServer = b.dataset.kbServer || 'eu';
      loadKillboard(true);
    }));
    $$('#kbWindows .tp-btn').forEach((b) => b.addEventListener('click', () => {
      $$('#kbWindows .tp-btn').forEach((x) => x.classList.toggle('active', x === b));
      kbWindow = Number(b.dataset.kbWindow || 6);
      renderKillboard();
    }));
    $$('#kbWeaponSide .tp-btn').forEach((b) => b.addEventListener('click', () => {
      $$('#kbWeaponSide .tp-btn').forEach((x) => x.classList.toggle('active', x === b));
      kbWeaponSide = (b.dataset.kbSide as 'killer' | 'victim') || 'killer';
      if (kbLoaded) renderKillboard();
    }));
    $('#kbRefresh')?.addEventListener('click', () => { liveBlocked = false; loadKillboard(true); });
  }

  // ────────────────────────────────────────────────────────────
  // ANA SAYFA KILLBOARD PANELİ
  // (Eski sürümde killboard-1.com iframe'i vardı; site X-Frame-Options:
  //  SAMEORIGIN + 403 döndüğü için panel boş kalıyordu. Artık aynı veri
  //  hattıyla yerleşik özet çiziliyor.)
  // ────────────────────────────────────────────────────────────
  let dashServer = 'eu';
  let dashCache: { key: string; set: EventSet; at: number } | null = null;
  let dashBusy = false;

  function shortWeapon(id: string): string {
    if (!id) return '—';
    return String(id).replace(/^T\d+_/, '').replace(/@\d+$/, '').split('_').pop() || id;
  }

  async function mountDashKillboard(force = false) {
    const statsBox = document.getElementById('dashKbStats');
    if (!statsBox) return;
    const tr = getLang() === 'tr';
    const srcLine = document.getElementById('dashKbSource');
    const feedBox = document.getElementById('dashKbFeed');

    const stale = !dashCache || dashCache.key !== dashServer || Date.now() - dashCache.at > 5 * 60 * 1000;
    if (force || stale) {
      if (dashBusy) return;
      dashBusy = true;
      if (srcLine) srcLine.textContent = tr ? 'Veri çekiliyor…' : 'Fetching data…';
      try {
        const set = await loadEventSet(dashServer);
        dashCache = { key: dashServer, set, at: Date.now() };
      } finally { dashBusy = false; }
    }
    const set = dashCache?.set;
    if (!set) return;

    kbSource = set.source;
    kbFetchedAt = set.fetchedAt;
    const evts = set.events;
    renderSourceLine(srcLine, evts.length);

    if (!evts.length) {
      statsBox.innerHTML = `<div class="kb-empty">${tr ? 'Bu sunucu için veri yok. ⟳ yenilemeyi deneyin.' : 'No data for this server. Try a refresh.'}</div>`;
      if (feedBox) feedBox.innerHTML = '';
      return;
    }

    const total = evts.length;
    const avgK = Math.round(evts.reduce((s, e) => s + e.killerIP, 0) / total);
    const avgV = Math.round(evts.reduce((s, e) => s + e.victimIP, 0) / total);
    const diff = avgK - avgV;
    const solo = evts.filter((e) => e.partySize <= 1).length;
    statsBox.innerHTML = [
      { v: String(total), l: tr ? 'Kill (örneklem)' : 'Kills (sample)' },
      { v: String(avgK), l: tr ? 'Ort. Öldüren IP' : 'Avg Killer IP' },
      { v: String(avgV), l: tr ? 'Ort. Ölen IP' : 'Avg Victim IP' },
      { v: (diff > 0 ? '+' : '') + diff, l: tr ? 'IP Farkı' : 'IP Diff' },
      { v: `${Math.round(solo / total * 100)}%`, l: tr ? 'Solo oranı' : 'Solo rate' }
    ].map((s) => `<div class="kb-stat"><div class="kb-stat-val">${s.v}</div><div class="kb-stat-label">${s.l}</div></div>`).join('');

    if (feedBox) {
      feedBox.innerHTML = evts.slice(0, 12).map((e) => {
        const time = e.ts.toLocaleTimeString(tr ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
        return `<div class="dash-kb-row">
          <span class="dash-kb-time">${time}</span>
          <span class="dash-kb-names"><b>${e.killer}</b> <span class="dash-kb-arrow">→</span> ${e.victim}</span>
          <span class="dash-kb-ip">${e.killerIP} vs ${e.victimIP}</span>
          <span class="dash-kb-w">${shortWeapon(e.weapon)}</span>
        </div>`;
      }).join('');
    }

    const weaponCount: Record<string, number> = {};
    evts.forEach((e) => { const w = e.weapon || e.victimWeapon; if (w) weaponCount[w] = (weaponCount[w] || 0) + 1; });
    const top = Object.entries(weaponCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
    drawChart('dashKbChart', 'bar', top.map(([w]) => shortWeapon(w)), [
      {
        label: tr ? 'Öldüren silahı' : 'Killer weapon',
        data: top.map(([, c]) => c),
        backgroundColor: 'rgba(201,168,76,0.65)', borderColor: '#c9a84c', borderWidth: 1
      }
    ], true);
  }

  function initDashKillboard() {
    const group = document.getElementById('dashKbServers');
    if (!group) return;
    group.querySelectorAll<HTMLElement>('[data-dash-kb]').forEach((b) => {
      b.addEventListener('click', () => {
        group.querySelectorAll<HTMLElement>('[data-dash-kb]').forEach((x) => x.classList.toggle('active', x === b));
        dashServer = b.dataset.dashKb || 'eu';
        mountDashKillboard(true);
      });
    });
    (window as any).mountDashKillboard = mountDashKillboard;
  }

  // ────────────────────────────────────────────────────────────
  // AVALON & HCE
  // ────────────────────────────────────────────────────────────
  function renderAvalon() {
    const box = $('#pveAvalon');
    const data = DATA();
    if (!box || !data) return;
    const a = data.avalon;
    box.innerHTML = `
      <div class="pve-section">
        <div class="pve-intro">${L(a.intro)}</div>
        <div class="pve-ip">📌 <b>${getLang() === 'tr' ? 'Ekipman & Hazırlık' : 'Gear & Prep'}</b><br/>${L(a.ip)}</div>
      </div>
      <div class="pve-section">
        <h3 style="font-family:var(--font-display);color:var(--gold);margin-bottom:12px">👑 ${getLang() === 'tr' ? 'Boss Rehberi' : 'Boss Guide'}</h3>
        <div class="pve-grid">${a.bosses.map((b: any) => `<div class="pve-card">
          <h4>⚔️ ${b.name}</h4>
          <div class="pve-line"><b>${getLang() === 'tr' ? 'Mekanik:' : 'Mechanics:'}</b> ${L(b.phases)}</div>
          <div class="pve-line"><b>${getLang() === 'tr' ? 'Counter:' : 'Counter:'}</b> ${L(b.counter)}</div>
          <div class="pve-line">🎁 ${L(b.drops)}</div>
        </div>`).join('')}</div>
      </div>
      <div class="pve-section">
        <h3 style="font-family:var(--font-display);color:var(--gold);margin-bottom:12px">👾 ${getLang() === 'tr' ? "Tehlikeli Mob'lar" : 'Dangerous Mobs'}</h3>
        <div class="pve-grid">${a.mobs.map((m: any) => `<div class="pve-card">
          <h4>☠️ ${m.name}</h4>
          <div class="pve-line">${L(m.mechanic)}</div>
        </div>`).join('')}</div>
      </div>
      <div class="pve-section">
        <h3 style="font-family:var(--font-display);color:var(--gold);margin-bottom:12px">🧠 ${getLang() === 'tr' ? 'Counter Toolkit' : 'Counter Toolkit'}</h3>
        <div class="pve-intro">${L(a.counterKit)}</div>
      </div>
      <div class="pve-section">
        <h3 style="font-family:var(--font-display);color:var(--gold);margin-bottom:12px">👥 ${getLang() === 'tr' ? 'Önerilen Kompozisyon (20 kişi)' : 'Recommended Composition (20 players)'}</h3>
        <div class="pve-grid">${a.comp.map((c: any) => `<div class="pve-card">
          <h4>${L(c.role)}</h4>
          <div class="pve-line">${c.picks}</div>
        </div>`).join('')}</div>
      </div>`;
  }

  function renderHce() {
    const box = $('#pveHce');
    const data = DATA();
    if (!box || !data) return;
    const h = data.hce;
    box.innerHTML = `
      <div class="pve-section">
        <div class="pve-intro">${L(h.intro)}</div>
        <table class="pve-table">
          <thead><tr>
            <th>${getLang() === 'tr' ? 'Harita' : 'Map'}</th>
            <th>${getLang() === 'tr' ? 'Mob Ailesi' : 'Mob Family'}</th>
            <th>${getLang() === 'tr' ? 'Zorluk' : 'Difficulty'}</th>
            <th>Boss</th>
          </tr></thead>
          <tbody>${h.maps.map((m: any) => `<tr>
            <td><b>${m.name}</b></td>
            <td>${m.family}</td>
            <td class="pve-diff">${m.difficulty}</td>
            <td>${m.boss}</td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
      <div class="pve-section">
        <h3 style="font-family:var(--font-display);color:var(--gold);margin-bottom:12px">👥 ${getLang() === 'tr' ? 'Parti Kompozisyonu (5 kişi)' : 'Party Composition (5 players)'}</h3>
        <div class="pve-grid">${h.comp.map((c: any) => `<div class="pve-card">
          <h4>${L(c.role)}</h4>
          <div class="pve-line">${c.picks}</div>
        </div>`).join('')}</div>
      </div>
      <div class="pve-section">
        <h3 style="font-family:var(--font-display);color:var(--gold);margin-bottom:12px">⚠️ ${getLang() === 'tr' ? 'Harita Mekanikleri' : 'Map Mechanics'}</h3>
        <div class="pve-grid">${h.mechanics.map((m: any) => `<div class="pve-card">
          <h4>📍 ${m.map}</h4>
          <div class="pve-line">${getLang() === 'tr' ? m.tr : m.en}</div>
        </div>`).join('')}</div>
      </div>`;
  }

  function initPve() {
    $$('#pveSubTabs .tp-btn').forEach((b) => b.addEventListener('click', () => {
      $$('#pveSubTabs .tp-btn').forEach((x) => x.classList.toggle('active', x === b));
      const tab = b.dataset.pveTab;
      const avalonBox = $('#pveAvalon');
      const hceBox = $('#pveHce');
      if (avalonBox) avalonBox.style.display = tab === 'avalon' ? '' : 'none';
      if (hceBox) hceBox.style.display = tab === 'hce' ? '' : 'none';
      if (tab === 'avalon') renderAvalon(); else renderHce();
    }));
    renderAvalon();
    renderHce();
  }

  // ────────────────────────────────────────────────────────────
  // BAŞLAT + DİL DEĞİŞİMİ
  // ────────────────────────────────────────────────────────────
  function initAll() {
    initTabs();
    initPartyBuilder();
    initKillboard();
    initDashKillboard();
    initPve();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();

  window.addEventListener('aot:langchange', () => {
    // Statik metinler i18n motoru tarafından çevrilir; dinamik içerik bizde:
    renderParty();
    renderAvalon();
    renderHce();
    if (kbLoaded) renderKillboard();
    if (dashCache && !document.getElementById('dashPanelKillboard')?.classList.contains('hidden')) mountDashKillboard();
  });
})();

export {};
