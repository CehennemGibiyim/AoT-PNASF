#!/usr/bin/env node
// Savaş arşivi + silah meta — Albion gameinfo API → data/archive/*.json
//
// GitHub Actions (.github/workflows/ao-archive.yml) günde bir kez çalıştırır.
// API dokümansızdır ve ara sıra 502 döner; bu yüzden tarayıcı User-Agent'ı,
// zaman aşımı ve tekrar deneme vardır. Bir sunucu düşerse diğerleri yazılır.
//
// Kullanım: node scripts/archive-gameinfo.mjs

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import vm from 'node:vm';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const SUNUCULAR = {
  us: 'gameinfo.albiononline.com',
  eu: 'gameinfo-ams.albiononline.com',
  asia: 'gameinfo-sgp.albiononline.com',
};
const CIKTI = path.join(process.cwd(), 'data', 'archive');

function get(host, yol, deneme = 3) {
  return new Promise((resolve, reject) => {
    const istek = https.request({
      hostname: host,
      path: yol,
      method: 'GET',
      headers: { 'User-Agent': UA, Accept: 'application/json' },
      timeout: 25000,
    }, (yanit) => {
      let govde = '';
      yanit.setEncoding('utf8');
      yanit.on('data', (p) => { govde += p; });
      yanit.on('end', () => {
        if (yanit.statusCode !== 200) {
          reject(new Error(`${host}${yol} → HTTP ${yanit.statusCode}`));
          return;
        }
        try { resolve(JSON.parse(govde)); } catch (e) { reject(e); }
      });
    });
    istek.on('timeout', () => istek.destroy(new Error('zaman aşımı')));
    istek.on('error', reject);
    istek.end();
  }).catch(async (hata) => {
    if (deneme <= 1) throw hata;
    await new Promise((r) => setTimeout(r, 1800));
    return get(host, yol, deneme - 1);
  });
}

/** data/items-data.js içindeki TR adları okur (window.AO_ITEMS). */
function itemAdlari() {
  const harita = new Map();
  try {
    const kod = fs.readFileSync(path.join(process.cwd(), 'data', 'items-data.js'), 'utf8');
    const ctx = { window: {} };
    vm.createContext(ctx);
    vm.runInContext(kod, ctx);
    for (const it of ctx.window.AO_ITEMS || []) harita.set(it.id, it.tr || it.en || it.id);
  } catch { /* ad yoksa kimlik gösterilir */ }
  return harita;
}

const silahAnahtar = (tip) => String(tip || '').replace(/^T\d+_/, '').replace(/@\d+$/, '');

function savasOzet(ham) {
  return (Array.isArray(ham) ? ham : []).slice(0, 40).map((b) => ({
    id: b.id,
    t: b.startTime,
    f: Math.round(Number(b.totalFame) || 0),
    k: Number(b.totalKills) || 0,
    z: b.clusterName || '',
    p: Object.keys(b.players || {}).length,
    pl: Object.values(b.players || {})
      .sort((a, c) => (c.kills || 0) - (a.kills || 0) || (c.killFame || 0) - (a.killFame || 0))
      .slice(0, 6)
      .map((x) => [x.name, x.guildName || '', x.kills || 0, x.deaths || 0, Math.round(x.killFame || 0)]),
    g: Object.values(b.guilds || {})
      .sort((a, c) => (c.kills || 0) - (a.kills || 0))
      .slice(0, 4)
      .map((g) => [g.name, g.alliance || '', g.kills || 0, g.deaths || 0, Math.round(g.killFame || 0)]),
  }));
}

async function main() {
  fs.mkdirSync(CIKTI, { recursive: true });
  const adlar = itemAdlari();
  const savaslar = { generatedAt: new Date().toISOString(), source: 'gameinfo /battles', servers: {} };
  const meta = { generatedAt: savaslar.generatedAt, source: 'gameinfo /events', servers: {} };

  for (const [anahtar, host] of Object.entries(SUNUCULAR)) {
    const silahlar = new Map();
    let ornek = 0;
    let savasOk = false;

    try {
      const ham = await get(host, '/api/gameinfo/battles?range=week&limit=40&offset=0&sort=recent');
      savaslar.servers[anahtar] = { ok: true, battles: savasOzet(ham) };
      savasOk = true;
    } catch (hata) {
      savaslar.servers[anahtar] = { ok: false, error: String(hata.message || hata), battles: [] };
    }

    for (let sayfa = 0; sayfa < 6; sayfa++) {
      try {
        const olaylar = await get(host, `/api/gameinfo/events?limit=51&offset=${sayfa * 51}`);
        for (const e of Array.isArray(olaylar) ? olaylar : []) {
          const kTip = e?.Killer?.Equipment?.MainHand?.Type;
          const vTip = e?.Victim?.Equipment?.MainHand?.Type;
          if (!kTip || !vTip) continue;
          const k = silahAnahtar(kTip);
          const v = silahAnahtar(vTip);
          if (!k || !v) continue;
          ornek++;
          const kIp = Number(e?.Killer?.AverageItemPower) || 0;
          const vIp = Number(e?.Victim?.AverageItemPower) || 0;
          if (!silahlar.has(k)) silahlar.set(k, { kills: 0, deaths: 0, ipToplam: 0, ipAdet: 0 });
          if (!silahlar.has(v)) silahlar.set(v, { kills: 0, deaths: 0, ipToplam: 0, ipAdet: 0 });
          const ks = silahlar.get(k);
          ks.kills++;
          if (kIp > 0) { ks.ipToplam += kIp; ks.ipAdet++; }
          silahlar.get(v).deaths++;
          if (vIp > 0) {
            const vs = silahlar.get(v);
            vs.ipToplam += vIp;
            vs.ipAdet++;
          }
        }
      } catch { /* sayfa atlanır */ }
    }

    const liste = [...silahlar.entries()]
      .map(([id, s]) => ({
        id,
        ad: (adlar.get(id) || id).replace(/^(Acemi|Kalfa|Ehil|Usta|Uzman|Üstat)\s+/, ''),
        k: s.kills,
        d: s.deaths,
        wr: s.kills + s.deaths > 0 ? Math.round((s.kills / (s.kills + s.deaths)) * 1000) / 10 : 0,
        ip: s.ipAdet ? Math.round(s.ipToplam / s.ipAdet) : 0,
      }))
      .filter((x) => x.k + x.d >= 8)
      .sort((a, b) => b.k + b.d - (a.k + a.d));

    meta.servers[anahtar] = { ok: ornek > 0, sample: ornek, weapons: liste };
    savaslar.servers[anahtar].metaSample = ornek;
    console.log(`${anahtar}: ${savasOk ? savaslar.servers[anahtar].battles.length + ' savaş' : 'savaş yok'} · ${ornek} kill örneği · ${liste.length} silah`);
  }

  fs.writeFileSync(path.join(CIKTI, 'battles.json'), JSON.stringify(savaslar));
  fs.writeFileSync(path.join(CIKTI, 'meta.json'), JSON.stringify(meta));
  console.log(`yazıldı: data/archive/battles.json (${(fs.statSync(path.join(CIKTI, 'battles.json')).size / 1024).toFixed(0)} kB), meta.json`);
}

main().catch((e) => { console.error('arşiv hatası:', e); process.exit(1); });
