// AoT-PNASF — AI Smart Feed Scanner v2 (Gemini + RSS)
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FEED_PATH = path.join(__dirname, '../src/data/feed.json');
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

// === 1. Temel İşlevler ===
function loadFeed() {
  try { return JSON.parse(fs.readFileSync(FEED_PATH, 'utf8')); }
  catch { return { last_updated: '', bot_version: '2.0.0', updates: [] }; }
}

async function scanRSS() {
  console.log('Steam News API (AppID 761890) üzerinden haberler taranıyor...');
  try {
    const res = await fetch('https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=761890&count=10', {
      headers: { 'User-Agent': 'Mozilla/5.0 AoT-PNASF Bot/2.0' },
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
    const json = await res.json();
    const newsItems = json?.appnews?.newsitems || [];
    const titles = newsItems.map(item => item.title.trim()).filter(Boolean);
    console.log(`Steam API: ${titles.length} başlık bulundu.`);
    return titles;
  } catch (e) {
    console.log(`Steam API Hatası: ${e.message}`);
    return [];
  }
}

async function scanNews() {
  try {
    const res = await fetch('https://albiononline.com/en/news', {
      headers: { 'User-Agent': 'Mozilla/5.0 AoT-PNASF Bot/2.0' },
      signal: AbortSignal.timeout(12000)
    });
    const html = await res.text();
    const titles = [...html.matchAll(/<h[123][^>]*>([^<]{10,100})<\/h[123]>/gi)]
      .map(m => m[1].trim())
      .filter(Boolean)
      .slice(0, 10);
    console.log(`News sayfası: ${titles.length} başlık`);
    return titles;
  } catch (e) {
    console.log(`News hatası: ${e.message}`);
    return [];
  }
}

function getKnownUpdates(existingIds) {
  const known = [
    { type: 'patch', title_tr: 'Radiant Wilds güncellemesi duyuruldu', title_en: 'Radiant Wilds update announced', desc_tr: 'Albion Online\'ın yaklaşan büyük güncellemesi Radiant Wilds Nisan 2026\'da geliyor.', desc_en: 'Albion Online\'s upcoming major update Radiant Wilds arrives April 2026.', date: '2026-03-01' },
    { type: 'zone',  title_tr: 'Realm Divided — Yeni Faction sistemi', title_en: 'Realm Divided — New Faction system', desc_tr: 'Province sistemi ve Fortress Sieges ile faction savaşları tamamen yeniden tasarlandı.', desc_en: 'Faction warfare redesigned with Province system and Fortress Sieges.', date: '2025-12-01' },
    { type: 'item',  title_tr: 'Crystal Weapons eklendi', title_en: 'Crystal Weapons added', desc_tr: 'Yeni Crystal silah kategorisi oyuna eklendi. Özel crafting gereksinimleri mevcut.', desc_en: 'New Crystal weapon category added to the game with special crafting requirements.', date: '2025-10-01' },
    { type: 'guide', title_tr: 'Rogue Frontier — Smuggler güncellemesi', title_en: 'Rogue Frontier — Smuggler update', desc_tr: 'Yeni Smuggler sistemi ve Outlands içeriğiyle Rogue Frontier güncellemesi yayında.', desc_en: 'Rogue Frontier update live with new Smuggler system and Outlands content.', date: '2025-08-01' },
    { type: 'event', title_tr: 'Brecilien — Sis Şehri aktif', title_en: 'Brecilien — Mist City active', desc_tr: 'The Mists biome\'unda yer alan Brecilien şehri tüm sunucularda aktif durumda.', desc_en: 'Brecilien city located in The Mists biome is active on all servers.', date: '2025-06-01' },
  ];
  return known.filter(u => !existingIds.includes(u.title_tr));
}

// === 2. AI Analizi ===
async function analyzeWithGemini(titles, existingTitles) {
  if (!GEMINI_KEY || titles.length === 0) return null;
  const today = new Date().toISOString().split('T')[0];
  const prompt = `Sen Albion Online uzmanı bir AI asistanısın. Bu başlıklardan yeni Albion güncellemelerini bul.

Zaten var olanlar: ${existingTitles.slice(0,5).join(' | ')}
Yeni başlıklar: ${titles.join(' | ')}

SADECE geçerli JSON döndür, markdown kullanma:
{"updates":[{"type":"patch","title_tr":"Türkçe","title_en":"English","desc_tr":"açıklama max 100 karakter","desc_en":"description max 100 chars","date":"${today}"}]}
Yeni yoksa: {"updates":[]}`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 800 }
      }),
      signal: AbortSignal.timeout(25000)
    });
    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = raw.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim(); // Regex gi yapıldı (büyük/küçük harf duyarsız)
    
    if (!clean) return null;
    
    // GÜVENLİK DÜZELTMESİ: JSON Parse hatasını yakala
    try {
      return JSON.parse(clean);
    } catch (parseError) {
      console.log('Gemini JSON Parse Hatası:', clean.substring(0, 50) + '...');
      return null;
    }
    
  } catch (e) {
    console.log('Gemini hatası:', e.message);
    return null;
  }
}

// === 3. Ana Döngü ===
async function main() {
  console.log('🤖 AoT-PNASF Bot v2 -', new Date().toISOString());
  
  // Dosyayı oluşturacak klasörün var olduğundan emin ol (Güvenlik için eklendi)
  fs.mkdirSync(path.dirname(FEED_PATH), { recursive: true });
  
  const feed = loadFeed();
  const existingTitles = feed.updates.map(u => u.title_tr || '');

  // Kaynakları tara
  const [rssTitles, newsTitles] = await Promise.all([scanRSS(), scanNews()]);
  const allTitles = [...new Set([...rssTitles, ...newsTitles])];
  console.log(`Toplam: ${allTitles.length} başlık tespit edildi.`);

  let newUpdates = [];

  // Gemini ile analiz dene
  if (allTitles.length > 0) {
    const analysis = await analyzeWithGemini(allTitles, existingTitles);
    if (analysis?.updates?.length > 0) {
      // Sadece gerçekten yeni olanları filtrele (Gemini bazen var olanı tekrar verebilir)
      newUpdates = analysis.updates.filter(u => !existingTitles.includes(u.title_tr));
      console.log(`Gemini: ${newUpdates.length} yeni güncelleme buldu`);
    }
  }

  // Gemini bulamazsa fallback bilinen güncellemeleri ekle
  if (newUpdates.length === 0) {
    const fallback = getKnownUpdates(existingTitles); // Değişken teke düşürüldü
    if (fallback.length > 0) {
      newUpdates = fallback.slice(0, 3);
      console.log(`Fallback: ${newUpdates.length} güncelleme ekleniyor`);
    }
  }

  if (newUpdates.length === 0) {
    console.log('✅ Yeni eklenecek güncelleme yok.');
    // Sadece tarihi güncelleyip kapat
    feed.last_updated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));
    return;
  }

  // Yeni güncellemeleri listeye ekle
  const stamped = newUpdates.map((u, i) => ({ id: String(Date.now() + i), ...u }));
  feed.updates = [...stamped, ...feed.updates].slice(0, 50); // Maksimum 50 güncelleme tut
  feed.last_updated = new Date().toISOString().split('T')[0];
  
  fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));
  console.log(`✅ ${stamped.length} yeni güncelleme kaydedildi!`);
  stamped.forEach(u => console.log(`  → [${u.type}] ${u.title_tr}`));
}

main().catch(console.error);
