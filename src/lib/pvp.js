// AoT-PNASF — PvP v2
// Kill Feed + Battle: pvp-feed.json (GitHub Actions her 5dk)
// Oyuncu/Guild arama: doğrudan allorigins + fallback olarak resmi killboard

const RENDER = 'https://render.albiononline.com/v1/item';
const FEED_URL = '../data/pvp-feed.json';

// Proxy listesi — birini dene, olmazsa diğerine geç
const PROXIES = [
  url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  url => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

const GI_HOSTS = {
  us:   'https://gameinfo.albiononline.com/api/gameinfo',
  eu:   'https://gameinfo-ams.albiononline.com/api/gameinfo',
  asia: 'https://gameinfo-sgp.albiononline.com/api/gameinfo',
};

// ─── STATE ────────────────────────────────────────────────
let pvpServer  = 'us';
let searchType = 'player';
let currentTab = 'profile';
let killType   = 'recent';
let pvpFeed    = null;
let killTimer  = null;
let selectedEntity = null;

const getLang = () => localStorage.getItem('aot-lang') || 'tr';

// ─── PROXY FETCH — sırayla dener ─────────────────────────
async function proxyFetch(apiUrl, timeoutMs = 10000) {
  for (const makeProxy of PROXIES) {
    const proxyUrl = makeProxy(apiUrl);
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), timeoutMs);
      const res = await fetch(proxyUrl, { signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) continue;
      const wrapper = await res.json();
      // allorigins & codetabs → {contents: "..."}
      const raw = wrapper.contents ?? wrapper;
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch(e) {
      continue; // bir sonraki proxy'yi dene
    }
  }
  throw new Error('Tüm proxy\'ler başarısız');
}

// ─── YARDIMCILAR ─────────────────────────────────────────
function fmtFame(n) {
  if (!n || n <= 0) return '0';
  if (n >= 1e9) return (n/1e9).toFixed(2)+'B';
  if (n >= 1e6) return (n/1e6).toFixed(1)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(1)+'K';
  return n.toLocaleString('tr-TR');
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff/60000);
  const lang = getLang();
  if (mins < 2)    return lang==='tr'?'Az önce':'Just now';
  if (mins < 60)   return `${mins}${lang==='tr'?'dk':'m'} ${lang==='tr'?'önce':'ago'}`;
  if (mins < 1440) return `${Math.floor(mins/60)}${lang==='tr'?'sa':'h'} ${lang==='tr'?'önce':'ago'}`;
  return `${Math.floor(mins/1440)}${lang==='tr'?'g':'d'} ${lang==='tr'?'önce':'ago'}`;
}

function getItemName(typeId) {
  if (!typeId) return '';
  const baseId = typeId.replace(/^T\d_/,'').replace(/@\d$/,'');
  const item = (window.AO_ITEMS||[]).find(i=>i.id===baseId);
  if (!item) return typeId.replace(/_/g,' ');
  return getLang()==='tr'?item.tr:item.en;
}

function renderGear(equipment) {
  if (!equipment||!Object.keys(equipment).length)
    return `<span style="font-size:11px;color:var(--text-muted)">—</span>`;
  return Object.entries(equipment).map(([,item])=>{
    if (!item?.type) return '';
    const enc = item.type.match(/@(\d)$/)?.[1]||'';
    const id  = item.type.replace(/@\d$/,'');
    const name = getItemName(id);
    return `<div class="kc-gear-item" title="${name}">
      <img class="kc-gear-img" src="${RENDER}/${id}${enc?'@'+enc:''}.png" onerror="this.style.opacity='.15'" alt="${name}"/>
    </div>`;
  }).join('');
}

