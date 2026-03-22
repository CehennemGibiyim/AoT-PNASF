// AoT-PNASF — PvP & İstatistik v1
// GameInfo API: Oyuncu, Guild, Kill Feed, Battle Board

// ─── API ENDPOİNTLERİ ────────────────────────────────────
// CORS proxy üzerinden çağır — GameInfo API harici sitelerden direkt CORS hatası veriyor
const CORS_PROXY = 'https://corsproxy.io/?url=';

const GI_SERVERS = {
  us:   'https://gameinfo.albiononline.com/api/gameinfo',
  eu:   'https://gameinfo-ams.albiononline.com/api/gameinfo',
  asia: 'https://gameinfo-sgp.albiononline.com/api/gameinfo',
};
const RENDER = 'https://render.albiononline.com/v1/item';

// Proxy ile fetch — CORS sorununu aşar, timeout ekler
async function giFetch(path, timeoutMs = 10000) {
  const url = `${GI_SERVERS[pvpServer]}${path}`;
  const proxied = `${CORS_PROXY}${encodeURIComponent(url)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(proxied, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch(e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') throw new Error('timeout');
    throw e;
  }
}

// ─── STATE ────────────────────────────────────────────────
let pvpServer    = 'us';
let searchType   = 'player';   // player | guild | alliance
let killType     = 'recent';   // recent | top
let currentTab   = 'profile';
let killFeedTimer = null;
let selectedEntity = null;     // seçilen oyuncu/guild objesi

// ─── YARDIMCILAR ─────────────────────────────────────────
const GI = () => GI_SERVERS[pvpServer];
const getLang = () => localStorage.getItem('aot-lang') || 'tr';

function fmtFame(n) {
  if (!n || n <= 0) return '0';
  if (n >= 1000000000) return (n/1000000000).toFixed(2) + 'B';
  if (n >= 1000000)    return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000)       return (n/1000).toFixed(1) + 'K';
  return n.toLocaleString('tr-TR');
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const diff = Date.now() - d;
  const mins = Math.floor(diff / 60000);
  const lang = getLang();
  if (mins < 60) return `${mins}${lang==='tr'?'dk':'m'} ${lang==='tr'?'önce':'ago'}`;
  if (mins < 1440) return `${Math.floor(mins/60)}${lang==='tr'?'sa':'h'} ${lang==='tr'?'önce':'ago'}`;
  return `${Math.floor(mins/1440)}${lang==='tr'?'g':'d'} ${lang==='tr'?'önce':'ago'}`;
}

function getGearSlots(equipment) {
  if (!equipment) return [];
  const slots = ['MainHand','OffHand','Head','Armor','Shoes','Cape','Bag','Mount','Potion','Food'];
  const items = [];
  slots.forEach(slot => {
    const item = equipment[slot];
    if (item && item.Type) items.push({slot, type:item.Type, quality:item.Quality||1});
  });
  return items;
}

function renderGear(equipment) {
  const slots = getGearSlots(equipment);
  if (!slots.length) return `<span style="font-size:11px;color:var(--text-muted)">— ekipman yok —</span>`;
  return slots.map(s => {
    const enc = s.type.match(/@(\d)$/)?.[1] || '';
    const id  = s.type.replace(/@\d$/,'');
    const src = `${RENDER}/${id}${enc?'@'+enc:''}.png`;
    const name = getItemDisplayName(id);
    return `<div class="kc-gear-item" title="${name}"><img class="kc-gear-img" src="${src}" onerror="this.style.opacity='.2'" alt="${name}"/></div>`;
  }).join('');
}

function getItemDisplayName(typeId) {
  if (!typeId) return '';
  const baseId = typeId.replace(/^T\d_/, '').replace(/@\d$/, '');
  const item = (window.AO_ITEMS || []).find(i => i.id === baseId);
  if (!item) return typeId.replace(/_/g,' ');
  return getLang()==='tr' ? item.tr : item.en;
}

function getIP(victim) {
  return victim?.AverageItemPower ? Math.round(victim.AverageItemPower) : null;
}

// ─── SUNUCU GEÇİŞİ ───────────────────────────────────────
function switchPvpServer(srv, btn) {
  pvpServer = srv;
  document.querySelectorAll('.pvp-srv-btn').forEach(b => b.classList.toggle('active', b === btn));
  // Aktif tabı yenile
  if (currentTab === 'kills')   loadKillFeed();
  if (currentTab === 'battles') loadBattles();
  if (selectedEntity && currentTab === 'profile') {
    if (searchType === 'player') loadPlayerProfile(selectedEntity.Id);
    if (searchType === 'guild')  loadGuildProfile(selectedEntity.Id);
  }
}

// ─── ARAMA TÜRÜ ──────────────────────────────────────────
function switchSearchType(type, btn) {
  searchType = type;
  document.querySelectorAll('.pvp-stab').forEach(b => b.classList.toggle('active', b === btn));
  const input = document.getElementById('pvpSearch');
  const lang = getLang();
  const placeholders = {
    player: lang==='tr' ? 'Oyuncu adı ara...' : 'Search player name...',
    guild:  lang==='tr' ? 'Guild adı ara...'  : 'Search guild name...',
    alliance: lang==='tr' ? 'Alliance adı ara...' : 'Search alliance name...',
  };
  if (input) input.placeholder = placeholders[type] || '';
  document.getElementById('pvpSearchDd').classList.remove('open');
  document.getElementById('pvpSearch').value = '';
}

// ─── ARAMA ───────────────────────────────────────────────
let searchTimer;
async function onPvpSearch(val) {
  const dd = document.getElementById('pvpSearchDd');
  clearTimeout(searchTimer);
  if (!val || val.length < 2) { dd.classList.remove('open'); return; }
  searchTimer = setTimeout(async () => {
    try {
      const data = await giFetch(`/search?q=${encodeURIComponent(val)}`);
      const lang = getLang();
      const results = searchType === 'guild'
        ? (data.guilds || [])
        : searchType === 'alliance'
          ? (data.alliances || [])
          : (data.players || []);
      if (!results.length) { dd.classList.remove('open'); return; }
      dd.innerHTML = results.slice(0,8).map(r => {
        const name = r.Name || r.AllianceName || '—';
        const sub  = searchType === 'player'
          ? (r.GuildName ? `${r.GuildName}${r.AllianceName?' · '+r.AllianceName:''}` : (lang==='tr'?'Guildless':'No Guild'))
          : searchType === 'guild'
            ? `${r.AllianceName||''} · ${(r.MemberCount||0)} ${lang==='tr'?'üye':'members'}`
            : `${(r.NumPlayers||0)} ${lang==='tr'?'oyuncu':'players'}`;
        const initials = name.slice(0,2).toUpperCase();
        return `<div class="pvp-dd-item" onclick="selectEntity('${r.Id}','${name.replace(/'/g,"\\'")}')">
          <div class="pvp-dd-avatar">${initials}</div>
          <div>
            <div class="pvp-dd-name">${name}</div>
            <div class="pvp-dd-sub">${sub}</div>
          </div>
          <span class="pvp-dd-type">${searchType==='player'?'👤':searchType==='guild'?'🏰':'⚔️'}</span>
        </div>`;
      }).join('');
      dd.classList.add('open');
    } catch(e) { dd.classList.remove('open'); }
  }, 300);
}

async function doSearch() {
  const val = document.getElementById('pvpSearch').value.trim();
  if (!val) return;
  try {
    const data = await giFetch(`/search?q=${encodeURIComponent(val)}`);
    const results = searchType === 'guild'
      ? (data.guilds || [])
      : searchType === 'alliance'
        ? (data.alliances || [])
        : (data.players || []);
    if (results.length) selectEntity(results[0].Id, results[0].Name || results[0].AllianceName);
  } catch(e) {}
}

function selectEntity(id, name) {
  document.getElementById('pvpSearchDd').classList.remove('open');
  document.getElementById('pvpSearch').value = name;
  selectedEntity = { Id: id, Name: name };
  // Profile tabına geç
  switchPvpTab('profile', document.querySelector('.pvp-tab'));
  if (searchType === 'player') loadPlayerProfile(id);
  else if (searchType === 'guild') loadGuildProfile(id);
  else loadGuildProfile(id); // alliance için guild benzeri göster
}

// ─── TAB GEÇİŞİ ──────────────────────────────────────────
function switchPvpTab(tab, btn) {
  currentTab = tab;
  document.querySelectorAll('.pvp-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.pvp-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-'+tab).style.display = 'block';
  if (btn) {
    document.querySelectorAll('.pvp-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  }
  if (tab === 'kills')   { loadKillFeed(); startKillFeedTimer(); }
  else { stopKillFeedTimer(); }
  if (tab === 'battles') loadBattles();
}

// ─── OYUNCU PROFİLİ ──────────────────────────────────────
async function loadPlayerProfile(playerId) {
  const empty = document.getElementById('profileEmpty');
  const cont  = document.getElementById('profileContent');
  if (empty) empty.style.display = 'none';
  if (cont)  { cont.style.display = 'block'; cont.innerHTML = '<div class="pvp-loading"><div class="loading-spinner"></div><span>Profil yükleniyor...</span></div>'; }
  const lang = getLang();

  try {
    const [profile, kills, deaths] = await Promise.all([
      giFetch(`/players/${playerId}`),
      giFetch(`/players/${playerId}/kills?limit=10&offset=0`),
      giFetch(`/players/${playerId}/deaths?limit=10&offset=0`),
    ]);

    const name     = profile.Name || '—';
    const guild    = profile.GuildName || (lang==='tr'?'Guildless':'No Guild');
    const alliance = profile.AllianceName || '';
    const initials = name.slice(0,2).toUpperCase();

    const stats = [
      {label: lang==='tr'?'Kill Fame':'Kill Fame', val: fmtFame(profile.KillFame), icon:'⚔️', cls:'pvp'},
      {label: lang==='tr'?'Death Fame':'Death Fame', val: fmtFame(profile.DeathFame), icon:'💀', cls:'death'},
      {label: lang==='tr'?'PvE Fame':'PvE Fame', val: fmtFame(profile.LifetimeStatistics?.PvE?.Total), icon:'🐉', cls:'pve'},
      {label: lang==='tr'?'Crafting Fame':'Crafting', val: fmtFame(profile.LifetimeStatistics?.Crafting?.Total), icon:'🔨', cls:'craft'},
      {label: lang==='tr'?'Gathering Fame':'Gathering', val: fmtFame(profile.LifetimeStatistics?.Gathering?.All?.Total), icon:'⛏️', cls:'gather'},
      {label: lang==='tr'?'Fishing Fame':'Fishing', val: fmtFame(profile.LifetimeStatistics?.FishingFame), icon:'🎣', cls:'fish'},
    ];

    cont.innerHTML = `
      <div class="profile-card">
        <div class="pc-left">
          <div class="pc-avatar">${initials}</div>
          <div class="pc-name">${name}</div>
          ${guild !== (lang==='tr'?'Guildless':'No Guild') ? `<div class="pc-guild">🏰 ${guild}</div>` : `<div class="pc-guild" style="color:var(--text-muted)">${guild}</div>`}
          ${alliance ? `<div class="pc-alliance">⚔️ ${alliance}</div>` : ''}
          <hr class="pc-divider"/>
          <div class="pc-stat"><span class="pc-stat-label">${lang==='tr'?'K/D Oranı':'K/D Ratio'}</span><span class="pc-stat-val">${profile.DeathFame > 0 ? (profile.KillFame/profile.DeathFame).toFixed(2) : '∞'}</span></div>
          <div class="pc-stat"><span class="pc-stat-label">${lang==='tr'?'Sunucu':'Server'}</span><span class="pc-stat-val" style="font-size:11px">${pvpServer.toUpperCase()}</span></div>
        </div>
        <div class="pc-right">
          <div class="fame-grid">
            ${stats.map(s=>`<div class="fame-card ${s.cls}">
              <div class="fame-icon">${s.icon}</div>
              <div class="fame-label">${s.label}</div>
              <div class="fame-val">${s.val}</div>
            </div>`).join('')}
          </div>
          ${renderKillSection(kills, 'kill', lang)}
          ${renderKillSection(deaths, 'death', lang)}
        </div>
      </div>`;
  } catch(e) {
    cont.innerHTML = `<div class="pvp-error"><div class="err-icon">⚠️</div><p>${lang==='tr'?'Oyuncu bulunamadı veya API hatası oluştu.':'Player not found or API error.'}</p></div>`;
  }
}

function renderKillSection(events, type, lang) {
  if (!events || !events.length) return '';
  const title = type === 'kill'
    ? (lang==='tr' ? `Son Kill'ler (${events.length})` : `Recent Kills (${events.length})`)
    : (lang==='tr' ? `Son Death'ler (${events.length})` : `Recent Deaths (${events.length})`);
  return `<div class="kills-section">
    <div class="kills-section-header">
      <span class="kills-section-title">${type==='kill'?'⚔️':'💀'} ${title}</span>
    </div>
    ${events.slice(0,5).map(e => renderKillCard(e, type)).join('')}
  </div>`;
}

