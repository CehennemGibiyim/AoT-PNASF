/* ===== MAPS.JS ===== */
'use strict';

// =====================================================
// VERİ — Şehirler, Biome'lar, Zonlar
// =====================================================
const CITIES_DATA = [
  {
    id: 'caerleon',
    name: 'Caerleon',
    icon: '⚔️',
    biome: 'Highland',
    biome_tr: 'Yayla',
    faction: 'Royal',
    zone_type: 'red',
    desc_tr: 'Royal Continent\'in merkez başkenti. Black Market\'e ev sahipliği yapar.',
    desc_en: 'The central capital of the Royal Continent. Home to the Black Market.',
    bonuses: [
      { label_tr: 'Refining Bonusu', label_en: 'Refining Bonus', value: 'Tüm kaynaklar %40' },
      { label_tr: 'Black Market', label_en: 'Black Market', value: '✅ Aktif' },
      { label_tr: 'Realmgate', label_en: 'Realmgate', value: '❌ Yok (yıkıldı)' },
    ],
    tags: ['black-market'],
    resources_tr: ['Cevher', 'Taş', 'Odun', 'Lif', 'Deri'],
    resources_en: ['Ore', 'Stone', 'Wood', 'Fiber', 'Hide'],
    crafting_tr: 'Tüm crafting istasyonları mevcut',
    crafting_en: 'All crafting stations available',
    how_to_tr: 'Herhangi bir Royal City\'den kırmızı zonlar üzerinden ulaş',
    how_to_en: 'Travel through red zones from any Royal City',
  },
  {
    id: 'lymhurst',
    name: 'Lymhurst',
    icon: '🌲',
    biome: 'Forest',
    biome_tr: 'Orman',
    faction: 'Lymhurst',
    zone_type: 'blue',
    desc_tr: 'Orman biome şehri. Deri ve kumaş ürünleri için en iyi tercih.',
    desc_en: 'Forest biome city. Best choice for leather and cloth items.',
    bonuses: [
      { label_tr: 'Refining Bonusu', label_en: 'Refining Bonus', value: 'Deri %50, Kumaş %50' },
      { label_tr: 'Crafting Bonusu', label_en: 'Crafting Bonus', value: 'Yaylar, Hafif Zırh' },
      { label_tr: 'Realmgate', label_en: 'Realmgate', value: '✅ Aktif' },
    ],
    tags: ['forest'],
    resources_tr: ['Odun', 'Deri', 'Taş'],
    resources_en: ['Wood', 'Hide', 'Stone'],
    crafting_tr: 'Yay ve hafif zırh craftında %15 bonus',
    crafting_en: '15% bonus on bow and light armor crafting',
    how_to_tr: 'Forest Cross başlangıç kasabasından ilerle',
    how_to_en: 'Progress from Forest Cross starter town',
  },
  {
    id: 'bridgewatch',
    name: 'Bridgewatch',
    icon: '🏜️',
    biome: 'Steppe',
    biome_tr: 'Bozkır',
    faction: 'Bridgewatch',
    zone_type: 'blue',
    desc_tr: 'Bozkır biome şehri. Cevher ve ok silahları için en iyi tercih.',
    desc_en: 'Steppe biome city. Best for ore and ranged weapons.',
    bonuses: [
      { label_tr: 'Refining Bonusu', label_en: 'Refining Bonus', value: 'Cevher %50' },
      { label_tr: 'Crafting Bonusu', label_en: 'Crafting Bonus', value: 'Hançerler, Crossbow' },
      { label_tr: 'Realmgate', label_en: 'Realmgate', value: '✅ Aktif' },
    ],
    tags: ['steppe'],
    resources_tr: ['Cevher', 'Taş', 'Deri'],
    resources_en: ['Ore', 'Stone', 'Hide'],
    crafting_tr: 'Hançer ve arbalet craftında %15 bonus',
    crafting_en: '15% bonus on dagger and crossbow crafting',
    how_to_tr: 'Steppe Cross başlangıç kasabasından ilerle',
    how_to_en: 'Progress from Steppe Cross starter town',
  },
  {
    id: 'fortsterling',
    name: 'Fort Sterling',
    icon: '⛰️',
    biome: 'Mountain',
    biome_tr: 'Dağ',
    faction: 'Fort Sterling',
    zone_type: 'blue',
    desc_tr: 'Dağ biome şehri. Taş ve ağır zırh üretimi için ideal.',
    desc_en: 'Mountain biome city. Ideal for stone and heavy armor production.',
    bonuses: [
      { label_tr: 'Refining Bonusu', label_en: 'Refining Bonus', value: 'Taş %50' },
      { label_tr: 'Crafting Bonusu', label_en: 'Crafting Bonus', value: 'Çekiçler, Ağır Zırh' },
      { label_tr: 'Realmgate', label_en: 'Realmgate', value: '✅ Aktif' },
    ],
    tags: ['mountain'],
    resources_tr: ['Cevher', 'Taş', 'Lif'],
    resources_en: ['Ore', 'Stone', 'Fiber'],
    crafting_tr: 'Çekiç ve ağır zırh craftında %15 bonus',
    crafting_en: '15% bonus on hammer and heavy armor crafting',
    how_to_tr: 'Mountain Cross başlangıç kasabasından ilerle',
    how_to_en: 'Progress from Mountain Cross starter town',
  },
  {
    id: 'martlock',
    name: 'Martlock',
    icon: '🏔️',
    biome: 'Highlands',
    biome_tr: 'Yayla',
    faction: 'Martlock',
    zone_type: 'blue',
    desc_tr: 'Yayla biome şehri. Taş ve büyü silahları için en iyi.',
    desc_en: 'Highlands biome city. Best for stone and magic weapons.',
    bonuses: [
      { label_tr: 'Refining Bonusu', label_en: 'Refining Bonus', value: 'Odun %50' },
      { label_tr: 'Crafting Bonusu', label_en: 'Crafting Bonus', value: 'Kılıçlar, Savaş Baltaları' },
      { label_tr: 'Realmgate', label_en: 'Realmgate', value: '✅ Aktif' },
    ],
    tags: ['highlands'],
    resources_tr: ['Taş', 'Cevher', 'Odun'],
    resources_en: ['Stone', 'Ore', 'Wood'],
    crafting_tr: 'Kılıç ve balta craftında %15 bonus',
    crafting_en: '15% bonus on sword and axe crafting',
    how_to_tr: 'Highlands Cross başlangıç kasabasından ilerle',
    how_to_en: 'Progress from Highlands Cross starter town',
  },
  {
    id: 'thetford',
    name: 'Thetford',
    icon: '🌿',
    biome: 'Swamp',
    biome_tr: 'Bataklık',
    faction: 'Thetford',
    zone_type: 'blue',
    desc_tr: 'Bataklık biome şehri. Lif ve büyücü silahları için ideal.',
    desc_en: 'Swamp biome city. Ideal for fiber and mage weapons.',
    bonuses: [
      { label_tr: 'Refining Bonusu', label_en: 'Refining Bonus', value: 'Lif %50' },
      { label_tr: 'Crafting Bonusu', label_en: 'Crafting Bonus', value: 'Asalar, Orta Zırh' },
      { label_tr: 'Realmgate', label_en: 'Realmgate', value: '✅ Aktif' },
    ],
    tags: ['swamp'],
    resources_tr: ['Lif', 'Odun', 'Deri'],
    resources_en: ['Fiber', 'Wood', 'Hide'],
    crafting_tr: 'Asa ve orta zırh craftında %15 bonus',
    crafting_en: '15% bonus on staff and medium armor crafting',
    how_to_tr: 'Swamp Cross başlangıç kasabasından ilerle',
    how_to_en: 'Progress from Swamp Cross starter town',
  },
  {
    id: 'brecilien',
    name: 'Brecilien',
    icon: '🌫️',
    biome: 'Mist',
    biome_tr: 'Sis',
    faction: 'Mist',
    zone_type: 'blue',
    desc_tr: 'Sisin içindeki gizemli şehir. Özel Crystal Realm erişimi sağlar.',
    desc_en: 'Mysterious city hidden in the Mists. Provides special Crystal Realm access.',
    bonuses: [
      { label_tr: 'Pazar', label_en: 'Market', value: '✅ Aktif' },
      { label_tr: 'Crystal Realm', label_en: 'Crystal Realm', value: '✅ Özel erişim' },
      { label_tr: 'Realmgate', label_en: 'Realmgate', value: '✅ Aktif' },
    ],
    tags: ['mist'],
    resources_tr: ['Kristal', 'Özel Mist kaynakları'],
    resources_en: ['Crystal', 'Special Mist resources'],
    crafting_tr: 'Mist özel eşya craftı mevcut',
    crafting_en: 'Mist special item crafting available',
    how_to_tr: 'Herhangi bir şehirden Mist portalı gir',
    how_to_en: 'Enter through a Mist portal from any city',
  },
  {
    id: 'arthurs',
    name: "Arthur's Rest",
    icon: '🗡️',
    biome: 'Outlands',
    biome_tr: 'Outlands',
    faction: 'Neutral',
    zone_type: 'black',
    desc_tr: 'Outlands\'teki küçük kasaba. Siyah zone pazar erişimi sağlar.',
    desc_en: 'Small town in the Outlands. Provides black zone market access.',
    bonuses: [
      { label_tr: 'Pazar', label_en: 'Market', value: '✅ Aktif (BZ)' },
      { label_tr: 'Crafting', label_en: 'Crafting', value: '✅ Temel istasyonlar' },
      { label_tr: 'Tehlike', label_en: 'Danger', value: '☠️ Siyah Zone' },
    ],
    tags: ['outlands'],
    resources_tr: ['T8 kaynaklar'],
    resources_en: ['T8 resources'],
    crafting_tr: 'Temel crafting istasyonları mevcut',
    crafting_en: 'Basic crafting stations available',
    how_to_tr: 'Outlands portalından gir',
    how_to_en: 'Enter through Outlands portal',
  },
  {
    id: 'morganas',
    name: "Morgana's Rest",
    icon: '🔮',
    biome: 'Outlands',
    biome_tr: 'Outlands',
    faction: 'Neutral',
    zone_type: 'black',
    desc_tr: 'Outlands\'teki büyü temalı kasaba. Ortak pazar sistemi kullanır.',
    desc_en: 'Magic-themed town in the Outlands. Shares a market system with the other Rests.',
    bonuses: [
      { label_tr: 'Pazar', label_en: 'Market', value: '✅ Aktif (BZ)' },
      { label_tr: 'Crafting', label_en: 'Crafting', value: '✅ Temel istasyonlar' },
      { label_tr: 'Tehlike', label_en: 'Danger', value: '☠️ Siyah Zone' },
    ],
    tags: ['outlands'],
    resources_tr: ['T8 kaynaklar'],
    resources_en: ['T8 resources'],
    crafting_tr: 'Temel crafting istasyonları mevcut',
    crafting_en: 'Basic crafting stations available',
    how_to_tr: 'Outlands portalından gir',
    how_to_en: 'Enter through Outlands portal',
  },
  {
    id: 'merlyns',
    name: "Merlyn's Rest",
    icon: '📖',
    biome: 'Outlands',
    biome_tr: 'Outlands',
    faction: 'Neutral',
    zone_type: 'black',
    desc_tr: 'Outlands\'teki bilge kasabası. Rest kasabaları ortak pazar paylaşır.',
    desc_en: 'The sage town of the Outlands. Rest towns share a common market.',
    bonuses: [
      { label_tr: 'Pazar', label_en: 'Market', value: '✅ Aktif (BZ)' },
      { label_tr: 'Crafting', label_en: 'Crafting', value: '✅ Temel istasyonlar' },
      { label_tr: 'Tehlike', label_en: 'Danger', value: '☠️ Siyah Zone' },
    ],
    tags: ['outlands'],
    resources_tr: ['T8 kaynaklar'],
    resources_en: ['T8 resources'],
    crafting_tr: 'Temel crafting istasyonları mevcut',
    crafting_en: 'Basic crafting stations available',
    how_to_tr: 'Outlands portalından gir',
    how_to_en: 'Enter through Outlands portal',
  },
];

