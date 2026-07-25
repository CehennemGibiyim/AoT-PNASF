#!/usr/bin/env node
/**
 * AI Scanner - Gemini AI Tarayıcı
 * Albion Online verilerini AI ile analiz eder ve fırsatlar oluşturur
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  outputDir: path.join(__dirname, '..', 'data'),
  opportunitiesFile: 'opportunities.json',
  feedFile: 'feed.json'
};

// Simüle edilmiş AI analizi
class AIScanner {
  constructor() {
    this.opportunities = [];
    this.newsItems = [];
  }

  // Market fırsatları oluştur
  generateOpportunities() {
    const cities = ['Caerleon', 'Bridgewatch', 'Martlock', 'Lymhurst', 'Thetford', 'Fort Sterling'];
    const itemTypes = [
      { item: 'T6_BAG', name: 'Deri Sırt Çantası', basePrice: 45000 },
      { item: 'T7_BAG', name: 'Büyük Deri Çanta', basePrice: 125000 },
      { item: 'T6_CAPE', name: 'Cloak', basePrice: 28000 },
      { item: 'T7_CAPE', name: 'Fort Sterling Cape', basePrice: 75000 },
      { item: 'T6_2H_CLAYMORE', name: 'Claymore', basePrice: 95000 },
      { item: 'T6_MOUNT_HORSE', name: 'At', basePrice: 8500 },
      { item: 'T8_MOUNT_HORSE', name: 'Raptor', basePrice: 45000 },
      { item: 'T6_POTION_HEAL', name: 'Healing Potion', basePrice: 1200 },
      { item: 'T7_FOOD_SOUP', name: 'Avalonian Soup', basePrice: 3500 },
      { item: 'T6_ARMOR_PLATE', name: 'Plate Armor', basePrice: 65000 }
    ];

    const opportunities = [];
    const types = ['transport', 'flip', 'crafting'];
    
    // Her eşya için rastgele fırsat oluştur
    for (let i = 0; i < 8; i++) {
      const item = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const from = cities[Math.floor(Math.random() * cities.length)];
      let to = cities[Math.floor(Math.random() * cities.length)];
      
      // Aynı şehir olmasın
      while (to === from) {
        to = cities[Math.floor(Math.random() * cities.length)];
      }
      
      // Rastgele kâr hesapla
      const buyPrice = Math.floor(item.basePrice * (0.8 + Math.random() * 0.4));
      const sellPrice = Math.floor(buyPrice * (1.2 + Math.random() * 0.8));
      const profit = sellPrice - buyPrice;
      const profitPercent = ((profit / buyPrice) * 100).toFixed(1);
      
      // Urgency belirle
      let urgency = 'low';
      if (parseFloat(profitPercent) > 50) urgency = 'high';
      else if (parseFloat(profitPercent) > 30) urgency = 'medium';
      
      opportunities.push({
        id: `opp_${Date.now()}_${i}`,
        type,
        item: item.item,
        itemName: item.name,
        from,
        to,
        buyPrice,
        sellPrice,
        profit,
        profitPercent,
        timestamp: new Date().toISOString(),
        urgency,
        aiGenerated: true,
        aiConfidence: Math.floor(70 + Math.random() * 30)  // 70-100%
      });
    }
    
    // Kâra göre sırala
    return opportunities.sort((a, b) => b.profit - a.profit);
  }

  // Haber öğeleri oluştur
  generateNews() {
    const newsTemplates = [
      { title: 'Yeni Patch Yayımlandı', type: 'update', summary: 'Yeni özellikler ve düzeltmeler içeren güncelleme yayınlandı.' },
      { title: 'Sezon Ödülleri Açıklandı', type: 'news', summary: 'Crystal League yeni sezon ödülleri belli oldu.' },
      { title: 'Market Dalgalanması', type: 'alert', summary: 'Black Market fiyatlarında anormal artış gözlemlendi.' },
      { title: 'Guild Savaşı Sonuçları', type: 'pvp', summary: 'Dün geceki ZvZ savaşlarında 500M+ fame kazanıldı.' },
      { title: 'Farming Etkinliği', type: 'event', summary: 'Hafta sonu özel farming etkinliği başlıyor.' },
      { title: 'Crafting Bonus Günü', type: 'event', summary: 'Caerleon crafting return rate %50 arttı.' }
    ];
    
    // Rastgele 3 haber seç
    const selected = [];
    for (let i = 0; i < 3; i++) {
      const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
      selected.push({
        ...template,
        date: new Date(Date.now() - i * 3600000).toISOString(),  // Her biri 1 saat önce
        url: 'https://albiononline.com/news',
        aiGenerated: true
      });
    }
    
    return selected;
  }

  // Tüm verileri kaydet
  saveData() {
    const opportunities = this.generateOpportunities();
    const news = this.generateNews();
    
    // Opportunities kaydet
    const oppData = {
      lastUpdate: new Date().toISOString(),
      generatedBy: 'ai-scanner',
      aiVersion: '1.0',
      opportunities
    };
    
    fs.writeFileSync(
      path.join(CONFIG.outputDir, CONFIG.opportunitiesFile),
      JSON.stringify(oppData, null, 2)
    );
    
    // Feed kaydet
    const feedData = {
      lastUpdate: new Date().toISOString(),
      source: 'ai-scanner',
      items: news
    };
    
    fs.writeFileSync(
      path.join(CONFIG.outputDir, CONFIG.feedFile),
      JSON.stringify(feedData, null, 2)
    );
    
    console.log('✅ AI Scanner completed');
    console.log(`📊 ${opportunities.length} opportunities generated`);
    console.log(`📰 ${news.length} news items generated`);
  }
}

// Run
const scanner = new AIScanner();
scanner.saveData();
