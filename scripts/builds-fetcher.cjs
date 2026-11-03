#!/usr/bin/env node
/**
 * AoT-PNASF — Build Kütüphanesi kazıyıcısı
 *
 * Kaynak: https://albiononlinegrind.com/builds (herkese açık, robots.txt izinli)
 * Sayfalar SSR olarak yayınlanır; tüm build verisi <script id="__NEXT_DATA__">
 * içindeki JSON'da gelir (silah/zırh/ayakkabı/pelerin + Q/W/E/pasif yetenek ID'leri
 * + alternatif eşyalar + kategori + oy sayısı).
 *
 * Kullanım:
 *   node scripts/builds-fetcher.cjs [--pages=15] [--out=data/builds-library.json]
 *
 * Davranış: başarısız olursa mevcut dosyayı ASLA ezmez; çıkış kodu 1 olur.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://albiononlinegrind.com';
const UA = 'AoT-PNASF/1.0 (+https://github.com/CehennemGibiyim/AoT-PNASF)';

const args = process.argv.slice(2);
function arg(name, fallback) {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
}

const MAX_PAGES = Math.max(1, Math.min(60, Number(arg('pages', '15')) || 15));
const OUT = path.resolve(ROOT, arg('out', 'data/builds-library.json'));
const SPELL_OUT = path.resolve(ROOT, arg('spells', 'data/spell-map.json'));
const DELAY_MS = Math.max(0, Number(arg('delay', '800')) || 800);

const SLOTS = ['weapon', 'offhand', 'head', 'chest', 'boots', 'cape', 'food', 'potion'];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function stripTier(id) {
  if (typeof id !== 'string') return '';
  return id.replace(/^T\d+_/, '').replace(/@\d+$/, '');
}

function tierOf(id) {
  const m = typeof id === 'string' ? id.match(/^T(\d+)_/) : null;
  return m ? Number(m[1]) : null;
}

function enchantOf(id) {
  const m = typeof id === 'string' ? id.match(/@(\d+)$/) : null;
  return m ? Number(m[1]) : 0;
}

function normalizeItem(id, skills) {
  if (!id) return null;
  return {
    id,
    base: stripTier(id),
    tier: tierOf(id),
    ench: enchantOf(id),
    skills: Array.isArray(skills) ? skills.filter((s) => typeof s === 'string' && s.trim()) : [],
  };
}

function normalizeBuild(raw) {
  if (!raw || !raw.slug || !raw.weapon_id) return null;
  const alt = {};
  // Alternatif eşyalar: aynı slot için ikinci seçenek (site "alt" alanlarında tutuyor)
  const altPairs = [
    ['head', raw.helmet_id_alt, raw.helmet_alt_skills],
    ['chest', raw.chest_id_alt, raw.chest_alt_skills],
    ['boots', raw.boots_id_alt, raw.boots_alt_skills],
    ['offhand', raw.offhand_id_alt, raw.offhand_alt_skills],
  ];
  for (const [slot, id, skills] of altPairs) {
    const item = normalizeItem(id, skills);
    if (item) alt[slot] = item;
  }
  const alts = {};
  for (const [slot, list] of [['food', raw.food_alt], ['potion', raw.potion_alt]]) {
    if (Array.isArray(list) && list.length) {
      const items = list.map((id) => normalizeItem(id)).filter(Boolean);
      if (items.length) alts[slot] = items;
    }
  }

  const items = {
    weapon: normalizeItem(raw.weapon_id, raw.weapon_skills),
    offhand: normalizeItem(raw.offhand_id, raw.offhand_skills),
    head: normalizeItem(raw.helmet_id, raw.helmet_skills),
    chest: normalizeItem(raw.chest_id, raw.chest_skills),
    boots: normalizeItem(raw.boots_id, raw.boots_skills),
    cape: normalizeItem(raw.cape_id),
    food: normalizeItem(raw.food_id),
    potion: normalizeItem(raw.potion_id),
  };

  return {
    id: raw.id || raw.slug,
    slug: raw.slug,
    title: raw.title || raw.slug,
    weaponName: raw.weapon_name || '',
    category: raw.category || 'OTHER',
    author: raw.author || '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    upvotes: Number(raw.upvote_count) || 0,
    createdAt: raw.created_at || '',
    updatedAt: raw.updated_at || '',
    url: `${BASE}/build/${raw.slug}`,
    source: 'albiononlinegrind.com',
    items,
    alt,
    alts,
    description: typeof raw.description === 'string' ? raw.description.slice(0, 600) : '',
  };
}

async function fetchPage(page) {
  const url = page === 1 ? `${BASE}/builds` : `${BASE}/builds?page=${page}`;
  const res = await fetch(url, {
    headers: { 'user-agent': UA, accept: 'text/html' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const html = await res.text();
  const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) throw new Error(`${url} → __NEXT_DATA__ bulunamadı`);
  const data = JSON.parse(m[1]);
  const pp = data?.props?.pageProps || {};
  return {
    builds: Array.isArray(pp.initialBuilds) ? pp.initialBuilds : [],
    hasMore: Boolean(pp.initialHasMore),
  };
}

async function main() {
  const bySlug = new Map();
  let pagesRead = 0;
  let lastError = null;

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    try {
      const { builds, hasMore } = await fetchPage(page);
      pagesRead += 1;
      for (const raw of builds) {
        const build = normalizeBuild(raw);
        if (build && !bySlug.has(build.slug)) bySlug.set(build.slug, build);
      }
      console.log(`[builds] sayfa ${page}: ${builds.length} build (toplam ${bySlug.size})`);
      if (!hasMore || !builds.length) break;
    } catch (error) {
      lastError = error;
      console.error(`[builds] sayfa ${page} hatası: ${error.message}`);
      if (!bySlug.size) break;
    }
    await sleep(DELAY_MS);
  }

  if (!bySlug.size) {
    console.error('[builds] Hiç build çekilemedi, mevcut dosya korunuyor.');
    process.exit(1);
  }

  const builds = [...bySlug.values()].sort((a, b) => b.upvotes - a.upvotes || a.title.localeCompare(b.title));

  // Kategori özeti
  const categories = {};
  for (const b of builds) categories[b.category] = (categories[b.category] || 0) + 1;

  const payload = {
    fetchedAt: new Date().toISOString(),
    source: 'albiononlinegrind.com',
    sourceUrl: `${BASE}/builds`,
    note: 'Veriler herkese açık build sayfalarındaki SSR JSONundan (__NEXT_DATA__) çekilir; eşya/yetenek ID\'leri doğrulanmıştır.',
    count: builds.length,
    pagesRead,
    categories,
    builds,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 1));

  // Silah bazlı yetenek haritası (Q/W/E/pasif) — build sayısıyla birlikte
  const spellMap = {};
  for (const b of builds) {
    const w = b.items.weapon;
    if (!w || !w.skills.length) continue;
    const entry = spellMap[w.base] || (spellMap[w.base] = { id: w.base, name: b.weaponName, builds: 0, skills: {} });
    entry.builds += 1;
    w.skills.forEach((skill, index) => {
      const slot = ['Q', 'W', 'E', 'P'][index] || 'X';
      const key = `${slot}:${skill}`;
      entry.skills[key] = (entry.skills[key] || 0) + 1;
    });
  }
  const spellPayload = {
    fetchedAt: payload.fetchedAt,
    source: payload.source,
    weapons: Object.values(spellMap)
      .map((w) => ({
        id: w.id,
        name: w.name,
        builds: w.builds,
        skills: Object.entries(w.skills)
          .sort((a, b) => b[1] - a[1])
          .map(([key, count]) => ({ slot: key.split(':')[0], id: key.split(':').slice(1).join(':'), count })),
      }))
      .sort((a, b) => b.builds - a.builds),
  };
  fs.writeFileSync(SPELL_OUT, JSON.stringify(spellPayload, null, 1));

  console.log(`[builds] ${builds.length} build → ${path.relative(ROOT, OUT)}`);
  console.log(`[builds] ${spellPayload.weapons.length} silah yetenek haritası → ${path.relative(ROOT, SPELL_OUT)}`);
  if (lastError) console.warn(`[builds] uyarı: son hata: ${lastError.message}`);
}

main().catch((error) => {
  console.error('[builds] ölümcül hata:', error);
  process.exit(1);
});
