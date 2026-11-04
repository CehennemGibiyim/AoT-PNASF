#!/usr/bin/env node
// Oyuncu ve lonca fame geçmişi — Albion gameinfo API → data/archive/fame.json
//
// Savaş arşivinde en çok kill fame toplayan oyuncuları ve loncaları izler;
// her gün gameinfo profilinden yaşam boyu fame değerlerini alıp geçmişe ekler.
// Böylece "dün → bugün" fame artışı gerçek veriyle görülebilir.
//
// API dokümansızdır ve ara sıra 502 döner; tarayıcı User-Agent'ı ve tekrar
// deneme vardır. Bir oyuncu/lonca alınamazsa eski geçmişi korunur.
//
// Kullanım: node scripts/archive-fame.mjs

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const SUNUCULAR = {
  us: 'gameinfo.albiononline.com',
  eu: 'gameinfo-ams.albiononline.com',
  asia: 'gameinfo-sgp.albiononline.com',
};
const CIKTI = path.join(process.cwd(), 'data', 'archive');
const DOSYA = path.join(CIKTI, 'fame.json');
const MAX_OYUNCU = 6;
const MAX_LONCA = 4;
const MAX_GUN = 90;
const GUN = new Date().toISOString().slice(0, 10);

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

function oku(dosya) {
  try { return JSON.parse(fs.readFileSync(dosya, 'utf8')); } catch { return null; }
}

const ayniAd = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();

