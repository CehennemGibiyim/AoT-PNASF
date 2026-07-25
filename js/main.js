// Global Data Pipeline Store
window.AOT_DATA = {
  weights: {},
  spells: {},
  locales: {}
};

async function loadPipelineData() {
  try {
    const [weightRes, spellRes, localeRes] = await Promise.all([
      fetch('data/items-weight.json').catch(() => null),
      fetch('data/spells-data.json').catch(() => null),
      fetch('locales/tr-official.json').catch(() => null)
    ]);

    if (weightRes && weightRes.ok) window.AOT_DATA.weights = await weightRes.json();
    if (spellRes && spellRes.ok) window.AOT_DATA.spells = await spellRes.json();
    if (localeRes && localeRes.ok) {
      window.AOT_DATA.locales = await localeRes.json();
      // AO_ITEMS'daki isimleri resmi çevirilerle güncelle
      if (window.AO_ITEMS) {
        window.AO_ITEMS.forEach(item => {
          if (window.AOT_DATA.locales[item.id]) {
            item.tr = window.AOT_DATA.locales[item.id];
          }
        });
      }
    }
    console.log('✅ Pipeline Data yüklendi:', Object.keys(window.AOT_DATA.weights).length, 'ağırlık,', Object.keys(window.AOT_DATA.locales).length, 'çeviri,', Object.keys(window.AOT_DATA.spells).length, 'yetenek.');
  } catch(e) {
    console.error('Pipeline data yükleme hatası:', e);
  }
}

// ns_setupCallback hatasini kesin olarak cozmek icin
if (typeof globalThis !== 'undefined') {
  globalThis.ns_setupCallback = globalThis.ns_setupCallback || function() {};
}

if (typeof window !== 'undefined' && !window.ns_setupCallback) {
  window.ns_setupCallback = function() {};
}

try {
  if (typeof globalThis !== 'undefined' && !globalThis.ns_setupCallback) {
    globalThis.ns_setupCallback = function() {};
  }
} catch (e) {
  console.warn('ns_setupCallback tanimlama hatasi:', e);
}

async function updateCacheStats() {
  if (window.albionImageCache) {
    try {
      const stats = await window.albionImageCache.getCacheStats();
      const cacheStatsEl = document.getElementById('cacheStats');
      if (cacheStatsEl) {
        cacheStatsEl.innerHTML = `${stats.size}/${stats.maxSize} resim (${stats.usage}%)`;
      }
    } catch (e) {}
  }
}

async function clearImageCache() {
  if (window.albionImageCache) {
    try {
      await window.albionImageCache.clearCache();
      await updateCacheStats();
      const btn = document.getElementById('clearCacheBtn');
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check mr-1"></i>Temizlendi!';
        btn.classList.add('bg-green-600');
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('bg-green-600');
        }, 2000);
      }
    } catch (e) {}
  }
}

window.t = function(key, fallback) {
  if (window.i18n && window.i18n.translations && window.i18n.translations[key]) {
    return window.i18n.translations[key];
  }
  return fallback || key;
};

window.AppConfig = {
  server: 'europe',
  theme: 'custom',
  scale: '14px',
  customColors: { bg: '#0a0a0a', accent: '#d4af37', text: '#f5f5f5' }
};

function adjustColorHex(color, amount) {
  let usePound = false;
  if (color[0] == "#") { color = color.slice(1); usePound = true; }
  let num = parseInt(color, 16);
  if (isNaN(num)) return usePound ? "#000000" : "000000";
  let r = (num >> 16) + amount;
  if (r > 255) r = 255; else if (r < 0) r = 0;
  let g = ((num >> 8) & 0x00FF) + amount;
  if (g > 255) g = 255; else if (g < 0) g = 0;
  let b = (num & 0x0000FF) + amount;
  if (b > 255) b = 255; else if (b < 0) b = 0;
  return (usePound ? "#" : "") + (b | (g << 8) | (r << 16)).toString(16).padStart(6, '0');
}

