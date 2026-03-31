// AoT-PNASF — Tools v1
// Party Builder, Dungeon Rehberi, PvP Killboard, Build Önerileri

const RENDER = 'https://render.albiononline.com/v1/item';
const getLang = () => localStorage.getItem('aot-lang') || 'tr';

// ─── AKTİVİTE VERİSİ ─────────────────────────────────────
const ACTIVITIES = [
  { id:'zvz', icon:'⚔️', diff:'extreme', minPlayers:30, maxPlayers:50, minIP:1200, duration:'45-60',  zone:'Black Zone Territory',
    tr:{ name:'ZvZ Kuşatma Savaşı', desc:'Büyük ölçekli guild savaşları' },
    en:{ name:'ZvZ Siege War', desc:'Large scale guild battles' },
    roles:{ tank:{count:8,desc:'Guardian Staff, Cursed Staff, Ironroot Staff'}, healer:{count:6,desc:'Holy Staff, Nature Staff'}, dps:{count:30,desc:'Carrioncaller, Siegebow, Claymore'}, support:{count:6,desc:'Locus, Enigmatic Staff'} },
    rewards:{ fame:'5M-15M', silver:'10M-50M', items:'Territory Chest' }
  },
  { id:'avalon', icon:'🗺️', diff:'hard', minPlayers:5, maxPlayers:10, minIP:1000, duration:'30-45', zone:'Avalonian Roads',
    tr:{ name:'Avalon Dungeon Run', desc:'Roads of Avalon içi dungeon temizleme' },
    en:{ name:'Avalon Dungeon Run', desc:'Dungeon clearing inside Roads of Avalon' },
    roles:{ tank:{count:1,desc:'Guardian Staff, Sword & Shield'}, healer:{count:1,desc:'Holy Staff, Nature Staff'}, dps:{count:4,desc:'3-4 DPS balanced'}, support:{count:1,desc:'0-1 Support'} },
    rewards:{ fame:'500K-1M', silver:'2M-5M', items:'Avalonian Weapon, Armor, Runes' }
  },
  { id:'worldboss', icon:'🐉', diff:'very-hard', minPlayers:20, maxPlayers:40, minIP:1000, duration:'15-25', zone:'Random Royal Cities',
    tr:{ name:'World Boss Avı', desc:'Dev boss'u öldür, nadir ödüller kazan' },
    en:{ name:'World Boss Hunt', desc:'Kill the giant boss, earn rare rewards' },
    roles:{ tank:{count:4,desc:'Self-sufficient tank'}, healer:{count:4,desc:'High DPS healer'}, dps:{count:24,desc:'High DPS'}, support:{count:6,desc:'Utility support'} },
    rewards:{ fame:'3M-7M', silver:'5M-15M', items:'Guaranteed Unique Items' }
  },
  { id:'hellgate', icon:'🔥', diff:'hard', minPlayers:5, maxPlayers:5, minIP:1000, duration:'20-30', zone:'Random Hellgate',
    tr:{ name:'Hellgate 5v5', desc:'PvPvE Hellgate rekabet' },
    en:{ name:'Hellgate 5v5', desc:'PvPvE Hellgate competition' },
    roles:{ tank:{count:1,desc:'1 Guardian'}, healer:{count:1,desc:'1 Holy'}, dps:{count:3,desc:'3 DPS balanced'}, support:{count:0,desc:'—'} },
    rewards:{ fame:'800K-1.5M', silver:'3M-8M', items:'Demon Items, Hellgate Artifacts' }
  },
  { id:'gathering', icon:'⛏️', diff:'medium', minPlayers:4, maxPlayers:8, minIP:800, duration:'60-90', zone:'Black Zone Resource Areas',
    tr:{ name:'Kaynak Seferi', desc:'Outlands gathering partisi' },
    en:{ name:'Resource Expedition', desc:'Outlands gathering party' },
    roles:{ tank:{count:1,desc:'Escort tank'}, healer:{count:1,desc:'Support healer'}, dps:{count:2,desc:'Gathering DPS escort'}, support:{count:2,desc:'Gatherer support'} },
    rewards:{ fame:'200K-500K', silver:'5M-20M', items:'T7-T8 Resources' }
  },
  { id:'mist', icon:'🌫️', diff:'medium', minPlayers:2, maxPlayers:5, minIP:900, duration:'30-60', zone:'Brecilien Mist',
    tr:{ name:'Mist Seferi', desc:'Brecilien mist zone küçük grup' },
    en:{ name:'Mist Expedition', desc:'Brecilien mist zone small group' },
    roles:{ tank:{count:1,desc:'Self-sufficient'}, healer:{count:1,desc:'Hybrid healer'}, dps:{count:2,desc:'Mobile DPS'}, support:{count:1,desc:'Optional'} },
    rewards:{ fame:'300K-800K', silver:'2M-5M', items:'Wisps, Mist Artifacts' }
  },
];

// ─── DUNGEON VERİSİ ───────────────────────────────────────
const DUNGEONS = [
  { id:'avalon-road', icon:'🏰', type:'group', tags:['group','hard'],
    tr:{ name:'Avalonian Road Dungeon', desc:'Roads of Avalon içindeki grup dungeon\'ları' },
    en:{ name:'Avalonian Road Dungeon', desc:'Group dungeons inside Roads of Avalon' },
    meta:{ location:'Avalonian Roads', difficulty:'Hard', minIP:1200, fame:'500K-1M' },
    bosses:[
      { name:'Ancient Knight', hp:'2.5M', abilities:['Charge','Shield Wall','AoE'] },
      { name:'Mystic Guardian', hp:'3.2M', abilities:['Teleport','Magic Shield','Reflect'] },
      { name:'Final Boss', hp:'5.8M', abilities:['Phase 1','Phase 2','Enrage'] },
    ],
    comp:{ tank:'1 Guardian', healer:'1 Holy', dps:'3-4 DPS', support:'0-1 Support' },
    rewards:{ artifacts:'Avalonian Weapon, Armor', silver:'2-5M Silver', fame:'500K-1M Fame' },
    tips:['Final Boss\'a geçmeden önce Guardian\'ı öldür','AoE saldırılardan dağılarak kaçın','Healer pozisyonunu korumaya al']
  },
  { id:'mist-dungeon', icon:'🌫️', type:'solo-group', tags:['solo','group','medium'],
    tr:{ name:'Mists Dungeon', desc:'Solo veya küçük grup Mist dungeon\'ları' },
    en:{ name:'Mists Dungeon', desc:'Solo or small group Mist dungeons' },
    meta:{ location:'Brecilien Mist', difficulty:'Medium', minIP:800, fame:'200K-500K' },
    bosses:[
      { name:'Mist Keeper', hp:'1.5M', abilities:['Mist Veil','Corruption','Life Steal'] },
    ],
    comp:{ tank:'Self-sufficient', healer:'Self-heal', dps:'High DPS', support:'Utility' },
    rewards:{ artifacts:'Mist Artifacts, Wisps', silver:'1-3M Silver', fame:'200K-500K Fame' },
    tips:['Mist içinde yönünü kaybedebilirsin — harita kullan','Wisp toplamayı unutma','Corrupted mod aktifleşince dikkatli ol']
  },
  { id:'hellgate', icon:'🔥', type:'pvpve', tags:['pvpve','extreme'],
    tr:{ name:'Hellgate 5v5', desc:'PvPvE karışık rekabetçi içerik' },
    en:{ name:'Hellgate 5v5', desc:'PvPvE mixed competitive content' },
    meta:{ location:'Random Yellow/Red Zones', difficulty:'Extreme', minIP:1000, fame:'800K-1.5M' },
    bosses:[
      { name:'Demon Lord', hp:'4.2M', abilities:['Fire AoE','Fear','Summon Minions'] },
      { name:'Hell Guardians', hp:'1.5M each', abilities:['Coordinated Attack','Buff'] },
    ],
    comp:{ tank:'1 Guardian', healer:'1 Holy', dps:'3 DPS (balanced)', support:'—' },
    rewards:{ artifacts:'Demon Items, Hellgate Artifacts', silver:'3-8M Silver', fame:'800K-1.5M Fame' },
    tips:['Boss öldürürken düşman partiye dikkat et','DPS\'leri boss fokusunda tut','Healer\'ı korumak öncelik']
  },
  { id:'corrupted', icon:'💀', type:'solo', tags:['solo','hard'],
    tr:{ name:'Corrupted Dungeon', desc:'Solo 1v1 PvP dungeon içeriği' },
    en:{ name:'Corrupted Dungeon', desc:'Solo 1v1 PvP dungeon content' },
    meta:{ location:'Red/Black Zones', difficulty:'Hard', minIP:900, fame:'300K-800K' },
    bosses:[
      { name:'Corrupted Keeper', hp:'2.1M', abilities:['Corruption','Decay','Life Steal'] },
    ],
    comp:{ tank:'Self-sufficient', healer:'Self-heal', dps:'High DPS', support:'—' },
    rewards:{ artifacts:'Corrupted Items, Ancient Relics', silver:'1.5-4M Silver', fame:'300K-800K Fame' },
    tips:['Başka oyuncu girerse boss\'u bırak PvP odaklan','Infamy\'yi korumak için kaçmaktan kaçın','Counter-pick build hazırla']
  },
];

// ─── BUILD VERİSİ ─────────────────────────────────────────
const BUILDS = [
  { id:'claymore-cd', name:'Claymore Solo PvP', role:'dps', content:'solo', minIP:900,
    tr:{ tip:'Corrupted Dungeon için en popüler meta build. Adrenaline Boost + Q spam.' },
    en:{ tip:'Most popular meta build for Corrupted Dungeon. Adrenaline Boost + Q spam.' },
    gear:[
      { slot:'Silah', id:'T6_2H_CLAYMORE', name:'Claymore', tier:6 },
      { slot:'Kask', id:'T6_HEAD_PLATE_SET3', name:'Knight Helmet', tier:6 },
      { slot:'Zırh', id:'T6_ARMOR_LEATHER_SET1', name:'Mercenary Jacket', tier:6 },
      { slot:'Bot', id:'T6_SHOES_PLATE_SET1', name:'Soldier Boots', tier:6 },
      { slot:'Cape', id:'T6_CAPE', name:'Thetford Cape', tier:6 },
    ]
  },
  { id:'guardian-zvz', name:'ZvZ Tank', role:'tank', content:'zvz', minIP:1200,
    tr:{ tip:'ZvZ için ana tank. Shield Wall + pozisyon. Daima ön safta.' },
    en:{ tip:'Main tank for ZvZ. Shield Wall + positioning. Always stay frontline.' },
    gear:[
      { slot:'Silah', id:'T8_2H_ARCANESTAFF', name:'Guardian Staff', tier:8 },
      { slot:'Kask', id:'T8_HEAD_PLATE_SET1', name:'Guardian Helmet', tier:8 },
      { slot:'Zırh', id:'T8_ARMOR_PLATE_SET1', name:'Guardian Armor', tier:8 },
      { slot:'Bot', id:'T8_SHOES_PLATE_SET1', name:'Soldier Boots', tier:8 },
      { slot:'Cape', id:'T8_CAPE', name:'Cleric Cape', tier:8 },
    ]
  },
  { id:'holy-healer', name:'Holy Healer', role:'healer', content:'group', minIP:1000,
    tr:{ tip:'Group PvP için standart healer. Hallowed Ground + Sacred Ground öncelik.' },
    en:{ tip:'Standard healer for Group PvP. Hallowed Ground + Sacred Ground priority.' },
    gear:[
      { slot:'Silah', id:'T8_MAIN_HOLYSTAFF', name:'Holy Staff', tier:8 },
      { slot:'Kask', id:'T8_HEAD_CLOTH_SET3', name:'Scholar Cowl', tier:8 },
      { slot:'Zırh', id:'T8_ARMOR_CLOTH_SET3', name:'Scholar Robe', tier:8 },
      { slot:'Bot', id:'T8_SHOES_CLOTH_SET3', name:'Scholar Sandals', tier:8 },
      { slot:'Cape', id:'T8_CAPE', name:'Lymhurst Cape', tier:8 },
    ]
  },
  { id:'bloodletter-gank', name:'Bloodletter Gank', role:'dps', content:'solo', minIP:900,
    tr:{ tip:'Ganking için en iyi build. Dash + yüksek burst hasar. Hızlı kaçış imkanı.' },
    en:{ tip:'Best build for ganking. Dash + high burst damage. Fast escape option.' },
    gear:[
      { slot:'Silah', id:'T6_2H_DAGGER_PAIR', name:'Bloodletter', tier:6 },
      { slot:'Kask', id:'T6_HEAD_LEATHER_SET3', name:'Hellion Hood', tier:6 },
      { slot:'Zırh', id:'T6_ARMOR_LEATHER_SET3', name:'Hellion Jacket', tier:6 },
      { slot:'Bot', id:'T6_SHOES_LEATHER_SET3', name:'Stalker Shoes', tier:6 },
      { slot:'Cape', id:'T6_CAPE', name:'Undead Cape', tier:6 },
    ]
  },
  { id:'carrioncaller-zvz', name:'ZvZ DPS (Carrioncaller)', role:'dps', content:'zvz', minIP:1100,
    tr:{ tip:'ZvZ DPS meta. Hail of Arrows spam + kite. Asla ön safta durma.' },
    en:{ tip:'ZvZ DPS meta. Hail of Arrows spam + kite. Never stand frontline.' },
    gear:[
      { slot:'Silah', id:'T8_2H_BOW', name:'Carrioncaller', tier:8 },
      { slot:'Kask', id:'T8_HEAD_LEATHER_SET1', name:'Hunter Hood', tier:8 },
      { slot:'Zırh', id:'T8_ARMOR_LEATHER_SET1', name:'Stalker Jacket', tier:8 },
      { slot:'Bot', id:'T8_SHOES_LEATHER_SET1', name:'Stalker Shoes', tier:8 },
      { slot:'Cape', id:'T8_CAPE', name:'Martlock Cape', tier:8 },
    ]
  },
  { id:'gathering-t8', name:'T8 Gathering', role:'support', content:'gathering', minIP:800,
    tr:{ tip:'T8 resource gathering için optimize build. Ox veya Armored Horse kullan.' },
    en:{ tip:'Optimized build for T8 resource gathering. Use Ox or Armored Horse.' },
    gear:[
      { slot:'Silah', id:'T8_2H_TOOL_SICKLE', name:'Sickle (T8)', tier:8 },
      { slot:'Kask', id:'T8_HEAD_GATHERER', name:'Lumberjack Hat', tier:8 },
      { slot:'Zırh', id:'T8_ARMOR_GATHERER', name:'Lumberjack Jacket', tier:8 },
      { slot:'Bot', id:'T8_SHOES_GATHERER', name:'Lumberjack Boots', tier:8 },
      { slot:'Cape', id:'T8_CAPE', name:'Undead Cape', tier:8 },
    ]
  },
];

// ─── STATE ────────────────────────────────────────────────
let currentTab      = 'party';
let selectedActivity = null;
let partyMembers    = [];
let currentKbTab    = 'recent';
let kbFilter        = 'all';
let kbChart         = null;

// ─── TAB GEÇİŞİ ──────────────────────────────────────────
function switchToolsTab(tab, btn) {
  currentTab = tab;
  document.querySelectorAll('.tools-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.tools-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tab).style.display = 'block';
  if (btn) btn.classList.add('active');
  if (tab === 'killboard') loadKillboard();
  if (tab === 'builds')    renderBuilds();
}

// ─── PARTY BUILDER ───────────────────────────────────────
function renderActivities() {
  const lang = getLang();
  const cont = document.getElementById('activityList');
  if (!cont) return;
  cont.innerHTML = ACTIVITIES.map(a => {
    const d = a[lang] || a.tr;
    return `<div class="activity-card ${selectedActivity?.id === a.id ? 'selected' : ''}" onclick="selectActivity('${a.id}')">
      <div class="ac-header">
        <span class="ac-name">${a.icon} ${d.name}</span>
        <span class="ac-diff ${a.diff}">${a.diff.toUpperCase()}</span>
      </div>
      <div class="ac-meta">
        <span>👥 ${a.minPlayers}-${a.maxPlayers}</span>
        <span>⚡ ${a.minIP}+ IP</span>
        <span>⏱ ${a.duration} ${lang==='tr'?'dk':'min'}</span>
      </div>
    </div>`;
  }).join('');
}

function selectActivity(id) {
  selectedActivity = ACTIVITIES.find(a => a.id === id);
  renderActivities();
  renderPartyDetail();
}

function renderPartyDetail() {
  const panel = document.getElementById('partyDetailPanel');
  if (!selectedActivity || !panel) return;
  const lang = getLang();
  const a  = selectedActivity;
  const d  = a[lang] || a.tr;
  const L  = lang === 'tr';

  const roleColors = { tank:'#60a5fa', healer:'#22c55e', dps:'#ef4444', support:'#f59e0b' };
  const roleLabels = {
    tank:    { tr:'🛡️ Tank',    en:'🛡️ Tank' },
    healer:  { tr:'💚 Healer',  en:'💚 Healer' },
    dps:     { tr:'⚔️ DPS',     en:'⚔️ DPS' },
    support: { tr:'✨ Support', en:'✨ Support' },
  };

  const roleCards = Object.entries(a.roles).map(([role, info]) => {
    const filled  = partyMembers.filter(m => m.role === role).length;
    const pct     = Math.round((filled / Math.max(info.count,1)) * 100);
    const full    = filled >= info.count;
    return `<div class="role-card">
      <div class="rc-header">
        <span class="rc-role ${role}">${roleLabels[role][lang] || roleLabels[role].tr} (${info.count})</span>
        <span class="rc-count">${filled}/${info.count}</span>
      </div>
      <div class="rc-progress"><div class="rc-progress-bar ${role}" style="width:${pct}%"></div></div>
      <div class="rc-weapons">${info.desc}</div>
      <button class="rc-add-btn" ${full?'disabled':''} onclick="addToParty('${role}','${info.desc.split(',')[0].trim()}')">
        ${full ? (L?'✓ Dolu':'✓ Full') : (L?'+ Üye Ekle':'+ Add Member')}
      </button>
    </div>`;
  }).join('');

  panel.innerHTML = `<div class="party-detail-box">
    <div class="pdb-header">
      <span class="pdb-title">${a.icon} ${d.name}</span>
    </div>
    <div class="pdb-meta">
      <div class="pdb-meta-item"><span class="pdb-meta-label">${L?'Oyuncu':'Players'}</span><span class="pdb-meta-val">${a.minPlayers}-${a.maxPlayers}</span></div>
      <div class="pdb-meta-item"><span class="pdb-meta-label">Min IP</span><span class="pdb-meta-val">${a.minIP}+</span></div>
      <div class="pdb-meta-item"><span class="pdb-meta-label">${L?'Süre':'Duration'}</span><span class="pdb-meta-val">${a.duration} ${L?'dk':'min'}</span></div>
      <div class="pdb-meta-item"><span class="pdb-meta-label">${L?'Konum':'Location'}</span><span class="pdb-meta-val" style="font-size:11px">${a.zone}</span></div>
    </div>
    <div class="role-grid">${roleCards}</div>
    <div class="rewards-box">
      <div class="rewards-title">${L?'Ödüller':'Rewards'}</div>
      <div class="reward-row"><span class="reward-label">Fame</span><span class="reward-val">${a.rewards.fame}</span></div>
      <div class="reward-row"><span class="reward-label">Silver</span><span class="reward-val">${a.rewards.silver}</span></div>
      <div class="reward-row"><span class="reward-label">${L?'Eşya':'Items'}</span><span class="reward-val">${a.rewards.items}</span></div>
    </div>
  </div>`;
}

function addToParty(role, weapon) {
  if (!selectedActivity) return;
  const roleLimit = selectedActivity.roles[role]?.count || 0;
  const current   = partyMembers.filter(m => m.role === role).length;
  if (current >= roleLimit) return;
  const num = partyMembers.length + 1;
  partyMembers.push({ id: Date.now(), role, weapon, name: `${role.charAt(0).toUpperCase()+role.slice(1)} #${current+1}` });
  renderPartyDetail();
  renderCurrentParty();
}

function renderCurrentParty() {
  const box  = document.getElementById('currentPartyBox');
  const list = document.getElementById('partyMembersList');
  if (!box || !list) return;
  box.style.display = partyMembers.length ? 'block' : 'none';
  list.innerHTML = partyMembers.map(m => `
    <div class="party-member-item">
      <div class="pmi-role-dot ${m.role}"></div>
      <span class="pmi-name">${m.name} — <span style="color:var(--text-muted);font-size:11px">${m.weapon}</span></span>
      <button class="pmi-remove" onclick="removeMember(${m.id})">✕</button>
    </div>`).join('');
}

function removeMember(id) {
  partyMembers = partyMembers.filter(m => m.id !== id);
  renderPartyDetail();
  renderCurrentParty();
}

function clearParty() {
  partyMembers = [];
  renderPartyDetail();
  renderCurrentParty();
}

function finalizeParty() {
  const lang = getLang();
  const text = partyMembers.map(m => `${m.name}: ${m.weapon}`).join('\n');
  const prefix = lang==='tr' ? `🎮 ${selectedActivity?.[lang]?.name||''} — Parti:\n` : `🎮 ${selectedActivity?.en?.name||''} — Party:\n`;
  navigator.clipboard.writeText(prefix + text).then(() => {
    alert(lang==='tr' ? '✓ Parti Discord için kopyalandı!' : '✓ Party copied for Discord!');
  }).catch(() => alert(prefix + text));
}

// ─── DUNGEON REHBERİ ─────────────────────────────────────
function renderDungeons() {
  const lang = getLang();
  const list = document.getElementById('dungeonList');
  if (!list) return;
  list.innerHTML = DUNGEONS.map(d => {
    const info = d[lang] || d.tr;
    return `<div class="dungeon-item" onclick="selectDungeon('${d.id}')">
      <div class="di-name">${d.icon} ${info.name}</div>
      <div class="di-tags">
        ${d.tags.map(t => `<span class="di-tag ${t}">${t.toUpperCase()}</span>`).join('')}
        <span style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono);margin-left:auto">${d.meta.minIP}+ IP</span>
      </div>
    </div>`;
  }).join('');
}

function selectDungeon(id) {
  const d    = DUNGEONS.find(x => x.id === id);
  if (!d) return;
  const lang = getLang();
  const info = d[lang] || d.tr;
  const L    = lang === 'tr';
  document.querySelectorAll('.dungeon-item').forEach(el => el.classList.toggle('selected', el.textContent.includes(info.name)));
  const detail = document.getElementById('dungeonDetail');
  if (!detail) return;

  detail.innerHTML = `<div class="dungeon-detail-box">
    <div class="ddb-title">${d.icon} ${info.name}</div>
    <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">${info.desc}</p>
    <div class="ddb-meta">
      <div class="ddb-meta-card"><div class="ddb-meta-label">${L?'Konum':'Location'}</div><div class="ddb-meta-val" style="font-size:12px">${d.meta.location}</div></div>
      <div class="ddb-meta-card"><div class="ddb-meta-label">${L?'Zorluk':'Difficulty'}</div><div class="ddb-meta-val" style="color:var(--gold)">${d.meta.difficulty}</div></div>
      <div class="ddb-meta-card"><div class="ddb-meta-label">Min IP</div><div class="ddb-meta-val">${d.meta.minIP}+</div></div>
      <div class="ddb-meta-card"><div class="ddb-meta-label">Fame</div><div class="ddb-meta-val" style="font-size:12px">${d.meta.fame}</div></div>
    </div>
    <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px">${L?'Bosslar':'Bosses'}</div>
    <div class="boss-list">
      ${d.bosses.map(b => `<div class="boss-item">
        <div><div class="boss-name">💀 ${b.name}</div><div class="boss-abilities">${b.abilities.map(a=>`<span class="boss-ability">${a}</span>`).join('')}</div></div>
        <div class="boss-hp">HP: ${b.hp}</div>
      </div>`).join('')}
    </div>
    <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;margin:14px 0 8px">${L?'Parti Kompozisyonu':'Party Composition'}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
      ${Object.entries(d.comp).map(([role,val])=>`<div style="background:var(--bg-base);border:1px solid var(--border);border-radius:6px;padding:8px 10px">
        <div style="color:var(--text-muted);font-size:10px;font-family:var(--font-mono)">${role.toUpperCase()}</div>
        <div style="color:var(--text-primary);font-weight:500;margin-top:2px">${val}</div>
      </div>`).join('')}
    </div>
    <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;margin:14px 0 8px">${L?'Ödüller':'Rewards'}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
      ${Object.entries(d.rewards).map(([k,v])=>`<div style="background:var(--gold-dim);border:1px solid rgba(201,168,76,.2);border-radius:6px;padding:8px 10px;text-align:center">
        <div style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono)">${k.toUpperCase()}</div>
        <div style="font-size:11px;color:var(--gold);font-weight:600;margin-top:2px">${v}</div>
      </div>`).join('')}
    </div>
    ${d.tips ? `<div style="margin-top:14px;background:var(--bg-base);border:1px solid var(--border);border-radius:8px;padding:12px">
      <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px">💡 ${L?'İpuçları':'Tips'}</div>
      ${d.tips.map(t=>`<div style="font-size:12px;color:var(--text-secondary);margin-bottom:5px;padding-left:10px;border-left:2px solid var(--gold)">• ${t}</div>`).join('')}
    </div>` : ''}
  </div>`;
}

// ─── PVP KILLBOARD ───────────────────────────────────────
function switchKbTab(tab, btn) {
  currentKbTab = tab;
  document.querySelectorAll('.kb-tab').forEach(t => t.classList.toggle('active', t === btn));
  loadKillboard();
}

function setKbFilter(filter, btn) {
  kbFilter = filter;
  document.querySelectorAll('.kb-ftag').forEach(t => t.classList.toggle('active', t === btn));
  loadKillboard();
}

async function loadKillboard() {
  const cont = document.getElementById('killboardContent');
  const lang = getLang();
  if (!cont) return;
  cont.innerHTML = `<div class="tools-loading"><div class="loading-spinner"></div><span>${lang==='tr'?'Yükleniyor...':'Loading...'}</span></div>`;

  try {
    const server = document.getElementById('kbServer')?.value || 'us';
    const res    = await fetch(`../data/pvp-feed.json?t=${Date.now()}`);
    const feed   = await res.json();
    const srv    = feed.servers?.[server];

    if (!srv?.ok) {
      cont.innerHTML = `<div style="text-align:center;padding:32px;color:var(--text-muted)">
        <div style="font-size:36px;margin-bottom:12px">⚔️</div>
        <p>${lang==='tr'?'Kill verisi henüz hazır değil. PvP Bot her 5 dakikada günceller.':'Kill data not ready. PvP Bot updates every 5 minutes.'}</p>
      </div>`;
      renderKbChart([]);
      return;
    }

    const kills = currentKbTab === 'top' ? srv.topKills : currentKbTab === 'battles' ? null : srv.recentKills;

    if (currentKbTab === 'battles') {
      renderBattles(srv.battles || [], lang);
      renderKbChart([]);
      return;
    }

    let filtered = kills || [];
    if (kbFilter !== 'all') {
      filtered = filtered.filter(k =>
        (k.location||'').toUpperCase().includes(kbFilter) ||
        (k.killerAlliance||'').toUpperCase().includes(kbFilter)
      );
    }

    renderKbChart(srv.recentKills || []);
    renderKills(filtered, lang);

  } catch(e) {
    cont.innerHTML = `<div style="text-align:center;padding:32px;color:var(--text-muted)"><p>⚠️ ${getLang()==='tr'?'Veri yüklenemedi':'Could not load data'}</p></div>`;
    renderKbChart([]);
  }
}

function renderKbChart(kills) {
  const canvas = document.getElementById('killboardChart');
  if (!canvas) return;
  if (kbChart) { kbChart.destroy(); kbChart = null; }

  // Saatlik dağılım oluştur
  const hours = Array(24).fill(0);
  kills.forEach(k => {
    if (!k.timestamp) return;
    const h = new Date(k.timestamp).getHours();
    hours[h]++;
  });

  const labels = Array.from({length:24}, (_,i) => `${i}:00`);
  kbChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Kill',
        data: hours,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      }]
    },
    options: {
      responsive:true, maintainAspectRatio:true,
      plugins:{ legend:{ display:false } },
      scales:{
        x:{ ticks:{ color:'#4a5568', font:{size:10} }, grid:{ color:'rgba(255,255,255,0.04)' } },
        y:{ ticks:{ color:'#4a5568', font:{size:10} }, grid:{ color:'rgba(255,255,255,0.04)' }, beginAtZero:true }
      }
    }
  });
}

