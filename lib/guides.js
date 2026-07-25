// AoT-PNASF — Rehberler v2
// Gemini API kaldırıldı — statik rehber sistemi

// ─── REHBER VERİTABANI ───────────────────────────────────
const GUIDES = [
  // BAŞLANGIÇ
  { id:'beginner-start', cat:'beginner', level:'beginner', icon:'🎯',
    tr:{ title:'Albion\'a İlk Adımlar',
      content:`# Albion Online'a İlk Adımlar

## Oyuna Başlarken
Albion Online'a yeni başladıysan önce **Destiny Board**'u anlamalısın. Bu, tüm ilerlemenin haritasıdır.

## İlk Yapman Gerekenler
- Tutorial'ı tamamla — başlangıç ekipmanı kazan
- Destiny Board'da bir path seç (Savaşçı, Mağus veya Avcı)
- **Premium** al veya birikim yap — %50 daha fazla fame kazanırsın
- İlk gün Caerleon'a gitme — tehlikeli!

## Silver Kazanma (Başlangıç)
- **Gathering** — hammadde topla, sat
- **Dungeon** — solo dungeon'lardan loot
- **Craft** — basit eşya üret, sat
- **Daily Missions** — günlük görevler

## Önemli İpuçları
> Blue zone = güvenli, Yellow zone = dikkatli, Red/Black zone = full-loot PvP

Başlangıçta **T4 ekipman** hedefle. T4 sonrası gerçek oyun başlar.`
    },
    en:{ title:'First Steps in Albion',
      content:`# First Steps in Albion Online

## Getting Started
Albion Online begins with the **Destiny Board** — your progression map for everything.

## First Things To Do
- Complete the tutorial — earn starter equipment
- Choose a path on the Destiny Board (Warrior, Mage or Hunter)
- Get **Premium** or save up — 50% more fame gain
- Don't go to Caerleon on day one — dangerous!

## Earning Silver (Beginner)
- **Gathering** — collect resources, sell them
- **Dungeons** — loot from solo dungeons
- **Crafting** — craft basic items, sell
- **Daily Missions** — daily quest rewards

## Key Tips
> Blue zone = safe, Yellow = careful, Red/Black = full-loot PvP

Target **T4 equipment** first. The real game starts after T4.`
    },
    videos:['dQw4w9WgXcQ']
  },

  { id:'beginner-destiny', cat:'beginner', level:'beginner', icon:'🌳',
    tr:{ title:'Destiny Board Rehberi',
      content:`# Destiny Board (Kader Panosu) Rehberi

## Destiny Board Nedir?
Albion'daki tüm gelişimini takip eden sistemdir. Her aktivite — PvP, PvE, Crafting, Gathering — burada fame kazandırır.

## Path Seçimi
| Path | Uygun Oyuncu | Kazanç |
|------|-------------|--------|
| Savaşçı (Warrior) | Tank/DPS sevenler | Yüksek PvP fame |
| Mağus (Mage) | Büyü sevenler | AoE fame farm |
| Avcı (Hunter) | Hız sevenler | Gathering + Solo |

## Specialization Puanları
- Bir silahı **100/100** spec'e getir
- Specialization %50'ye kadar bonus hasar/etkinlik verir
- Birden fazla silahı spec etme — önce birini maxla

## En Verimli Rotasyon
1. T4 → T5 geçiş için dungeon spam
2. T5 → T6 için Yellow zone dungeon
3. T6+ için Red/Black zone`
    },
    en:{ title:'Destiny Board Guide',
      content:`# Destiny Board Guide

## What is the Destiny Board?
It tracks all your progression in Albion. Every activity — PvP, PvE, Crafting, Gathering — earns fame here.

## Path Selection
| Path | Best For | Reward |
|------|----------|--------|
| Warrior | Tank/DPS lovers | High PvP fame |
| Mage | Spell casters | AoE fame farm |
| Hunter | Speed lovers | Gathering + Solo |

## Specialization Points
- Get one weapon to **100/100** spec
- Specialization gives up to 50% bonus damage/efficiency
- Don't spec multiple weapons — max one first

## Most Efficient Rotation
1. T4 → T5: dungeon spam
2. T5 → T6: Yellow zone dungeons
3. T6+: Red/Black zones`
    }, videos:[]
  },

  // EKONOMİ
  { id:'economy-flip', cat:'economy', level:'mid', icon:'💹',
    tr:{ title:'Black Market Flip Stratejisi',
      content:`# Black Market Flip Stratejisi

## Black Market Nedir?
Caerleon'da özel bir market — NPC'ler burada alış emri verir. Oyuncular bu emirleri karşılar.

## Nasıl Çalışır?
1. Black Market'te hangi eşyanın yüksek alış emri var bak
2. O eşyayı Royal şehirlerden ucuza al
3. Black Market'e getirip sat
4. Fark = kârın

## En Karlı Kategoriler
- **T8 silahlar** — yüksek hacim, yüksek kâr
- **T6-T7 zırh** — sürekli talep
- **Enchanted eşyalar** — @1, @2, @3 versiyon farkı

## Dikkat Edilecekler
> Transport sırasında Red/Black zone'dan geçme — eşyaların çalınır!
- Caerleon üzerinden transport en güvenli
- Miktarı fazla tutma — sıkışırsan büyük kayıp

## Başlangıç Sermayesi
- 500K silver ile başlanabilir
- 2-3M silver ile verimli çalışır`
    },
    en:{ title:'Black Market Flip Strategy',
      content:`# Black Market Flip Strategy

## What is the Black Market?
A special market in Caerleon — NPCs place buy orders here. Players fulfill these orders.

## How It Works
1. Check which items have high buy orders on Black Market
2. Buy those items cheaply from Royal cities
3. Bring them to Black Market and sell
4. The difference = your profit

## Most Profitable Categories
- **T8 weapons** — high volume, high profit
- **T6-T7 armor** — constant demand
- **Enchanted items** — @1, @2, @3 version gaps

## Watch Out
> Don't transport through Red/Black zones — your items will be looted!
- Transport via Caerleon is safest
- Don't carry too much — big loss if you die

## Starting Capital
- Can start with 500K silver
- Works efficiently with 2-3M silver`
    }, videos:[]
  },

  { id:'economy-craft', cat:'economy', level:'mid', icon:'🔨',
    tr:{ title:'Crafting Kâr Döngüsü',
      content:`# Crafting ile Para Kazanma

## Temel Mantık
Ham madde → Refine → Craft → Sat

## Return Rate (Geri Dönüş Oranı)
- Normal: %15.2 return rate
- Focus kullanınca: %43.5 return rate
- **Focus çok değerli** — gereksiz yere harcama

## Şehir Bonusları
| Şehir | Bonus Kategori |
|-------|---------------|
| Lymhurst | Kumaş zırh |
| Bridgewatch | Çöl zırh |
| Martlock | Kürk zırh |
| Thetford | Bataklık zırh |
| Fort Sterling | Plaka zırh |

## En Karlı Craft
1. **Leather armor T6-T8** — yüksek talep
2. **Bags T8** — her oyuncu ister
3. **Potions T6** — sürekli tüketim
4. **Mount** — her zaman satılır

## Kâr Hesabı
\`\`\`
Kâr = Satış Fiyatı - Hammadde - Refine - Craft Vergisi
\`\`\``
    },
    en:{ title:'Crafting Profit Cycle',
      content:`# Earning Money Through Crafting

## Basic Logic
Raw material → Refine → Craft → Sell

## Return Rate
- Normal: 15.2% return rate
- With Focus: 43.5% return rate
- **Focus is very valuable** — don't waste it

## City Bonuses
| City | Bonus Category |
|------|---------------|
| Lymhurst | Cloth armor |
| Bridgewatch | Leather armor |
| Martlock | Fur armor |
| Thetford | Swamp armor |
| Fort Sterling | Plate armor |

## Most Profitable Crafts
1. **Leather armor T6-T8** — high demand
2. **Bags T8** — every player wants one
3. **Potions T6** — constant consumption
4. **Mounts** — always sells`
    }, videos:[]
  },

  // BUILD
  { id:'build-solo-pvp', cat:'build', level:'mid', icon:'⚔️',
    tr:{ title:'Solo PvP Build Rehberi',
      content:`# Solo PvP Build Rehberi

## Corrupted Dungeon (CD) için
**Claymore Build**
- Silah: T6+ Claymore
- Kask: Knight Helmet (W: Toughness)
- Zırh: Mercenary Jacket (W: Adrenaline Boost)
- Bot: Soldier Boots (W: Dash)
- Cape: Thetford Cape
- Food: Beef Stew
- Potion: Resistance Potion

**Oynanış:** Adrenaline Boost → Q spam → W → öldür

## Ganking için
- Silah: Bloodletter (hız için)
- Zırh: Hellion Jacket
- Bot: Stalker Shoes
- Mount: Swiftclaw

## Solo Roaming
- Silah: Carrioncaller veya Whispering Bow
- Zırh: Stalker Jacket
- Bot: Stalker Shoes

## IP Önerisi
- CD'ye girmek için min. **900 IP** önerilir
- Rekabetçi olmak için **1100+ IP**`
    },
    en:{ title:'Solo PvP Build Guide',
      content:`# Solo PvP Build Guide

## For Corrupted Dungeon (CD)
**Claymore Build**
- Weapon: T6+ Claymore
- Helmet: Knight Helmet (W: Toughness)
- Armor: Mercenary Jacket (W: Adrenaline Boost)
- Boots: Soldier Boots (W: Dash)
- Cape: Thetford Cape
- Food: Beef Stew
- Potion: Resistance Potion

**Gameplay:** Adrenaline Boost → Q spam → W → kill

## For Ganking
- Weapon: Bloodletter (for speed)
- Armor: Hellion Jacket
- Boots: Stalker Shoes
- Mount: Swiftclaw

## IP Recommendation
- Min. **900 IP** recommended for CD
- **1100+ IP** to be competitive`
    }, videos:[]
  },

  { id:'build-gathering', cat:'build', level:'beginner', icon:'⛏️',
    tr:{ title:'Gathering Build & Rotasyon',
      content:`# Gathering (Kaynak Toplama) Rehberi

## Temel Gathering Build
- Silah: Sickle (Orak) — gathering speed
- Kask: Miner/Lumberjack/Skinner Helmet (tipe göre)
- Zırh: Miner/Lumberjack/Skinner Jacket
- Bot: Miner/Lumberjack/Skinner Shoes
- Cape: Undead Cape
- Mount: Armored Horse veya Ox

## Kaynak Türleri ve Bölgeler
| Kaynak | Bölge | Not |
|--------|-------|-----|
| Ahşap | Forest biome | Lymhurst çevresi |
| Taş | Mountain biome | Fort Sterling çevresi |
| Fiber | Swamp biome | Thetford çevresi |
| Deri | Highland biome | Martlock çevresi |
| Maden | Steppe biome | Bridgewatch çevresi |

## T8 Gathering için
- Minimum T6 gathering ekipman
- Spec 50+ gathering skill
- **Outlands'a git** — T7/T8 sadece orada bol

## Güvenlik İpuçları
- Ox kullan — çok taşır ama yavaş
- Arkadaşlarla git — gank riski azalır
- Premium olmadan gathering verimli değil`
    },
    en:{ title:'Gathering Build & Rotation',
      content:`# Gathering Guide

## Basic Gathering Build
- Weapon: Sickle — gathering speed
- Helmet: Miner/Lumberjack/Skinner (by type)
- Armor: Matching gathering set
- Cape: Undead Cape
- Mount: Armored Horse or Ox

## Resource Types & Zones
| Resource | Biome | Note |
|----------|-------|------|
| Wood | Forest | Around Lymhurst |
| Stone | Mountain | Around Fort Sterling |
| Fiber | Swamp | Around Thetford |
| Hide | Highland | Around Martlock |
| Ore | Steppe | Around Bridgewatch |

## For T8 Gathering
- Minimum T6 gathering equipment
- 50+ spec in gathering skill
- **Go to Outlands** — T7/T8 is abundant there

## Safety Tips
- Use Ox — carries more but slow
- Go with friends — reduces gank risk
- Gathering isn't efficient without Premium`
    }, videos:[]
  },

  // BÖLGE
  { id:'zone-brecilien', cat:'zone', level:'mid', icon:'🌫️',
    tr:{ title:'Brecilien & Mist Zone',
      content:`# Brecilien & Mist Zone Rehberi

## Mist Zone Nedir?
Albion'un en yeni bölgesi — ne Blue ne Black. Kendine özgü kuralları var.

## Brecilien'e Nasıl Girilir?
1. Herhangi bir Royal şehirden Mist portalarını bul
2. Portal girişi rastgele — her giriş farklı yere çıkarır
3. Brecilien şehrini bul — ana merkez

## Mist'te Ne Yapılır?
- **Wisp toplama** — temel para birimi
- **Mist Dungeon** — solo/küçük grup
- **Gathering** — Mist kaynakları değerli
- **Corrupted Dungeon** benzeri 1v1 içerik

## Brecilien Şehri
- Tüm standart şehir hizmetleri mevcut
- Market bağlantısı Caerleon ile
- **Özel craftlar** sadece burada

## İpuçları
> Mist'te ölürsen eşyaların kalır (düşük güvenlik zonu değil)
- İlk girişte yön bulmak zor — harita kullan
- Wisps'i birikim yap — özel eşyalar satın al`
    },
    en:{ title:'Brecilien & Mist Zone',
      content:`# Brecilien & Mist Zone Guide

## What is the Mist Zone?
Albion's newest region — neither Blue nor Black. Has its own unique rules.

## How to Enter Brecilien
1. Find Mist portals from any Royal city
2. Portal entry is random — each entry leads somewhere different
3. Find the city of Brecilien — main hub

## What To Do in the Mist
- **Collect Wisps** — primary currency
- **Mist Dungeons** — solo/small group
- **Gathering** — Mist resources are valuable
- **1v1 content** similar to Corrupted Dungeons

## Brecilien City
- All standard city services available
- Market connected to Caerleon
- **Special crafts** only available here`
    }, videos:[]
  },

  // PVP
  { id:'pvp-corrupted', cat:'pvp', level:'mid', icon:'💀',
    tr:{ title:'Corrupted Dungeon Rehberi',
      content:`# Corrupted Dungeon (CD) Rehberi

## CD Nedir?
Albion'un 1v1 PvP içeriği. Dungeon içinde başka oyuncular seni gank edebilir.

## Nasıl Girilir?
- Red/Black zone'da Corrupted rift bul
- Minimum 700 IP ile girilebilir
- Farklı tier'lar var (düşük/orta/yüksek IP)

## Ranking Sistemi
- Her öldürme/kurban infamy verir/alır
- Yüksek infamy = daha iyi ödüller
- Kaçmak infamy kaybettirir

## Temel Taktikler
**Saldırı:**
1. Gap close (yakın gel)
2. Crowd control uygula
3. Burst damage ver
4. Sustain'i kır

**Savunma:**
1. Kite (uzak tut)
2. Purge (CC temizle)
3. Position al
4. Kaç (gerekirse)

## Counterpick Mantığı
- Ağır zırha karşı → Ignoring resistances build
- Kite'a karşı → Gap close + slow
- Burst'a karşı → Tank + sustain

## Ödüller
- Satchel of Insight (fame)
- Rare loot
- Corrupted Soul (artifact)

> **İpucu:** İlk CD'ye T6 ekipman + 900 IP ile gir`
    },
    en:{ title:'Corrupted Dungeon Guide',
      content:`# Corrupted Dungeon (CD) Guide

## What is a CD?
Albion's 1v1 PvP content. Other players can invade your dungeon.

## How to Enter
- Find a Corrupted rift in Red/Black zones
- Minimum 700 IP required
- Different tiers available (low/mid/high IP)

## Ranking System
- Each kill/death gives/takes infamy
- Higher infamy = better rewards
- Running away loses infamy

## Basic Tactics
**Offense:**
1. Gap close
2. Apply crowd control
3. Deal burst damage
4. Break sustain

**Defense:**
1. Kite (keep distance)
2. Purge (clear CC)
3. Positioning
4. Escape (if needed)

## Rewards
- Satchel of Insight (fame)
- Rare loot
- Corrupted Soul (artifact)`
    }, videos:[]
  },

  // PVE
  { id:'pve-solo', cat:'pve', level:'beginner', icon:'🐉',
    tr:{ title:'Solo Dungeon & Fame Farm',
      content:`# Solo Dungeon & Fame Farm Rehberi

## Solo Dungeon Çeşitleri
| Tip | Güçlük | Ödül |
|-----|--------|------|
| Random Dungeon | Kolay | Düşük fame |
| Solo Dungeon | Orta | İyi fame |
| Veteran Dungeon | Zor | Yüksek fame |
| Corrupted Dungeon | PvP | Infamy + loot |

## En İyi Fame Farm Rotasyonu
**Yellow zone (güvenli):**
- Solo dungeon → hızlı tamamla → çık → tekrar gir
- Hedef: saatte 1-2M fame

**Red zone (riskli ama verimli):**
- Veteran dungeon → 3-5M fame/saat
- Risk: başka oyuncular gank edebilir

## Önerilen Build (Fame Farm)
- Silah: Battleaxe veya Wildfire Staff
- Zırh: Mercenary Jacket
- Bot: Soldier Boots
- Food: Pork Omelette (CD reduction)

## İpuçları
- **Journal** doldur — ekstra fame
- **Premium** olmadan fame farm verimsiz
- AoE silahlar dungeon'ı hızlandırır
- Full clear yerine skip yap — zaman kazan`
    },
    en:{ title:'Solo Dungeon & Fame Farm',
      content:`# Solo Dungeon & Fame Farm Guide

## Solo Dungeon Types
| Type | Difficulty | Reward |
|------|------------|--------|
| Random Dungeon | Easy | Low fame |
| Solo Dungeon | Medium | Good fame |
| Veteran Dungeon | Hard | High fame |
| Corrupted Dungeon | PvP | Infamy + loot |

## Best Fame Farm Rotation
**Yellow zone (safe):**
- Solo dungeon → complete fast → exit → re-enter
- Target: 1-2M fame per hour

**Red zone (risky but efficient):**
- Veteran dungeon → 3-5M fame/hour
- Risk: other players can gank you

## Recommended Build
- Weapon: Battleaxe or Wildfire Staff
- Armor: Mercenary Jacket
- Boots: Soldier Boots
- Food: Pork Omelette (CD reduction)`
    }, videos:[]
  },
];