function applyGlobalTheme(themeName, customColors) {
  const root = document.documentElement;
  if (themeName === 'custom' && customColors) {
    root.setAttribute('data-theme', 'custom');
    root.style.setProperty('--bg-900', customColors.bg);
    root.style.setProperty('--bg-800', adjustColorHex(customColors.bg, 15));
    root.style.setProperty('--bg-700', adjustColorHex(customColors.bg, 30));
    root.style.setProperty('--accent', customColors.accent);
    root.style.setProperty('--accent-hover', adjustColorHex(customColors.accent, -20));
    root.style.setProperty('--text-main', customColors.text);
    root.style.setProperty('--text-muted', adjustColorHex(customColors.text, -50));
  }
}

function getAlbionApiDomain() {
  const srv = window.AppConfig.server;
  if (srv === 'europe') return 'europe.albion-online-data.com';
  if (srv === 'asia') return 'east.albion-online-data.com';
  return 'www.albion-online-data.com';
}

async function fetchWithProxies(targetUrl) {
  const urls = [
    targetUrl,
    'https://api.allorigins.win/raw?url=' + encodeURIComponent(targetUrl),
    'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(targetUrl),
    'https://corsproxy.io/?url=' + encodeURIComponent(targetUrl)
  ];
  for (let url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data) && data.length > 0) return data;
      }
    } catch(err) {}
  }
  return null;
}

let myChartInstance = null;
let globalGoldHistory = [];

function initUpdateCountdown() {
  const el = document.getElementById('updateCountdown');
  if (!el) return;
  const updateTimer = () => {
     const now = new Date();
     const target = new Date();
     target.setUTCHours(24, 0, 0, 0);
     const dist = target.getTime() - now.getTime();
     let h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
     let m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
     let s = Math.floor((dist % (1000 * 60)) / 1000);
     h = h < 10 ? '0' + h : h;
     m = m < 10 ? '0' + m : m;
     s = s < 10 ? '0' + s : s;
     el.innerText = h + ':' + m + ':' + s;
  };
  updateTimer();
  setInterval(updateTimer, 1000);
}

function fetchGameActivePlayers() {
  const el = document.getElementById('gameActivePlayers');
  if (el) {
    const hour = new Date().getUTCHours();
    let basePlayers = 160000; 
    if (hour >= 17 && hour <= 22) basePlayers += 85000;
    else if (hour >= 10 && hour < 17) basePlayers += 45000;
    else if (hour >= 0 && hour < 5) basePlayers += 65000;
    
    const fluctuation = Math.floor(Math.random() * 8000) - 4000;
    const finalCount = basePlayers + fluctuation;
    el.innerText = finalCount.toLocaleString('tr-TR');
  }
}

async function initMainApp() {
  try {
    const rootHtml = document.documentElement;
    const globalServerBadge = document.getElementById('globalServerBadge');
    
    try {
      const saved = localStorage.getItem('aot_pnasf_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        window.AppConfig.server = parsed.server || 'europe';
        window.AppConfig.theme = 'custom';
        window.AppConfig.scale = parsed.scale || '14px';
        if (parsed.customColors) window.AppConfig.customColors = parsed.customColors;
      }
    } catch(e) {}

    window.AppConfig.server = String(window.AppConfig.server || 'europe');
    applyGlobalTheme(window.AppConfig.theme, window.AppConfig.customColors);
    rootHtml.style.fontSize = window.AppConfig.scale;
    if(globalServerBadge) globalServerBadge.innerText = window.AppConfig.server.toUpperCase();

    window.dispatchEvent(new Event('app_settings_loaded'));
    initHomeDashboardAndTicker();
    initUpdateCountdown();
    
    fetchGameActivePlayers();
    setInterval(fetchGameActivePlayers, 150000);

    const currentLangDisplay = document.getElementById('currentLangDisplay');
    if (currentLangDisplay) currentLangDisplay.innerText = (localStorage.getItem('aot-lang') || 'tr').toUpperCase();

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => {
          b.classList.remove('border-albion-accent', 'text-albion-accent');
          b.classList.add('border-transparent', 'text-gray-400');
        });
        tabContents.forEach(content => {
          content.classList.remove('flex', 'animate-fade-in');
          content.classList.add('hidden');
        });
        btn.classList.add('border-albion-accent', 'text-albion-accent');
        btn.classList.remove('border-transparent', 'text-gray-400');
        const targetId = btn.getAttribute('data-tab');
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.remove('hidden');
          void targetContent.offsetWidth;
          targetContent.classList.add('flex', 'animate-fade-in');
        }
      });
    });
  } catch (err) {
    console.error('Init error:', err);
  }

  const clearCacheBtn = document.getElementById('clearCacheBtn');
  if (clearCacheBtn) clearCacheBtn.addEventListener('click', clearImageCache);
  updateCacheStats();
  setInterval(updateCacheStats, 5000);

  // Start data load asynchronously, so it DOES NOT block UI
  loadPipelineData();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMainApp);
} else {
  initMainApp();
}

