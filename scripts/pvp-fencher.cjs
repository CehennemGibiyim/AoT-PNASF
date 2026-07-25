#!/usr/bin/env node
/**
 * PvP Feed Fetcher - CommonJS
 * GameInfo API'den kill feed ve battle verilerini çeker
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  servers: {
    eu: 'https://gameinfo-ams.albiononline.com/api/gameinfo',
    us: 'https://gameinfo.albiononline.com/api/gameinfo',
    asia: 'https://gameinfo-sgp.albiononline.com/api/gameinfo'
  },
  outputFile: path.join(__dirname, '..', 'data', 'pvp-feed.json'),
  limit: 20,
  minFame: 50000  // En az bu kadar fame değeri olan öldürmeler
};

async function fetchWithTimeout(url, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'AoT-PNASF-PvP-Bot/1.0 (GitHub Actions)'
      }
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function fetchEvents(serverUrl) {
  try {
    const url = `${serverUrl}/events?limit=${CONFIG.limit}&offset=0`;
    console.log(`🔍 Fetching: ${url}`);
    
    const response = await fetchWithTimeout(url, 15000);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const events = await response.json();
    return events.filter(e => e.TotalVictimKillFame >= CONFIG.minFame);
  } catch (error) {
    console.warn(`⚠️ ${serverUrl} failed:`, error.message);
    return [];
  }
}

async function fetchBattles(serverUrl) {
  try {
    const url = `${serverUrl}/battles?sort=recent&limit=10`;
    console.log(`⚔️ Fetching battles: ${url}`);
    
    const response = await fetchWithTimeout(url, 15000);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`⚠️ Battles fetch failed for ${serverUrl}:`, error.message);
    return [];
  }
}

function formatKill(event, server) {
  return {
    id: event.EventId,
    timestamp: event.TimeStamp,
    server: server,
    fame: event.TotalVictimKillFame,
    killer: {
      name: event.Killer.Name,
      guild: event.Killer.GuildName || null,
      alliance: event.Killer.AllianceName || null,
      fame: event.Killer.DeathFame || 0,
      equipment: event.Killer.Equipment
    },
    victim: {
      name: event.Victim.Name,
      guild: event.Victim.GuildName || null,
      alliance: event.Victim.AllianceName || null,
      fame: event.Victim.DeathFame || 0,
      equipment: event.Victim.Equipment
    },
    participants: (event.Participants || []).map(p => ({
      name: p.Name,
      fame: p.DamageDone || 0
    })),
    location: event.Location || null
  };
}

function formatBattle(battle, server) {
  return {
    id: battle.id,
    timestamp: battle.startTime,
    server: server,
    totalFame: battle.totalFame || 0,
    totalKills: battle.totalKills || 0,
    players: Array.isArray(battle.players) ? battle.players.length : 0,
    // guilds obje veya dizi olabilir, güvenli işle
    guilds: (() => {
      const guilds = battle.guilds;
      if (!guilds) return [];
      // Eğer obje ise (key-value pairs), diziye çevir
      const guildArray = Array.isArray(guilds) ? guilds : Object.values(guilds);
      return guildArray.slice(0, 5).map(g => ({
        name: g.name || 'Unknown',
        kills: g.kills || 0,
        deaths: g.deaths || 0,
        fame: g.killFame || 0
      }));
    })(),
    cluster: battle.clusterName || 'Unknown'
  };
}

async function main() {
  console.log('⚔️ PvP Feed Fetcher Started');
  console.log('================================');
  
  let allKills = [];
  let allBattles = [];
  
  // Tüm sunuculardan veri çek
  for (const [serverName, serverUrl] of Object.entries(CONFIG.servers)) {
    console.log(`\n🌍 Processing ${serverName.toUpperCase()} server...`);
    
    const kills = await fetchEvents(serverUrl);
    const battles = await fetchBattles(serverUrl);
    
    console.log(`  ✅ ${kills.length} kills found`);
    console.log(`  ✅ ${battles.length} battles found`);
    
    allKills = allKills.concat(kills.map(e => formatKill(e, serverName)));
    allBattles = allBattles.concat(battles.map(b => formatBattle(b, serverName)));
  }
  
  // En değerlileri seç ve sırala
  const topKills = allKills
    .sort((a, b) => b.fame - a.fame)
    .slice(0, 15);
  
  const recentBattles = allBattles
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);
  
  // Output verisi oluştur
  const output = {
    lastUpdate: new Date().toISOString(),
    stats: {
      totalKills: allKills.length,
      totalBattles: allBattles.length,
      servers: ['eu', 'us', 'asia']
    },
    topKills,
    recentBattles
  };
  
  // JSON olarak kaydet
  fs.mkdirSync(path.dirname(CONFIG.outputFile), { recursive: true });
  fs.writeFileSync(CONFIG.outputFile, JSON.stringify(output, null, 2));
  
  console.log('\n================================');
  console.log('✅ PvP Feed Updated');
  console.log(`📊 Top Kills: ${topKills.length}`);
  console.log(`⚔️ Recent Battles: ${recentBattles.length}`);
  console.log(`💾 Saved to: ${CONFIG.outputFile}`);
  console.log('================================');
}

// Run
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
