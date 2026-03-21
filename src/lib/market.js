// AoT-PNASF — Market Module v3
// Düzeltmeler: tarih formatı, tüm kategoriler, Black Market açıklaması

const SERVERS = {
  europe: 'https://europe.albion-online-data.com',
  west:   'https://west.albion-online-data.com',
  east:   'https://east.albion-online-data.com'
};

const ALL_CITIES = 'Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford,Fort Sterling,Brecilien,Black Market';

const CITY_DISPLAY = {
  'Caerleon':'Caerleon','Bridgewatch':'Bridgewatch','Lymhurst':'Lymhurst',
  'Martlock':'Martlock','Thetford':'Thetford','Fort Sterling':'Fort Sterling',
  'FortSterling':'Fort Sterling','Brecilien':'Brecilien','Black Market':'Black Market'
};

const CITY_CLASS = {
  'Caerleon':'city-caerleon','Bridgewatch':'city-bridgewatch','Lymhurst':'city-lymhurst',
  'Martlock':'city-martlock','Thetford':'city-thetford','Fort Sterling':'city-fortsterling',
  'FortSterling':'city-fortsterling','Brecilien':'city-brecilien','Black Market':'city-blackmarket'
};

const CATEGORIES = {
  all: (()=>{ // Tüm eşyalar — items-data.js'den dinamik oluşturulur
    const tiers=[4,5,6,7,8];
    const items=window.AO_ITEMS||[];
    return items.flatMap(i=>tiers.filter(t=>i.tiers.includes(t)).map(t=>`T${t}_${i.id}`));
  }),
  bags:         ['T2_BAG','T3_BAG','T4_BAG','T5_BAG','T6_BAG','T7_BAG','T8_BAG'],
  swords:       ['T4_MAIN_SWORD','T5_MAIN_SWORD','T6_MAIN_SWORD','T7_MAIN_SWORD','T8_MAIN_SWORD','T4_2H_CLAYMORE','T5_2H_CLAYMORE','T6_2H_CLAYMORE','T7_2H_CLAYMORE','T8_2H_CLAYMORE','T4_2H_DUALSWORD','T5_2H_DUALSWORD','T6_2H_DUALSWORD','T7_2H_DUALSWORD','T8_2H_DUALSWORD','T4_2H_CLEAVER_HELL','T5_2H_CLEAVER_HELL','T6_2H_CLEAVER_HELL'],
  bows:         ['T4_2H_BOW','T5_2H_BOW','T6_2H_BOW','T7_2H_BOW','T8_2H_BOW','T4_2H_LONGBOW','T5_2H_LONGBOW','T6_2H_LONGBOW','T7_2H_LONGBOW','T8_2H_LONGBOW','T4_2H_CROSSBOW','T5_2H_CROSSBOW','T6_2H_CROSSBOW','T7_2H_CROSSBOW','T8_2H_CROSSBOW','T4_2H_BOW_HELL','T5_2H_BOW_HELL','T6_2H_BOW_HELL','T4_2H_BOW_MORGANA','T5_2H_BOW_MORGANA','T6_2H_BOW_MORGANA','T4_2H_CROSSBOW_CANNON','T5_2H_CROSSBOW_CANNON','T6_2H_CROSSBOW_CANNON'],
  axes:         ['T4_MAIN_AXE','T5_MAIN_AXE','T6_MAIN_AXE','T7_MAIN_AXE','T8_MAIN_AXE','T4_2H_AXE','T5_2H_AXE','T6_2H_AXE','T7_2H_AXE','T8_2H_AXE','T4_2H_HALBERD','T5_2H_HALBERD','T6_2H_HALBERD','T7_2H_HALBERD','T8_2H_HALBERD','T4_2H_SCYTHE_HELL','T5_2H_SCYTHE_HELL','T6_2H_SCYTHE_HELL'],
  staves:       ['T4_MAIN_ARCANE','T5_MAIN_ARCANE','T6_MAIN_ARCANE','T7_MAIN_ARCANE','T8_MAIN_ARCANE','T4_MAIN_FIRE','T5_MAIN_FIRE','T6_MAIN_FIRE','T7_MAIN_FIRE','T8_MAIN_FIRE','T4_MAIN_FROST','T5_MAIN_FROST','T6_MAIN_FROST','T7_MAIN_FROST','T8_MAIN_FROST','T4_MAIN_HOLY','T5_MAIN_HOLY','T6_MAIN_HOLY','T7_MAIN_HOLY','T8_MAIN_HOLY','T4_MAIN_NATURE','T5_MAIN_NATURE','T6_MAIN_NATURE','T7_MAIN_NATURE','T8_MAIN_NATURE','T4_2H_DEMONICSTAFF','T5_2H_DEMONICSTAFF','T6_2H_DEMONICSTAFF'],
  hammers:      ['T4_MAIN_HAMMER','T5_MAIN_HAMMER','T6_MAIN_HAMMER','T7_MAIN_HAMMER','T8_MAIN_HAMMER','T4_2H_POLEHAMMER','T5_2H_POLEHAMMER','T6_2H_POLEHAMMER','T7_2H_POLEHAMMER','T8_2H_POLEHAMMER','T4_2H_HAMMER_HELL','T5_2H_HAMMER_HELL','T6_2H_HAMMER_HELL'],
  spears:       ['T4_MAIN_SPEAR','T5_MAIN_SPEAR','T6_MAIN_SPEAR','T7_MAIN_SPEAR','T8_MAIN_SPEAR','T4_2H_SPEAR','T5_2H_SPEAR','T6_2H_SPEAR','T7_2H_SPEAR','T8_2H_SPEAR','T4_2H_GLAIVE','T5_2H_GLAIVE','T6_2H_GLAIVE','T7_2H_GLAIVE','T8_2H_GLAIVE'],
  armor_leather:['T4_HEAD_LEATHER_SET1','T5_HEAD_LEATHER_SET1','T6_HEAD_LEATHER_SET1','T7_HEAD_LEATHER_SET1','T8_HEAD_LEATHER_SET1','T4_ARMOR_LEATHER_SET1','T5_ARMOR_LEATHER_SET1','T6_ARMOR_LEATHER_SET1','T7_ARMOR_LEATHER_SET1','T8_ARMOR_LEATHER_SET1','T4_SHOES_LEATHER_SET1','T5_SHOES_LEATHER_SET1','T6_SHOES_LEATHER_SET1','T7_SHOES_LEATHER_SET1','T8_SHOES_LEATHER_SET1'],
  armor_plate:  ['T4_HEAD_PLATE_SET1','T5_HEAD_PLATE_SET1','T6_HEAD_PLATE_SET1','T7_HEAD_PLATE_SET1','T8_HEAD_PLATE_SET1','T4_ARMOR_PLATE_SET1','T5_ARMOR_PLATE_SET1','T6_ARMOR_PLATE_SET1','T7_ARMOR_PLATE_SET1','T8_ARMOR_PLATE_SET1','T4_SHOES_PLATE_SET1','T5_SHOES_PLATE_SET1','T6_SHOES_PLATE_SET1','T7_SHOES_PLATE_SET1','T8_SHOES_PLATE_SET1'],
  armor_cloth:  ['T4_HEAD_CLOTH_SET1','T5_HEAD_CLOTH_SET1','T6_HEAD_CLOTH_SET1','T7_HEAD_CLOTH_SET1','T8_HEAD_CLOTH_SET1','T4_ARMOR_CLOTH_SET1','T5_ARMOR_CLOTH_SET1','T6_ARMOR_CLOTH_SET1','T7_ARMOR_CLOTH_SET1','T8_ARMOR_CLOTH_SET1','T4_SHOES_CLOTH_SET1','T5_SHOES_CLOTH_SET1','T6_SHOES_CLOTH_SET1','T7_SHOES_CLOTH_SET1','T8_SHOES_CLOTH_SET1'],
  resources:    ['T4_WOOD','T5_WOOD','T6_WOOD','T7_WOOD','T8_WOOD','T4_ORE','T5_ORE','T6_ORE','T7_ORE','T8_ORE','T4_FIBER','T5_FIBER','T6_FIBER','T7_FIBER','T8_FIBER','T4_HIDE','T5_HIDE','T6_HIDE','T7_HIDE','T8_HIDE','T4_ROCK','T5_ROCK','T6_ROCK','T7_ROCK','T8_ROCK'],
  refined:      ['T4_PLANKS','T5_PLANKS','T6_PLANKS','T7_PLANKS','T8_PLANKS','T4_METALBAR','T5_METALBAR','T6_METALBAR','T7_METALBAR','T8_METALBAR','T4_CLOTH','T5_CLOTH','T6_CLOTH','T7_CLOTH','T8_CLOTH','T4_LEATHER','T5_LEATHER','T6_LEATHER','T7_LEATHER','T8_LEATHER','T4_STONEBLOCK','T5_STONEBLOCK','T6_STONEBLOCK','T7_STONEBLOCK','T8_STONEBLOCK'],
  food:         ['T4_MEAL_STEW','T5_MEAL_STEW','T6_MEAL_STEW','T7_MEAL_STEW','T4_MEAL_SOUP','T5_MEAL_SOUP','T6_MEAL_SOUP','T4_MEAL_SALAD','T5_MEAL_SALAD','T6_MEAL_SALAD','T4_MEAL_OMELETTE','T5_MEAL_OMELETTE','T6_MEAL_OMELETTE','T5_MEAL_ROAST','T6_MEAL_ROAST','T7_MEAL_ROAST'],
  potions:      ['T4_POTION_HEALING','T5_POTION_HEALING','T6_POTION_HEALING','T7_POTION_HEALING','T4_POTION_ENERGY','T5_POTION_ENERGY','T6_POTION_ENERGY','T4_POTION_GIGANTIFY','T5_POTION_GIGANTIFY','T6_POTION_GIGANTIFY','T4_POTION_RESISTANCE','T5_POTION_RESISTANCE','T6_POTION_RESISTANCE'],
  mounts:       ['T3_MOUNT_HORSE','T4_MOUNT_HORSE','T5_MOUNT_HORSE','T6_MOUNT_HORSE','T7_MOUNT_HORSE','T8_MOUNT_HORSE','T4_MOUNT_OX','T5_MOUNT_OX','T6_MOUNT_OX','T7_MOUNT_OX','T8_MOUNT_OX','T5_MOUNT_SWAMPDRAGON','T6_MOUNT_SWAMPDRAGON','T7_MOUNT_SWAMPDRAGON','T5_MOUNT_DIREWOLF','T6_MOUNT_DIREWOLF','T7_MOUNT_DIREWOLF']
};