const BIOMES_DATA = [
  {
    id: 'forest', name_tr: '🌲 Orman', name_en: '🌲 Forest',
    city_tr: 'Royal City: Lymhurst', city_en: 'Royal City: Lymhurst',
    color: '#2d5a27',
    resources: [
      { emoji: '🪵', tr: 'Odun (Birincil)', en: 'Wood (Primary)' },
      { emoji: '🦌', tr: 'Deri (İkincil)', en: 'Hide (Secondary)' },
      { emoji: '🪨', tr: 'Taş (Üçüncül)', en: 'Stone (Tertiary)' },
    ],
    craft_tr: 'Lymhurst: Yay ve Hafif Zırh +%15',
    craft_en: 'Lymhurst: Bow and Light Armor +15%',
  },
  {
    id: 'steppe', name_tr: '🏜️ Bozkır', name_en: '🏜️ Steppe',
    city_tr: 'Royal City: Bridgewatch', city_en: 'Royal City: Bridgewatch',
    color: '#8b6914',
    resources: [
      { emoji: '⛏️', tr: 'Cevher (Birincil)', en: 'Ore (Primary)' },
      { emoji: '🦌', tr: 'Deri (İkincil)', en: 'Hide (Secondary)' },
      { emoji: '🪨', tr: 'Taş (Üçüncül)', en: 'Stone (Tertiary)' },
    ],
    craft_tr: 'Bridgewatch: Hançer ve Crossbow +%15',
    craft_en: 'Bridgewatch: Dagger and Crossbow +15%',
  },
  {
    id: 'mountain', name_tr: '⛰️ Dağ', name_en: '⛰️ Mountain',
    city_tr: 'Royal City: Fort Sterling', city_en: 'Royal City: Fort Sterling',
    color: '#4a4a7a',
    resources: [
      { emoji: '⛏️', tr: 'Cevher (Birincil)', en: 'Ore (Primary)' },
      { emoji: '🪨', tr: 'Taş (İkincil)', en: 'Stone (Secondary)' },
      { emoji: '🌾', tr: 'Lif (Üçüncül)', en: 'Fiber (Tertiary)' },
    ],
    craft_tr: 'Fort Sterling: Çekiç ve Ağır Zırh +%15',
    craft_en: 'Fort Sterling: Hammer and Heavy Armor +15%',
  },
  {
    id: 'highlands', name_tr: '🏔️ Yayla', name_en: '🏔️ Highlands',
    city_tr: 'Royal City: Martlock', city_en: 'Royal City: Martlock',
    color: '#6a3a2a',
    resources: [
      { emoji: '🪨', tr: 'Taş (Birincil)', en: 'Stone (Primary)' },
      { emoji: '⛏️', tr: 'Cevher (İkincil)', en: 'Ore (Secondary)' },
      { emoji: '🪵', tr: 'Odun (Üçüncül)', en: 'Wood (Tertiary)' },
    ],
    craft_tr: 'Martlock: Kılıç ve Savaş Baltası +%15',
    craft_en: 'Martlock: Sword and Axe +15%',
  },
  {
    id: 'swamp', name_tr: '🌿 Bataklık', name_en: '🌿 Swamp',
    city_tr: 'Royal City: Thetford', city_en: 'Royal City: Thetford',
    color: '#1a4a1a',
    resources: [
      { emoji: '🌾', tr: 'Lif (Birincil)', en: 'Fiber (Primary)' },
      { emoji: '🪵', tr: 'Odun (İkincil)', en: 'Wood (Secondary)' },
      { emoji: '🦌', tr: 'Deri (Üçüncül)', en: 'Hide (Tertiary)' },
    ],
    craft_tr: 'Thetford: Asa ve Orta Zırh +%15',
    craft_en: 'Thetford: Staff and Medium Armor +15%',
  },
];

