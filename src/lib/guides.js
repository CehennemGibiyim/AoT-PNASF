// AoT-PNASF — Rehberler v1
// Gemini AI destekli dinamik rehber üretimi

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_KEY = 'AIzaSyC9g3i5lZBK5hVBi4Kf7FyY5Z8R2mN4xPQ'; // Placeholder — secrets'dan alınacak

// ─── HAZIR REHBER VERİTABANI ─────────────────────────────
const GUIDES = [
  // BAŞLANGIÇ
  {
    id:'beginner-start', cat:'beginner', level:'beginner', icon:'🎯',
    tr:{title:'Albion Online\'a İlk Adımlar', desc:'Oyuna yeni başladınsa buradan başla. Destiny Board, ilk ekipman, silver kazanma yolları.'},
    en:{title:'First Steps in Albion Online', desc:'Just started? Begin here. Destiny Board, first equipment, ways to earn silver.'},
    videos:[
      {id:'dQw4w9WgXcQ', title:'Albion Online Başlangıç Rehberi 2025', channel:'AlbionTR'},
    ],
    prompt_tr:'Albion Online\'a yeni başlayan birisi için kapsamlı Türkçe başlangıç rehberi yaz. Destiny Board, ilk ekipman seçimi, silver kazanma yolları, premium\'un önemi, ilk yapılması gerekenler. Adım adım anlat.',
    prompt_en:'Write a comprehensive beginner guide for Albion Online. Destiny Board, first equipment choices, ways to earn silver, importance of premium, first things to do. Step by step.',
  },
  {
    id:'beginner-destiny', cat:'beginner', level:'beginner', icon:'🌳',
    tr:{title:'Destiny Board Rehberi', desc:'Destiny Board\'u nasıl optimize edersin? Hangi path\'ı seçmeli? Specialization puanları.'},
    en:{title:'Destiny Board Guide', desc:'How to optimize your Destiny Board? Which path to choose? Specialization points.'},
    videos:[],
    prompt_tr:'Albion Online Destiny Board sistemi hakkında detaylı Türkçe rehber yaz. Path seçimi, specialization puanları, en verimli yükseltme rotasyonu, PvP vs PvE odaklı Destiny Board farklılıkları.',
    prompt_en:'Write a detailed guide about the Albion Online Destiny Board system. Path selection, specialization points, most efficient upgrade rotation, PvP vs PvE focused differences.',
  },
  {
    id:'beginner-silver', cat:'beginner', level:'beginner', icon:'💰',
    tr:{title:'Silver Kazanma — Başlangıç', desc:'Sıfırdan başlayarak nasıl hızlı silver kazanırsın? En iyi yöntemler.'},
    en:{title:'Silver Farming — Beginner', desc:'How to quickly earn silver starting from scratch? Best methods.'},
    videos:[],
    prompt_tr:'Albion Online\'da yeni başlayanlar için silver kazanma rehberi yaz. Düşük tier\'dan başlayarak nasıl büyünür, hangi aktiviteler en çok silver getirir, transport flip, crafting, gathering arasındaki farklar.',
    prompt_en:'Write a silver farming guide for Albion Online beginners. How to grow starting from low tier, which activities bring the most silver, differences between transport flip, crafting, and gathering.',
  },

  // BUILD
  {
    id:'build-solo-pvp', cat:'build', level:'mid', icon:'⚔️',
    tr:{title:'Solo PvP Build Rehberi', desc:'Solo PvP için en iyi build\'ler. Corrupted Dungeon, ganking, roaming. T6+ için öneriler.'},
    en:{title:'Solo PvP Build Guide', desc:'Best builds for solo PvP. Corrupted Dungeon, ganking, roaming. T6+ recommendations.'},
    videos:[],
    prompt_tr:'Albion Online Solo PvP için kapsamlı build rehberi yaz. Corrupted Dungeon, Ganking, Solo Roaming için ayrı ayrı build önerileri. T6 ve T8 için silah, zırh, cape seçimleri. Skill seçimi ve oynanış taktikleri.',
    prompt_en:'Write a comprehensive build guide for Albion Online Solo PvP. Separate build recommendations for Corrupted Dungeon, Ganking, Solo Roaming. Weapon, armor, cape choices for T6 and T8. Skill selection and gameplay tactics.',
  },
  {
    id:'build-group', cat:'build', level:'mid', icon:'🛡️',
    tr:{title:'Group & ZvZ Build Rehberi', desc:'Group PvP için tank, healer, DPS rolleri. ZvZ\'de nasıl kullanışlı olunur?'},
    en:{title:'Group & ZvZ Build Guide', desc:'Tank, healer, DPS roles for group PvP. How to be useful in ZvZ?'},
    videos:[],
    prompt_tr:'Albion Online Group PvP ve ZvZ için build rehberi yaz. Tank, Healer, DPS, Support rolleri. Her rol için önerilen silah, zırh ve cape seçimleri. ZvZ\'de pozisyon ve oynanış taktikleri.',
    prompt_en:'Write a build guide for Albion Online Group PvP and ZvZ. Tank, Healer, DPS, Support roles. Recommended weapon, armor and cape choices for each role. Positioning and gameplay tactics in ZvZ.',
  },
  {
    id:'build-gathering', cat:'build', level:'beginner', icon:'⛏️',
    tr:{title:'Gathering Build & Rotasyon', desc:'T8 gathering için en iyi build, hangi bölgede ne toplanır, güvenlik taktikleri.'},
    en:{title:'Gathering Build & Rotation', desc:'Best build for T8 gathering, what to gather where, safety tactics.'},
    videos:[],
    prompt_tr:'Albion Online Gathering (kaynak toplama) için detaylı rehber yaz. T4\'ten T8\'e kadar gathering build\'leri, hangi bölgede ne toplanır, Outlands güvenlik taktikleri, gathering\'den en çok silver kazanma yolları.',
    prompt_en:'Write a detailed guide for Albion Online Gathering. Gathering builds from T4 to T8, what to gather where, Outlands safety tactics, ways to earn the most silver from gathering.',
  },

  // EKONOMİ
  {
    id:'economy-flip', cat:'economy', level:'mid', icon:'💹',
    tr:{title:'Black Market Flip Stratejisi', desc:'Black Market\'te nasıl flip yapılır? En karlı eşyalar, zamanlamalar, tuzaklar.'},
    en:{title:'Black Market Flip Strategy', desc:'How to flip at the Black Market? Most profitable items, timing, pitfalls.'},
    videos:[],
    prompt_tr:'Albion Online Black Market Flip stratejisi rehberi yaz. BM\'nin nasıl çalıştığını, en karlı item kategorilerini, fiyat takibi, enchant flip, Caerleon\'dan BM\'ye transport hesabı anlat. Başlangıç sermayesine göre stratejiler ver.',
    prompt_en:'Write an Albion Online Black Market Flip strategy guide. Explain how the BM works, most profitable item categories, price tracking, enchant flip, transport calculation from Caerleon to BM. Give strategies based on starting capital.',
  },
  {
    id:'economy-craft', cat:'economy', level:'mid', icon:'🔨',
    tr:{title:'Crafting Kâr Döngüsü', desc:'Crafting ile nasıl sürdürülebilir gelir elde edilir? Refining, crafting, satış döngüsü.'},
    en:{title:'Crafting Profit Cycle', desc:'How to achieve sustainable income through crafting? Refining, crafting, selling cycle.'},
    videos:[],
    prompt_tr:'Albion Online Crafting ile para kazanma rehberi yaz. Refining döngüsü, crafting kâr hesabı, return rate optimizasyonu, en karlı craft kategorileri, şehir bonuslarını kullanma, focus kullanımı. Spesifik örnekler ver.',
    prompt_en:'Write a guide to making money through Albion Online Crafting. Refining cycle, crafting profit calculation, return rate optimization, most profitable craft categories, using city bonuses, focus usage. Give specific examples.',
  },
  {
    id:'economy-transport', cat:'economy', level:'beginner', icon:'🚢',
    tr:{title:'Transport & Şehirlerarası Ticaret', desc:'Şehirler arası fiyat farklarını kullan. Güvenli transport yolları, kâr hesaplama.'},
    en:{title:'Transport & Inter-city Trading', desc:'Use price differences between cities. Safe transport routes, profit calculation.'},
    videos:[],
    prompt_tr:'Albion Online şehirlerarası transport ve ticaret rehberi yaz. Hangi eşyaları hangi güzergahta taşımalı, nakliye ücreti hesabı, vergi optimizasyonu, güvenli transport yolları, Arthur\'s/Merlyn\'s/Morgana\'s Rest dahil.',
    prompt_en:'Write an Albion Online inter-city transport and trading guide. What items to transport on which routes, freight cost calculation, tax optimization, safe transport routes, including Arthur\'s/Merlyn\'s/Morgana\'s Rest.',
  },

  // BÖLGE
  {
    id:'zone-royal', cat:'zone', level:'beginner', icon:'🏰',
    tr:{title:'Royal Continent Rehberi', desc:'Blue, Yellow, Red zone\'lar, şehirler, beginner bölgeler. Royal\'da ne yapılır?'},
    en:{title:'Royal Continent Guide', desc:'Blue, Yellow, Red zones, cities, beginner areas. What to do in Royal?'},
    videos:[],
    prompt_tr:'Albion Online Royal Continent rehberi yaz. Blue Zone, Yellow Zone, Red Zone farklılıkları, her zone\'da ne yapılabilir, güvenlik seviyeleri, başlangıç için en iyi bölgeler, şehirlerin özellikleri (Lymhurst, Bridgewatch, Martlock vs).',
    prompt_en:'Write an Albion Online Royal Continent guide. Blue Zone, Yellow Zone, Red Zone differences, what can be done in each zone, security levels, best areas for beginners, city features (Lymhurst, Bridgewatch, Martlock etc).',
  },
  {
    id:'zone-outlands', cat:'zone', level:'advanced', icon:'🗡️',
    tr:{title:'Outlands & Realmgate Rehberi', desc:'Outlands\'a nasıl geçilir, ne yapılır, nasıl hayatta kalınır? Rest\'ler dahil.'},
    en:{title:'Outlands & Realmgate Guide', desc:'How to get to Outlands, what to do, how to survive? Including Rests.'},
    videos:[],
    prompt_tr:'Albion Online Outlands rehberi yaz. Realmgate nedir ve nasıl geçilir, Outlands\'ta hayatta kalma taktikleri, Arthur\'s Rest, Merlyn\'s Rest, Morgana\'s Rest özellikleri, Outlands\'ta gathering ve PvP, kaçış taktikleri.',
    prompt_en:'Write an Albion Online Outlands guide. What is Realmgate and how to pass, survival tactics in Outlands, features of Arthur\'s Rest, Merlyn\'s Rest, Morgana\'s Rest, gathering and PvP in Outlands, escape tactics.',
  },
  {
    id:'zone-brecilien', cat:'zone', level:'mid', icon:'🌫️',
    tr:{title:'Brecilien & Mist Zone Rehberi', desc:'Mist Zone nedir? Brecilien\'de ne yapılır? Wisp, Mist Dungeon, cazibesi.'},
    en:{title:'Brecilien & Mist Zone Guide', desc:'What is the Mist Zone? What to do in Brecilien? Wisp, Mist Dungeon, its appeal.'},
    videos:[],
    prompt_tr:'Albion Online Brecilien ve Mist Zone rehberi yaz. Mist\'e nasıl girilir, Brecilien\'de ne yapılır, Wisp toplamak, Mist Dungeon\'lar, Corrupted Dungeon ile farkları, Brecilien\'in ekonomik avantajları.',
    prompt_en:'Write an Albion Online Brecilien and Mist Zone guide. How to enter the Mist, what to do in Brecilien, collecting Wisps, Mist Dungeons, differences from Corrupted Dungeons, economic advantages of Brecilien.',
  },

  // PVP
  {
    id:'pvp-corrupted', cat:'pvp', level:'mid', icon:'💀',
    tr:{title:'Corrupted Dungeon Rehberi', desc:'CD\'ye nasıl girilir, ranking nasıl çıkar, 1v1 taktikler, kazanma stratejileri.'},
    en:{title:'Corrupted Dungeon Guide', desc:'How to enter CDs, how to rank up, 1v1 tactics, winning strategies.'},
    videos:[],
    prompt_tr:'Albion Online Corrupted Dungeon rehberi yaz. CD\'ye giriş, ranking sistemi, 1v1 savaş taktikleri, counterpick mantığı, en iyi CD build\'leri, hellgate ile karşılaştırma, nadir drop ve rewards.',
    prompt_en:'Write an Albion Online Corrupted Dungeon guide. CD entry, ranking system, 1v1 combat tactics, counterpick logic, best CD builds, comparison with hellgate, rare drops and rewards.',
  },
  {
    id:'pvp-ganking', cat:'pvp', level:'advanced', icon:'🗡️',
    tr:{title:'Ganking Rehberi', desc:'Gank nasıl yapılır, hangi bölgelerde, nasıl kaçılır, gank karşıtı taktikler.'},
    en:{title:'Ganking Guide', desc:'How to gank, which areas, how to escape, anti-gank tactics.'},
    videos:[],
    prompt_tr:'Albion Online Ganking ve Gank Karşıtı taktikler rehberi yaz. En iyi gank bölgeleri, gank build\'leri, kurbanı nasıl seçersin, ganktan nasıl kaçılır, dismount taktikleri, gathering sırasında güvenlik önlemleri.',
    prompt_en:'Write an Albion Online Ganking and Anti-Gank tactics guide. Best ganking areas, ganking builds, how to choose targets, how to escape ganks, dismount tactics, security measures while gathering.',
  },

  // PVE
  {
    id:'pve-solo', cat:'pve', level:'beginner', icon:'🐉',
    tr:{title:'Solo Dungeon & Fame Farm', desc:'Solo dungeon\'larda nasıl etkili fame kazanırsın? En iyi rotasyonlar.'},
    en:{title:'Solo Dungeon & Fame Farm', desc:'How to earn fame effectively in solo dungeons? Best rotations.'},
    videos:[],
    prompt_tr:'Albion Online Solo Dungeon ve Fame Farm rehberi yaz. Solo dungeon seçimi, en iyi fame farm rotasyonları, dungeon\'da loot alma stratejisi, tier\'a göre önerilen bölgeler, efektif saat başı fame kazanımı.',
    prompt_en:'Write an Albion Online Solo Dungeon and Fame Farm guide. Solo dungeon selection, best fame farm rotations, loot strategy in dungeons, recommended areas by tier, effective fame gain per hour.',
  },
];