/** Basit eşzamanlılık havuzu (gameinfo'yu boğmadan paralel istek). */
async function havuz(liste, adet, islev) {
  const sonuc = new Array(liste.length);
  let imlec = 0;
  async function isci() {
    while (imlec < liste.length) {
      const i = imlec++;
      sonuc[i] = await islev(liste[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(adet, liste.length) }, isci));
  return sonuc;
}

/** Savaş arşivinden izlenecek adayları çıkarır. */
function adaylar(savasSunucu) {
  const oyuncular = new Map();
  const loncalar = new Map();
  for (const savas of savasSunucu?.battles || []) {
    for (const p of savas.pl || []) {
      const ad = String(p[0] || '').trim();
      if (!ad) continue;
      const kayit = oyuncular.get(ad) || { ad, lonca: '', fame: 0 };
      kayit.fame += Number(p[4]) || 0;
      kayit.lonca = p[1] || kayit.lonca;
      oyuncular.set(ad, kayit);
    }
    for (const g of savas.g || []) {
      const ad = String(g[0] || '').trim();
      if (!ad) continue;
      const kayit = loncalar.get(ad) || { ad, ittifak: '', kill: 0 };
      kayit.kill += Number(g[2]) || 0;
      kayit.ittifak = g[1] || kayit.ittifak;
      loncalar.set(ad, kayit);
    }
  }
  return {
    oyuncular: [...oyuncular.values()].sort((a, b) => b.fame - a.fame),
    loncalar: [...loncalar.values()].sort((a, b) => b.kill - a.kill),
  };
}

/** Yeni ölçümü aynı günün kaydını değiştirerek geçmişe ekler. */
function gecmiseEkle(gecmis, olcum) {
  const liste = (Array.isArray(gecmis) ? gecmis : []).filter((x) => x && x.g !== GUN);
  liste.push({ g: GUN, ...olcum });
  liste.sort((a, b) => String(a.g).localeCompare(String(b.g)));
  return liste.slice(-MAX_GUN);
}

function oyuncuOlcumu(profil) {
  const y = profil?.LifetimeStatistics || {};
  const toplama = Object.values(y.Gathering || {}).reduce((t, g) => t + (Number(g?.Total) || 0), 0);
  return {
    pve: Math.round(Number(y.PvE?.Total) || 0),
    topla: Math.round(toplama),
    uretim: Math.round(Number(y.Crafting?.Total) || 0),
    balik: Math.round(Number(y.FishingFame) || 0),
    ciftlik: Math.round(Number(y.FarmingFame) || 0),
    kill: Math.round(Number(profil?.KillFame) || 0),
    death: Math.round(Number(profil?.DeathFame) || 0),
  };
}

function loncaOlcumu(profil) {
  return {
    kill: Math.round(Number(profil?.killFame ?? profil?.KillFame) || 0),
    death: Math.round(Number(profil?.DeathFame) || 0),
    uye: Math.round(Number(profil?.MemberCount) || 0),
  };
}

async function oyuncuBul(host, ad, lonca) {
  const sonuc = await get(host, `/api/gameinfo/search?q=${encodeURIComponent(ad)}`).catch(() => null);
  const liste = Array.isArray(sonuc?.players) ? sonuc.players : [];
  return liste.find((x) => ayniAd(x.Name, ad) && (!lonca || !x.GuildName || ayniAd(x.GuildName, lonca)))
    || liste.find((x) => ayniAd(x.Name, ad))
    || null;
}

async function loncaBul(host, ad) {
  const sonuc = await get(host, `/api/gameinfo/search?q=${encodeURIComponent(ad)}`).catch(() => null);
  const liste = Array.isArray(sonuc?.guilds) ? sonuc.guilds : [];
  return liste.find((x) => ayniAd(x.Name, ad)) || null;
}

async function main() {
  fs.mkdirSync(CIKTI, { recursive: true });
  const savaslar = oku(path.join(CIKTI, 'battles.json')) || { servers: {} };
  const eski = oku(DOSYA) || { servers: {} };
  const veri = { generatedAt: new Date().toISOString(), source: 'gameinfo /search + /players + /guilds', servers: {} };
  let hata = 0;

  for (const [anahtar, host] of Object.entries(SUNUCULAR)) {
    const savasSunucu = savaslar.servers?.[anahtar];
    const eskiSunucu = eski.servers?.[anahtar] || {};
    const aday = adaylar(savasSunucu);

    // Önce geçmişi olanları koru, sonra arşivin en aktiflerini ekle.
    const oyuncular = [];
    const eklenenOyuncu = new Set();
    for (const kayit of eskiSunucu.oyuncular || []) {
      if (oyuncular.length >= MAX_OYUNCU || !kayit?.ad) continue;
      oyuncular.push({ id: kayit.id || '', ad: kayit.ad, lonca: kayit.lonca || '', gecmis: kayit.gecmis || [] });
      eklenenOyuncu.add(kayit.ad.toLowerCase());
    }
    for (const kayit of aday.oyuncular) {
      if (oyuncular.length >= MAX_OYUNCU) break;
      if (eklenenOyuncu.has(kayit.ad.toLowerCase())) continue;
      oyuncular.push({ id: '', ad: kayit.ad, lonca: kayit.lonca, gecmis: [] });
      eklenenOyuncu.add(kayit.ad.toLowerCase());
    }

    const loncalar = [];
    const eklenenLonca = new Set();
    for (const kayit of eskiSunucu.loncalar || []) {
      if (loncalar.length >= MAX_LONCA || !kayit?.ad) continue;
      loncalar.push({ id: kayit.id || '', ad: kayit.ad, ittifak: kayit.ittifak || '', gecmis: kayit.gecmis || [] });
      eklenenLonca.add(kayit.ad.toLowerCase());
    }
    for (const kayit of aday.loncalar) {
      if (loncalar.length >= MAX_LONCA) break;
      if (eklenenLonca.has(kayit.ad.toLowerCase())) continue;
      loncalar.push({ id: '', ad: kayit.ad, ittifak: kayit.ittifak, gecmis: [] });
      eklenenLonca.add(kayit.ad.toLowerCase());
    }

    const oyuncuCikti = (await havuz(oyuncular, 4, async (kisi) => {
      let id = kisi.id;
      if (!id) {
        const bulunan = await oyuncuBul(host, kisi.ad, kisi.lonca);
        id = bulunan?.Id || '';
      }
      const profil = id ? await get(host, `/api/gameinfo/players/${id}`).catch(() => null) : null;
      if (!profil?.Id) {
        hata++;
        console.log(`  − oyuncu alınamadı: ${kisi.ad}`);
        return kisi.gecmis.length ? { ...kisi, id } : null;
      }
      return {
        id: profil.Id,
        ad: profil.Name || kisi.ad,
        lonca: profil.GuildName || '',
        gecmis: gecmiseEkle(kisi.gecmis, oyuncuOlcumu(profil)),
      };
    })).filter(Boolean);

    const loncaCikti = (await havuz(loncalar, 3, async (k) => {
      let id = k.id;
      if (!id) {
        const bulunan = await loncaBul(host, k.ad);
        id = bulunan?.Id || '';
      }
      const profil = id ? await get(host, `/api/gameinfo/guilds/${id}`).catch(() => null) : null;
      if (!profil?.Id) {
        hata++;
        console.log(`  − lonca alınamadı: ${k.ad}`);
        return k.gecmis.length ? { ...k, id } : null;
      }
      return {
        id: profil.Id,
        ad: profil.Name || k.ad,
        ittifak: profil.AllianceName || '',
        gecmis: gecmiseEkle(k.gecmis, loncaOlcumu(profil)),
      };
    })).filter(Boolean);

    veri.servers[anahtar] = {
      ok: oyuncuCikti.length > 0 || loncaCikti.length > 0,
      oyuncular: oyuncuCikti,
      loncalar: loncaCikti,
    };
    console.log(`${anahtar}: ${oyuncuCikti.length} oyuncu · ${loncaCikti.length} lonca · ${GUN}`);
    fs.writeFileSync(DOSYA, JSON.stringify(veri));
  }

  fs.writeFileSync(DOSYA, JSON.stringify(veri));
  const kb = (fs.statSync(DOSYA).size / 1024).toFixed(0);
  console.log(`yazıldı: data/archive/fame.json (${kb} kB)${hata ? ` · ${hata} kayıt alınamadı` : ''}`);
}

main().catch((e) => { console.error('fame arşivi hatası:', e); process.exit(1); });