const ZONES_DATA = [
  // ROYAL CONTINENT — Blue
  { name:'Caerleon', type:'red', biome:'highlands', tier:'1', region_tr:'Royal Continent', region_en:'Royal Continent', resources_tr:['Tüm'], resources_en:['All'] },
  { name:'Lymhurst', type:'blue', biome:'forest', tier:'1', region_tr:'Royal Continent', region_en:'Royal Continent', resources_tr:['Odun','Deri'], resources_en:['Wood','Hide'] },
  { name:'Bridgewatch', type:'blue', biome:'steppe', tier:'1', region_tr:'Royal Continent', region_en:'Royal Continent', resources_tr:['Cevher','Taş'], resources_en:['Ore','Stone'] },
  { name:'Fort Sterling', type:'blue', biome:'mountain', tier:'1', region_tr:'Royal Continent', region_en:'Royal Continent', resources_tr:['Cevher','Taş'], resources_en:['Ore','Stone'] },
  { name:'Martlock', type:'blue', biome:'highlands', tier:'1', region_tr:'Royal Continent', region_en:'Royal Continent', resources_tr:['Taş','Cevher'], resources_en:['Stone','Ore'] },
  { name:'Thetford', type:'blue', biome:'swamp', tier:'1', region_tr:'Royal Continent', region_en:'Royal Continent', resources_tr:['Lif','Odun'], resources_en:['Fiber','Wood'] },
  // Yellow Zones
  { name:'Forest Cross', type:'yellow', biome:'forest', tier:'2', region_tr:'Royal Continent', region_en:'Royal Continent', resources_tr:['Odun T2-T3','Deri'], resources_en:['Wood T2-T3','Hide'] },
  { name:'Steppe Cross', type:'yellow', biome:'steppe', tier:'2', region_tr:'Royal Continent', region_en:'Royal Continent', resources_tr:['Cevher T2-T3','Taş'], resources_en:['Ore T2-T3','Stone'] },
  { name:'Mountain Cross', type:'yellow', biome:'mountain', tier:'2', region_tr:'Royal Continent', region_en:'Royal Continent', resources_tr:['Cevher T2-T3'], resources_en:['Ore T2-T3'] },
  { name:'Swamp Cross', type:'yellow', biome:'swamp', tier:'2', region_tr:'Royal Continent', region_en:'Royal Continent', resources_tr:['Lif T2-T3'], resources_en:['Fiber T2-T3'] },
  { name:'Highlands Cross', type:'yellow', biome:'highlands', tier:'2', region_tr:'Royal Continent', region_en:'Royal Continent', resources_tr:['Taş T2-T3'], resources_en:['Stone T2-T3'] },
  // Red Zones (around Caerleon)
  { name:'Caerleon Forest', type:'red', biome:'forest', tier:'5-6', region_tr:'Royal Continent', region_en:'Royal Continent', resources_tr:['Odun T5-T6','Deri T5'], resources_en:['Wood T5-T6','Hide T5'] },
  { name:'Caerleon Steppe', type:'red', biome:'steppe', tier:'5-6', region_tr:'Royal Continent', region_en:'Royal Continent', resources_tr:['Cevher T5-T6'], resources_en:['Ore T5-T6'] },
  { name:'Caerleon Highlands', type:'red', biome:'highlands', tier:'5-6', region_tr:'Royal Continent', region_en:'Royal Continent', resources_tr:['Taş T5-T6','Cevher T5'], resources_en:['Stone T5-T6','Ore T5'] },
  // Outlands — Black
  { name:"Arthur's Rest", type:'black', biome:'steppe', tier:'6-8', region_tr:'Outlands', region_en:'Outlands', resources_tr:['T6-T8 Tüm'], resources_en:['T6-T8 All'] },
  { name:"Morgana's Rest", type:'black', biome:'swamp', tier:'6-8', region_tr:'Outlands', region_en:'Outlands', resources_tr:['T6-T8 Tüm'], resources_en:['T6-T8 All'] },
  { name:"Merlyn's Rest", type:'black', biome:'forest', tier:'6-8', region_tr:'Outlands', region_en:'Outlands', resources_tr:['T6-T8 Tüm'], resources_en:['T6-T8 All'] },
  { name:'Anglia BZ-1', type:'black', biome:'forest', tier:'6', region_tr:'Outlands/Anglia', region_en:'Outlands/Anglia', resources_tr:['Odun T6','Deri T6'], resources_en:['Wood T6','Hide T6'] },
  { name:'Anglia BZ-2', type:'black', biome:'swamp', tier:'6', region_tr:'Outlands/Anglia', region_en:'Outlands/Anglia', resources_tr:['Lif T6'], resources_en:['Fiber T6'] },
  { name:'Cumbria BZ-1', type:'black', biome:'mountain', tier:'7', region_tr:'Outlands/Cumbria', region_en:'Outlands/Cumbria', resources_tr:['Cevher T7','Taş T7'], resources_en:['Ore T7','Stone T7'] },
  { name:'Glouvia BZ-1', type:'black', biome:'steppe', tier:'7', region_tr:'Outlands/Glouvia', region_en:'Outlands/Glouvia', resources_tr:['Cevher T7','Deri T7'], resources_en:['Ore T7','Hide T7'] },
  { name:'Mercia BZ-1', type:'black', biome:'highlands', tier:'8', region_tr:'Outlands/Mercia', region_en:'Outlands/Mercia', resources_tr:['T8 Tüm'], resources_en:['T8 All'] },
  { name:'Siluria BZ-1', type:'black', biome:'forest', tier:'8', region_tr:'Outlands/Siluria', region_en:'Outlands/Siluria', resources_tr:['T8 Tüm'], resources_en:['T8 All'] },
  // Brecilien / Mist
  { name:'Brecilien', type:'blue', biome:'mist', tier:'Özel', region_tr:'Mist', region_en:'Mist', resources_tr:['Kristal','Mist Kaynakları'], resources_en:['Crystal','Mist Resources'] },
];

