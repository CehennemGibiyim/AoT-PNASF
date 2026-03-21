// AoT-PNASF — Master Item Database
// Tüm craftable eşyalar: ID, İngilizce isim, Türkçe isim, kategori, tier aralığı
// İkon: render.albiononline.com/v1/item/{ID}@{enchant}.png
// Fiyat: europe.albion-online-data.com/api/v2/stats/prices/{ID}.json

window.AO_ITEMS = [

  // ══════════════════════════════════════════════════════════
  // KILIÇLAR / SWORDS
  // ══════════════════════════════════════════════════════════
  { id:'MAIN_SWORD',           en:"Sword",              tr:"Kılıç",                  cat:'sword',    tiers:[4,5,6,7,8] },
  { id:'2H_CLAYMORE',          en:"Claymore",           tr:"Claymore",               cat:'sword',    tiers:[4,5,6,7,8] },
  { id:'2H_DUALSWORD',         en:"Dual Swords",        tr:"Çift Kılıç",             cat:'sword',    tiers:[4,5,6,7,8] },
  { id:'MAIN_SCIMITAR_MORGANA',en:"Carving Sword",      tr:"Orak Kılıcı",            cat:'sword',    tiers:[4,5,6,7,8] },
  { id:'2H_CLEAVER_HELL',      en:"Clarent Blade",      tr:"Clarent Kılıcı",         cat:'sword',    tiers:[4,5,6,7,8] },
  { id:'2H_BROADSWORD',        en:"Broad Sword",        tr:"Geniş Kılıç",            cat:'sword',    tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // BALTALAR / AXES
  // ══════════════════════════════════════════════════════════
  { id:'MAIN_AXE',             en:"Battleaxe",          tr:"Savaş Baltası",          cat:'axe',      tiers:[4,5,6,7,8] },
  { id:'2H_AXE',               en:"Great Axe",          tr:"Büyük Balta",            cat:'axe',      tiers:[4,5,6,7,8] },
  { id:'2H_HALBERD',           en:"Halberd",            tr:"Halberd",                cat:'axe',      tiers:[4,5,6,7,8] },
  { id:'2H_SCYTHE_HELL',       en:"Carrioncaller",      tr:"Ölüm Tırpanı",           cat:'axe',      tiers:[4,5,6,7,8] },
  { id:'2H_HALBERD_UNDEAD',    en:"Infernal Scythe",    tr:"Cehennem Tırpanı",       cat:'axe',      tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // YAYLAR / BOWS
  // ══════════════════════════════════════════════════════════
  { id:'2H_BOW',               en:"Bow",                tr:"Yay",                    cat:'bow',      tiers:[4,5,6,7,8] },
  { id:'2H_LONGBOW',           en:"Warbow",             tr:"Savaş Yayı",             cat:'bow',      tiers:[4,5,6,7,8] },
  { id:'2H_BOW_HELL',          en:"Bow of Badon",       tr:"Badon Yayı",             cat:'bow',      tiers:[4,5,6,7,8] },
  { id:'2H_BOW_MORGANA',       en:"Wailing Bow",        tr:"Feryat Yayı",            cat:'bow',      tiers:[4,5,6,7,8] },
  { id:'2H_CROSSBOW',          en:"Crossbow",           tr:"Arbalet",                cat:'bow',      tiers:[4,5,6,7,8] },
  { id:'2H_CROSSBOW_CANNON',   en:"Heavy Crossbow",     tr:"Ağır Arbalet",           cat:'bow',      tiers:[4,5,6,7,8] },
  { id:'MAIN_CROSSBOW',        en:"Weeping Repeater",   tr:"Ağlayan Tekrarlı",       cat:'bow',      tiers:[4,5,6,7,8] },
  { id:'2H_CROSSBOW_HELL',     en:"Siegebow",           tr:"Kuşatma Yayı",           cat:'bow',      tiers:[4,5,6,7,8] },
  { id:'2H_BOW_KEEPER',        en:"Mistpiercer",        tr:"Sis Delici",             cat:'bow',      tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // ÇEKİÇLER / HAMMERS
  // ══════════════════════════════════════════════════════════
  { id:'MAIN_HAMMER',          en:"Hammer",             tr:"Çekiç",                  cat:'hammer',   tiers:[4,5,6,7,8] },
  { id:'2H_POLEHAMMER',        en:"Polehammer",         tr:"Savaş Çekici",           cat:'hammer',   tiers:[4,5,6,7,8] },
  { id:'2H_HAMMER_HELL',       en:"Great Hammer",       tr:"Büyük Çekiç",            cat:'hammer',   tiers:[4,5,6,7,8] },
  { id:'2H_HAMMER_MORGANA',    en:"Tombhammer",         tr:"Mezar Çekici",           cat:'hammer',   tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // MIZRAKLAR / SPEARS
  // ══════════════════════════════════════════════════════════
  { id:'MAIN_SPEAR',           en:"Spear",              tr:"Mızrak",                 cat:'spear',    tiers:[4,5,6,7,8] },
  { id:'2H_SPEAR',             en:"Pike",               tr:"Uzun Mızrak",            cat:'spear',    tiers:[4,5,6,7,8] },
  { id:'2H_GLAIVE',            en:"Glaive",             tr:"Glaive",                 cat:'spear',    tiers:[4,5,6,7,8] },
  { id:'2H_HARPOON_HELL',      en:"Spirithunter",       tr:"Ruh Avcısı",             cat:'spear',    tiers:[4,5,6,7,8] },
  { id:'2H_DUALSICKLE_HELL',   en:"Heron Spear",        tr:"Balıkçıl Mızrağı",       cat:'spear',    tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // HANÇERler / DAGGERS
  // ══════════════════════════════════════════════════════════
  { id:'MAIN_DAGGER',          en:"Dagger",             tr:"Hançer",                 cat:'dagger',   tiers:[4,5,6,7,8] },
  { id:'2H_DAGGERPAIR',        en:"Dagger Pair",        tr:"Çift Hançer",            cat:'dagger',   tiers:[4,5,6,7,8] },
  { id:'2H_CLAWPAIR_HELL',     en:"Bloodletter",        tr:"Kan Dökücü",             cat:'dagger',   tiers:[4,5,6,7,8] },
  { id:'MAIN_RAPIER_MORGANA',  en:"Carving Blade",      tr:"Oyma Kılıç",             cat:'dagger',   tiers:[4,5,6,7,8] },
  { id:'2H_DUALSWORD_CRYSTAL', en:"Deathgivers",        tr:"Ölüm Vericiler",         cat:'dagger',   tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // QUARTERSTAFFLAR
  // ══════════════════════════════════════════════════════════
  { id:'2H_QUARTERSTAFF',      en:"Quarterstaff",       tr:"Quarterstaff",           cat:'qstaff',   tiers:[4,5,6,7,8] },
  { id:'2H_IRONCLADEDSTAFF',   en:"Iron-clad Staff",    tr:"Demirli Asa",            cat:'qstaff',   tiers:[4,5,6,7,8] },
  { id:'2H_DOUBLEBLADEDSTAFF_HELL',en:"Black Monk Stave",tr:"Siyah Keşiş Sopası",   cat:'qstaff',   tiers:[4,5,6,7,8] },
  { id:'2H_ROCKSTAFF_UNDEAD',  en:"Grailseeker",        tr:"Kâse Arayan",            cat:'qstaff',   tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // GÜRZ / MACES
  // ══════════════════════════════════════════════════════════
  { id:'MAIN_MACE',            en:"Mace",               tr:"Gürz",                   cat:'mace',     tiers:[4,5,6,7,8] },
  { id:'2H_MACE',              en:"Bedrock Mace",       tr:"Ana Kaya Gürzü",         cat:'mace',     tiers:[4,5,6,7,8] },
  { id:'2H_FLAIL_HELL',        en:"Incubus Mace",       tr:"Şeytan Gürzü",           cat:'mace',     tiers:[4,5,6,7,8] },
  { id:'MAIN_MACE_MORGANA',    en:"Camlann Mace",       tr:"Camlann Gürzü",          cat:'mace',     tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // ATEş ASALARI / FIRE STAVES
  // ══════════════════════════════════════════════════════════
  { id:'MAIN_FIRE',            en:"Fire Staff",         tr:"Ateş Asası",             cat:'fire',     tiers:[4,5,6,7,8] },
  { id:'2H_INFERNOSTAFF',      en:"Infernal Staff",     tr:"Cehennem Asası",         cat:'fire',     tiers:[4,5,6,7,8] },
  { id:'2H_INFERNOSTAFF_HELL', en:"Blazing Staff",      tr:"Alev Asası",             cat:'fire',     tiers:[4,5,6,7,8] },
  { id:'2H_INFERNOSTAFF_MORGANA',en:"Brimstone Staff",  tr:"Kükürt Asası",           cat:'fire',     tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // BUZ ASALARI / FROST STAVES
  // ══════════════════════════════════════════════════════════
  { id:'MAIN_FROST',           en:"Frost Staff",        tr:"Buz Asası",              cat:'frost',    tiers:[4,5,6,7,8] },
  { id:'2H_FROSTSTAFF',        en:"Glacial Staff",      tr:"Buzul Asası",            cat:'frost',    tiers:[4,5,6,7,8] },
  { id:'2H_ICEGAUNTLETS_HELL', en:"Permafrost Prism",   tr:"Sürekli Don Prizma",     cat:'frost',    tiers:[4,5,6,7,8] },
  { id:'2H_ICICLESTAFF_UNDEAD',en:"Hoarfrost Staff",    tr:"Kırağı Asası",           cat:'frost',    tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // GİZEM ASALARI / ARCANE STAVES
  // ══════════════════════════════════════════════════════════
  { id:'MAIN_ARCANE',          en:"Arcane Staff",       tr:"Gizem Asası",            cat:'arcane',   tiers:[4,5,6,7,8] },
  { id:'2H_ARCANESTAFF',       en:"Great Arcane Staff", tr:"Büyük Gizem Asası",      cat:'arcane',   tiers:[4,5,6,7,8] },
  { id:'2H_ENIGMATICSTAFF_HELL',en:"Enigmatic Staff",   tr:"Muammalı Asa",           cat:'arcane',   tiers:[4,5,6,7,8] },
  { id:'2H_LIGHTCROSSBOW_MORGANA',en:"Occult Staff",    tr:"Gizli Asa",              cat:'arcane',   tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // KUTSAL ASALAR / HOLY STAVES
  // ══════════════════════════════════════════════════════════
  { id:'MAIN_HOLY',            en:"Holy Staff",         tr:"Kutsal Asa",             cat:'holy',     tiers:[4,5,6,7,8] },
  { id:'2H_HOLYSTAFF',         en:"Great Holy Staff",   tr:"Büyük Kutsal Asa",       cat:'holy',     tiers:[4,5,6,7,8] },
  { id:'2H_DIVINESTAFF_HELL',  en:"Divine Staff",       tr:"İlahi Asa",              cat:'holy',     tiers:[4,5,6,7,8] },
  { id:'2H_HOLYSTAFF_MORGANA', en:"Lifetouch Staff",    tr:"Hayat Dokunuşu Asası",   cat:'holy',     tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // DOĞA ASALARI / NATURE STAVES
  // ══════════════════════════════════════════════════════════
  { id:'MAIN_NATURE',          en:"Nature Staff",       tr:"Doğa Asası",             cat:'nature',   tiers:[4,5,6,7,8] },
  { id:'2H_NATURESTAFF',       en:"Great Nature Staff", tr:"Büyük Doğa Asası",       cat:'nature',   tiers:[4,5,6,7,8] },
  { id:'2H_WILDSTAFF_HELL',    en:"Druidic Staff",      tr:"Druid Asası",            cat:'nature',   tiers:[4,5,6,7,8] },
  { id:'2H_NATURESTAFF_KEEPER',en:"Blight Staff",       tr:"Hastalık Asası",         cat:'nature',   tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // LANET ASALARI / CURSED STAVES
  // ══════════════════════════════════════════════════════════
  { id:'MAIN_CURSEDSTAFF',     en:"Cursed Staff",       tr:"Lanet Asası",            cat:'curse',    tiers:[4,5,6,7,8] },
  { id:'2H_CURSEDSTAFF',       en:"Great Cursed Staff", tr:"Büyük Lanet Asası",      cat:'curse',    tiers:[4,5,6,7,8] },
  { id:'2H_CURSEDSTAFF_HELL',  en:"Demonic Staff",      tr:"Şeytan Asası",           cat:'curse',    tiers:[4,5,6,7,8] },
  { id:'2H_SKULLJESTER_UNDEAD',en:"Lifecurse Staff",    tr:"Lanet Hayat Asası",      cat:'curse',    tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // ÇANTALAR / BAGS
  // ══════════════════════════════════════════════════════════
  { id:'BAG',                  en:"Bag",                tr:"Çanta",                  cat:'bag',      tiers:[2,3,4,5,6,7,8] },
  { id:'SATCHEL_OF_INSIGHT',   en:"Satchel of Insight", tr:"Anlayış Çantası",        cat:'bag',      tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // DERİ KASK / LEATHER HELMETS
  // ══════════════════════════════════════════════════════════
  { id:'HEAD_LEATHER_SET1',    en:"Hunter Hood",        tr:"Avcı Başlığı",           cat:'lhelmet',  tiers:[4,5,6,7,8] },
  { id:'HEAD_LEATHER_SET2',    en:"Mercenary Hood",     tr:"Paralı Asker Başlığı",   cat:'lhelmet',  tiers:[4,5,6,7,8] },
  { id:'HEAD_LEATHER_SET3',    en:"Hellion Hood",       tr:"Şeytan Başlığı",         cat:'lhelmet',  tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // DERİ ZIRH / LEATHER ARMOR
  // ══════════════════════════════════════════════════════════
  { id:'ARMOR_LEATHER_SET1',   en:"Hunter Jacket",      tr:"Avcı Ceketi",            cat:'larmor',   tiers:[4,5,6,7,8] },
  { id:'ARMOR_LEATHER_SET2',   en:"Mercenary Jacket",   tr:"Paralı Asker Ceketi",    cat:'larmor',   tiers:[4,5,6,7,8] },
  { id:'ARMOR_LEATHER_SET3',   en:"Hellion Jacket",     tr:"Şeytan Ceketi",          cat:'larmor',   tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // DERİ BOT / LEATHER SHOES
  // ══════════════════════════════════════════════════════════
  { id:'SHOES_LEATHER_SET1',   en:"Hunter Shoes",       tr:"Avcı Ayakkabısı",        cat:'lshoes',   tiers:[4,5,6,7,8] },
  { id:'SHOES_LEATHER_SET2',   en:"Mercenary Shoes",    tr:"Paralı Asker Ayakkabısı",cat:'lshoes',   tiers:[4,5,6,7,8] },
  { id:'SHOES_LEATHER_SET3',   en:"Hellion Shoes",      tr:"Şeytan Ayakkabısı",      cat:'lshoes',   tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // PLAKA KASK / PLATE HELMETS
  // ══════════════════════════════════════════════════════════
  { id:'HEAD_PLATE_SET1',      en:"Soldier Helmet",     tr:"Asker Miğferi",          cat:'phelmet',  tiers:[4,5,6,7,8] },
  { id:'HEAD_PLATE_SET2',      en:"Knight Helmet",      tr:"Şövalye Miğferi",        cat:'phelmet',  tiers:[4,5,6,7,8] },
  { id:'HEAD_PLATE_SET3',      en:"Guardian Helmet",    tr:"Muhafız Miğferi",        cat:'phelmet',  tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // PLAKA ZIRH / PLATE ARMOR
  // ══════════════════════════════════════════════════════════
  { id:'ARMOR_PLATE_SET1',     en:"Soldier Armor",      tr:"Asker Zırhı",            cat:'parmor',   tiers:[4,5,6,7,8] },
  { id:'ARMOR_PLATE_SET2',     en:"Knight Armor",       tr:"Şövalye Zırhı",          cat:'parmor',   tiers:[4,5,6,7,8] },
  { id:'ARMOR_PLATE_SET3',     en:"Guardian Armor",     tr:"Muhafız Zırhı",          cat:'parmor',   tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // PLAKA BOT / PLATE SHOES
  // ══════════════════════════════════════════════════════════
  { id:'SHOES_PLATE_SET1',     en:"Soldier Boots",      tr:"Asker Botları",          cat:'pshoes',   tiers:[4,5,6,7,8] },
  { id:'SHOES_PLATE_SET2',     en:"Knight Boots",       tr:"Şövalye Botları",        cat:'pshoes',   tiers:[4,5,6,7,8] },
  { id:'SHOES_PLATE_SET3',     en:"Guardian Boots",     tr:"Muhafız Botları",        cat:'pshoes',   tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // KUMAŞ KASK / CLOTH HELMETS
  // ══════════════════════════════════════════════════════════
  { id:'HEAD_CLOTH_SET1',      en:"Scholar Cowl",       tr:"Bilge Başlığı",          cat:'chelmet',  tiers:[4,5,6,7,8] },
  { id:'HEAD_CLOTH_SET2',      en:"Cleric Cowl",        tr:"Rahip Başlığı",          cat:'chelmet',  tiers:[4,5,6,7,8] },
  { id:'HEAD_CLOTH_SET3',      en:"Mage Cowl",          tr:"Büyücü Başlığı",         cat:'chelmet',  tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // KUMAŞ ZIRH / CLOTH ARMOR
  // ══════════════════════════════════════════════════════════
  { id:'ARMOR_CLOTH_SET1',     en:"Scholar Robe",       tr:"Bilge Cübbesi",          cat:'carmor',   tiers:[4,5,6,7,8] },
  { id:'ARMOR_CLOTH_SET2',     en:"Cleric Robe",        tr:"Rahip Cübbesi",          cat:'carmor',   tiers:[4,5,6,7,8] },
  { id:'ARMOR_CLOTH_SET3',     en:"Mage Robe",          tr:"Büyücü Cübbesi",         cat:'carmor',   tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // KUMAŞ BOT / CLOTH SHOES
  // ══════════════════════════════════════════════════════════
  { id:'SHOES_CLOTH_SET1',     en:"Scholar Sandals",    tr:"Bilge Sandaleti",        cat:'cshoes',   tiers:[4,5,6,7,8] },
  { id:'SHOES_CLOTH_SET2',     en:"Cleric Sandals",     tr:"Rahip Sandaleti",        cat:'cshoes',   tiers:[4,5,6,7,8] },
  { id:'SHOES_CLOTH_SET3',     en:"Mage Sandals",       tr:"Büyücü Sandaleti",       cat:'cshoes',   tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // OFFHAND
  // ══════════════════════════════════════════════════════════
  { id:'OFF_SHIELD',           en:"Shield",             tr:"Kalkan",                 cat:'offhand',  tiers:[4,5,6,7,8] },
  { id:'OFF_BOOK',             en:"Tome of Spells",     tr:"Büyü Kitabı",            cat:'offhand',  tiers:[4,5,6,7,8] },
  { id:'OFF_HORN',             en:"Muisak",             tr:"Boru",                   cat:'offhand',  tiers:[4,5,6,7,8] },
  { id:'OFF_TORCH',            en:"Torch",              tr:"Meşale",                 cat:'offhand',  tiers:[4,5,6,7,8] },
  { id:'OFF_LAMP',             en:"Lamp",               tr:"Fener",                  cat:'offhand',  tiers:[4,5,6,7,8] },
  { id:'OFF_TOTEM',            en:"Totem",              tr:"Totem",                  cat:'offhand',  tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // BİNEKLER / MOUNTS
  // ══════════════════════════════════════════════════════════
  { id:'MOUNT_HORSE',          en:"Horse",              tr:"At",                     cat:'mount',    tiers:[3,4,5,6,7,8] },
  { id:'MOUNT_ARMOREDHORSE',   en:"Armored Horse",      tr:"Zırhlı At",              cat:'mount',    tiers:[5,6,7,8] },
  { id:'MOUNT_OX',             en:"Ox",                 tr:"Öküz",                   cat:'mount',    tiers:[4,5,6,7,8] },
  { id:'MOUNT_SWAMPDRAGON',    en:"Swamp Dragon",       tr:"Bataklık Ejderi",        cat:'mount',    tiers:[5,6,7,8] },
  { id:'MOUNT_DIREWOLF',       en:"Direwolf",           tr:"Dev Kurt",               cat:'mount',    tiers:[5,6,7,8] },
  { id:'MOUNT_MAMMOTH_BATTLE', en:"Battle Mount",       tr:"Savaş Mamutu",           cat:'mount',    tiers:[6,7,8] },
  { id:'MOUNT_GIANTSTAG',      en:"Giant Stag",         tr:"Dev Geyik",              cat:'mount',    tiers:[6,7,8] },

  // ══════════════════════════════════════════════════════════
  // YİYECEK / FOOD
  // ══════════════════════════════════════════════════════════
  { id:'MEAL_STEW',            en:"Beef Stew",          tr:"Güveç",                  cat:'food',     tiers:[3,4,5,6,7,8] },
  { id:'MEAL_SOUP',            en:"Turnip Soup",        tr:"Şalgam Çorbası",         cat:'food',     tiers:[3,4,5,6,7,8] },
  { id:'MEAL_SALAD',           en:"Pumpkin Salad",      tr:"Kabak Salatası",         cat:'food',     tiers:[3,4,5,6,7,8] },
  { id:'MEAL_OMELETTE',        en:"Omelette",           tr:"Omlet",                  cat:'food',     tiers:[3,4,5,6,7,8] },
  { id:'MEAL_ROAST',           en:"Roast",              tr:"Kızartma",               cat:'food',     tiers:[4,5,6,7,8] },
  { id:'MEAL_SANDWICH',        en:"Sandwich",           tr:"Sandviç",                cat:'food',     tiers:[3,4,5,6,7,8] },
  { id:'MEAL_GOULASH',         en:"Goulash",            tr:"Gulyas",                 cat:'food',     tiers:[4,5,6,7,8] },
  { id:'MEAL_PORK_OMELETTE_MORGANA',en:"Pork Omelette", tr:"Domuz Omleti",          cat:'food',     tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // İKSİRLER / POTIONS
  // ══════════════════════════════════════════════════════════
  { id:'POTION_HEALING',       en:"Healing Potion",     tr:"İyileştirme İksiri",     cat:'potion',   tiers:[3,4,5,6,7,8] },
  { id:'POTION_ENERGY',        en:"Energy Potion",      tr:"Enerji İksiri",          cat:'potion',   tiers:[3,4,5,6,7,8] },
  { id:'POTION_GIGANTIFY',     en:"Gigantify Potion",   tr:"Devleşme İksiri",        cat:'potion',   tiers:[3,4,5,6,7,8] },
  { id:'POTION_RESISTANCE',    en:"Resistance Potion",  tr:"Direnç İksiri",          cat:'potion',   tiers:[3,4,5,6,7,8] },
  { id:'POTION_REVIVE',        en:"Revive Potion",      tr:"Diriliş İksiri",         cat:'potion',   tiers:[4,5,6,7,8] },
  { id:'POTION_INVISIBILITY',  en:"Invisibility Potion",tr:"Görünmezlik İksiri",     cat:'potion',   tiers:[4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // İŞLENMİŞ KAYNAKLAR / REFINED RESOURCES
  // ══════════════════════════════════════════════════════════
  { id:'PLANKS',               en:"Planks",             tr:"Tahta",                  cat:'refined',  tiers:[2,3,4,5,6,7,8] },
  { id:'METALBAR',             en:"Metal Bar",          tr:"Metal Külçe",            cat:'refined',  tiers:[2,3,4,5,6,7,8] },
  { id:'CLOTH',                en:"Cloth",              tr:"Kumaş",                  cat:'refined',  tiers:[2,3,4,5,6,7,8] },
  { id:'LEATHER',              en:"Leather",            tr:"İşlenmiş Deri",          cat:'refined',  tiers:[2,3,4,5,6,7,8] },
  { id:'STONEBLOCK',           en:"Stone Block",        tr:"Taş Blok",               cat:'refined',  tiers:[2,3,4,5,6,7,8] },

  // ══════════════════════════════════════════════════════════
  // HAM KAYNAKLAR / RAW RESOURCES
  // ══════════════════════════════════════════════════════════
  { id:'WOOD',                 en:"Wood",               tr:"Ham Odun",               cat:'raw',      tiers:[2,3,4,5,6,7,8] },
  { id:'ORE',                  en:"Ore",                tr:"Ham Maden",              cat:'raw',      tiers:[2,3,4,5,6,7,8] },
  { id:'FIBER',                en:"Fiber",              tr:"Ham Fiber",              cat:'raw',      tiers:[2,3,4,5,6,7,8] },
  { id:'HIDE',                 en:"Hide",               tr:"Ham Deri",               cat:'raw',      tiers:[2,3,4,5,6,7,8] },
  { id:'ROCK',                 en:"Rock",               tr:"Ham Taş",                cat:'raw',      tiers:[2,3,4,5,6,7,8] },

];

// ─── YARDIMCI FONKSİYONLAR — tüm sayfalar kullanır ──────────

// ID oluştur: T5_2H_BOW veya T5_2H_BOW@2
window.AO_BUILD_ID = function(baseId, tier, enchant) {
  return `T${tier}_${baseId}${enchant > 0 ? '@' + enchant : ''}`;
};

// İkon URL'i
window.AO_ICON = function(baseId, tier, enchant) {
  const enc = enchant > 0 ? `@${enchant}` : '';
  return `https://render.albiononline.com/v1/item/T${tier}_${baseId}${enc}.png`;
};

// Arama — hem TR hem EN isimle çalışır
window.AO_SEARCH = function(query, lang) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return window.AO_ITEMS.filter(item => {
    const nameMatch = item.en.toLowerCase().includes(q) || item.tr.toLowerCase().includes(q);
    const idMatch   = item.id.toLowerCase().includes(q);
    return nameMatch || idMatch;
  });
};

// İsim getir (dile göre)
window.AO_NAME = function(baseId, lang) {
  const item = window.AO_ITEMS.find(i => i.id === baseId);
  if (!item) return baseId;
  return lang === 'en' ? item.en : item.tr;
};

// Tier prefix'li tam isim: "T5 Yay" veya "T5 Bow"
window.AO_FULLNAME = function(baseId, tier, enchant, lang) {
  const name = window.AO_NAME(baseId, lang);
  const encStr = enchant > 0 ? ` +${enchant}` : '';
  const tierNames = {4:'Adept',5:'Expert',6:'Master',7:'Grandmaster',8:'Elder'};
  const prefix = lang === 'en' ? (tierNames[tier] || `T${tier}`) : `T${tier}`;
  return `${prefix} ${name}${encStr}`;
};