function renderKillCard(event, type) {
  const lang     = getLang();
  const killer   = event.Killer?.Name || '—';
  const victim   = event.Victim?.Name || '—';
  const ip       = getIP(event.Victim);
  const fame     = event.TotalVictimKillFame || 0;
  const timeStr  = fmtDate(event.TimeStamp);
  const location = event.Victim?.DeathZone || event.Location || '';
  const gear     = renderGear(event.Victim?.Equipment);
  const isKill   = type === 'kill';
  const partyCnt = (event.GroupMembers?.length || 0);

  return `<div class="kill-card ${isKill?'kill-type':'death-type'}">
    <div class="kc-side">
      <span class="kc-side-badge">${isKill?(lang==='tr'?'KILL':'KILL'):(lang==='tr'?'ÖLÜM':'DEATH')}</span>
      <span class="kc-side-time">${timeStr}</span>
    </div>
    <div class="kc-body">
      <div class="kc-title">
        <span class="kc-killer">${killer}</span>
        <span class="kc-arrow">→</span>
        <span class="kc-victim">${victim}</span>
      </div>
      <div class="kc-gear">${gear}</div>
      <div class="kc-meta">
        ${ip ? `<span class="kc-badge kc-badge-ip">⚡ ${ip} IP</span>` : ''}
        ${fame > 0 ? `<span class="kc-badge kc-badge-fame">💀 ${fmtFame(fame)}</span>` : ''}
        ${location ? `<span class="kc-badge kc-badge-loc">📍 ${location}</span>` : ''}
        ${partyCnt > 0 ? `<span class="kc-badge kc-badge-party">👥 ${partyCnt+1} ${lang==='tr'?'kişi':'players'}</span>` : ''}
      </div>
    </div>
  </div>`;
}

