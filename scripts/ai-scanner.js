// AoT-PNASF — AI Smart Feed Scanner
// Bu script GitHub Actions tarafından her 6 saatte çalıştırılır.
// Albion Online Forum, Wiki ve GameInfo API'yi tarar.
// Değişiklik bulursa Claude API ile analiz eder ve feed.json'u günceller.

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FEED_PATH = path.join(__dirname, '../src/data/feed.json');
const API_KEY = process.env.ANTHROPIC_API_KEY;

// ─── Kaynaklar ───────────────────────────────────────────────
const SOURCES = [
  {
    name: 'Albion Forum - Patch Notes',
    url: 'https://forum.albiononline.com/index.php/BoardList/',
    type: 'forum'
  },
  {
    name: 'Albion GameInfo API - Item Categories',
    url: 'https://gameinfo.albiononline.com/api/gameinfo/items/_itemCategoryTree',
    type: 'api'
  }
];

// ─── Mevcut feed'i oku ───────────────────────────────────────
function loadFeed() {
  try {
    return JSON.parse(fs.readFileSync(FEED_PATH, 'utf8'));
  } catch {
    return { last_updated: '', bot_version: '1.0.0', updates: [] };
  }
}

// ─── Forum tarama ────────────────────────────────────────────
async function scanForum() {
  try {
    const res = await fetch('https://forum.albiononline.com/index.php/BoardList/', {
      headers: { 'User-Agent': 'AoT-PNASF Bot/1.0 (Albion fan site)' },
      timeout: 15000
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const posts = [];
    $('a[href*="Thread"]').each((i, el) => {
      const title = $(el).text().trim();
      const href = $(el).attr('href');
      if (title && title.length > 5 && i < 20) {
        posts.push({ title, href });
      }
    });
    return posts;
  } catch (e) {
    console.log('Forum tarama hatası:', e.message);
    return [];
  }
}

// ─── Claude API ile analiz ───────────────────────────────────
async function analyzeWithClaude(content, existingTitles) {
  if (!API_KEY) {
    console.log('ANTHROPIC_API_KEY bulunamadı, analiz atlanıyor.');
    return null;
  }

  const prompt = `Sen Albion Online uzmanı bir AI asistanısın. Aşağıdaki forum başlıklarını analiz et.

Mevcut feed'de zaten olan başlıklar:
${existingTitles.join('\n')}

Yeni tarama sonuçları:
${JSON.stringify(content, null, 2)}

Gerçekten YENİ ve önemli olan güncellemeleri bul (patch, yeni item, balance değişikliği, yeni zone/event).
Her güncelleme için JSON formatında yanıt ver:
{
  "updates": [
    {
      "type": "patch|item|balance|zone|event|guide",
      "title_tr": "Türkçe başlık",
      "title_en": "English title",
      "desc_tr": "Kısa Türkçe açıklama (max 120 karakter)",
      "desc_en": "Short English description (max 120 chars)",
      "date": "YYYY-MM-DD"
    }
  ]
}

Eğer gerçekten yeni bir şey yoksa updates dizisini boş bırak: {"updates": []}
SADECE JSON yanıt ver, başka hiçbir şey yazma.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    const text = data.content[0].text.trim();
    return JSON.parse(text);
  } catch (e) {
    console.log('Claude API hatası:', e.message);
    return null;
  }
}

// ─── Ana akış ────────────────────────────────────────────────
async function main() {
  console.log('🤖 AoT-PNASF AI Bot başlıyor...');
  console.log(`📅 Tarih: ${new Date().toISOString()}`);

  const feed = loadFeed();
  const existingTitles = feed.updates.map(u => u.title_tr || u.title || '');

  // Forum tara
  console.log('📋 Albion Forum taranıyor...');
  const forumPosts = await scanForum();
  console.log(`  ${forumPosts.length} başlık bulundu.`);

  if (forumPosts.length === 0) {
    console.log('✅ Taranacak içerik yok, bot tamamlandı.');
    return;
  }

  // Claude ile analiz et
  console.log('🧠 Claude API ile analiz ediliyor...');
  const analysis = await analyzeWithClaude(forumPosts, existingTitles);

  if (!analysis || !analysis.updates || analysis.updates.length === 0) {
    console.log('✅ Yeni güncelleme bulunamadı.');
    // Sadece last_updated güncelle
    feed.last_updated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));
    return;
  }

  // Yeni güncellemeleri başa ekle
  const newUpdates = analysis.updates.map((u, i) => ({
    id: String(Date.now() + i),
    ...u
  }));

  feed.updates = [...newUpdates, ...feed.updates].slice(0, 50); // max 50 kayıt
  feed.last_updated = new Date().toISOString().split('T')[0];

  fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));
  console.log(`✅ ${newUpdates.length} yeni güncelleme eklendi!`);
  newUpdates.forEach(u => console.log(`  → [${u.type}] ${u.title_tr}`));
}

main().catch(console.error);