function renderKillCard(kill) {
  const lang = getLang();
  return `<div class="kill-card kill-type">
    <div class="kc-side">
      <span class="kc-side-badge">KILL</span>
      <span class="kc-side-time">${fmtDate(kill.timestamp)}</span>
    </div>
    <div class="kc-body">
      <div class="kc-title">
        <span class="kc-killer">${kill.killer}</span>
        ${kill.killerGuild?`<span style="font-size:10px;color:var(--text-muted)">[${kill.killerGuild}]</span>`:''}
        <span class="kc-arrow">→</span>
        <span class="kc-victim">${kill.victim}</span>
        ${kill.victimGuild?`<span style="font-size:10px;color:var(--text-muted)">[${kill.victimGuild}]</span>`:''}
      </div>
      <div class="kc-gear">${renderGear(kill.equipment)}</div>
      <div class="kc-meta">
        ${kill.victimIP>0?`<span class="kc-badge kc-badge-ip">⚡ ${kill.victimIP} IP</span>`:''}
        ${kill.totalFame>0?`<span class="kc-badge kc-badge-fame">💀 ${fmtFame(kill.totalFame)}</span>`:''}
        ${kill.location?`<span class="kc-badge kc-badge-loc">📍 ${kill.location}</span>`:''}
        ${kill.partySize>1?`<span class="kc-badge kc-badge-party">👥 ${kill.partySize} ${lang==='tr'?'kişi':'players'}</span>`:''}
      </div>
    </div>
  </div>`;
}

// ─── SUNUCU GEÇİŞİ ───────────────────────────────────────
function switchPvpServer(srv, btn) {
  pvpServer = srv;
  document.querySelectorAll('.pvp-srv-btn').forEach(b=>b.classList.toggle('active',b===btn));
  if (currentTab==='kills')   renderKillFeed();
  if (currentTab==='battles') renderBattles();
}

// ─── ARAMA TÜRÜ ──────────────────────────────────────────
function switchSearchType(type, btn) {
  searchType = type;
  document.querySelectorAll('.pvp-stab').forEach(b=>b.classList.toggle('active',b===btn));
  const lang = getLang();
  const holders = {
    player:   lang==='tr'?'Oyuncu adı ara... (örn: Mustafa)':'Search player...',
    guild:    lang==='tr'?'Guild adı ara...':'Search guild...',
    alliance: lang==='tr'?'Alliance adı ara...':'Search alliance...',
  };
  const inp = document.getElementById('pvpSearch');
  if (inp) { inp.placeholder = holders[type]; inp.value = ''; }
  document.getElementById('pvpSearchDd')?.classList.remove('open');
}