// ─── GUILD PROFİLİ ───────────────────────────────────────
async function loadGuildProfile(guildId) {
  const empty = document.getElementById('profileEmpty');
  const cont  = document.getElementById('profileContent');
  if (empty) empty.style.display = 'none';
  if (cont)  { cont.style.display = 'block'; cont.innerHTML = '<div class="pvp-loading"><div class="loading-spinner"></div><span>Guild yükleniyor...</span></div>'; }
  const lang = getLang();
  try {
    const [guild, kills] = await Promise.all([
      giFetch(`/guilds/${guildId}`),
      giFetch(`/events?guildId=${guildId}&limit=10&sort=recent`),
    ]);

    cont.innerHTML = `
      <div class="guild-card">
        <div>
          <div class="gc-name">${guild.Name||'—'}</div>
          <div class="gc-alliance">${guild.AllianceName ? '⚔️ '+guild.AllianceName : (lang==='tr'?'Alliance yok':'No Alliance')}</div>
          <div class="gc-stats">
            <div class="gc-stat"><span class="gc-stat-label">${lang==='tr'?'Kill Fame':'Kill Fame'}</span><span class="gc-stat-val">${fmtFame(guild.killFame||guild.KillFame)}</span></div>
            <div class="gc-stat"><span class="gc-stat-label">${lang==='tr'?'Death Fame':'Death Fame'}</span><span class="gc-stat-val">${fmtFame(guild.deathFame||guild.DeathFame)}</span></div>
            <div class="gc-stat"><span class="gc-stat-label">${lang==='tr'?'Üye Sayısı':'Members'}</span><span class="gc-stat-val">${guild.MemberCount||'—'}</span></div>
          </div>
        </div>
        <div>
          <div class="gc-section-title">${lang==='tr'?'Son Kill\'ler':'Recent Kills'}</div>
          ${kills.length
            ? kills.slice(0,5).map(e => renderKillCard(e,'kill')).join('')
            : `<p style="color:var(--text-muted);font-size:12px">${lang==='tr'?'Kill kaydı bulunamadı':'No kills found'}</p>`}
        </div>
      </div>`;
  } catch(e) {
    cont.innerHTML = `<div class="pvp-error"><div class="err-icon">⚠️</div><p>${lang==='tr'?'Guild bulunamadı.':'Guild not found.'}</p></div>`;
  }
}

