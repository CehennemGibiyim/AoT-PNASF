// AoT-PNASF — PvP & İstatistik v2
// Veri kaynağı: src/data/pvp-feed.json (GitHub Actions her 5dk günceller)
// Oyuncu/Guild arama: GameInfo API → allorigins.win proxy (sadece arama için)

const RENDER = 'https://render.albiononline.com/v1/item';
const FEED_URL = '../data/pvp-feed.json';
// Sadece arama için proxy (hafif istek, proxy yeterli)
const GI_SEARCH = {
  us:   'https://gameinfo.albiononline.com/api/gameinfo',
  eu:   'https://gameinfo-ams.albiononline.com/api/gameinfo',
  asia: 'https://gameinfo-sgp.albiononline.com/api/gameinfo',
};
const PROXY = 'https://api.allorigins.win/get?url=';

// ─── STATE ────────────────────────────────────────────────
let pvpServer   = 'us';
let searchType  = 'player';
let currentTab  = 'profile';
let killType    = 'recent';
let pvpFeed     = null;       // pvp-feed.json içeriği
let killTimer   = null;
let selectedEntity = null;

const getLang = () => localStorage.getItem('aot-lang') || 'tr';

// ─── YARDIMCILAR ─────────────────────────────────────────
function fmtFame(n) {
  if (!n || n <= 0) return '0';
  if (n >= 1_000_000_000) return (n/1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000)     return (n/1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return (n/1_000).toFixed(1) + 'K';
  return n.toLocaleString('tr-TR');
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  const lang = getLang();
  if (mins < 2)    return lang==='tr' ? 'Az önce' : 'Just now';
  if (mins < 60)   return `${mins}${lang==='tr'?'dk':'m'} ${lang==='tr'?'önce':'ago'}`;
  if (mins < 1440) return `${Math.floor(mins/60)}${lang==='tr'?'sa':'h'} ${lang==='tr'?'önce':'ago'}`;
  return `${Math.floor(mins/1440)}${lang==='tr'?'g':'d'} ${lang==='tr'?'önce':'ago'}`;
}

function getItemName(typeId) {
  if (!typeId) return '';
  const baseId = typeId.replace(/^T\d_/, '').replace(/@\d$/, '');
  const item = (window.AO_ITEMS || []).find(i => i.id === baseId);
  if (!item) return typeId.replace(/_/g,' ');
  return getLang()==='tr' ? item.tr : item.en;
}

function renderGear(equipment) {
  if (!equipment || !Object.keys(equipment).length)
    return `<span style="font-size:11px;color:var(--text-muted)">—</span>`;
  return Object.entries(equipment).map(([slot, item]) => {
    if (!item?.type) return '';
    const enc = item.type.match(/@(\d)$/)?.[1] || '';
    const id  = item.type.replace(/@\d$/,'');
    const src = `${RENDER}/${id}${enc?'@'+enc:''}.png`;
    const name = getItemName(id);
    return `<div class="kc-gear-item" title="${name}">
      <img class="kc-gear-img" src="${src}" onerror="this.style.opacity='.15'" alt="${name}"/>
    </div>`;
  }).join('');
}

function renderKillCard(kill) {
  const lang = getLang();
  const gear = renderGear(kill.equipment);
  return `<div class="kill-card kill-type">
    <div class="kc-side">
      <span class="kc-side-badge">${lang==='tr'?'KILL':'KILL'}</span>
      <span class="kc-side-time">${fmtDate(kill.timestamp)}</span>
    </div>
    <div class="kc-body">
      <div class="kc-title">
        <span class="kc-killer">${kill.killer}</span>
        ${kill.killerGuild ? `<span style="font-size:10px;color:var(--text-muted)">[${kill.killerGuild}]</span>` : ''}
        <span class="kc-arrow">→</span>
        <span class="kc-victim">${kill.victim}</span>
        ${kill.victimGuild ? `<span style="font-size:10px;color:var(--text-muted)">[${kill.victimGuild}]</span>` : ''}
      </div>
      <div class="kc-gear">${gear}</div>
      <div class="kc-meta">
        ${kill.victimIP > 0   ? `<span class="kc-badge kc-badge-ip">⚡ ${kill.victimIP} IP</span>` : ''}
        ${kill.totalFame > 0  ? `<span class="kc-badge kc-badge-fame">💀 ${fmtFame(kill.totalFame)}</span>` : ''}
        ${kill.location       ? `<span class="kc-badge kc-badge-loc">📍 ${kill.location}</span>` : ''}
        ${kill.partySize > 1  ? `<span class="kc-badge kc-badge-party">👥 ${kill.partySize} ${lang==='tr'?'kişi':'players'}</span>` : ''}
      </div>
    </div>
  </div>`;
}

// ─── FEED JSON YÜKLE ─────────────────────────────────────
async function loadFeed() {
  try {
    const res  = await fetch(`${FEED_URL}?t=${Date.now()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    pvpFeed = await res.json();
    return true;
  } catch(e) {
    pvpFeed = null;
    return false;
  }
}

function getServerData() {
  return pvpFeed?.servers?.[pvpServer] || null;
}

// ─── SUNUCU GEÇİŞİ ───────────────────────────────────────
function switchPvpServer(srv, btn) {
  pvpServer = srv;
  document.querySelectorAll('.pvp-srv-btn').forEach(b => b.classList.toggle('active', b === btn));
  const tag = document.querySelector('.pvp-server-tag');
  if (tag) tag.textContent = srv.toUpperCase();
  if (currentTab === 'kills')   renderKillFeed();
  if (currentTab === 'battles') renderBattles();
  if (currentTab === 'profile' && selectedEntity) loadPlayerProfile(selectedEntity.id);
}

// ─── ARAMA TÜRÜ ──────────────────────────────────────────
function switchSearchType(type, btn) {
  searchType = type;
  document.querySelectorAll('.pvp-stab').forEach(b => b.classList.toggle('active', b === btn));
  const lang = getLang();
  const input = document.getElementById('pvpSearch');
  const holders = {
    player:   lang==='tr' ? 'Oyuncu adı ara... (örn: Mustafa)' : 'Search player... (e.g. Mustafa)',
    guild:    lang==='tr' ? 'Guild adı ara...'                 : 'Search guild...',
    alliance: lang==='tr' ? 'Alliance adı ara...'              : 'Search alliance...',
  };
  if (input) { input.placeholder = holders[type]; input.value = ''; }
  document.getElementById('pvpSearchDd')?.classList.remove('open');
}

// ─── ARAMA (proxy ile sadece search) ─────────────────────
let searchTimer;
async function onPvpSearch(val) {
  const dd = document.getElementById('pvpSearchDd');
  clearTimeout(searchTimer);
  if (!val || val.length < 2) { dd?.classList.remove('open'); return; }

  searchTimer = setTimeout(async () => {
    try {
      const apiUrl = `${GI_SEARCH[pvpServer]}/search?q=${encodeURIComponent(val)}`;
      const proxied = `${PROXY}${encodeURIComponent(apiUrl)}`;
      const res  = await fetch(proxied, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const wrapper = await res.json();
      const data = JSON.parse(wrapper.contents || '{}');
      const lang = getLang();
      const results = searchType === 'guild'    ? (data.guilds    || [])
                    : searchType === 'alliance' ? (data.alliances || [])
                    : (data.players || []);
      if (!results.length || !dd) { dd?.classList.remove('open'); return; }
      dd.innerHTML = results.slice(0,8).map(r => {
        const name = r.Name || r.AllianceName || '—';
        const sub  = searchType === 'player'
          ? (r.GuildName ? `${r.GuildName}${r.AllianceName?' · '+r.AllianceName:''}` : (lang==='tr'?'Guildsiz':'No Guild'))
          : `${r.MemberCount||r.NumPlayers||0} ${lang==='tr'?'üye':'members'}`;
        return `<div class="pvp-dd-item" onclick="selectEntity('${r.Id}','${name.replace(/'/g,"\\'")}','${searchType}')">
          <div class="pvp-dd-avatar">${name.slice(0,2).toUpperCase()}</div>
          <div>
            <div class="pvp-dd-name">${name}</div>
            <div class="pvp-dd-sub">${sub}</div>
          </div>
          <span class="pvp-dd-type">${searchType==='player'?'👤':searchType==='guild'?'🏰':'⚔️'}</span>
        </div>`;
      }).join('');
      dd.classList.add('open');
    } catch(e) {
      // Arama hatası — sessizce geç
      dd?.classList.remove('open');
    }
  }, 400);
}

async function doSearch() {
  const val = document.getElementById('pvpSearch').value.trim();
  if (!val) return;
  // İlk sonucu otomatik seç
  try {
    const apiUrl  = `${GI_SEARCH[pvpServer]}/search?q=${encodeURIComponent(val)}`;
    const proxied = `${PROXY}${encodeURIComponent(apiUrl)}`;
    const res     = await fetch(proxied, { signal: AbortSignal.timeout(10000) });
    const wrapper = await res.json();
    const data    = JSON.parse(wrapper.contents || '{}');
    const results = searchType === 'guild' ? (data.guilds||[]) : (data.players||[]);
    if (results.length) selectEntity(results[0].Id, results[0].Name, searchType);
  } catch(e) {}
}

function selectEntity(id, name, type) {
  document.getElementById('pvpSearchDd')?.classList.remove('open');
  document.getElementById('pvpSearch').value = name;
  selectedEntity = { id, name, type: type || searchType };
  // Profil tabına geç
  document.querySelectorAll('.pvp-panel').forEach(p => p.style.display='none');
  document.getElementById('tab-profile').style.display = 'block';
  document.querySelectorAll('.pvp-tab').forEach(t => t.classList.toggle('active', t.textContent.includes('Profil') || t.textContent.includes('Profile')));
  currentTab = 'profile';
  if ((type||searchType) === 'guild' || (type||searchType) === 'alliance') loadGuildProfile(id, name);
  else loadPlayerProfile(id, name);
}

// ─── OYUNCU PROFİLİ ──────────────────────────────────────
async function loadPlayerProfile(playerId, playerName) {
  const empty = document.getElementById('profileEmpty');
  const cont  = document.getElementById('profileContent');
  if (empty) empty.style.display = 'none';
  cont.style.display = 'block';
  cont.innerHTML = '<div class="pvp-loading"><div class="loading-spinner"></div><span>Profil yükleniyor...</span></div>';
  const lang = getLang();

  try {
    // Proxy ile oyuncu profili
    const profUrl  = `${GI_SEARCH[pvpServer]}/players/${playerId}`;
    const killsUrl = `${GI_SEARCH[pvpServer]}/players/${playerId}/kills?limit=10&offset=0`;
    const deathUrl = `${GI_SEARCH[pvpServer]}/players/${playerId}/deaths?limit=10&offset=0`;

    const [profRes, killsRes, deathsRes] = await Promise.all([
      fetch(`${PROXY}${encodeURIComponent(profUrl)}`,  {signal:AbortSignal.timeout(12000)}),
      fetch(`${PROXY}${encodeURIComponent(killsUrl)}`, {signal:AbortSignal.timeout(12000)}),
      fetch(`${PROXY}${encodeURIComponent(deathUrl)}`, {signal:AbortSignal.timeout(12000)}),
    ]);

    const profile = JSON.parse((await profRes.json()).contents  || 'null');
    const killsRaw= JSON.parse((await killsRes.json()).contents || '[]');
    const deathsRaw=JSON.parse((await deathsRes.json()).contents|| '[]');

    if (!profile) throw new Error('empty profile');

    const name     = profile.Name || playerName || '—';
    const initials = name.slice(0,2).toUpperCase();
    const guild    = profile.GuildName    || (lang==='tr'?'Guildsiz':'No Guild');
    const alliance = profile.AllianceName || '';
    const kd = profile.DeathFame > 0
      ? (profile.KillFame / profile.DeathFame).toFixed(2)
      : '∞';

    // Kill event'lerini pvp.js formatına dönüştür
    const kills  = (Array.isArray(killsRaw)  ? killsRaw  : []).map(e => ({
      timestamp:  e.TimeStamp||'',
      killer:     e.Killer?.Name||'?',   killerGuild: e.Killer?.GuildName||'',
      victim:     e.Victim?.Name||'?',   victimGuild: e.Victim?.GuildName||'',
      victimIP:   Math.round(e.Victim?.AverageItemPower||0),
      totalFame:  e.TotalVictimKillFame||0,
      location:   e.Victim?.DeathZone||'',
      equipment:  cleanEqRaw(e.Victim?.Equipment),
      partySize:  (e.GroupMembers?.length||0)+1,
    }));
    const deaths = (Array.isArray(deathsRaw) ? deathsRaw : []).map(e => ({
      timestamp:  e.TimeStamp||'',
      killer:     e.Killer?.Name||'?',   killerGuild: e.Killer?.GuildName||'',
      victim:     e.Victim?.Name||'?',   victimGuild: e.Victim?.GuildName||'',
      victimIP:   Math.round(e.Victim?.AverageItemPower||0),
      totalFame:  e.TotalVictimKillFame||0,
      location:   e.Victim?.DeathZone||'',
      equipment:  cleanEqRaw(e.Victim?.Equipment),
      partySize:  (e.GroupMembers?.length||0)+1,
    }));

    const stats = [
      {label:'Kill Fame',  val:fmtFame(profile.KillFame),  icon:'⚔️', cls:'pvp'},
      {label:'Death Fame', val:fmtFame(profile.DeathFame), icon:'💀', cls:'death'},
      {label:'PvE Fame',   val:fmtFame(profile.LifetimeStatistics?.PvE?.Total), icon:'🐉', cls:'pve'},
      {label:'Crafting',   val:fmtFame(profile.LifetimeStatistics?.Crafting?.Total), icon:'🔨', cls:'craft'},
      {label:'Gathering',  val:fmtFame(profile.LifetimeStatistics?.Gathering?.All?.Total), icon:'⛏️', cls:'gather'},
      {label:'Fishing',    val:fmtFame(profile.LifetimeStatistics?.FishingFame), icon:'🎣', cls:'fish'},
    ];

    cont.innerHTML = `
      <div class="profile-card">
        <div class="pc-left">
          <div class="pc-avatar">${initials}</div>
          <div class="pc-name">${name}</div>
          <div class="pc-guild" style="${guild===lang==='tr'?'Guildsiz':'No Guild'?'color:var(--text-muted)':''}">🏰 ${guild}</div>
          ${alliance?`<div class="pc-alliance">⚔️ ${alliance}</div>`:''}
          <hr class="pc-divider"/>
          <div class="pc-stat"><span class="pc-stat-label">K/D</span><span class="pc-stat-val">${kd}</span></div>
          <div class="pc-stat"><span class="pc-stat-label">${lang==='tr'?'Sunucu':'Server'}</span><span class="pc-stat-val" style="font-size:11px">${pvpServer.toUpperCase()}</span></div>
          <div class="pc-stat"><a href="https://albiononline.com/killboard/player/${playerId}" target="_blank" style="color:var(--teal);font-size:11px;text-decoration:none">🔗 ${lang==='tr'?'Resmi Killboard':'Official Killboard'}</a></div>
        </div>
        <div class="pc-right">
          <div class="fame-grid">
            ${stats.map(s=>`<div class="fame-card ${s.cls}">
              <div class="fame-icon">${s.icon}</div>
              <div class="fame-label">${s.label}</div>
              <div class="fame-val">${s.val}</div>
            </div>`).join('')}
          </div>
          ${kills.length ? `<div class="kills-section">
            <div class="kills-section-header"><span class="kills-section-title">⚔️ ${lang==='tr'?`Son Kill'ler (${kills.length})`:`Recent Kills (${kills.length})`}</span></div>
            ${kills.slice(0,5).map(renderKillCard).join('')}
          </div>` : ''}
          ${deaths.length ? `<div class="kills-section">
            <div class="kills-section-header"><span class="kills-section-title">💀 ${lang==='tr'?`Son Death'ler (${deaths.length})`:`Recent Deaths (${deaths.length})`}</span></div>
            ${deaths.slice(0,5).map(k => renderKillCard({...k, _isDeath:true})).join('')}
          </div>` : ''}
        </div>
      </div>`;
  } catch(e) {
    cont.innerHTML = `<div class="pvp-error">
      <div class="err-icon">⚠️</div>
      <p>${lang==='tr'?'Oyuncu profili yüklenemedi. API geçici olarak yanıt vermiyor olabilir.':'Could not load player profile. API may be temporarily unavailable.'}</p>
      <button class="pvp-refresh-btn" onclick="loadPlayerProfile('${playerId}','${playerName||''}')" style="margin-top:12px">🔄 ${lang==='tr'?'Tekrar Dene':'Retry'}</button>
      <a href="https://albiononline.com/killboard/search#&name=${encodeURIComponent(playerName||'')}" target="_blank" style="display:block;margin-top:8px;color:var(--teal);font-size:12px">🔗 ${lang==='tr'?'Resmi Killboard\'da Ara':'Search on Official Killboard'}</a>
    </div>`;
  }
}

// Ham equipment objesini temizle
function cleanEqRaw(equipment) {
  if (!equipment) return {};
  const slots = ['MainHand','OffHand','Head','Armor','Shoes','Cape','Bag','Mount','Potion','Food'];
  const result = {};
  slots.forEach(slot => {
    const item = equipment[slot];
    if (item && item.Type) result[slot] = { type: item.Type, quality: item.Quality||1 };
  });
  return result;
}

// ─── GUILD PROFİLİ ───────────────────────────────────────
async function loadGuildProfile(guildId, guildName) {
  const empty = document.getElementById('profileEmpty');
  const cont  = document.getElementById('profileContent');
  if (empty) empty.style.display = 'none';
  cont.style.display = 'block';
  cont.innerHTML = '<div class="pvp-loading"><div class="loading-spinner"></div><span>Guild yükleniyor...</span></div>';
  const lang = getLang();
  try {
    const gUrl = `${GI_SEARCH[pvpServer]}/guilds/${guildId}`;
    const kUrl = `${GI_SEARCH[pvpServer]}/events?guildId=${guildId}&limit=10&sort=recent`;
    const [gRes, kRes] = await Promise.all([
      fetch(`${PROXY}${encodeURIComponent(gUrl)}`, {signal:AbortSignal.timeout(12000)}),
      fetch(`${PROXY}${encodeURIComponent(kUrl)}`, {signal:AbortSignal.timeout(12000)}),
    ]);
    const guild  = JSON.parse((await gRes.json()).contents || 'null');
    const killsRaw = JSON.parse((await kRes.json()).contents || '[]');
    if (!guild) throw new Error('empty');
    const kills = (Array.isArray(killsRaw)?killsRaw:[]).map(e=>({
      timestamp: e.TimeStamp||'', killer: e.Killer?.Name||'?', killerGuild:'',
      victim: e.Victim?.Name||'?', victimGuild:'',
      victimIP: Math.round(e.Victim?.AverageItemPower||0),
      totalFame: e.TotalVictimKillFame||0, location: e.Victim?.DeathZone||'',
      equipment: cleanEqRaw(e.Victim?.Equipment), partySize: (e.GroupMembers?.length||0)+1,
    }));
    cont.innerHTML = `
      <div class="guild-card">
        <div>
          <div class="gc-name">${guild.Name||guildName||'—'}</div>
          <div class="gc-alliance">${guild.AllianceName?'⚔️ '+guild.AllianceName:(lang==='tr'?'Alliance yok':'No Alliance')}</div>
          <div class="gc-stats">
            <div class="gc-stat"><span class="gc-stat-label">Kill Fame</span><span class="gc-stat-val">${fmtFame(guild.killFame||guild.KillFame)}</span></div>
            <div class="gc-stat"><span class="gc-stat-label">Death Fame</span><span class="gc-stat-val">${fmtFame(guild.deathFame||guild.DeathFame)}</span></div>
            <div class="gc-stat"><span class="gc-stat-label">${lang==='tr'?'Üye':'Members'}</span><span class="gc-stat-val">${guild.MemberCount||'—'}</span></div>
          </div>
          <a href="https://albiononline.com/killboard/guild/${guildId}" target="_blank" style="color:var(--teal);font-size:11px;text-decoration:none;display:block;margin-top:10px">🔗 ${lang==='tr'?'Resmi Killboard':'Official Killboard'}</a>
        </div>
        <div>
          <div class="gc-section-title">${lang==='tr'?'Son Kill\'ler':'Recent Kills'}</div>
          ${kills.length?kills.slice(0,5).map(renderKillCard).join(''):`<p style="color:var(--text-muted);font-size:12px">—</p>`}
        </div>
      </div>`;
  } catch(e) {
    cont.innerHTML = `<div class="pvp-error"><div class="err-icon">⚠️</div>
      <p>${lang==='tr'?'Guild yüklenemedi.':'Could not load guild.'}</p>
      <a href="https://albiononline.com/killboard/search#&name=${encodeURIComponent(guildName||'')}" target="_blank" style="color:var(--teal);font-size:12px">🔗 ${lang==='tr'?'Resmi Killboard\'da Ara':'Search on Official Killboard'}</a>
    </div>`;
  }
}

// ─── TAB GEÇİŞİ ──────────────────────────────────────────
function switchPvpTab(tab, btn) {
  currentTab = tab;
  document.querySelectorAll('.pvp-panel').forEach(p => p.style.display='none');
  document.querySelectorAll('.pvp-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-'+tab).style.display = 'block';
  if (btn) btn.classList.add('active');
  if (tab==='kills')   { renderKillFeed(); startKillTimer(); }
  else stopKillTimer();
  if (tab==='battles') renderBattles();
}

// ─── KILL FEED (JSON'dan) ─────────────────────────────────
let currentKillType = 'recent';
function switchKillType(type, btn) {
  currentKillType = type;
  document.querySelectorAll('.kf-tab').forEach(t => t.classList.toggle('active', t===btn));
  renderKillFeed();
}

function renderKillFeed() {
  const cont = document.getElementById('killFeedContent');
  const lang = getLang();
  if (!cont) return;
  if (!pvpFeed) {
    cont.innerHTML = `<div class="pvp-loading"><div class="loading-spinner"></div><span>${lang==='tr'?'Veri yükleniyor...':'Loading data...'}</span></div>`;
    loadFeed().then(() => renderKillFeed());
    return;
  }
  const srv = getServerData();
  if (!srv || !srv.ok) {
    cont.innerHTML = `<div class="pvp-error">
      <div class="err-icon">💀</div>
      <p>${lang==='tr'
        ? `${pvpServer.toUpperCase()} sunucusu için kill verisi henüz hazır değil. GitHub Actions her 5 dakikada günceller.`
        : `No kill data yet for ${pvpServer.toUpperCase()} server. GitHub Actions updates every 5 minutes.`}</p>
      <small style="color:var(--text-muted);font-family:var(--font-mono)">${lang==='tr'?'Son güncelleme: ':'Last update: '}${pvpFeed.fetchedAt ? new Date(pvpFeed.fetchedAt).toLocaleTimeString('tr-TR') : '—'}</small>
    </div>`;
    return;
  }
  const kills = currentKillType==='top' ? srv.topKills : srv.recentKills;
  if (!kills?.length) {
    cont.innerHTML = `<div class="pvp-error"><div class="err-icon">💀</div><p>${lang==='tr'?'Kill kaydı bulunamadı.':'No kills found.'}</p></div>`;
    return;
  }
  const age = pvpFeed.fetchedAt ? new Date(pvpFeed.fetchedAt).toLocaleTimeString('tr-TR') : '—';
  cont.innerHTML = `
    <div class="feed-age-bar">⏱ ${lang==='tr'?'Son güncelleme':'Last update'}: <strong>${age}</strong> · <span style="color:var(--teal)">GitHub Actions her 5dk çalışır</span></div>
    <div class="kills-section">${kills.map(renderKillCard).join('')}</div>`;
}

// ─── BATTLE BOARD (JSON'dan) ──────────────────────────────
function renderBattles() {
  const cont = document.getElementById('battleContent');
  const lang = getLang();
  if (!cont) return;
  if (!pvpFeed) {
    loadFeed().then(() => renderBattles());
    return;
  }
  const srv = getServerData();
  if (!srv?.battles?.length) {
    cont.innerHTML = `<div class="pvp-error">
      <div class="err-icon">🗺️</div>
      <p>${lang==='tr'?'Battle verisi henüz hazır değil. GitHub Actions her 5 dakikada günceller.':'Battle data not ready yet. GitHub Actions updates every 5 minutes.'}</p>
    </div>`;
    return;
  }
  cont.innerHTML = srv.battles.map(b => {
    const alliances = (b.alliances||[]).slice(0,4).map(a =>
      `<div class="bc-alliance">
        <div class="bc-alliance-name" title="${a.name}">${a.name}</div>
        <div><span class="bc-alliance-kills">⚔️ ${a.kills} kill</span> · <span class="bc-alliance-deaths">💀 ${a.deaths} death</span></div>
      </div>`
    ).join('');
    return `<div class="battle-card" onclick="window.open('https://albiononline.com/killboard/battle/${b.id}','_blank')">
      <div class="bc-top">
        <span class="bc-id">Battle #${b.id}</span>
        <span class="bc-time">${fmtDate(b.startTime)}</span>
      </div>
      <div class="bc-players">${alliances||`<span style="color:var(--text-muted);font-size:12px">${lang==='tr'?'Bilinmiyor':'Unknown'}</span>`}</div>
      <div class="bc-stats">
        <div class="bc-stat">${lang==='tr'?'Kill:':'Kills:'}<span>${b.totalKills}</span></div>
        <div class="bc-stat">${lang==='tr'?'Fame:':'Fame:'}<span>${fmtFame(b.totalFame)}</span></div>
        <div class="bc-stat">${lang==='tr'?'Oyuncu:':'Players:'}<span>${b.playerCount}</span></div>
        <div class="bc-stat" style="margin-left:auto"><span style="color:var(--teal);font-size:11px">🔗 ${lang==='tr'?'Detay':'Details'}</span></div>
      </div>
    </div>`;
  }).join('');
}

// ─── TIMER ───────────────────────────────────────────────
function startKillTimer() {
  stopKillTimer();
  killTimer = setInterval(async () => {
    if (currentTab === 'kills') {
      await loadFeed();
      renderKillFeed();
    }
  }, 60000); // 1 dakikada bir JSON'u yeniden çek
}
function stopKillTimer() {
  if (killTimer) { clearInterval(killTimer); killTimer = null; }
}

// ─── BAŞLAT ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Dropdown dışı tıklama
  document.addEventListener('click', e => {
    if (!e.target.closest('.pvp-search-wrap'))
      document.getElementById('pvpSearchDd')?.classList.remove('open');
  });
  // Feed'i ön yükle
  await loadFeed();
});
