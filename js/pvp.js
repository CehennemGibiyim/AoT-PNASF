document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('pvpApp');
  if (!container) return;

  const serverAPIs = {
    europe: "https://gameinfo-ams.albiononline.com/api/gameinfo",
    americas: "https://gameinfo.albiononline.com/api/gameinfo",
    asia: "https://gameinfo-sgp.albiononline.com/api/gameinfo"
  };

  container.innerHTML = `
    <div class="bg-albion-800 border border-gray-700 p-4 md:p-6 rounded-xl shadow-lg transition-colors">
      <form id="pvpSearchForm" class="flex flex-col md:flex-row gap-4 mb-6 bg-albion-900 p-4 rounded-xl border border-gray-600 transition-colors">
        
        <!-- Global Server Display Badge -->
        <div class="flex items-center space-x-2 bg-albion-800 p-2.5 rounded border border-gray-700 mb-4 md:mb-0 md:mr-4 shrink-0 text-sm shadow-inner transition-colors">
           <i class="fa-solid fa-server text-albion-accent"></i>
           <span class="text-gray-400 font-medium" >${window.t('events-server', 'Sunucu:')}</span>
           <span id="globalServerBadge" class="font-bold text-white uppercase tracking-wider">Europe</span>
        </div>

        <div class="flex-1 flex flex-col justify-end">
           <input type="text" id="playerName" placeholder="Oyuncu Adı (Örn: S1mple)" required class="w-full bg-albion-800 border border-gray-500 rounded p-2.5 text-white focus:ring-2 focus:ring-albion-accent outline-none placeholder-gray-500 transition-colors">
        </div>
        <div class="flex flex-col justify-end">
          <button type="submit" class="bg-albion-accent hover:bg-albion-accent_hover text-white font-bold py-2.5 px-6 rounded transition-colors flex items-center justify-center shadow-lg">
            <i class="fa-solid fa-magnifying-glass mr-2"></i> <span >${window.t('pvp-searchBtn', 'Ara')}</span>
          </button>
        </div>
      </form>

      <div id="pvpLoading" class="hidden flex-col items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-albion-accent mb-4"></div>
        <p id="pvpLoadingText" class="text-albion-accent font-bold mb-1" >${window.t('pvp-loading', 'Oyuncu Aranıyor...')}</p>
        <p class="text-gray-400 text-sm text-center max-w-md" >${window.t('pvp-loadingDesc', 'Eşyalar, yetenekler ve killboard geçmişi analiz ediliyor...')}</p>
      </div>

      <div id="pvpError" class="hidden bg-red-900/50 border border-red-500 p-4 rounded-lg text-red-200 mb-6 font-semibold flex items-center"></div>

      <div id="pvpResult" class="hidden space-y-6 animate-fade-in">
        
        <!-- Üst Başlık -->
        <div class="bg-albion-900 border border-gray-700 rounded-lg p-5 flex flex-col md:flex-row justify-between items-center shadow-md transition-colors relative overflow-hidden">
          <div class="absolute right-0 top-0 w-32 h-32 bg-albion-accent/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <div class="flex items-center mb-4 md:mb-0 relative z-10">
             <div id="pvpAvatar" class="w-16 h-16 bg-[#151a23] border-2 border-albion-accent rounded-full flex items-center justify-center text-3xl mr-4 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
               <i class="fa-solid fa-user-ninja text-gray-500"></i>
             </div>
             <div>
               <div id="pvpFullName" class="text-2xl md:text-3xl font-black text-white tracking-wide">Oyuncu Adı</div>
               <div class="text-sm text-gray-400 mt-1 flex items-center">
                 <i class="fa-solid fa-shield-halved text-albion-accent mr-1.5"></i> <span id="pvpGuild" class="text-white font-semibold mr-3">Yok</span> 
                 <i class="fa-solid fa-flag text-blue-400 mr-1.5 border-l border-gray-600 pl-3"></i> <span id="pvpAlliance" class="text-white font-semibold">Yok</span>
               </div>
             </div>
          </div>
          
          <div class="flex items-stretch gap-3 relative z-10">
             <button id="btnAiProfile" class="flex flex-col justify-center items-center bg-gradient-to-br from-blue-900/40 to-purple-900/40 hover:from-blue-800/60 hover:to-purple-800/60 border border-purple-500/50 hover:border-purple-400 rounded-lg p-3 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] group cursor-pointer">
                <span class="text-[10px] text-purple-300 uppercase font-black tracking-widest mb-1 group-hover:text-white transition-colors flex items-center"><i class="fa-solid fa-brain mr-1.5 animate-pulse"></i> AI Profil Analizi</span>
                <span class="text-xs text-purple-400 font-medium group-hover:text-purple-200">Karakterini İncele</span>
             </button>
             
             <div class="text-right bg-black/40 p-3 rounded-lg border border-gray-700 flex flex-col justify-center">
                <div class="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1" >${window.t('pvp-kdRatio', 'K/D Oranı')}</div>
                <div id="pvpKdRatio" class="text-3xl md:text-4xl font-black text-albion-accent drop-shadow-md leading-none">0.0</div>
             </div>
          </div>
        </div>

        <!-- AI Analiz Sonuç Kutusu (Varsayılan Gizli) -->
        <div id="aiAnalysisBox" class="hidden bg-gradient-to-r from-[#0d0a14] to-[#120b1f] border border-purple-500/30 rounded-xl p-5 shadow-[0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden animate-fade-in">
           <div class="absolute -right-10 -top-10 text-purple-500/10 text-9xl pointer-events-none"><i class="fa-solid fa-fingerprint"></i></div>
           <h4 class="text-purple-400 font-black mb-3 flex items-center text-lg"><i class="fa-solid fa-robot mr-2"></i> Yapay Zeka Davranış Analizi</h4>
           <div id="aiAnalysisContent" class="text-gray-300 text-sm md:text-base leading-relaxed relative z-10 italic border-l-4 border-purple-500 pl-4 bg-purple-900/10 py-3 pr-3 rounded-r-lg">
             <!-- İçerik buraya gelecek -->
           </div>
        </div>

        <div class="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          
          <!-- Sol Kolon: Fame ve Son Set -->
          <div class="2xl:col-span-1 flex flex-col gap-6 lg:flex-row 2xl:flex-col">
             <!-- Toplam Fame Tablosu -->
             <div class="bg-albion-900 border border-gray-700 rounded-xl p-5 shadow-lg w-full lg:w-1/2 2xl:w-full transition-colors">
               <h4 class="text-albion-accent font-bold mb-4 uppercase text-sm border-b border-gray-700 pb-2 flex items-center"><i class="fa-solid fa-chart-pie mr-2 text-lg"></i> <span >${window.t('pvp-fameDist', 'Fame Dağılımı')}</span></h4>
               <div class="space-y-3">
                 <div class="flex justify-between items-center bg-black/30 hover:bg-black/50 p-2.5 rounded transition-colors border border-gray-800">
                   <span class="text-gray-400 text-sm"><i class="fa-solid fa-crosshairs text-green-500 w-6"></i> <span >${window.t('pvp-killFame', 'Kill Fame')}</span></span>
                   <span id="pvpKillFame" class="text-white font-bold">0</span>
                 </div>
                 <div class="flex justify-between items-center bg-black/30 hover:bg-black/50 p-2.5 rounded transition-colors border border-gray-800">
                   <span class="text-gray-400 text-sm"><i class="fa-solid fa-skull text-red-500 w-6"></i> <span >${window.t('pvp-deathFame', 'Death Fame')}</span></span>
                   <span id="pvpDeathFame" class="text-white font-bold">0</span>
                 </div>
                 <div class="flex justify-between items-center bg-black/30 hover:bg-black/50 p-2.5 rounded transition-colors border border-gray-800">
                   <span class="text-gray-400 text-sm"><i class="fa-solid fa-dragon text-blue-400 w-6"></i> <span >${window.t('pvp-pveFame', 'PvE Fame')}</span></span>
                   <span id="pvpPveFame" class="text-white font-bold">0</span>
                 </div>
                 <div class="flex justify-between items-center bg-black/30 hover:bg-black/50 p-2.5 rounded transition-colors border border-gray-800">
                   <span class="text-gray-400 text-sm"><i class="fa-solid fa-hammer text-albion-accent w-6"></i> Üretim (Craft)</span>
                   <span id="pvpCraftFame" class="text-white font-bold">0</span>
                 </div>
                 <div class="flex justify-between items-center bg-black/30 hover:bg-black/50 p-2.5 rounded transition-colors border border-gray-800">
                   <span class="text-gray-400 text-sm"><i class="fa-solid fa-leaf text-green-400 w-6"></i> <span >${window.t('pvp-gatherFame', 'Toplayıcılık')}</span></span>
                   <span id="pvpGatherFame" class="text-white font-bold">0</span>
                 </div>
                 <div class="flex justify-between items-center bg-albion-accent/10 border border-albion-accent/30 p-3 rounded-lg mt-3 shadow-inner">
                   <span class="text-albion-accent text-sm font-bold uppercase tracking-wider"><i class="fa-solid fa-star w-6 text-lg"></i> <span >${window.t('pvp-totalFame', 'Toplam')}</span></span>
                   <span id="pvpTotalFame" class="text-albion-accent font-black text-xl drop-shadow-md">0</span>
                 </div>
               </div>
             </div>

             <!-- Son Görülen Set -->
             <div class="bg-albion-900 border border-gray-700 rounded-xl p-5 shadow-lg flex flex-col w-full lg:w-1/2 2xl:w-full transition-colors">
               <h4 class="text-albion-accent font-bold mb-2 uppercase text-sm border-b border-gray-700 pb-2 flex items-center"><i class="fa-solid fa-shirt mr-2 text-lg"></i> Son Görülen Ekipman ve Yetenekler</h4>
               <p class="text-[10px] text-gray-500 mb-4 leading-tight">Son girdiği çatışmadaki eşyaları, enchant (seviye) oranları ve kullandığı aktif/pasif yetenek dizilimi.</p>
               <div id="pvpLastSeenSet" class="flex flex-col items-center flex-1 justify-center">
                 <!-- Set Buraya Gelecek -->
               </div>
             </div>
          </div>

          <!-- Sağ Kolon: Savaş Geçmişi (VS Feed) -->
          <div class="2xl:col-span-2 flex flex-col h-[900px]">
             <div class="bg-albion-900 border border-gray-700 rounded-xl overflow-hidden shadow-lg flex flex-col h-full transition-colors">
                <div class="bg-albion-800 border-b border-gray-700 p-4 flex flex-col sm:flex-row justify-between items-center shrink-0 transition-colors">
                  <h4 class="font-bold text-white mb-2 sm:mb-0 flex items-center flex-wrap">
  <i class="fa-solid fa-bolt text-albion-accent mr-2"></i> <span data-i18n="pvp-history">Gelişmiş Savaş Geçmişi (Killboard)</span>
  <span class="ml-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.2)] animate-pulse mt-1 sm:mt-0">
    <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span><span data-i18n="app-liveBadge">CANLI VERİ</span>
  </span>
</h4>
                  <div class="flex items-center text-xs space-x-4 bg-black/40 px-3 py-1.5 rounded-lg border border-gray-700">
                    <span class="flex items-center"><span class="w-3 h-3 bg-blue-500/20 border border-blue-500 rounded-full mr-2"></span> Kazandığı</span>
                    <span class="flex items-center"><span class="w-3 h-3 bg-red-500/20 border border-red-500 rounded-full mr-2"></span> Kaybettiği</span>
                  </div>
                </div>
                <div id="pvpVsFeed" class="p-4 space-y-5 overflow-y-auto flex-1 bg-gradient-to-b from-albion-900 to-black/80 custom-scroll transition-colors">
                   <!-- VS Kartları -->
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  `;

  const form = document.getElementById('pvpSearchForm');
  const serverBadge = document.getElementById('globalServerBadge');
  const loading = document.getElementById('pvpLoading');
  const loadingText = document.getElementById('pvpLoadingText');
  const errorBox = document.getElementById('pvpError');
  const resultBox = document.getElementById('pvpResult');
  const btnAiProfile = document.getElementById('btnAiProfile');
  const aiAnalysisBox = document.getElementById('aiAnalysisBox');
  const aiAnalysisContent = document.getElementById('aiAnalysisContent');

  let currentServer = window.AppConfig?.server || 'europe';
  let currentPlayerStatsForAI = null; // AI için verileri saklayacağımız obje

  function updateServerDisplay() {
    const serverNames = { europe: "Europe (Avrupa)", americas: "Americas (Batı)", asia: "Asia (Doğu)" };
    serverBadge.innerText = serverNames[currentServer] || currentServer.toUpperCase();
  }

  window.addEventListener('app_settings_loaded', () => {
    currentServer = window.AppConfig.server;
    updateServerDisplay();
  });

  window.addEventListener('app_settings_updated', () => {
    currentServer = window.AppConfig.server;
    updateServerDisplay();
  });

  const formatNumber = (num) => new Intl.NumberFormat('tr-TR').format(num || 0);
  const formatTime = (timeString) => new Date(timeString).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const getTierEnchant = (typeStr) => {
    if (!typeStr) return null;
    let tier = '';
    let enchant = '0';
    const tMatch = typeStr.match(/^T(\d+)/);
    if (tMatch) tier = tMatch[1];
    const eMatch = typeStr.match(/@(\d+)$/);
    if (eMatch) enchant = eMatch[1];
    
    if (!tier) return null;
    return {
      text: enchant !== '0' ? `${tier}.${enchant}` : `${tier}`,
      enchant: parseInt(enchant),
      tier: parseInt(tier)
    };
  };

  const getSlotWithSpells = (item, slotName, size=50) => {
    if (!item || !item.Type) {
      return `
        <div class="flex flex-col items-center flex-shrink-0 w-12 md:w-14">
          <div class="w-full aspect-square bg-[#0a0d14] border border-gray-700/50 rounded flex items-center justify-center shadow-inner opacity-50 relative">
             <span class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[8px] text-gray-600 uppercase font-bold">${slotName}</span>
          </div>
        </div>
      `;
    }
    
    const te = getTierEnchant(item.Type);
    let teBadge = '';
    let borderClass = 'border-gray-500';

    if (te) {
      let bgClass = 'bg-gray-700 text-white';
      if (te.enchant === 1) { bgClass = 'bg-green-600 text-white'; borderClass = 'border-green-500/50'; }
      if (te.enchant === 2) { bgClass = 'bg-blue-500 text-white'; borderClass = 'border-blue-400/50'; }
      if (te.enchant === 3) { bgClass = 'bg-purple-500 text-white'; borderClass = 'border-purple-400/50'; }
      if (te.enchant === 4) { bgClass = 'bg-yellow-500 text-black'; borderClass = 'border-yellow-400/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]'; }
      
      teBadge = `<div class="absolute -bottom-1 -right-1 ${bgClass} text-[9px] font-bold px-1 rounded border border-black shadow-md z-10">${te.text}</div>`;
    }

    let spellsHtml = '';
    const spells = [...(item.ActiveSpells || []), ...(item.PassiveSpells || [])].filter(s => s && s !== "null" && s !== "");
    if (spells.length > 0) {
      spellsHtml = `<div class="flex mt-1.5 w-full justify-center gap-0.5">` + 
        spells.map(s => `<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" class="w-4 h-4 md:w-4 md:h-4 rounded-sm border border-gray-600 bg-black shadow-sm hover:scale-150 transition-transform origin-top z-20" title="${s}" data-spell="${s}">`).join('') +
        `</div>`;
    }

    return `
      <div class="flex flex-col items-center flex-shrink-0 w-12 md:w-14">
         <div class="w-full aspect-square bg-gradient-to-br from-[#1a2233] to-[#0a0d14] border ${borderClass} rounded shadow-lg relative flex items-center justify-center group p-0.5">
           <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" class="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform" title="${item.Type}" data-item="${item.Type}" data-quality="${item.Quality || 1}" data-size="${size}">
           ${teBadge}
           ${item.Count > 1 ? `<div class="absolute top-0 right-0 text-[10px] text-white font-black drop-shadow-[0_2px_2px_rgba(0,0,0,1)] pr-1">${item.Count}</div>` : ''}
         </div>
         ${spellsHtml}
      </div>
    `;
  };

  const getEquipStrip = (eq) => {
    if (!eq) return '<div class="text-xs text-gray-600 italic">Eşya verisi mevcut değil</div>';
    return `
      <div class="flex flex-wrap gap-1.5 md:gap-2 justify-center">
         ${getSlotWithSpells(eq.MainHand, 'Silah', 60)}
         ${getSlotWithSpells(eq.OffHand, 'Kalkan', 60)}
         ${getSlotWithSpells(eq.Head, 'Kafalık', 60)}
         ${getSlotWithSpells(eq.Armor, 'Zırh', 60)}
         ${getSlotWithSpells(eq.Shoes, 'Ayakkabı', 60)}
         ${getSlotWithSpells(eq.Cape, 'Pelerin', 60)}
      </div>
    `;
  };

  const renderLastSeenSet = (eq) => {
    if (!eq) return '<div class="text-gray-500 text-sm py-4">Ekipman verisi bulunamadı.</div>';
    return `
      <div class="grid grid-cols-3 gap-x-4 gap-y-6 w-max mx-auto bg-black/30 p-6 rounded-xl border border-gray-700/50 shadow-inner">
         ${getSlotWithSpells(eq.Bag, 'Çanta', 80)}
         ${getSlotWithSpells(eq.Head, 'Kafalık', 80)}
         ${getSlotWithSpells(eq.Cape, 'Pelerin', 80)}
         
         ${getSlotWithSpells(eq.MainHand, 'Silah', 80)}
         ${getSlotWithSpells(eq.Armor, 'Gövde', 80)}
         ${getSlotWithSpells(eq.OffHand, 'Kalkan', 80)}
         
         ${getSlotWithSpells(eq.Food, 'Yemek', 80)}
         ${getSlotWithSpells(eq.Shoes, 'Ayakkabı', 80)}
         ${getSlotWithSpells(eq.Potion, 'İksir', 80)}
      </div>
      <div class="flex justify-center mt-6 bg-black/20 p-4 rounded-xl border border-gray-800 w-max mx-auto">
         ${getSlotWithSpells(eq.Mount, 'Binek', 100)}
      </div>
    `;
  }

  const createVsCard = (ev, myPlayerId) => {
    const killer = ev.Killer;
    const victim = ev.Victim;
    const isMyWin = killer.Id === myPlayerId;
    
    let myDamage = 0;
    const participantMe = ev.Participants.find(p => p.Id === myPlayerId);
    if (participantMe) {
      myDamage = Math.round(participantMe.DamageDone || 0);
    }
    
    return `
      <div class="bg-[#151a23] border ${isMyWin ? 'border-l-4 border-l-blue-500 border-gray-700' : 'border-l-4 border-l-red-500 border-gray-700'} rounded-xl shadow-lg relative group transition-all duration-300 hover:shadow-2xl overflow-hidden">
        
        <div class="bg-gradient-to-r from-blue-900/20 to-transparent p-3 md:p-4 border-b border-gray-800">
           <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
              <div class="flex flex-col flex-1">
                 <div class="text-blue-400 font-black text-lg flex items-center tracking-wide">
                    <i class="fa-solid fa-khanda mr-2 text-blue-500/70"></i> ${killer.Name}
                 </div>
                 <div class="flex items-center text-xs text-gray-400 mt-1 space-x-3">
                    <span class="bg-gray-800 border border-gray-600 px-2 py-0.5 rounded text-white font-bold" title="Item Power"><i class="fa-solid fa-bolt text-albion-accent mr-1"></i>${Math.round(killer.AverageItemPower || 0)} IP</span>
                    ${killer.GuildName ? `<span title="Lonca"><i class="fa-solid fa-shield-halved text-gray-500 mr-1"></i>${killer.GuildName}</span>` : ''}
                    ${(isMyWin && myDamage > 0) ? `<span class="text-green-400 font-bold" title="Verilen Hasar"><i class="fa-solid fa-fire mr-1"></i>${myDamage} Dmg</span>` : ''}
                 </div>
              </div>
              <div class="w-full xl:w-auto flex flex-wrap justify-center xl:justify-start">
                 ${getEquipStrip(killer.Equipment)}
              </div>
           </div>
        </div>
        
        <div class="absolute left-4 xl:left-1/2 top-1/2 transform -translate-y-1/2 xl:-translate-x-1/2 bg-[#0a0d14] border-2 border-gray-600 text-albion-accent text-[10px] font-black px-2 py-1 rounded-lg z-10 shadow-lg group-hover:scale-110 group-hover:border-albion-accent transition-all tracking-widest hidden md:block">VS</div>
        
        <div class="bg-gradient-to-r from-red-900/10 to-transparent p-3 md:p-4">
           <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
              <div class="flex flex-col flex-1">
                 <div class="text-red-400 font-black text-lg flex items-center tracking-wide">
                    <i class="fa-solid fa-skull mr-2 text-red-500/70"></i> ${victim.Name}
                 </div>
                 <div class="flex items-center text-xs text-gray-400 mt-1 space-x-3">
                    <span class="bg-gray-800 border border-gray-600 px-2 py-0.5 rounded text-white font-bold" title="Item Power"><i class="fa-solid fa-bolt text-albion-accent mr-1"></i>${Math.round(victim.AverageItemPower || 0)} IP</span>
                    ${victim.GuildName ? `<span title="Lonca"><i class="fa-solid fa-shield-halved text-gray-500 mr-1"></i>${victim.GuildName}</span>` : ''}
                 </div>
              </div>
              <div class="w-full xl:w-auto flex flex-wrap justify-center xl:justify-start">
                 ${getEquipStrip(victim.Equipment)}
              </div>
           </div>
        </div>

        <div class="bg-[#0a0d14] px-4 py-2 flex justify-between items-center text-[11px] text-gray-400 border-t border-gray-800">
          <div class="flex gap-4">
             <span title="Düşen Kill Fame" class="flex items-center bg-albion-accent/10 text-albion-accent border border-albion-accent/30 px-2 py-0.5 rounded-full font-bold">
               <i class="fa-solid fa-star mr-1.5"></i>${formatNumber(ev.TotalKillFame)} Fame
             </span>
             <span title="Katılımcı (Gank) Sayısı" class="flex items-center text-gray-300">
               <i class="fa-solid fa-users text-gray-500 mr-1.5"></i>${ev.Participants ? ev.Participants.length : 1} Oyuncu
             </span>
          </div>
          <div class="font-medium text-gray-500"><i class="fa-solid fa-clock mr-1"></i> ${formatTime(ev.TimeStamp)}</div>
        </div>
      </div>
    `;
  };

  const fetchWithFallback = async (url) => {
    const timeout = 6000;
    const proxies = [
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
    ];

    for (let i = 0; i < proxies.length; i++) {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(proxies[i], { signal: controller.signal });
        clearTimeout(id);
        if (response.ok) {
          const text = await response.text();
          try { return JSON.parse(text); } catch (e) {}
        }
      } catch (err) {}
    }
    throw new Error("Albion API veri bağlantısı sağlanamadı. Sunucular aşırı yüklü olabilir.");
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('playerName').value.trim();
    const baseUrl = serverAPIs[currentServer];

    if (!name) return;

    errorBox.classList.add('hidden');
    resultBox.classList.add('hidden');
    aiAnalysisBox.classList.add('hidden');
    loading.classList.remove('hidden');
    loading.classList.add('flex');

    try {
      if (loadingText) loadingText.innerText = window.t('pvp-findingPlayer', 'Oyuncu Bulunuyor...');
      const searchData = await fetchWithFallback(`${baseUrl}/search?q=${name}`);

      if (!searchData || !searchData.players || searchData.players.length === 0) {
        throw new Error(`"${name}" adlı oyuncu bulunamadı.`);
      }

      const baseInfo = searchData.players.find(p => p.Name.toLowerCase() === name.toLowerCase()) || searchData.players[0];

      if (loadingText) loadingText.innerText = window.t('pvp-fetchingStats', 'Detaylı İstatistikler Çekiliyor...');
      let pData = baseInfo;
      try {
        const detailData = await fetchWithFallback(`${baseUrl}/players/${baseInfo.Id}`);
        if(detailData && detailData.Id) pData = detailData;
      } catch(e) {} 

      document.getElementById('pvpFullName').innerText = pData.Name;
      document.getElementById('pvpKillFame').innerText = formatNumber(pData.KillFame);
      document.getElementById('pvpDeathFame').innerText = formatNumber(pData.DeathFame);
      document.getElementById('pvpGuild').innerText = pData.GuildName || 'Yok';
      document.getElementById('pvpAlliance').innerText = pData.AllianceName || 'Yok';
      
      const kd = pData.DeathFame > 0 ? (pData.KillFame / pData.DeathFame).toFixed(2) : pData.KillFame;
      document.getElementById('pvpKdRatio').innerText = kd;

      const stats = pData.LifetimeStatistics || {};
      const pve = stats.PvE ? (stats.PvE.Total || 0) : pData.Fame || 0;
      const craft = stats.Crafting ? (stats.Crafting.Total || 0) : 0;
      const gather = stats.Gathering ? (stats.Gathering.All ? stats.Gathering.All.Total : 0) : 0;
      
      document.getElementById('pvpPveFame').innerText = formatNumber(pve);
      document.getElementById('pvpCraftFame').innerText = formatNumber(craft);
      document.getElementById('pvpGatherFame').innerText = formatNumber(gather);
      
      const totalFame = (pData.KillFame || 0) + pve + craft + gather;
      document.getElementById('pvpTotalFame').innerText = formatNumber(totalFame);

      if (loadingText) loadingText.innerText = 'Savaş Geçmişi (Killboard) İndiriliyor...';
      let events = [];
      try {
        const killsData = await fetchWithFallback(`${baseUrl}/players/${pData.Id}/kills`);
        if (Array.isArray(killsData)) events.push(...killsData);
      } catch(e) {}

      try {
        const deathsData = await fetchWithFallback(`${baseUrl}/players/${pData.Id}/deaths`);
        if (Array.isArray(deathsData)) events.push(...deathsData);
      } catch(e) {}

      events.sort((a, b) => new Date(b.TimeStamp) - new Date(a.TimeStamp));

      let recentWeaponName = "Bilinmiyor";
      const feedContainer = document.getElementById('pvpVsFeed');
      if (events.length === 0) {
        feedContainer.innerHTML = `<div class="text-center text-gray-500 py-10"><i class="fa-solid fa-ghost text-4xl mb-3 opacity-50"></i><p >${window.t('pvp-noCombat', 'Yakın zamanda hiç savaşa girmemiş.')}</p></div>`;
        document.getElementById('pvpLastSeenSet').innerHTML = renderLastSeenSet(null);
      } else {
        feedContainer.innerHTML = events.map(ev => createVsCard(ev, pData.Id)).join('');
        
        const newestEvent = events[0];
        const recentEquip = (newestEvent.Killer.Id === pData.Id) ? newestEvent.Killer.Equipment : newestEvent.Victim.Equipment;
        document.getElementById('pvpLastSeenSet').innerHTML = renderLastSeenSet(recentEquip);
        
        if (recentEquip && recentEquip.MainHand) {
           recentWeaponName = recentEquip.MainHand.Type;
           document.getElementById('pvpAvatar').innerHTML = `<img src="https://render.albiononline.com/v1/item/${recentEquip.MainHand.Type}.png" class="w-full h-full object-contain p-1 transform scale-125">`;
        }
      }

      // AI İÇİN VERİYİ SAKLA
      currentPlayerStatsForAI = {
         name: pData.Name,
         killFame: pData.KillFame || 0,
         deathFame: pData.DeathFame || 0,
         pveFame: pve,
         gatherFame: gather,
         craftFame: craft,
         kdRatio: kd,
         guild: pData.GuildName || "Yalnız Kurt",
         recentWeapon: recentWeaponName,
         eventCount: events.length
      };

      resultBox.classList.remove('hidden');

    } catch (err) {
      errorBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-3 text-2xl shrink-0"></i> <span>${err.message}</span>`;
      errorBox.classList.remove('hidden');
    } finally {
      loading.classList.add('hidden');
      loading.classList.remove('flex');
    }
  });

  // AI ANALİZİ BUTONU EVENT LISTENER
  btnAiProfile.addEventListener('click', async () => {
     if (!currentPlayerStatsForAI) return;
     
     const modelId = '91cbae37-9d98-4f54-9917-e28c164697a6'; // GPT-4o Mini
     const btnOriginalHtml = btnAiProfile.innerHTML;
     
     btnAiProfile.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-purple-400 text-xl"></i>`;
     btnAiProfile.disabled = true;

     try {
       const prompt = `Şu Albion Online oyuncusunu eğlenceli, biraz iğneleyici ve analitik bir dille analiz et. SADECE TÜRKÇE YANIT VER. 2 paragrafı geçme. 
Oyuncu Adı: ${currentPlayerStatsForAI.name}
Lonca: ${currentPlayerStatsForAI.guild}
K/D Oranı: ${currentPlayerStatsForAI.kdRatio}
Kill Fame: ${formatNumber(currentPlayerStatsForAI.killFame)}
Death Fame: ${formatNumber(currentPlayerStatsForAI.deathFame)}
PvE Fame: ${formatNumber(currentPlayerStatsForAI.pveFame)}
Toplayıcılık Fame: ${formatNumber(currentPlayerStatsForAI.gatherFame)}
Üretim Fame: ${formatNumber(currentPlayerStatsForAI.craftFame)}
Son Görülen Silah: ${currentPlayerStatsForAI.recentWeapon}

Örnek çıktı: "Bu oyuncu tam bir Yalnız Kurt, PvP'den çok ağaç kesmeyi seviyor..." veya "K/D oranı felaket, yüksek ihtimalle gankerlara sürekli ölen bir av..." gibi. Maksimum 3-4 cümle.`;

       const result = await window.miniappsAI.callModel({
         modelId: modelId,
         messages: [
           { role: 'system', content: 'Sen acımasız ve esprili bir Albion Online istatistik uzmanısın. Kullanıcı verilerini inceleyip eğlenceli ve isabetli yorumlar yaparsın.' },
           { role: 'user', content: prompt }
         ]
       });

       const analysisText = window.miniappsAI.extractText(result);
       
       aiAnalysisContent.innerHTML = analysisText.replace(/\\n/g, '<br>');
       aiAnalysisBox.classList.remove('hidden');
       
     } catch (err) {
       console.error("AI Analiz Hatası:", err);
       aiAnalysisContent.innerHTML = `<span class="text-red-400"><i class="fa-solid fa-triangle-exclamation"></i> Yapay zeka analiz yaparken bir sorunla karşılaştı. Gerekli izinleri verdiğinizden veya krediniz olduğundan emin olun.</span>`;
       aiAnalysisBox.classList.remove('hidden');
     } finally {
       btnAiProfile.innerHTML = btnOriginalHtml;
       btnAiProfile.disabled = false;
     }
  });

});

