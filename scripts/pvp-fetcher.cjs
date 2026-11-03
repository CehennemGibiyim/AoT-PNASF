// AoT-PNASF — PvP Feed Fetcher v3
// Native Node.js https — sıfır bağımlılık

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// Repo kök klasörüne göre output path
const OUTPUT = path.resolve(__dirname, '..', 'data', 'pvp-feed.json');
const META_OUTPUT = path.resolve(__dirname, '..', 'data', 'meta-craft.json');

// Craft meta istatistikleri için sunucu başına çekilecek sayfa sayısı.
// gameinfo /events en fazla 51 kayıt döndürüyor; 6 sayfa ≈ 300 kill.
const PAGES = Math.max(1, Math.min(10, Number(process.env.PVP_PAGES) || 6));
const SIDES = ['weapon', 'offhand', 'head', 'chest', 'shoes', 'cape', 'food', 'potion'];
const EQ_SLOT = {
  MainHand: 'weapon', OffHand: 'offhand', Head: 'head', Armor: 'chest',
  Shoes: 'shoes', Cape: 'cape', Food: 'food', Potion: 'potion',
};

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
    // Öldüren tarafın giydikleri — craft meta istatistikleri için gerekli.
    killerEquipment: cleanEq(e.Killer?.Equipment),
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

// ─── CRAFT META İSTATİSTİKLERİ ───
// Kill event'lerindeki ekipmanlardan "hangi slotta hangi eşya, hangi tier'da, ne oranda
// giyilmiş" tablosunu üretir. Hem ölen hem öldüren tarafı ayrı ayrı hesaplanır.
function newSideStats() {
  const side = {};
  for (const slot of SIDES) side[slot] = { total: 0, items: {} };
  return side;
}

function addSideStats(side, equipment) {
  if (!equipment) return;
  for (const [apiSlot, slot] of Object.entries(EQ_SLOT)) {
    const raw = equipment[apiSlot];
    if (!raw || !raw.Type) continue;
    const base = String(raw.Type).replace(/^T\d+_/, '').replace(/@\d+$/, '');
    const tierMatch = String(raw.Type).match(/^T(\d+)_/);
    const tier = tierMatch ? Number(tierMatch[1]) : 0;
    const bucket = side[slot];
    bucket.total += 1;
    const item = bucket.items[base] || (bucket.items[base] = { base, count: 0, tiers: {}, qualitySum: 0 });
    item.count += 1;
    item.tiers[tier] = (item.tiers[tier] || 0) + 1;
    item.qualitySum += Number(raw.Quality) || 1;
  }
}

function finalizeSide(side) {
  const out = {};
  for (const slot of SIDES) {
    const bucket = side[slot];
    if (!bucket || !bucket.total) { out[slot] = { total: 0, items: [] }; continue; }
    const items = Object.values(bucket.items)
      .map((item) => ({
        base: item.base,
        count: item.count,
        share: Math.round((item.count / bucket.total) * 1000) / 10,
        tiers: item.tiers,
        avgTier: Math.round(
          (Object.entries(item.tiers).reduce((sum, [t, n]) => sum + Number(t) * n, 0) / item.count) * 10
        ) / 10,
        avgQuality: Math.round((item.qualitySum / item.count) * 10) / 10,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 40);
    out[slot] = { total: bucket.total, items };
  }
  return out;
}

async function fetchServer(key, hostname) {
  console.log(`\n[${key.toUpperCase()}]`);
  const d = { recentKills:[], topKills:[], battles:[], ok:false, fetchedAt: new Date().toISOString() };

  try {
    // Craft meta istatistikleri için birden fazla sayfa taranır.
    const events = [];
    for (let page = 0; page < PAGES; page++) {
      const offset = page * 51;
      try {
        const chunk = await fetchWithRetry(hostname, `/api/gameinfo/events?limit=51&offset=${offset}`);
        if (!Array.isArray(chunk) || !chunk.length) break;
        events.push(...chunk);
        if (chunk.length < 51) break;
      } catch (err) {
        if (!events.length) throw err;
        console.warn(`  ! Kill sayfa ${page + 1}: ${err.message}`);
        break;
      }
      await new Promise((r) => setTimeout(r, 400));
    }

    if (events.length > 0) {
      d.recentKills = events.slice(0, 20).map(cleanKill).filter(Boolean);
      d.topKills    = [...events]
        .sort((a,b) => (b.TotalVictimKillFame||0) - (a.TotalVictimKillFame||0))
        .slice(0, 20).map(cleanKill).filter(Boolean);
      d.ok = true;

      // Ölen / öldüren tarafı için ekipman kullanım istatistikleri
      const victimSide = newSideStats();
      const killerSide = newSideStats();
      for (const ev of events) {
        addSideStats(victimSide, ev.Victim?.Equipment);
        addSideStats(killerSide, ev.Killer?.Equipment);
      }
      d.meta = {
        sampleKills: events.length,
        victim: finalizeSide(victimSide),
        killer: finalizeSide(killerSide),
      };

      // Tarayıcı analizi (killboard grafikleri) için sıkı dizi. gameinfo API'si
      // CORS başlığı göndermediği için sayfa veriyi canlı çekemiyor; bu dizi
      // 3 sunucuda da gerçek hacimli veri sağlar. Alan sırası (boyut için dizi):
      // [ts, killerIP, victimIP, killerWeapon, victimWeapon, fame, partySize, killer, victim]
      d.analysis = events
        .filter(e => e.TimeStamp)
        .sort((a, b) => new Date(b.TimeStamp) - new Date(a.TimeStamp))
        .slice(0, 150)
        .map(e => ([
          Date.parse(e.TimeStamp),
          Math.round(e.Killer?.AverageItemPower || 0),
          Math.round(e.Victim?.AverageItemPower || 0),
          e.Killer?.Equipment?.MainHand?.Type || '',
          e.Victim?.Equipment?.MainHand?.Type || '',
          Number(e.TotalVictimKillFame) || 0,
          (e.GroupMembers?.length || 0) + 1,
          e.Killer?.Name || '?',
          e.Victim?.Name || '?',
        ]))
        .filter(a => Number.isFinite(a[0]));
      console.log(`  ✓ Kill: ${events.length} olay (${d.recentKills.length} özet kayıt, meta hazır)`);
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
  const meta = { fetchedAt: result.fetchedAt, source: 'gameinfo /events', pagesPerServer: PAGES, servers: {} };

  for (const [key, hostname] of Object.entries(GI_HOSTS)) {
    result.servers[key] = await fetchServer(key, hostname);
    const srv = result.servers[key];
    if (srv && srv.meta) {
      meta.servers[key] = srv.meta;
      delete srv.meta; // ayrı dosyaya yazılır, pvp-feed.json şişmesin
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2), 'utf8');
  if (Object.keys(meta.servers).length) {
    fs.writeFileSync(META_OUTPUT, JSON.stringify(meta, null, 1), 'utf8');
    console.log('\n📊 Meta craft istatistikleri →', path.relative(process.cwd(), META_OUTPUT));
  }

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