const OUTLANDS_DATA = [
  { name:'Anglia', emoji:'🌲', level_tr:'Düşük Seviye', level_en:'Low Level', tier:'T4-T6', desc_tr:'Outlands\'ın güneybatısındaki başlangıç bölgesi. Yeni Outlands oyuncuları için idealdir.', desc_en:'Starting region in the southwestern Outlands. Ideal for new Outlands players.' },
  { name:'Glouvia', emoji:'🏜️', level_tr:'Düşük Seviye', level_en:'Low Level', tier:'T4-T6', desc_tr:'Anglia\'nın kuzeyinde konumlanır. Oberon güncellemesiyle eklendi.', desc_en:'Located north of Anglia. Added with the Oberon update.' },
  { name:'Cumbria', emoji:'⛰️', level_tr:'Orta Seviye', level_en:'Mid Level', tier:'T5-T7', desc_tr:'Anglia ve Glouvia\'nın doğusunda. Orta seviye kaynak ve PvP içeriği sunar.', desc_en:'East of Anglia and Glouvia. Offers mid-level resources and PvP content.' },
  { name:'Siluria', emoji:'🌿', level_tr:'Yüksek Seviye', level_en:'High Level', tier:'T6-T8', desc_tr:'Mercia\'nın kuzeydoğusunda. Yüksek tier kaynaklar ve güçlü mob\'lar barındırır.', desc_en:'Northeast of Mercia. High tier resources and powerful mobs.' },
  { name:'Mercia', emoji:'💀', level_tr:'En Yüksek Seviye', level_en:'Highest Level', tier:'T7-T8', desc_tr:'Outlands\'ın en tehlikeli bölgesi. T8 kaynaklar ve en güçlü içerik burada.', desc_en:'Most dangerous region of the Outlands. T8 resources and strongest content here.' },
  { name:"Arthur's Rest", emoji:'🗡️', level_tr:'Kasaba', level_en:'Town', tier:'Tüm', desc_tr:'Outlands\'teki güvenli kasaba. Pazar ve temel crafting istasyonları mevcut.', desc_en:'Safe town in the Outlands. Market and basic crafting stations available.' },
  { name:"Morgana's Rest", emoji:'🔮', level_tr:'Kasaba', level_en:'Town', tier:'Tüm', desc_tr:'Outlands\'teki büyü temalı kasaba. Arthur\'s Rest ile ortak pazar kullanır.', desc_en:'Magic-themed town in the Outlands. Shares market with Arthur\'s Rest.' },
  { name:"Merlyn's Rest", emoji:'📖', level_tr:'Kasaba', level_en:'Town', tier:'Tüm', desc_tr:'Outlands\'teki üçüncü kasaba. Tüm Rest\'ler ortak pazar sistemiyle çalışır.', desc_en:'Third town in the Outlands. All Rests share a common market system.' },
];