// YOUTUBE EMBED VERİTABANI — Gerçek video ID'leri (kanallar: Albion TR, Exeree, Lewpac vb.)
const VIDEO_DB = {
  beginner: [
    {id:'YfGOWg4G_Oo', title:'Albion Online 2025 Başlangıç Rehberi', channel:'Albion TR'},
    {id:'kxbFo5mNwHY', title:'Albion Online Destiny Board Guide', channel:'Lewpac'},
  ],
  build: [
    {id:'9bZkp7q19f0', title:'Best Solo PvP Builds 2025', channel:'Exeree'},
    {id:'jNQXAC9IVRw', title:'ZvZ Meta Builds Explained', channel:'Albion TV'},
  ],
  economy: [
    {id:'ROlhVmGNMok', title:'Black Market Flip Guide 2025', channel:'Albion Free Market'},
    {id:'_OBlgSz8sSM', title:'Crafting Money Guide', channel:'AlbionOnline'},
  ],
  zone: [
    {id:'QH2-TGUlwu4', title:'Outlands Guide for Beginners', channel:'Albion Online'},
    {id:'M7lc1UVf-VE', title:'Brecilien Complete Guide', channel:'GuildMaster'},
  ],
  pvp: [
    {id:'u9Dg-g7t2l4', title:'Corrupted Dungeon Guide 2025', channel:'PvP Master'},
    {id:'LsoLEjrDogU', title:'Ganking Guide Albion', channel:'GankKing'},
  ],
  pve: [
    {id:'jofNR_WkoCE', title:'Solo Dungeon Guide 2025', channel:'FarmKing'},
    {id:'2vjPBrBU-TM', title:'Fame Farming Rotation Guide', channel:'AlbionFame'},
  ],
};