function renderKills(kills, lang) {
  const cont = document.getElementById('killboardContent');
  if (!kills.length) {
    cont.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted)"><p>${lang==='tr'?'Kill bulunamadı':'No kills found'}</p></div>`;
    return;
  }

  cont.innerHTML = kills.map(k => {
    const gear = Object.values(k.equipment||{}).slice(0,6).map(item => {
      if (!item?.type) return '';
      const enc = item.type.match(/@(\d)$/)?.[1] || '';
      const id  = item.type.replace(/@\d$/,'');
      return `<img class="kb-gear-img" src="${RENDER}/${id}${enc?'@'+enc:''}.png" onerror="this.style.opacity='.2'" title="${getItemDisplayName(id)}"/>`;
    }).join('');

    const age = fmtAge(k.timestamp, lang);
    return `<div class="kb-kill-card">
      <div class="kb-kc-side">
        <span class="kb-kc-badge">KILL</span>
        <span class="kb-kc-time">${age}</span>
      </div>
      <div class="kb-kc-body">
        <div class="kb-kc-title">
          <span class="kb-kc-killer">${k.killer}</span>
          ${k.killerGuild?`<span style="font-size:10px;color:var(--text-muted)">[${k.killerGuild}]</span>`:''}
          <span style="color:var(--text-muted)">→</span>
          <span class="kb-kc-victim">${k.victim}</span>
          ${k.victimGuild?`<span style="font-size:10px;color:var(--text-muted)">[${k.victimGuild}]</span>`:''}
        </div>
        <div class="kb-kc-gear">${gear}</div>
        <div class="kb-kc-meta">
          ${k.victimIP>0?`<span class="kb-badge kb-badge-ip">⚡ ${k.victimIP} IP</span>`:''}
          ${k.totalFame>0?`<span class="kb-badge kb-badge-fame">💀 ${fmtFame(k.totalFame)}</span>`:''}
          ${k.location?`<span class="kb-badge kb-badge-loc">📍 ${k.location}</span>`:''}
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderBattles(battles, lang) {
  const cont = document.getElementById('killboardContent');
  if (!battles.length) {
    cont.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted)"><p>${lang==='tr'?'Muharebe bulunamadı':'No battles found'}</p></div>`;
    return;
  }
  cont.innerHTML = battles.map(b => {
    const alliances = (b.alliances||[]).slice(0,4).map(a =>
      `<div style="background:var(--bg-base);border:1px solid var(--border);border-radius:6px;padding:8px 10px;min-width:120px">
        <div style="font-size:12px;font-weight:600;color:var(--text-primary)">${a.name}</div>
        <div style="font-size:11px"><span style="color:#ef4444">⚔️ ${a.kills}</span> · <span style="color:#a78bfa">💀 ${a.deaths}</span></div>
      </div>`
    ).join('');
    return `<div class="kb-kill-card" style="flex-direction:column;cursor:pointer" onclick="window.open('https://albiononline.com/killboard/battle/${b.id}','_blank')">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted)">Battle #${b.id}</span>
        <span style="font-size:11px;color:var(--text-muted)">${fmtAge(b.startTime,lang)}</span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${alliances}</div>
      <div style="display:flex;gap:12px;margin-top:10px;font-size:11px;color:var(--text-muted)">
        <span>${lang==='tr'?'Kill:':'Kills:'} <strong style="color:var(--text-primary)">${b.totalKills}</strong></span>
        <span>Fame: <strong style="color:var(--gold)">${fmtFame(b.totalFame)}</strong></span>
        <span>${lang==='tr'?'Oyuncu:':'Players:'} <strong style="color:var(--text-primary)">${b.playerCount}</strong></span>
        <span style="margin-left:auto;color:var(--teal)">🔗 ${lang==='tr'?'Detay':'Details'}</span>
      </div>
    </div>`;
  }).join('');
}

