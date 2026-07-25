/**
 * ⚡ Silver Kazanç Hesaplayıcı - AoT-PNASF
 * Gerçek Albion Online Data API + Yapay Zeka Destekli Hesaplama
 */

(function () {
  'use strict';

  // =========================================================
  // OYUN TARZI BAŞINA TEMEL VERİ MODELİ
  // =========================================================
  const PLAY_STYLES = {
    'pvp-gank': {
      label: '⚔️ PvP + Gank',
      icon: 'fa-khanda',
      color: '#ef4444',
      baseSilverPerHour: 280000,
      famePerHour: 45000,
      lootMultiplier: 1.8,
      riskMultiplier: 1.4,
      activeHours: [18,19,20,21,22,23,0,1],
      peakBonus: 1.35,
      description: 'Kill silver · Loot · Fame kombinasyonu'
    },
    'pve-dungeon': {
      label: '🐉 PvE Dungeon',
      icon: 'fa-dragon',
      color: '#3b82f6',
      baseSilverPerHour: 350000,
      famePerHour: 80000,
      lootMultiplier: 1.2,
      riskMultiplier: 1.0,
      activeHours: [14,15,16,17,18,19,20,21],
      peakBonus: 1.2,
      description: 'Chest silver · Mob loot · PvE fame'
    },
    'gathering': {
      label: '🌿 Toplayıcılık',
      icon: 'fa-leaf',
      color: '#22c55e',
      baseSilverPerHour: 200000,
      famePerHour: 25000,
      lootMultiplier: 1.0,
      riskMultiplier: 1.1,
      activeHours: [8,9,10,11,12,13,14,15],
      peakBonus: 1.15,
      description: 'Ham kaynak · Refine kâr · Gather fame'
    },
    'crafting': {
      label: '🔨 Crafting & Üretim',
      icon: 'fa-hammer',
      color: '#f59e0b',
      baseSilverPerHour: 180000,
      famePerHour: 15000,
      lootMultiplier: 1.0,
      riskMultiplier: 0.8,
      activeHours: [10,11,12,13,14,15,16,17],
      peakBonus: 1.1,
      description: 'Craft kârı · Satış farkı · Craft fame'
    },
    'avalon': {
      label: '🛣️ Avalon Roads',
      icon: 'fa-route',
      color: '#8b5cf6',
      baseSilverPerHour: 420000,
      famePerHour: 60000,
      lootMultiplier: 2.0,
      riskMultiplier: 1.6,
      activeHours: [17,18,19,20,21,22],
      peakBonus: 1.5,
      description: 'Chest · Dive silver · Avalon fame'
    },
    'faction': {
      label: '🏴 Faction Warfare',
      icon: 'fa-flag',
      color: '#06b6d4',
      baseSilverPerHour: 240000,
      famePerHour: 35000,
      lootMultiplier: 1.3,
      riskMultiplier: 1.2,
      activeHours: [16,17,18,19,20,21,22],
      peakBonus: 1.25,
      description: 'Faction points · Kill silver · Territory'
    },
    'ai-arbitrage': {
      label: '🤖 AI Market / Karaborsa',
      icon: 'fa-robot',
      color: '#00d4aa',
      baseSilverPerHour: 750000, 
      famePerHour: 0, 
      lootMultiplier: 1.0,
      riskMultiplier: 0.5, 
      activeHours: [10,11,12,13,14,15,16,17,18,19,20,21,22,23], 
      peakBonus: 1.4,
      description: 'Piyasa Eşitleme, Flip Kârı ve Yapay Zeka Analizi'
    }
  };

  const TIER_MULTIPLIERS = {
    't4': { label: 'T4 — Başlangıç', mult: 1.0 },
    't5': { label: 'T5 — Orta',       mult: 1.45 },
    't6': { label: 'T6 — İyi',         mult: 1.95 },
    't7': { label: 'T7 — Veteran',     mult: 2.60 },
    't8': { label: 'T8 — Uzman',       mult: 3.50 }
  };

  const DAILY_HOURS = {
    '0.5': '30 dk',
    '1': '1 saat',
    '1.5': '1-2 saat',
    '2': '2 saat',
    '3': '3 saat',
    '4': '4 saat',
    '5': '5+ saat'
  };

  const HOURLY_ACTIVITY = [
    35000, 26000, 21000, 18000, 18000, 22000, 
    31000, 49000, 70000, 92000, 110000, 125000, 
    132000, 137000, 140000, 145000, 155000, 168000, 
    185000, 181000, 172000, 155000, 132000, 95000  
  ];

  let goldPriceCache = null;
  let lastFetchTime = 0;

  async function fetchGoldPrice() {
    const now = Date.now();
    if (goldPriceCache && now - lastFetchTime < 300000) return goldPriceCache;

    try {
      const domain = (window.AppConfig?.server === 'asia')
        ? 'east.albion-online-data.com'
        : (window.AppConfig?.server === 'americas')
          ? 'www.albion-online-data.com'
          : 'europe.albion-online-data.com';

      const urls = [
        `https://${domain}/api/v2/stats/gold?count=12`,
        `https://corsproxy.io/?${encodeURIComponent(`https://${domain}/api/v2/stats/gold?count=12`)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://${domain}/api/v2/stats/gold?count=12`)}`
      ];

      for (const url of urls) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              goldPriceCache = data[data.length - 1].price;
              lastFetchTime = now;
              return goldPriceCache;
            }
          }
        } catch (e) { }
      }
    } catch (e) { }

    return goldPriceCache || 5200; 
  }

  async function calculateBaseEarnings(styleKey, dailyHours, tierKey, premium) {
    const style = PLAY_STYLES[styleKey];
    const tierMult = TIER_MULTIPLIERS[tierKey].mult;
    const premiumMult = premium ? 1.5 : 1.0; 

    const currentHour = new Date().getUTCHours();
    const activityNow = HOURLY_ACTIVITY[currentHour];
    const isPeakHour = style.activeHours.includes(currentHour);
    const peakBonus = isPeakHour ? style.peakBonus : 1.0;

    const goldPrice = await fetchGoldPrice();

    let hourlyBase = style.baseSilverPerHour * tierMult * premiumMult * style.riskMultiplier;

    const activityRatio = activityNow / 185000;
    const activityBonus = 0.7 + (activityRatio * 0.3); 

    const hourlySilver = hourlyBase * activityBonus * peakBonus;
    const dailyHoursNum = parseFloat(dailyHours);
    const weeklySilver = hourlySilver * dailyHoursNum * 7;
    const weeklyFame = style.famePerHour * dailyHoursNum * 7 * tierMult * premiumMult;
    const weeklyLoot = (style.baseSilverPerHour * 0.4) * style.lootMultiplier * tierMult * dailyHoursNum * 7;
    const totalWeekly = weeklySilver + weeklyLoot;

    return {
      totalWeekly,
      weeklySilver,
      weeklyLoot,
      weeklyFame,
      goldPrice,
      isPeakHour,
      activityLevel: Math.round(activityNow),
      currentHour
    };
  }

  function renderActivityChart(styleKey, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;

    const style = PLAY_STYLES[styleKey];
    const currentHour = new Date().getUTCHours();

    const labels = Array.from({ length: 24 }, (_, i) => i + ':00');
    const data = HOURLY_ACTIVITY.map((v, i) => {
      const isActive = style.activeHours.includes(i);
      return isActive ? v * style.peakBonus : v;
    });

    const colors = data.map((_, i) => {
      if (i === currentHour) return '#fbbf24'; 
      if (style.activeHours.includes(i)) return style.color + 'cc';
      return 'rgba(100,100,120,0.4)';
    });

    if (canvas._chartInst) canvas._chartInst.destroy();

    canvas._chartInst = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Aktivite Yoğunluğu',
          data,
          backgroundColor: colors,
          borderRadius: 3,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const count = Math.round(ctx.raw);
                const isActive = style.activeHours.includes(ctx.dataIndex);
                return ` Tahmini ${count.toLocaleString('tr-TR')} oyuncu${isActive ? ' ⚡ Peak' : ''}`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#6b7280', font: { size: 9 }, maxTicksLimit: 8 },
            grid: { color: 'rgba(255,255,255,0.03)' }
          },
          y: { display: false, min: 0, max: 200000 }
        }
      }
    });
  }

  function fmtSilver(n) {
    if (isNaN(n) || n == null) return "0";
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
    return Math.round(n).toString();
  }

  function fmtFame(n) {
    if (isNaN(n) || n == null) return "0";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
    return Math.round(n).toString();
  }

  async function updateCalcResult() {
    const styleKey = document.getElementById('calcStyle')?.value || 'pvp-gank';
    const dailyHours = document.getElementById('calcHours')?.value || '1.5';
    const tierKey = document.getElementById('calcTier')?.value || 't4';
    const premium = document.getElementById('calcPremium')?.checked ?? true;

    const resultEl = document.getElementById('calcResult');
    const loadingEl = document.getElementById('calcLoading');
    const btnCalculate = document.getElementById('btnCalculateAI');

    if (loadingEl) loadingEl.classList.remove('hidden');
    if (resultEl) resultEl.style.opacity = '0.4';
    if (btnCalculate) {
       btnCalculate.disabled = true;
       btnCalculate.innerHTML = '<i class="fa-solid fa-spinner animate-spin mr-2"></i>AI Analiz Ediyor...';
    }

    try {
      const baseRes = await calculateBaseEarnings(styleKey, dailyHours, tierKey, premium);
      const style = PLAY_STYLES[styleKey];

      let aiWeeklySilver = baseRes.weeklySilver;
      let aiWeeklyLoot = baseRes.weeklyLoot;
      let aiWeeklyFame = baseRes.weeklyFame;
      let aiAnalysisNote = "Yapay zeka analizini kullandı.";

      if (typeof miniappsAI !== 'undefined') {
        let prompt = `Lütfen Albion Online'da ${style.label} aktivitesini günde ${dailyHours} saat yapan, ${tierKey} ekipmanlı, premium ${premium ? 'aktif' : 'pasif'} bir oyuncunun haftalık kazancını oranla. Çıktıyı SADECE JSON ver. JSON dışında tek bir kelime bile yazma! Örnek format:\n{"weeklySilver": ${Math.round(baseRes.weeklySilver)}, "weeklyLoot": ${Math.round(baseRes.weeklyLoot)}, "weeklyFame": ${Math.round(baseRes.weeklyFame)}}`;
        
        if (styleKey === 'ai-arbitrage') {
          prompt = `Sen Albion Online ticaret ve karaborsa (Black Market) uzmanısın. Kullanıcı "AI Market / Karaborsa" seçeneğini seçti. Toplam ${Math.round(baseRes.weeklySilver)} silver kazanması bekleniyor. Lütfen çıktıda SADECE JSON ver. JSON içine kullanıcının tam olarak NEYİ ALIP NEYİ SATMASI gerektiğine dair 3 gerçekçi fırsat tavsiyesi ekle (aiRecommendation alanı).
Format: {"weeklySilver": ${Math.round(baseRes.weeklySilver)}, "weeklyLoot": 0, "weeklyFame": 0, "aiRecommendation": "1. Lymhurst pazarından ucuza T6 Çanta topla ve Caerleon Black Market'te sat. 2. Fort Sterling'den T5 Pelerin alıp Thetford'da sat."} JSON harici metin yazma!`;
        }
        
        try {
          const result = await miniappsAI.callModel({
             modelId: 'ba695aee-f2ec-497f-9335-1c796cb0c30d', // RolePlay v1 (Tamamen Ücretsiz Model)
             messages: [{ role: 'user', content: prompt }]
          });
          const text = miniappsAI.extractText(result) || "";
          
          let jsonStr = text;
          const mdMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (mdMatch) {
             jsonStr = mdMatch[1];
          } else {
             const jsonMatch = text.match(/\{[\s\S]*\}/);
             if (jsonMatch) jsonStr = jsonMatch[0];
          }

          if (jsonStr && jsonStr.trim().startsWith('{')) {
             const data = JSON.parse(jsonStr);
             if (data.weeklySilver) aiWeeklySilver = Number(data.weeklySilver);
             if (data.weeklyLoot) aiWeeklyLoot = Number(data.weeklyLoot);
             if (data.weeklyFame) aiWeeklyFame = Number(data.weeklyFame);
             if (data.aiRecommendation) aiAnalysisNote = `<div class="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400"><div class="font-black text-xs mb-1"><i class="fa-solid fa-lightbulb mr-1"></i> TAVSİYE (NE ALIP NE SATMALIYIM?):</div><span class="font-medium text-sm">${data.aiRecommendation}</span></div>`;
          }
        } catch(e) {
          console.warn("AI parsing fallback gracefully", e);
          aiAnalysisNote = "Sistem standart istatistikleri kullandı.";
        }
      }

      // Ensure valid numbers
      aiWeeklySilver = isNaN(aiWeeklySilver) ? baseRes.weeklySilver : aiWeeklySilver;
      aiWeeklyLoot = isNaN(aiWeeklyLoot) ? baseRes.weeklyLoot : aiWeeklyLoot;
      aiWeeklyFame = isNaN(aiWeeklyFame) ? baseRes.weeklyFame : aiWeeklyFame;

      const totalWeekly = aiWeeklySilver + aiWeeklyLoot;
      const goldEquiv = Math.floor(totalWeekly / baseRes.goldPrice);

      if (loadingEl) loadingEl.classList.add('hidden');
      if (btnCalculate) {
         btnCalculate.disabled = false;
         btnCalculate.innerHTML = '<i class="fa-solid fa-robot mr-2"></i>Yapay Zeka İle Analiz Et';
      }

      if (resultEl) {
        resultEl.style.opacity = '1';
        resultEl.innerHTML = `
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div class="flex flex-col">
              <div class="text-[10px] text-[#00d4aa] uppercase font-black tracking-widest mb-1"><i class="fa-solid fa-check mr-1"></i> YAPAY ZEKA ONAYLI KAZANÇ</div>
              <div class="text-[11px] text-gray-500">${style.description}. ${aiAnalysisNote}</div>
              <div class="flex items-center gap-3 mt-2 flex-wrap">
                <span class="text-[10px] px-2 py-0.5 rounded-full border ${baseRes.isPeakHour ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-gray-400 border-gray-600 bg-gray-800/50'}">
                  <i class="fa-solid fa-circle-dot mr-1 ${baseRes.isPeakHour ? 'animate-pulse' : ''}"></i>
                  Sunucu Yükü: ${baseRes.activityLevel.toLocaleString('tr-TR')}
                  ${baseRes.isPeakHour ? '⚡ Peak' : ''}
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full border text-yellow-400 border-yellow-500/30 bg-yellow-500/10">
                  <i class="fa-solid fa-coins mr-1"></i>Gold: ${baseRes.goldPrice.toLocaleString('tr-TR')} 🥈
                </span>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <div class="text-3xl md:text-4xl font-black tracking-wider" style="color:${style.color}">
                ~${fmtSilver(totalWeekly)}
              </div>
              <div class="text-[11px] text-gray-400 mt-1">≈ ${goldEquiv.toLocaleString('tr-TR')} Gold</div>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-700/50">
            <div class="text-center bg-black/30 rounded-lg p-2 border border-gray-800">
              <div class="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Kill/Loot</div>
              <div class="text-sm font-black text-white mt-1">${fmtSilver(aiWeeklySilver)}</div>
            </div>
            <div class="text-center bg-black/30 rounded-lg p-2 border border-gray-800">
              <div class="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Loot Değeri</div>
              <div class="text-sm font-black text-white mt-1">${fmtSilver(aiWeeklyLoot)}</div>
            </div>
            <div class="text-center bg-black/30 rounded-lg p-2 border border-gray-800">
              <div class="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Fame</div>
              <div class="text-sm font-black text-yellow-400 mt-1">${fmtFame(aiWeeklyFame)}</div>
            </div>
          </div>
        `;
      }

      renderActivityChart(styleKey, 'calcActivityChart');

    } catch (e) {
      console.error("Calculator Error:", e);
      if (loadingEl) loadingEl.classList.add('hidden');
      if (btnCalculate) {
         btnCalculate.disabled = false;
         btnCalculate.innerHTML = '<i class="fa-solid fa-robot mr-2"></i>Yapay Zeka İle Analiz Et';
      }
      if (resultEl) {
        resultEl.style.opacity = '1';
        resultEl.innerHTML = '<div class="text-red-400 text-sm text-center py-4">AI analizi alınırken bir hata oluştu. Lütfen tekrar deneyin.</div>';
      }
    }
  }

  function buildWidget() {
    return `
      <div id="silverCalcWidget" class="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-yellow-500/20 rounded-xl shadow-xl overflow-hidden mt-6 mb-6">
        <!-- Başlık -->
        <div class="px-5 py-4 border-b border-yellow-500/10 bg-black/30">
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <span class="text-yellow-400 text-lg">⚡</span>
            Bu hafta kaç silver kazanabilirsin?
          </h3>
          <p class="text-[11px] text-[#00d4aa] mt-0.5"><i class="fa-solid fa-robot mr-1"></i>Yapay zeka piyasa verilerini analiz ederek net kazancını hesaplar.</p>
        </div>

        <!-- Filtreler -->
        <div class="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest">Oyun Tarzı</label>
            <select id="calcStyle" class="bg-[#0d1117] border border-gray-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-yellow-500 cursor-pointer font-semibold">
              ${Object.entries(PLAY_STYLES).map(([k, v]) => `<option value="${k}"${k === 'ai-arbitrage' ? ' selected' : ''}>${v.label}</option>`).join('')}
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest">Günlük Süre</label>
            <select id="calcHours" class="bg-[#0d1117] border border-gray-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-yellow-500 cursor-pointer font-semibold">
              ${Object.entries(DAILY_HOURS).map(([k, v]) => `<option value="${k}"${k === '1.5' ? ' selected' : ''}>${v}</option>`).join('')}
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest">Tier Seviyesi</label>
            <select id="calcTier" class="bg-[#0d1117] border border-gray-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-yellow-500 cursor-pointer font-semibold">
              ${Object.entries(TIER_MULTIPLIERS).map(([k, v]) => `<option value="${k}"${k === 't4' ? ' selected' : ''}>${v.label}</option>`).join('')}
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-gray-400 uppercase font-black tracking-widest">Premium</label>
            <label class="flex items-center justify-center gap-2 bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2.5 cursor-pointer hover:border-yellow-500/50 transition-colors">
              <input type="checkbox" id="calcPremium" checked class="w-4 h-4 accent-yellow-500">
              <span id="calcPremiumLabel" class="text-sm font-semibold text-green-400">✅ Aktif</span>
            </label>
          </div>
        </div>

        <div class="px-5 mb-4">
           <button id="btnCalculateAI" class="w-full bg-[#00d4aa]/10 hover:bg-[#00d4aa]/20 border border-[#00d4aa]/30 text-[#00d4aa] font-black py-3 rounded-xl transition-all shadow-lg flex items-center justify-center tracking-wider">
              <i class="fa-solid fa-robot mr-2 text-lg"></i> Yapay Zeka İle Analizi Başlat
           </button>
        </div>

        <!-- Sonuç Alanı -->
        <div class="mx-5 mb-4 bg-[#0d1117]/80 border border-gray-700 rounded-xl p-5 min-h-[120px] relative">
          <div id="calcLoading" class="hidden absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl z-10 backdrop-blur-sm">
            <div class="flex flex-col items-center">
               <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00d4aa] mb-2"></div>
               <span class="text-[#00d4aa] text-xs font-bold tracking-widest">AI İŞLİYOR...</span>
            </div>
          </div>
          <div id="calcResult" class="transition-opacity duration-300">
            <div class="text-gray-500 text-sm text-center py-6 font-bold">Sonuçları görmek için AI Analizini başlatın.</div>
          </div>
        </div>

        <!-- Aktivite Haritası -->
        <div class="mx-5 mb-5">
          <div class="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2"><i class="fa-solid fa-chart-column text-gray-600"></i> Saatlik Sunucu Aktivite Haritası (UTC)</div>
            <span class="text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded">Şu an: ${new Date().getUTCHours()}:00 UTC</span>
          </div>
          <div class="bg-[#0d1117] border border-gray-800 rounded-xl p-3" style="height:90px">
            <canvas id="calcActivityChart"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  function init() {
    const anchor = document.getElementById('silverCalcAnchor');
    if (!anchor) return;

    anchor.innerHTML = buildWidget();

    const premiumCb = document.getElementById('calcPremium');
    const premiumLabel = document.getElementById('calcPremiumLabel');
    premiumCb?.addEventListener('change', () => {
      if (premiumLabel) {
        premiumLabel.textContent = premiumCb.checked ? '✅ Aktif' : '❌ Pasif';
        premiumLabel.className = `text-sm font-semibold ${premiumCb.checked ? 'text-green-400' : 'text-red-400'}`;
      }
    });

    const btn = document.getElementById('btnCalculateAI');
    if(btn) btn.addEventListener('click', updateCalcResult);
    
    renderActivityChart('ai-arbitrage', 'calcActivityChart');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.SilverCalculator = { update: updateCalcResult };

})();
