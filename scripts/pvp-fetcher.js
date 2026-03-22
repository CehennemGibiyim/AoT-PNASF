// AoT-PNASF — PvP Feed Fetcher
// GitHub Actions tarafından her 5 dakikada çalıştırılır
// GameInfo API'den sunucu tarafında veri çeker → pvp-feed.json'a yazar

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// API endpoint'leri — 3 sunucu
const GI = {
  us:   'https://gameinfo.albiononline.com/api/gameinfo',
  eu:   'https://gameinfo-ams.albiononline.com/api/gameinfo',
  asia: 'https://gameinfo-sgp.albiononline.com/api/gameinfo',
};

const OUTPUT = path.join(__dirname, '../src/data/pvp-feed.json');
const TIMEOUT = 15000; // 15 saniye timeout

// Timeout ile fetch
async function safeFetch(url, ms = TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal,
      headers: { 'User-Agent': 'AoT-PNASF Bot/1.0 (github.io)' }
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch(e) {
    clearTimeout(timer);
    console.warn(`  ⚠ Fetch hatası: ${url} → ${e.message}`);
    return null;
  }
}

// Ekipman slotlarını düzenle
function cleanEquipment(equipment) {
  if (!equipment) return {};
  const slots = ['MainHand','OffHand','Head','Armor','Shoes','Cape','Bag','Mount','Potion','Food'];
  const result = {};
  slots.forEach(slot => {
    const item = equipment[slot];
    if (item && item.Type) {
      result[slot] = { type: item.Type, quality: item.Quality || 1 };
    }
  });
  return result;
}

// Kill event'ini sadeleştir
function cleanKill(event) {
  if (!event) return null;
  return {
    id:            event.EventId || event.Id || '',
    timestamp:     event.TimeStamp || '',
    killer:        event.Killer?.Name || '?',
    killerId:      event.Killer?.Id  || '',
    killerGuild:   event.Killer?.GuildName  || '',
    killerAlliance:event.Killer?.AllianceName || '',
    killerIP:      Math.round(event.Killer?.AverageItemPower || 0),
    victim:        event.Victim?.Name  || '?',
    victimId:      event.Victim?.Id   || '',
    victimGuild:   event.Victim?.GuildName  || '',
    victimAlliance:event.Victim?.AllianceName || '',
    victimIP:      Math.round(event.Victim?.AverageItemPower || 0),
    totalFame:     event.TotalVictimKillFame || 0,
    location:      event.Victim?.DeathZone || event.Location || '',
    equipment:     cleanEquipment(event.Victim?.Equipment),
    partySize:     (event.GroupMembers?.length || 0) + 1,
  };
}

// Battle'ı sadeleştir
function cleanBattle(battle) {
  if (!battle) return null;
  const alliances = Object.values(battle.Alliances || {}).slice(0, 6).map(a => ({
    name:   a.Name || 'Guildless',
    kills:  a.Kills  || 0,
    deaths: a.Deaths || 0,
    fame:   a.KillFame || 0,
  }));
  return {
    id:          battle.id || battle.Id || '',
    startTime:   battle.StartTime || '',
    totalKills:  battle.TotalKills  || 0,
    totalFame:   battle.TotalFame   || 0,
    playerCount: Object.keys(battle.Players || {}).length,
    alliances,
  };
}

// Ana fonksiyon
async function main() {
  console.log('⚔️  AoT-PNASF PvP Fetcher başladı...');
  const now = new Date().toISOString();

  const result = {
    fetchedAt: now,
    servers: {},
  };

  // Her 3 sunucu için veri çek
  for (const [serverKey, baseUrl] of Object.entries(GI)) {
    console.log(`\n🌐 Sunucu: ${serverKey.toUpperCase()} — ${baseUrl}`);
    const serverData = {
      recentKills: [],
      topKills:    [],
      battles:     [],
      fetchedAt:   now,
      ok:          false,
    };

    // Son kill'ler
    console.log('  → Son kill\'ler çekiliyor...');
    const recentRaw = await safeFetch(`${baseUrl}/events?limit=30&offset=0`);
    if (recentRaw && Array.isArray(recentRaw)) {
      serverData.recentKills = recentRaw
        .map(cleanKill)
        .filter(Boolean)
        .slice(0, 20);
      console.log(`  ✓ ${serverData.recentKills.length} kill alındı`);
    }

    // En yüksek fame kill'ler (son 300'den filtrele)
    console.log('  → Top kill\'ler hesaplanıyor...');
    const topRaw = await safeFetch(`${baseUrl}/events?limit=300&offset=0`);
    if (topRaw && Array.isArray(topRaw)) {
      serverData.topKills = topRaw
        .map(cleanKill)
        .filter(Boolean)
        .sort((a, b) => b.totalFame - a.totalFame)
        .slice(0, 20);
      console.log(`  ✓ ${serverData.topKills.length} top kill hesaplandı`);
    }

    // Battle board
    console.log('  → Battle board çekiliyor...');
    const battleRaw = await safeFetch(`${baseUrl}/battles?sort=recent&limit=20&offset=0`);
    if (battleRaw && Array.isArray(battleRaw)) {
      serverData.battles = battleRaw
        .map(cleanBattle)
        .filter(Boolean);
      console.log(`  ✓ ${serverData.battles.length} muharebe alındı`);
    }

    serverData.ok = serverData.recentKills.length > 0 || serverData.battles.length > 0;
    result.servers[serverKey] = serverData;
  }

  // JSON'a yaz
  const json = JSON.stringify(result, null, 2);
  fs.writeFileSync(OUTPUT, json, 'utf8');
  console.log(`\n✅ pvp-feed.json yazıldı — ${(json.length / 1024).toFixed(1)} KB`);

  // Özet
  for (const [srv, data] of Object.entries(result.servers)) {
    console.log(`  ${srv.toUpperCase()}: ${data.recentKills.length} kill · ${data.battles.length} battle · ${data.ok ? '✓' : '✗'}`);
  }
}

main().catch(e => {
  console.error('❌ Fatal hata:', e);
  // Hata olsa bile boş JSON yaz — sayfa çökmez
  const fallback = {
    fetchedAt: new Date().toISOString(),
    error: e.message,
    servers: { us: { recentKills:[], topKills:[], battles:[], ok:false }, eu: { recentKills:[], topKills:[], battles:[], ok:false }, asia: { recentKills:[], topKills:[], battles:[], ok:false } }
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(fallback, null, 2), 'utf8');
  process.exit(0); // Workflow'u başarısız sayma
});