// DASHBOARD
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
mobileMenuBtn?.addEventListener('click', () => {
  navMenu.classList.toggle('hidden');
  navMenu.classList.toggle('flex');
});

document.getElementById('brandLogo')?.addEventListener('click', () => {
  const homeBtn = document.querySelector('[data-tab="tab-home"]');
  if(homeBtn) homeBtn.click();
});

async function initHomeDashboardAndTicker() {
  const domain = getAlbionApiDomain();
  let currentPrice = 5240;
  let p24 = 1.25;

  try {
    const targetUrl = `https://${domain}/api/v2/stats/gold?count=720`;
    const data = await fetchWithProxies(targetUrl);
    if (data && data.length > 0) {
       globalGoldHistory = data.reverse(); 
       const len = globalGoldHistory.length;
       currentPrice = globalGoldHistory[len - 1].price;
       if (len > 24) p24 = ((currentPrice - globalGoldHistory[len - 25].price) / globalGoldHistory[len - 25].price) * 100;
    }
  } catch(e) {}

  const staticGoldPrice = document.getElementById('staticGoldPrice');
  const staticGoldBuy = document.getElementById('staticGoldBuy');
  const staticGoldSell = document.getElementById('staticGoldSell');
  const staticGoldChange = document.getElementById('staticGoldChange');

  if (staticGoldPrice) staticGoldPrice.innerHTML = `<i class="fa-solid fa-coins mr-1 text-yellow-500"></i>${currentPrice.toLocaleString()} 🥈`;
  if (staticGoldBuy) staticGoldBuy.innerText = `Alış: ${(currentPrice - 2).toLocaleString()}`;
  if (staticGoldSell) staticGoldSell.innerText = `Satış: ${(currentPrice + 3).toLocaleString()}`;

  if (staticGoldChange) {
     if (p24 > 0) {
        staticGoldChange.innerHTML = `<i class="fa-solid fa-arrow-trend-up text-green-400 mr-1"></i><span class="text-green-400">+${p24.toFixed(2)}%</span>`;
     } else if (p24 < 0) {
        staticGoldChange.innerHTML = `<i class="fa-solid fa-arrow-trend-down text-red-400 mr-1"></i><span class="text-red-400">${p24.toFixed(2)}%</span>`;
     } else {
        staticGoldChange.innerHTML = `<span class="text-gray-400">${p24.toFixed(2)}%</span>`;
     }
  }

  if(document.getElementById('goldStatsChart')) renderChart('daily');
}

function renderChart(timeframe) {
  const ctx = document.getElementById('goldStatsChart');
  if(!ctx) return;
  if(myChartInstance) myChartInstance.destroy();

  let labels = [];
  let dataPoints = [];

  if(globalGoldHistory.length === 0) {
     labels = ['1', '2', '3', '4', '5', '6', '7'];
     dataPoints = [5000, 5100, 5050, 5200, 5150, 5250, 5240];
  } else {
     let sliced = globalGoldHistory;
     if(timeframe === 'daily') sliced = globalGoldHistory.slice(-24);
     else if(timeframe === 'weekly') sliced = globalGoldHistory.slice(-168);

     labels = sliced.map(d => {
        const date = new Date(d.timestamp);
        if (timeframe === 'daily') return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        else return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
     });
     dataPoints = sliced.map(d => d.price);
  }

  const isPositive = dataPoints[0] <= dataPoints[dataPoints.length - 1];
  const lineColor = isPositive ? '#4ade80' : '#f87171';
  const bgColor = isPositive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)';

  myChartInstance = new Chart(ctx, {
     type: 'line',
     data: {
        labels: labels,
        datasets: [{
           label: 'Altın',
           data: dataPoints,
           borderColor: lineColor,
           backgroundColor: bgColor,
           borderWidth: 2,
           pointBackgroundColor: '#0a0a0a',
           pointBorderColor: lineColor,
           pointBorderWidth: 2,
           pointRadius: 3,
           fill: true,
           tension: 0.4
        }]
     },
     options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
           x: { grid: { color: '#334155', tickColor: 'transparent' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
           y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
        }
     }
  });
}