const ITEM_NAMES = {
  'T2_BAG':'T2 Çanta','T3_BAG':'T3 Çanta','T4_BAG':'T4 Çanta','T5_BAG':'T5 Çanta','T6_BAG':'T6 Çanta','T7_BAG':'T7 Çanta','T8_BAG':'T8 Çanta',
  'T4_MAIN_SWORD':'T4 Kılıç','T5_MAIN_SWORD':'T5 Kılıç','T6_MAIN_SWORD':'T6 Kılıç','T7_MAIN_SWORD':'T7 Kılıç','T8_MAIN_SWORD':'T8 Kılıç',
  'T4_2H_CLAYMORE':'T4 Claymore','T5_2H_CLAYMORE':'T5 Claymore','T6_2H_CLAYMORE':'T6 Claymore','T7_2H_CLAYMORE':'T7 Claymore','T8_2H_CLAYMORE':'T8 Claymore',
  'T4_2H_DUALSWORD':'T4 Çift Kılıç','T5_2H_DUALSWORD':'T5 Çift Kılıç','T6_2H_DUALSWORD':'T6 Çift Kılıç','T7_2H_DUALSWORD':'T7 Çift Kılıç','T8_2H_DUALSWORD':'T8 Çift Kılıç',
  'T4_2H_CLEAVER_HELL':'T4 Cehennem Kılıcı','T5_2H_CLEAVER_HELL':'T5 Cehennem Kılıcı','T6_2H_CLEAVER_HELL':'T6 Cehennem Kılıcı',
  'T4_2H_BOW':'T4 Yay','T5_2H_BOW':'T5 Yay','T6_2H_BOW':'T6 Yay','T7_2H_BOW':'T7 Yay','T8_2H_BOW':'T8 Yay',
  'T4_2H_LONGBOW':'T4 Uzun Yay','T5_2H_LONGBOW':'T5 Uzun Yay','T6_2H_LONGBOW':'T6 Uzun Yay','T7_2H_LONGBOW':'T7 Uzun Yay','T8_2H_LONGBOW':'T8 Uzun Yay',
  'T4_2H_CROSSBOW':'T4 Arbalet','T5_2H_CROSSBOW':'T5 Arbalet','T6_2H_CROSSBOW':'T6 Arbalet','T7_2H_CROSSBOW':'T7 Arbalet','T8_2H_CROSSBOW':'T8 Arbalet',
  'T4_2H_BOW_HELL':'T4 Cehennem Yayı','T5_2H_BOW_HELL':'T5 Cehennem Yayı','T6_2H_BOW_HELL':'T6 Cehennem Yayı',
  'T4_2H_BOW_MORGANA':'T4 Morgana Yayı','T5_2H_BOW_MORGANA':'T5 Morgana Yayı','T6_2H_BOW_MORGANA':'T6 Morgana Yayı',
  'T4_2H_CROSSBOW_CANNON':'T4 Top Arbaleti','T5_2H_CROSSBOW_CANNON':'T5 Top Arbaleti','T6_2H_CROSSBOW_CANNON':'T6 Top Arbaleti',
  'T4_MAIN_AXE':'T4 Balta','T5_MAIN_AXE':'T5 Balta','T6_MAIN_AXE':'T6 Balta','T7_MAIN_AXE':'T7 Balta','T8_MAIN_AXE':'T8 Balta',
  'T4_2H_AXE':'T4 Büyük Balta','T5_2H_AXE':'T5 Büyük Balta','T6_2H_AXE':'T6 Büyük Balta','T7_2H_AXE':'T7 Büyük Balta','T8_2H_AXE':'T8 Büyük Balta',
  'T4_2H_HALBERD':'T4 Halberd','T5_2H_HALBERD':'T5 Halberd','T6_2H_HALBERD':'T6 Halberd','T7_2H_HALBERD':'T7 Halberd','T8_2H_HALBERD':'T8 Halberd',
  'T4_2H_SCYTHE_HELL':'T4 Cehennem Tırmığı','T5_2H_SCYTHE_HELL':'T5 Cehennem Tırmığı','T6_2H_SCYTHE_HELL':'T6 Cehennem Tırmığı',
  'T4_MAIN_ARCANE':'T4 Gizem Asası','T5_MAIN_ARCANE':'T5 Gizem Asası','T6_MAIN_ARCANE':'T6 Gizem Asası','T7_MAIN_ARCANE':'T7 Gizem Asası','T8_MAIN_ARCANE':'T8 Gizem Asası',
  'T4_MAIN_FIRE':'T4 Ateş Asası','T5_MAIN_FIRE':'T5 Ateş Asası','T6_MAIN_FIRE':'T6 Ateş Asası','T7_MAIN_FIRE':'T7 Ateş Asası','T8_MAIN_FIRE':'T8 Ateş Asası',
  'T4_MAIN_FROST':'T4 Buz Asası','T5_MAIN_FROST':'T5 Buz Asası','T6_MAIN_FROST':'T6 Buz Asası','T7_MAIN_FROST':'T7 Buz Asası','T8_MAIN_FROST':'T8 Buz Asası',
  'T4_MAIN_HOLY':'T4 Kutsal Asa','T5_MAIN_HOLY':'T5 Kutsal Asa','T6_MAIN_HOLY':'T6 Kutsal Asa','T7_MAIN_HOLY':'T7 Kutsal Asa','T8_MAIN_HOLY':'T8 Kutsal Asa',
  'T4_MAIN_NATURE':'T4 Doğa Asası','T5_MAIN_NATURE':'T5 Doğa Asası','T6_MAIN_NATURE':'T6 Doğa Asası','T7_MAIN_NATURE':'T7 Doğa Asası','T8_MAIN_NATURE':'T8 Doğa Asası',
  'T4_2H_DEMONICSTAFF':'T4 Şeytan Asası','T5_2H_DEMONICSTAFF':'T5 Şeytan Asası','T6_2H_DEMONICSTAFF':'T6 Şeytan Asası',
  'T4_MAIN_HAMMER':'T4 Çekiç','T5_MAIN_HAMMER':'T5 Çekiç','T6_MAIN_HAMMER':'T6 Çekiç','T7_MAIN_HAMMER':'T7 Çekiç','T8_MAIN_HAMMER':'T8 Çekiç',
  'T4_2H_POLEHAMMER':'T4 Savaş Çekici','T5_2H_POLEHAMMER':'T5 Savaş Çekici','T6_2H_POLEHAMMER':'T6 Savaş Çekici','T7_2H_POLEHAMMER':'T7 Savaş Çekici','T8_2H_POLEHAMMER':'T8 Savaş Çekici',
  'T4_2H_HAMMER_HELL':'T4 Cehennem Çekici','T5_2H_HAMMER_HELL':'T5 Cehennem Çekici','T6_2H_HAMMER_HELL':'T6 Cehennem Çekici',
  'T4_MAIN_SPEAR':'T4 Mızrak','T5_MAIN_SPEAR':'T5 Mızrak','T6_MAIN_SPEAR':'T6 Mızrak','T7_MAIN_SPEAR':'T7 Mızrak','T8_MAIN_SPEAR':'T8 Mızrak',
  'T4_2H_SPEAR':'T4 Uzun Mızrak','T5_2H_SPEAR':'T5 Uzun Mızrak','T6_2H_SPEAR':'T6 Uzun Mızrak','T7_2H_SPEAR':'T7 Uzun Mızrak','T8_2H_SPEAR':'T8 Uzun Mızrak',
  'T4_2H_GLAIVE':'T4 Glaive','T5_2H_GLAIVE':'T5 Glaive','T6_2H_GLAIVE':'T6 Glaive','T7_2H_GLAIVE':'T7 Glaive','T8_2H_GLAIVE':'T8 Glaive',
  'T4_ARMOR_LEATHER_SET1':'T4 Deri Zırh','T5_ARMOR_LEATHER_SET1':'T5 Deri Zırh','T6_ARMOR_LEATHER_SET1':'T6 Deri Zırh','T7_ARMOR_LEATHER_SET1':'T7 Deri Zırh','T8_ARMOR_LEATHER_SET1':'T8 Deri Zırh',
  'T4_HEAD_LEATHER_SET1':'T4 Deri Kask','T5_HEAD_LEATHER_SET1':'T5 Deri Kask','T6_HEAD_LEATHER_SET1':'T6 Deri Kask','T7_HEAD_LEATHER_SET1':'T7 Deri Kask','T8_HEAD_LEATHER_SET1':'T8 Deri Kask',
  'T4_SHOES_LEATHER_SET1':'T4 Deri Bot','T5_SHOES_LEATHER_SET1':'T5 Deri Bot','T6_SHOES_LEATHER_SET1':'T6 Deri Bot','T7_SHOES_LEATHER_SET1':'T7 Deri Bot','T8_SHOES_LEATHER_SET1':'T8 Deri Bot',
  'T4_ARMOR_PLATE_SET1':'T4 Plaka Zırh','T5_ARMOR_PLATE_SET1':'T5 Plaka Zırh','T6_ARMOR_PLATE_SET1':'T6 Plaka Zırh','T7_ARMOR_PLATE_SET1':'T7 Plaka Zırh','T8_ARMOR_PLATE_SET1':'T8 Plaka Zırh',
  'T4_HEAD_PLATE_SET1':'T4 Plaka Kask','T5_HEAD_PLATE_SET1':'T5 Plaka Kask','T6_HEAD_PLATE_SET1':'T6 Plaka Kask','T7_HEAD_PLATE_SET1':'T7 Plaka Kask','T8_HEAD_PLATE_SET1':'T8 Plaka Kask',
  'T4_SHOES_PLATE_SET1':'T4 Plaka Bot','T5_SHOES_PLATE_SET1':'T5 Plaka Bot','T6_SHOES_PLATE_SET1':'T6 Plaka Bot','T7_SHOES_PLATE_SET1':'T7 Plaka Bot','T8_SHOES_PLATE_SET1':'T8 Plaka Bot',
  'T4_ARMOR_CLOTH_SET1':'T4 Kumaş Zırh','T5_ARMOR_CLOTH_SET1':'T5 Kumaş Zırh','T6_ARMOR_CLOTH_SET1':'T6 Kumaş Zırh','T7_ARMOR_CLOTH_SET1':'T7 Kumaş Zırh','T8_ARMOR_CLOTH_SET1':'T8 Kumaş Zırh',
  'T4_HEAD_CLOTH_SET1':'T4 Kumaş Kask','T5_HEAD_CLOTH_SET1':'T5 Kumaş Kask','T6_HEAD_CLOTH_SET1':'T6 Kumaş Kask','T7_HEAD_CLOTH_SET1':'T7 Kumaş Kask','T8_HEAD_CLOTH_SET1':'T8 Kumaş Kask',
  'T4_SHOES_CLOTH_SET1':'T4 Kumaş Bot','T5_SHOES_CLOTH_SET1':'T5 Kumaş Bot','T6_SHOES_CLOTH_SET1':'T6 Kumaş Bot','T7_SHOES_CLOTH_SET1':'T7 Kumaş Bot','T8_SHOES_CLOTH_SET1':'T8 Kumaş Bot',
  'T4_WOOD':'T4 Ham Odun','T5_WOOD':'T5 Ham Odun','T6_WOOD':'T6 Ham Odun','T7_WOOD':'T7 Ham Odun','T8_WOOD':'T8 Ham Odun',
  'T4_ORE':'T4 Ham Maden','T5_ORE':'T5 Ham Maden','T6_ORE':'T6 Ham Maden','T7_ORE':'T7 Ham Maden','T8_ORE':'T8 Ham Maden',
  'T4_FIBER':'T4 Ham Fiber','T5_FIBER':'T5 Ham Fiber','T6_FIBER':'T6 Ham Fiber','T7_FIBER':'T7 Ham Fiber','T8_FIBER':'T8 Ham Fiber',
  'T4_HIDE':'T4 Ham Deri','T5_HIDE':'T5 Ham Deri','T6_HIDE':'T6 Ham Deri','T7_HIDE':'T7 Ham Deri','T8_HIDE':'T8 Ham Deri',
  'T4_ROCK':'T4 Ham Taş','T5_ROCK':'T5 Ham Taş','T6_ROCK':'T6 Ham Taş','T7_ROCK':'T7 Ham Taş','T8_ROCK':'T8 Ham Taş',
  'T4_PLANKS':'T4 Tahta','T5_PLANKS':'T5 Tahta','T6_PLANKS':'T6 Tahta','T7_PLANKS':'T7 Tahta','T8_PLANKS':'T8 Tahta',
  'T4_METALBAR':'T4 Metal Külçe','T5_METALBAR':'T5 Metal Külçe','T6_METALBAR':'T6 Metal Külçe','T7_METALBAR':'T7 Metal Külçe','T8_METALBAR':'T8 Metal Külçe',
  'T4_CLOTH':'T4 Kumaş','T5_CLOTH':'T5 Kumaş','T6_CLOTH':'T6 Kumaş','T7_CLOTH':'T7 Kumaş','T8_CLOTH':'T8 Kumaş',
  'T4_LEATHER':'T4 İşlenmiş Deri','T5_LEATHER':'T5 İşlenmiş Deri','T6_LEATHER':'T6 İşlenmiş Deri','T7_LEATHER':'T7 İşlenmiş Deri','T8_LEATHER':'T8 İşlenmiş Deri',
  'T4_STONEBLOCK':'T4 Taş Blok','T5_STONEBLOCK':'T5 Taş Blok','T6_STONEBLOCK':'T6 Taş Blok','T7_STONEBLOCK':'T7 Taş Blok','T8_STONEBLOCK':'T8 Taş Blok',
  'T4_MEAL_STEW':'T4 Güveç','T5_MEAL_STEW':'T5 Güveç','T6_MEAL_STEW':'T6 Güveç','T7_MEAL_STEW':'T7 Güveç',
  'T4_MEAL_SOUP':'T4 Çorba','T5_MEAL_SOUP':'T5 Çorba','T6_MEAL_SOUP':'T6 Çorba',
  'T4_MEAL_SALAD':'T4 Salata','T5_MEAL_SALAD':'T5 Salata','T6_MEAL_SALAD':'T6 Salata',
  'T4_MEAL_OMELETTE':'T4 Omlet','T5_MEAL_OMELETTE':'T5 Omlet','T6_MEAL_OMELETTE':'T6 Omlet',
  'T5_MEAL_ROAST':'T5 Kızartma','T6_MEAL_ROAST':'T6 Kızartma','T7_MEAL_ROAST':'T7 Kızartma',
  'T4_POTION_HEALING':'T4 İyileştirme İksiri','T5_POTION_HEALING':'T5 İyileştirme İksiri','T6_POTION_HEALING':'T6 İyileştirme İksiri','T7_POTION_HEALING':'T7 İyileştirme İksiri',
  'T4_POTION_ENERGY':'T4 Enerji İksiri','T5_POTION_ENERGY':'T5 Enerji İksiri','T6_POTION_ENERGY':'T6 Enerji İksiri',
  'T4_POTION_GIGANTIFY':'T4 Dev İksiri','T5_POTION_GIGANTIFY':'T5 Dev İksiri','T6_POTION_GIGANTIFY':'T6 Dev İksiri',
  'T4_POTION_RESISTANCE':'T4 Direnç İksiri','T5_POTION_RESISTANCE':'T5 Direnç İksiri','T6_POTION_RESISTANCE':'T6 Direnç İksiri',
  'T3_MOUNT_HORSE':'T3 At','T4_MOUNT_HORSE':'T4 At','T5_MOUNT_HORSE':'T5 At','T6_MOUNT_HORSE':'T6 At','T7_MOUNT_HORSE':'T7 At','T8_MOUNT_HORSE':'T8 At',
  'T4_MOUNT_OX':'T4 Öküz','T5_MOUNT_OX':'T5 Öküz','T6_MOUNT_OX':'T6 Öküz','T7_MOUNT_OX':'T7 Öküz','T8_MOUNT_OX':'T8 Öküz',
  'T5_MOUNT_SWAMPDRAGON':'T5 Bataklık Ejderi','T6_MOUNT_SWAMPDRAGON':'T6 Bataklık Ejderi','T7_MOUNT_SWAMPDRAGON':'T7 Bataklık Ejderi',
  'T5_MOUNT_DIREWOLF':'T5 Kurt Bineği','T6_MOUNT_DIREWOLF':'T6 Kurt Bineği','T7_MOUNT_DIREWOLF':'T7 Kurt Bineği'
};

