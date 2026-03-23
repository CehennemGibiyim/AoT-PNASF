// AoT-PNASF — Master Item Database v2
// Kaynaklar: albiononline2d.com (ID doğrulama) + render.albiononline.com (ikonlar)
// Her eşya: ID (oyun içi, tier prefix'siz), en (İngilizce resmi isim), tr (Türkçe), cat, tiers

window.AO_API = {
  price: { eu:'https://europe.albion-online-data.com', us:'https://west.albion-online-data.com', asia:'https://east.albion-online-data.com' },
  render: { icon:(id,enc=0)=>`https://render.albiononline.com/v1/item/${id}${enc>0?'@'+enc:''}.png`, iconBase:(base,tier,enc=0)=>`https://render.albiononline.com/v1/item/T${tier}_${base}${enc>0?'@'+enc:''}.png` },
  gameinfo: { eu:'https://gameinfo.albiononline.com/api/gameinfo', ams:'https://gameinfo-ams.albiononline.com/api/gameinfo', sgp:'https://gameinfo-sgp.albiononline.com/api/gameinfo' },
  cities: ['Caerleon','Bridgewatch','Lymhurst','Martlock','Thetford','Fort Sterling','Brecilien','Black Market'],
  tierName:(t,l='tr')=>({tr:{2:'Acemi',3:'Yolculuk',4:'Çırak',5:'Uzman',6:'Usta',7:'Büyükusta',8:'Yaşlı'},en:{2:'Novice',3:'Journeyman',4:'Adept',5:'Expert',6:'Master',7:'Grandmaster',8:'Elder'}}[l]?.[t]||`T${t}`)
};