const SPECIAL_ZONES = [
  {
    title: 'Roads of Avalon', subtitle_tr: '⚔️ Siyah Zone Labirent', subtitle_en: '⚔️ Black Zone Labyrinth',
    emoji: '🌀',
    desc_tr: 'Outlands\'ın ortasındaki gizemli yollar. Düzenli aralıklarla yeniden şekillenen bu labirent, T4-T8 kaynaklar, Hideout\'lar ve PvP içeriği sunar. Her portal 3-7 gün sonra kapanır.',
    desc_en: 'Mysterious roads in the center of the Outlands. This maze reshapes periodically, offering T4-T8 resources, Hideouts, and PvP content. Every portal closes after 3-7 days.',
    highlights_tr: ['T4-T8 Kaynaklar', 'Hideout kurulabilir', 'Solo ve grup PvP', 'Bosslar ve hazineler'],
    highlights_en: ['T4-T8 Resources', 'Build a Hideout', 'Solo and group PvP', 'Bosses and treasures'],
  },
  {
    title: 'The Mists', subtitle_tr: '🌫️ Gizemli Sis Bölgesi', subtitle_en: '🌫️ Mysterious Mist Zone',
    emoji: '🌫️',
    desc_tr: 'Gizemli portallardan girilir. Her Mist bölgesi benzersizdir ve Brecilien\'e ulaşmanın tek yoludur. Solo oyuncular için tasarlanmıştır.',
    desc_en: 'Entered through mysterious portals. Each Mist zone is unique and the only way to reach Brecilien. Designed for solo players.',
    highlights_tr: ['Solo odaklı içerik', 'Brecilien\'e giriş', 'Eşsiz Mist yaratıkları', 'Nadir düşüşler'],
    highlights_en: ['Solo-focused content', 'Gateway to Brecilien', 'Unique Mist creatures', 'Rare drops'],
  },
  {
    title: 'Brecilien', subtitle_tr: '🏙️ Sis Şehri', subtitle_en: '🏙️ City of the Mists',
    emoji: '🌆',
    desc_tr: 'Sisin içinde saklı şehir. Crystal Realm erişimi, özel crafting ve pazar sunar. Buraya ulaşmak için Mist\'lerden geçmek zorunludur.',
    desc_en: 'City hidden within the Mists. Offers Crystal Realm access, special crafting and market. Must traverse the Mists to reach it.',
    highlights_tr: ['Crystal Realm erişimi', 'Özel Mist crafting', 'Realmgate mevcut', 'Crystal silahlar'],
    highlights_en: ['Crystal Realm access', 'Special Mist crafting', 'Realmgate available', 'Crystal weapons'],
  },
  {
    title: 'Crystal Realm', subtitle_tr: '💎 Rekabetçi Arena', subtitle_en: '💎 Competitive Arena',
    emoji: '💎',
    desc_tr: 'Belirlenmiş takımların rekabetçi ortamda karşılaştığı özel arena. Crystal Swords ve özel ödüller kazanılabilir. Yalnızca Brecilien üzerinden erişilir.',
    desc_en: 'Special arena where designated teams compete. Crystal Swords and special rewards can be earned. Accessible only through Brecilien.',
    highlights_tr: ['Takım bazlı PvP', 'Crystal Sword ödülü', 'Sezon sıralaması', 'Özel eşyalar'],
    highlights_en: ['Team-based PvP', 'Crystal Sword reward', 'Season ranking', 'Special items'],
  },
  {
    title: 'Corrupted Dungeons', subtitle_tr: '👹 Solo PvPvE Zindanı', subtitle_en: '👹 Solo PvPvE Dungeon',
    emoji: '👹',
    desc_tr: 'Solo oyuncular için tasarlanmış özel zindanlar. Hem mob\'larla hem diğer oyuncularla savaş. Kırmızı ve Siyah Zone\'larda mevcuttur.',
    desc_en: 'Special dungeons designed for solo players. Fight both mobs and other players. Available in Red and Black Zones.',
    highlights_tr: ['Solo PvP + PvE', 'İstila mekaniği', 'Kırmızı&Siyah Zone', 'Demonic Energy ödülü'],
    highlights_en: ['Solo PvP + PvE', 'Invasion mechanic', 'Red&Black Zone', 'Demonic Energy reward'],
  },
  {
    title: 'Hellgates', subtitle_tr: '🔥 Takım PvPvE', subtitle_en: '🔥 Team PvPvE',
    emoji: '🔥',
    desc_tr: '2v2 veya 5v5 formatında PvPvE zindanlar. Kırmızı ve Siyah Zone\'larda giriş noktaları bulunur. Hellgate Seal gerektirir.',
    desc_en: 'PvPvE dungeons in 2v2 or 5v5 format. Entry points in Red and Black Zones. Requires a Hellgate Seal.',
    highlights_tr: ['2v2 / 5v5 format', 'PvP + PvE', 'Hellgate Seal gerekli', 'Yüksek ödüller'],
    highlights_en: ['2v2 / 5v5 format', 'PvP + PvE', 'Hellgate Seal required', 'High rewards'],
  },
];

