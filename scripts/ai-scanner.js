// AoT-PNASF — AI Smart Feed Scanner (Gemini Edition)
// Google Gemini API kullanır — Ücretsiz tier mevcut!
// GitHub Actions tarafından her 6 saatte çalıştırılır.

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FEED_PATH = path.join(__dirname, '../src/data/feed.json');
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

function loadFeed() {
  try { return JSON.parse(fs.readFileSync(FEED_PATH, 'utf8')); }
  catch { return { last_updated: '', bot_version: '1.0.0', updates: [] }; }
}

async function scanAlbionForum() {
  try {
    const res = await fetch('https://forum.albiononline.com/index.php/BoardList/', {
      headers: { 'User-Agent': 'AoT-PNASF Bot/1.0 (Albion fan site scanner)' },
      signal: AbortSignal.timeout(15000)
    });
    const html = await res.text();
    const matches = [...html.matchAll(/href="[^"]*Thread[^"]*"[^>]*>([^<]{10,80})</g)];
    return matches.slice(0, 25).map(m => m[1].trim()).filter(Boolean);
  } catch (e) { console.log('Forum hatası:', e.message); return []; }
}

async function scanAlbionWiki() {
  try {
    const res = await fetch('https://wiki.albiononline.com/wiki/Special:RecentChanges', {
      headers: { 'User-Agent': 'AoT-PNASF Bot/1.0' },
      signal: AbortSignal.timeout(15000)
    });
    const html = await res.text();
    const matches = [...html.matchAll(/title="([^"]{5,60})"/g)];
    return [...new Set(matches.map(m => m[1].trim()))].slice(0, 15);
  } catch (e) { console.log('Wiki hatası:', e.message); return []; }
}

async function analyzeWithGemini(forumPosts, wikiChanges, existingTitles) {
  if (!GEMINI_KEY) { console.log('GEMINI_API_KEY yok.'); return null; }
  const today = new Date().toISOString().split('T')[0];
  const prompt = `Sen Albion Online uzmanı bir AI asistanısın.

Zaten sitede olanlar (tekrar ekleme):
${existingTitles.slice(0, 10).join('\n')}

Forum başlıkları: ${forumPosts.join(' | ')}
Wiki değişiklikleri: ${wikiChanges.join(' | ')}

Yeni Albion güncellemelerini bul. SADECE JSON döndür:
{"updates":[{"type":"patch|item|balance|zone|event|guide","title_tr":"...","title_en":"...","desc_tr":"...","desc_en":"...","date":"${today}"}]}
Yeni bir şey yoksa: {"updates":[]}`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3, maxOutputTokens: 1000 } }),
      signal: AbortSignal.timeout(30000)
    });
    const data = await res.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    text = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
    return JSON.parse(text);
  } catch (e) { console.log('Gemini hatası:', e.message); return null; }
}

async function main() {
  console.log('🤖 AoT-PNASF AI Bot (Gemini) -', new Date().toISOString());
  const feed = loadFeed();
  const existingTitles = feed.updates.map(u => u.title_tr || '');
  const [forumPosts, wikiChanges] = await Promise.all([scanAlbionForum(), scanAlbionWiki()]);
  console.log(`Forum: ${forumPosts.length} | Wiki: ${wikiChanges.length}`);
  const analysis = await analyzeWithGemini(forumPosts, wikiChanges, existingTitles);
  if (!analysis?.updates?.length) {
    console.log('✅ Yeni güncelleme yok.');
    feed.last_updated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));
    return;
  }
  const newUpdates = analysis.updates.map((u, i) => ({ id: String(Date.now() + i), ...u }));
  feed.updates = [...newUpdates, ...feed.updates].slice(0, 50);
  feed.last_updated = new Date().toISOString().split('T')[0];
  fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));
  console.log(`✅ ${newUpdates.length} yeni güncelleme eklendi!`);
}

main().catch(console.error);
