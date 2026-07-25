// Albion Online Server-Specific Prime Times, Locations and Tactical Data
const serverSchedules = {
  europe: [
    { utc: 10, name: "EU Sabah", castles: ["Thunderrock Castle"], outposts: ["Thunderrock Draw"], deploy: "Arthur's Rest / Martlock Portal", desc: "Avrupa sunucusunun erken saatleri. Çoğu oyuncu işte/okulda olduğu için rekabet azdır, hızlıca outpost almak için ideal." },
    { utc: 12, name: "EU Öğle", castles: ["Eye of the Forest Castle"], outposts: ["Deepwood Gorge", "Hightree Lake"], deploy: "Morgana's Rest / Lymhurst Portal", desc: "Öğle tatili saatleri. Küçük ekiplerin orman biyomlarında outpost kovaladığı, ufak çaplı savaşların döndüğü saatler." },
    { utc: 15, name: "EU Erken Prime", castles: ["Dryvein Castle", "Gravelight Castle"], outposts: ["Sunstrand Delta", "Gravelight Marsh", "Runnel Sink"], deploy: "Merlyn's Rest / Bridgewatch & Thetford", desc: "Avrupa'da iş ve okul çıkışı saatleri. Haritalar kalabalıklaşmaya başlar, Thetford ve Bridgewatch etrafında hareketlilik artar." },
    { utc: 18, name: "EU Ana Prime", castles: ["Frostspring Castle", "Murkweald Castle", "Everwinter Castle"], outposts: ["Frostspring Volcano", "Murkweald", "Whitecliff Expanse"], deploy: "Arthur's Rest & Morgana's Rest / Fort Sterling", desc: "Avrupa sunucusunun zirve saati! En büyük orduların ve ittifakların Dağ ve Bataklık haritalarında devasa ZvZ'ler için çarpıştığı an." },
    { utc: 21, name: "EU Geç Prime", castles: ["Giant's Weald Castle", "Highstone Castle"], outposts: ["Giant's Weald", "Highstone Loch", "Darkbough Snag"], deploy: "Arthur's Rest / Lymhurst", desc: "Gece saatlerinde T8 Doğu haritalarında devasa ittifak savaşları. Ganimet oldukça yüksektir." }
  ],
  americas: [
    { utc: 18, name: "NA Erken", castles: ["Dryvein Castle", "Gravelight Castle"], outposts: ["Sunstrand Delta", "Gravelight Marsh"], deploy: "Merlyn's Rest / Bridgewatch Portal", desc: "Amerika sunucusunda oyuncuların yavaş yavaş toplanmaya başladığı erken saatler." },
    { utc: 21, name: "NA Prime Başlangıcı", castles: ["Giant's Weald Castle", "Highstone Castle"], outposts: ["Giant's Weald", "Highstone Loch"], deploy: "Arthur's Rest / Lymhurst Portal", desc: "Amerika sunucusunda büyük ittifakların online olduğu ve sınır çatışmalarının kızıştığı saatler." },
    { utc: 0, name: "NA Ana Prime", castles: ["Everwinter Castle", "Deathreach Castle"], outposts: ["Everwinter Gorge", "Deathreach Priory", "Munten Rise"], deploy: "Arthur's Rest / Fort Sterling Portal", desc: "Amerika kıtasının en yoğun olduğu ana prime time. T8 Kuzey ve Güney haritalarında kıyasıya ZvZ döner." },
    { utc: 3, name: "NA Geç Prime", castles: ["Roastcorpse Castle", "Wailing Castle"], outposts: ["Roastcorpse Steppe", "Wailing Bulwark", "Dryvein Cross"], deploy: "Merlyn's Rest / Martlock Portal", desc: "Gece kuşları ve batı Amerika oyuncularının hakim olduğu saatler. Bozkır (Steppe) haritalarında savaşlar kopar." },
    { utc: 5, name: "NA Gece / Sabah", castles: ["Thunderrock Castle"], outposts: ["Thunderrock Draw", "Sleetwater Basin"], deploy: "Morgana's Rest / Thetford Portal", desc: "Amerika sunucusunun sabaha karşı sakinleştiği saatler. Gizlice kale kapmak için idealdir." }
  ],
  asia: [
    { utc: 4, name: "Asia Öğle", castles: ["Roastcorpse Castle"], outposts: ["Roastcorpse Steppe"], deploy: "Merlyn's Rest / Martlock Portal", desc: "Asya sunucusunda hareketliliğin yeni başladığı anlar." },
    { utc: 8, name: "Asia Erken Prime", castles: ["Thunderrock Castle"], outposts: ["Thunderrock Draw", "Sleetwater Basin"], deploy: "Arthur's Rest / Martlock Portal", desc: "Asya oyuncularının akşam saatlerine girişi, toplanma ve hazırlık vakti." },
    { utc: 12, name: "Asia Ana Prime", castles: ["Eye of the Forest Castle", "Everwinter Castle"], outposts: ["Deepwood Gorge", "Hightree Lake", "Longtimber Glen"], deploy: "Morgana's Rest & Arthur's Rest", desc: "Asya sunucusunda en büyük ZvZ savaşlarının döndüğü ana zirve (Prime) saati!" },
    { utc: 15, name: "Asia Geç Prime", castles: ["Dryvein Castle", "Gravelight Castle"], outposts: ["Sunstrand Delta", "Gravelight Marsh", "Runnel Sink"], deploy: "Merlyn's Rest / Bridgewatch Portal", desc: "Asya'nın gece saatleri. Sunucunun yavaş yavaş sakinleşmeye başladığı final etkinlikleri." }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('eventsApp');
  if (!container) return;

  container.innerHTML = `
    <div class="flex flex-col h-full gap-4">
      
      <!-- Top Section: Controls -->
      <div class="bg-albion-900 border border-gray-700 p-4 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center z-10 shrink-0 transition-colors">
        <div class="text-left mb-4 md:mb-0">
           <h3 class="text-xl font-bold text-white"><i class="fa-solid fa-timeline text-albion-accent mr-2"></i> <span >${window.t('events-title', 'Yaklaşan Etkinlikler')}</span></h3>
           <p class="text-gray-400 text-xs mt-1" >${window.t('events-desc', 'Liste anlık saatine göre dinamik olarak sıralanır.')}</p>
        </div>
        
        <!-- Global Server Display Badge -->
        <div class="flex items-center space-x-2 bg-albion-800 p-2.5 rounded-lg border border-gray-700 text-sm shadow-inner transition-colors">
           <i class="fa-solid fa-server text-albion-accent"></i>
           <span class="text-gray-400 font-medium" >${window.t('events-server', 'Sunucu:')}</span>
           <span id="eventCurrentServerBadge" class="font-bold text-white uppercase tracking-wider">Europe</span>
        </div>
      </div>

      <!-- Feed Section: Dynamic Schedule List -->
      <div class="flex-1 overflow-y-auto pr-2 space-y-4 pb-10" id="scheduleGrid">
        <!-- Populated by JS -->
      </div>
    </div>
  `;

  const scheduleGrid = document.getElementById('scheduleGrid');
  const serverBadge = document.getElementById('eventCurrentServerBadge');

  let currentServer = window.AppConfig?.server || 'europe';
  let timerInterval = null;
  let upcomingEvents = [];

  function updateServerDisplay() {
    const serverNames = { 
      europe: window.t('events-serverEU', 'Europe (Avrupa)'), 
      americas: window.t('events-serverNA', 'Americas (Batı)'), 
      asia: window.t('events-serverAS', 'Asia (Doğu)') 
    };
    serverBadge.innerText = serverNames[currentServer] || currentServer.toUpperCase();
  }

  window.addEventListener('app_settings_loaded', () => {
    currentServer = window.AppConfig.server;
    updateServerDisplay();
    refreshSchedule();
  });

  window.addEventListener('app_settings_updated', () => {
    currentServer = window.AppConfig.server;
    updateServerDisplay();
    refreshSchedule();
  });

  // Initialize
  function initializeApp() {
    updateServerDisplay();
    refreshSchedule();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(tickCountdowns, 1000);
  }

  function getSortedEvents() {
    const now = new Date();
    const eventsData = serverSchedules[currentServer];
    if (!eventsData) return [];
    
    const mapped = eventsData.map(e => {
      let eventDate = new Date();
      eventDate.setUTCHours(e.utc, 0, 0, 0);
      
      if (eventDate <= now) {
        eventDate.setUTCDate(eventDate.getUTCDate() + 1);
      }
      
      return { ...e, targetDate: eventDate };
    });

    mapped.sort((a, b) => a.targetDate - b.targetDate);
    return mapped;
  }

  function refreshSchedule() {
    upcomingEvents = getSortedEvents();
    renderGrid();
    tickCountdowns();
  }

  function renderGrid() {
    scheduleGrid.innerHTML = '';
    const options = { hour: '2-digit', minute: '2-digit' };

    upcomingEvents.forEach((event, index) => {
      const isNext = (index === 0);
      const localTimeStr = event.targetDate.toLocaleTimeString([], options);
      
      const castlesHtml = event.castles.map(c => `
        <div class="bg-albion-900 border border-albion-accent/40 shadow-inner p-3 mb-2 rounded-lg flex items-center transition-colors">
          <div class="bg-albion-accent/20 w-10 h-10 rounded flex items-center justify-center mr-4 shrink-0 shadow-sm border border-albion-accent/30">
            <i class="fa-solid fa-chess-rook text-albion-accent text-xl drop-shadow-md"></i>
          </div>
          <span class="text-lg font-bold text-white tracking-wide drop-shadow-md">${c}</span>
        </div>
      `).join('');

      const outpostsHtml = event.outposts.map(o => `
        <div class="mb-2 flex items-center text-gray-300 text-sm pl-2 py-1 bg-albion-900/50 rounded border border-gray-700/50 transition-colors">
          <i class="fa-solid fa-campground text-albion-accent/70 mr-3"></i>
          <span class="font-medium">${o}</span>
        </div>
      `).join('');

      const div = document.createElement('div');
      div.className = `bg-albion-800 border ${isNext ? 'border-albion-accent shadow-lg scale-[1.01]' : 'border-gray-700'} p-5 rounded-xl relative overflow-hidden transition-all duration-300`;
      
      div.innerHTML = `
        ${isNext ? `<div class="absolute top-0 right-0 bg-albion-accent text-white text-[10px] font-bold px-4 py-1 rounded-bl-lg animate-pulse z-20 shadow-md"><span >${window.t('events-nextTarget', 'SIRADAKİ HEDEF')}</span></div>` : ''}
        <div class="absolute right-[-20px] top-[-10px] opacity-[0.03] text-9xl pointer-events-none z-0"><i class="fa-solid fa-khanda"></i></div>
        
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 relative z-10 border-b border-gray-700 pb-4">
           <div class="flex items-center mb-3 md:mb-0">
              <div class="text-4xl font-black ${isNext ? 'text-albion-accent' : 'text-gray-200'} mr-4 drop-shadow-md">${localTimeStr}</div>
              <div class="flex flex-col">
                <div class="text-sm font-bold ${isNext ? 'text-albion-accent' : 'text-gray-400'} uppercase tracking-wider">${event.name}</div>
                <div class="text-[10px] font-bold text-gray-500 mt-0.5">UTC: ${String(event.utc).padStart(2, '0')}:00</div>
              </div>
           </div>
           
           <div class="flex items-center space-x-2 bg-albion-900 ${isNext ? 'border-albion-accent/50' : 'border-gray-600'} border p-2 rounded-lg shadow-inner transition-colors" id="cd-container-${index}">
             <i class="fa-solid fa-stopwatch ${isNext ? 'text-albion-accent' : 'text-gray-500'} text-lg mr-1"></i>
             <div class="font-mono text-xl font-bold ${isNext ? 'text-white' : 'text-gray-400'}" id="cd-timer-${index}">--:--:--</div>
           </div>
        </div>
        
        <div class="mb-4 relative z-10 flex items-center">
          <div class="bg-blue-900/20 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center">
            <i class="fa-solid fa-map-location-dot mr-2 text-blue-400"></i>
            <span >${window.t('events-deploy', 'Toplanma (Deploy):')}</span> <span class="text-white ml-1">${event.deploy}</span>
          </div>
        </div>

        <p class="text-sm text-gray-300 mb-5 relative z-10 border-l-4 ${isNext ? 'border-albion-accent' : 'border-gray-600'} pl-3 py-1">${event.desc}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
           <div class="bg-black/20 p-4 rounded-xl border border-gray-700/50">
              <div class="text-xs text-albion-accent font-bold mb-3 uppercase flex items-center border-b border-gray-700 pb-2">
                <i class="fa-solid fa-chess-rook mr-2 text-lg"></i> <span >${window.t('events-castles', 'Kaleler (Castles)')}</span>
              </div>
              <div class="flex flex-col gap-1">${castlesHtml}</div>
           </div>
           <div class="bg-black/20 p-4 rounded-xl border border-gray-700/50">
              <div class="text-xs text-albion-accent font-bold mb-3 uppercase flex items-center border-b border-gray-700 pb-2">
                <i class="fa-solid fa-campground mr-2 text-lg"></i> <span >${window.t('events-outposts', 'Karakollar (Outposts)')}</span>
              </div>
              <div class="mt-2">${outpostsHtml}</div>
           </div>
        </div>
      `;
      scheduleGrid.appendChild(div);
    });
  }

  function tickCountdowns() {
    const now = new Date().getTime();
    let needRefresh = false;

    upcomingEvents.forEach((event, index) => {
      const distance = event.targetDate.getTime() - now;

      if (distance < 0) {
        needRefresh = true;
        return;
      }

      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      const timerElement = document.getElementById(`cd-timer-${index}`);
      if (timerElement) {
        timerElement.innerText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    });

    if (needRefresh) {
      refreshSchedule();
    }
  }

  initializeApp();
});
