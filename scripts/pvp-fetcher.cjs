// AoT-PNASF — PvP Feed Fetcher v3
// Native Node.js https — sıfır bağımlılık

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// Repo kök klasörüne göre output path
const OUTPUT = path.resolve(__dirname, '..', 'src', 'data', 'pvp-feed.json');

const GI_HOSTS = {
  us:   'gameinfo.albiononline.com',
  eu:   'gameinfo-ams.albiononline.com',
  asia: 'gameinfo-sgp.albiononline.com',
};

function httpsGet(hostname, urlPath, ms = 20000) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path: urlPath, method: 'GET', headers: { 'User-Agent': 'AoT-PNASF/3.0', 'Accept': 'application/json' } },
      (res) => {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
          catch(e) { reject(new Error('JSON parse failed')); }
        });
      }
    );
    req.setTimeout(ms, () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', e => reject(e));
    req.end();
  });
}

// ─── RETRY MEKANİZMASI ───
async function fetchWithRetry(hostname, urlPath, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      return await httpsGet(hostname, urlPath);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2000)); // 2 sn bekle ve tekrar dene
    }
  }
}

function cleanEq(eq) {
  if (!eq) return {};
  const r = {};
  ['MainHand','OffHand','Head','Armor','Shoes','Cape','Bag','Mount','Potion','Food'].forEach(s => {
    if (eq[s]?.Type) r[s] = { type: eq[s].Type, quality: eq[s].Quality || 1 };
  });
  return r;
}

function cleanKill(e) {
  if (!e) return null;
  return {
    id:             String(e.EventId || ''),
    timestamp:      e.TimeStamp || '',
    killer:         e.Killer?.Name || '?',
    killerGuild:    e.Killer?.GuildName || '',
    killerAlliance: e.Killer?.AllianceName || '',
    killerIP:       Math.round(e.Killer?.AverageItemPower || 0),
    victim:         e.Victim?.Name || '?',
    victimGuild:    e.Victim?.GuildName || '',
    victimAlliance: e.Victim?.AllianceName || '',
    victimIP:       Math.round(e.Victim?.AverageItemPower || 0),
    totalFame:      Number(e.TotalVictimKillFame) || 0,
    location:       e.Victim?.DeathZone || '',
    equipment:      cleanEq(e.Victim?.Equipment),
    partySize:      (e.GroupMembers?.length || 0) + 1,
  };
}

function cleanBattle(b) {
  if (!b) return null;
  return {
    id:          String(b.id || b.Id || ''),
    startTime:   b.StartTime || '',
    totalKills:  Number(b.TotalKills) || 0,
    totalFame:   Number(b.TotalFame) || 0,
    playerCount: Object.keys(b.Players || {}).length,
    alliances:   Object.values(b.Alliances || {}).slice(0, 6).map(a => ({
      name:   a.Name   || 'Guildless',
      kills:  a.Kills  || 0,
      deaths: a.Deaths || 0,
    })),
  };
}

async function fetchServer(key, hostname) {
  console.log(`\n[${key.toUpperCase()}]`);
  const d = { recentKills:[], topKills:[], battles:[], ok:false, fetchedAt: new Date().toISOString() };

  try {
    const events = await fetchWithRetry(hostname, '/api/gameinfo/events?limit=51&offset=0');
    if (Array.isArray(events) && events.length > 0) {
      d.recentKills = events.slice(0, 20).map(cleanKill).filter(Boolean);
      d.topKills    = [...events]
        .sort((a,b) => (b.TotalVictimKillFame||0) - (a.TotalVictimKillFame||0))
        .slice(0, 20).map(cleanKill).filter(Boolean);
      d.ok = true;
      console.log(`  ✓ Kill: ${d.recentKills.length}`);
    } else {
      console.log(`  ✗ Kill: boş yanıt`);
    }
  } catch(e) { console.warn(`  ✗ Kill: ${e.message}`); }

  try {
    const battles = await fetchWithRetry(hostname, '/api/gameinfo/battles?sort=recent&limit=20&offset=0');
    if (Array.isArray(battles) && battles.length > 0) {
      d.battles = battles.map(cleanBattle).filter(Boolean);
      console.log(`  ✓ Battle: ${d.battles.length}`);
    } else {
      console.log(`  ✗ Battle: boş yanıt`);
    }
  } catch(e) { console.warn(`  ✗ Battle: ${e.message}`); }

  return d;
}

async function main() {
  console.log('⚔️  AoT-PNASF PvP Fetcher v3 —', new Date().toISOString());
  console.log('   Output:', OUTPUT);

  const result = { fetchedAt: new Date().toISOString(), servers: {} };

  for (const [key, hostname] of Object.entries(GI_HOSTS)) {
    result.servers[key] = await fetchServer(key, hostname);
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2), 'utf8');

  const anyOk = Object.values(result.servers).some(s => s.ok);
  console.log('\n' + (anyOk ? '✅ Başarılı' : '⚠️  Veri alınamadı — bir sonraki çalışmada denenir'));

  for (const [srv, d] of Object.entries(result.servers)) {
    console.log(`  ${d.ok?'✓':'✗'} ${srv.toUpperCase()}: ${d.recentKills.length} kill · ${d.battles.length} battle`);
  }
}

main().catch(e => {
  console.error('HATA:', e);
  // exit 0 — workflow başarısız sayılmasın
  process.exit(0);
});