const CAT_TITLES = {
  bags:'Çanta Fiyatları',swords:'Kılıç Fiyatları',bows:'Yay Fiyatları',axes:'Balta Fiyatları',
  staves:'Asa Fiyatları',hammers:'Çekiç Fiyatları',spears:'Mızrak Fiyatları',
  armor_leather:'Deri Zırh Fiyatları',armor_plate:'Plaka Zırh Fiyatları',armor_cloth:'Kumaş Zırh Fiyatları',
  resources:'Ham Kaynak Fiyatları',refined:'İşlenmiş Kaynak Fiyatları',
  food:'Yiyecek Fiyatları',potions:'İksir Fiyatları',mounts:'Binek Fiyatları'
};

const QUALITY = {tr:{1:'Normal',2:'İyi',3:'Üstün',4:'Mükemmel',5:'Şaheser'},en:{1:'Normal',2:'Good',3:'Outstanding',4:'Excellent',5:'Masterpiece'}};

let currentServer='europe', currentCategory='bags', currentData=[], searchTimeout=null;

document.addEventListener('DOMContentLoaded',()=>{
  loadGoldPrice();
  loadCategory('bags');
  // Dropdown'ı dışarı tıklamayla kapat
  document.addEventListener('click', e=>{
    if(!e.target.closest('.search-box'))
      document.getElementById('marketSearchDropdown')?.classList.remove('open');
  });
});

