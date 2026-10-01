#!/usr/bin/env node
/**
 * AoT-PNASF verified data scanner.
 * Gerçek piyasa API'si ve resmi Albion haber sayfası kullanılmadan
 * fırsat veya etkinlik uydurmaz.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const ITEMS_FILE = path.join(DATA_DIR, 'items-data.js');
const OPPORTUNITIES_FILE = path.join(DATA_DIR, 'opportunities.json');
const FEED_FILE = path.join(DATA_DIR, 'feed.json');
const PRICE_API = 'https://europe.albion-online-data.com/api/v2/stats/prices';
const NEWS_URL = 'https://albiononline.com/news';
const LOCATIONS = ['Caerleon', 'Bridgewatch', 'Martlock', 'Lymhurst', 'Thetford', 'Fort Sterling'];
const REQUEST_TIMEOUT = 25000;

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (_) { return fallback; }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function loadItems() {
  try {
    const source = fs.readFileSync(ITEMS_FILE, 'utf8');
    const match = source.match(/window\.AO_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
    if (!match) return [];
    const items = JSON.parse(match[1]);
    const preferred = [
      'T6_2H_CLAYMORE', 'T7_2H_CLAYMORE', 'T8_2H_CLAYMORE',
      'T6_BAG', 'T7_BAG', 'T8_BAG',
      'T6_CAPE', 'T7_CAPE', 'T8_CAPE',
      'T6_POTION_HEAL', 'T7_POTION_HEAL', 'T8_POTION_HEAL',
      'T6_ARMOR_PLATE', 'T7_ARMOR_PLATE', 'T8_ARMOR_PLATE',
      'T6_MOUNT_HORSE', 'T7_MOUNT_HORSE', 'T8_MOUNT_HORSE'
    ];
    const ids = new Set(items.flatMap(item => (item.tiers || []).map(tier => `T${tier}_${item.id}`)));
    const selected = preferred.filter(id => ids.has(id));
    if (selected.length) return selected;
    return items
      .filter(item => item.tiers?.length && ['weapon', 'sword', 'armor', 'bag', 'cape', 'potion', 'food', 'mount'].includes(item.cat))
      .slice(0, 40)
      .flatMap(item => [`T${item.tiers[Math.min(2, item.tiers.length - 1)]}_${item.id}`]);
  } catch (error) {
    console.warn('[Scanner] Eşya verisi okunamadı:', error.message);
    return [];
  }
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'AoT-PNASF/verified-scanner', Accept: 'application/json,text/html' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchPrices(itemIds) {
  if (!itemIds.length) return [];
  const url = `${PRICE_API}/${itemIds.join(',')}.json?locations=${encodeURIComponent(LOCATIONS.join(','))}&qualities=1`;
  const text = await fetchText(url);
  const data = JSON.parse(text);
  return Array.isArray(data) ? data : [];
}

function buildOpportunities(rows) {
  const grouped = new Map();
  for (const row of rows) {
    const sell = Number(row.sell_price_min || 0);
    const buy = Number(row.buy_price_max || 0);
    if (!row.item_id || !row.city || sell <= 0 || buy <= 0) continue;
    const current = grouped.get(row.item_id) || { buys: [], sells: [] };
    current.sells.push({ city: row.city, price: sell, at: row.sell_price_min_date || row.timestamp });
    current.buys.push({ city: row.city, price: buy, at: row.buy_price_max_date || row.timestamp });
    grouped.set(row.item_id, current);
  }

  const results = [];
  for (const [item, values] of grouped) {
    const cheapest = values.sells.sort((a, b) => a.price - b.price)[0];
    const highest = values.buys.sort((a, b) => b.price - a.price)[0];
    if (!cheapest || !highest || cheapest.city === highest.city) continue;
    const gross = highest.price - cheapest.price;
    const profit = Math.floor(gross * 0.92);
    if (profit < 500) continue;
    results.push({
      id: `market_${item}_${cheapest.city}_${highest.city}`,
      type: 'flip',
      item,
      itemName: item,
      from: cheapest.city,
      to: highest.city,
      buyPrice: Math.round(cheapest.price),
      sellPrice: Math.round(highest.price),
      profit,
      profitPercent: ((profit / cheapest.price) * 100).toFixed(1),
      timestamp: new Date().toISOString(),
      source: 'albion-online-data.com',
      verified: true
    });
  }
  return results.sort((a, b) => b.profit - a.profit).slice(0, 20);
}

function stripHtml(value) {
  return value.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
}

async function fetchOfficialNews() {
  const html = await fetchText(NEWS_URL);
  const seen = new Set();
  const items = [];
  const pattern = /<a[^>]+href=["'](\/news\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(html)) && items.length < 8) {
    const title = stripHtml(match[2]);
    const url = new URL(match[1], NEWS_URL).toString();
    if (title.length < 8 || seen.has(url) || /read more|devamını oku/i.test(title)) continue;
    seen.add(url);
    items.push({ title, type: 'official-news', summary: 'Albion Online resmi haber kaynağı', date: new Date().toISOString(), url, verified: true });
  }
  return items;
}

async function main() {
  console.log('[Scanner] Doğrulanmış veri taraması:', new Date().toISOString());
  const itemIds = loadItems();
  try {
    const rows = await fetchPrices(itemIds);
    const opportunities = buildOpportunities(rows);
    if (opportunities.length) {
      writeJson(OPPORTUNITIES_FILE, { lastUpdate: new Date().toISOString(), generatedBy: 'market-api', source: PRICE_API, opportunities });
      console.log(`[Scanner] ${opportunities.length} gerçek piyasa fırsatı kaydedildi.`);
    } else {
      console.warn('[Scanner] Geçerli fiyat bulunamadı; eski fırsat verisi korunuyor.');
    }
  } catch (error) {
    console.warn('[Scanner] Piyasa verisi alınamadı; eski fırsat verisi korunuyor:', error.message);
  }

  try {
    const news = await fetchOfficialNews();
    if (news.length) {
      writeJson(FEED_FILE, { lastUpdate: new Date().toISOString(), source: NEWS_URL, items: news });
      console.log(`[Scanner] ${news.length} resmi haber kaydedildi.`);
    } else {
      console.warn('[Scanner] Resmi haber başlığı bulunamadı; mevcut feed korunuyor.');
    }
  } catch (error) {
    console.warn('[Scanner] Resmi haber alınamadı; mevcut feed korunuyor:', error.message);
  }
}

main().catch(error => {
  console.error('[Scanner] Beklenmeyen hata:', error.message);
  process.exitCode = 1;
});
