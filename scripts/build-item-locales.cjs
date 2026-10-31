#!/usr/bin/env node
/**
 * AoT-PNASF — Çoklu dil eşya adı paketi üreticisi.
 *
 * Kaynak: ao-bin-dumps (oyun dosyalarından dump) → formatted/items.json
 *   https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json
 *
 * Çıktı: locales/items-<kod>.json  → { "<item id>": "<yerelleştirilmiş ad>", ... }
 *
 * Kullanım:
 *   node scripts/build-item-locales.cjs           # paketleri üret
 *   node scripts/build-item-locales.cjs --force   # indirip yeniden üret
 */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const LOCALES_DIR = path.join(ROOT, 'locales');
const CACHE_DIR = path.join(ROOT, '.cache');
const DUMP_FILE = path.join(CACHE_DIR, 'ao-items-dump.json');
const DUMP_URL = 'https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json';

// Site dil kodu → oyundaki resmi yerelleştirme anahtarı
const LANG_MAP = {
  en: 'EN-US',
  ru: 'RU-RU',
  de: 'DE-DE',
  fr: 'FR-FR',
  pl: 'PL-PL',
  pt: 'PT-BR',
  es: 'ES-ES',
  kr: 'KO-KR',
  it: 'IT-IT',
  ja: 'JA-JP',
  zh: 'ZH-CN',
  id: 'ID-ID',
  ar: 'AR-SA'
};

// Base isim için tercih edilen tier (Türkçe veride T4 adı kullanılıyor)
const PREFERRED_TIERS = [4, 3, 5, 2, 6, 1, 7, 8];

function log(message) {
  process.stdout.write(`${message}\n`);
}

function fail(message) {
  process.stderr.write(`HATA: ${message}\n`);
  process.exit(1);
}

function download(url, destination) {
  return new Promise((resolve, reject) => {
    const request = (currentUrl, redirects = 0) => {
      if (redirects > 5) return reject(new Error('Aşırı yönlendirme'));
      https
        .get(currentUrl, { headers: { 'User-Agent': 'AoT-PNASF-build' } }, (response) => {
          if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            response.resume();
            return request(response.headers.location, redirects + 1);
          }
          if (response.statusCode !== 200) {
            response.resume();
            return reject(new Error(`HTTP ${response.statusCode}`));
          }
          const file = fs.createWriteStream(destination);
          response.pipe(file);
          file.on('finish', () => file.close(resolve));
          file.on('error', reject);
        })
        .on('error', reject);
    };
    request(url);
  });
}

function readItems() {
  const source = fs.readFileSync(path.join(DATA_DIR, 'items-data.js'), 'utf8');
  const match = source.match(/window\.AO_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) fail('data/items-data.js içinde window.AO_ITEMS bulunamadı');
  const items = JSON.parse(match[1]);
  if (!Array.isArray(items) || !items.length) fail('AO_ITEMS boş');
  return items;
}

function parseId(uniqueName) {
  const match = /^T(\d+)_(.+?)(@\d+)?$/.exec(uniqueName || '');
  if (!match) return null;
  return { tier: Number(match[1]), base: match[2], enchant: match[3] || '' };
}

async function loadDump(force) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  if (force || !fs.existsSync(DUMP_FILE)) {
    log(`İndiriliyor: ${DUMP_URL}`);
    await download(DUMP_URL, DUMP_FILE);
    log(`İndirildi: ${(fs.statSync(DUMP_FILE).size / 1024 / 1024).toFixed(1)} MB`);
  } else {
    log(`Önbellek kullanılıyor: ${path.relative(ROOT, DUMP_FILE)}`);
  }
  return JSON.parse(fs.readFileSync(DUMP_FILE, 'utf8'));
}

function main() {
  const force = process.argv.includes('--force');
  const items = readItems();
  const bases = new Set(items.map((item) => item.id));

  return loadDump(force).then((dump) => {
    // 1) Dump'ı base id'ye göre grupla (enchantsız kayıtlar)
    const byBase = new Map();
    const exact = new Map();
    for (const entry of dump) {
      const uniqueName = entry.UniqueName;
      const localized = entry.LocalizedNames;
      if (!uniqueName || !localized) continue;
      exact.set(uniqueName, localized);
      const parsed = parseId(uniqueName);
      if (!parsed || parsed.enchant) continue;
      if (!bases.has(parsed.base)) continue;
      if (!byBase.has(parsed.base)) byBase.set(parsed.base, new Map());
      byBase.get(parsed.base).set(parsed.tier, localized);
    }

    // 2) Her dil için ad haritası üret
    const counts = {};
    const languages = Object.keys(LANG_MAP);

    for (const [langCode, localeKey] of Object.entries(LANG_MAP)) {
      const names = {};

      // a) Tier'lı tam id'ler (T6_BAG gibi) — tam eşya adı
      for (const [uniqueName, localized] of exact) {
        const parsed = parseId(uniqueName);
        if (!parsed || parsed.enchant) continue;
        if (!bases.has(parsed.base)) continue;
        const name = localized[localeKey];
        if (name) names[uniqueName] = name;
      }

      // b) Base id'ler (BAG gibi) — liste görünümü için
      for (const itemId of bases) {
        let localized = exact.get(itemId);
        if (!localized) {
          const tiers = byBase.get(itemId);
          if (tiers) {
            const available = [...tiers.keys()].sort(
              (a, b) => PREFERRED_TIERS.indexOf(a) - PREFERRED_TIERS.indexOf(b)
            );
            for (const tier of available) {
              const candidate = tiers.get(tier);
              if (candidate && candidate[localeKey]) {
                localized = candidate;
                break;
              }
            }
          }
        }
        const name = localized && localized[localeKey];
        if (name) names[itemId] = name;
      }

      counts[langCode] = Object.keys(names).length;
      const file = path.join(LOCALES_DIR, `items-${langCode}.json`);
      fs.writeFileSync(file, JSON.stringify(names), 'utf8');
      const size = (fs.statSync(file).size / 1024).toFixed(0);
      log(`locales/items-${langCode}.json → ${counts[langCode]} kayıt, ${size} KB (${localeKey})`);
    }

    // 3) Manifest
    const manifest = {
      version: 1,
      source: DUMP_URL,
      generatedAt: new Date().toISOString(),
      itemCount: items.length,
      languages: Object.entries(LANG_MAP).map(([code, locale]) => ({
        code,
        locale,
        file: `items-${code}.json`,
        count: counts[code]
      }))
    };
    fs.writeFileSync(
      path.join(LOCALES_DIR, 'items-locales-manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
      'utf8'
    );
    log(`locales/items-locales-manifest.json yazıldı (${languages.length} dil)`);
  });
}

main().catch((error) => fail(error.stack || error.message));