function setServer(s){
  currentServer=s;
  document.querySelectorAll('.server-tab').forEach(t=>t.classList.toggle('active',t.dataset.server===s));
  document.getElementById('goldServer').textContent={europe:'EU',west:'US',east:'Asia'}[s];
  loadGoldPrice(); loadCategory(currentCategory);
}

function toggleCompare(){ document.getElementById('compareBtn').classList.toggle('active'); loadCategory(currentCategory); }

async function loadGoldPrice(){
  try{
    const r=await fetch(`${SERVERS[currentServer]}/api/v2/stats/gold.json?count=1`);
    const d=await r.json();
    if(d?.[0]){
      document.getElementById('goldValue').textContent=d[0].price.toLocaleString('tr-TR')+' Silver';
      document.getElementById('goldUpdated').textContent=formatAge(new Date(d[0].timestamp));
    }
  }catch{ document.getElementById('goldValue').textContent='—'; }
}

async function loadCategory(cat){
  currentCategory=cat;
  const lang=localStorage.getItem('aot-lang')||'tr';
  const titles={
    all:     {tr:'Tüm Eşyalar',     en:'All Items'},
    bags:    {tr:'Çanta Fiyatları',  en:'Bag Prices'},
    swords:  {tr:'Kılıç Fiyatları',  en:'Sword Prices'},
    bows:    {tr:'Yay Fiyatları',    en:'Bow Prices'},
    axes:    {tr:'Balta Fiyatları',  en:'Axe Prices'},
    staves:  {tr:'Asa Fiyatları',    en:'Staff Prices'},
    hammers: {tr:'Çekiç Fiyatları',  en:'Hammer Prices'},
    spears:  {tr:'Mızrak Fiyatları', en:'Spear Prices'},
    armor_leather:{tr:'Deri Zırh',   en:'Leather Armor'},
    armor_plate:  {tr:'Plaka Zırh',  en:'Plate Armor'},
    armor_cloth:  {tr:'Kumaş Zırh',  en:'Cloth Armor'},
    resources:    {tr:'Ham Kaynaklar',en:'Raw Resources'},
    refined:      {tr:'İşlenmiş Kaynaklar',en:'Refined Resources'},
    food:    {tr:'Yiyecek Fiyatları',en:'Food Prices'},
    potions: {tr:'İksir Fiyatları',  en:'Potion Prices'},
    mounts:  {tr:'Binek Fiyatları',  en:'Mount Prices'},
  };
  const titleObj = titles[cat]||{tr:'Fiyatlar',en:'Prices'};
  document.getElementById('tableTitle').textContent = lang==='tr'?titleObj.tr:titleObj.en;

  // all kategorisi için items-data.js'den dinamik liste
  let items;
  if(cat==='all'){
    const tierFilter=document.getElementById('tierFilter').value;
    const tier=tierFilter?parseInt(tierFilter.replace('T','')):null;
    const aoItems=window.AO_ITEMS||[];
    const tiers=tier?[tier]:[4,5,6,7,8];
    items=[...new Set(aoItems.flatMap(i=>tiers.filter(t=>i.tiers.includes(t)).map(t=>`T${t}_${i.id}`)))];
    // URL limiti için parçalara böl (max 50 ID)
    if(items.length>50) items=items.slice(0,50);
  } else {
    items=CATEGORIES[cat]||CATEGORIES.bags;
  }

  const city=document.getElementById('cityFilter').value||ALL_CITIES;
  showLoading();
  try{
    const url=`${SERVERS[currentServer]}/api/v2/stats/prices/${items.join(',')}.json?locations=${encodeURIComponent(city)}`;
    const r=await fetch(url);
    if(!r.ok) throw new Error(r.status);
    const d=await r.json();
    currentData=d; renderTable(d); updateStats(d);
  }catch(e){ console.error(e); showError(); }
}