// ─── STATE ────────────────────────────────────────────────
let currentCat  = 'all';
let currentGuide = null;
let chatOpen    = true;

const getLang = () => localStorage.getItem('aot-lang') || 'tr';

// ─── KATEGORİ ────────────────────────────────────────────
function selectCat(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.scat').forEach(b => b.classList.toggle('active', b === btn));
  renderGuideCards();
  closeDetail();
}

function filterGuides(q) { renderGuideCards(q); }

// ─── KART RENDER ─────────────────────────────────────────
function renderGuideCards(search = '') {
  const lang = getLang();
  const cont = document.getElementById('guideCards');
  if (!cont) return;

  let filtered = GUIDES.filter(g => {
    if (currentCat !== 'all' && g.cat !== currentCat) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    const d = g[lang] || g.tr;
    return d.title.toLowerCase().includes(q);
  });

  const levelBadge = {
    beginner: { tr:'Başlangıç', en:'Beginner', cls:'guide-badge-level-beginner' },
    mid:      { tr:'Orta',      en:'Mid',      cls:'guide-badge-level-mid' },
    advanced: { tr:'İleri',     en:'Advanced', cls:'guide-badge-level-advanced' },
  };

  if (!filtered.length) {
    cont.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">
      <div style="font-size:36px;margin-bottom:12px">📚</div>
      <p>${lang==='tr'?'Rehber bulunamadı.':'No guide found.'}</p>
    </div>`;
    return;
  }

  cont.innerHTML = filtered.map(g => {
    const d   = g[lang] || g.tr;
    const lvl = levelBadge[g.level] || levelBadge.beginner;
    return `<div class="guide-card" onclick="openGuide('${g.id}')">
      <div class="guide-card-header">
        <span class="guide-card-icon">${g.icon}</span>
        <div class="guide-card-badges">
          <span class="guide-badge ${lvl.cls}">${lang==='tr'?lvl.tr:lvl.en}</span>
        </div>
      </div>
      <div class="guide-card-title">${d.title}</div>
      <div class="guide-card-desc">${d.content.split('\n').find(l=>l&&!l.startsWith('#'))||''}</div>
      <div class="guide-card-footer">
        <span class="guide-card-time">${lang==='tr'?'Hazır rehber':'Ready guide'}</span>
        <span class="guide-card-arrow">→ ${lang==='tr'?'Oku':'Read'}</span>
      </div>
    </div>`;
  }).join('');
}

// ─── REHBER AÇ ───────────────────────────────────────────
function openGuide(id) {
  const guide = GUIDES.find(g => g.id === id);
  if (!guide) return;
  currentGuide = guide;
  const lang = getLang();
  const d    = guide[lang] || guide.tr;

  document.getElementById('guideCards').style.display  = 'none';
  document.getElementById('guideDetail').style.display = 'block';

  document.getElementById('guideDetailContent').innerHTML = markdownToHtml(d.content);

  // Videolar
  const vs = document.getElementById('guideVideoSection');
  if (vs) vs.style.display = 'none';
}

function closeDetail() {
  document.getElementById('guideCards').style.display  = 'grid';
  document.getElementById('guideDetail').style.display = 'none';
  currentGuide = null;
}

function copyGuide() {
  const el = document.getElementById('guideDetailContent');
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    const btn = document.querySelector('.gd-action-btn');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = getLang()==='tr'?'✓ Kopyalandı!':'✓ Copied!';
    setTimeout(() => btn.textContent = orig, 2000);
  });
}

function regenerateGuide() {
  if (currentGuide) openGuide(currentGuide.id);
}

// ─── QUICK GUIDE ────────────────────────────────────────
function quickGuide(topic) {
  // Başlıkta eşleşen rehberi bul
  const lang = getLang();
  const found = GUIDES.find(g => {
    const d = g[lang] || g.tr;
    return d.title.toLowerCase().includes(topic.toLowerCase()) ||
           topic.toLowerCase().includes(g.cat);
  });
  if (found) openGuide(found.id);
}

// ─── AI CHAT — Gemini kaldırıldı, statik yanıtlar ───────
function toggleChat() {
  chatOpen = !chatOpen;
  const body = document.getElementById('aiChatBody');
  const icon = document.getElementById('chatToggleIcon');
  if (body) body.style.display = chatOpen ? 'block' : 'none';
  if (icon) icon.classList.toggle('collapsed', !chatOpen);
}

function sendChatMsg() {
  const input = document.getElementById('aiChatInput');
  if (!input) return;
  const msg  = input.value.trim();
  if (!msg) return;
  input.value = '';
  addChatMsg(msg, 'user');

  // Statik yanıt sistemi
  const lang = getLang();
  const reply = getStaticReply(msg, lang);
  setTimeout(() => addChatMsg(reply, 'bot'), 500);
}

function getStaticReply(msg, lang) {
  const q = msg.toLowerCase();
  const L = lang === 'tr';

  if (q.includes('silver') || q.includes('para'))
    return L ? 'Silver kazanmak için en iyi yollar: Gathering (T7-T8), Black Market flip, Crafting döngüsü ve Solo dungeon. Rehberler sekmesinde detaylı bilgi var!' : 'Best ways to earn silver: T7-T8 Gathering, Black Market flipping, Crafting cycle and Solo dungeons. Check the guides section for details!';
  if (q.includes('build') || q.includes('silah') || q.includes('weapon'))
    return L ? 'Build seçimi oyun stiline göre değişir. Solo PvP için Claymore veya Bloodletter, PvE farm için Battleaxe önerilir. Build rehberini oku!' : 'Build choice depends on playstyle. Claymore or Bloodletter for Solo PvP, Battleaxe for PvE farming. Check the build guide!';
  if (q.includes('başlangıç') || q.includes('yeni') || q.includes('beginner') || q.includes('new'))
    return L ? 'Yeni başlayanlar için: Tutorial tamamla → T4 ekipman hedefle → Destiny Board\'da bir path seç → Yellow zone dungeon ile fame topla. Başlangıç rehberini mutlaka oku!' : 'For beginners: Complete tutorial → Target T4 gear → Choose a Destiny Board path → Farm fame in Yellow zone dungeons. Read the beginner guide!';
  if (q.includes('gathering') || q.includes('topla'))
    return L ? 'Gathering için: Uygun biome\'a git (ahşap→orman, maden→dağ), gathering ekipman giy, Ox binit kullan. T6+ için Outlands\'a gitmen gerekiyor!' : 'For gathering: Go to the right biome (wood→forest, ore→mountain), wear gathering gear, use Ox mount. For T6+ you need to go to Outlands!';
  if (q.includes('pvp') || q.includes('corrupted') || q.includes('cd'))
    return L ? 'Corrupted Dungeon\'a girerken min 900 IP önerilir. Claymore veya Bloodletter iyi başlangıç silahlarıdır. CD rehberini oku!' : 'For Corrupted Dungeons, 900+ IP is recommended. Claymore or Bloodletter are good starter weapons. Read the CD guide!';
  if (q.includes('brecilien') || q.includes('mist'))
    return L ? 'Brecilien\'e girmek için Royal şehirlerden Mist portallarını bul. İçeride Wisp topla, Mist Dungeon gir. Brecilien rehberini oku!' : 'To enter Brecilien, find Mist portals from Royal cities. Collect Wisps, run Mist Dungeons. Read the Brecilien guide!';
  if (q.includes('craft') || q.includes('üretim'))
    return L ? 'Crafting kârı için şehir bonuslarını kullan! Her şehir farklı zırh tipine bonus verir. Focus kullanarak return rate\'i artır. Crafting rehberini oku!' : 'Use city bonuses for crafting profit! Each city gives bonus to different armor types. Increase return rate with Focus. Read the crafting guide!';

  return L
    ? 'Bu konu hakkında daha fazla bilgi için soldaki rehber kategorilerini incele! Market, PvP, Crafting ve daha fazlası mevcut.'
    : 'For more info on this topic, check the guide categories on the left! Market, PvP, Crafting and more available.';
}

function addChatMsg(text, type) {
  const messages = document.getElementById('aiChatMessages');
  if (!messages) return;
  const isUser = type === 'user';
  const div = document.createElement('div');
  div.className = `ai-msg ${isUser ? 'user-msg' : ''}`;
  div.innerHTML = `
    <div class="ai-msg-avatar ${isUser?'user-avatar':''}">${isUser?'Sen':'💬'}</div>
    <div class="ai-msg-text">${text.replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// ─── MARKDOWN → HTML ────────────────────────────────────
function markdownToHtml(md) {
  if (!md) return '';
  return md
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/^## (.+)$/gm,'<h2>$1</h2>')
    .replace(/^# (.+)$/gm,'<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/`(.+?)`/g,'<code>$1</code>')
    .replace(/^&gt; (.+)$/gm,'<blockquote>$1</blockquote>')
    .replace(/^---$/gm,'<hr/>')
    .replace(/^\- (.+)$/gm,'<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm,'<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g,'<ul>$&</ul>')
    .replace(/\|(.+)\|/g, row => {
      const cells = row.slice(1,-1).split('|').map(c=>c.trim());
      if (cells.every(c=>c.match(/^[-:]+$/))) return '';
      return '<tr>' + cells.map(c=>`<td>${c}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, t=>`<table>${t}</table>`)
    .replace(/\n\n/g,'</p><p>')
    .replace(/^([^<].+)$/gm, l => l.startsWith('<')||!l.trim()?l:`<p>${l}</p>`)
    .replace(/<p><\/p>/g,'');
}

// ─── BAŞLAT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderGuideCards();
  const chatBody = document.getElementById('aiChatBody');
  if (chatBody) chatBody.style.display = 'block';

  // Enter ile mesaj gönder
  const chatInput = document.getElementById('aiChatInput');
  if (chatInput) {
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendChatMsg();
    });
  }
});
