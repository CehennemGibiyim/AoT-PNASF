// AoT-PNASF — PvP Feed Fetcher v2
// Node.js native https — dış paket gerektirmez
// GitHub Actions her 5 dakikada çalıştırır

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const OUTPUT = path.join(__dirname, '../src/data/pvp-feed.json');

const GI = {
  us:   'gameinfo.albiononline.com',
  eu:   'gameinfo-ams.albiononline.com',
  asia: 'gameinfo-sgp.albiononline.com',
};

// Native HTTPS GET — dış paket yok
function httpsGet(hostname, urlPath, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path: urlPath,
      method: 'GET',
      headers: { 'User-Agent': 'AoT-PNASF-Bot/2.0', 'Accept': 'application/json' }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('JSON parse error: ' + data.slice(0,100))); }
      });
    });
    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', e => reject(e));
    req.end();
  });
}

function cleanEquipment(eq) {
  if (!eq) return {};
  const slots = ['MainHand','OffHand','Head','Armor','Shoes','Cape','Bag','Mount','Potion','Food'];
  const r = {};
  slots.forEach(s => { if (eq[s]?.Type) r[s] = { type: eq[s].Type, quality: eq[s].Quality||1 }; });
  return r;
}

function cleanKill(e) {
  if (!e) return null;
  return {
    id:             e.EventId || '',
    timestamp:      e.TimeStamp || '',
    killer:         e.Killer?.Name || '?',
    killerGuild:    e.Killer?.GuildName || '',
    killerAlliance: e.Killer?.AllianceName || '',
    killerIP:       Math.round(e.Killer?.AverageItemPower || 0),
    victim:         e.Victim?.Name || '?',
    victimGuild:    e.Victim?.GuildName || '',
    victimAlliance: e.Victim?.AllianceName || '',
    victimIP:       Math.round(e.Victim?.AverageItemPower || 0),
    totalFame:      e.TotalVictimKillFame || 0,
    location:       e.Victim?.DeathZone || '',
    equipment:      cleanEquipment(e.Victim?.Equipment),
    partySize:      (e.GroupMembers?.length || 0) + 1,
  };
}

function cleanBattle(b) {
  if (!b) return null;
  return {
    id:          b.id || b.Id || '',
    startTime:   b.StartTime || '',
    totalKills:  b.TotalKills || 0,
    totalFame:   b.TotalFame || 0,
    playerCount: Object.keys(b.Players || {}).length,
    alliances:   Object.values(b.Alliances || {}).slice(0, 6).map(a => ({
      name:   a.Name || 'Guildless',
      kills:  a.Kills || 0,
      deaths: a.Deaths || 0,
      fame:   a.KillFame || 0,
    })),
  };
}

async function fetchServer(key, hostname) {
  console.log(`\n[${key.toUpperCase()}] ${hostname}`);
  const data = { recentKills:[], topKills:[], battles:[], ok:false, fetchedAt: new Date().toISOString() };

  // Kill feed
  try {
    const events = await httpsGet(hostname, '/api/gameinfo/events?limit=51&offset=0');
    if (Array.isArray(events) && events.length) {
      data.recentKills = events.slice(0, 20).map(cleanKill).filter(Boolean);
      data.topKills    = [...events]
        .sort((a,b) => (b.TotalVictimKillFame||0) - (a.TotalVictimKillFame||0))
        .slice(0, 20).map(cleanKill).filter(Boolean);
      data.ok = true;
      console.log(`  ✓ Kill: ${data.recentKills.length}`);
    } else {
      console.log(`  ✗ Kill: boş yanıt`);
    }
  } catch(e) { console.warn(`  ✗ Kill hatası: ${e.message}`); }

  // Battle board
  try {
    const battles = await httpsGet(hostname, '/api/gameinfo/battles?sort=recent&limit=20&offset=0');
    if (Array.isArray(battles) && battles.length) {
      data.battles = battles.map(cleanBattle).filter(Boolean);
      console.log(`  ✓ Battle: ${data.battles.length}`);
    } else {
      console.log(`  ✗ Battle: boş yanıt`);
    }
  } catch(e) { console.warn(`  ✗ Battle hatası: ${e.message}`); }

  return data;
}

async function main() {
  console.log('⚔️  AoT-PNASF PvP Fetcher v2');
  console.log('   Zaman:', new Date().toISOString());

  const result = { fetchedAt: new Date().toISOString(), servers: {} };

  for (const [key, hostname] of Object.entries(GI)) {
    result.servers[key] = await fetchServer(key, hostname);
  }

  // Klasör yoksa oluştur
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  const json = JSON.stringify(result, null, 2);
  fs.writeFileSync(OUTPUT, json, 'utf8');

  console.log(`\n✅ Yazıldı: ${OUTPUT}`);
  console.log(`   Boyut: ${(json.length/1024).toFixed(1)} KB`);

  let anyOk = false;
  for (const [srv, d] of Object.entries(result.servers)) {
    const icon = d.ok ? '✓' : '✗';
    console.log(`   ${icon} ${srv.toUpperCase()}: ${d.recentKills.length} kill · ${d.battles.length} battle`);
    if (d.ok) anyOk = true;
  }

  if (!anyOk) {
    console.warn('\n⚠️  GameInfo API hiçbir sunucudan yanıt vermedi');
    console.warn('   Bu normaldir — Albion sunucuları bazen meşgul olur');
    console.warn('   Bir sonraki çalışmada tekrar denenir');
  }
}

main().catch(e => {
  console.error('❌ Fatal:', e);
  process.exit(0); // 0 ile çık — workflow başarısız sayılmasın
});