function renderTable(data){
  const lang=localStorage.getItem('aot-lang')||'tr';
  const tbody=document.getElementById('priceTableBody');
  const tier=document.getElementById('tierFilter').value;
  const city=document.getElementById('cityFilter').value;

  let f=data.filter(d=>d.sell_price_min>0||d.buy_price_max>0);
  if(tier) f=f.filter(d=>d.item_id.startsWith(tier+'_'));
  if(city) f=f.filter(d=>d.city===city||d.city===city.replace(' ',''));

  const sells=f.map(d=>d.sell_price_min).filter(p=>p>0);
  const minS=Math.min(...sells), maxS=Math.max(...sells);

  if(!f.length){
    tbody.innerHTML=`<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted)">Bu filtre için fiyat verisi bulunamadı.</td></tr>`;
    document.getElementById('itemsCount').textContent='0 kayıt';
    showTable(); return;
  }

  tbody.innerHTML=f.map(d=>{
    const tier=d.item_id.match(/^T(\d)/)?.[1]||'?';
    const name=ITEM_NAMES[d.item_id]||d.item_id.replace(/_/g,' ');
    const cc=CITY_CLASS[d.city]||'city-other';
    const cn=CITY_DISPLAY[d.city]||d.city||'—';
    const rc=d.sell_price_min===minS&&d.sell_price_min>0?'best-sell':d.sell_price_min===maxS?'worst-sell':'';
    const qn=QUALITY[lang][d.quality||1]||'Normal';
    const age=formatAge(d.sell_price_min_date?new Date(d.sell_price_min_date):null);
    const ageCls=getAgeCls(d.sell_price_min_date);
    const noMarket=isNoMarket(d.sell_price_min_date,d.sell_price_min,d.buy_price_max);
    const icon=`https://render.albiononline.com/v1/item/${d.item_id}.png`;
    const isBM=d.city==='Black Market';

    return `<tr class="${rc}">
      <td><div class="item-name">
        <img src="${icon}" alt="${name}" class="item-icon" onerror="this.style.display='none'"/>
        <div class="item-name-text"><span class="item-tier">T${tier}</span><span class="item-label">${name}</span></div>
      </div></td>
      <td><span class="city-badge ${cc}">${cn}</span></td>
      <td class="${d.sell_price_min>0&&!isBM?'price-sell':'price-zero'}">${isBM?'<span title="Black Market sadece alış emri alır">—</span>':d.sell_price_min>0?d.sell_price_min.toLocaleString('tr-TR'):'—'}</td>
      <td class="${d.buy_price_max>0?'price-buy':'price-zero'}">${d.buy_price_max>0?d.buy_price_max.toLocaleString('tr-TR'):'—'}</td>
      <td><span class="quality-badge q${d.quality||1}">${qn}</span></td>
      <td class="date-cell ${ageCls}">${noMarket?'<span class="no-market">⚠️ Pazar yok</span>':age}</td>
    </tr>`;
  }).join('');

  document.getElementById('itemsCount').textContent=`${f.length} ${lang==='tr'?'kayıt':'records'}`;
  showTable();
}