// ─── KILL FEED ────────────────────────────────────────────
let currentKillType = 'recent';
function switchKillType(type, btn) {
  currentKillType = type;
  document.querySelectorAll('.kf-tab').forEach(t => t.classList.toggle('active', t === btn));
  loadKillFeed();
}

async function loadKillFeed() {
  const cont = document.getElementById('killFeedContent');
  if (!cont) return;
  const lang = getLang();
  cont.innerHTML = `<div class="pvp-loading"><div class="loading-spinner"></div><span>${lang==='tr'?'Kill feed yükleniyor...':'Loading kill feed...'}</span></div>`;
  try {
    const data = await giFetch(`/events?limit=20&offset=0`);
    if (!data || !data.length) {
      cont.innerHTML = `<div class="pvp-error"><div class="err-icon">💀</div><p>${lang==='tr'?'Kill verisi bulunamadı.':'No kill data found.'}</p></div>`;
      return;
    }
    let events = [...data];
    if (currentKillType === 'top') {
      events.sort((a,b) => (b.TotalVictimKillFame||0) - (a.TotalVictimKillFame||0));
    }
    cont.innerHTML = `<div class="kills-section">${events.map(e => renderKillCard(e,'kill')).join('')}</div>`;
  } catch(e) {
    const isTimeout = e.message === 'timeout';
    cont.innerHTML = `<div class="pvp-error">
      <div class="err-icon">⚠️</div>
      <p>${lang==='tr'
        ? isTimeout
          ? 'API zaman aşımı. Albion sunucuları şu an meşgul olabilir. Lütfen tekrar deneyin.'
          : 'Kill feed yüklenemedi. GameInfo API şu an yanıt vermiyor (504/CORS). Lütfen bekleyip tekrar deneyin.'
        : isTimeout
          ? 'API timeout. Albion servers may be busy. Please try again.'
          : 'Could not load kill feed. GameInfo API is not responding (504/CORS). Please wait and retry.'
      }</p>
      <button class="pvp-refresh-btn" onclick="loadKillFeed()" style="margin-top:12px">🔄 ${lang==='tr'?'Tekrar Dene':'Retry'}</button>
    </div>`;
  }
}