// =====================================================
// CANVAS HARİTASI
// =====================================================
const MAP_ZONES = [
  // Format: { id, label, x, y, w, h, type, city }
  // ROYAL CONTINENT CENTER
  { id:'caerleon',    label:'Caerleon',     x:0.48, y:0.47, w:0.06, h:0.04, type:'red',    city:true },
  // 5 Royal Cities
  { id:'lymhurst',   label:'Lymhurst',     x:0.30, y:0.42, w:0.07, h:0.04, type:'blue',   city:true },
  { id:'bridgewatch',label:'Bridgewatch',  x:0.64, y:0.56, w:0.07, h:0.04, type:'blue',   city:true },
  { id:'fortsterling',label:'Fort Sterling',x:0.48, y:0.28, w:0.07, h:0.04, type:'blue',  city:true },
  { id:'martlock',   label:'Martlock',     x:0.32, y:0.60, w:0.07, h:0.04, type:'blue',   city:true },
  { id:'thetford',   label:'Thetford',     x:0.62, y:0.36, w:0.07, h:0.04, type:'blue',   city:true },
  // Yellow zones (sample)
  { id:'fc',  label:'Forest Cross',   x:0.22, y:0.38, w:0.06, h:0.03, type:'yellow' },
  { id:'sc',  label:'Steppe Cross',   x:0.70, y:0.62, w:0.06, h:0.03, type:'yellow' },
  { id:'mc',  label:'Mountain Cross', x:0.48, y:0.20, w:0.06, h:0.03, type:'yellow' },
  { id:'swc', label:'Swamp Cross',    x:0.58, y:0.28, w:0.06, h:0.03, type:'yellow' },
  { id:'hc',  label:'Highlands Cross',x:0.24, y:0.66, w:0.06, h:0.03, type:'yellow' },
  // Red zones (around Caerleon)
  { id:'rcf', label:'Red Zone N',     x:0.42, y:0.40, w:0.05, h:0.03, type:'red' },
  { id:'rcs', label:'Red Zone E',     x:0.56, y:0.47, w:0.05, h:0.03, type:'red' },
  { id:'rch', label:'Red Zone W',     x:0.38, y:0.52, w:0.05, h:0.03, type:'red' },
  // Outlands (top area)
  { id:'anglia',  label:'Anglia',     x:0.16, y:0.12, w:0.10, h:0.06, type:'black' },
  { id:'glouvia', label:'Glouvia',    x:0.30, y:0.08, w:0.10, h:0.06, type:'black' },
  { id:'cumbria', label:'Cumbria',    x:0.46, y:0.06, w:0.10, h:0.06, type:'black' },
  { id:'siluria', label:'Siluria',    x:0.62, y:0.08, w:0.10, h:0.06, type:'black' },
  { id:'mercia',  label:'Mercia',     x:0.76, y:0.12, w:0.10, h:0.06, type:'black' },
  { id:'arthurs', label:"Arthur's Rest",  x:0.14, y:0.22, w:0.08, h:0.04, type:'black', city:true },
  { id:'morganas',label:"Morgana's Rest", x:0.48, y:0.16, w:0.08, h:0.04, type:'black', city:true },
  { id:'merlyns', label:"Merlyn's Rest",  x:0.78, y:0.22, w:0.08, h:0.04, type:'black', city:true },
  // Mist / Brecilien (right side)
  { id:'brecilien',label:'Brecilien', x:0.86, y:0.44, w:0.07, h:0.04, type:'blue',  city:true },
  { id:'mist1',   label:'The Mists', x:0.86, y:0.36, w:0.07, h:0.05, type:'blue' },
];

const TYPE_COLORS = { blue:'#4a9eff', yellow:'#f5c842', red:'#ff4a4a', black:'#555555' };
const TYPE_BG     = { blue:'#0a1a3d', yellow:'#2d2000', red:'#2d0808', black:'#111111' };