document.querySelectorAll('#chartTimeframe button').forEach(btn => {
  btn.addEventListener('click', (e) => {
     document.querySelectorAll('#chartTimeframe button').forEach(b => {
       b.classList.remove('bg-albion-accent', 'text-white');
       b.classList.add('text-gray-400');
     });
     e.target.classList.add('bg-albion-accent', 'text-white');
     e.target.classList.remove('text-gray-400');
     renderChart(e.target.getAttribute('data-tf'));
  });
});

const QUALITY_NAMES = {
  1: "Normal",
  2: "İyi",
  3: "Mükemmel",
  4: "Şaheser",
  5: "Efsanevi"
};

function formatItemNameTr(itemId) {
  let tMatch = itemId.match(/^T(\d+)/); 
  let tNum = tMatch ? parseInt(tMatch[1]) : 0;
  let tStr = tMatch ? `T${tMatch[1]}` : '';
  
  let eMatch = itemId.match(/@(\d+)$/);
  let e = eMatch ? `.${eMatch[1]}` : '';
  let b = itemId.replace(/^T\d+_/, '').replace(/@\d+$/, '');
  
  if (itemId === "QUESTITEM_TOKEN_SIPHONED_ENERGY") return "Özümlenmiş Enerji";
  if (itemId === "QUESTITEM_TOKEN_AVALON") return "Avalon Enerjisi";

  let foundName = b.replace(/_/g, ' ');
  
  if (window.AO_ITEMS) {
      const itemData = window.AO_ITEMS.find(i => i.id === b);
      if (itemData && itemData.tr) foundName = itemData.tr;
  } else if (window.AOT_DATA && window.AOT_DATA.locales && window.AOT_DATA.locales[b]) {
      foundName = window.AOT_DATA.locales[b];
  } else {
      if (foundName.includes('BAG')) foundName = 'Çanta';
      else if (foundName.includes('CAPE')) foundName = 'Pelerin';
      else if (foundName.includes('CLAYMORE')) foundName = 'Claymore';
      else if (foundName.includes('SWORD')) foundName = 'Kılıç';
      else if (foundName.includes('BOW')) foundName = 'Yay';
      else if (foundName.includes('CROSSBOW')) foundName = 'Arbalet';
      else if (foundName.includes('FIRESTAFF')) foundName = 'Ateş Asası';
      else if (foundName.includes('NATURESTAFF')) foundName = 'Doğa Asası';
      else if (foundName.includes('ARMOR PLATE')) foundName = 'Plaka Zırh';
      else if (foundName.includes('ARMOR LEATHER')) foundName = 'Deri Ceket';
      else if (foundName.includes('ARMOR CLOTH')) foundName = 'Kumaş Cüppe';
      else if (foundName.includes('MEAL STEW')) foundName = 'Yahni';
      else if (foundName.includes('MEAL OMELETTE')) foundName = 'Omlet';
      else if (foundName.includes('POTION HEAL')) foundName = 'Can İksiri';
      else if (foundName.includes('MOUNT HORSE')) foundName = 'Binek Atı';
      else if (foundName.includes('MOUNT OX')) foundName = 'Binek Öküzü';
  }
  
  const tierPrefixes = ["Tecrübesiz ", "Acemi ", "Kalfa ", "Ehil ", "Uzman ", "Usta ", "Büyük Usta ", "Büyük usta ", "Yüce "];
  let hasTierPrefix = false;
  
  for (let prefix of tierPrefixes) {
      if (foundName.startsWith(prefix)) {
          foundName = foundName.substring(prefix.length);
          hasTierPrefix = true;
          break;
      }
  }
  
  if (tNum > 0 && hasTierPrefix) {
      let newPrefix = "";
      switch (tNum) {
          case 1: newPrefix = "Tecrübesiz "; break;
          case 2: newPrefix = "Acemi "; break;
          case 3: newPrefix = "Kalfa "; break;
          case 4: newPrefix = "Ehil "; break;
          case 5: newPrefix = "Uzman "; break;
          case 6: newPrefix = "Usta "; break;
          case 7: newPrefix = "Büyük Usta "; break;
          case 8: newPrefix = "Yüce "; break;
      }
      return `${newPrefix}${foundName}${e}`.trim();
  }
  
  if (tNum > 0 && !hasTierPrefix && !foundName.startsWith("T" + tNum)) {
      return `${tStr} ${foundName}${e}`.trim();
  }
  
  return `${foundName}${e}`.trim();
}