function startKillFeedTimer() {
  stopKillFeedTimer();
  killFeedTimer = setInterval(() => {
    if (currentTab === 'kills') loadKillFeed();
  }, 30000);
}
function stopKillFeedTimer() {
  if (killFeedTimer) { clearInterval(killFeedTimer); killFeedTimer = null; }
}

// ─── BATTLE BOARD ─────────────────────────────────────────
async function loadBattles() {
  const cont = document.getElementById('battleContent');
  if (!cont) return;
  const lang = getLang();
  cont.innerHTML = `<div class="pvp-loading"><div class="loading-spinner"></div><span>${lang==='tr'?'Muharebeler yükleniyor...':'Loading battles...'}</span></div>`;
  try {
    const data = await giFetch(`/battles?sort=recent&limit=20&offset=0`);
    if (!data || !data.length) {
      cont.innerHTML = `<div class="bc-empty">${lang==='tr'?'Muharebe kaydı bulunamadı.':'No battles found.'}</div>`;
      return;
    }
    cont.innerHTML = data.map(b => renderBattleCard(b, lang)).join('');
  } catch(e) {
    const isTimeout = e.message === 'timeout';
    cont.innerHTML = `<div class="pvp-error">
      <div class="err-icon">⚠️</div>
      <p>${lang==='tr'
        ? 'Battle API şu an yanıt vermiyor. Bu bilinen bir Albion API sorunu (504). Lütfen bekleyip tekrar deneyin.'
        : 'Battle API is not responding. This is a known Albion API issue (504). Please wait and retry.'
      }</p>
      <button class="pvp-refresh-btn" onclick="loadBattles()" style="margin-top:12px">🔄 ${lang==='tr'?'Tekrar Dene':'Retry'}</button>
    </div>`;
  }
}