function initWorldMap() {
  const canvas = document.getElementById('worldMapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const wrapper = canvas.parentElement;
    canvas.width  = wrapper.clientWidth;
    canvas.height = Math.max(480, wrapper.clientWidth * 0.55);
    draw();
  }

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#ffffff08';
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,H); ctx.stroke(); }
    for (let i = 0; i < H; i += 40) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(W,i); ctx.stroke(); }

    // Section labels
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#ffffff22';
    ctx.fillText('— OUTLANDS —', W * 0.38, H * 0.05);
    ctx.fillText('— ROYAL CONTINENT —', W * 0.33, H * 0.78);

    // Filter state
    const showBlue   = document.getElementById('filterBlue')?.checked   ?? true;
    const showYellow = document.getElementById('filterYellow')?.checked ?? true;
    const showRed    = document.getElementById('filterRed')?.checked    ?? true;
    const showBlack  = document.getElementById('filterBlack')?.checked  ?? true;
    const showCities = document.getElementById('filterCities')?.checked ?? true;

    MAP_ZONES.forEach(z => {
      if (z.type === 'blue'   && !showBlue)   return;
      if (z.type === 'yellow' && !showYellow) return;
      if (z.type === 'red'    && !showRed)    return;
      if (z.type === 'black'  && !showBlack)  return;
      if (z.city && !showCities) return;

      const x = z.x * W, y = z.y * H, w = z.w * W, h = z.h * H;
      const col = TYPE_COLORS[z.type];
      const bg  = TYPE_BG[z.type];

      // Glow
      ctx.shadowColor = col;
      ctx.shadowBlur  = z.city ? 14 : 6;

      // Fill
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 5);
      ctx.fill();

      // Border
      ctx.strokeStyle = col;
      ctx.lineWidth   = z.city ? 2 : 1;
      ctx.stroke();
      ctx.shadowBlur  = 0;

      // City star
      if (z.city) {
        ctx.fillStyle = col;
        ctx.font = `bold ${Math.max(9, w * 0.22)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('★', x + w/2, y + h * 0.45);
      }

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = `${z.city ? 'bold ' : ''}${Math.max(8, Math.min(11, w * 0.18))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(z.label, x + w/2, y + h - 4);
    });
  }

  // Tooltip
  const tooltip = document.getElementById('mapTooltip');
  const infoBar  = document.getElementById('mapZoneInfo');

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top)  * (canvas.height / rect.height);
    const W = canvas.width, H = canvas.height;
    const hit = MAP_ZONES.find(z => mx >= z.x*W && mx <= (z.x+z.w)*W && my >= z.y*H && my <= (z.y+z.h)*H);
    if (hit) {
      const typeLabel = { blue:'🔵 Mavi — Güvenli', yellow:'🟡 Sarı — Kısıtlı PvP', red:'🔴 Kırmızı — Full PvP', black:'⚫ Siyah — Full Loot' };
      tooltip.innerHTML = `<strong>${hit.label}</strong><br>${typeLabel[hit.type]}${hit.city ? '<br>🏙️ Şehir' : ''}`;
      tooltip.style.display = 'block';
      tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
      tooltip.style.top  = (e.clientY - rect.top  + 12) + 'px';
      canvas.style.cursor = hit.city ? 'pointer' : 'crosshair';
    } else {
      tooltip.style.display = 'none';
      canvas.style.cursor = 'crosshair';
    }
  });

  canvas.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top)  * (canvas.height / rect.height);
    const W = canvas.width, H = canvas.height;
    const hit = MAP_ZONES.find(z => mx >= z.x*W && mx <= (z.x+z.w)*W && my >= z.y*H && my <= (z.y+z.h)*H);
    if (hit) openZoneModal(hit.id, hit.label, hit.type);
  });

  // Filter changes
  ['filterBlue','filterYellow','filterRed','filterBlack','filterCities'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', draw);
  });

  window.addEventListener('resize', resize);
  resize();
}

window.focusZone = function(id) {
  const zone = MAP_ZONES.find(z => z.id === id);
  if (zone) openZoneModal(zone.id, zone.label, zone.type);
};

function openZoneModal(id, name, type) {
  const city = CITIES_DATA.find(c => c.id === id);
  const lang = window._currentLang || 'tr';
  const modal = document.getElementById('zoneModal');
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');

  let html = `<h2 style="color:${TYPE_COLORS[type]};margin:0 0 0.5rem">${name}</h2>`;
  if (city) {
    html += `<p style="color:var(--text-muted);margin:0 0 1rem;font-size:0.85rem">${lang==='tr' ? city.desc_tr : city.desc_en}</p>`;
    html += `<table style="width:100%;font-size:0.85rem;border-collapse:collapse">`;
    city.bonuses.forEach(b => {
      html += `<tr><td style="padding:0.4rem 0;border-bottom:1px solid var(--border);color:var(--text-muted)">${lang==='tr' ? b.label_tr : b.label_en}</td><td style="text-align:right;color:var(--accent);font-weight:600;border-bottom:1px solid var(--border)">${b.value}</td></tr>`;
    });
    html += `</table>`;
    html += `<div style="margin-top:1rem;font-size:0.82rem;color:var(--text-muted)">🧭 ${lang==='tr' ? city.how_to_tr : city.how_to_en}</div>`;
  } else {
    const typeLabel = { blue:'Mavi Zone — Güvenli', yellow:'Sarı Zone — Kısıtlı PvP', red:'Kırmızı Zone — Full PvP', black:'Siyah Zone — Full Loot' };
    html += `<p style="color:${TYPE_COLORS[type]}">${typeLabel[type]}</p>`;
  }

  content.innerHTML = html;
  modal.classList.add('active');
  overlay.classList.add('active');
}

window.closeModal = function() {
  document.getElementById('zoneModal').classList.remove('active');
  document.getElementById('modalOverlay').classList.remove('active');
};

// =====================================================
// CITIES TAB
// =====================================================
function renderCities() {
  const grid = document.getElementById('citiesGrid');
  if (!grid) return;
  const lang = window._currentLang || 'tr';
  grid.innerHTML = CITIES_DATA.map(c => {
    const tagHtml = c.tags.map(t => `<span class="city-tag tag-${t}">${t === 'black-market' ? 'Black Market' : t.charAt(0).toUpperCase()+t.slice(1)}</span>`).join('');
    const bonusRows = c.bonuses.map(b => `<tr><td>${lang==='tr' ? b.label_tr : b.label_en}</td><td>${b.value}</td></tr>`).join('');
    const res = (lang==='tr' ? c.resources_tr : c.resources_en).join(', ');
    return `
    <div class="city-card" onclick="openZoneModal('${c.id}','${c.name}','${c.zone_type}')">
      <div class="city-card-header" style="background:${TYPE_BG[c.zone_type]};border-bottom:1px solid ${TYPE_COLORS[c.zone_type]}22">
        <div class="city-icon">${c.icon}</div>
        <div>
          <div class="city-name">${c.name}</div>
          <div class="city-biome">${lang==='tr' ? c.biome_tr : c.biome} · ${lang==='tr' ? 'Faction' : 'Faction'}: ${c.faction}</div>
        </div>
      </div>
      <div class="city-card-body">
        <table class="city-bonus-table">${bonusRows}</table>
        <div style="font-size:0.82rem;color:var(--text-muted);margin-top:0.6rem">📦 ${res}</div>
        <div class="city-tags">${tagHtml}</div>
      </div>
    </div>`;
  }).join('');
}