function updateStats(data){
  const v=data.filter(d=>d.sell_price_min>0&&d.city!=='Black Market');
  if(!v.length) return;
  const s=[...v].sort((a,b)=>a.sell_price_min-b.sell_price_min);
  const c=s[0],e=s[s.length-1];
  const p=e.sell_price_min-c.sell_price_min;
  const pct=c.sell_price_min>0?((p/c.sell_price_min)*100).toFixed(0):0;
  document.getElementById('cheapestVal').textContent=c.sell_price_min.toLocaleString('tr-TR');
  document.getElementById('cheapestCity').textContent=CITY_DISPLAY[c.city]||c.city||'—';
  document.getElementById('expensiveVal').textContent=e.sell_price_min.toLocaleString('tr-TR');
  document.getElementById('expensiveCity').textContent=CITY_DISPLAY[e.city]||e.city||'—';
  document.getElementById('profitVal').textContent=`${p.toLocaleString('tr-TR')} (%${pct})`;
  const dates=v.map(d=>d.sell_price_min_date).filter(Boolean).map(d=>new Date(d));
  if(dates.length) document.getElementById('lastUpdated').textContent=formatAge(new Date(Math.max(...dates)));
}

function onSearchInput(val){
  document.getElementById('clearBtn').style.display=val?'block':'none';
  clearTimeout(searchTimeout);

  // Dropdown arama — tüm eşyalarda
  const dd=document.getElementById('marketSearchDropdown');
  if(!val||val.length<1){
    if(dd) dd.classList.remove('open');
    renderTable(currentData);
    return;
  }

  // items-data.js global listesinden ara
  const results = window.AO_SEARCH ? window.AO_SEARCH(val) : [];
  if(dd && results.length>0){
    const lang=localStorage.getItem('aot-lang')||'tr';
    dd.innerHTML=results.slice(0,12).map(r=>{
      const name=lang==='tr'?r.tr:r.en;
      const tier=document.getElementById('tierFilter').value.replace('T','')||5;
      const icon=`https://render.albiononline.com/v1/item/T${tier}_${r.id}.png`;
      return `<div class="msd-item" onclick="marketSearchSelect('${r.id}','${name}')">
        <img src="${icon}" onerror="this.style.display='none'" style="width:28px;height:28px;border-radius:4px;flex-shrink:0"/>
        <span style="font-size:12px;font-weight:500;color:var(--text-primary)">${name}</span>
        <span style="font-size:10px;color:var(--text-muted);margin-left:auto">${r.en}</span>
      </div>`;
    }).join('');
    dd.classList.add('open');
  } else if(dd){
    dd.classList.remove('open');
  }

  // Mevcut veriyi de filtrele
  searchTimeout=setTimeout(()=>{
    const q=val.toLowerCase();
    const filtered=currentData.filter(d=>{
      const item=window.AO_ITEMS?.find(i=>d.item_id.includes(i.id));
      return (item&&(item.tr.toLowerCase().includes(q)||item.en.toLowerCase().includes(q)))
        ||(ITEM_NAMES[d.item_id]||'').toLowerCase().includes(q)
        ||d.item_id.toLowerCase().includes(q);
    });
    renderTable(filtered);
  },300);
}