window.AO_ITEMS=[
  // KILIÇLAR
  {id:'MAIN_SWORD',                 en:'Broadsword',           tr:'Geniş Kılıç',            cat:'sword',   tiers:[4,5,6,7,8]},
  {id:'2H_CLAYMORE',                en:'Claymore',             tr:'Claymore',               cat:'sword',   tiers:[4,5,6,7,8]},
  {id:'2H_DUALSWORD',               en:'Dual Swords',          tr:'Çift Kılıç',             cat:'sword',   tiers:[4,5,6,7,8]},
  {id:'MAIN_SCIMITAR_MORGANA',      en:'Carving Sword',        tr:'Orak Kılıcı',            cat:'sword',   tiers:[4,5,6,7,8]},
  {id:'2H_CLEAVER_HELL',            en:'Clarent Blade',        tr:'Clarent Kılıcı',         cat:'sword',   tiers:[4,5,6,7,8]},
  {id:'2H_DUALSWORD_UNDEAD',        en:'Galatine Pair',        tr:'Galatine Çifti',         cat:'sword',   tiers:[4,5,6,7,8]},
  // BALTALAR
  {id:'MAIN_AXE',                   en:'Battleaxe',            tr:'Savaş Baltası',          cat:'axe',     tiers:[4,5,6,7,8]},
  {id:'2H_AXE',                     en:'Great Axe',            tr:'Büyük Balta',            cat:'axe',     tiers:[4,5,6,7,8]},
  {id:'2H_HALBERD',                 en:'Halberd',              tr:'Halberd',                cat:'axe',     tiers:[4,5,6,7,8]},
  {id:'2H_SCYTHE_HELL',             en:'Carrioncaller',        tr:'Leş Çağırıcı',           cat:'axe',     tiers:[4,5,6,7,8]},
  {id:'2H_HALBERD_UNDEAD',          en:'Infernal Scythe',      tr:'Cehennem Tırpanı',       cat:'axe',     tiers:[4,5,6,7,8]},
  // YAYLAR
  {id:'2H_BOW',                     en:'Bow',                  tr:'Yay',                    cat:'bow',     tiers:[4,5,6,7,8]},
  {id:'2H_LONGBOW',                 en:'Warbow',               tr:'Savaş Yayı',             cat:'bow',     tiers:[4,5,6,7,8]},
  {id:'2H_LONGBOW_UNDEAD',          en:'Whispering Bow',       tr:'Fısıldayan Yay',         cat:'bow',     tiers:[4,5,6,7,8]},
  {id:'2H_BOW_HELL',                en:'Bow of Badon',         tr:'Badon Yayı',             cat:'bow',     tiers:[4,5,6,7,8]},
  {id:'2H_BOW_MORGANA',             en:'Wailing Bow',          tr:'Ağlayan Yay',            cat:'bow',     tiers:[4,5,6,7,8]},
  {id:'2H_CROSSBOW',                en:'Crossbow',             tr:'Arbalet',                cat:'bow',     tiers:[4,5,6,7,8]},
  {id:'2H_CROSSBOW_CANNON',         en:'Heavy Crossbow',       tr:'Ağır Arbalet',           cat:'bow',     tiers:[4,5,6,7,8]},
  {id:'MAIN_CROSSBOW',              en:'Weeping Repeater',     tr:'Ağlayan Tekrarlı',       cat:'bow',     tiers:[4,5,6,7,8]},
  {id:'2H_CROSSBOW_LARGE_MORGANA',  en:'Siegebow',             tr:'Kuşatma Yayı',           cat:'bow',     tiers:[4,5,6,7,8]},
  {id:'2H_BOW_KEEPER',              en:'Mistpiercer',          tr:'Sis Delici',             cat:'bow',     tiers:[4,5,6,7,8]},
  // ÇEKİÇLER
  {id:'MAIN_HAMMER',                en:'Hammer',               tr:'Çekiç',                  cat:'hammer',  tiers:[4,5,6,7,8]},
  {id:'2H_POLEHAMMER',              en:'Polehammer',           tr:'Savaş Çekici',           cat:'hammer',  tiers:[4,5,6,7,8]},
  {id:'2H_HAMMER_HELL',             en:'Great Hammer',         tr:'Büyük Çekiç',            cat:'hammer',  tiers:[4,5,6,7,8]},
  {id:'2H_HAMMER_MORGANA',          en:'Tombhammer',           tr:'Mezar Çekici',           cat:'hammer',  tiers:[4,5,6,7,8]},
  // MIZRAKLAR
  {id:'MAIN_SPEAR',                 en:'Spear',                tr:'Mızrak',                 cat:'spear',   tiers:[4,5,6,7,8]},
  {id:'2H_SPEAR',                   en:'Pike',                 tr:'Uzun Mızrak',            cat:'spear',   tiers:[4,5,6,7,8]},
  {id:'2H_GLAIVE',                  en:'Glaive',               tr:'Glaive',                 cat:'spear',   tiers:[4,5,6,7,8]},
  {id:'2H_HARPOON_HELL',            en:'Spirithunter',         tr:'Ruh Avcısı',             cat:'spear',   tiers:[4,5,6,7,8]},
  {id:'2H_DUALSICKLE_HELL',         en:'Heron Spear',          tr:'Balıkçıl Mızrağı',       cat:'spear',   tiers:[4,5,6,7,8]},
  // HANÇERler
  {id:'MAIN_DAGGER',                en:'Dagger',               tr:'Hançer',                 cat:'dagger',  tiers:[4,5,6,7,8]},
  {id:'2H_DAGGERPAIR',              en:'Dagger Pair',          tr:'Çift Hançer',            cat:'dagger',  tiers:[4,5,6,7,8]},
  {id:'2H_CLAWPAIR_HELL',           en:'Bloodletter',          tr:'Kan Dökücü',             cat:'dagger',  tiers:[4,5,6,7,8]},
  {id:'MAIN_RAPIER_MORGANA',        en:'Carving Blade',        tr:'Oyma Kılıcı',            cat:'dagger',  tiers:[4,5,6,7,8]},
  {id:'2H_DUALSCIMITAR_UNDEAD',     en:'Deathgivers',          tr:'Ölüm Vericiler',         cat:'dagger',  tiers:[4,5,6,7,8]},
  // QUARTERSTAFF
  {id:'2H_QUARTERSTAFF',            en:'Quarterstaff',         tr:'Quarterstaff',           cat:'qstaff',  tiers:[4,5,6,7,8]},
  {id:'2H_IRONCLADEDSTAFF',         en:'Iron-clad Staff',      tr:'Demirli Asa',            cat:'qstaff',  tiers:[4,5,6,7,8]},
  {id:'2H_DOUBLEBLADEDSTAFF_HELL',  en:'Black Monk Stave',     tr:'Siyah Keşiş Sopası',     cat:'qstaff',  tiers:[4,5,6,7,8]},
  {id:'2H_COMBATSTAFF_MORGANA',     en:'Staff of Balance',     tr:'Denge Asası',            cat:'qstaff',  tiers:[4,5,6,7,8]},
  {id:'2H_ROCKSTAFF_UNDEAD',        en:'Grailseeker',          tr:'Kâse Arayan',            cat:'qstaff',  tiers:[4,5,6,7,8]},
  // GÜRZ
  {id:'MAIN_MACE',                  en:'Mace',                 tr:'Gürz',                   cat:'mace',    tiers:[4,5,6,7,8]},
  {id:'2H_MACE',                    en:'Heavy Mace',           tr:'Ağır Gürz',              cat:'mace',    tiers:[4,5,6,7,8]},
  {id:'MAIN_ROCKMACE_KEEPER',       en:'Bedrock Mace',         tr:'Ana Kaya Gürzü',         cat:'mace',    tiers:[4,5,6,7,8]},
  {id:'MAIN_MACE_HELL',             en:'Incubus Mace',         tr:'İnkubus Gürzü',          cat:'mace',    tiers:[4,5,6,7,8]},
  {id:'2H_MACE_MORGANA',            en:'Camlann Mace',         tr:'Camlann Gürzü',          cat:'mace',    tiers:[4,5,6,7,8]},
  {id:'MAIN_MORNING_STAR_CRYSTAL',  en:'Morning Star',         tr:'Sabah Yıldızı',          cat:'mace',    tiers:[4,5,6,7,8]},
  // SAVAŞ ELDİVENLERİ
  {id:'MAIN_KNUCKLES',              en:'Gloves',               tr:'Savaş Eldiveni',         cat:'gloves',  tiers:[4,5,6,7,8]},
  {id:'2H_KNUCKLES_SET1',           en:'Ravenstrike Cestus',   tr:'Kartal Yumrukları',      cat:'gloves',  tiers:[4,5,6,7,8]},
  {id:'MAIN_KNUCKLES_HELL',         en:'Hellfire Hands',       tr:'Cehennem Elleri',        cat:'gloves',  tiers:[4,5,6,7,8]},
  {id:'2H_KNUCKLES_MORGANA',        en:'Ursine Maulers',       tr:'Ayı Pençeleri',          cat:'gloves',  tiers:[4,5,6,7,8]},
  // ŞEKİL DEĞİŞTİREN
  {id:'MAIN_SHAPESHIFTER',          en:'Shapeshifter Staff',   tr:'Şekil Değiştirici Asa',  cat:'shift',   tiers:[4,5,6,7,8]},
  {id:'2H_SHAPESHIFTER_SET1',       en:'Pridwen',              tr:'Pridwen',                cat:'shift',   tiers:[4,5,6,7,8]},
  // ATEş ASALARI
  {id:'MAIN_FIRE',                  en:'Fire Staff',           tr:'Ateş Asası',             cat:'fire',    tiers:[4,5,6,7,8]},
  {id:'2H_INFERNOSTAFF',            en:'Infernal Staff',       tr:'Cehennem Asası',         cat:'fire',    tiers:[4,5,6,7,8]},
  {id:'2H_INFERNOSTAFF_HELL',       en:'Blazing Staff',        tr:'Alev Asası',             cat:'fire',    tiers:[4,5,6,7,8]},
  {id:'2H_INFERNOSTAFF_MORGANA',    en:'Brimstone Staff',      tr:'Kükürt Asası',           cat:'fire',    tiers:[4,5,6,7,8]},
  // BUZ ASALARI
  {id:'MAIN_FROST',                 en:'Frost Staff',          tr:'Buz Asası',              cat:'frost',   tiers:[4,5,6,7,8]},
  {id:'2H_FROSTSTAFF',              en:'Glacial Staff',        tr:'Buzul Asası',            cat:'frost',   tiers:[4,5,6,7,8]},
  {id:'2H_ICEGAUNTLETS_HELL',       en:'Permafrost Prism',     tr:'Kalıcı Don Prizma',      cat:'frost',   tiers:[4,5,6,7,8]},
  {id:'2H_ICICLESTAFF_UNDEAD',      en:'Hoarfrost Staff',      tr:'Kırağı Asası',           cat:'frost',   tiers:[4,5,6,7,8]},
  // GİZEM ASALARI
  {id:'MAIN_ARCANE',                en:'Arcane Staff',         tr:'Gizem Asası',            cat:'arcane',  tiers:[4,5,6,7,8]},
  {id:'2H_ARCANESTAFF',             en:'Great Arcane Staff',   tr:'Büyük Gizem Asası',      cat:'arcane',  tiers:[4,5,6,7,8]},
  {id:'2H_ENIGMATICSTAFF_HELL',     en:'Enigmatic Staff',      tr:'Muammalı Asa',           cat:'arcane',  tiers:[4,5,6,7,8]},
  {id:'2H_LIGHTCROSSBOW_MORGANA',   en:'Occult Staff',         tr:'Gizli Asa',              cat:'arcane',  tiers:[4,5,6,7,8]},
  // KUTSAL ASALAR
  {id:'MAIN_HOLY',                  en:'Holy Staff',           tr:'Kutsal Asa',             cat:'holy',    tiers:[4,5,6,7,8]},
  {id:'2H_HOLYSTAFF',               en:'Great Holy Staff',     tr:'Büyük Kutsal Asa',       cat:'holy',    tiers:[4,5,6,7,8]},
  {id:'2H_DIVINESTAFF_HELL',        en:'Divine Staff',         tr:'İlahi Asa',              cat:'holy',    tiers:[4,5,6,7,8]},
  {id:'2H_HOLYSTAFF_MORGANA',       en:'Lifetouch Staff',      tr:'Hayat Dokunuşu Asası',   cat:'holy',    tiers:[4,5,6,7,8]},
  // DOĞA ASALARI
  {id:'MAIN_NATURE',                en:'Nature Staff',         tr:'Doğa Asası',             cat:'nature',  tiers:[4,5,6,7,8]},
  {id:'2H_NATURESTAFF',             en:'Great Nature Staff',   tr:'Büyük Doğa Asası',       cat:'nature',  tiers:[4,5,6,7,8]},
  {id:'2H_WILDSTAFF_HELL',          en:'Druidic Staff',        tr:'Druid Asası',            cat:'nature',  tiers:[4,5,6,7,8]},
  {id:'2H_NATURESTAFF_KEEPER',      en:'Blight Staff',         tr:'Hastalık Asası',         cat:'nature',  tiers:[4,5,6,7,8]},
  // LANET ASALARI
  {id:'MAIN_CURSEDSTAFF',           en:'Cursed Staff',         tr:'Lanet Asası',            cat:'curse',   tiers:[4,5,6,7,8]},
  {id:'2H_CURSEDSTAFF',             en:'Great Cursed Staff',   tr:'Büyük Lanet Asası',      cat:'curse',   tiers:[4,5,6,7,8]},
  {id:'2H_CURSEDSTAFF_HELL',        en:'Demonic Staff',        tr:'Şeytan Asası',           cat:'curse',   tiers:[4,5,6,7,8]},
  {id:'2H_SKULLJESTER_UNDEAD',      en:'Lifecurse Staff',      tr:'Yaşam Lanet Asası',      cat:'curse',   tiers:[4,5,6,7,8]},
  // ÇANTALAR
  {id:'BAG',                        en:'Bag',                  tr:'Çanta',                  cat:'bag',     tiers:[2,3,4,5,6,7,8]},
  {id:'SATCHEL_OF_INSIGHT',         en:'Satchel of Insight',   tr:'Anlayış Çantası',        cat:'bag',     tiers:[4,5,6,7,8]},
  // DERİ KASK
  {id:'HEAD_LEATHER_SET1',          en:'Hunter Hood',          tr:'Avcı Başlığı',           cat:'lhelmet', tiers:[4,5,6,7,8]},
  {id:'HEAD_LEATHER_SET2',          en:'Mercenary Hood',       tr:'Paralı Asker Başlığı',   cat:'lhelmet', tiers:[4,5,6,7,8]},
  {id:'HEAD_LEATHER_SET3',          en:'Hellion Hood',         tr:'Şeytan Başlığı',         cat:'lhelmet', tiers:[4,5,6,7,8]},
  // DERİ ZIRH
  {id:'ARMOR_LEATHER_SET1',         en:'Hunter Jacket',        tr:'Avcı Ceketi',            cat:'larmor',  tiers:[4,5,6,7,8]},
  {id:'ARMOR_LEATHER_SET2',         en:'Mercenary Jacket',     tr:'Paralı Asker Ceketi',    cat:'larmor',  tiers:[4,5,6,7,8]},
  {id:'ARMOR_LEATHER_SET3',         en:'Hellion Jacket',       tr:'Şeytan Ceketi',          cat:'larmor',  tiers:[4,5,6,7,8]},
  // DERİ BOT
  {id:'SHOES_LEATHER_SET1',         en:'Hunter Shoes',         tr:'Avcı Ayakkabısı',        cat:'lshoes',  tiers:[4,5,6,7,8]},
  {id:'SHOES_LEATHER_SET2',         en:'Mercenary Shoes',      tr:'Paralı Asker Ayakkabısı',cat:'lshoes',  tiers:[4,5,6,7,8]},
  {id:'SHOES_LEATHER_SET3',         en:'Hellion Shoes',        tr:'Şeytan Ayakkabısı',      cat:'lshoes',  tiers:[4,5,6,7,8]},
  // PLAKA KASK
  {id:'HEAD_PLATE_SET1',            en:'Soldier Helmet',       tr:'Asker Miğferi',          cat:'phelmet', tiers:[4,5,6,7,8]},
  {id:'HEAD_PLATE_SET2',            en:'Knight Helmet',        tr:'Şövalye Miğferi',        cat:'phelmet', tiers:[4,5,6,7,8]},
  {id:'HEAD_PLATE_SET3',            en:'Guardian Helmet',      tr:'Muhafız Miğferi',        cat:'phelmet', tiers:[4,5,6,7,8]},
  // PLAKA ZIRH
  {id:'ARMOR_PLATE_SET1',           en:'Soldier Armor',        tr:'Asker Zırhı',            cat:'parmor',  tiers:[4,5,6,7,8]},
  {id:'ARMOR_PLATE_SET2',           en:'Knight Armor',         tr:'Şövalye Zırhı',          cat:'parmor',  tiers:[4,5,6,7,8]},
  {id:'ARMOR_PLATE_SET3',           en:'Guardian Armor',       tr:'Muhafız Zırhı',          cat:'parmor',  tiers:[4,5,6,7,8]},
  // PLAKA BOT
  {id:'SHOES_PLATE_SET1',           en:'Soldier Boots',        tr:'Asker Botları',          cat:'pshoes',  tiers:[4,5,6,7,8]},
  {id:'SHOES_PLATE_SET2',           en:'Knight Boots',         tr:'Şövalye Botları',        cat:'pshoes',  tiers:[4,5,6,7,8]},
  {id:'SHOES_PLATE_SET3',           en:'Guardian Boots',       tr:'Muhafız Botları',        cat:'pshoes',  tiers:[4,5,6,7,8]},
  // KUMAŞ KASK
  {id:'HEAD_CLOTH_SET1',            en:'Scholar Cowl',         tr:'Bilge Başlığı',          cat:'chelmet', tiers:[4,5,6,7,8]},
  {id:'HEAD_CLOTH_SET2',            en:'Cleric Cowl',          tr:'Rahip Başlığı',          cat:'chelmet', tiers:[4,5,6,7,8]},
  {id:'HEAD_CLOTH_SET3',            en:'Mage Cowl',            tr:'Büyücü Başlığı',         cat:'chelmet', tiers:[4,5,6,7,8]},
  // KUMAŞ ZIRH
  {id:'ARMOR_CLOTH_SET1',           en:'Scholar Robe',         tr:'Bilge Cübbesi',          cat:'carmor',  tiers:[4,5,6,7,8]},
  {id:'ARMOR_CLOTH_SET2',           en:'Cleric Robe',          tr:'Rahip Cübbesi',          cat:'carmor',  tiers:[4,5,6,7,8]},
  {id:'ARMOR_CLOTH_SET3',           en:'Mage Robe',            tr:'Büyücü Cübbesi',         cat:'carmor',  tiers:[4,5,6,7,8]},
  // KUMAŞ BOT
  {id:'SHOES_CLOTH_SET1',           en:'Scholar Sandals',      tr:'Bilge Sandaleti',        cat:'cshoes',  tiers:[4,5,6,7,8]},
  {id:'SHOES_CLOTH_SET2',           en:'Cleric Sandals',       tr:'Rahip Sandaleti',        cat:'cshoes',  tiers:[4,5,6,7,8]},
  {id:'SHOES_CLOTH_SET3',           en:'Mage Sandals',         tr:'Büyücü Sandaleti',       cat:'cshoes',  tiers:[4,5,6,7,8]},
  // PELERİNLER
  {id:'CAPE',                       en:'Cape',                 tr:'Pelerin',                cat:'cape',    tiers:[4,5,6,7,8]},
  {id:'CAPE_KEEPER',                en:'Keeper Cape',          tr:'Koruyucu Pelerin',       cat:'cape',    tiers:[4,5,6,7,8]},
  {id:'CAPE_MORGANA',               en:'Morgana Cape',         tr:'Morgana Pelerini',       cat:'cape',    tiers:[4,5,6,7,8]},
  {id:'CAPE_CAERLEON',              en:'Caerleon Cape',        tr:'Caerleon Pelerini',      cat:'cape',    tiers:[4,5,6,7,8]},
  {id:'CAPE_LYMHURST',              en:'Lymhurst Cape',        tr:'Lymhurst Pelerini',      cat:'cape',    tiers:[4,5,6,7,8]},
  {id:'CAPE_BRIDGEWATCH',           en:'Bridgewatch Cape',     tr:'Bridgewatch Pelerini',   cat:'cape',    tiers:[4,5,6,7,8]},
  {id:'CAPE_MARTLOCK',              en:'Martlock Cape',        tr:'Martlock Pelerini',      cat:'cape',    tiers:[4,5,6,7,8]},
  {id:'CAPE_THETFORD',              en:'Thetford Cape',        tr:'Thetford Pelerini',      cat:'cape',    tiers:[4,5,6,7,8]},
  {id:'CAPE_FORTSTERLING',          en:'Fort Sterling Cape',   tr:'Fort Sterling Pelerini', cat:'cape',    tiers:[4,5,6,7,8]},
  {id:'CAPE_BRECILIEN',             en:'Brecilien Cape',       tr:'Brecilien Pelerini',     cat:'cape',    tiers:[4,5,6,7,8]},
  // OFFHAND
  {id:'OFF_SHIELD',                 en:'Shield',               tr:'Kalkan',                 cat:'offhand', tiers:[4,5,6,7,8]},
  {id:'OFF_BOOK',                   en:'Tome of Spells',       tr:'Büyü Kitabı',            cat:'offhand', tiers:[4,5,6,7,8]},
  {id:'OFF_HORN',                   en:'Muisak',               tr:'Boru',                   cat:'offhand', tiers:[4,5,6,7,8]},
  {id:'OFF_TORCH',                  en:'Torch',                tr:'Meşale',                 cat:'offhand', tiers:[4,5,6,7,8]},
  {id:'OFF_LAMP',                   en:'Lamp',                 tr:'Fener',                  cat:'offhand', tiers:[4,5,6,7,8]},
  {id:'OFF_TOTEM',                  en:'Totem',                tr:'Totem',                  cat:'offhand', tiers:[4,5,6,7,8]},
  {id:'OFF_HORN_KEEPER',            en:'Sarcophagus',          tr:'Lahit',                  cat:'offhand', tiers:[4,5,6,7,8]},
  {id:'OFF_BOOK_MORGANA',           en:'Cryptcandle',          tr:'Kripto Mumu',            cat:'offhand', tiers:[4,5,6,7,8]},
  // BİNEKLER
  {id:'MOUNT_HORSE',                en:'Horse',                tr:'At',                     cat:'mount',   tiers:[3,4,5,6,7,8]},
  {id:'MOUNT_ARMOREDHORSE',         en:'Armored Horse',        tr:'Zırhlı At',              cat:'mount',   tiers:[5,6,7,8]},
  {id:'MOUNT_OX',                   en:'Ox',                   tr:'Öküz',                   cat:'mount',   tiers:[4,5,6,7,8]},
  {id:'MOUNT_SWAMPDRAGON',          en:'Swamp Dragon',         tr:'Bataklık Ejderi',        cat:'mount',   tiers:[5,6,7,8]},
  {id:'MOUNT_DIREWOLF',             en:'Direwolf',             tr:'Dev Kurt',               cat:'mount',   tiers:[5,6,7,8]},
  {id:'MOUNT_MAMMOTH_BATTLE',       en:'Battle Mammoth',       tr:'Savaş Mamutu',           cat:'mount',   tiers:[6,7,8]},
  {id:'MOUNT_GIANTSTAG',            en:'Giant Stag',           tr:'Dev Geyik',              cat:'mount',   tiers:[6,7,8]},
  {id:'MOUNT_BEAR',                 en:'Bear',                 tr:'Ayı',                    cat:'mount',   tiers:[5,6,7,8]},
  // YİYECEK
  {id:'MEAL_STEW',                  en:'Beef Stew',            tr:'Güveç',                  cat:'food',    tiers:[3,4,5,6,7,8]},
  {id:'MEAL_SOUP',                  en:'Turnip Soup',          tr:'Şalgam Çorbası',         cat:'food',    tiers:[3,4,5,6,7,8]},
  {id:'MEAL_SALAD',                 en:'Pumpkin Salad',        tr:'Kabak Salatası',         cat:'food',    tiers:[3,4,5,6,7,8]},
  {id:'MEAL_OMELETTE',              en:'Omelette',             tr:'Omlet',                  cat:'food',    tiers:[3,4,5,6,7,8]},
  {id:'MEAL_ROAST',                 en:'Roast',                tr:'Kızartma',               cat:'food',    tiers:[4,5,6,7,8]},
  {id:'MEAL_SANDWICH',              en:'Sandwich',             tr:'Sandviç',                cat:'food',    tiers:[3,4,5,6,7,8]},
  {id:'MEAL_GOULASH',               en:'Goulash',              tr:'Gulyas',                 cat:'food',    tiers:[4,5,6,7,8]},
  {id:'MEAL_SEAWEEDSALAD',          en:'Seaweed Salad',        tr:'Yosun Salatası',         cat:'food',    tiers:[4,5,6,7,8]},
  {id:'MEAL_FISHANDCHIPS',          en:'Fish and Chips',       tr:'Balık ve Patates',       cat:'food',    tiers:[4,5,6,7,8]},
  // İKSİRLER
  {id:'POTION_HEALING',             en:'Healing Potion',       tr:'İyileştirme İksiri',     cat:'potion',  tiers:[3,4,5,6,7,8]},
  {id:'POTION_ENERGY',              en:'Energy Potion',        tr:'Enerji İksiri',          cat:'potion',  tiers:[3,4,5,6,7,8]},
  {id:'POTION_GIGANTIFY',           en:'Gigantify Potion',     tr:'Devleşme İksiri',        cat:'potion',  tiers:[3,4,5,6,7,8]},
  {id:'POTION_RESISTANCE',          en:'Resistance Potion',    tr:'Direnç İksiri',          cat:'potion',  tiers:[3,4,5,6,7,8]},
  {id:'POTION_REVIVE',              en:'Revive Potion',        tr:'Diriliş İksiri',         cat:'potion',  tiers:[4,5,6,7,8]},
  {id:'POTION_INVISIBILITY',        en:'Invisibility Potion',  tr:'Görünmezlik İksiri',     cat:'potion',  tiers:[4,5,6,7,8]},
  {id:'POTION_MOB_HEALING',         en:'Toughness Tincture',   tr:'Sertlik Tentürü',        cat:'potion',  tiers:[4,5,6,7,8]},
  // İŞLENMİŞ KAYNAKLAR
  {id:'PLANKS',                     en:'Planks',               tr:'Tahta',                  cat:'refined', tiers:[2,3,4,5,6,7,8]},
  {id:'METALBAR',                   en:'Metal Bar',            tr:'Metal Külçe',            cat:'refined', tiers:[2,3,4,5,6,7,8]},
  {id:'CLOTH',                      en:'Cloth',                tr:'Kumaş',                  cat:'refined', tiers:[2,3,4,5,6,7,8]},
  {id:'LEATHER',                    en:'Leather',              tr:'İşlenmiş Deri',          cat:'refined', tiers:[2,3,4,5,6,7,8]},
  {id:'STONEBLOCK',                 en:'Stone Block',          tr:'Taş Blok',               cat:'refined', tiers:[2,3,4,5,6,7,8]},
  // HAM KAYNAKLAR
  {id:'WOOD',                       en:'Wood',                 tr:'Ham Odun',               cat:'raw',     tiers:[2,3,4,5,6,7,8]},
  {id:'ORE',                        en:'Ore',                  tr:'Ham Maden',              cat:'raw',     tiers:[2,3,4,5,6,7,8]},
  {id:'FIBER',                      en:'Fiber',                tr:'Ham Fiber',              cat:'raw',     tiers:[2,3,4,5,6,7,8]},
  {id:'HIDE',                       en:'Hide',                 tr:'Ham Deri',               cat:'raw',     tiers:[2,3,4,5,6,7,8]},
  {id:'ROCK',                       en:'Rock',                 tr:'Ham Taş',                cat:'raw',     tiers:[2,3,4,5,6,7,8]},
];

// GLOBAL FONKSİYONLAR — tüm sayfalar kullanır
window.AO_NAME=(id,l='tr')=>{const i=window.AO_ITEMS.find(x=>x.id===id);return i?(l==='en'?i.en:i.tr):id.replace(/_/g,' ')};
window.AO_ICON=(id,t,e=0)=>`https://render.albiononline.com/v1/item/T${t}_${id}${e>0?'@'+e:''}.png`;
window.AO_FULLNAME=(id,t,e=0,l='tr')=>`${window.AO_API.tierName(t,l)} ${window.AO_NAME(id,l)}${e>0?' +'+e:''}`;
window.AO_SEARCH=(q,opts={})=>{
  if(!q||q.length<1) return [];
  const s=q.toLowerCase();
  return (window.AO_ITEMS||[]).filter(i=>{
    if(opts.cat&&i.cat!==opts.cat) return false;
    if(opts.tier&&!i.tiers.includes(opts.tier)) return false;
    return i.en.toLowerCase().includes(s)||i.tr.toLowerCase().includes(s)||i.id.toLowerCase().includes(s);
  });
};
