const fs = require('fs');
const path = require('path');

// Albion Online güncel veri deposu (ao-bin-dumps)
const ITEMS_URL = 'https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json';

async function extractData() {
  console.log(`[Extractor] Oyun verileri indiriliyor...`);
  console.log(`[Extractor] Eşya Listesi (Items): ${ITEMS_URL}`);
  
  try {
    const itemsRes = await fetch(ITEMS_URL);
    if (!itemsRes.ok) throw new Error(`HTTP Hatası: ${itemsRes.status} - Items çekilemedi!`);

    console.log('[Extractor] Veriler başarıyla indirildi. Süzme işlemi (JSON Parse) başlatılıyor...');
    const items = await itemsRes.json();
    
    const weights = {};
    const trLocales = {};
    const spellsOutput = {};
    let itemCount = 0;

    items.forEach(item => {
      if (!item.UniqueName) return;

      // 1. Ağırlık (Weight)
      if (item.weight !== undefined && item.weight !== null) {
        weights[item.UniqueName] = Number(item.weight);
      }

      // 2. Orijinal Türkçe İsimler
      if (item.LocalizedNames && item.LocalizedNames['TR-TR']) {
        trLocales[item.UniqueName] = item.LocalizedNames['TR-TR'];
      }
      
      // 3. Silaha Ait Spellerin (Yeteneklerin) Çıkarılması (YENİ SİSTEM)
      // Albion'da silah yetenekleri activecastspelllist veya activespellslots içindedir
      if (item.activecastspelllist && item.activecastspelllist.activecastspell) {
         let spells = item.activecastspelllist.activecastspell;
         if (!Array.isArray(spells)) spells = [spells];
         
         const weaponSpells = spells.map(s => {
             return {
                 slot: s.slot || 'Q/W/E',
                 name: s.UniqueName,
                 cooldown: s.cooldown ? (s.cooldown / 1000) : 0,
                 energy: s.energycost || 0
             };
         });
         
         if (weaponSpells.length > 0) {
             spellsOutput[item.UniqueName] = weaponSpells;
         }
      }
      
      itemCount++;
    });

    console.log(`[Extractor] Analiz edilen toplam eşya sayısı: ${itemCount}`);
    console.log(`[Extractor] Çıkarılan ağırlık verisi adedi: ${Object.keys(weights).length}`);
    console.log(`[Extractor] Çıkarılan Türkçe isim adedi: ${Object.keys(trLocales).length}`);
    console.log(`[Extractor] Çıkarılan Silah Yetenek Kombinasyonu adedi: ${Object.keys(spellsOutput).length}`);

    // Kaydedilecek klasör yollarını belirle
    const dataDir = path.join(__dirname, '../data');
    const localesDir = path.join(__dirname, '../locales');
    
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(localesDir)) fs.mkdirSync(localesDir, { recursive: true });

    // Dosyaları yaz
    fs.writeFileSync(path.join(dataDir, 'items-weight.json'), JSON.stringify(weights, null, 2), 'utf-8');
    fs.writeFileSync(path.join(localesDir, 'tr-official.json'), JSON.stringify(trLocales, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataDir, 'spells-data.json'), JSON.stringify(spellsOutput, null, 2), 'utf-8');

    console.log(`[Extractor] BAŞARILI! Süzülen devasa veri başarıyla kaydedildi!`);
    
  } catch (error) {
    console.error('[Extractor] KRİTİK HATA:', error.message);
    process.exit(1);
  }
}

// Botu çalıştır
extractData();