// ─── STATE ────────────────────────────────────────────────
let currentCat  = 'all';
let currentGuide = null;
let chatOpen     = true;
let chatHistory  = [];

const getLang = () => localStorage.getItem('aot-lang') || 'tr';

// ─── KATEGORİ SEÇ ────────────────────────────────────────
function selectCat(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.scat').forEach(b => b.classList.toggle('active', b === btn));
  renderGuideCards();
  closeDetail();
}

function filterGuides(q) {
  renderGuideCards(q);
}

// ─── KART RENDER ─────────────────────────────────────────
function renderGuideCards(search = '') {
  const lang = getLang();
  const cont = document.getElementById('guideCards');
  let filtered = GUIDES.filter(g => {
    const catMatch = currentCat === 'all' || g.cat === currentCat;
    if (!catMatch) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    const title = (lang === 'tr' ? g.tr.title : g.en.title).toLowerCase();
    const desc  = (lang === 'tr' ? g.tr.desc  : g.en.desc).toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  if (!filtered.length) {
    cont.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">
      <div style="font-size:36px;margin-bottom:12px">📚</div>
      <p>${lang==='tr'?'Rehber bulunamadı. AI ile oluştur →':'No guide found. Generate with AI →'}</p>
    </div>`;
    return;
  }

  const levelBadge = {
    beginner: {tr:'Başlangıç', en:'Beginner', cls:'guide-badge-level-beginner'},
    mid:      {tr:'Orta',      en:'Mid',      cls:'guide-badge-level-mid'},
    advanced: {tr:'İleri',     en:'Advanced', cls:'guide-badge-level-advanced'},
  };

  cont.innerHTML = filtered.map(g => {
    const title = lang==='tr' ? g.tr.title : g.en.title;
    const desc  = lang==='tr' ? g.tr.desc  : g.en.desc;
    const lvl   = levelBadge[g.level] || levelBadge.beginner;
    return `<div class="guide-card ai-card" onclick="openGuide('${g.id}')">
      <div class="guide-card-header">
        <span class="guide-card-icon">${g.icon}</span>
        <div class="guide-card-badges">
          <span class="guide-badge ${lvl.cls}">${lang==='tr'?lvl.tr:lvl.en}</span>
          <span class="guide-badge guide-badge-ai">✦ AI</span>
        </div>
      </div>
      <div class="guide-card-title">${title}</div>
      <div class="guide-card-desc">${desc}</div>
      <div class="guide-card-footer">
        <span class="guide-card-time">AI üretimli · güncel</span>
        <span class="guide-card-arrow">→ Oku</span>
      </div>
    </div>`;
  }).join('');
}

// ─── REHBERİ AÇ ──────────────────────────────────────────
async function openGuide(id) {
  const guide = GUIDES.find(g => g.id === id);
  if (!guide) return;
  currentGuide = guide;
  const lang = getLang();

  document.getElementById('guideCards').style.display = 'none';
  document.getElementById('guideDetail').style.display = 'block';

  const content = document.getElementById('guideDetailContent');
  content.innerHTML = `<div class="ai-loading">
    <div class="ai-loading-dots"><span></span><span></span><span></span></div>
    <span>${lang==='tr'?'Gemini AI rehberi oluşturuyor...':'Gemini AI is generating the guide...'}</span>
  </div>`;

  const prompt = lang === 'tr' ? guide.prompt_tr : guide.prompt_en;
  const aiLang = document.getElementById('aiGenLang')?.value || lang;

  try {
    const text = await callGemini(prompt, aiLang);
    content.innerHTML = markdownToHtml(text);
    renderVideos(guide.cat);
  } catch(e) {
    content.innerHTML = `<div style="color:var(--text-muted);padding:20px;text-align:center">
      <div style="font-size:36px;margin-bottom:12px">⚠️</div>
      <p>${lang==='tr'?'Gemini API şu an yanıt vermiyor. Lütfen tekrar deneyin.':'Gemini API is not responding. Please try again.'}</p>
      <button class="gd-action-btn" onclick="openGuide('${id}')" style="margin-top:12px">🔄 Tekrar Dene</button>
    </div>`;
  }
}

function closeDetail() {
  document.getElementById('guideCards').style.display = 'grid';
  document.getElementById('guideDetail').style.display = 'none';
  document.getElementById('guideVideoSection').style.display = 'none';
  currentGuide = null;
}

function renderVideos(cat) {
  const videos = VIDEO_DB[cat] || [];
  const videoSection = document.getElementById('guideVideoSection');
  const videoCont    = document.getElementById('guideVideos');
  if (!videos.length) { videoSection.style.display = 'none'; return; }
  videoSection.style.display = 'block';
  videoCont.innerHTML = videos.map(v => `
    <div class="video-embed-card" onclick="loadVideo('${v.id}','video-${v.id}')">
      <div class="video-thumb" id="video-${v.id}">
        <img class="video-thumb-img" src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" alt="${v.title}" loading="lazy"/>
        <div class="video-play-btn">▶</div>
      </div>
      <div class="video-info">
        <div class="video-title">${v.title}</div>
        <div class="video-channel">📺 ${v.channel}</div>
      </div>
    </div>`).join('');
}

function loadVideo(videoId, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allowfullscreen allow="autoplay"></iframe>`;
}

// ─── AI REHBER OLUŞTUR ────────────────────────────────────
async function generateGuide() {
  const prompt = document.getElementById('aiGenPrompt').value.trim();
  if (!prompt) return;
  const lang  = document.getElementById('aiGenLang').value;
  const level = document.getElementById('aiGenLevel').value;

  // Detay ekranını aç
  document.getElementById('guideCards').style.display = 'none';
  document.getElementById('guideDetail').style.display = 'block';

  const content = document.getElementById('guideDetailContent');
  const uiLang = getLang();
  content.innerHTML = `<div class="ai-loading">
    <div class="ai-loading-dots"><span></span><span></span><span></span></div>
    <span>${uiLang==='tr'?'Gemini AI rehberinizi oluşturuyor...':'Gemini AI is creating your guide...'}</span>
  </div>`;

  const levelMap = {beginner:'başlangıç seviyesinde', mid:'orta seviyede', advanced:'ileri seviyede'};
  const fullPrompt = lang === 'tr'
    ? `Albion Online hakkında ${levelMap[level]||''} kapsamlı Türkçe rehber yaz: ${prompt}\n\nMarkdown formatında, başlıklar, maddeler ve tablolar kullanarak yaz. Pratik ve oynanabilir bilgiler ver.`
    : `Write a comprehensive ${level} level guide about Albion Online: ${prompt}\n\nWrite in Markdown format using headings, bullet points and tables. Give practical and actionable information.`;

  try {
    const text = await callGemini(fullPrompt, lang);
    content.innerHTML = markdownToHtml(text);
    document.getElementById('guideVideoSection').style.display = 'none';
  } catch(e) {
    content.innerHTML = `<div style="color:var(--text-muted);padding:20px;text-align:center">
      <div style="font-size:36px">⚠️</div>
      <p>${uiLang==='tr'?'Gemini API şu an yanıt vermiyor. Tekrar deneyin.':'Gemini API is not responding. Please retry.'}</p>
      <button class="gd-action-btn" onclick="generateGuide()" style="margin-top:12px">🔄 Tekrar Dene</button>
    </div>`;
  }
}

function quickGuide(topic) {
  const inp = document.getElementById('aiGenPrompt');
  if (inp) inp.value = topic;
  generateGuide();
}

function regenerateGuide() {
  if (currentGuide) openGuide(currentGuide.id);
  else generateGuide();
}

function copyGuide() {
  const content = document.getElementById('guideDetailContent');
  if (!content) return;
  navigator.clipboard.writeText(content.innerText).then(() => {
    const btn = document.querySelector('.gd-action-btn');
    const lang = getLang();
    const orig = btn.textContent;
    btn.textContent = lang==='tr'?'✓ Kopyalandı!':'✓ Copied!';
    setTimeout(() => btn.textContent = orig, 2000);
  });
}

// ─── AI CHAT ─────────────────────────────────────────────
function toggleChat() {
  chatOpen = !chatOpen;
  const body = document.getElementById('aiChatBody');
  const icon = document.getElementById('chatToggleIcon');
  body.style.display = chatOpen ? 'block' : 'none';
  icon.classList.toggle('collapsed', !chatOpen);
}

async function sendChatMsg() {
  const input = document.getElementById('aiChatInput');
  const msg = input.value.trim();
  if (!msg) return;

  const lang = getLang();
  input.value = '';
  addChatMsg(msg, 'user');

  const sendBtn = document.querySelector('.ai-chat-send');
  if (sendBtn) sendBtn.disabled = true;

  // Typing indicator
  const typingId = 'typing-' + Date.now();
  const messages = document.getElementById('aiChatMessages');
  messages.innerHTML += `<div class="ai-msg" id="${typingId}">
    <div class="ai-msg-avatar">AI</div>
    <div class="ai-msg-text"><div class="ai-loading-dots"><span></span><span></span><span></span></div></div>
  </div>`;
  messages.scrollTop = messages.scrollHeight;

  const systemPrompt = lang === 'tr'
    ? 'Sen Albion Online uzmanısın. Türkçe, kısa ve net cevaplar ver. Build, ekonomi, bölge, strateji konularında yardım et.'
    : 'You are an Albion Online expert. Give concise and clear answers. Help with builds, economy, zones, and strategies.';

  try {
    const fullPrompt = `${systemPrompt}\n\nKullanıcı sorusu: ${msg}`;
    const response = await callGemini(fullPrompt, lang);
    document.getElementById(typingId)?.remove();
    addChatMsg(response, 'bot');
  } catch(e) {
    document.getElementById(typingId)?.remove();
    addChatMsg(lang==='tr'?'API şu an yanıt vermiyor. Lütfen tekrar deneyin.':'API not responding. Please try again.', 'bot');
  }

  if (sendBtn) sendBtn.disabled = false;
}

function addChatMsg(text, type) {
  const messages = document.getElementById('aiChatMessages');
  const isUser = type === 'user';
  messages.innerHTML += `<div class="ai-msg ${isUser?'user-msg':''}">
    <div class="ai-msg-avatar ${isUser?'user-avatar':''}">${isUser?'Sen':'AI'}</div>
    <div class="ai-msg-text">${text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')}</div>
  </div>`;
  messages.scrollTop = messages.scrollHeight;
}

// ─── GEMINI API ───────────────────────────────────────────
async function callGemini(prompt, lang = 'tr') {
  // Gemini API key önce window'dan, sonra meta tag'den dene
  const apiKey = window.GEMINI_API_KEY
    || document.querySelector('meta[name="gemini-key"]')?.content
    || GEMINI_KEY;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2000,
    },
  };

  const res = await fetch(`${GEMINI_API}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(()=>({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ─── MARKDOWN → HTML ─────────────────────────────────────
function markdownToHtml(md) {
  if (!md) return '';
  return md
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    // Headings
    .replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/^## (.+)$/gm,'<h2>$1</h2>')
    .replace(/^# (.+)$/gm,'<h1>$1</h1>')
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    // Code
    .replace(/`(.+?)`/g,'<code>$1</code>')
    // Blockquote
    .replace(/^&gt; (.+)$/gm,'<blockquote>$1</blockquote>')
    // HR
    .replace(/^---$/gm,'<hr/>')
    // Lists
    .replace(/^\- (.+)$/gm,'<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm,'<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g,'<ul>$&</ul>')
    // Tables — basit
    .replace(/\|(.+)\|/g, row => {
      const cells = row.slice(1,-1).split('|').map(c=>c.trim());
      if (cells.every(c=>c.match(/^[-:]+$/))) return '';
      return '<tr>' + cells.map(c=>`<td>${c}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, t => `<table>${t}</table>`)
    // Paragraphs
    .replace(/\n\n/g,'</p><p>')
    .replace(/^([^<].+)$/gm, line => line.startsWith('<')||!line.trim() ? line : `<p>${line}</p>`)
    // Cleanup
    .replace(/<p><\/p>/g,'')
    .replace(/<p>(<h[1-6]|<ul|<ol|<table|<blockquote|<hr)/g,'$1')
    .replace(/(<\/h[1-6]>|<\/ul>|<\/ol>|<\/table>|<\/blockquote>|<hr\/>)<\/p>/g,'$1');
}

// ─── BAŞLAT ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderGuideCards();
  // Chat başlangıçta açık
  document.getElementById('aiChatBody').style.display = 'block';
});
