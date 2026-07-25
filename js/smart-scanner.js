/**
 * AI Smart Feed System - Canlı Fırsatlar ve Otomatik Güncelleme
 * Albion Online Tools - AoT-PNASF
 */

(function() {
  'use strict';

  const CONFIG = {
    updateInterval: 60000,        // 60 saniyede bir kontrol
    opportunitiesInterval: 30000, // 30 saniyede bir fırsatları yenile
    feedCheckInterval: 300000,    // 5 dakikada bir haberleri kontrol et
    maxRetries: 3,
    cacheKey: 'aot_feed_cache',
    opportunitiesKey: 'aot_opportunities_cache',
    lastUpdateKey: 'aot_last_update'
  };

  // Global state
  let opportunities = [];
  let currentOpportunityIndex = 0;
  let isAutoUpdateEnabled = true;

  // ==========================================================
  // AI Smart Feed - Otomatik Güncelleme Sistemi
  // ==========================================================
  
  const AIFeed = {
    async init() {
      console.log('[AI Feed] Initializing...');
      
      // Cache'den yükle
      this.loadFromCache();
      
      // İlk yükleme
      await this.fetchOpportunities();
      await this.fetchNewsFeed();
      
      // Periyodik güncelleme başlat
      this.startAutoUpdate();
      
      // Ticker'ı başlat
      this.startTicker();
      
      console.log('[AI Feed] Ready!');
    },

    // Cache'den veri yükle
    loadFromCache() {
      try {
        const cached = localStorage.getItem(CONFIG.opportunitiesKey);
        if (cached) {
          const data = JSON.parse(cached);
          if (data.opportunities && Array.isArray(data.opportunities)) {
            opportunities = data.opportunities;
            console.log('[AI Feed] Loaded', opportunities.length, 'opportunities from cache');
          }
        }
      } catch (e) {
        console.warn('[AI Feed] Cache load failed:', e);
      }
    },

    // Cache'e kaydet
    saveToCache() {
      try {
        const data = {
          opportunities,
          timestamp: Date.now()
        };
        localStorage.setItem(CONFIG.opportunitiesKey, JSON.stringify(data));
      } catch (e) {
        console.warn('[AI Feed] Cache save failed:', e);
      }
    },

    // Canlı fırsatları çek
    async fetchOpportunities() {
      try {
        // Önce local data/opportunities.json dene
        const response = await fetch('data/opportunities.json?_=' + Date.now(), {
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.opportunities && Array.isArray(data.opportunities)) {
            opportunities = data.opportunities;
            this.saveToCache();
            
            // Son güncelleme zamanını kaydet
            localStorage.setItem(CONFIG.lastUpdateKey, data.lastUpdate || new Date().toISOString());
            
            console.log('[AI Feed] Loaded', opportunities.length, 'opportunities');
            // this.updateTickerDisplay(); // Disabled so it doesn't overwrite main.js real ticker
          }
        }
      } catch (error) {
        console.warn('[AI Feed] Failed to fetch opportunities:', error);
        // Cache'den devam et
      }
    },

    // Haber feed'ini çek
    async fetchNewsFeed() {
      try {
        const response = await fetch('data/feed.json?_=' + Date.now(), {
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.items && Array.isArray(data.items)) {
            // Haberleri AI haber bandında göster (opsiyonel)
            this.renderNewsBanner(data.items);
          }
        }
      } catch (error) {
        console.warn('[AI Feed] Failed to fetch news:', error);
      }
    },

    // PvP feed'ini çek
    async fetchPvPFeed() {
      try {
        const response = await fetch('data/pvp-feed.json?_=' + Date.now(), {
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.topKills && Array.isArray(data.topKills)) {
            // PvP feed'ini ilgili modüle bildir
            window.dispatchEvent(new CustomEvent('pvp-feed-updated', { 
              detail: data 
            }));
          }
        }
      } catch (error) {
        console.warn('[AI Feed] Failed to fetch PvP feed:', error);
      }
    },

    // Haber bandını render et
    renderNewsBanner(items) {
      const banner = document.getElementById('newsBanner');
      if (!banner || !items.length) return;
      
      const latestNews = items.slice(0, 3);
      const html = latestNews.map(item => `
        <span class="inline-flex items-center mx-4">
          <span class="bg-albion-accent/20 text-albion-accent px-2 py-0.5 rounded text-[10px] font-bold mr-2">HABER</span>
          <a href="${item.url}" target="_blank" class="text-gray-300 hover:text-white transition-colors">${item.title}</a>
          <span class="text-gray-500 text-[10px] ml-2">${this.timeAgo(item.date)}</span>
        </span>
      `).join('');
      
      banner.innerHTML = html;
    },

    // Ticker'ı başlat - DISABLED: main.js'teki API tabanlı ticker kullanılıyor
    startTicker() {
      // NOT: main.js'teki updateProfitTicker fonksiyonu aktif ticker olarak kullanılıyor
      // Bu fonksiyon data/opportunities.json yerine gerçek API'den canlı arbitraj verileri çeker
      console.log('[AI Feed] Ticker disabled - using main.js API ticker instead');
    },

    // Ticker görüntüsünü güncelle
    updateTickerDisplay() {
      const ticker = document.getElementById('marketTicker');
      if (!ticker || !opportunities.length) return;

      const opp = opportunities[currentOpportunityIndex];
      
      const typeLabels = {
        transport: { text: 'TRANSPORT', icon: 'fa-truck', color: 'text-blue-400', bg: 'bg-blue-500/20' },
        flip: { text: 'FLIP', icon: 'fa-rotate', color: 'text-purple-400', bg: 'bg-purple-500/20' },
        crafting: { text: 'CRAFT', icon: 'fa-hammer', color: 'text-orange-400', bg: 'bg-orange-500/20' }
      };
      
      const typeInfo = typeLabels[opp.type] || typeLabels.transport;
      
      ticker.innerHTML = `
        <span class="inline-flex items-center">
          <span class="${typeInfo.bg} ${typeInfo.color} border ${typeInfo.color.replace('text', 'border')}/30 px-2 py-0.5 rounded text-[10px] font-black tracking-wider mr-2">
            <i class="fa-solid ${typeInfo.icon} mr-1"></i>${typeInfo.text}
          </span>
          <span class="font-bold text-white">${opp.itemName}</span>
          <span class="text-gray-400 mx-2">→</span>
          <span class="${typeInfo.color}">${opp.from}</span>
          <span class="text-gray-500 mx-1">→</span>
          <span class="${typeInfo.color}">${opp.to}</span>
          <span class="text-green-400 font-bold ml-2">+${opp.profit.toLocaleString()}🥈</span>
          <span class="text-green-400/70 text-[10px] ml-1">(%${opp.profitPercent})</span>
        </span>
      `;
    },

    // Otomatik güncelleme başlat
    startAutoUpdate() {
      // Fırsatları periyodik güncelle
      setInterval(() => {
        if (isAutoUpdateEnabled) {
          this.fetchOpportunities();
        }
      }, CONFIG.opportunitiesInterval);

      // Haberleri periyodik kontrol et
      setInterval(() => {
        if (isAutoUpdateEnabled) {
          this.fetchNewsFeed();
          this.fetchPvPFeed();
        }
      }, CONFIG.feedCheckInterval);

      console.log('[AI Feed] Auto-update enabled');
    },

    // Manuel güncelleme
    async forceUpdate() {
      console.log('[AI Feed] Force update triggered');
      await this.fetchOpportunities();
      await this.fetchNewsFeed();
      await this.fetchPvPFeed();
      
      // Bildirim göster
      this.showNotification('Veriler güncellendi!');
    },

    // Bildirim göster
    showNotification(message) {
      const notif = document.createElement('div');
      notif.className = 'fixed top-4 right-4 bg-albion-accent text-black px-4 py-2 rounded-lg shadow-lg z-50 font-bold animate-fade-in';
      notif.innerHTML = `<i class="fa-solid fa-robot mr-2"></i>${message}`;
      document.body.appendChild(notif);
      
      setTimeout(() => {
        notif.remove();
      }, 3000);
    },

    // Zaman formatla
    timeAgo(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);
      
      if (seconds < 60) return 'şimdi';
      if (seconds < 3600) return `${Math.floor(seconds / 60)}dk önce`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}sa önce`;
      return `${Math.floor(seconds / 86400)}gün önce`;
    }
  };

  // ==========================================================
  // AI Opportunity Detector - Canlı Fırsat Tespiti
  // ==========================================================
  
  const AIOpportunityDetector = {
    async analyzeMarket() {
      // Gerçek zamanlı piyasa analizi yap
      // Bu fonksiyon API'den gelen verileri analiz eder
      
      const domain = window.getAlbionApiDomain?.() || 'albion-online-data.com';
      
      try {
        // Örnek: Tier 6-8 eşyaların fiyatlarını çek
        const items = ['T6_BAG', 'T7_BAG', 'T6_CAPE', 'T7_CAPE', 'T6_2H_CLAYMORE'];
        const cities = ['Caerleon', 'Bridgewatch', 'Martlock', 'Lymhurst', 'Thetford', 'FortSterling'];
        
        // API'den fiyatları çek
        const url = `https://${domain}/api/v2/stats/prices/${items.join(',')}?locations=${cities.join(',')}`;
        
        const response = await fetch(url);
        if (!response.ok) return null;
        
        const data = await response.json();
        
        // Fırsatları analiz et
        const newOpportunities = this.findOpportunities(data);
        
        if (newOpportunities.length > 0) {
          // Yeni fırsatları mevcut listeye ekle
          opportunities = [...newOpportunities, ...opportunities].slice(0, 10);
          AIFeed.saveToCache();
          
          // Yeni fırsat bildirimi
          if (newOpportunities.length > 0) {
            AIFeed.showNotification(`${newOpportunities.length} yeni fırsat bulundu!`);
          }
        }
        
        return newOpportunities;
      } catch (error) {
        console.warn('[AI Detector] Analysis failed:', error);
        return null;
      }
    },

    findOpportunities(priceData) {
      const opportunities = [];
      
      // Eşyaları grupla
      const grouped = {};
      priceData.forEach(item => {
        if (!grouped[item.item_id]) grouped[item.item_id] = [];
        grouped[item.item_id].push(item);
      });
      
      // Her eşya için şehirler arası fiyat farkını analiz et
      for (const [itemId, cities] of Object.entries(grouped)) {
        for (let i = 0; i < cities.length; i++) {
          for (let j = i + 1; j < cities.length; j++) {
            const city1 = cities[i];
            const city2 = cities[j];
            
            if (city1.sell_price_min > 0 && city2.buy_price_max > 0) {
              const profit1 = Math.floor(city2.sell_price_min * 0.935) - city1.buy_price_max;
              const profitPercent1 = (profit1 / city1.buy_price_max) * 100;
              
              if (profit1 > 10000 && profitPercent1 > 20) {
                opportunities.push({
                  id: `opp_${Date.now()}_${opportunities.length}`,
                  type: 'transport',
                  item: itemId,
                  itemName: this.formatItemName(itemId),
                  from: city1.city,
                  to: city2.city,
                  buyPrice: city1.buy_price_max,
                  sellPrice: city2.sell_price_min,
                  profit: profit1,
                  profitPercent: profitPercent1.toFixed(1),
                  timestamp: new Date().toISOString(),
                  urgency: profitPercent1 > 50 ? 'high' : 'medium'
                });
              }
            }
          }
        }
      }
      
      // En kârlı 5 fırsatı döndür
      return opportunities
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 5);
    },

    formatItemName(itemId) {
      return itemId
        .replace(/T[4-8]_/, '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  // ==========================================================
  // Initialization
  // ==========================================================
  
  // DOM yüklenince başlat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AIFeed.init());
  } else {
    AIFeed.init();
  }

  // Global erişim
  window.AIFeed = {
    forceUpdate: () => AIFeed.forceUpdate(),
    getOpportunities: () => opportunities,
    enableAutoUpdate: () => { isAutoUpdateEnabled = true; },
    disableAutoUpdate: () => { isAutoUpdateEnabled = false; },
    analyzeMarket: () => AIOpportunityDetector.analyzeMarket()
  };

  console.log('🤖 AI Smart Feed System loaded');

})();