// ─── ARAMA ───────────────────────────────────────────────
let searchTimer;
async function onPvpSearch(val) {
  const dd = document.getElementById('pvpSearchDd');
  clearTimeout(searchTimer);
  if (!val||val.length<2) { dd?.classList.remove('open'); return; }

  // Loading göster
  if (dd) {
    dd.innerHTML = `<div style="padding:12px;color:var(--text-muted);font-size:12px;text-align:center">🔍 Aranıyor...</div>`;
    dd.classList.add('open');
  }

  searchTimer = setTimeout(async () => {
    try {
      const apiUrl = `${GI_HOSTS[pvpServer]}/search?q=${encodeURIComponent(val)}`;
      const data   = await proxyFetch(apiUrl);
      const lang   = getLang();
      const results = searchType==='guild'   ?(data.guilds||[])
                    : searchType==='alliance'?(data.alliances||[])
                    : (data.players||[]);

      if (!results.length||!dd) { dd?.classList.remove('open'); return; }

      dd.innerHTML = results.slice(0,8).map(r=>{
        const name = r.Name||r.AllianceName||'—';
        const sub  = searchType==='player'
          ?(r.GuildName?`${r.GuildName}${r.AllianceName?' · '+r.AllianceName:''}`:(lang==='tr'?'Guildsiz':'No Guild'))
          :`${r.MemberCount||r.NumPlayers||0} ${lang==='tr'?'üye':'members'}`;
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
      // Proxy de başarısız — Killboard'a yönlendir
      const lang = getLang();
      if (dd) {
        dd.innerHTML = `<div style="padding:12px;font-size:12px">
          <div style="color:var(--text-muted);margin-bottom:8px">${lang==='tr'?'API şu an yanıt vermiyor.':'API not responding.'}</div>
          <a href="https://albiononline.com/killboard/search#&name=${encodeURIComponent(val)}" target="_blank"
             style="color:var(--teal);text-decoration:none;display:flex;align-items:center;gap:6px">
            🔗 ${lang==='tr'?'"'+val+'" için resmi killboard\'da ara':'Search "'+val+'" on official killboard'}
          </a>
        </div>`;
        dd.classList.add('open');
      }
    }
  }, 400);
}

async function doSearch() {
  const val = document.getElementById('pvpSearch')?.value.trim();
  if (!val) return;
  try {
    const apiUrl = `${GI_HOSTS[pvpServer]}/search?q=${encodeURIComponent(val)}`;
    const data   = await proxyFetch(apiUrl);
    const results = searchType==='guild'?(data.guilds||[]):(data.players||[]);
    if (results.length) selectEntity(results[0].Id, results[0].Name, searchType);
  } catch(e) {
    window.open(`https://albiononline.com/killboard/search#&name=${encodeURIComponent(val)}`, '_blank');
  }
}

function selectEntity(id, name, type) {
  document.getElementById('pvpSearchDd')?.classList.remove('open');
  document.getElementById('pvpSearch').value = name;
  selectedEntity = { id, name, type: type||searchType };
  // Profile tab'a geç
  document.querySelectorAll('.pvp-panel').forEach(p=>p.style.display='none');
  document.getElementById('tab-profile').style.display='block';
  document.querySelectorAll('.pvp-tab').forEach(t=>t.classList.remove('active'));
  document.querySelector('.pvp-tab')?.classList.add('active');
  currentTab = 'profile';
  if ((type||searchType)==='guild'||(type||searchType)==='alliance') loadGuildProfile(id,name);
  else loadPlayerProfile(id,name);
}

// ─── TAB GEÇİŞİ ──────────────────────────────────────────
function switchPvpTab(tab, btn) {
  currentTab = tab;
  document.querySelectorAll('.pvp-panel').forEach(p=>p.style.display='none');
  document.querySelectorAll('.pvp-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+tab).style.display='block';
  if (btn) btn.classList.add('active');
  if (tab==='kills')   { renderKillFeed(); startKillTimer(); }
  else stopKillTimer();
  if (tab==='battles') renderBattles();
}

// ─── OYUNCU PROFİLİ ──────────────────────────────────────
async function loadPlayerProfile(playerId, playerName) {
  const empty = document.getElementById('profileEmpty');
  const cont  = document.getElementById('profileContent');
  if (empty) empty.style.display='none';
  cont.style.display='block';
  cont.innerHTML='<div class="pvp-loading"><div class="loading-spinner"></div><span>Profil yükleniyor...</span></div>';
  const lang = getLang();

  try {
    const [profile, kills, deaths] = await Promise.all([
      proxyFetch(`${GI_HOSTS[pvpServer]}/players/${playerId}`),
      proxyFetch(`${GI_HOSTS[pvpServer]}/players/${playerId}/kills?limit=10&offset=0`),
      proxyFetch(`${GI_HOSTS[pvpServer]}/players/${playerId}/deaths?limit=10&offset=0`),
    ]);

    if (!profile||!profile.Name) throw new Error('Boş profil');

    const name     = profile.Name;
    const guild    = profile.GuildName||(lang==='tr'?'Guildsiz':'No Guild');
    const alliance = profile.AllianceName||'';
    const kd       = profile.DeathFame>0?(profile.KillFame/profile.DeathFame).toFixed(2):'∞';

    const stats = [
      {label:'Kill Fame',  val:fmtFame(profile.KillFame),  icon:'⚔️', cls:'pvp'},
      {label:'Death Fame', val:fmtFame(profile.DeathFame), icon:'💀', cls:'death'},
      {label:'PvE Fame',   val:fmtFame(profile.LifetimeStatistics?.PvE?.Total), icon:'🐉', cls:'pve'},
      {label:'Crafting',   val:fmtFame(profile.LifetimeStatistics?.Crafting?.Total), icon:'🔨', cls:'craft'},
      {label:'Gathering',  val:fmtFame(profile.LifetimeStatistics?.Gathering?.All?.Total), icon:'⛏️', cls:'gather'},
      {label:'Fishing',    val:fmtFame(profile.LifetimeStatistics?.FishingFame), icon:'🎣', cls:'fish'},
    ];

    function toKill(e) {
      if (!e) return null;
      return {
        timestamp: e.TimeStamp||'', killer: e.Killer?.Name||'?', killerGuild: e.Killer?.GuildName||'',
        victim: e.Victim?.Name||'?', victimGuild: e.Victim?.GuildName||'',
        victimIP: Math.round(e.Victim?.AverageItemPower||0),
        totalFame: e.TotalVictimKillFame||0, location: e.Victim?.DeathZone||'',
        equipment: (() => {
          const eq=e.Victim?.Equipment; if(!eq) return {};
          const r={};
          ['MainHand','OffHand','Head','Armor','Shoes','Cape','Bag','Mount'].forEach(s=>{
            if(eq[s]?.Type) r[s]={type:eq[s].Type,quality:eq[s].Quality||1};
          });
          return r;
        })(),
        partySize: (e.GroupMembers?.length||0)+1,
      };
    }

    const killList  = (Array.isArray(kills) ?kills :[]).map(toKill).filter(Boolean);
    const deathList = (Array.isArray(deaths)?deaths:[]).map(toKill).filter(Boolean);

    cont.innerHTML = `
      <div class="profile-card">
        <div class="pc-left">
          <div class="pc-avatar">${name.slice(0,2).toUpperCase()}</div>
          <div class="pc-name">${name}</div>
          <div class="pc-guild">🏰 ${guild}</div>
          ${alliance?`<div class="pc-alliance">⚔️ ${alliance}</div>`:''}
          <hr class="pc-divider"/>
          <div class="pc-stat"><span class="pc-stat-label">K/D</span><span class="pc-stat-val">${kd}</span></div>
          <div class="pc-stat"><span class="pc-stat-label">${lang==='tr'?'Sunucu':'Server'}</span><span class="pc-stat-val" style="font-size:11px">${pvpServer.toUpperCase()}</span></div>
          <div style="margin-top:8px">
            <a href="https://albiononline.com/killboard/player/${playerId}" target="_blank"
               style="color:var(--teal);font-size:11px;text-decoration:none">🔗 ${lang==='tr'?'Resmi Killboard':'Official Killboard'}</a>
          </div>
        </div>
        <div class="pc-right">
          <div class="fame-grid">
            ${stats.map(s=>`<div class="fame-card ${s.cls}">
              <div class="fame-icon">${s.icon}</div>
              <div class="fame-label">${s.label}</div>
              <div class="fame-val">${s.val}</div>
            </div>`).join('')}
          </div>
          ${killList.length?`<div class="kills-section">
            <div class="kills-section-header">
              <span class="kills-section-title">⚔️ ${lang==='tr'?`Son Kill'ler (${killList.length})`:`Recent Kills (${killList.length})`}</span>
            </div>
            ${killList.slice(0,5).map(renderKillCard).join('')}
          </div>`:''}
          ${deathList.length?`<div class="kills-section">
            <div class="kills-section-header">
              <span class="kills-section-title">💀 ${lang==='tr'?`Son Death'ler (${deathList.length})`:`Recent Deaths (${deathList.length})`}</span>
            </div>
            ${deathList.slice(0,5).map(renderKillCard).join('')}
          </div>`:''}
        </div>
      </div>`;
  } catch(e) {
    cont.innerHTML = `<div class="pvp-error">
      <div class="err-icon">⚠️</div>
      <p>${lang==='tr'?'Oyuncu profili yüklenemedi. Lütfen tekrar deneyin.':'Player profile could not be loaded. Please try again.'}</p>
      <button class="pvp-refresh-btn" onclick="loadPlayerProfile('${playerId}','${playerName||''}')" style="margin-top:12px">
        🔄 ${lang==='tr'?'Tekrar Dene':'Retry'}
      </button>
      <div style="margin-top:10px">
        <a href="https://albiononline.com/killboard/search#&name=${encodeURIComponent(playerName||'')}" target="_blank"
           style="color:var(--teal);font-size:12px;text-decoration:none">
          🔗 ${lang==='tr'?'Resmi Killboard\'da Ara':'Search on Official Killboard'}
        </a>
      </div>
    </div>`;
  }
}

// ─── GUILD PROFİLİ ───────────────────────────────────────
async function loadGuildProfile(guildId, guildName) {
  const empty = document.getElementById('profileEmpty');
  const cont  = document.getElementById('profileContent');
  if (empty) empty.style.display='none';
  cont.style.display='block';
  cont.innerHTML='<div class="pvp-loading"><div class="loading-spinner"></div><span>Guild yükleniyor...</span></div>';
  const lang = getLang();
  try {
    const [guild, killsRaw] = await Promise.all([
      proxyFetch(`${GI_HOSTS[pvpServer]}/guilds/${guildId}`),
      proxyFetch(`${GI_HOSTS[pvpServer]}/events?guildId=${guildId}&limit=10&sort=recent`),
    ]);
    if (!guild) throw new Error('boş');
    const kills = (Array.isArray(killsRaw)?killsRaw:[]).map(e=>({
      timestamp:e.TimeStamp||'', killer:e.Killer?.Name||'?', killerGuild:'',
      victim:e.Victim?.Name||'?', victimGuild:'',
      victimIP:Math.round(e.Victim?.AverageItemPower||0),
      totalFame:e.TotalVictimKillFame||0, location:e.Victim?.DeathZone||'',
      equipment:(()=>{const eq=e.Victim?.Equipment;if(!eq)return{};const r={};
        ['MainHand','OffHand','Head','Armor','Shoes','Cape'].forEach(s=>{if(eq[s]?.Type)r[s]={type:eq[s].Type};});return r;})(),
      partySize:(e.GroupMembers?.length||0)+1,
    }));
    cont.innerHTML=`<div class="guild-card">
      <div>
        <div class="gc-name">${guild.Name||guildName||'—'}</div>
        <div class="gc-alliance">${guild.AllianceName?'⚔️ '+guild.AllianceName:(lang==='tr'?'Alliance yok':'No Alliance')}</div>
        <div class="gc-stats">
          <div class="gc-stat"><span class="gc-stat-label">Kill Fame</span><span class="gc-stat-val">${fmtFame(guild.killFame||guild.KillFame||0)}</span></div>
          <div class="gc-stat"><span class="gc-stat-label">Death Fame</span><span class="gc-stat-val">${fmtFame(guild.deathFame||guild.DeathFame||0)}</span></div>
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
    cont.innerHTML=`<div class="pvp-error"><div class="err-icon">⚠️</div>
      <p>${lang==='tr'?'Guild yüklenemedi.':'Guild not found.'}</p>
      <a href="https://albiononline.com/killboard/search#&name=${encodeURIComponent(guildName||'')}" target="_blank" style="color:var(--teal);font-size:12px">🔗 ${lang==='tr'?'Resmi Killboard\'da Ara':'Search Official Killboard'}</a>
    </div>`;
  }
}

// ─── KILL FEED (JSON'dan) ─────────────────────────────────
async function loadFeed() {
  try {
    const res = await fetch(`${FEED_URL}?t=${Date.now()}`);
    pvpFeed = await res.json();
    return true;
  } catch(e) { return false; }
}

function getServerData() { return pvpFeed?.servers?.[pvpServer]||null; }

let currentKillType = 'recent';
function switchKillType(type, btn) {
  currentKillType = type;
  document.querySelectorAll('.kf-tab').forEach(t=>t.classList.toggle('active',t===btn));
  renderKillFeed();
}

function renderKillFeed() {
  const cont = document.getElementById('killFeedContent');
  const lang = getLang();
  if (!cont) return;
  if (!pvpFeed) { loadFeed().then(()=>renderKillFeed()); return; }
  const srv = getServerData();
  if (!srv?.ok) {
    cont.innerHTML=`<div class="pvp-error"><div class="err-icon">💀</div>
      <p>${lang==='tr'?'Kill verisi henüz hazır değil. GitHub Actions her 5dk günceller.':'Kill data not ready yet. Updates every 5 minutes.'}</p>
      <small style="color:var(--text-muted);font-family:var(--font-mono)">${pvpFeed?.fetchedAt?new Date(pvpFeed.fetchedAt).toLocaleTimeString('tr-TR'):''}</small>
    </div>`;
    return;
  }
  const kills = currentKillType==='top'?srv.topKills:srv.recentKills;
  if (!kills?.length) { cont.innerHTML='<div class="pvp-error"><p>Kill bulunamadı.</p></div>'; return; }
  const age = pvpFeed.fetchedAt?new Date(pvpFeed.fetchedAt).toLocaleTimeString('tr-TR'):'—';
  cont.innerHTML=`<div class="feed-age-bar">⏱ ${lang==='tr'?'Son güncelleme':'Last update'}: <strong>${age}</strong></div>
    <div class="kills-section">${kills.map(renderKillCard).join('')}</div>`;
}

function renderBattles() {
  const cont = document.getElementById('battleContent');
  const lang = getLang();
  if (!cont) return;
  if (!pvpFeed) { loadFeed().then(()=>renderBattles()); return; }
  const srv = getServerData();
  if (!srv?.battles?.length) {
    cont.innerHTML=`<div class="pvp-error"><div class="err-icon">🗺️</div>
      <p>${lang==='tr'?'Battle verisi henüz hazır değil.':'Battle data not ready.'}</p>
    </div>`;
    return;
  }
  cont.innerHTML=srv.battles.map(b=>{
    const allianceHtml=(b.alliances||[]).slice(0,4).map(a=>`<div class="bc-alliance">
      <div class="bc-alliance-name" title="${a.name}">${a.name}</div>
      <div><span class="bc-alliance-kills">⚔️ ${a.kills}</span> · <span class="bc-alliance-deaths">💀 ${a.deaths}</span></div>
    </div>`).join('');
    return `<div class="battle-card" onclick="window.open('https://albiononline.com/killboard/battle/${b.id}','_blank')">
      <div class="bc-top"><span class="bc-id">Battle #${b.id}</span><span class="bc-time">${fmtDate(b.startTime)}</span></div>
      <div class="bc-players">${allianceHtml||`<span style="color:var(--text-muted);font-size:12px">—</span>`}</div>
      <div class="bc-stats">
        <div class="bc-stat">${lang==='tr'?'Kill:':'Kills:'}<span>${b.totalKills}</span></div>
        <div class="bc-stat">${lang==='tr'?'Fame:':'Fame:'}<span>${fmtFame(b.totalFame)}</span></div>
        <div class="bc-stat">${lang==='tr'?'Oyuncu:':'Players:'}<span>${b.playerCount}</span></div>
        <div class="bc-stat" style="margin-left:auto"><span style="color:var(--teal);font-size:11px">🔗 Detay</span></div>
      </div>
    </div>`;
  }).join('');
}

function startKillTimer() {
  stopKillTimer();
  killTimer = setInterval(async()=>{ if(currentTab==='kills'){await loadFeed();renderKillFeed();} },60000);
}
function stopKillTimer() { if(killTimer){clearInterval(killTimer);killTimer=null;} }

document.addEventListener('DOMContentLoaded', async()=>{
  document.addEventListener('click', e=>{
    if (!e.target.closest('.pvp-search-wrap'))
      document.getElementById('pvpSearchDd')?.classList.remove('open');
  });
  await loadFeed();
});