// Resimleri lazy load ile yukle
let _pvpImgObserver = null;
function loadImagesLazy() {
  if (!_pvpImgObserver) {
    _pvpImgObserver = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if ((img.dataset.item || img.dataset.spell) && !img.dataset.loaded) {
            img.dataset.loaded = "1";
            try {
              let imageUrl = "";
              if (img.dataset.item) {
                imageUrl = await window.getItemImage(
                  img.dataset.item, 
                  parseInt(img.dataset.quality) || 1, 
                  parseInt(img.dataset.size) || 128
                );
              } else if (img.dataset.spell) {
                imageUrl = await window.getSpellImage(img.dataset.spell);
              }
              img.src = imageUrl;
            } catch (e) {
              if (window.albionImageCache) img.src = window.albionImageCache.getPlaceholderUrl();
            }
            _pvpImgObserver.unobserve(img);
          }
        }
      });
    });
  }
  
  document.querySelectorAll('#pvpApp img[data-item]:not([data-loaded="1"]), #pvpApp img[data-spell]:not([data-loaded="1"])').forEach(img => {
    _pvpImgObserver.observe(img);
  });
}

document.addEventListener('DOMContentLoaded', loadImagesLazy);

const pvpImageObserver = new MutationObserver(() => {
  loadImagesLazy();
});

setTimeout(() => {
  const pvpAppContainer = document.getElementById('pvpApp');
  if(pvpAppContainer) {
    pvpImageObserver.observe(pvpAppContainer, {
      childList: true,
      subtree: true
    });
  }
}, 1000);