// ─── BUILD ÖNERİLERİ ─────────────────────────────────────
function renderBuilds() {
  const lang    = getLang();
  const role    = document.getElementById('buildRole')?.value    || 'all';
  const content = document.getElementById('buildContent')?.value || 'all';
  const cont    = document.getElementById('buildsGrid');
  if (!cont) return;

  const filtered = BUILDS.filter(b =>
    (role === 'all' || b.role === role) &&
    (content === 'all' || b.content === content)
  );

  if (!filtered.length) {
    cont.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">
      <p>${lang==='tr'?'Bu kombinasyon için build bulunamadı.':'No build found for this combination.'}</p>
    </div>`;
    return;
  }

  cont.innerHTML = filtered.map(b => {
    const tip = (b[lang] || b.tr).tip;
    const gearRows = b.gear.map(g => {
      const src = `${RENDER}/T${g.tier}_${g.id.replace(/^T\d_/,'')}.png`;
      return `<div class="bc-gear-row">
        <span class="bc-gear-slot">${g.slot}</span>
        <img class="bc-gear-icon" src="${src}" onerror="this.style.opacity='.2'" title="${g.name}"/>
        <span class="bc-gear-name">${g.name}</span>
      </div>`;
    }).join('');

    const contentLabel = { solo:'Solo PvP', group:'Group PvP', zvz:'ZvZ', pve:'PvE', gathering:'Gathering' };
    return `<div class="build-card">
      <div class="bc-header">
        <span class="bc-name">${b.name}</span>
        <div class="bc-badges">
          <span class="bc-role-badge ${b.role}">${b.role.toUpperCase()}</span>
          <span class="bc-content-badge">${contentLabel[b.content]||b.content}</span>
        </div>
      </div>
      <div class="bc-gear-list">${gearRows}</div>
      <div class="bc-ip">Min IP: ${b.minIP}+</div>
      <div class="bc-tip">${tip}</div>
    </div>`;
  }).join('');
}

// ─── YARDIMCILAR ─────────────────────────────────────────
function fmtFame(n) {
  if (!n||n<=0) return '0';
  if (n>=1e9) return (n/1e9).toFixed(2)+'B';
  if (n>=1e6) return (n/1e6).toFixed(1)+'M';
  if (n>=1e3) return (n/1e3).toFixed(1)+'K';
  return n.toString();
}

function fmtAge(ts, lang) {
  if (!ts) return '—';
  const mins = Math.floor((Date.now() - new Date(ts)) / 60000);
  const L = lang === 'tr';
  if (mins < 2)    return L?'Az önce':'Just now';
  if (mins < 60)   return `${mins}${L?'dk':'m'} ${L?'önce':'ago'}`;
  if (mins < 1440) return `${Math.floor(mins/60)}${L?'sa':'h'} ${L?'önce':'ago'}`;
  return `${Math.floor(mins/1440)}${L?'g':'d'} ${L?'önce':'ago'}`;
}

function getItemDisplayName(typeId) {
  if (!typeId) return '';
  const baseId = typeId.replace(/^T\d_/,'').replace(/@\d$/,'');
  const item   = (window.AO_ITEMS||[]).find(i => i.id === baseId);
  if (!item) return typeId.replace(/_/g,' ');
  return getLang()==='tr' ? item.tr : item.en;
}

// ─── BAŞLAT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderActivities();
  renderDungeons();
});