// =====================================================
// ZONES TABLE
// =====================================================
function renderZones(filter = '', typeFilter = '', biomeFilter = '') {
  const tbody = document.getElementById('zonesTbody');
  if (!tbody) return;
  const lang = window._currentLang || 'tr';
  const filtered = ZONES_DATA.filter(z => {
    const name = z.name.toLowerCase();
    const matchText = !filter || name.includes(filter.toLowerCase());
    const matchType = !typeFilter || z.type === typeFilter;
    const matchBiome = !biomeFilter || z.biome === biomeFilter;
    return matchText && matchType && matchBiome;
  });

  tbody.innerHTML = filtered.map(z => {
    const res = (lang==='tr' ? z.resources_tr : z.resources_en);
    const resHtml = res.map(r => `<span class="res-icon" title="${r}">${r.substring(0,2)}</span>`).join('');
    const region = lang==='tr' ? z.region_tr : z.region_en;
    return `<tr>
      <td><strong>${z.name}</strong></td>
      <td><span class="zone-type-badge badge-${z.type}">${z.type.toUpperCase()}</span></td>
      <td>${z.biome}</td>
      <td><div class="resource-icons">${resHtml}</div></td>
      <td>${z.tier}</td>
      <td style="color:var(--text-muted)">${region}</td>
    </tr>`;
  }).join('');
}

// =====================================================
// BIOMES TAB
// =====================================================
function renderBiomes() {
  const grid = document.getElementById('biomesGrid');
  if (!grid) return;
  const lang = window._currentLang || 'tr';
  grid.innerHTML = BIOMES_DATA.map(b => {
    const resHtml = b.resources.map(r => `<div class="biome-res-item"><span class="res-emoji">${r.emoji}</span><span>${lang==='tr' ? r.tr : r.en}</span></div>`).join('');
    return `
    <div class="biome-card" style="border-color:${b.color}44">
      <div class="biome-card-header" style="background:${b.color}22;border-bottom:1px solid ${b.color}33">
        <div class="biome-title" style="color:${b.color === '#2d5a27' ? '#4caf50' : b.color === '#8b6914' ? '#f5c842' : b.color === '#4a4a7a' ? '#9e9eff' : b.color === '#6a3a2a' ? '#ef9a9a' : '#66bb6a'}">${lang==='tr' ? b.name_tr : b.name_en}</div>
        <div class="biome-city">${lang==='tr' ? b.city_tr : b.city_en}</div>
      </div>
      <div class="biome-resources">${resHtml}</div>
      <div class="craft-bonus">🔨 <strong>${lang==='tr' ? b.craft_tr : b.craft_en}</strong></div>
    </div>`;
  }).join('');
}

// =====================================================
// OUTLANDS TAB
// =====================================================
function renderOutlands() {
  const grid = document.getElementById('outlandsGrid');
  if (!grid) return;
  const lang = window._currentLang || 'tr';
  grid.innerHTML = OUTLANDS_DATA.map(o => `
    <div class="outland-card">
      <div class="outland-card-title">${o.emoji} ${o.name} <span style="font-size:0.75rem;color:var(--text-muted);font-weight:400">· ${lang==='tr' ? o.level_tr : o.level_en} · Tier ${o.tier}</span></div>
      <div class="outland-info">${lang==='tr' ? o.desc_tr : o.desc_en}</div>
    </div>
  `).join('');
}

// =====================================================
// SPECIAL ZONES TAB
// =====================================================
function renderSpecial() {
  const grid = document.getElementById('specialZonesGrid');
  if (!grid) return;
  const lang = window._currentLang || 'tr';
  grid.innerHTML = SPECIAL_ZONES.map(s => {
    const hls = (lang==='tr' ? s.highlights_tr : s.highlights_en).map(h => `<span class="special-highlight">✦ ${h}</span>`).join('  ');
    return `
    <div class="special-card">
      <div class="special-card-title">${s.emoji} ${s.title}</div>
      <div class="special-card-sub">${lang==='tr' ? s.subtitle_tr : s.subtitle_en}</div>
      <div class="special-card-body">${lang==='tr' ? s.desc_tr : s.desc_en}</div>
      <div style="margin-top:0.8rem;font-size:0.8rem;display:flex;flex-wrap:wrap;gap:0.5rem">${hls}</div>
    </div>`;
  }).join('');
}

// =====================================================
// TABS
// =====================================================
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab)?.classList.add('active');
    });
  });
}

// =====================================================
// ZONE SEARCH & FILTER
// =====================================================
function initZoneFilters() {
  const search = document.getElementById('zoneSearch');
  const typeF  = document.getElementById('zoneTypeFilter');
  const biomeF = document.getElementById('zoneBiomeFilter');
  const update = () => renderZones(search?.value || '', typeF?.value || '', biomeF?.value || '');
  search?.addEventListener('input', update);
  typeF?.addEventListener('change', update);
  biomeF?.addEventListener('change', update);
}

// =====================================================
// INIT
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initWorldMap();
  renderCities();
  renderZones();
  renderBiomes();
  renderOutlands();
  renderSpecial();
  initZoneFilters();

  // Dil değişince yeniden render
  document.addEventListener('langChanged', () => {
    renderCities();
    renderZones(
      document.getElementById('zoneSearch')?.value || '',
      document.getElementById('zoneTypeFilter')?.value || '',
      document.getElementById('zoneBiomeFilter')?.value || ''
    );
    renderBiomes();
    renderOutlands();
    renderSpecial();
  });
});