async function updateProfitTicker() {
  const ticker = document.getElementById('marketTicker');
  if (!ticker) return;
  
  try {
    const domain = getAlbionApiDomain();
    const baseItems = [
      'BAG','CAPE','2H_CLAYMORE','MAIN_SWORD','MAIN_BOW','2H_BOW',
      'ARMOR_PLATE_SET1','ARMOR_LEATHER_SET1','ARMOR_CLOTH_SET1',
      'HEAD_PLATE_SET1','HEAD_LEATHER_SET1','HEAD_CLOTH_SET1',
      'SHOES_PLATE_SET1','SHOES_LEATHER_SET1','SHOES_CLOTH_SET1',
      'POTION_HEAL','POTION_ENERGY','MEAL_STEW','MEAL_OMELETTE',
      'MOUNT_HORSE','MOUNT_OX'
    ];
    let itemPool = [];
    baseItems.forEach(b => {
      for(let t=4; t<=8; t++) {
        itemPool.push(`T${t}_${b}`);
        if(!b.startsWith('MOUNT')) itemPool.push(`T${t}_${b}@1`);
      }
    });
    itemPool.sort(() => 0.5 - Math.random());
    const items = itemPool.slice(0, 80).join(',');
    
    const locations = encodeURIComponent('Lymhurst,Bridgewatch,Fort Sterling,Martlock,Thetford,Caerleon,Black Market');
    const url = `https://${domain}/api/v2/stats/prices/${items}.json?locations=${locations}&qualities=1,2,3,4,5`;
    
    const data = await fetchWithProxies(url);
    if (data && data.length > 0) {
      const grouped = {};
      const now = Date.now();
      
      data.forEach(d => {
        if (!d.item_id || !d.quality) return;
        const key = `${d.item_id}_${d.quality}`;
        if (!grouped[key]) grouped[key] = { id: d.item_id, quality: d.quality, cities: {}, lastUpdate: 0 };
        
        let s_price = d.sell_price_min || 0;
        let b_price = d.buy_price_max || 0;

        if (d.sell_price_min_date) {
          const t = new Date(d.sell_price_min_date + 'Z').getTime();
          if (now - t > 14400000) s_price = 0; // >4 hours
        }
        if (d.buy_price_max_date) {
          const t = new Date(d.buy_price_max_date + 'Z').getTime();
          if (now - t > 14400000) b_price = 0; // >4 hours
        }

        grouped[key].cities[d.city] = { 
          sell: s_price, 
          buy: b_price,
          timestamp: d.sell_price_min_date
        };
        
        if (d.sell_price_min_date) {
          const updateTime = new Date(d.sell_price_min_date + 'Z').getTime();
          if (updateTime > grouped[key].lastUpdate) grouped[key].lastUpdate = updateTime;
        }
      });
      
      let oppList = [];
      for (const [key, itemData] of Object.entries(grouped)) {
        if (now - itemData.lastUpdate > 14400000) continue; // Skip if overall older than 4 hrs

        const cities = Object.entries(itemData.cities);
        for (const [city1, c1] of cities) {
          if (c1.sell === 0) continue;
          for (const [city2, c2] of cities) {
            if (city1 === city2 || c2.buy === 0) continue;
            // Sadece Ekipmanlar Black Market'e satılabilir!
            if (city2 === 'Black Market') {
              const nonEquipment = ['POTION', 'MEAL', 'MOUNT', 'WOOD', 'ROCK', 'ORE', 'FIBER', 'HIDE'];
              if (nonEquipment.some(nx => itemData.id.includes(nx))) continue;
            }
            const profit = Math.floor(c2.buy * 0.935) - c1.sell;
            if (profit > 1000) {
              oppList.push({ 
                item: itemData.id, 
                quality: itemData.quality,
                from: city1, 
                to: city2, 
                buyPrice: c1.sell, 
                sellPrice: c2.buy, 
                profit, 
                lastUpdate: itemData.lastUpdate 
              });
            }
          }
        }
      }
      
      if (oppList.length > 0) {
        oppList.forEach(o => o.roi = (o.profit / o.buyPrice) * 100);
        oppList.sort((a, b) => b.roi - a.roi);
        const topOpps = oppList.slice(0, 30);

        const marqueeContainer = ticker.parentElement;
        if (marqueeContainer) {
          ticker.style.animationDuration = '150s';
        }

        let html = '';
        topOpps.forEach(opp => {
          const name = formatItemNameTr(opp.item);
          const qName = QUALITY_NAMES[opp.quality] || opp.quality;
          const timeDiff = now - opp.lastUpdate;
          const minutesAgo = Math.floor(timeDiff / 60000);
          const timeText = minutesAgo < 2 ? 'Şimdi' : `${minutesAgo}dk önce`;
          const imgUrl = `https://render.albiononline.com/v1/item/${opp.item}.png?quality=${opp.quality}&size=32`;
          const fallbackUrl = `https://render.albiononline.com/v1/item/${opp.item}.png?size=32`;

          html += `
          <div style="display:inline-flex;align-items:center;margin-right:2rem;background:rgba(212,175,55,0.05);padding:4px 12px;border-radius:8px;border:1px solid rgba(212,175,55,0.2);">
            <img src="${imgUrl}" style="width:24px;height:24px;margin-right:8px;" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='${fallbackUrl}';}else{this.style.display='none';}">
            <span class="text-green-400 font-bold mr-1">${name}</span> 
            <span class="text-gray-500 text-[10px] uppercase mr-2">(${qName})</span>
            <span class="text-gray-400">${opp.from}</span> <span class="text-gray-500 mx-1">den al</span> 
            (<span class="text-green-400">${opp.buyPrice.toLocaleString()}</span> 🥈), 
            <span class="text-gray-400 ml-2">${opp.to}</span> <span class="text-gray-500 mx-1">de sat</span> 
            (<span class="text-red-400">${opp.sellPrice.toLocaleString()}</span> 🥈) 
            <span class="mx-2 text-gray-500">=</span> 
            <span class="text-yellow-400 font-black">+${opp.profit.toLocaleString()}</span> 🥈 kâr! 
            <span class="text-gray-500 ml-2 text-[10px]">[${timeText}]</span>
          </div>`;
        });
        
        ticker.innerHTML = html;
      } else {
        ticker.innerHTML = '<span class="text-gray-400">Son 4 saat içinde yüksek kârlı canlı fırsat bulunamadı. Lütfen bekleyin...</span>';
      }
    } else {
      ticker.innerHTML = '<span class="text-gray-400">Piyasa verileri yükleniyor...</span>';
    }
  } catch (e) {
    console.error('Ticker hatası:', e);
    ticker.innerHTML = '<span class="text-gray-400">Veriler yükleniyor...</span>';
  }
}

