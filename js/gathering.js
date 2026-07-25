const biomeData = [
  {
    id: "swamp",
    name: "Bataklık (Swamp)",
    city: "Thetford",
    main: { type: "Fiber (Lif)", icon: "fa-seedling", color: "text-green-400" },
    sec1: { type: "Wood (Odun)", icon: "fa-tree", color: "text-albion-accent_hover" },
    sec2: { type: "Hide (Deri)", icon: "fa-paw", color: "text-albion-accent" },
    desc: "Bataklıklarda en çok Lif bulunur. İkincil kaynaklar Odun ve Deridir. Thetford çevresindeki haritalar bu biyomdadır."
  },
  {
    id: "forest",
    name: "Orman (Forest)",
    city: "Lymhurst",
    main: { type: "Wood (Odun)", icon: "fa-tree", color: "text-albion-accent_hover" },
    sec1: { type: "Hide (Deri)", icon: "fa-paw", color: "text-albion-accent" },
    sec2: { type: "Rock (Taş)", icon: "fa-gem", color: "text-gray-400" },
    desc: "Ormanlarda en çok Odun bulunur. İkincil kaynaklar Deri ve Taştır. Lymhurst çevresi ağırlıklı olarak bu biyomdadır."
  },
  {
    id: "steppe",
    name: "Bozkır (Steppe)",
    city: "Bridgewatch",
    main: { type: "Hide (Deri)", icon: "fa-paw", color: "text-albion-accent" },
    sec1: { type: "Fiber (Lif)", icon: "fa-seedling", color: "text-green-400" },
    sec2: { type: "Ore (Maden)", icon: "fa-cubes", color: "text-blue-300" },
    desc: "Bozkırlarda en çok Deri veren hayvanlar yaşar. İkincil kaynaklar Lif ve Madendir. Bridgewatch etrafında yer alır."
  },
  {
    id: "highland",
    name: "Yayla (Highland)",
    city: "Martlock",
    main: { type: "Rock (Taş)", icon: "fa-gem", color: "text-gray-400" },
    sec1: { type: "Ore (Maden)", icon: "fa-cubes", color: "text-blue-300" },
    sec2: { type: "Wood (Odun)", icon: "fa-tree", color: "text-albion-accent_hover" },
    desc: "Yaylalarda bolca Taş bulunur. İkincil kaynaklar Maden ve Odundur. Martlock çevresindedir."
  },
  {
    id: "mountain",
    name: "Dağ (Mountain)",
    city: "Fort Sterling",
    main: { type: "Ore (Maden)", icon: "fa-cubes", color: "text-blue-300" },
    sec1: { type: "Rock (Taş)", icon: "fa-gem", color: "text-gray-400" },
    sec2: { type: "Fiber (Lif)", icon: "fa-seedling", color: "text-green-400" },
    desc: "Dağlar Maden açısından çok zengindir. İkincil kaynaklar Taş ve Liftir. Fort Sterling çevresi bu biyomdadır."
  }
];