async function marketSearchSelect(baseId, name){
  const dd=document.getElementById('marketSearchDropdown');
  if(dd) dd.classList.remove('open');
  document.getElementById('itemSearch').value=name;
  document.getElementById('clearBtn').style.display='block';

  // Tüm tier'lar için fiyat çek
  const tierFilter=document.getElementById('tierFilter').value;
  const tiers=tierFilter?[parseInt(tierFilter.replace('T',''))]:[4,5,6,7,8];
  const ids=tiers.map(t=>`T${t}_${baseId}`);
  const cityFilter=document.getElementById('cityFilter').value||ALL_CITIES;

  showLoading();
  try{
    const url=`${SERVERS[currentServer]}/api/v2/stats/prices/${ids.join(',')}.json?locations=${encodeURIComponent(cityFilter)}`;
    const res=await fetch(url);
    const data=await res.json();
    currentData=data;
    renderTable(data);
    updateStats(data);
  }catch(e){ showError(); }
}

function clearSearch(){
  document.getElementById('itemSearch').value='';
  document.getElementById('clearBtn').style.display='none';
  const dd=document.getElementById('marketSearchDropdown');
  if(dd) dd.classList.remove('open');
  loadCategory(currentCategory);
}

function applyFilters(){ renderTable(currentData); }