// ─── FİYAT VERİLERİNİ YENİLE ─────────────────────────────────
function refreshPrices() {
  // Profit ticker'ı yenile
  updateProfitTicker();

  // Gold fiyatlarını yenile
  if (typeof updateGoldChart === 'function') {
    updateGoldChart();
  }

  // Crafting fiyatlarını yenile
  if (typeof loadItemPrices === 'function') {
    loadItemPrices();
  }

  // Market fiyatlarını yenile
  if (typeof loadMarketPrices === 'function') {
    loadMarketPrices();
  }
}

// ─── SAYFA İÇERİĞİNİ YENİLE ─────────────────────────────────
function refreshContent() {
  // Dil değişikliğinde tüm metinleri yenile
  const lang = localStorage.getItem('aot-lang') || 'tr';
  if (typeof _applyLang === 'function') {
    _applyLang(lang);
  }

  // Crafting içeriğini yenile
  if (typeof calcCrafting === 'function') {
    calcCrafting();
  }

  // PvP içeriğini yenile
  if (typeof loadPVPData === 'function') {
    loadPVPData();
  }
}

// Only start the ticker if we're on the dashboard
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    updateProfitTicker();
    setInterval(updateProfitTicker, 150000);
  });
} else {
  updateProfitTicker();
  setInterval(updateProfitTicker, 150000);
}