// Gerçek Albion Online Outlands (Black Zone) ve Royal kıtası harita örnekleri veritabanı
const mapDatabase = [
  // T8 Haritalar
  { id: "4357", name: "Eye of the Forest", tier: 8, biome: "forest", type: "Black Zone", safe: false },
  { id: "4358", name: "Deepwood Gorge", tier: 8, biome: "forest", type: "Black Zone", safe: false },
  { id: "4359", name: "Roastcorpse Steppe", tier: 8, biome: "steppe", type: "Black Zone", safe: false },
  { id: "4360", name: "Wailing Bulwark", tier: 8, biome: "steppe", type: "Black Zone", safe: false },
  { id: "4361", name: "Deathreach Priory", tier: 8, biome: "swamp", type: "Black Zone", safe: false },
  { id: "4362", name: "Murkweald", tier: 8, biome: "swamp", type: "Black Zone", safe: false },
  { id: "4363", name: "Everwinter Peak", tier: 8, biome: "mountain", type: "Black Zone", safe: false },
  { id: "4364", name: "Everwinter Gorge", tier: 8, biome: "mountain", type: "Black Zone", safe: false },
  { id: "4365", name: "Thunderrock Draw", tier: 8, biome: "mountain", type: "Black Zone", safe: false },
  { id: "4366", name: "Giant's Weald", tier: 8, biome: "highland", type: "Black Zone", safe: false },

  // T7 Haritalar
  { id: "4367", name: "Deepwood Copse", tier: 7, biome: "forest", type: "Black Zone", safe: false },
  { id: "4368", name: "Hightree Lake", tier: 7, biome: "forest", type: "Black Zone", safe: false },
  { id: "4369", name: "Sunstrand Delta", tier: 7, biome: "steppe", type: "Black Zone", safe: false },
  { id: "4370", name: "Sunstrand Quicksands", tier: 7, biome: "steppe", type: "Black Zone", safe: false },
  { id: "4371", name: "Gravelight Marsh", tier: 7, biome: "swamp", type: "Black Zone", safe: false },
  { id: "4372", name: "Frostspring Volcano", tier: 7, biome: "mountain", type: "Black Zone", safe: false },
  { id: "4373", name: "Highstone Loch", tier: 7, biome: "highland", type: "Black Zone", safe: false },

  // T6 Haritalar
  { id: "4374", name: "Stonemouth Southbluff", tier: 6, biome: "highland", type: "Black Zone", safe: false },
  { id: "4375", name: "Whitecliff Expanse", tier: 6, biome: "mountain", type: "Black Zone", safe: false },
  { id: "4376", name: "Dryvein Cross", tier: 6, biome: "steppe", type: "Black Zone", safe: false },
  { id: "4377", name: "Runnel Sink", tier: 6, biome: "swamp", type: "Black Zone", safe: false },
  { id: "4378", name: "Longtimber Glen", tier: 6, biome: "forest", type: "Black Zone", safe: false },
  { id: "4379", name: "Shiftshadow Expanse", tier: 6, biome: "forest", type: "Red Zone", safe: false },
  { id: "4380", name: "Meltwater Bog", tier: 6, biome: "swamp", type: "Red Zone", safe: false },

  // T5 Haritalar
  { id: "4381", name: "Yew Wood", tier: 5, biome: "forest", type: "Yellow Zone", safe: true },
  { id: "4382", name: "Gutras Hill", tier: 5, biome: "highland", type: "Yellow Zone", safe: true },
  { id: "4383", name: "Slowtree Plain", tier: 5, biome: "steppe", type: "Yellow Zone", safe: true },
  { id: "4384", name: "Willowsigh Marsh", tier: 5, biome: "swamp", type: "Yellow Zone", safe: true },
  { id: "4385", name: "Cairn Camain", tier: 5, biome: "mountain", type: "Yellow Zone", safe: true }
];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('gatheringApp');
  if (!container) return;

  container.innerHTML = `
    <div class="absolute inset-0 w-full h-full bg-[#0a0a0a] z-10 flex flex-col overflow-hidden">
       <!-- Floating Toggle Switch -->
       <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-albion-900/90 backdrop-blur-md border border-albion-700 p-1.5 rounded-full shadow-2xl flex gap-1 w-max">
          <button id="btnGatheringGuide" class="px-4 py-2 text-[10px] md:text-sm font-bold rounded-full bg-albion-accent text-black transition-colors flex items-center shadow-lg">
             <i class="fa-solid fa-book-open mr-2"></i> <span>${window.t('gathering-guide', 'Toplayıcı Rehberi')}</span>
          </button>
          <button id="btnGatheringMap" class="px-4 py-2 text-[10px] md:text-sm font-bold rounded-full bg-transparent text-gray-400 hover:text-white transition-colors flex items-center">
             <i class="fa-solid fa-map-location-dot mr-2"></i> <span>${window.t('gathering-map2d', 'Gelişmiş Kaynak & Harita Bulucu')}</span>
          </button>
       </div>

       <!-- Content Wrapper -->
       <div class="relative w-full h-full">
          
          <!-- 1. Guide Layer -->
          <div id="gatheringGuideView" class="absolute inset-0 w-full h-full z-10 overflow-y-auto custom-scroll pt-20 px-4 md:px-6 pb-6 transition-opacity duration-300 bg-albion-900">
             <div class="flex flex-col md:flex-row gap-6 h-full max-w-[1400px] mx-auto pb-8">
                <div class="w-full md:w-1/3 flex flex-col gap-3">
                  <h3 class="text-lg font-bold text-albion-accent mb-2"><span>${window.t('gathering-biomes', 'Biyomlar (Bölgeler)')}</span></h3>
                  ${biomeData.map((b, i) => `
                    <button class="biome-btn bg-albion-800 border border-gray-700 p-4 rounded-xl text-left hover:border-albion-accent transition-colors ${i === 0 ? 'border-albion-accent ring-1 ring-albion-accent shadow-md' : 'shadow-sm'}" data-id="${b.id}">
                      <div class="font-bold text-white text-lg">${b.name}</div>
                      <div class="text-xs text-gray-400 mt-1"><i class="fa-solid fa-city"></i> ${b.city}</div>
                      <div class="flex gap-2 mt-3">
                        <span class="bg-gray-900 p-1 px-2 rounded-md text-xs border border-gray-700 ${b.main.color}" title="Ana Kaynak">
                          <i class="fa-solid ${b.main.icon}"></i>
                        </span>
                        <span class="bg-gray-900 p-1 px-2 rounded-md text-xs border border-gray-700 ${b.sec1.color}" title="İkincil Kaynak">
                          <i class="fa-solid ${b.sec1.icon}"></i>
                        </span>
                        <span class="bg-gray-900 p-1 px-2 rounded-md text-xs border border-gray-700 ${b.sec2.color}" title="İkincil Kaynak">
                          <i class="fa-solid ${b.sec2.icon}"></i>
                        </span>
                      </div>
                    </button>
                  `).join('')}
                </div>
                <div class="flex-1 bg-albion-800 border border-gray-700 rounded-xl p-6 shadow-md" id="biomeDetails">
                  <!-- Rendered by JS -->
                </div>
             </div>
          </div>

          <!-- 2. Native Resource Finder Layer -->
          <div id="gatheringMapView" class="absolute inset-0 w-full h-full z-0 opacity-0 pointer-events-none transition-opacity duration-300 bg-albion-900 overflow-y-auto custom-scroll pt-20 px-4 md:px-6 pb-6">
             <div class="max-w-[1200px] mx-auto relative">
                
                <!-- Arama Kutusu ve Filtreler -->
                <div class="bg-albion-800 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-xl mb-6">
                   <div class="flex flex-col md:flex-row gap-6 items-center">
                      <div class="flex-1">
                         <h3 class="text-3xl font-black text-white mb-2 flex items-center">
                           <i class="fa-solid fa-magnifying-glass-location text-albion-accent mr-3"></i>
                           <span>${window.t('gathering-finderTitle', 'Ne Toplamak İstiyorsun?')}</span>
                         </h3>
                         <p class="text-gray-400 text-sm"><span>${window.t('gathering-finderDesc', 'Aradığın kaynağı ve seviyesini seç, sana en verimli haritaları doğrudan panelimizde listeleyelim.')}</span></p>
                      </div>
                   </div>

                   <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 bg-albion-900/50 p-4 rounded-xl border border-gray-700/50 shadow-inner">
                      <div class="flex flex-col">
                         <label class="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider"><i class="fa-solid fa-boxes-stacked mr-1"></i> ${window.t('gathering-resourceTarget', 'Hedef Kaynak')}</label>
                         <select id="finderResource" class="bg-albion-800 border border-gray-600 rounded-lg p-3 text-white focus:border-albion-accent outline-none transition-colors">
                           <option value="all">${window.t('gathering-optAll', 'Farketmez (Hepsi)')}</option>
                           <option value="Fiber (Lif)">Lif (Fiber)</option>
                           <option value="Wood (Odun)">Odun (Wood)</option>
                           <option value="Hide (Deri)">Deri (Hide)</option>
                           <option value="Ore (Maden)">Maden (Ore)</option>
                           <option value="Rock (Taş)">Taş (Rock)</option>
                         </select>
                      </div>
                      <div class="flex flex-col">
                         <label class="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider"><i class="fa-solid fa-layer-group mr-1"></i> ${window.t('gathering-tierTarget', 'Seviye (Tier)')}</label>
                         <select id="finderTier" class="bg-albion-800 border border-gray-600 rounded-lg p-3 text-white focus:border-albion-accent outline-none transition-colors">
                           <option value="all">${window.t('gathering-optAll', 'Farketmez (Hepsi)')}</option>
                           <option value="8">Tier 8 (T8)</option>
                           <option value="7">Tier 7 (T7)</option>
                           <option value="6">Tier 6 (T6)</option>
                           <option value="5">Tier 5 (T5)</option>
                         </select>
                      </div>
                      <div class="flex flex-col">
                         <label class="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider"><i class="fa-solid fa-shield-halved mr-1"></i> ${window.t('gathering-zoneTarget', 'Bölge Tipi')}</label>
                         <select id="finderZone" class="bg-albion-800 border border-gray-600 rounded-lg p-3 text-white focus:border-albion-accent outline-none transition-colors">
                           <option value="all">${window.t('gathering-optAll', 'Farketmez (Hepsi)')}</option>
                           <option value="safe">${window.t('gathering-optSafe', 'Güvenli (Yellow/Blue Zone)')}</option>
                           <option value="red">${window.t('gathering-optRed', 'Red Zone (Ölümcül)')}</option>
                           <option value="black">${window.t('gathering-optBlack', 'Black Zone (Ölümcül)')}</option>
                         </select>
                      </div>
                   </div>
                   
                   <button id="btnFindMaps" class="w-full mt-4 bg-albion-accent hover:bg-albion-accent_hover text-black font-black py-4 px-6 rounded-xl transition-transform hover:scale-[1.01] flex items-center justify-center shadow-lg uppercase tracking-wider text-lg">
                      <i class="fa-solid fa-radar mr-2"></i> ${window.t('gathering-findBtn', 'Haritaları Bul')}
                   </button>
                </div>

                <!-- Sonuçlar Bölümü -->
                <div id="finderResultsArea" class="hidden animate-fade-in space-y-6">
                   <div id="wrapperMainMaps" class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg">
                     <h4 id="titleMainMaps" class="text-albion-accent font-bold mb-4 uppercase text-sm border-b border-gray-700 pb-2 flex items-center">
                       <i class="fa-solid fa-star mr-2 text-lg"></i> ${window.t('gathering-resultsMain', 'Ana Kaynak Haritaları (En Verimli)')}
                     </h4>
                     <div id="gridMainMaps" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
                   </div>

                   <div id="wrapperSecMaps" class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg">
                     <h4 class="text-gray-300 font-bold mb-4 uppercase text-sm border-b border-gray-700 pb-2 flex items-center">
                       <i class="fa-solid fa-star-half-stroke mr-2 text-lg"></i> ${window.t('gathering-resultsSec', 'İkincil Kaynak Haritaları (Alternatif)')}
                     </h4>
                     <div id="gridSecMaps" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
                   </div>
                </div>

                <!-- Harita İstihbarat (Detay) Modalı -->
                <div id="mapDetailModal" class="fixed inset-0 bg-black/90 z-[100] hidden flex-col items-center justify-center p-4 backdrop-blur-sm transition-opacity">
                  <div class="bg-albion-800 border border-albion-700 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
                     <div class="bg-albion-900 border-b border-gray-700 p-5 flex justify-between items-center relative overflow-hidden">
                       <div class="absolute right-0 top-0 w-32 h-32 bg-albion-accent/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                       <div class="flex items-center z-10">
                         <div class="w-12 h-12 rounded bg-black/50 border border-albion-accent flex items-center justify-center mr-4">
                            <i class="fa-solid fa-map-location-dot text-2xl text-albion-accent"></i>
                         </div>
                         <div>
                            <h3 id="modalMapName" class="text-2xl font-black text-white tracking-wide">Map Name</h3>
                            <div class="text-sm text-gray-400 mt-1 font-bold flex items-center gap-3">
                              <span id="modalMapTier" class="bg-gray-800 px-2 rounded border border-gray-600 text-white">Tier X</span>
                              <span id="modalMapZone" class="flex items-center">Zone</span>
                            </div>
                         </div>
                       </div>
                       <button id="closeMapModalBtn" class="text-gray-500 hover:text-white bg-black/30 p-2 rounded-lg transition-colors z-10">
                         <i class="fa-solid fa-xmark text-xl"></i>
                       </button>
                     </div>
                     
                     <div class="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-albion-800 to-albion-900 flex flex-col lg:flex-row gap-8">
                       
                       <!-- Sol Kolon: Radar Görseli -->
                       <div class="w-full lg:w-1/3 flex flex-col items-center">
                          <h4 class="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4"><i class="fa-solid fa-satellite-dish mr-1"></i> ${window.t('gathering-radar', 'Bölge Radarı')}</h4>
                          
                          <div class="relative w-48 h-48 md:w-56 md:h-56 bg-[#0a0d14] rounded-full border-4 border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center">
                             <!-- Grid Çizgileri -->
                             <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:15px_15px]"></div>
                             <!-- İç Halkalar -->
                             <div class="absolute w-3/4 h-3/4 rounded-full border border-albion-accent/20"></div>
                             <div class="absolute w-2/4 h-2/4 rounded-full border border-albion-accent/20"></div>
                             <div class="absolute w-1/4 h-1/4 rounded-full border border-albion-accent/20"></div>
                             
                             <!-- Radar Tarama Efekti -->
                             <div class="absolute w-1/2 h-1/2 bg-gradient-to-tr from-albion-accent/40 to-transparent rounded-tl-full animate-[spin_3s_linear_infinite] origin-bottom-right top-0 left-0"></div>
                             
                             <!-- Dinamik Noktalar -->
                             <div class="absolute top-1/4 left-1/3 w-2 h-2 bg-albion-accent rounded-full animate-ping"></div>
                             <div class="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-albion-accent rounded-full animate-ping" style="animation-delay: 0.5s"></div>
                             <div class="absolute top-1/2 left-3/4 w-2 h-2 bg-green-400 rounded-full animate-ping" style="animation-delay: 1.2s"></div>
                          </div>
                          
                          <div class="mt-4 text-center text-[10px] text-gray-500 italic px-4">
                             *Kaynakların (node) tam koordinatları oyun tarafından her gün rastgele (dinamik) olarak değiştirilmektedir.
                          </div>
                       </div>

                       <!-- Sağ Kolon: AO2D Benzeri Detaylı Kaynak Nodu Tablosu -->
                       <div class="w-full lg:w-2/3 flex flex-col">
                          <h4 class="text-sm text-albion-accent font-bold uppercase tracking-wider mb-4 border-b border-gray-700 pb-2"><i class="fa-solid fa-list-ol mr-2"></i> ${window.t('gathering-nodeCounts', 'Tahmini Kaynak Noktası (Node) Dağılımı')}</h4>
                          
                          <div id="modalResourceList" class="flex flex-col gap-4">
                             <!-- Javascript dolduracak -->
                          </div>

                       </div>
                     </div>
                  </div>
                </div>

             </div>
          </div>
          
       </div>
    </div>
  `;

  // --- REHBER (GUIDE) LOGIC ---
  const btns = document.querySelectorAll('.biome-btn');
  const detailsArea = document.getElementById('biomeDetails');

  function renderDetails(id) {
    const biome = biomeData.find(b => b.id === id);
    if (!biome) return;

    detailsArea.innerHTML = `
      <h2 class="text-3xl font-bold text-white mb-2">${biome.name}</h2>
      <div class="text-albion-accent font-semibold mb-6">Bağlı Şehir: ${biome.city}</div>
      <p class="text-gray-300 mb-8 leading-relaxed">${biome.desc}</p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-albion-900 border-2 border-albion-accent p-4 rounded-xl text-center shadow-lg">
          <div class="text-sm text-gray-400 mb-2"><span>${window.t('gathering-mainResource', 'Ana Kaynak (Sık Bulunur)')}</span></div>
          <i class="fa-solid ${biome.main.icon} text-4xl ${biome.main.color} mb-3"></i>
          <div class="font-bold text-white">${biome.main.type}</div>
        </div>
        <div class="bg-albion-900 border border-gray-700 p-4 rounded-xl text-center">
          <div class="text-sm text-gray-400 mb-2"><span>${window.t('gathering-secResource', 'İkincil Kaynak')}</span></div>
          <i class="fa-solid ${biome.sec1.icon} text-4xl ${biome.sec1.color} mb-3"></i>
          <div class="font-bold text-white">${biome.sec1.type}</div>
        </div>
        <div class="bg-albion-900 border border-gray-700 p-4 rounded-xl text-center">
          <div class="text-sm text-gray-400 mb-2"><span>${window.t('gathering-secResource', 'İkincil Kaynak')}</span></div>
          <i class="fa-solid ${biome.sec2.icon} text-4xl ${biome.sec2.color} mb-3"></i>
          <div class="font-bold text-white">${biome.sec2.type}</div>
        </div>
      </div>

      <div class="bg-albion-900 rounded-lg p-5 border border-gray-700 shadow-inner">
        <h4 class="font-bold text-white mb-3"><span>${window.t('gathering-advice', 'Toplayıcı Tavsiyeleri')}</span></h4>
        <ul class="list-disc pl-5 space-y-2 text-sm text-gray-300">
          <li><strong>Tier Seçimi:</strong> Harita seviyesine (Tier) uygun alet kullandığınızdan emin olun (Örn: T6 haritada en az T5, tercihen T6 alet).</li>
          <li><strong>Avalon Yolları:</strong> Toplayıcılık için Avalon yollarındaki portal haritalarını inceleyerek rekabetin az olduğu noktalara geçiş yapabilirsiniz.</li>
          <li><strong>Black Zone Riski:</strong> Outlands (Siyah Bölgeler) daha yüksek getiri (Enchant rate) sağlar ancak PvP açıktır. Kaçış buildleri (Örn: Bloodletter, Double Bladed Staff) kullanın.</li>
          <li><strong class="text-albion-accent">Gelişmiş Harita Bulucu:</strong> Hedeflediğiniz kaynak türüne göre oyundaki en iyi haritaları bulmak için yukarıdaki sekmeyi kullanabilirsiniz.</li>
        </ul>
      </div>
    `;
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => {
        b.classList.remove('border-albion-accent', 'ring-1', 'ring-albion-accent', 'shadow-md');
        b.classList.add('shadow-sm');
      });
      btn.classList.remove('shadow-sm');
      btn.classList.add('border-albion-accent', 'ring-1', 'ring-albion-accent', 'shadow-md');
      renderDetails(btn.getAttribute('data-id'));
    });
  });

  renderDetails('swamp');

  // --- SEKME (TOGGLE) LOGIC ---
  const btnGuide = document.getElementById('btnGatheringGuide');
  const btnMap = document.getElementById('btnGatheringMap');
  const viewGuide = document.getElementById('gatheringGuideView');
  const viewMap = document.getElementById('gatheringMapView');

  btnGuide.addEventListener('click', () => {
     btnGuide.classList.replace('bg-transparent', 'bg-albion-accent');
     btnGuide.classList.replace('text-gray-400', 'text-black');
     btnMap.classList.replace('bg-albion-accent', 'bg-transparent');
     btnMap.classList.replace('text-black', 'text-gray-400');
     
     viewGuide.classList.replace('z-0', 'z-10');
     viewGuide.classList.remove('pointer-events-none');
     viewGuide.classList.remove('opacity-0');
     
     viewMap.classList.replace('z-10', 'z-0');
     viewMap.classList.add('pointer-events-none');
     viewMap.classList.add('opacity-0');
  });

  btnMap.addEventListener('click', () => {
     btnMap.classList.replace('bg-transparent', 'bg-albion-accent');
     btnMap.classList.replace('text-gray-400', 'text-black');
     btnGuide.classList.replace('bg-albion-accent', 'bg-transparent');
     btnGuide.classList.replace('text-black', 'text-gray-400');
     
     viewMap.classList.replace('z-0', 'z-10');
     viewMap.classList.remove('pointer-events-none');
     viewMap.classList.remove('opacity-0');
     
     viewGuide.classList.replace('z-10', 'z-0');
     viewGuide.classList.add('pointer-events-none');
     viewGuide.classList.add('opacity-0');
  });

  // --- NATIVE RESOURCE FINDER & MODAL LOGIC ---
  const btnFindMaps = document.getElementById('btnFindMaps');
  const mapModal = document.getElementById('mapDetailModal');
  const closeMapModalBtn = document.getElementById('closeMapModalBtn');
  
  if (closeMapModalBtn) {
    closeMapModalBtn.addEventListener('click', () => {
      mapModal.classList.add('hidden');
      mapModal.classList.remove('flex');
    });
  }

  // A simple hash function to generate consistent pseudo-random numbers from a map ID
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  // Tüm kaynak türleri listesi
  const ALL_RESOURCES = [
    { type: "Fiber (Lif)", name: "Lif", icon: "fa-seedling", color: "text-green-400" },
    { type: "Wood (Odun)", name: "Odun", icon: "fa-tree", color: "text-yellow-600" },
    { type: "Hide (Deri)", name: "Deri", icon: "fa-paw", color: "text-orange-400" },
    { type: "Ore (Maden)", name: "Maden", icon: "fa-cubes", color: "text-blue-300" },
    { type: "Rock (Taş)", name: "Taş", icon: "fa-gem", color: "text-gray-400" }
  ];

  // Tıklandığında İstihbarat Ekranını Açar
  window.openMapDetail = function(mapId) {
     const m = mapDatabase.find(x => x.id === mapId);
     if(!m) return;
     const bData = biomeData.find(b => b.id === m.biome);

     document.getElementById('modalMapName').innerText = m.name;
     document.getElementById('modalMapTier').innerText = `Tier ${m.tier}`;
     
     let zoneHtml = '';
     if (m.type === 'Yellow Zone') {
        zoneHtml = `<span class="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-2 py-0.5 rounded text-xs font-bold"><i class="fa-solid fa-shield-halved mr-1"></i>Güvenli (Yellow Zone)</span>`;
     } else if (m.type === 'Red Zone') {
        zoneHtml = `<span class="bg-red-500/20 text-red-400 border border-red-500/50 px-2 py-0.5 rounded text-xs font-bold"><i class="fa-solid fa-skull mr-1"></i>PVP (Red Zone)</span>`;
     } else {
        zoneHtml = `<span class="bg-purple-500/20 text-purple-400 border border-purple-500/50 px-2 py-0.5 rounded text-xs font-bold"><i class="fa-solid fa-skull mr-1"></i>PVP (Black Zone)</span>`;
     }
     document.getElementById('modalMapZone').innerHTML = zoneHtml;

     // AO2D benzeri Kaynak Noktası (Node) hesaplaması
     // Her haritanın kendi ID'sine özel tutarlı bir ana node havuzu vardır (400-600 arası)
     const baseNodeCount = 400 + (hashString(m.id) % 200); 
     
     const tBase = m.tier;
     const tMinus1 = Math.max(tBase - 1, 1);
     const tMinus2 = Math.max(tBase - 2, 1);

     // Dağılım: Kendi Tier'ı = %10, Bir altı = %30, İki altı = %60
     const pctBase = 0.10;
     const pctMinus1 = 0.30;
     const pctMinus2 = 0.60;

     let tableRows = '';

     ALL_RESOURCES.forEach(res => {
        let multiplier = 0;
        let isMain = false;
        
        if (bData.main.type === res.type) { multiplier = 1.0; isMain = true; }
        else if (bData.sec1.type === res.type) multiplier = 0.6;
        else if (bData.sec2.type === res.type) multiplier = 0.3;

        // Hesaplanan nokta sayıları
        const cBase = Math.floor(baseNodeCount * multiplier * pctBase);
        const cMinus1 = Math.floor(baseNodeCount * multiplier * pctMinus1);
        const cMinus2 = Math.floor(baseNodeCount * multiplier * pctMinus2);
        const total = cBase + cMinus1 + cMinus2;

        const opacityClass = total === 0 ? 'opacity-30' : '';
        const highlightClass = isMain ? 'bg-albion-accent/10 border-l-2 border-albion-accent' : 'border-b border-gray-800/50 hover:bg-white/5 transition-colors';

        tableRows += `
          <tr class="${highlightClass} ${opacityClass}">
            <td class="p-3">
              <div class="flex items-center">
                 <div class="w-8 h-8 rounded bg-black/40 border border-gray-700 flex items-center justify-center mr-3">
                    <i class="fa-solid ${res.icon} ${res.color}"></i>
                 </div>
                 <div class="font-bold text-white text-sm">${res.name}</div>
              </div>
            </td>
            <td class="p-3 text-center font-mono text-albion-accent">${total === 0 ? '-' : cBase}</td>
            <td class="p-3 text-center font-mono text-green-400">${total === 0 ? '-' : cMinus1}</td>
            <td class="p-3 text-center font-mono text-gray-400">${total === 0 ? '-' : cMinus2}</td>
            <td class="p-3 text-center font-black text-white text-lg">${total}</td>
          </tr>
        `;
     });

     const listHtml = `
        <div class="bg-[#0f141d] border border-gray-700 rounded-xl overflow-hidden shadow-lg">
           <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-gray-300">
                 <thead class="bg-black/60 text-xs uppercase text-gray-400 border-b border-gray-700">
                    <tr>
                       <th class="p-4 font-bold tracking-wider">${window.t('gathering-resTableType', 'Kaynak Tipi')}</th>
                       <th class="p-4 text-center font-bold tracking-wider">T${tBase}</th>
                       <th class="p-4 text-center font-bold tracking-wider">T${tMinus1}</th>
                       <th class="p-4 text-center font-bold tracking-wider">T${tMinus2}</th>
                       <th class="p-4 text-center font-bold tracking-wider text-white">${window.t('gathering-resTableTotal', 'Toplam')}</th>
                    </tr>
                 </thead>
                 <tbody>
                    ${tableRows}
                 </tbody>
              </table>
           </div>
        </div>
        <div class="mt-4 text-xs text-gray-500 italic flex items-center">
           <i class="fa-solid fa-circle-info mr-2 text-albion-accent"></i>
           * Değerler oyun motoru yapısına göre hesaplanmış tahmini node (kaynak noktası) sayılarını göstermektedir.
        </div>
     `;
     document.getElementById('modalResourceList').innerHTML = listHtml;

     mapModal.classList.remove('hidden');
     mapModal.classList.add('flex');
  };

  if(btnFindMaps) {
    btnFindMaps.addEventListener('click', () => {
       const resTarget = document.getElementById('finderResource').value;
       const tierTarget = document.getElementById('finderTier').value;
       const zoneTarget = document.getElementById('finderZone').value;

       const resArea = document.getElementById('finderResultsArea');
       const gridMain = document.getElementById('gridMainMaps');
       const gridSec = document.getElementById('gridSecMaps');
       const wrapperSec = document.getElementById('wrapperSecMaps');
       const titleMain = document.getElementById('titleMainMaps');

       const mainBiomes = [];
       const secBiomes = [];

       biomeData.forEach(b => {
          if (resTarget === 'all') {
             mainBiomes.push(b);
          } else {
             if (b.main.type === resTarget) mainBiomes.push(b);
             if (b.sec1.type === resTarget || b.sec2.type === resTarget) secBiomes.push(b);
          }
       });

       const filterMaps = (biomes) => {
          const validBiomeIds = biomes.map(b => b.id);
          return mapDatabase.filter(m => {
             if (!validBiomeIds.includes(m.biome)) return false;
             if (tierTarget !== 'all' && m.tier !== parseInt(tierTarget)) return false;
             
             if (zoneTarget === 'safe' && m.type !== 'Yellow Zone') return false;
             if (zoneTarget === 'red' && m.type !== 'Red Zone') return false;
             if (zoneTarget === 'black' && m.type !== 'Black Zone') return false;
             
             return true;
          });
       };

       const sortLogic = (a, b) => b.tier - a.tier || a.name.localeCompare(b.name);

       const mainResults = filterMaps(mainBiomes).sort(sortLogic);
       const secResults = resTarget === 'all' ? [] : filterMaps(secBiomes).sort(sortLogic);

       if (resTarget === 'all') {
          wrapperSec.classList.add('hidden');
          titleMain.innerHTML = `<i class="fa-solid fa-map mr-2 text-lg"></i> ${window.t('gathering-resultsAll', 'Filtrelenen Tüm Haritalar')}`;
       } else {
          wrapperSec.classList.remove('hidden');
          titleMain.innerHTML = `<i class="fa-solid fa-star mr-2 text-lg"></i> ${window.t('gathering-resultsMain', 'Ana Kaynak Haritaları (En Verimli)')}`;
       }

       const getName = (typeStr) => {
          const m = typeStr.match(/\(([^)]+)\)/);
          return m ? m[1] : typeStr;
       };

       const createMapCard = (m, isMain) => {
          const bData = biomeData.find(b => b.id === m.biome);
          
          const resHtml = `
            <div class="flex gap-2 mt-3 justify-center bg-black/30 p-2 rounded-lg border border-gray-700">
              <span class="flex flex-col items-center" title="Ana Kaynak"><i class="fa-solid ${bData.main.icon} ${bData.main.color} text-lg mb-1"></i><span class="text-[10px] text-albion-accent font-bold uppercase tracking-wider">${getName(bData.main.type)}</span></span>
              <span class="w-px bg-gray-700 mx-1"></span>
              <span class="flex flex-col items-center" title="İkincil Kaynak"><i class="fa-solid ${bData.sec1.icon} ${bData.sec1.color} text-lg mb-1"></i><span class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">${getName(bData.sec1.type)}</span></span>
              <span class="w-px bg-gray-700 mx-1"></span>
              <span class="flex flex-col items-center" title="İkincil Kaynak"><i class="fa-solid ${bData.sec2.icon} ${bData.sec2.color} text-lg mb-1"></i><span class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">${getName(bData.sec2.type)}</span></span>
            </div>
          `;

          let dangerBadge = '';
          if (m.type === 'Yellow Zone') {
             dangerBadge = `<span class="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-shield-halved mr-1"></i>Güvenli</span>`;
          } else if (m.type === 'Red Zone') {
             dangerBadge = `<span class="bg-red-500/20 text-red-400 border border-red-500/50 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-skull mr-1"></i>Red Zone</span>`;
          } else {
             dangerBadge = `<span class="bg-purple-500/20 text-purple-400 border border-purple-500/50 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-skull mr-1"></i>Black Zone</span>`;
          }

          const borderColor = isMain ? 'border-albion-accent shadow-[0_0_10px_rgba(212,175,55,0.1)]' : 'border-gray-600';

          return `
            <div class="bg-albion-900 border ${borderColor} p-4 rounded-xl shadow-md hover:-translate-y-1 transition-transform flex flex-col items-center text-center cursor-pointer group relative overflow-hidden" data-mapid="${m.id}">
              
              <div class="absolute inset-0 bg-albion-accent/10 opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none"></div>
              
              <div class="relative z-10 w-full flex flex-col items-center">
                 <div class="text-xl font-black text-white mb-1 drop-shadow-md group-hover:text-albion-accent transition-colors">${m.name}</div>
                 <div class="text-xs text-gray-400 font-bold mb-3">${bData.name}</div>
                 <div class="flex gap-2 justify-center mb-1">
                    <span class="bg-gray-800 text-white border border-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">Tier ${m.tier}</span>
                    ${dangerBadge}
                 </div>
                 ${resHtml}
                 
                 <div class="mt-4 w-full bg-black/40 text-[10px] text-gray-400 font-bold uppercase tracking-widest py-1.5 rounded border border-gray-700 group-hover:border-albion-accent/50 group-hover:text-white transition-colors">
                    <i class="fa-solid fa-crosshairs mr-1"></i> ${window.t('gathering-clickDetails', 'Detaylar için tıkla')}
                 </div>
              </div>
            </div>
          `;
       };

       gridMain.innerHTML = mainResults.length > 0 
          ? mainResults.map(m => createMapCard(m, resTarget !== 'all')).join('')
          : `<div class="col-span-full p-4 text-center text-gray-500 bg-black/20 rounded-lg border border-gray-700"><i class="fa-solid fa-ghost text-2xl mb-2 opacity-50"></i><br>${window.t('gathering-noResult', 'Bu kriterlere uygun harita bulunamadı.')}</div>`;

       gridSec.innerHTML = secResults.length > 0 
          ? secResults.map(m => createMapCard(m, false)).join('')
          : `<div class="col-span-full p-4 text-center text-gray-500 bg-black/20 rounded-lg border border-gray-700">${window.t('gathering-noResult', 'Bu kriterlere uygun harita bulunamadı.')}</div>`;

       resArea.classList.remove('hidden');
    });
  }

  const resultsArea = document.getElementById('finderResultsArea');
  if (resultsArea) {
    resultsArea.addEventListener('click', (e) => {
      const card = e.target.closest('[data-mapid]');
      if (card) {
        const mapId = card.getAttribute('data-mapid');
        if (typeof window.openMapDetail === 'function') {
          window.openMapDetail(mapId);
        }
      }
    });
  }

});