function refreshPrices(){
  const btn=document.getElementById('refreshBtn');
  btn.classList.add('loading');
  loadCategory(currentCategory).finally(()=>setTimeout(()=>btn.classList.remove('loading'),500));
}

function calcTransport(){
  const bc=document.getElementById('buyCity').value;
  const sc=document.getElementById('sellCity').value;
  const qty=parseInt(document.getElementById('quantity').value)||1;
  const el=document.getElementById('transportResult');
  if(bc===sc){el.innerHTML='<span style="color:var(--red)">Aynı şehir seçilemez!</span>';return;}
  const bd=currentData.filter(d=>(d.city===bc||d.city===bc.replace(' ',''))&&d.sell_price_min>0);
  const sd=currentData.filter(d=>(d.city===sc||d.city===sc.replace(' ',''))&&(d.buy_price_max>0||d.sell_price_min>0));
  if(!bd.length||!sd.length){el.innerHTML='<span style="color:var(--text-muted)">Yeterli veri yok. Farklı kategori deneyin.</span>';return;}
  let total=0,cnt=0;
  bd.forEach(b=>{
    const s=sd.find(d=>d.item_id===b.item_id&&d.quality===b.quality);
    if(!s) return;
    const sellP=s.buy_price_max>0?s.buy_price_max:s.sell_price_min;
    if(sellP>b.sell_price_min){total+=(sellP-b.sell_price_min)*qty;cnt++;}
  });
  const avg=cnt>0?Math.round(total/cnt):0;
  const pct=cnt>0&&bd[0]?((avg/bd[0].sell_price_min)*100).toFixed(0):0;
  if(avg>0){
    el.className='transport-result profit';
    el.innerHTML=`<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">${CITY_DISPLAY[bc]||bc} → ${CITY_DISPLAY[sc]||sc}</div><div class="profit-amount">+${avg.toLocaleString('tr-TR')} Silver</div><div class="profit-pct">≈ %${pct} ort. kâr · ${cnt} eşya</div>`;
  } else {
    el.className='transport-result';
    el.innerHTML='<span style="color:var(--text-muted)">Bu güzergahta karlı transport bulunamadı.</span>';
  }
}

// Düzeltilmiş tarih formatı
function formatAge(date){
  if(!date) return '—';
  const d=Math.floor((new Date()-date)/60000);
  if(d<0) return 'Az önce';
  if(d<1) return 'Az önce';
  if(d<60) return `${d} dakika`;
  if(d<1440) return `${Math.floor(d/60)} saat`;
  if(d<10080) return `${Math.floor(d/1440)} gün`;
  if(d<43200) return `${Math.floor(d/10080)} hafta`;
  return `${Math.floor(d/43200)} ay`;
}

function isNoMarket(ds, sellPrice, buyPrice){
  // Hiç veri yoksa
  if(!ds && !sellPrice && !buyPrice) return true;
  // Tarih yoksa
  if(!ds) return false;
  // 7 günden eskiyse (10080 dakika)
  const mins=(new Date()-new Date(ds))/60000;
  return mins>10080;
}

function getAgeCls(ds){
  if(!ds) return 'date-stale';
  const d=(new Date()-new Date(ds))/60000;
  return d<60?'date-fresh':d<1440?'date-old':'date-stale';
}

function showLoading(){document.getElementById('loadingWrap').style.display='flex';document.getElementById('errorWrap').style.display='none';document.getElementById('priceTableWrap').style.display='none';}
function showError(){document.getElementById('loadingWrap').style.display='none';document.getElementById('errorWrap').style.display='flex';document.getElementById('priceTableWrap').style.display='none';}
function showTable(){document.getElementById('loadingWrap').style.display='none';document.getElementById('errorWrap').style.display='none';document.getElementById('priceTableWrap').style.display='block';}