function renderBattleCard(battle, lang) {
  const alliances = Object.values(battle.Alliances || {}).slice(0,4);
  const totalKills   = battle.TotalKills || 0;
  const totalFame    = battle.TotalFame  || 0;
  const playerCnt    = Object.keys(battle.Players || {}).length;
  const timeStr      = fmtDate(battle.StartTime);

  const allianceHtml = alliances.length
    ? alliances.map(a => `<div class="bc-alliance">
        <div class="bc-alliance-name" title="${a.Name||'Unknown'}">${a.Name||lang==='tr'?'Bilinmiyor':'Unknown'}</div>
        <div><span class="bc-alliance-kills">⚔️ ${a.Kills||0} kill</span> · <span class="bc-alliance-deaths">💀 ${a.Deaths||0} death</span></div>
      </div>`).join('')
    : `<div class="bc-alliance"><div class="bc-alliance-name">${lang==='tr'?'Guildless Oyuncular':'Guildless Players'}</div></div>`;

  return `<div class="battle-card" onclick="openBattleDetail('${battle.id}')">
    <div class="bc-top">
      <span class="bc-id">Battle #${battle.id}</span>
      <span class="bc-time">${timeStr}</span>
    </div>
    <div class="bc-players">${allianceHtml}</div>
    <div class="bc-stats">
      <div class="bc-stat">${lang==='tr'?'Toplam Kill:':'Total Kills:'}<span>${totalKills}</span></div>
      <div class="bc-stat">${lang==='tr'?'Toplam Fame:':'Total Fame:'}<span>${fmtFame(totalFame)}</span></div>
      <div class="bc-stat">${lang==='tr'?'Katılımcı:':'Players:'}<span>${playerCnt}</span></div>
    </div>
  </div>`;
}

async function openBattleDetail(battleId) {
  if (!battleId) return;
  // Yeni sekmede Albion Online resmi killboard'una yönlendir
  window.open(`https://albiononline.com/killboard/battle/${battleId}`, '_blank');
}

// ─── BAŞLAT ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Dropdown dışına tıklayınca kapat
  document.addEventListener('click', e => {
    if (!e.target.closest('.pvp-search-wrap'))
      document.getElementById('pvpSearchDd')?.classList.remove('open');
  });
});
