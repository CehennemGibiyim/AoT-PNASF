// Global fonksiyon: Arbitrage modülünü yükle
function loadArbitrageModule() {
    const container = document.getElementById('arbitrageApp');
    if (!container) return;
    
    console.log('🔄 Arbitrage modülü yükleniyor...');

    // === KAPSAMLI ALBION MARKET KATEGORİLERİ ===
    // Oyun içi marketteki TÜM kategoriler, eşyalar ve varyasyonlar
    const ARB_CATEGORIES = {
        "🗡️ Silahlar (Weapons)": {
            "Broadsword (Kılıç)": [
                { id: "MAIN_SWORD", name: "Kılıç" },
                { id: "2H_CLAYMORE", name: "Claymore" },
                { id: "2H_DUALSWORD", name: "Çift Kılıç" },
                { id: "MAIN_SCIMITAR_MORGANA", name: "Morgana Kılıcı" },
                { id: "2H_CLEAVER_HELL", name: "Cehennem Baltası" },
                { id: "2H_DUALSCIMITAR_UNDEAD", name: "Ölümsüz Çift Eğri Kılıç" },
                { id: "2H_CLAYMORE_AVALON", name: "Avalon Claymore" }
            ],
            "Bow (Yay)": [
                { id: "MAIN_BOW", name: "Yay" },
                { id: "2H_BOW_LONGBOW", name: "Uzun Yay" },
                { id: "2H_BOW_REFLECTIVE", name: "Yansıtıcı Yay" },
                { id: "2H_BOW_KEEPER", name: "Bakıcı Yay" },
                { id: "2H_BOW_AVALON", name: "Avalon Yayı" },
                { id: "2H_BOW_HELL", name: "Cehennem Yayı" }
            ],
            "Crossbow (Arbalet)": [
                { id: "MAIN_CROSSBOW", name: "Arbalet" },
                { id: "2H_CROSSBOWLARGE", name: "Ağır Arbalet" },
                { id: "2H_CROSSBOW", name: "Çift Arbalet" },
                { id: "MAIN_1HCROSSBOW", name: "Tek El Arbalet" },
                { id: "2H_REPEATINGCROSSBOW_UNDEAD", name: "Tekrarlayan Arbalet" },
                { id: "2H_DUALCROSSBOW_HELL", name: "Cehennem Çift Arbalet" },
                { id: "2H_CROSSBOWLARGE_MORGANA", name: "Morgana Ağır Arbaleti" },
                { id: "2H_CROSSBOW_CANNON_AVALON", name: "Avalon Topu" }
            ],
            "Dagger (Hançer)": [
                { id: "MAIN_DAGGER", name: "Hançer" },
                { id: "2H_DAGGERPAIR", name: "Çift Hançer" },
                { id: "2H_CLAWPAIR", name: "Pençe" },
                { id: "MAIN_RAPIER_MORGANA", name: "Morgana Kılıcı" },
                { id: "MAIN_DAGGER_HELL", name: "Cehennem Hançeri" },
                { id: "2H_IRONGAUNTLETS_HELL", name: "Cehennem Demir Eldiven" },
                { id: "2H_TWINSCYTHE_HELL", name: "Cehennem İkiz Tırpan" },
                { id: "2H_DAGGER_KATAR_AVALON", name: "Avalon Katar" }
            ],
            "Hammer (Çekiç)": [
                { id: "MAIN_HAMMER", name: "Çekiç" },
                { id: "2H_POLEHAMMER", name: "Savaş Çekici" },
                { id: "2H_HAMMER", name: "Büyük Çekiç" },
                { id: "2H_HAMMER_UNDEAD", name: "Ölümsüz Çekiç" },
                { id: "2H_DUALHAMMER_HELL", name: "Cehennem Çift Çekiç" },
                { id: "2H_RAM_KEEPER", name: "Bakıcı Koçbaşı" },
                { id: "2H_HAMMER_AVALON", name: "Avalon Çekici" }
            ],
            "Mace (Gürz)": [
                { id: "MAIN_MACE", name: "Gürz" },
                { id: "2H_MACE", name: "Büyük Gürz" },
                { id: "2H_FLAIL", name: "Topuz" },
                { id: "MAIN_ROCKMACE_KEEPER", name: "Bakıcı Taş Gürzü" },
                { id: "MAIN_MACE_HELL", name: "Cehennem Gürzü" },
                { id: "2H_MACE_MORGANA", name: "Morgana Gürzü" },
                { id: "2H_DUALMACE_AVALON", name: "Avalon Çift Gürz" }
            ],
            "Spear (Mızrak)": [
                { id: "MAIN_SPEAR", name: "Mızrak" },
                { id: "2H_SPEAR", name: "Pike" },
                { id: "2H_GLAIVE", name: "Glaive" },
                { id: "MAIN_HARPOON_HELL", name: "Cehennem Zıpkını" },
                { id: "2H_TRIDENT_UNDEAD", name: "Ölümsüz Üçlü Mızrak" },
                { id: "MAIN_SPEAR_KEEPER", name: "Bakıcı Mızrağı" },
                { id: "2H_GLAIVE_CRYSTAL", name: "Kristal Glaive" },
                { id: "2H_SPEAR_AVALON", name: "Avalon Mızrağı" }
            ],
            "Nature Staff (Doğa Asası)": [
                { id: "MAIN_NATURESTAFF", name: "Doğa Asası" },
                { id: "2H_NATURESTAFF", name: "Büyük Doğa Asası" },
                { id: "2H_WILDSTAFF", name: "Vahşi Asa" },
                { id: "MAIN_NATURESTAFF_KEEPER", name: "Bakıcı Doğa Asası" },
                { id: "2H_NATURESTAFF_HELL", name: "Cehennem Doğa Asası" },
                { id: "2H_NATURESTAFF_KEEPER", name: "Büyük Bakıcı Asası" },
                { id: "MAIN_NATURESTAFF_AVALON", name: "Avalon Doğa Asası" }
            ],
            "Holy Staff (Kutsal Asa)": [
                { id: "MAIN_HOLYSTAFF", name: "Kutsal Asa" },
                { id: "2H_HOLYSTAFF", name: "Büyük Kutsal Asa" },
                { id: "2H_DIVINESTAFF", name: "İlahi Asa" },
                { id: "MAIN_HOLYSTAFF_MORGANA", name: "Morgana Kutsal Asası" },
                { id: "2H_HOLYSTAFF_HELL", name: "Cehennem Kutsal Asası" },
                { id: "2H_HOLYSTAFF_UNDEAD", name: "Ölümsüz Kutsal Asa" },
                { id: "MAIN_HOLYSTAFF_AVALON", name: "Avalon Kutsal Asası" }
            ],
            "Fire Staff (Ateş Asası)": [
                { id: "MAIN_FIRESTAFF", name: "Ateş Asası" },
                { id: "2H_FIRESTAFF", name: "Büyük Ateş Asası" },
                { id: "2H_INFERNOSTAFF", name: "İnferno Asası" },
                { id: "MAIN_FIRESTAFF_KEEPER", name: "Bakıcı Ateş Asası" },
                { id: "2H_FIRESTAFF_HELL", name: "Cehennem Ateş Asası" },
                { id: "2H_INFERNOSTAFF_MORGANA", name: "Morgana İnferno Asası" },
                { id: "2H_FIRE_RING_MORGANA", name: "Morgana Ateş Çemberi" },
                { id: "MAIN_FIRESTAFF_AVALON", name: "Avalon Ateş Asası" }
            ],
            "Frost Staff (Buz Asası)": [
                { id: "MAIN_FROSTSTAFF", name: "Buz Asası" },
                { id: "2H_FROSTSTAFF", name: "Büyük Buz Asası" },
                { id: "2H_GLACIALSTAFF", name: "Buzul Asası" },
                { id: "MAIN_FROSTSTAFF_KEEPER", name: "Bakıcı Buz Asası" },
                { id: "2H_ICEGAUNTLETS_HELL", name: "Cehennem Buz Eldiveni" },
                { id: "2H_ICECRYSTAL_UNDEAD", name: "Ölümsüz Buz Kristali" },
                { id: "MAIN_FROSTSTAFF_AVALON", name: "Avalon Buz Asası" }
            ],
            "Arcane Staff (Gizem Asası)": [
                { id: "MAIN_ARCANESTAFF", name: "Gizem Asası" },
                { id: "2H_ARCANESTAFF", name: "Büyük Gizem Asası" },
                { id: "2H_ENIGMATICSTAFF", name: "Esrarengiz Asa" },
                { id: "MAIN_ARCANESTAFF_UNDEAD", name: "Ölümsüz Gizem Asası" },
                { id: "2H_ARCANESTAFF_HELL", name: "Cehennem Gizem Asası" },
                { id: "2H_ENIGMATICORB_MORGANA", name: "Morgana Küresi" },
                { id: "MAIN_ARCANESTAFF_AVALON", name: "Avalon Gizem Asası" }
            ],
            "Cursed Staff (Lanetli Asa)": [
                { id: "MAIN_CURSEDSTAFF", name: "Lanetli Asa" },
                { id: "2H_CURSEDSTAFF", name: "Büyük Lanetli Asa" },
                { id: "2H_DEMONICSTAFF", name: "Şeytani Asa" },
                { id: "MAIN_CURSEDSTAFF_UNDEAD", name: "Ölümsüz Lanetli Asa" },
                { id: "2H_SKULLORB_HELL", name: "Cehennem Kafatası Küresi" },
                { id: "2H_CURSEDSTAFF_MORGANA", name: "Morgana Lanetli Asası" },
                { id: "MAIN_CURSEDSTAFF_AVALON", name: "Avalon Lanetli Asası" }
            ]
        },
        "🛡️ Zırhlar (Armor)": {
            "Cloth - Scholar (Bilgin)": [
                { id: "HEAD_CLOTH_SET1", name: "Bilgin Kukuletası" },
                { id: "ARMOR_CLOTH_SET1", name: "Bilgin Cübbesi" },
                { id: "SHOES_CLOTH_SET1", name: "Bilgin Sandaleti" }
            ],
            "Cloth - Cleric (Ruhban)": [
                { id: "HEAD_CLOTH_SET2", name: "Ruhban Kukuletası" },
                { id: "ARMOR_CLOTH_SET2", name: "Ruhban Cübbesi" },
                { id: "SHOES_CLOTH_SET2", name: "Ruhban Sandaleti" }
            ],
            "Cloth - Mage (Büyücü)": [
                { id: "HEAD_CLOTH_SET3", name: "Büyücü Kukuletası" },
                { id: "ARMOR_CLOTH_SET3", name: "Büyücü Cübbesi" },
                { id: "SHOES_CLOTH_SET3", name: "Büyücü Sandaleti" }
            ],
            "Cloth - Druid (Druid)": [
                { id: "HEAD_CLOTH_KEEPER", name: "Druid Kukuletası" },
                { id: "ARMOR_CLOTH_KEEPER", name: "Druid Cübbesi" },
                { id: "SHOES_CLOTH_KEEPER", name: "Druid Sandaleti" }
            ],
            "Cloth - Fiend (Şeytan)": [
                { id: "HEAD_CLOTH_HELL", name: "Cehennem Kukuletası" },
                { id: "ARMOR_CLOTH_HELL", name: "Cehennem Cübbesi" },
                { id: "SHOES_CLOTH_HELL", name: "Cehennem Sandaleti" }
            ],
            "Cloth - Cultist (Tarikatçı)": [
                { id: "HEAD_CLOTH_MORGANA", name: "Morgana Kukuletası" },
                { id: "ARMOR_CLOTH_MORGANA", name: "Morgana Cübbesi" },
                { id: "SHOES_CLOTH_MORGANA", name: "Morgana Sandaleti" }
            ],
            "Cloth - Royal (Kraliyet)": [
                { id: "HEAD_CLOTH_ROYAL", name: "Kraliyet Kukuletası" },
                { id: "ARMOR_CLOTH_ROYAL", name: "Kraliyet Cübbesi" },
                { id: "SHOES_CLOTH_ROYAL", name: "Kraliyet Sandaleti" }
            ],
            "Cloth - Avalon": [
                { id: "HEAD_CLOTH_AVALON", name: "Avalon Kukuletası" },
                { id: "ARMOR_CLOTH_AVALON", name: "Avalon Cübbesi" },
                { id: "SHOES_CLOTH_AVALON", name: "Avalon Sandaleti" }
            ],
            "Leather - Mercenary (Paralı Asker)": [
                { id: "HEAD_LEATHER_SET1", name: "Paralı Asker Kafalığı" },
                { id: "ARMOR_LEATHER_SET1", name: "Paralı Asker Ceketi" },
                { id: "SHOES_LEATHER_SET1", name: "Paralı Asker Ayakkabısı" }
            ],
            "Leather - Hunter (Avcı)": [
                { id: "HEAD_LEATHER_SET2", name: "Avcı Kafalığı" },
                { id: "ARMOR_LEATHER_SET2", name: "Avcı Ceketi" },
                { id: "SHOES_LEATHER_SET2", name: "Avcı Ayakkabısı" }
            ],
            "Leather - Thief (Hırsız)": [
                { id: "HEAD_LEATHER_SET3", name: "Hırsız Kafalığı" },
                { id: "ARMOR_LEATHER_SET3", name: "Hırsız Ceketi" },
                { id: "SHOES_LEATHER_SET3", name: "Hırsız Ayakkabısı" }
            ],
            "Leather - Assassin (Suikastçı)": [
                { id: "HEAD_LEATHER_MORGANA", name: "Morgana Kafalığı" },
                { id: "ARMOR_LEATHER_MORGANA", name: "Morgana Ceketi" },
                { id: "SHOES_LEATHER_MORGANA", name: "Morgana Ayakkabısı" }
            ],
            "Leather - Hellion (Vahşi)": [
                { id: "HEAD_LEATHER_HELL", name: "Cehennem Kafalığı" },
                { id: "ARMOR_LEATHER_HELL", name: "Cehennem Ceketi" },
                { id: "SHOES_LEATHER_HELL", name: "Cehennem Ayakkabısı" }
            ],
            "Leather - Specter (Hayalet)": [
                { id: "HEAD_LEATHER_UNDEAD", name: "Ölümsüz Kafalığı" },
                { id: "ARMOR_LEATHER_UNDEAD", name: "Ölümsüz Ceketi" },
                { id: "SHOES_LEATHER_UNDEAD", name: "Ölümsüz Ayakkabısı" }
            ],
            "Leather - Royal": [
                { id: "HEAD_LEATHER_ROYAL", name: "Kraliyet Kafalığı" },
                { id: "ARMOR_LEATHER_ROYAL", name: "Kraliyet Ceketi" },
                { id: "SHOES_LEATHER_ROYAL", name: "Kraliyet Ayakkabısı" }
            ],
            "Leather - Avalon": [
                { id: "HEAD_LEATHER_AVALON", name: "Avalon Kafalığı" },
                { id: "ARMOR_LEATHER_AVALON", name: "Avalon Ceketi" },
                { id: "SHOES_LEATHER_AVALON", name: "Avalon Ayakkabısı" }
            ],
            "Plate - Soldier (Asker)": [
                { id: "HEAD_PLATE_SET1", name: "Asker Miğferi" },
                { id: "ARMOR_PLATE_SET1", name: "Asker Zırhı" },
                { id: "SHOES_PLATE_SET1", name: "Asker Çizmesi" }
            ],
            "Plate - Knight (Şövalye)": [
                { id: "HEAD_PLATE_SET2", name: "Şövalye Miğferi" },
                { id: "ARMOR_PLATE_SET2", name: "Şövalye Zırhı" },
                { id: "SHOES_PLATE_SET2", name: "Şövalye Çizmesi" }
            ],
            "Plate - Guardian (Muhafız)": [
                { id: "HEAD_PLATE_SET3", name: "Muhafız Miğferi" },
                { id: "ARMOR_PLATE_SET3", name: "Muhafız Zırhı" },
                { id: "SHOES_PLATE_SET3", name: "Muhafız Çizmesi" }
            ],
            "Plate - Graveguard (Mezar Muhafızı)": [
                { id: "HEAD_PLATE_UNDEAD", name: "Ölümsüz Miğferi" },
                { id: "ARMOR_PLATE_UNDEAD", name: "Ölümsüz Zırhı" },
                { id: "SHOES_PLATE_UNDEAD", name: "Ölümsüz Çizmesi" }
            ],
            "Plate - Demon (İblis)": [
                { id: "HEAD_PLATE_HELL", name: "Cehennem Miğferi" },
                { id: "ARMOR_PLATE_HELL", name: "Cehennem Zırhı" },
                { id: "SHOES_PLATE_HELL", name: "Cehennem Çizmesi" }
            ],
            "Plate - Judicator (Yargıç)": [
                { id: "HEAD_PLATE_KEEPER", name: "Yargıç Miğferi" },
                { id: "ARMOR_PLATE_KEEPER", name: "Yargıç Zırhı" },
                { id: "SHOES_PLATE_KEEPER", name: "Yargıç Çizmesi" }
            ],
            "Plate - Royal": [
                { id: "HEAD_PLATE_ROYAL", name: "Kraliyet Miğferi" },
                { id: "ARMOR_PLATE_ROYAL", name: "Kraliyet Zırhı" },
                { id: "SHOES_PLATE_ROYAL", name: "Kraliyet Çizmesi" }
            ],
            "Plate - Avalon": [
                { id: "HEAD_PLATE_AVALON", name: "Avalon Miğferi" },
                { id: "ARMOR_PLATE_AVALON", name: "Avalon Zırhı" },
                { id: "SHOES_PLATE_AVALON", name: "Avalon Çizmesi" }
            ]
        },
        "🎒 Aksesuarlar (Accessories)": {
            "Bags (Çantalar)": [
                { id: "BAG", name: "Çanta" },
                { id: "BAG_INSIGHT", name: "İçgörü Çantası" }
            ],
            "Capes (Pelerinler)": [
                { id: "CAPE", name: "Pelerin" },
                { id: "CAPEITEM_FW_MARTLOCK", name: "Martlock Pelerini" },
                { id: "CAPEITEM_FW_THETFORD", name: "Thetford Pelerini" },
                { id: "CAPEITEM_FW_FORTSTERLING", name: "Fort Sterling Pelerini" },
                { id: "CAPEITEM_FW_LYMHURST", name: "Lymhurst Pelerini" },
                { id: "CAPEITEM_FW_BRIDGEWATCH", name: "Bridgewatch Pelerini" },
                { id: "CAPEITEM_FW_CAERLEON", name: "Caerleon Pelerini" },
                { id: "CAPEITEM_FW_BRECILIEN", name: "Brecilien Pelerini" },
                { id: "CAPEITEM_HERETIC", name: "Heretik Pelerini" },
                { id: "CAPEITEM_UNDEAD", name: "Ölümsüz Pelerin" },
                { id: "CAPEITEM_KEEPER", name: "Bakıcı Pelerini" },
                { id: "CAPEITEM_MORGANA", name: "Morgana Pelerini" },
                { id: "CAPEITEM_DEMON", name: "İblis Pelerini" }
            ]
        },
        "🍖 Sarf Malzemeleri (Consumables)": {
            "Food (Yiyecek)": [
                { id: "MEAL_STEW", name: "Yahni (Stew)" },
                { id: "MEAL_OMELETTE", name: "Omlet" },
                { id: "MEAL_PIE", name: "Turta (Pie)" },
                { id: "MEAL_SALAD", name: "Salata" },
                { id: "MEAL_SANDWICH", name: "Sandviç" },
                { id: "MEAL_ROAST", name: "Kızartma (Roast)" },
                { id: "MEAL_SOUP", name: "Çorba" },
                { id: "MEAL_FISH", name: "Balık Yemeği" },
                { id: "MEAL_GINGERBREAD", name: "Zencefilli Çörek" },
                { id: "MEAL_MEAT", name: "Et Yemeği" }
            ],
            "Potions (İksirler)": [
                { id: "POTION_HEAL", name: "Sağlık İksiri" },
                { id: "POTION_ENERGY", name: "Enerji İksiri" },
                { id: "POTION_POISON", name: "Zehir İksiri" },
                { id: "POTION_INVISIBILITY", name: "Görünmezlik İksiri" },
                { id: "POTION_STONESKIN", name: "Taş Deri İksiri" },
                { id: "POTION_SLOWFIELD", name: "Yavaşlatma İksiri" },
                { id: "POTION_CLEANSE", name: "Arındırma İksiri" },
                { id: "POTION_REVIVE", name: "Canlandırma İksiri" }
            ]
        },
        "⛏️ Gather Araçları": {
            "Tools (Aletler)": [
                { id: "MAIN_SICKLE", name: "Orak (Ot)" },
                { id: "MAIN_SKINNINGKNIFE", name: "Deri Bıçağı" },
                { id: "MAIN_PICKAXE", name: "Kazma (Cevher)" },
                { id: "MAIN_STONEHAMMER", name: "Taş Çekici" },
                { id: "MAIN_AXE", name: "Balta (Ağaç)" },
                { id: "MAIN_FISHINGROD", name: "Olta" }
            ]
        },
        "📦 Ham Malzemeler (Raw Materials)": {
            "Wood (Odun)": [
                { id: "WOOD", name: "Ağaç Kütüğü" },
                { id: "PLANKS", name: "Kalas" }
            ],
            "Hide (Deri)": [
                { id: "HIDE", name: "Ham Deri" },
                { id: "LEATHER", name: "İşlenmiş Deri" }
            ],
            "Stone (Taş)": [
                { id: "ROCK", name: "Taş" },
                { id: "STONEBLOCK", name: "Taş Blok" }
            ],
            "Ore (Cevher)": [
                { id: "ORE", name: "Cevher" },
                { id: "METALBAR", name: "Metal Külçe" }
            ],
            "Fiber (Lif)": [
                { id: "FIBER", name: "Ham Lif" },
                { id: "CLOTH", name: "Kumaş" }
            ]
        },

        "🐟 Balıkçılık (Fishing)": {
            "Fish (Balıklar)": [
                { id: "FISH_FRESHWATER_ALL_COMMON", name: "Tatlısu Balığı (Ortak)" },
                { id: "FISH_FRESHWATER_ALL_RARE", name: "Tatlısu Balığı (Nadir)" },
                { id: "FISH_FRESHWATER_ALL_LEGENDARY", name: "Tatlısu Balığı (Efsanevi)" },
                { id: "FISH_SALTWATER_ALL_COMMON", name: "Tuzlu Su Balığı (Ortak)" },
                { id: "FISH_SALTWATER_ALL_RARE", name: "Tuzlu Su Balığı (Nadir)" },
                { id: "FISH_SALTWATER_ALL_LEGENDARY", name: "Tuzlu Su Balığı (Efsanevi)" }
            ],
            "Bait (Yem)": [
                { id: "FISH_BAIT", name: "Balık Yemi" }
            ]
        },

        "🛡️ İkincil Silah (Off-hand)": {
            "Shields (Kalkanlar)": [
                { id: "OFF_SHIELD", name: "Kalkan" },
                { id: "OFF_TOWERSHIELD_UNDEAD", name: "Kule Kalkanı" },
                { id: "OFF_SHIELD_HELL", name: "Cehennem Kalkanı" },
                { id: "OFF_SPIKEDSHIELD_MORGANA", name: "Morgana Dikenli Kalkanı" },
                { id: "OFF_SHIELD_AVALON", name: "Avalon Kalkanı" }
            ],
            "Books (Kitaplar)": [
                { id: "OFF_BOOK", name: "Büyü Kitabı" },
                { id: "OFF_ORB_MORGANA", name: "Morgana Küresi" },
                { id: "OFF_DEMONSKULL_HELL", name: "Cehennem Kafatası" },
                { id: "OFF_TOTEM_KEEPER", name: "Bakıcı Totemi" },
                { id: "OFF_ORB_AVALON", name: "Avalon Küresi" }
            ],
            "Torches (Meşaleler)": [
                { id: "OFF_TORCH", name: "Meşale" },
                { id: "OFF_HORN_KEEPER", name: "Bakıcı Boynuzu" },
                { id: "OFF_TALISMAN_AVALON", name: "Avalon Tılsımı" }
            ]
        },
        "🐴 Binek (Mounts)": {
            "Basic Mounts": [
                { id: "MOUNT_MULE", name: "Katır" },
                { id: "MOUNT_HORSE", name: "At" },
                { id: "MOUNT_OX", name: "Öküz" },
                { id: "MOUNT_GIANTSTAG", name: "Dev Geyiği" }
            ],
            "Faction Mounts": [
                { id: "MOUNT_FACTION_MARTLOCK", name: "Martlock Bineği" },
                { id: "MOUNT_FACTION_LYMHURST", name: "Lymhurst Bineği" },
                { id: "MOUNT_FACTION_THETFORD", name: "Thetford Bineği" },
                { id: "MOUNT_FACTION_FORTSTERLING", name: "Fort Sterling Bineği" },
                { id: "MOUNT_FACTION_BRIDGEWATCH", name: "Bridgewatch Bineği" }
            ],
            "Special Mounts": [
                { id: "MOUNT_ARMORED_HORSE", name: "Zırhlı At" },
                { id: "MOUNT_SIEGE_BALLISTA", name: "Tahrip Topu" },
                { id: "MOUNT_BATTLE_BEAR", name: "Savaş Ayısı" },
                { id: "MOUNT_MAMMOTH_TRANSPORT", name: "Nakliye Mamutu" },
                { id: "MOUNT_MAMMOTH_BATTLE", name: "Savaş Mamutu" }
            ]
        },

    };

    // Düz liste oluşturucu (geriye uyumluluk için)
    const getAllItemsFlat = () => {
        const items = [];
        const processCategory = (cat) => {
            if (Array.isArray(cat)) {
                items.push(...cat);
            } else if (typeof cat === 'object') {
                Object.values(cat).forEach(subCat => processCategory(subCat));
            }
        };
        Object.values(ARB_CATEGORIES).forEach(cat => processCategory(cat));
        return items;
    };

    // Tüm ana kategori isimlerini getir
    const getMainCategories = () => Object.keys(ARB_CATEGORIES);

    // Guvenli kategori erisim fonksiyonu
    const safeGetCategoryItems = (categoryName) => {
        const catData = ARB_CATEGORIES[categoryName];
        if (!catData) return [];
        return Object.values(catData).flat();
    };

    // Guvenli item bulma fonksiyonu
    const safeFindItem = (itemId) => {
        for (const subCategories of Object.values(ARB_CATEGORIES)) {
            for (const subCat of Object.values(subCategories)) {
                const item = subCat.find(i => i.id === itemId);
                if (item) return item;
            }
        }
        return null;
    };

    // Alt kategorileri getir
    const getSubCategories = (mainCat) => {
        if (!ARB_CATEGORIES[mainCat]) return [];
        return Object.keys(ARB_CATEGORIES[mainCat]);
    };

    // Belirli bir alt kategorideki eşyaları getir
    const getItemsBySubCategory = (mainCat, subCat) => {
        if (!ARB_CATEGORIES[mainCat] || !ARB_CATEGORIES[mainCat][subCat]) return [];
        return ARB_CATEGORIES[mainCat][subCat];
    };

    let arbitrageData = [];
    let arbitrageSort = { by: 'profit', dir: 'desc' };

    let bmData = [];
    let bmSort = { by: 'price', dir: 'desc' };

    let cityDataArray = []; // Artık çoklu item listesi tutacak

    // === AĞIRLIK VE BİNEK SİSTEMİ (MAMUT/ÖKÜZ) ===
    const MOUNT_CAPACITIES = {
        'Mamut (T8)': 25000,
        'Öküz (T8)': 2800,
        'Öküz (T6)': 1400,
        'Bozayı (T7)': 2100
    };
    
    // === REFİNE EŞLEŞTİRİCİSİ ===
    const REFINE_MAPPING = {
        'LOGS': { processed: 'PLANKS', rate: 0.6, focusRate: 0.8 },      // 100 Logs → 60 Planks (focus ile 80)
        'HIDE': { processed: 'LEATHER', rate: 0.6, focusRate: 0.8 },     // 100 Hide → 60 Leather
        'ROCK': { processed: 'STONE_BLOCK', rate: 0.6, focusRate: 0.8 }, // 100 Rock → 60 Stone Block
        'ORE': { processed: 'METALBAR', rate: 0.6, focusRate: 0.8 },     // 100 Ore → 60 Metal Bar
        'FIBER': { processed: 'CLOTH', rate: 0.6, focusRate: 0.8 }       // 100 Fiber → 60 Cloth
    };
    
    let refineData = [];
    let refineSort = { by: 'profit', dir: 'desc' };
    
    let statsData = [];
    let statsFilters = { timeRange: '7d', category: 'ALL', sort: 'sold' };
    
    // === CRAFT EŞLEŞTİRİCİSİ ===
    const CRAFT_MAPPING = {
        // Silah Craft
        'T6_MAIN_SWORD': { materials: { 'T6_METALBAR': 12, 'T6_LEATHER': 8, 'T6_CLOTH': 4 }, craftTime: 1200 },
        'T6_MAIN_BOW': { materials: { 'T6_PLANKS': 15, 'T6_CLOTH': 6 }, craftTime: 1200 },
        'T6_ARMOR_LEATHER_SET1': { materials: { 'T6_LEATHER': 20, 'T6_CLOTH': 8 }, craftTime: 1800 },
        'T6_ARMOR_PLATE_SET1': { materials: { 'T6_METALBAR': 18, 'T6_CLOTH': 6 }, craftTime: 1800 },
        'T6_ARMOR_CLOTH_SET1': { materials: { 'T6_CLOTH': 25 }, craftTime: 1800 },
        // Aksesuar
        'T6_CAPE': { materials: { 'T6_CLOTH': 10, 'T6_LEATHER': 5 }, craftTime: 900 },
        // Gather Tools
        'T6_MAIN_SICKLE': { materials: { 'T6_METALBAR': 8, 'T6_PLANKS': 6 }, craftTime: 900 },
        'T6_MAIN_SKINNINGKNIFE': { materials: { 'T6_METALBAR': 10, 'T6_LEATHER': 4 }, craftTime: 900 },
        'T6_MAIN_PICKAXE': { materials: { 'T6_METALBAR': 12, 'T6_PLANKS': 4 }, craftTime: 900 },
        'T6_MAIN_STONEHAMMER': { materials: { 'T6_METALBAR': 8, 'T6_STONE_BLOCK': 10 }, craftTime: 900 }
    };
    
    let craftData = [];
    let craftSort = { by: 'profit', dir: 'desc' };

    // HTML Skeleton
    container.innerHTML = `
        <div class="flex flex-col h-full p-4 md:p-6 bg-albion-900 animate-fade-in relative w-full">
            
            <!-- Üst Navigasyon Sekmeleri -->
            <div class="flex flex-col lg:flex-row gap-2 mb-6 bg-albion-800 p-2 rounded-lg border border-gray-700 w-full lg:w-max shadow-lg shrink-0">
                <button id="btnTabArbOpp" class="arb-nav-btn flex-1 lg:flex-none px-5 py-2.5 bg-albion-accent text-black font-bold rounded shadow-md transition-colors flex items-center justify-center text-sm md:text-base">
                    <i class="fa-solid fa-sack-dollar mr-2"></i> <span data-i18n="arbitrage-tabOpp">Kâr Fırsatları</span>
                </button>
                <button id="btnTabArbCity" class="arb-nav-btn flex-1 lg:flex-none px-5 py-2.5 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center text-sm md:text-base">
                    <i class="fa-solid fa-city mr-2"></i> <span data-i18n="arbitrage-tabCity">Şehir Kıyaslama</span>
                </button>
                <button id="btnTabArbManual" class="arb-nav-btn flex-1 lg:flex-none px-5 py-2.5 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center text-sm md:text-base">
                    <i class="fa-solid fa-magnifying-glass mr-2"></i> <span data-i18n="arbitrage-tabManual">Manuel Arama</span>
                </button>
                <button id="btnTabArbRefine" class="arb-nav-btn flex-1 lg:flex-none px-5 py-2.5 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center text-sm md:text-base">
                    <i class="fa-solid fa-industry mr-2"></i> <span data-i18n="arbitrage-tabRefine">Refine Hesaplayıcı</span>
                </button>
                <button id="btnTabArbStats" class="arb-nav-btn flex-1 lg:flex-none px-5 py-2.5 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center text-sm md:text-base">
                    <i class="fa-solid fa-chart-bar mr-2"></i> <span data-i18n="arbitrage-tabStats">Satış İstatistikleri</span>
                </button>
                <button id="btnTabArbCraft" class="arb-nav-btn flex-1 lg:flex-none px-5 py-2.5 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center text-sm md:text-base">
                    <i class="fa-solid fa-hammer mr-2"></i> <span data-i18n="arbitrage-tabCraft">Craft Hesaplayıcı</span>
                </button>
                <button id="btnTabArbBM" class="arb-nav-btn flex-1 lg:flex-none px-5 py-2.5 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center text-sm md:text-base">
                    <i class="fa-solid fa-skull mr-2"></i> <span data-i18n="arbitrage-tabBM">BM Talepleri</span>
                </button>
            </div>

            <div class="flex-1 relative flex flex-col min-h-0">
                
                <!-- SEKME 1: Kâr Fırsatları (Sadece Ekipman) -->
                <div id="viewArbOpp" class="arb-view flex flex-col h-full absolute inset-0">
                    <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-6 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center shrink-0">
                        <div>
                            <h2 class="text-xl md:text-2xl font-black text-white flex items-center">
                                <i class="fa-solid fa-sack-dollar text-albion-accent mr-3"></i> Genel Karaborsa Fırsatları
                            </h2>
                            <p class="text-gray-400 text-xs md:text-sm mt-1">Kraliyet şehirlerindeki ucuz ekipmanlar ile Caerleon Black Market arasındaki kâr marjları.</p>
                        </div>
                        <div class="flex flex-wrap gap-2 items-center w-full xl:w-auto">
                            <select id="oppCategory" class="flex-1 xl:flex-none bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm font-bold">
                                <option value="ALL">🌟 Tüm Kategoriler</option>
                            </select>
                            <select id="oppCity" class="flex-1 xl:flex-none bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm font-bold">
                                <option value="ALL">${_('arbitrage-cityAll', 'Tüm Şehirler')}</option>
                                <option value="royal">${_('arbitrage-cityRoyal', 'Kraliyet Şehirleri')}</option>
                                <option value="rest">${_('arbitrage-cityRest', 'Rest Şehirleri')}</option>
                                <option value="LYMHURST">Lymhurst</option>
                                <option value="BRIDGEWATCH">Bridgewatch</option>
                                <option value="FORT_STERLING">Fort Sterling</option>
                                <option value="MARTLOCK">Martlock</option>
                                <option value="THETFORD">Thetford</option>
                                <option value="CAERLEON">Caerleon</option>
                            </select>
                            <select id="oppTier" class="flex-1 xl:flex-none bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm font-bold">
                                <option value="ALL">Tüm Tierlar (Hepsi)</option><option value="4">Tier 4</option><option value="5">Tier 5</option>
                                <option value="6" selected>Tier 6</option><option value="7">Tier 7</option><option value="8">Tier 8</option>
                            </select>
                            <select id="oppEnchant" class="flex-1 xl:flex-none bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm font-bold">
                                <option value="ALL">Tüm Enchantlar (Hepsi)</option>
                                <option value="0" selected>Enchant 0</option><option value="1">Enchant 1 (.1)</option>
                                <option value="2">Enchant 2 (.2)</option><option value="3">Enchant 3 (.3)</option>
                                <option value="4">Enchant 4 (.4)</option>
                            </select>
                            <select id="oppQuality" class="flex-1 xl:flex-none bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm font-bold">
                                <option value="ALL">Tüm Kaliteler</option>
                                <option value="1">Normal</option>
                                <option value="2">İyi</option>
                                <option value="3" selected>Olağanüstü</option>
                                <option value="4">Mükemmel</option>
                                <option value="5">Şaheser</option>
                            </select>
                            <button id="btnFetchOpp" class="w-full xl:w-auto bg-albion-accent hover:bg-albion-accent_hover text-black px-4 py-2.5 rounded-lg font-black transition-colors flex justify-center items-center shadow-md uppercase text-sm tracking-wider">
                                <i class="fa-solid fa-rotate-right mr-2"></i> ${_('arbitrage-oppFetch', 'Tara')}
                            </button>
                        </div>
                    </div>
                    <div class="flex-1 bg-albion-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden flex flex-col relative">
                        <div id="oppLoading" class="hidden absolute inset-0 bg-albion-800/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                            <i class="fa-solid fa-circle-notch fa-spin text-4xl md:text-5xl text-albion-accent mb-4"></i>
                            <span class="text-white font-black tracking-widest uppercase text-sm md:text-lg">${_('arbitrage-loading', 'Veriler Çekiliyor...')}</span>
                        </div>
                        <div class="overflow-x-auto flex-1 custom-scroll">
                            <table class="w-full text-left text-gray-300 min-w-[700px]">
                                <thead class="bg-[#0a0d14] border-b border-gray-700 text-xs uppercase text-gray-400 sticky top-0 z-10" id="oppHeaders">
                                    <tr>
                                        <th class="p-4 font-bold cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="name">Eşya <i class="fa-solid fa-sort text-gray-600 ml-1 sort-icon"></i></th>
                                        <th class="p-4 font-bold cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="buy">Alış (Şehir) <i class="fa-solid fa-sort text-gray-600 ml-1 sort-icon"></i></th>
                                        <th class="p-4 font-bold cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="sell">Satış (Karaborsa) <i class="fa-solid fa-sort text-gray-600 ml-1 sort-icon"></i></th>
                                        <th class="p-4 font-bold cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="recency">Son Veri <i class="fa-solid fa-sort text-gray-600 ml-1 sort-icon"></i></th>
                                        <th class="p-4 font-bold text-right cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="profit">Net Kâr <i class="fa-solid fa-sort-down text-albion-accent ml-1 sort-icon"></i></th>
                                    </tr>
                                </thead>
                                <tbody id="oppTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- SEKME 2: Şehir Kıyaslama -->
                <div id="viewArbCity" class="arb-view hidden flex-col h-full absolute inset-0">
                    <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-6 flex flex-col shrink-0">
                        <div class="mb-4">
                            <h2 class="text-xl md:text-2xl font-black text-white flex items-center">
                                <i class="fa-solid fa-city text-albion-accent mr-3"></i> <span data-i18n="arbitrage-cityTitle">Şehir Kıyaslama Tablosu</span>
                            </h2>
                            <p class="text-gray-400 text-xs md:text-sm mt-1" data-i18n="arbitrage-cityDesc">Seçtiğiniz kriterlerdeki tüm eşyaların şehirlerdeki Alış (Buy) ve Satış (Sell) emirlerini kıyaslayın.</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-3 items-end">
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-400 font-bold mb-1">Kategori</label>
                                <select id="cityCategory" class="bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm"></select>
                            </div>
                            <div class="flex flex-col lg:col-span-2">
                                <label class="text-xs text-gray-400 font-bold mb-1">Eşya Tipi</label>
                                <select id="cityItem" class="bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm"></select>
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-400 font-bold mb-1">Tier / Enchant</label>
                                <div class="flex gap-2">
                                    <select id="cityTier" class="w-1/2 bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm">
                                        <option value="ALL">Hepsi</option><option value="4">T4</option> <option value="5">T5</option> <option value="6" selected>T6</option> <option value="7">T7</option> <option value="8">T8</option>
                                    </select>
                                    <select id="cityEnchant" class="w-1/2 bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm">
                                        <option value="ALL">Hepsi</option><option value="0" selected>.0</option> <option value="1">.1</option> <option value="2">.2</option> <option value="3">.3</option> <option value="4">.4</option>
                                    </select>
                                </div>
                            </div>
                            <button id="btnFetchCity" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-black transition-colors shadow-md h-[42px] flex items-center justify-center uppercase text-sm tracking-wider">
                                <i class="fa-solid fa-search mr-2"></i> Ara
                            </button>
                        </div>
                        
                        <!-- Renk Legend -->
                        <div class="mt-3 flex flex-wrap gap-3 text-xs bg-blue-500/10 border border-blue-500/30 p-2 rounded">
                            <div class="flex items-center gap-1.5">
                                <span class="inline-block w-3 h-3 rounded bg-green-500"></span>
                                <span class="text-gray-300 font-bold">Yeşil =</span>
                                <span class="text-green-400">Alış Fiyatı (Buy Order)</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="inline-block w-3 h-3 rounded bg-red-500"></span>
                                <span class="text-gray-300 font-bold">Kırmızı =</span>
                                <span class="text-red-400">Satış Fiyatı (Sell Order)</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="inline-block w-3 h-3 rounded bg-yellow-500"></span>
                                <span class="text-gray-300 font-bold">Sarı =</span>
                                <span class="text-yellow-400">Kâr Fırsatı!</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 bg-albion-800 border border-gray-700 rounded-xl shadow-lg relative p-0 overflow-hidden flex flex-col">
                        <div id="cityLoading" class="hidden absolute inset-0 bg-albion-800/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                            <i class="fa-solid fa-circle-notch fa-spin text-5xl text-blue-400 mb-4"></i>
                            <span class="text-white font-bold tracking-widest uppercase">Pazar Verileri Derleniyor...</span>
                        </div>
                        <div class="overflow-x-auto flex-1 custom-scroll" id="cityResultArea">
                            <table class="w-full text-left text-gray-300 min-w-[1600px]">
                                <thead class="bg-[#0a0d14] border-b-2 border-blue-500/50 text-xs uppercase text-gray-400 sticky top-0 z-10" id="cityHeaders">
                                    <tr>
                                        <th class="p-3 font-bold border-r border-gray-800/50 sticky left-0 bg-[#0a0d14] z-20">Eşya</th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Lymhurst<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Bridgewatch<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Fort Sterling<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Martlock<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Thetford<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Caerleon<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center bg-yellow-500/10 text-yellow-400">En Yüksek Kâr<br><span class="text-[9px] font-normal normal-case">Nereden → Nereye</span></th>
                                    </tr>
                                </thead>
                                <tbody id="cityTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- SEKME 3: Kategori Tabanlı Universal Arama -->
                <div id="viewArbManual" class="arb-view hidden flex-col h-full absolute inset-0">
                    <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-4 flex flex-col shrink-0">
                        <div class="mb-4">
                            <h2 class="text-xl md:text-2xl font-black text-white flex items-center">
                                <i class="fa-solid fa-layer-group text-purple-400 mr-3"></i> Kategori Tabanlı Market Arama
                            </h2>
                            <p class="text-gray-400 text-xs md:text-sm mt-1">Tüm kategorilerden, tüm tier ve kalitelerdeki eşyaları arayın. Tüm şehirlerdeki fiyatları karşılaştırın!</p>
                        </div>
                        
                        <!-- Filtreler Grid -->
                        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                            <!-- Ana Kategori -->
                            <div class="flex flex-col">
                                <label class="text-[10px] text-gray-400 font-bold mb-1 uppercase">Ana Kategori</label>
                                <select id="manualMainCategory" class="bg-albion-900 border border-gray-600 rounded-lg p-2 text-white focus:border-purple-500 outline-none text-sm">
                                    <option value="ALL">🌟 Tüm Kategoriler</option>
                                </select>
                            </div>
                            <!-- Alt Kategori -->
                            <div class="flex flex-col">
                                <label class="text-[10px] text-gray-400 font-bold mb-1 uppercase">Alt Kategori</label>
                                <select id="manualSubCategory" class="bg-albion-900 border border-gray-600 rounded-lg p-2 text-white focus:border-purple-500 outline-none text-sm">
                                    <option value="ALL">📁 Tümü</option>
                                </select>
                            </div>
                            <!-- Eşya -->
                            <div class="flex flex-col lg:col-span-2">
                                <label class="text-[10px] text-gray-400 font-bold mb-1 uppercase">Eşya</label>
                                <select id="manualItem" class="bg-albion-900 border border-gray-600 rounded-lg p-2 text-white focus:border-purple-500 outline-none text-sm">
                                    <option value="ALL">🔹 Tüm Eşyalar</option>
                                </select>
                            </div>
                            <!-- Tier -->
                            <div class="flex flex-col">
                                <label class="text-[10px] text-gray-400 font-bold mb-1 uppercase">Tier</label>
                                <select id="manualTier" class="bg-albion-900 border border-gray-600 rounded-lg p-2 text-white focus:border-purple-500 outline-none text-sm">
                                    <option value="ALL">Tümü (T4-T8)</option>
                                    <option value="4">Tier 4</option>
                                    <option value="5">Tier 5</option>
                                    <option value="6" selected>Tier 6</option>
                                    <option value="7">Tier 7</option>
                                    <option value="8">Tier 8</option>
                                </select>
                            </div>
                            <!-- Enchant -->
                            <div class="flex flex-col">
                                <label class="text-[10px] text-gray-400 font-bold mb-1 uppercase">Enchant</label>
                                <select id="manualEnchant" class="bg-albion-900 border border-gray-600 rounded-lg p-2 text-white focus:border-purple-500 outline-none text-sm">
                                    <option value="ALL">Tümü (.0-.4)</option>
                                    <option value="0" selected>.0 (Normal)</option>
                                    <option value="1">.1 (Nadir)</option>
                                    <option value="2">.2 (Eşsiz)</option>
                                    <option value="3">.3 (Olağanüstü)</option>
                                    <option value="4">.4 (Efsanevi)</option>
                                </select>
                            </div>
                            <!-- Kalite -->
                            <div class="flex flex-col">
                                <label class="text-[10px] text-gray-400 font-bold mb-1 uppercase">Kalite</label>
                                <select id="manualQuality" class="bg-albion-900 border border-gray-600 rounded-lg p-2 text-white focus:border-purple-500 outline-none text-sm">
                                    <option value="ALL">Tüm Kaliteler</option>
                                    <option value="1">Normal</option>
                                    <option value="2">İyi</option>
                                    <option value="3" selected>Olağanüstü</option>
                                    <option value="4">Mükemmel</option>
                                    <option value="5">Şaheser</option>
                                </select>
                            </div>
                            <!-- Şehir Filtresi -->
                            <div class="flex flex-col">
                                <label class="text-[10px] text-gray-400 font-bold mb-1 uppercase">Şehir</label>
                                <select id="manualCity" class="bg-albion-900 border border-gray-600 rounded-lg p-2 text-white focus:border-purple-500 outline-none text-sm">
                                    <option value="ALL">Tüm Şehirler</option>
                                    <option value="LYMHURST">Lymhurst</option>
                                    <option value="BRIDGEWATCH">Bridgewatch</option>
                                    <option value="FORT_STERLING">Fort Sterling</option>
                                    <option value="MARTLOCK">Martlock</option>
                                    <option value="THETFORD">Thetford</option>
                                    <option value="CAERLEON">Caerleon</option>
                                </select>
                            </div>
                            <!-- Arama Butonu -->
                            <div class="flex flex-col justify-end">
                                <button id="btnManualSearch" class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-md flex items-center justify-center h-[38px]">
                                    <i class="fa-solid fa-search mr-2"></i> Ara
                                </button>
                            </div>
                        </div>
                        
                        <!-- Legend -->
                        <div class="flex flex-wrap gap-3 text-xs bg-purple-500/10 border border-purple-500/30 p-2 rounded">
                            <div class="flex items-center gap-1.5">
                                <span class="inline-block w-3 h-3 rounded bg-green-500"></span>
                                <span class="text-gray-300 font-bold">Yeşil =</span>
                                <span class="text-green-400">Satış Fiyatı (Satin Al)</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="inline-block w-3 h-3 rounded bg-red-500"></span>
                                <span class="text-gray-300 font-bold">Kırmızı =</span>
                                <span class="text-red-400">Alış Fiyatı (Anında Sat)</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="inline-block w-3 h-3 rounded bg-yellow-500"></span>
                                <span class="text-gray-300 font-bold">Sarı =</span>
                                <span class="text-yellow-400">Kâr Fırsatı!</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 bg-albion-800 border border-gray-700 rounded-xl shadow-lg relative p-0 overflow-hidden flex flex-col">
                        <div id="manualLoading" class="hidden absolute inset-0 bg-albion-800/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                            <i class="fa-solid fa-circle-notch fa-spin text-5xl text-purple-400 mb-4"></i>
                            <span class="text-white font-bold tracking-widest uppercase">Pazarlar Aranıyor...</span>
                        </div>
                        <div class="overflow-y-auto flex-1 custom-scroll p-4" id="manualSearchResults">
                            <div class="text-center text-gray-500 mt-20">
                                <i class="fa-solid fa-layer-group text-6xl mb-4 opacity-30"></i>
                                <p class="text-lg font-bold">Kategori seçerek aramaya başlayın</p>
                                <p class="text-sm mt-2">Tüm şehirlerdeki fiyatları karşılaştırıp en kârlı fırsatları göstereceğim!</p>
                                <div class="mt-4 flex flex-wrap justify-center gap-2">
                                    <span class="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">Tüm Tierler (T4-T8)</span>
                                    <span class="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">Tüm Enchantlar (.0-.4)</span>
                                    <span class="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">Tüm Kaliteler</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SEKME 4: Refine Hesaplayıcı -->
                <div id="viewArbRefine" class="arb-view hidden flex-col h-full absolute inset-0">
                    <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-6 flex flex-col shrink-0">
                        <div class="mb-4">
                            <h2 class="text-xl md:text-2xl font-black text-white flex items-center">
                                <i class="fa-solid fa-industry text-orange-500 mr-3"></i> Refine Kâr Hesaplayıcı
                            </h2>
                            <p class="text-gray-400 text-xs md:text-sm mt-1">Ham malzeme al → Refine et → İşlenmiş olarak sat = KÂR! Focus kullanmadan ve kullanarak kârı hesapla.</p>
                        </div>
                        
                        <!-- Bilgi Kutusu -->
                        <div class="mb-4 bg-orange-500/10 border border-orange-500/30 p-3 rounded-lg">
                            <div class="text-orange-400 font-bold text-xs mb-2"><i class="fa-solid fa-lightbulb mr-1"></i> REFİNE ORANLARI</div>
                            <div class="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                                <div class="bg-gray-800/50 p-2 rounded text-center">
                                    <div class="text-gray-400">🌳 Ağaç</div>
                                    <div class="text-white font-bold mt-1">100 → 60</div>
                                    <div class="text-green-400 text-[9px]">Focus: 80</div>
                                </div>
                                <div class="bg-gray-800/50 p-2 rounded text-center">
                                    <div class="text-gray-400">🐄 Deri</div>
                                    <div class="text-white font-bold mt-1">100 → 60</div>
                                    <div class="text-green-400 text-[9px]">Focus: 80</div>
                                </div>
                                <div class="bg-gray-800/50 p-2 rounded text-center">
                                    <div class="text-gray-400">🪨 Taş</div>
                                    <div class="text-white font-bold mt-1">100 → 60</div>
                                    <div class="text-green-400 text-[9px]">Focus: 80</div>
                                </div>
                                <div class="bg-gray-800/50 p-2 rounded text-center">
                                    <div class="text-gray-400">⛏️ Cevher</div>
                                    <div class="text-white font-bold mt-1">100 → 60</div>
                                    <div class="text-green-400 text-[9px]">Focus: 80</div>
                                </div>
                                <div class="bg-gray-800/50 p-2 rounded text-center">
                                    <div class="text-gray-400">🌾 Lif</div>
                                    <div class="text-white font-bold mt-1">100 → 60</div>
                                    <div class="text-green-400 text-[9px]">Focus: 80</div>
                                </div>
                            </div>
                        </div>
                        
                        <button id="btnFetchRefine" class="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-lg font-black transition-colors shadow-md h-[42px] flex items-center justify-center uppercase text-sm tracking-wider">
                            <i class="fa-solid fa-calculator mr-2"></i> En Kârlı Refine İşlemlerini Hesapla
                        </button>
                    </div>
                    
                    <div id="refineLoading" class="hidden flex-1 items-center justify-center">
                        <div class="text-center"><i class="fa-solid fa-spinner fa-spin text-4xl text-albion-accent"></i><p class="text-white font-bold mt-3 animate-pulse">Refine kârı hesaplanıyor...</p></div>
                    </div>
                    
                    <div id="refineResultArea" class="hidden flex-1 overflow-y-auto custom-scroll">
                        <div class="overflow-x-auto rounded-xl border border-gray-700">
                            <table class="w-full text-left border-collapse">
                                <thead id="refineHeaders"></thead>
                                <tbody id="refineTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- SEKME 5: Satış İstatistikleri -->
                <div id="viewArbStats" class="arb-view hidden flex-col h-full absolute inset-0">
                    <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-6 flex flex-col shrink-0">
                        <div class="mb-4">
                            <h2 class="text-xl md:text-2xl font-black text-white flex items-center">
                                <i class="fa-solid fa-chart-line text-purple-500 mr-3"></i> Satış İstatistikleri & Analiz
                            </h2>
                            <p class="text-gray-400 text-xs md:text-sm mt-1">Hangi eşyalar ne kadar satıldı? 1 saat, 1 hafta, 1 aylık analiz ile en çok satılanları keşfet!</p>
                        </div>
                        
                        <!-- Filtreler -->
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-400 font-bold mb-1">Zaman Aralığı</label>
                                <select id="statsTimeRange" class="bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm">
                                    <option value="1h">Son 1 Saat</option>
                                    <option value="24h">Son 24 Saat</option>
                                    <option value="7d" selected>Son 7 Gün</option>
                                    <option value="30d">Son 30 Gün</option>
                                </select>
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-400 font-bold mb-1">Kategori</label>
                                <select id="statsCategory" class="bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm">
                                    <option value="ALL">Tüm Kategoriler</option>
                                    <option value="Weapons">Silahlar</option>
                                    <option value="Armor">Zırhlar</option>
                                    <option value="Gather">Gather Malzemeleri</option>
                                    <option value="Consumables">Sarf Malzemeleri</option>
                                </select>
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-400 font-bold mb-1">Sıralama</label>
                                <select id="statsSort" class="bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm">
                                    <option value="sold">En Çok Satan</option>
                                    <option value="revenue">En Yüksek Gelir</option>
                                    <option value="avgPrice">Ortalama Fiyat</option>
                                </select>
                            </div>
                            <button id="btnFetchStats" class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg font-black transition-colors shadow-md h-[42px] flex items-center justify-center uppercase text-sm tracking-wider">
                                <i class="fa-solid fa-chart-pie mr-2"></i> Analiz Et
                            </button>
                        </div>
                        
                        <!-- Özet Kartları -->
                        <div id="statsSummaryCards" class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 hidden">
                            <div class="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg p-3">
                                <div class="text-blue-400 text-[10px] font-bold uppercase">Toplam Satış</div>
                                <div class="text-white font-black text-xl mt-1" id="statsTotalSold">-</div>
                            </div>
                            <div class="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg p-3">
                                <div class="text-green-400 text-[10px] font-bold uppercase">Toplam Gelir</div>
                                <div class="text-white font-black text-xl mt-1" id="statsTotalRevenue">-</div>
                            </div>
                            <div class="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg p-3">
                                <div class="text-purple-400 text-[10px] font-bold uppercase">En Popüler</div>
                                <div class="text-white font-bold text-sm mt-1 truncate" id="statsTopItem">-</div>
                            </div>
                            <div class="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-lg p-3">
                                <div class="text-orange-400 text-[10px] font-bold uppercase">Ortalama Fiyat</div>
                                <div class="text-white font-black text-xl mt-1" id="statsAvgPrice">-</div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="statsLoading" class="hidden flex-1 items-center justify-center">
                        <div class="text-center"><i class="fa-solid fa-spinner fa-spin text-4xl text-purple-500"></i><p class="text-white font-bold mt-3 animate-pulse">İstatistikler analiz ediliyor...</p></div>
                    </div>
                    
                    <div id="statsResultArea" class="hidden flex-1 overflow-y-auto custom-scroll">
                        <div class="overflow-x-auto rounded-xl border border-gray-700">
                            <table class="w-full text-left border-collapse">
                                <thead id="statsHeaders"></thead>
                                <tbody id="statsTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- SEKME 6: Craft Hesaplayıcı -->
                <div id="viewArbCraft" class="arb-view hidden flex-col h-full absolute inset-0">
                    <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-6 flex flex-col shrink-0">
                        <div class="mb-4">
                            <h2 class="text-xl md:text-2xl font-black text-white flex items-center">
                                <i class="fa-solid fa-hammer text-amber-500 mr-3"></i> Craft Kâr Hesaplayıcı
                            </h2>
                            <p class="text-gray-400 text-xs md:text-sm mt-1">Eşya craft et, malzeme maliyetini hesapla, en kârlı craft işlemini bul! Craft puanını da artır.</p>
                        </div>
                        
                        <!-- Bilgi Kutusu -->
                        <div class="mb-4 bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg">
                            <div class="text-amber-400 font-bold text-xs mb-2"><i class="fa-solid fa-lightbulb mr-1"></i> CRAFT AVANTAJLARI</div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                <div class="bg-gray-800/50 p-2 rounded">
                                    <div class="text-amber-400 font-bold mb-1">💰 KÂR</div>
                                    <div class="text-gray-300">Kendi eşyanı üret, daha ucuza mal et</div>
                                </div>
                                <div class="bg-gray-800/50 p-2 rounded">
                                    <div class="text-amber-400 font-bold mb-1">⭐ CRAFT PUANI</div>
                                    <div class="text-gray-300">Her craft, focus ile daha yüksek kalite</div>
                                </div>
                                <div class="bg-gray-800/50 p-2 rounded">
                                    <div class="text-amber-400 font-bold mb-1">📊 PİYASA</div>
                                    <div class="text-gray-300">Doğru yere doğru eşyayı götür</div>
                                </div>
                            </div>
                        </div>
                        
                        <button id="btnFetchCraft" class="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-lg font-black transition-colors shadow-md h-[42px] flex items-center justify-center uppercase text-sm tracking-wider">
                            <i class="fa-solid fa-calculator mr-2"></i> En Kârlı Craft İşlemlerini Hesapla
                        </button>
                    </div>
                    
                    <div id="craftLoading" class="hidden flex-1 items-center justify-center">
                        <div class="text-center"><i class="fa-solid fa-spinner fa-spin text-4xl text-amber-500"></i><p class="text-white font-bold mt-3 animate-pulse">Craft kârı hesaplanıyor...</p></div>
                    </div>
                    
                    <div id="craftResultArea" class="hidden flex-1 overflow-y-auto custom-scroll">
                        <div class="overflow-x-auto rounded-xl border border-gray-700">
                            <table class="w-full text-left border-collapse">
                                <thead id="craftHeaders"></thead>
                                <tbody id="craftTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- SEKME 7: Black Market Talepleri -->
                <div id="viewArbBM" class="arb-view hidden flex-col h-full absolute inset-0">
                    <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-6 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center shrink-0">
                        <div>
                            <h2 class="text-xl md:text-2xl font-black text-white flex items-center">
                                <i class="fa-solid fa-skull text-red-500 mr-3"></i> Black Market Talepleri
                            </h2>
                            <p class="text-gray-400 text-xs md:text-sm mt-1">Black Market'in anlık en yüksek alım emirlerini (Buy Orders) görün.</p>
                        </div>
                        <div class="flex flex-wrap gap-2 items-center w-full xl:w-auto">
                            <select id="bmCategory" class="flex-1 xl:flex-none bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm font-bold"></select>
                            <select id="bmTier" class="flex-1 xl:flex-none bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm font-bold">
                                <option value="ALL">Tüm Tierlar (Hepsi)</option><option value="4">Tier 4</option> <option value="5">Tier 5</option> <option value="6" selected>Tier 6</option> <option value="7">Tier 7</option> <option value="8">Tier 8</option>
                            </select>
                            <select id="bmEnchant" class="flex-1 xl:flex-none bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm font-bold">
                                <option value="ALL">Tüm Enchantlar (Hepsi)</option><option value="0" selected>Enchant 0</option> <option value="1">Enchant 1 (.1)</option> <option value="2">Enchant 2 (.2)</option> <option value="3">Enchant 3 (.3)</option>
                            </select>
                            <button id="btnFetchBM" class="w-full xl:w-auto bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-lg font-black transition-colors shadow-md flex justify-center items-center text-sm uppercase tracking-wider">
                                <i class="fa-solid fa-cloud-arrow-down mr-2"></i> Çek
                            </button>
                        </div>
                    </div>
                    <div class="flex-1 bg-albion-800 border border-gray-700 rounded-xl shadow-lg relative p-0 overflow-hidden flex flex-col">
                        <div id="bmLoading" class="hidden absolute inset-0 bg-albion-800/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                            <i class="fa-solid fa-circle-notch fa-spin text-5xl text-red-400 mb-4"></i>
                            <span class="text-white font-bold tracking-widest uppercase">BM Verileri Çekiliyor...</span>
                        </div>
                        <div class="overflow-x-auto flex-1 custom-scroll">
                            <table class="w-full text-left text-gray-300 min-w-[500px]">
                                <thead class="bg-[#0a0d14] border-b border-gray-700 text-xs uppercase text-gray-400 sticky top-0 z-10" id="bmHeaders">
                                    <tr>
                                        <th class="p-4 font-bold cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="name">Eşya <i class="fa-solid fa-sort text-gray-600 ml-1 sort-icon"></i></th>
                                        <th class="p-4 font-bold cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="quality">Kalite <i class="fa-solid fa-sort text-gray-600 ml-1 sort-icon"></i></th>
                                        <th class="p-4 font-bold cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="price">En Yüksek Alış <i class="fa-solid fa-sort-down text-albion-accent ml-1 sort-icon"></i></th>
                                        <th class="p-4 font-bold text-right cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="recency">Son Veri <i class="fa-solid fa-sort text-gray-600 ml-1 sort-icon"></i></th>
                                    </tr>
                                </thead>
                                <tbody id="bmTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    // --- Core Helpers ---
    const getMins = (dStr) => {
        if(!dStr || dStr.startsWith("0001")) return 999999;
        const d = new Date(dStr + "Z");
        return Math.floor((new Date() - d) / 60000);
    };

    const getTimeAgoStr = (maxMins) => {
        if(maxMins > 100000) return `<span class="text-gray-600 italic font-medium">Bilinmiyor</span>`;
        if(maxMins < 2) return `<span class="text-green-400 font-bold">Şimdi</span>`;
        if(maxMins < 60) return `<span class="text-green-300 font-semibold">${maxMins} dk önce</span>`;
        return `<span class="text-yellow-500/80 font-semibold">${Math.floor(maxMins/60)} sa. önce</span>`;
    };

    const getQualityHtml = (q) => {
        const map = { 
           1: {n: 'Normal', c: 'text-gray-400 border-gray-600'}, 
           2: {n: 'İyi', c: 'text-green-400 border-green-600/50'}, 
           3: {n: 'Sıradışı', c: 'text-blue-400 border-blue-600/50'}, 
           4: {n: 'Mükemmel', c: 'text-purple-400 border-purple-600/50'}, 
           5: {n: 'Şaheser', c: 'text-yellow-400 border-yellow-500/50 shadow-[0_0_8px_rgba(234,179,8,0.3)]'} 
        };
        const dt = map[q] || map[1];
        return `<span class="bg-gray-800 border ${dt.c} px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">${dt.n}</span>`;
    };

    const getEnchantBadge = (itemId) => {
        const match = itemId.match(/@(\\d+)/);
        if(!match) return '';
        const e = parseInt(match[1]);
        let bgClass = 'bg-gray-700 text-white', borderClass = 'border-gray-500';
        if (e === 1) { bgClass = 'bg-green-600 text-white'; borderClass = 'border-green-500/50'; }
        if (e === 2) { bgClass = 'bg-blue-500 text-white'; borderClass = 'border-blue-400/50'; }
        if (e === 3) { bgClass = 'bg-purple-500 text-white'; borderClass = 'border-purple-400/50'; }
        if (e === 4) { bgClass = 'bg-yellow-500 text-black'; borderClass = 'border-yellow-400/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]'; }
        return `<div class="absolute -bottom-1 -right-1 ${bgClass} text-[10px] font-black px-1.5 py-0.5 rounded border border-black shadow-lg z-10">.${e}</div>`;
    };

    // Dinamik ID Üretici
    const generateItemIds = (baseItem, tierOpt, enchantOpt) => {
        // Eğer baseItem zaten tier prefix'i içeriyorsa (T4_, T5_, vb.)
        const alreadyHasTier = /^T\\d+_/.test(baseItem);
        
        const isTierless = (baseItem === "QUESTITEM_TOKEN_SIPHONED_ENERGY" || baseItem === "QUESTITEM_TOKEN_AVALON");
        const isEnchantless = ["QUESTITEM_TOKEN_ROYAL", "RUNE", "SOUL", "RELIC", "SHARD_AVALONIAN", "ESSENCE"].includes(baseItem);

        if (isTierless) return [baseItem];
        if (alreadyHasTier) return [baseItem]; // Zaten formatlanmış

        const tiers = tierOpt === 'ALL' ? [4, 5, 6, 7, 8] : [parseInt(tierOpt)];
        const enchants = enchantOpt === 'ALL' ? [0, 1, 2, 3, 4] : [parseInt(enchantOpt)];

        const results = [];
        tiers.forEach(t => {
            if (isEnchantless) {
                results.push(`T${t}_${baseItem}`);
            } else {
                enchants.forEach(e => {
                    const eSuffix = e === 0 ? '' : `@${e}`;
                    results.push(`T${t}_${baseItem}${eSuffix}`);
                });
            }
        });
        return results;
    };

    const getItemsToFetch = (baseItems, tierOpt, enchantOpt) => {
        let items = [];
        baseItems.forEach(b => {
            items = items.concat(generateItemIds(b, tierOpt, enchantOpt));
        });
        return [...new Set(items)]; // Benzersiz liste
    };

    const formatItemName = (itemId) => {
        let tMatch = itemId.match(/^T(\d+)/); 
        let tNum = tMatch ? parseInt(tMatch[1]) : 0;
        let tStr = tMatch ? `T${tMatch[1]}` : '';
        
        let eMatch = itemId.match(/@(\d+)$/);
        let e = eMatch ? `.${eMatch[1]}` : '';
        let b = itemId.replace(/^T\d+_/, '').replace(/@\d+$/, '');
        
        if (itemId === "QUESTITEM_TOKEN_SIPHONED_ENERGY") return "Özümlenmiş Enerji";
        if (itemId === "QUESTITEM_TOKEN_AVALON") return "Avalon Enerjisi";

        let foundName = b.replace(/_/g, ' ');
        
        // 1. AO_ITEMS'tan Türkçe ismini bul (Varsa)
        if (window.AO_ITEMS) {
            const itemData = window.AO_ITEMS.find(i => i.id === b);
            if (itemData && itemData.tr) {
                foundName = itemData.tr;
            }
        } else if (window.AOT_DATA && window.AOT_DATA.locales && window.AOT_DATA.locales[b]) {
            foundName = window.AOT_DATA.locales[b];
        } else {
            // Fallback: ARB_CATEGORIES
            const findItemName = (categories, baseId) => {
                for (const cat of Object.values(categories)) {
                    if (typeof cat === 'object' && !Array.isArray(cat)) {
                        const result = findItemName(cat, baseId);
                        if (result) return result;
                    } else if (Array.isArray(cat)) {
                        const item = cat.find(i => i.id === baseId);
                        if (item) return item.name;
                    }
                }
                return null;
            };
            const nameFromCat = findItemName(ARB_CATEGORIES, b);
            if (nameFromCat) foundName = nameFromCat;
        }
        
        // Eğer Türkçe isimde Tier ön eki varsa, doğru tier ön ekini koy
        const tierPrefixes = ["Tecrübesiz ", "Acemi ", "Kalfa ", "Ehil ", "Uzman ", "Usta ", "Büyük Usta ", "Büyük usta ", "Yüce "];
        let hasTierPrefix = false;
        
        for (let prefix of tierPrefixes) {
            if (foundName.startsWith(prefix)) {
                foundName = foundName.substring(prefix.length); // Ön eki kaldır
                hasTierPrefix = true;
                break;
            }
        }
        
        // Eğer bir ön ek kaldırıldıysa (silah/zırh), hedef tier'in ön ekini ekle
        if (tNum > 0 && hasTierPrefix) {
            let newPrefix = "";
            switch (tNum) {
                case 1: newPrefix = "Tecrübesiz "; break;
                case 2: newPrefix = "Acemi "; break;
                case 3: newPrefix = "Kalfa "; break;
                case 4: newPrefix = "Ehil "; break;
                case 5: newPrefix = "Uzman "; break;
                case 6: newPrefix = "Usta "; break;
                case 7: newPrefix = "Büyük Usta "; break;
                case 8: newPrefix = "Yüce "; break;
            }
            return `${newPrefix}${foundName}${e}`.trim();
        }
        
        // Ön ek yoksa (Örn: "Havuçlar", "Ağaç Kütüğü")
        if (tNum > 0 && !hasTierPrefix && !foundName.startsWith("T" + tNum)) {
            return `${tStr} ${foundName}${e}`.trim();
        }
        
        return `${foundName}${e}`.trim();
    };

    // Parçalara (Chunk) ayırarak çoklu eşya verisi çeken yeni ana fonksiyon
    async function fetchPricesInChunks(items, params = '') {
        if (!items || items.length === 0) return [];
        const chunkSize = 100; // Albion API URL limitini aşmamak için güvenli sayı
        const chunks = [];
        for (let i = 0; i < items.length; i += chunkSize) {
            chunks.push(items.slice(i, i + chunkSize));
        }

        const domain = window.getAlbionApiDomain ? window.getAlbionApiDomain() : 'europe.albion-online-data.com';
        let allData = [];

        // Throttle requests to avoid rate limits
        const maxConcurrent = 5;
        for (let i = 0; i < chunks.length; i += maxConcurrent) {
            const batch = chunks.slice(i, i + maxConcurrent);
            await Promise.all(batch.map(async (chunk) => {
                let p = params ? (params.startsWith('?') ? params : '?' + params) : '';
                const url = `https://${domain}/api/v2/stats/prices/${chunk.join(',')}.json${p}`;
                try {
                    const data = await window.fetchWithProxies(url);
                    if (Array.isArray(data)) {
                        allData = allData.concat(data);
                    }
                } catch (e) {
                    console.error("Fetch chunk failed", e);
                }
            }));
            if (i + maxConcurrent < chunks.length) {
                await new Promise(r => setTimeout(r, 200)); // Small delay between batches
            }
        }

        return allData;
    }

    // --- Tab Switching ---
    const navBtns = document.querySelectorAll('.arb-nav-btn');
    const views = document.querySelectorAll('.arb-view');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => {
                b.classList.remove('bg-albion-accent', 'text-black');
                b.classList.add('bg-transparent', 'text-gray-400');
            });
            btn.classList.remove('bg-transparent', 'text-gray-400');
            btn.classList.add('bg-albion-accent', 'text-black');
            
            const targetId = btn.id.replace('btnTab', 'view');
            views.forEach(v => {
                v.classList.add('hidden');
                v.classList.remove('flex');
            });
            document.getElementById(targetId).classList.remove('hidden');
            document.getElementById(targetId).classList.add('flex');
        });
    });

    // --- Populate Selects ---
    const cityCatSelect = document.getElementById('cityCategory');
    const cityItemSelect = document.getElementById('cityItem');
    const bmCatSelect = document.getElementById('bmCategory');
    
    // Şehir Kıyaslama kategorilerini populate et
    cityCatSelect.add(new Option("Tüm Kategoriler (Hepsi)", "ALL"));
    Object.keys(ARB_CATEGORIES).forEach(catName => {
        cityCatSelect.add(new Option(catName, catName));
    });
    
    // Şehir Kıyaslama için eşya listesini güncelle
    const updateCityItems = () => {
        cityItemSelect.innerHTML = '<option value="ALL">Tüm Eşyalar (Hepsi)</option>';
        if (cityCatSelect.value === 'ALL') {
            // Tüm kategorilerden eşyaları topla
            Object.values(ARB_CATEGORIES).forEach(cat => {
                Object.values(cat).forEach(subCat => {
                    subCat.forEach(item => {
                        cityItemSelect.add(new Option(item.name, item.id));
                    });
                });
            });
        } else {
            const catData = ARB_CATEGORIES[cityCatSelect.value];
            if (catData) {
                Object.values(catData).forEach(subCat => {
                    subCat.forEach(item => {
                        cityItemSelect.add(new Option(item.name, item.id));
                    });
                });
            }
        }
    };
    cityCatSelect.addEventListener('change', updateCityItems);
    updateCityItems();

    bmCatSelect.add(new Option("Tüm Ekipmanlar (Hepsi)", "ALL"));
    Object.keys(ARB_CATEGORIES).forEach(catName => {
        if(catName !== "Sarf Malzemeleri (Consumables)" && catName !== "Token & Ekonomi") {
            bmCatSelect.add(new Option(catName, catName));
        }
    });


    // === TAB 1: KÂR FIRSATLARI (OPP) ===
    const renderOppTable = () => {
        const tbody = document.getElementById('oppTableBody');
        if(!tbody) return;

        if (arbitrageData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center p-8 text-gray-500"><i class="fa-solid fa-triangle-exclamation text-2xl mb-2 opacity-50"></i><br>Şu an yüksek kârlı fırsat bulunamadı.</td></tr>`;
            return;
        }

        arbitrageData.sort((a, b) => {
            let valA, valB;
            if(arbitrageSort.by === 'profit') { valA = a.profit; valB = b.profit; }
            else if(arbitrageSort.by === 'recency') { valA = a.recency; valB = b.recency; }
            else if(arbitrageSort.by === 'name') { valA = a.itemNameStr; valB = b.itemNameStr; }
            else if(arbitrageSort.by === 'buy') { valA = a.buy.price; valB = b.buy.price; }
            else if(arbitrageSort.by === 'sell') { valA = a.sell.price; valB = b.sell.price; }

            if(typeof valA === 'string') return arbitrageSort.dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            return arbitrageSort.dir === 'asc' ? valA - valB : valB - valA;
        });

        tbody.innerHTML = `<tr class="border-b border-gray-700/50 bg-gray-800/30">
            <th class="p-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">EŞYA</th>
            <th class="p-3 text-xs font-bold text-green-400 uppercase tracking-wider">ALIŞ YERİ & FİYAT</th>
            <th class="p-3 text-xs font-bold text-red-400 uppercase tracking-wider">SATIŞ YERİ & FİYAT</th>
            <th class="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider">VERİ YAŞI</th>
            <th class="p-3 text-right text-xs font-bold text-yellow-400 uppercase tracking-wider">NET KÂR</th>
            <th class="p-3 text-xs font-bold text-blue-400 uppercase tracking-wider">YAPAY ZEKA ÖNERİSİ</th>
        </tr>` + arbitrageData.map(opp => {
            const roi = ((opp.profit / opp.buy.price) * 100).toFixed(0);
            
            // Öneri oluştur
            let tipHtml = '';
            
            // Ağırlık hesaplama ve Binek uyarısı
            let weightInfoHtml = '';
            const baseItemId = opp.itemId.replace(/^T\\d+_/, '').replace(/@\\d+$/, '');
            const singleWeight = (window.AOT_DATA && window.AOT_DATA.weights) ? window.AOT_DATA.weights[opp.itemId] || window.AOT_DATA.weights[baseItemId] || null : null;
            
            if (singleWeight) {
                const mammothMax = Math.floor(MOUNT_CAPACITIES['Mamut (T8)'] / singleWeight);
                const oxMax = Math.floor(MOUNT_CAPACITIES['Öküz (T8)'] / singleWeight);
                weightInfoHtml = `<div class="mt-1 pt-1 border-t border-gray-700/50 text-[9px] text-gray-400">
                    <span class="text-orange-400"><i class="fa-solid fa-weight-hanging"></i> ${singleWeight.toFixed(1)} kg</span> | 
                    Max: 🐂 ${oxMax}x | 🐘 ${mammothMax}x
                </div>`;
            }

            if (opp.profit > 5000) {
                tipHtml = `<div class="bg-green-500/10 border border-green-500/30 rounded p-2">
                    <div class="text-green-400 font-bold text-xs mb-1"><i class="fa-solid fa-fire mr-1"></i>YÜKSEK KÂR!</div>
                    <div class="text-gray-300 text-[10px]">ROI: ${roi}% → Hemen al, kâr büyük!</div>
                    <div class="text-gray-400 text-[9px] mt-1">Hedef: ${opp.sell.city}</div>
                    ${weightInfoHtml}
                </div>`;
            } else if (opp.profit > 2000) {
                tipHtml = `<div class="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                    <div class="text-blue-400 font-semibold text-xs mb-1"><i class="fa-solid fa-check-circle mr-1"></i>İYİ FIRSAT</div>
                    <div class="text-gray-300 text-[10px]">ROI: ${roi}% → Değerlendirilebilir</div>
                    ${weightInfoHtml}
                </div>`;
            } else {
                tipHtml = `<div class="text-gray-500 text-[10px]"><i class="fa-solid fa-info-circle mr-1"></i>Düşük marj (${roi}%)</div>${weightInfoHtml}`;
            }
            
            return `
            <tr class="hover:bg-albion-900/50 transition-colors group">
            <td class="p-3 border-b border-gray-700/50 flex items-center">
                <div class="relative mr-4 shrink-0 group-hover:scale-105 transition-transform">
                    <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" 
                         class="w-16 h-16 drop-shadow-lg bg-[#0a0d14] rounded border border-gray-700 p-1"
                         data-item="${opp.itemId}"
                         data-quality="${opp.quality || 1}"
                         data-size="128"
                         onerror="this.src=window.albionImageCache.getPlaceholderUrl()">
                    ${getEnchantBadge(opp.itemId)}
                </div>
                <div>
                    <div class="font-bold text-white text-sm group-hover:text-albion-accent transition-colors">${opp.itemNameStr}</div>
                    <div class="mt-1">${getQualityHtml(opp.quality)}</div>
                </div>
            </td>
            <td class="p-3 border-b border-gray-700/50">
                <div class="text-xs text-gray-400 mb-0.5"><i class="fa-solid fa-map-location-dot mr-1"></i> ${opp.buy.city}</div>
                <div class="text-sm font-bold text-gray-300">${opp.buy.price.toLocaleString()} 🥈 <span class="text-[9px] text-gray-500">(Satış Emrinden)</span></div>
                ${opp.route ? `<div class="text-[10px] text-yellow-400 mt-1"><i class="fa-solid fa-route mr-1"></i>${opp.route}</div>` : ''}
            </td>
            <td class="p-3 border-b border-gray-700/50">
                <div class="text-xs ${opp.isBM ? 'text-red-400' : 'text-purple-400'} mb-0.5"><i class="fa-solid ${opp.isBM ? 'fa-skull' : 'fa-store'} mr-1"></i> ${opp.sell.city}</div>
                <div class="text-sm font-bold text-gray-300">${opp.sell.price.toLocaleString()} 🥈 <span class="text-[9px] ${opp.isBM ? 'text-red-500/70' : 'text-purple-500/70'}">(Alış Emri)</span></div>
            </td>
            <td class="p-3 border-b border-gray-700/50 text-xs">${getTimeAgoStr(opp.recency)}</td>
            <td class="p-3 border-b border-gray-700/50 text-right">
                <div class="text-sm font-black text-green-400 bg-green-500/10 px-3 py-1.5 rounded inline-block border border-green-500/30">
                    +${opp.profit.toLocaleString()} 🥈
                </div>
                <div class="text-[9px] text-gray-500 mt-1">ROI: ${roi}%</div>
            </td>
            <td class="p-3 border-b border-gray-700/50">
                ${tipHtml}
            </td>
            </tr>`;
        }).join('');
    };

    document.querySelectorAll('#oppHeaders th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const sortKey = th.getAttribute('data-sort');
            if(arbitrageSort.by === sortKey) { arbitrageSort.dir = arbitrageSort.dir === 'asc' ? 'desc' : 'asc'; } 
            else { arbitrageSort.by = sortKey; arbitrageSort.dir = (sortKey === 'recency' || sortKey === 'name') ? 'asc' : 'desc'; }
            
            document.querySelectorAll('#oppHeaders .sort-icon').forEach(icon => icon.className = 'fa-solid fa-sort text-gray-600 group-hover:text-albion-accent ml-1 sort-icon');
            th.querySelector('.sort-icon').className = `fa-solid fa-sort-${arbitrageSort.dir === 'asc' ? 'up' : 'down'} text-albion-accent ml-1 sort-icon`;
            renderOppTable();
        });
    });

    // Kâr Fırsatları kategori dropdown'unu doldur
    const oppCategorySelect = document.getElementById('oppCategory');
    Object.keys(ARB_CATEGORIES).forEach(catName => {
        oppCategorySelect.add(new Option(catName, catName));
    });

    document.getElementById('btnFetchOpp').addEventListener('click', async () => {
        const loading = document.getElementById('oppLoading');
        loading.classList.remove('hidden');
        
        const selectedTier = document.getElementById('oppTier').value;
        const selectedEnchant = document.getElementById('oppEnchant').value;
        const selectedCity = document.getElementById('oppCity').value;
        const selectedCategory = document.getElementById('oppCategory').value;
        const selectedQuality = document.getElementById('oppQuality').value;
        
        // Şehir filtreleme fonksiyonu
        const cityFilter = (itemData) => {
            if (selectedCity === 'ALL') return true;
            if (selectedCity === 'royal') {
                return ['LYMHURST', 'BRIDGEWATCH', 'FORT_STERLING', 'MARTLOCK', 'THETFORD'].includes(itemData.from);
            }
            if (selectedCity === 'rest') {
                return ['ARTHURS_REST', 'MORGANAS_REST', 'MERLINS_REST'].includes(itemData.from);
            }
            return itemData.from === selectedCity;
        };
        
        // Kategori filtresine göre eşyaları seç
        let baseItems = [];
        if (selectedCategory === 'ALL') {
            // Tüm kategorilerden eşyalar
            Object.values(ARB_CATEGORIES).forEach(cat => {
                Object.values(cat).forEach(subCat => {
                    baseItems = baseItems.concat(subCat.map(item => item.id));
                });
            });
        } else {
            // Belirli kategori
            const catData = ARB_CATEGORIES[selectedCategory];
            if (catData) {
                Object.values(catData).forEach(subCat => {
                    baseItems = baseItems.concat(subCat.map(item => item.id));
                });
            }
        }
        
        // Tekrarları kaldır ve token'ları filtrele
        baseItems = [...new Set(baseItems)].filter(itemId => {
            return !["QUESTITEM_TOKEN_SIPHONED_ENERGY", "QUESTITEM_TOKEN_AVALON", "QUESTITEM_TOKEN_ROYAL", 
                     "RUNE", "SOUL", "RELIC", "SHARD_AVALONIAN", "ESSENCE"].includes(itemId);
        });
        
        const itemsToFetch = getItemsToFetch(baseItems, selectedTier, selectedEnchant);
        
        try {
            const qualityParam = selectedQuality !== 'ALL' ? `?qualities=${selectedQuality}` : '';
            console.log('Fetching items:', itemsToFetch.length, 'items');
            console.log('First 5 items:', itemsToFetch.slice(0, 5));
            
            const data = await fetchPricesInChunks(itemsToFetch, qualityParam);
            console.log('API response:', data ? data.length : 0, 'items');
            
            arbitrageData = [];
            if(data && data.length > 0) {
                const grouped = {};
                // Sadece ana şehirlerde veri var
                const validCities = ["Lymhurst", "Bridgewatch", "Fort Sterling", "Martlock", "Thetford", "Caerleon", "Black Market"];
                
                data.forEach(d => {
                    if(!validCities.includes(d.city)) return;
                    
                    const key = `${d.item_id}_${d.quality}`;
                    if(!grouped[key]) grouped[key] = { itemId: d.item_id, quality: d.quality, royals: [], caerleon: null, blackmarket: null };
                    
                    if(d.city === 'Black Market') {
                        if(d.buy_price_max > 0 && getMins(d.buy_price_max_date) <= 45) grouped[key].blackmarket = { city: 'Caerleon (Karaborsa)', price: d.buy_price_max, date: d.buy_price_max_date };
                    }
                    else if(d.city === 'Caerleon') {
                        if(d.buy_price_max > 0 && getMins(d.buy_price_max_date) <= 45) grouped[key].caerleon = { city: 'Caerleon (Pazar)', price: d.buy_price_max, date: d.buy_price_max_date };
                    }
                    else {
                        if(d.sell_price_min > 0 && getMins(d.sell_price_min_date) <= 45) grouped[key].royals.push({ city: d.city, price: d.sell_price_min, date: d.sell_price_min_date });
                    }
                });

                for(const [key, info] of Object.entries(grouped)) {
                    if(info.royals.length > 0) {
                        info.royals.sort((a,b) => a.price - b.price);
                        const bestBuy = info.royals[0];
                        
                        const nonEquipment = ['POTION', 'MEAL', 'MOUNT', 'WOOD', 'ROCK', 'ORE', 'FIBER', 'HIDE', 'FISH', 'PLANKS', 'LEATHER', 'STONEBLOCK', 'METALBAR', 'CLOTH'];
                        const isEquipment = !nonEquipment.some(nx => info.itemId.includes(nx));

                        if(info.blackmarket && isEquipment) {
                            const netProfit = Math.floor(info.blackmarket.price * 0.935) - bestBuy.price;
                            if (netProfit > 500) {
                                arbitrageData.push({
                                    itemId: info.itemId, itemNameStr: formatItemName(info.itemId),
                                    quality: info.quality, buy: bestBuy, sell: info.blackmarket,
                                    profit: netProfit, recency: Math.max(getMins(bestBuy.date), getMins(info.blackmarket.date)),
                                    route: `${bestBuy.city} → BM`,
                                    isBM: true
                                });
                            }
                        }
                        
                        if(info.caerleon) {
                            const netProfit = Math.floor(info.caerleon.price * 0.935) - bestBuy.price;
                            if (netProfit > 500) {
                                arbitrageData.push({
                                    itemId: info.itemId, itemNameStr: formatItemName(info.itemId),
                                    quality: info.quality, buy: bestBuy, sell: info.caerleon,
                                    profit: netProfit, recency: Math.max(getMins(bestBuy.date), getMins(info.caerleon.date)),
                                    route: `${bestBuy.city} → Caerleon Pazar`,
                                    isBM: false
                                });
                            }
                        }
                    }
                }
            }
            renderOppTable();
        } catch(e) {
            console.error('Fetch error:', e);
            document.getElementById('oppTableBody').innerHTML = `<tr><td colspan="5" class="text-center p-8 text-red-400">Veri çekilemedi: ${e.message}</td></tr>`;
        } finally {
            loading.classList.add('hidden');
        }
    });


    // === TAB 2: ŞEHİR KIYASLAMA TABLOSU ===
    const renderCityTable = () => {
        const tbody = document.getElementById('cityTableBody');
        if(!tbody) return;

        if (cityDataArray.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center p-8 text-gray-500"><i class="fa-solid fa-ghost text-2xl mb-2 opacity-50"></i><br>Seçilen kriterlerde eşya verisi bulunamadı.</td></tr>`;
            return;
        }

        // Sadece ana şehirler - Rest şehirlerinde piyasa verisi yok
        const cityList = ["Lymhurst", "Bridgewatch", "Fort Sterling", "Martlock", "Thetford", "Caerleon"];

        tbody.innerHTML = `
        <tr class="bg-albion-900/50 border-b border-gray-700">
            <th class="p-2 text-left text-[10px] font-bold text-gray-400 uppercase sticky left-0 bg-albion-900 z-10">EŞYA (KALİTE)</th>
            ${cityList.map(city => `<th class="p-2 text-center text-[9px] font-bold text-gray-400 uppercase">${city.substring(0, 4)}</th>`).join('')}
            <th class="p-2 text-center text-[10px] font-bold text-yellow-400 uppercase">KÂR</th>
        </tr>
        ` + cityDataArray.map(c => {
            let renderItemId = c.itemId;
            const hasProfit = c.bestProfit > 1000;
            
            return `
            <tr class="hover:bg-white/5 transition-colors border-b border-gray-700/50 ${hasProfit ? 'bg-yellow-500/5' : ''}">
                <td class="p-2 flex items-center min-w-[180px] border-r border-gray-800/50 sticky left-0 bg-albion-800/90">
                    <div class="relative mr-2 shrink-0">
                        <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" 
                             class="w-8 h-8 bg-[#0a0d14] rounded border border-gray-700 p-0.5"
                             data-item="${renderItemId}"
                             data-quality="${c.quality || 1}"
                             data-size="64"
                             onerror="this.src=window.albionImageCache.getPlaceholderUrl()">
                        ${getEnchantBadge(c.itemId)}
                    </div>
                    <div class="min-w-0">
                        <div class="font-bold text-white text-[10px] truncate">${formatItemName(c.itemId)}</div>
                        <div class="flex items-center gap-1 mt-0.5">
                            ${getQualityHtml(c.quality)}
                            <span class="text-[8px] text-gray-500">${getTimeAgoStr(c.bestRecency)}</span>
                        </div>
                    </div>
                </td>
                ${cityList.map(city => {
                    const sell = c.cities[city].sell;
                    const buy = c.cities[city].buy;
                    const isBestBuy = hasProfit && city === c.bestBuyCity;
                    const isBestSell = hasProfit && city === c.bestSellCity;
                    
                    const sellStr = sell > 0 ? sell.toLocaleString() : '<span class="opacity-30">-</span>';
                    const buyStr = buy > 0 ? buy.toLocaleString() : '<span class="opacity-30">-</span>';
                    
                    return `
                    <td class="p-2 text-center align-middle border-r border-gray-800/50 ${isBestBuy ? 'bg-red-500/10' : ''} ${isBestSell ? 'bg-green-500/10' : ''}">
                        <div class="text-[11px] font-bold ${isBestBuy ? 'text-red-400' : 'text-green-400'} mb-0.5" title="Satış Emri">${sellStr}</div>
                        <div class="text-[10px] font-bold ${isBestSell ? 'text-green-400' : 'text-albion-accent'}" title="Alış Emri">${buyStr}</div>
                    </td>`;
                }).join('')}
                <td class="p-2 text-center border-r border-gray-800/50">
                    ${hasProfit ? `
                        <div class="text-[11px] font-black text-yellow-400">+${c.bestProfit.toLocaleString()}</div>
                        <div class="text-[8px] text-gray-400">${c.bestBuyCity.substring(0,4)}→${c.bestSellCity.substring(0,4)}</div>
                    ` : '<span class="text-[10px] text-gray-600">-</span>'}
                </td>
            </tr>
            `;
        }).join('');
    };

    document.getElementById('btnFetchCity').addEventListener('click', async () => {
        const loading = document.getElementById('cityLoading');
        const resArea = document.getElementById('cityResultArea');
        const tbody = document.getElementById('cityTableBody');
        
        tbody.innerHTML = '';
        resArea.classList.remove('hidden');
        resArea.classList.add('flex');
        loading.classList.remove('hidden');
        
        const cat = document.getElementById('cityCategory').value;
        const itemOpt = document.getElementById('cityItem').value;
        const tier = document.getElementById('cityTier').value;
        const enchant = document.getElementById('cityEnchant').value;
        
        let baseItems = [];
        if (itemOpt === 'ALL') {
            if (cat === 'ALL') {
                // Tüm kategorilerden eşyaları topla
                Object.values(ARB_CATEGORIES).forEach(category => {
                    Object.values(category).forEach(subCat => {
                        if (Array.isArray(subCat)) {
                            baseItems = baseItems.concat(subCat.map(i => i.id));
                        }
                    });
                });
            } else {
                // Belirli kategoriden eşyaları topla
                const catData = ARB_CATEGORIES[cat];
                if (catData) {
                    Object.values(catData).forEach(subCat => {
                        if (Array.isArray(subCat)) {
                            baseItems = baseItems.concat(subCat.map(i => i.id));
                        }
                    });
                }
            }
        } else {
            baseItems = [itemOpt];
        }
        
        // Tekrarları kaldır
        baseItems = [...new Set(baseItems)];
        
        const itemsToFetch = getItemsToFetch(baseItems, tier, enchant);
        
        try {
            // TÜM KALİTELERİ çek (1-5: Normal, İyi, Olağanüstü, Mükemmel, Şaheser)
            const data = await fetchPricesInChunks(itemsToFetch, 'qualities=1,2,3,4,5');
            
            const grouped = {};
            // Sadece ana şehirler - Rest şehirlerinde piyasa verisi yok
            const cityList = ["Lymhurst", "Bridgewatch", "Fort Sterling", "Martlock", "Thetford", "Caerleon"];
            
            if(data && data.length > 0) {
                data.forEach(d => {
                    if (cityList.includes(d.city)) {
                        // Kaliteyi item ID'ye ekle (örn: T6_MAIN_SWORD@1_3)
                        const itemKey = `${d.item_id}_Q${d.quality}`;
                        
                        if(!grouped[itemKey]) {
                            grouped[itemKey] = { 
                                itemId: d.item_id, 
                                quality: d.quality,
                                bestRecency: 999999, 
                                cities: {} 
                            };
                            cityList.forEach(c => grouped[itemKey].cities[c] = { sell: 0, buy: 0 });
                        }
                        if (d.sell_price_min > 0 && getMins(d.sell_price_min_date) <= 45) {
                            grouped[itemKey].cities[d.city].sell = d.sell_price_min;
                            grouped[itemKey].bestRecency = Math.min(grouped[itemKey].bestRecency, getMins(d.sell_price_min_date));
                        }
                        if (d.buy_price_max > 0 && getMins(d.buy_price_max_date) <= 45) {
                            grouped[itemKey].cities[d.city].buy = d.buy_price_max;
                            grouped[itemKey].bestRecency = Math.min(grouped[itemKey].bestRecency, getMins(d.buy_price_max_date));
                        }
                    }
                });
            }

            cityDataArray = Object.values(grouped);
            
            // Şehirler arası kâr fırsatlarını hesapla
            cityDataArray.forEach(item => {
                let bestProfit = 0;
                let bestBuyCity = '';
                let bestSellCity = '';
                
                for (const buyCity of cityList) {
                    const buyPrice = item.cities[buyCity].sell; // Alış için satış fiyatına bak
                    if (buyPrice === 0) continue;
                    
                    for (const sellCity of cityList) {
                        if (buyCity === sellCity) continue;
                        const sellPrice = item.cities[sellCity].buy; // Satış için alış fiyatına bak
                        if (sellPrice === 0) continue;
                        
                        // %6.5 vergi düş
                        const netProfit = Math.floor(sellPrice * 0.935) - buyPrice;
                        if (netProfit > bestProfit) {
                            bestProfit = netProfit;
                            bestBuyCity = buyCity;
                            bestSellCity = sellCity;
                        }
                    }
                }
                
                item.bestProfit = bestProfit;
                item.bestBuyCity = bestBuyCity;
                item.bestSellCity = bestSellCity;
            });
            
            // Kâra göre sırala (en yüksek kârlı üstte)
            cityDataArray.sort((a, b) => b.bestProfit - a.bestProfit);
            
            renderCityTable();
        } catch(e) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center p-8 text-red-400">Veri Çekilemedi.</td></tr>`;
        } finally {
            loading.classList.add('hidden');
        }
    });


    // === TAB 3: BLACK MARKET TALEPLERİ ===
    const renderBMTable = () => {
        const tbody = document.getElementById('bmTableBody');
        if(!tbody) return;

        if (bmData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center p-8 text-gray-500"><i class="fa-solid fa-ghost text-2xl mb-2 opacity-50"></i><br>BM alım emri verisi bulunamadı.</td></tr>`;
            return;
        }

        bmData.sort((a,b) => {
            let valA, valB;
            if(bmSort.by === 'price') { valA = a.price; valB = b.price; }
            else if(bmSort.by === 'recency') { valA = getMins(a.date); valB = getMins(b.date); }
            else if(bmSort.by === 'quality') { valA = a.quality; valB = b.quality; }
            else if(bmSort.by === 'name') { valA = formatItemName(a.itemId); valB = formatItemName(b.itemId); }

            if(typeof valA === 'string') return bmSort.dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            return bmSort.dir === 'asc' ? valA - valB : valB - valA;
        });

        tbody.innerHTML = bmData.map(d => `
            <tr class="hover:bg-albion-900/50 transition-colors">
                <td class="p-3 border-b border-gray-700/50 flex items-center">
                    <div class="relative mr-4 shrink-0">
                        <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" class="w-12 h-12 drop-shadow-lg bg-[#0a0d14] rounded border border-gray-700 p-0.5"
                             data-item="${d.itemId}"
                             data-quality="${d.quality || 1}"
                             data-size="96"
                             onerror="this.src=window.albionImageCache.getPlaceholderUrl()">
                        ${getEnchantBadge(d.itemId)}
                    </div>
                    <span class="font-bold text-white text-sm">${formatItemName(d.itemId)}</span>
                </td>
                <td class="p-3 border-b border-gray-700/50">${getQualityHtml(d.quality)}</td>
                <td class="p-3 border-b border-gray-700/50 font-black text-red-400">${d.price.toLocaleString()} 🥈 <span class="text-[9px] text-red-500/70 block md:inline mt-1 md:mt-0">(Alış Emri)</span></td>
                <td class="p-3 border-b border-gray-700/50 text-right text-xs">${getTimeAgoStr(getMins(d.date))}</td>
            </tr>
        `).join('');
    };

    document.querySelectorAll('#bmHeaders th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const sortKey = th.getAttribute('data-sort');
            if(bmSort.by === sortKey) { bmSort.dir = bmSort.dir === 'asc' ? 'desc' : 'asc'; } 
            else { bmSort.by = sortKey; bmSort.dir = (sortKey === 'name') ? 'asc' : 'desc'; }
            
            document.querySelectorAll('#bmHeaders .sort-icon').forEach(icon => icon.className = 'fa-solid fa-sort text-gray-600 group-hover:text-albion-accent ml-1 sort-icon');
            th.querySelector('.sort-icon').className = `fa-solid fa-sort-${bmSort.dir === 'asc' ? 'up' : 'down'} text-albion-accent ml-1 sort-icon`;
            renderBMTable();
        });
    });

    document.getElementById('btnFetchBM').addEventListener('click', async () => {
        const loading = document.getElementById('bmLoading');
        loading.classList.remove('hidden');
        
        const cat = document.getElementById('bmCategory').value;
        const tier = document.getElementById('bmTier').value;
        const enchant = document.getElementById('bmEnchant').value;
        
        let baseItems = [];
        if (cat === "ALL") {
            const bmEligibleCats = ["🗡️ Silahlar (Weapons)", "🛡️ Zırhlar (Armor)", "🎒 Aksesuarlar (Accessories)"];
            bmEligibleCats.forEach(c => {
                Object.values(ARB_CATEGORIES[c]).forEach(subCat => {
                    subCat.forEach(b => baseItems.push(b.id));
                });
            });
        } else {
            const catData = ARB_CATEGORIES[cat];
            if (catData) {
                Object.values(catData).forEach(subCat => {
                    subCat.forEach(b => baseItems.push(b.id));
                });
            }
        }
        
        const itemsToFetch = getItemsToFetch(baseItems, tier, enchant);
        
        try {
            const data = await fetchPricesInChunks(itemsToFetch, 'locations=Black%20Market');
            
            bmData = [];
            if(data && data.length > 0) {
                data.forEach(d => {
                    if (d.buy_price_max > 0 && getMins(d.buy_price_max_date) <= 45) {
                        bmData.push({
                            itemId: d.item_id, quality: d.quality, price: d.buy_price_max, date: d.buy_price_max_date
                        });
                    }
                });
            }

            renderBMTable();
        } catch(e) {
            document.getElementById('bmTableBody').innerHTML = `<tr><td colspan="4" class="text-center p-8 text-red-400">Veri çekilemedi.</td></tr>`;
        } finally {
            loading.classList.add('hidden');
        }
    });

    // === KATEGORİ TABANLI UNIVERSAL ARAMA ===
    const btnManualSearch = document.getElementById('btnManualSearch');
    const manualSearchResults = document.getElementById('manualSearchResults');
    const manualMainCategory = document.getElementById('manualMainCategory');
    const manualSubCategory = document.getElementById('manualSubCategory');
    const manualItem = document.getElementById('manualItem');
    const manualTier = document.getElementById('manualTier');
    const manualEnchant = document.getElementById('manualEnchant');
    const manualQuality = document.getElementById('manualQuality');
    const manualCity = document.getElementById('manualCity');
    
    // Ana kategorileri doldur
    Object.keys(ARB_CATEGORIES).forEach(catName => {
        manualMainCategory.add(new Option(catName, catName));
    });
    
    // Alt kategorileri güncelle
    const updateManualSubCategories = () => {
        manualSubCategory.innerHTML = '<option value="ALL">📁 Tümü</option>';
        manualItem.innerHTML = '<option value="ALL">🔹 Tüm Eşyalar</option>';
        
        const mainCat = manualMainCategory.value;
        if (mainCat === 'ALL') {
            // Tüm kategorilerden alt kategorileri topla
            Object.keys(ARB_CATEGORIES).forEach(cat => {
                Object.keys(ARB_CATEGORIES[cat]).forEach(subCat => {
                    manualSubCategory.add(new Option(subCat, `${cat}|${subCat}`));
                });
            });
        } else if (ARB_CATEGORIES[mainCat]) {
            Object.keys(ARB_CATEGORIES[mainCat]).forEach(subCat => {
                manualSubCategory.add(new Option(subCat, subCat));
            });
        }
        updateManualItems();
    };
    
    // Eşyaları güncelle
    const updateManualItems = () => {
        manualItem.innerHTML = '<option value="ALL">🔹 Tüm Eşyalar</option>';
        
        const mainCat = manualMainCategory.value;
        const subCatValue = manualSubCategory.value;
        
        let items = [];
        
        if (mainCat === 'ALL' && subCatValue === 'ALL') {
            // Tüm eşyalar
            Object.values(ARB_CATEGORIES).forEach(cat => {
                Object.values(cat).forEach(subCat => {
                    items = items.concat(subCat);
                });
            });
        } else if (mainCat !== 'ALL' && subCatValue === 'ALL') {
            // Ana kategorideki tüm eşyalar
            Object.values(ARB_CATEGORIES[mainCat]).forEach(subCat => {
                items = items.concat(subCat);
            });
        } else if (subCatValue.includes('|')) {
            // Alt kategori seçili (format: mainCat|subCat)
            const [cat, sub] = subCatValue.split('|');
            items = ARB_CATEGORIES[cat]?.[sub] || [];
        } else if (mainCat !== 'ALL' && subCatValue !== 'ALL') {
            // Normal alt kategori
            items = ARB_CATEGORIES[mainCat]?.[subCatValue] || [];
        }
        
        // Tekrarları kaldır
        const uniqueItems = [...new Map(items.map(item => [item.id, item])).values()];
        uniqueItems.forEach(item => {
            manualItem.add(new Option(item.name, item.id));
        });
    };
    
    manualMainCategory.addEventListener('change', updateManualSubCategories);
    manualSubCategory.addEventListener('change', updateManualItems);
    
    // Başlangıçta doldur
    updateManualSubCategories();
    
    // Arama fonksiyonu
    btnManualSearch?.addEventListener('click', async () => {
        const loading = document.getElementById('manualLoading');
        loading.classList.remove('hidden');
        manualSearchResults.innerHTML = '';
        
        const mainCat = manualMainCategory.value;
        const subCat = manualSubCategory.value;
        const selectedItem = manualItem.value;
        const tier = manualTier.value;
        const enchant = manualEnchant.value;
        const quality = manualQuality.value;
        const cityFilter = manualCity.value;
        
        // Eşya listesini oluştur
        let itemsToFetch = [];
        
        if (selectedItem !== 'ALL') {
            // Belirli bir eşya seçildi
            itemsToFetch = generateItemIds(selectedItem, tier, enchant);
        } else if (subCat !== 'ALL' && !subCat.includes('|')) {
            // Alt kategori seçildi
            const items = ARB_CATEGORIES[mainCat]?.[subCat] || [];
            items.forEach(item => {
                itemsToFetch = itemsToFetch.concat(generateItemIds(item.id, tier, enchant));
            });
        } else if (mainCat !== 'ALL') {
            // Ana kategori seçildi
            Object.values(ARB_CATEGORIES[mainCat]).forEach(subItems => {
                subItems.forEach(item => {
                    itemsToFetch = itemsToFetch.concat(generateItemIds(item.id, tier, enchant));
                });
            });
        } else {
            // Tümü seçildi - sınırlı sayıda getir
            let count = 0;
            Object.values(ARB_CATEGORIES).forEach(cat => {
                Object.values(cat).forEach(subItems => {
                    subItems.forEach(item => {
                        if (count < 50) { // Güvenlik limiti
                            itemsToFetch = itemsToFetch.concat(generateItemIds(item.id, tier, enchant));
                            count++;
                        }
                    });
                });
            });
        }
        
        // Tekrarları kaldır
        itemsToFetch = [...new Set(itemsToFetch)];
        
        if (itemsToFetch.length === 0) {
            manualSearchResults.innerHTML = '<div class="text-center p-4 text-gray-400"><i class="fa-solid fa-circle-xmark mr-2"></i> Eşya bulunamadı.</div>';
            loading.classList.add('hidden');
            return;
        }
        
        try {
            const qualityParam = quality !== 'ALL' ? `qualities=${quality}` : 'qualities=1,2,3,4,5';
            const data = await fetchPricesInChunks(itemsToFetch, qualityParam);
            
            if (!data || data.length === 0) {
                manualSearchResults.innerHTML = '<div class="text-center p-4 text-gray-400"><i class="fa-solid fa-circle-xmark mr-2"></i> Veri bulunamadı.</div>';
                return;
            }
            
            // Şehir filtresi - sadece ana şehirlerde veri var
            const allCities = ["Lymhurst", "Bridgewatch", "Fort Sterling", "Martlock", "Thetford", "Caerleon"];
            let filterCities = allCities;
            // Sadece ana şehirlerde veri var
            const validCities = ["Lymhurst", "Bridgewatch", "Fort Sterling", "Martlock", "Thetford", "Caerleon", "Black Market"];
            
            if (cityFilter === 'ALL') {
                filterCities = validCities;
            } else {
                // Şehir adını düzelt (örn: FORT_STERLING -> Fort Sterling)
                const cityName = cityFilter.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase()).replace("'S ", "'s ");
                filterCities = validCities.includes(cityName) ? [cityName] : validCities;
            }
            
            // Sonuçları grupla
            const grouped = {};
            data.forEach(d => {
                if (!filterCities.includes(d.city)) return;
                
                const key = `${d.item_id}_${d.quality}`;
                if (!grouped[key]) {
                    grouped[key] = { itemId: d.item_id, quality: d.quality, cities: {} };
                    filterCities.forEach(c => grouped[key].cities[c] = { sell: 0, buy: 0, sellDate: null, buyDate: null });
                }
                if (d.sell_price_min > 0 && getMins(d.sell_price_min_date) <= 45) {
                    grouped[key].cities[d.city].sell = d.sell_price_min;
                    grouped[key].cities[d.city].sellDate = d.sell_price_min_date;
                }
                if (d.buy_price_max > 0 && getMins(d.buy_price_max_date) <= 45) {
                    grouped[key].cities[d.city].buy = d.buy_price_max;
                    grouped[key].cities[d.city].buyDate = d.buy_price_max_date;
                }
            });
            
            // HTML oluştur
            let html = '<div class="space-y-3">';
            const groupedArray = Object.values(grouped);
            html += `<div class="text-xs text-blue-400 bg-blue-500/10 p-2 rounded border border-blue-500/30"><i class="fa-solid fa-circle-info mr-1"></i> <strong>${groupedArray.length}</strong> varyasyon bulundu</div>`;
            
            for (const itemData of groupedArray) {
                const itemId = itemData.itemId;
                const quality = itemData.quality;
                
                // En yüksek kâr fırsatını bul
                let bestProfit = 0;
                let bestFrom = '';
                let bestTo = '';
                
                for (const city1 of filterCities) {
                    const buyPrice = itemData.cities[city1]?.buy || 0;
                    if (buyPrice === 0) continue;
                    
                    for (const city2 of filterCities) {
                        if (city1 === city2) continue;
                        const sellPrice = itemData.cities[city2]?.sell || 0;
                        if (sellPrice === 0) continue;
                        
                        const profit = Math.floor(sellPrice * 0.935) - buyPrice;
                        if (profit > bestProfit) {
                            bestProfit = profit;
                            bestFrom = city1;
                            bestTo = city2;
                        }
                    }
                }
                
                const itemName = formatItemName(itemId);
                const qualityHtml = getQualityHtml(quality);
                const enchantBadge = getEnchantBadge(itemId);
                
                html += `
                    <div class="bg-albion-800 border border-gray-700 rounded-lg p-3 hover:border-purple-500/50 transition-colors">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2">
                                <div class="relative">
                                    <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" 
                                         class="w-10 h-10 bg-[#0a0d14] rounded border border-gray-700"
                                         data-item="${itemId}"
                                         data-quality="${itemData.quality || 1}"
                                         data-size="64"
                                         onerror="this.src=window.albionImageCache.getPlaceholderUrl()">
                                    ${enchantBadge}
                                </div>
                                <div>
                                    <span class="font-bold text-white text-sm">${itemName}</span>
                                    <div class="mt-0.5">${qualityHtml}</div>
                                </div>
                            </div>
                            ${bestProfit > 0 ? `<div class="text-xs font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/30"><i class="fa-solid fa-coins mr-1"></i> +${bestProfit.toLocaleString()} <span class="text-gray-400">(${bestFrom} → ${bestTo})</span></div>` : '<div class="text-xs text-gray-500">Kâr fırsatı yok</div>'}
                        </div>
                        <div class="grid grid-cols-3 md:grid-cols-5 gap-2 text-xs">
                            ${filterCities.map(city => {
                                const sell = itemData.cities[city]?.sell;
                                const buy = itemData.cities[city]?.buy;
                                const hasProfit = bestProfit > 0 && (city === bestFrom || city === bestTo);
                                return `
                                    <div class="bg-albion-900 rounded p-2 ${hasProfit ? (city === bestFrom ? 'border border-red-500/30' : 'border border-green-500/30') : ''}">
                                        <div class="text-gray-400 font-bold mb-1 truncate">${city}</div>
                                        <div class="text-green-400">S: ${sell > 0 ? sell.toLocaleString() : '-'}</div>
                                        <div class="text-red-400">A: ${buy > 0 ? buy.toLocaleString() : '-'}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }
            
            html += '</div>';
            manualSearchResults.innerHTML = html;
            
        } catch (e) {
            console.error('Kategori arama hatası:', e);
            manualSearchResults.innerHTML = '<div class="text-center p-4 text-red-400"><i class="fa-solid fa-triangle-exclamation mr-2"></i> Arama sırasında hata oluştu.</div>';
        } finally {
            loading.classList.add('hidden');
        }
    });

    // === SEKME 4: REFİNE HESAPLAYICI ===
    const renderRefineTable = () => {
        const tbody = document.getElementById('refineTableBody');
        const thead = document.getElementById('refineHeaders');
        if(!tbody || !thead) return;

        if (refineData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="text-center p-8 text-gray-500"><i class="fa-solid fa-ghost text-2xl mb-2 opacity-50"></i><br>Veri bulunamadı. Tüm şehirlerdeki fiyatları kontrol edin.</td></tr>`;
            return;
        }

        thead.innerHTML = `<tr class="border-b border-gray-700 bg-gray-800/50">
            <th class="p-3 text-left text-xs font-bold text-gray-400 uppercase cursor-pointer hover:text-white" data-sort="profit"><i class="fa-solid fa-fire mr-1"></i>SÜPER KÂR <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-green-400 uppercase cursor-pointer hover:text-white" data-sort="rawCost"><i class="fa-solid fa-coins mr-1"></i>HAM ALIM <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-blue-400 uppercase">İŞLENMİŞ SATIŞ</th>
            <th class="p-3 text-xs font-bold text-yellow-400 uppercase cursor-pointer hover:text-white" data-sort="profitNoFocus"><i class="fa-solid fa-chart-line mr-1"></i>KÂR (Focus'suz) <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-green-400 uppercase cursor-pointer hover:text-white" data-sort="profitFocus"><i class="fa-solid fa-bolt mr-1"></i>KÂR (Focus'lu) <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-orange-400 uppercase cursor-pointer hover:text-white" data-sort="roi"><i class="fa-solid fa-percentage mr-1"></i>ROI <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-purple-400 uppercase cursor-pointer hover:text-white" data-sort="city"><i class="fa-solid fa-map-marker-alt mr-1"></i>ŞEHİR <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-gray-400 uppercase cursor-pointer hover:text-white" data-sort="recency"><i class="fa-solid fa-clock mr-1"></i>SON GÜNCELLEME <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-cyan-400 uppercase">AI ÖNERİ</th>
        </tr>`;

        // Akıllı sıralama uygula
        const sortKey = refineSort.by;
        const sortDir = refineSort.dir;
        
        refineData.sort((a, b) => {
            let valA, valB;
            
            if (sortKey === 'profit') {
                // Süper kâr: hem focus'suz hem focus'lu kârı değerlendir
                valA = a.profitNoFocus > 0 ? a.profitNoFocus + a.profitFocus : a.profitNoFocus;
                valB = b.profitNoFocus > 0 ? b.profitNoFocus + b.profitFocus : b.profitNoFocus;
            } else if (sortKey === 'rawCost') {
                valA = a.rawCost;
                valB = b.rawCost;
            } else if (sortKey === 'profitNoFocus') {
                valA = a.profitNoFocus;
                valB = b.profitNoFocus;
            } else if (sortKey === 'profitFocus') {
                valA = a.profitFocus;
                valB = b.profitFocus;
            } else if (sortKey === 'roi') {
                valA = (a.profitNoFocus / a.rawCost) * 100;
                valB = (b.profitNoFocus / b.rawCost) * 100;
            } else if (sortKey === 'city') {
                valA = a.bestCity;
                valB = b.bestCity;
                return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            } else if (sortKey === 'recency') {
                valA = a.recency || 999999;
                valB = b.recency || 999999;
            } else {
                valA = a.profitNoFocus;
                valB = b.profitNoFocus;
            }
            
            return sortDir === 'asc' ? valA - valB : valB - valA;
        });

        tbody.innerHTML = refineData.map(item => {
            const roiNoFocus = ((item.profitNoFocus / item.rawCost) * 100).toFixed(0);
            const roiFocus = ((item.profitFocus / item.rawCost) * 100).toFixed(0);
            
            let tipHtml = '';
            if (item.profitNoFocus > 3000) {
                tipHtml = `<div class="bg-green-500/10 border border-green-500/30 rounded p-2">
                    <div class="text-green-400 font-bold text-xs mb-1"><i class="fa-solid fa-fire mr-1"></i>SÜPER KÂR!</div>
                    <div class="text-gray-300 text-[10px]">Hemen al, refine et, sat!</div>
                </div>`;
            } else if (item.profitNoFocus > 1000) {
                tipHtml = `<div class="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                    <div class="text-blue-400 font-semibold text-xs mb-1"><i class="fa-solid fa-check mr-1"></i>İYİ KÂR</div>
                    <div class="text-gray-300 text-[10px]">Focus ile daha fazla kazan!</div>
                </div>`;
            } else if (item.profitFocus > 1000) {
                tipHtml = `<div class="bg-purple-500/10 border border-purple-500/30 rounded p-2">
                    <div class="text-purple-400 font-semibold text-xs mb-1"><i class="fa-solid fa-bolt mr-1"></i>FOCUS GEREKLİ</div>
                    <div class="text-gray-300 text-[10px]">Sadece Focus ile kârlı</div>
                </div>`;
            } else {
                tipHtml = `<div class="text-gray-500 text-[10px]"><i class="fa-solid fa-times-circle mr-1"></i>Kârsız</div>`;
            }
            
            return `<tr class="hover:bg-white/5 transition-colors border-b border-gray-700/50">
                <td class="p-3 border-r border-gray-800/50">
                    <div class="flex items-center">
                        <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" class="w-10 h-10 bg-[#0a0d14] rounded border border-gray-700 p-0.5 mr-3"
                             data-item="${item.rawId}"
                             data-quality="1"
                             data-size="64"
                             onerror="this.src=window.albionImageCache.getPlaceholderUrl()">
                        <div>
                            <div class="font-bold text-white text-xs">${item.rawName}</div>
                            <div class="text-gray-500 text-[9px]">→ ${item.processedName}</div>
                        </div>
                    </div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-green-400 font-bold text-xs">${item.rawCost.toLocaleString()} 🥈</div>
                    <div class="text-gray-500 text-[9px]">(100 adet)</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-blue-400 font-bold text-xs">${item.processedRevenue.toLocaleString()} 🥈</div>
                    <div class="text-gray-500 text-[9px]">(${item.yield} adet)</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="font-black ${item.profitNoFocus > 0 ? 'text-yellow-400' : 'text-red-400'} text-base">
                        ${item.profitNoFocus > 0 ? '+' : ''}${item.profitNoFocus.toLocaleString()} 🥈
                    </div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="font-black text-green-400 text-base">
                        +${item.profitFocus.toLocaleString()} 🥈
                    </div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-orange-400 font-bold text-xs">${roiNoFocus}%</div>
                    <div class="text-green-400 text-[9px]">Focus: ${roiFocus}%</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-purple-400 font-semibold text-xs"><i class="fa-solid fa-map-marker-alt mr-1"></i>${item.bestCity}</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <span class="font-mono font-bold text-xs ${item.recency < 30 ? 'text-green-400' : (item.recency < 120 ? 'text-yellow-400' : 'text-red-400')}">
                        <i class="fa-solid fa-clock mr-1"></i>${getTimeAgoStr(item.recency || 999999)}
                    </span>
                </td>
                <td class="p-3">
                    ${tipHtml}
                </td>
            </tr>`;
        }).join('');
    };
    
    // Refine tablosu sıralama
    document.querySelectorAll('#refineHeaders th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const sortKey = th.getAttribute('data-sort');
            if(refineSort.by === sortKey) { 
                refineSort.dir = refineSort.dir === 'asc' ? 'desc' : 'asc'; 
            } else { 
                refineSort.by = sortKey; 
                refineSort.dir = (sortKey === 'city' || sortKey === 'recency') ? 'asc' : 'desc'; 
            }
                
            // Sıralama ikonlarını güncelle
            document.querySelectorAll('#refineHeaders .fa-sort').forEach(icon => {
                icon.className = 'fa-solid fa-sort ml-1';
            });
            const activeIcon = th.querySelector('.fa-sort');
            if (activeIcon) {
                activeIcon.className = `fa-solid fa-sort-${refineSort.dir === 'asc' ? 'up' : 'down'} ml-1`;
            }
                
            renderRefineTable();
        });
    });
    
    document.getElementById('btnFetchRefine').addEventListener('click', async () => {
        const loading = document.getElementById('refineLoading');
        const resArea = document.getElementById('refineResultArea');
        
        resArea.classList.add('hidden');
        loading.classList.remove('hidden');
        refineData = [];
        
        try {
            const domain = window.getAlbionApiDomain ? window.getAlbionApiDomain() : 'europe.albion-online-data.com';
            const rawMaterials = Object.keys(REFINE_MAPPING);
            const processedMaterials = Object.values(REFINE_MAPPING).map(m => m.processed);
            
            // Tüm ham ve işlenmiş malzemelerin fiyatlarını çek
            const allItems = [...rawMaterials, ...processedMaterials].map(m => `T6_${m}`).join(',');
            const locations = encodeURIComponent("Lymhurst,Bridgewatch,Fort Sterling,Martlock,Thetford,Caerleon,Arthur's Rest,Morgana's Rest,Merlyn's Rest");
            const url = `https://${domain}/api/v2/stats/prices/${allItems}.json?locations=${locations}`;
            
            const data = await window.fetchWithProxies(url);
            
            if (data && data.length > 0) {
                // Fiyatları grupla
                const prices = {};
                const timestamps = {};
                data.forEach(d => {
                    if (!prices[d.item_id]) prices[d.item_id] = {};
                    if (!timestamps[d.item_id]) timestamps[d.item_id] = {};
                    if (d.sell_price_min > 0 && getMins(d.sell_price_min_date) <= 45) {
                        prices[d.item_id][d.city] = d.sell_price_min;
                        timestamps[d.item_id][d.city] = d.sell_price_min_date;
                    }
                });
                
                // Her refine işlemi için kâr hesapla
                for (const [rawId, mapping] of Object.entries(REFINE_MAPPING)) {
                    const fullRawId = `T6_${rawId}`;
                    const fullProcessedId = `T6_${mapping.processed}`;
                    
                    const rawPrices = prices[fullRawId] || {};
                    const processedPrices = prices[fullProcessedId] || {};
                    
                    // En ucuz ham malzeme şehrini bul
                    let bestRawCity = null;
                    let bestRawPrice = Infinity;
                    for (const [city, price] of Object.entries(rawPrices)) {
                        if (price < bestRawPrice) {
                            bestRawPrice = price;
                            bestRawCity = city;
                        }
                    }
                    
                    // En pahalı işlenmiş satış şehrini bul
                    let bestProcessedCity = null;
                    let bestProcessedPrice = 0;
                    for (const [city, price] of Object.entries(processedPrices)) {
                        if (price > bestProcessedPrice) {
                            bestProcessedPrice = price;
                            bestProcessedCity = city;
                        }
                    }
                    
                    if (bestRawPrice === Infinity || bestProcessedPrice === 0) continue;
                    
                    // 100 adet ham malzeme maliyeti
                    const rawCost = bestRawPrice * 100;
                    
                    // Focus'suz: 60 adet işlenmiş
                    const yieldNoFocus = 60;
                    const revenueNoFocus = bestProcessedPrice * yieldNoFocus;
                    const profitNoFocus = Math.floor(revenueNoFocus * 0.935) - rawCost; // %6.5 vergi
                    
                    // Focus'lu: 80 adet işlenmiş
                    const yieldFocus = 80;
                    const revenueFocus = bestProcessedPrice * yieldFocus;
                    const profitFocus = Math.floor(revenueFocus * 0.935) - rawCost;
                    
                    refineData.push({
                        rawId: fullRawId,
                        rawName: rawId,
                        processedName: mapping.processed,
                        rawCost,
                        processedRevenue: revenueNoFocus,
                        yield: yieldNoFocus,
                        profitNoFocus,
                        profitFocus,
                        bestCity: bestRawCity,
                        sellCity: bestProcessedCity,
                        recency: getMins(timestamps[fullRawId]?.[bestRawCity])
                    });
                }
            }
            
            renderRefineTable();
            resArea.classList.remove('hidden');
        } catch (e) {
            console.error('Refine hesaplama hatası:', e);
            document.getElementById('refineTableBody').innerHTML = `<tr><td colspan="8" class="text-center p-8 text-red-400">Veri çekilemedi.</td></tr>`;
        } finally {
            loading.classList.add('hidden');
        }
    });

    // === SEKME 5: SATIŞ İSTATİSTİKLERİ ===
    const renderStatsTable = () => {
        const tbody = document.getElementById('statsTableBody');
        const thead = document.getElementById('statsHeaders');
        if(!tbody || !thead) return;

        if (statsData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center p-8 text-gray-500"><i class="fa-solid fa-ghost text-2xl mb-2 opacity-50"></i><br>Veri bulunamadı.</td></tr>`;
            return;
        }

        thead.innerHTML = `<tr class="border-b border-gray-700 bg-gray-800/50">
            <th class="p-3 text-left text-xs font-bold text-gray-400 uppercase cursor-pointer hover:text-white" data-sort="sold"><i class="fa-solid fa-fire mr-1"></i>SATILAN ADET <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-green-400 uppercase cursor-pointer hover:text-white" data-sort="revenue"><i class="fa-solid fa-coins mr-1"></i>TOPLAM GELİR <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-yellow-400 uppercase cursor-pointer hover:text-white" data-sort="avgPrice"><i class="fa-solid fa-chart-line mr-1"></i>ORTALAMA FİYAT <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-purple-400 uppercase">EN DÜŞÜK</th>
            <th class="p-3 text-xs font-bold text-red-400 uppercase">EN YÜKSEK</th>
            <th class="p-3 text-xs font-bold text-blue-400 uppercase">TREND</th>
            <th class="p-3 text-xs font-bold text-cyan-400 uppercase">AI ÖNERİSİ</th>
        </tr>`;

        // Sıralama uygula
        const sortKey = statsFilters.sort;
        statsData.sort((a, b) => {
            if (sortKey === 'sold') return b.soldCount - a.soldCount;
            if (sortKey === 'revenue') return b.totalRevenue - a.totalRevenue;
            if (sortKey === 'avgPrice') return b.avgPrice - a.avgPrice;
            return 0;
        });

        tbody.innerHTML = statsData.map((item, index) => {
            // Trend hesapla
            let trendHtml = '';
            if (item.soldCount > 100) {
                trendHtml = `<span class="text-green-400 font-bold"><i class="fa-solid fa-arrow-trend-up mr-1"></i>YÜKSEK</span>`;
            } else if (item.soldCount > 50) {
                trendHtml = `<span class="text-blue-400 font-semibold"><i class="fa-solid fa-arrow-right mr-1"></i>ORTA</span>`;
            } else {
                trendHtml = `<span class="text-gray-400"><i class="fa-solid fa-arrow-trend-down mr-1"></i>DÜŞÜK</span>`;
            }
            
            // AI Önerisi oluştur
            let aiTipHtml = '';
            const revenuePerUnit = item.totalRevenue / item.soldCount;
            
            if (item.soldCount > 100 && item.avgPrice > 5000) {
                aiTipHtml = `<div class="bg-green-500/10 border border-green-500/30 rounded p-2">
                    <div class="text-green-400 font-bold text-xs mb-1"><i class="fa-solid fa-fire mr-1"></i>ÇOK SATAN!</div>
                    <div class="text-gray-300 text-[10px]">Yüksek talep + yüksek fiyat</div>
                    <div class="text-green-400 text-[9px] mt-1\\">→ Bu eşyayı stokla!</div>
                </div>`;
            } else if (item.soldCount > 100 && item.avgPrice <= 5000) {
                aiTipHtml = `<div class="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                    <div class="text-blue-400 font-semibold text-xs mb-1"><i class="fa-solid fa-chart-line mr-1\\"></i>HACIM KÂRI</div>
                    <div class="text-gray-300 text-[10px]">Çok satıyor, düşük fiyat</div>
                    <div class="text-blue-400 text-[9px] mt-1\\">→ Bulk al, hızlı sat!</div>
                </div>`;
            } else if (item.soldCount <= 100 && item.avgPrice > 10000) {
                aiTipHtml = `<div class="bg-purple-500/10 border border-purple-500/30 rounded p-2">
                    <div class="text-purple-400 font-semibold text-xs mb-1"><i class="fa-solid fa-gem mr-1\\"></i>PREMIUM</div>
                    <div class="text-gray-300 text-[10px]">Az satan, yüksek fiyat</div>
                    <div class="text-purple-400 text-[9px] mt-1\\">→ Lüks pazar fırsatı</div>
                </div>`;
            } else if (item.totalRevenue > 500000) {
                aiTipHtml = `<div class="bg-amber-500/10 border border-amber-500/30 rounded p-2">
                    <div class="text-amber-400 font-semibold text-xs mb-1"><i class="fa-solid fa-sack-dollar mr-1\\"></i>YÜKSEK GELİR</div>
                    <div class="text-gray-300 text-[10px]">Toplam gelir yüksek</div>
                    <div class="text-amber-400 text-[9px] mt-1\\">→ Güvenilir yatırım</div>
                </div>`;
            } else {
                aiTipHtml = `<div class="text-gray-500 text-[10px]"><i class="fa-solid fa-info-circle mr-1\\"></i>Normal performans</div>`;
            }
            
            // Popülerlik rozeti
            let badge = '';
            if (index === 0) badge = `<span class="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-1.5 py-0.5 rounded text-[8px] font-black ml-2\\">#1 BEST</span>`;
            else if (index < 3) badge = `<span class="bg-gray-400/20 text-gray-300 border border-gray-400/30 px-1.5 py-0.5 rounded text-[8px] font-bold ml-2\\">TOP ${index + 1}</span>`;
            
            return `<tr class="hover:bg-white/5 transition-colors border-b border-gray-700/50">
                <td class="p-3 border-r border-gray-800/50">
                    <div class="flex items-center">
                        <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" class="w-10 h-10 bg-[#0a0d14] rounded border border-gray-700 p-0.5 mr-3"
                             data-item="${item.itemId}"
                             data-quality="1"
                             data-size="64"
                             onerror="this.src=window.albionImageCache.getPlaceholderUrl()">
                        <div>
                            <div class="font-bold text-white text-xs">${item.itemName}${badge}</div>
                            <div class="text-gray-500 text-[9px]">${item.category}</div>
                        </div>
                    </div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-blue-400 font-bold text-base">${item.soldCount.toLocaleString()}</div>
                    <div class="text-gray-500 text-[9px]">adet</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-green-400 font-bold text-sm">${item.totalRevenue.toLocaleString()} 🥈</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-yellow-400 font-bold text-xs">${item.avgPrice.toLocaleString()} 🥈</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-purple-400 font-semibold text-xs">${item.minPrice.toLocaleString()} 🥈</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-red-400 font-semibold text-xs">${item.maxPrice.toLocaleString()} 🥈</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    ${trendHtml}
                </td>
                <td class="p-3">
                    ${aiTipHtml}
                </td>
            </tr>`;
        }).join('');
    };

    // Satış İstatistikleri sıralama
    document.querySelectorAll('#statsHeaders th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const sortKey = th.getAttribute('data-sort');
            if(statsFilters.sort === sortKey) { 
                // Aynı sütuna tıklandı, yön değiştir
                // Ama şimdilik sadece azalan destekliyoruz
            } else { 
                statsFilters.sort = sortKey;
            }
            
            // Sıralama ikonlarını güncelle
            document.querySelectorAll('#statsHeaders .fa-sort').forEach(icon => {
                icon.className = 'fa-solid fa-sort ml-1';
            });
            const activeIcon = th.querySelector('.fa-sort');
            if (activeIcon) {
                // Varsayılan olarak azalan
                activeIcon.className = 'fa-solid fa-sort-down ml-1';
            }
            
            // Select'i de güncelle
            document.getElementById('statsSort').value = sortKey;
            
            renderStatsTable();
        });
    });

    const updateStatsSummary = () => {
        const totalSold = statsData.reduce((sum, item) => sum + item.soldCount, 0);
        const totalRevenue = statsData.reduce((sum, item) => sum + item.totalRevenue, 0);
        const avgPrice = statsData.length > 0 ? statsData.reduce((sum, item) => sum + item.avgPrice, 0) / statsData.length : 0;
        const topItem = statsData.length > 0 ? statsData[0].itemName : '-';
        
        document.getElementById('statsTotalSold').textContent = totalSold.toLocaleString();
        document.getElementById('statsTotalRevenue').textContent = totalRevenue.toLocaleString() + ' 🥈';
        document.getElementById('statsAvgPrice').textContent = Math.floor(avgPrice).toLocaleString() + ' 🥈';
        document.getElementById('statsTopItem').textContent = topItem;
    };

    document.getElementById('btnFetchStats').addEventListener('click', async () => {
        const loading = document.getElementById('statsLoading');
        const resArea = document.getElementById('statsResultArea');
        const summaryCards = document.getElementById('statsSummaryCards');
        
        resArea.classList.add('hidden');
        summaryCards.classList.add('hidden');
        loading.classList.remove('hidden');
        statsData = [];
        
        // Filtreleri güncelle
        statsFilters.timeRange = document.getElementById('statsTimeRange').value;
        statsFilters.category = document.getElementById('statsCategory').value;
        statsFilters.sort = document.getElementById('statsSort').value;
        
        try {
            const domain = window.getAlbionApiDomain ? window.getAlbionApiDomain() : 'europe.albion-online-data.com';
            
            // İstatistik API'si (Albion Data Project)
            // Not: Bu API tarih bazlı satış verisi sağlamaz, bu yüzden prices API kullanacağız
            const allItems = getAllItemsFlat()
                .flat()
                .filter(item => !["QUESTITEM_TOKEN_SIPHONED_ENERGY", "QUESTITEM_TOKEN_AVALON", "QUESTITEM_TOKEN_ROYAL", 
                         "RUNE", "SOUL", "RELIC", "SHARD_AVALONIAN", "ESSENCE"].includes(item.id))
                .slice(0, 50) // İlk 50 eşya (API limiti)
                .map(item => `T6_${item.id}`)
                .join(',');
            
            const locations = encodeURIComponent('Lymhurst,Bridgewatch,Fort Sterling,Martlock,Thetford,Caerleon');
            const url = `https://${domain}/api/v2/stats/prices/${allItems}.json?locations=${locations}`;
            
            const data = await window.fetchWithProxies(url);
            
            if (data && data.length > 0) {
                // Grupla ve analiz et
                const grouped = {};
                data.forEach(d => {
                    if (!grouped[d.item_id]) {
                        grouped[d.item_id] = { 
                            prices: [], 
                            cities: new Set(),
                            itemId: d.item_id
                        };
                    }
                    if (d.sell_price_min > 0 && getMins(d.sell_price_min_date) <= 45) {
                        grouped[d.item_id].prices.push(d.sell_price_min);
                        grouped[d.item_id].cities.add(d.city);
                    }
                });
                
                // Her eşya için istatistik
                for (const [itemId, info] of Object.entries(grouped)) {
                    if (info.prices.length === 0) continue;
                    
                    const sorted = info.prices.sort((a, b) => a - b);
                    const totalRevenue = sorted.reduce((sum, p) => sum + p, 0);
                    const avgPrice = Math.floor(totalRevenue / sorted.length);
                    
                    // Kategori bul
                    const baseId = itemId.replace('T6_', '');
                    let category = 'Diğer';
                    for (const [catName, subCategories] of Object.entries(ARB_CATEGORIES)) {
                        for (const subCat of Object.values(subCategories)) {
                            if (subCat.find(i => i.id === baseId)) {
                                category = catName;
                                break;
                            }
                        }
                        if (category !== 'Diğer') break;
                    }
                    
                    // Filtre uygula
                    if (statsFilters.category !== 'ALL') {
                        const filterMap = {
                            'Weapons': 'Silahlar',
                            'Armor': 'Zırhlar',
                            'Gather': 'Gather',
                            'Consumables': 'Sarf'
                        };
                        if (!category.includes(filterMap[statsFilters.category])) continue;
                    }
                    
                    // Satış adedi tahmini (şehir sayısı * 10 baz alındı)
                    const estimatedSold = info.cities.size * 10;
                    
                    statsData.push({
                        itemId,
                        itemName: (() => {
                            const catData = ARB_CATEGORIES[category];
                            if (catData) {
                                for (const subCat of Object.values(catData)) {
                                    const item = subCat.find(i => i.id === baseId);
                                    if (item) return item.name;
                                }
                            }
                            return baseId;
                        })(),
                        category,
                        soldCount: estimatedSold,
                        totalRevenue,
                        avgPrice,
                        minPrice: sorted[0],
                        maxPrice: sorted[sorted.length - 1]
                    });
                }
            }
            
            renderStatsTable();
            updateStatsSummary();
            resArea.classList.remove('hidden');
            summaryCards.classList.remove('hidden');
        } catch (e) {
            console.error('İstatistik hatası:', e);
            document.getElementById('statsTableBody').innerHTML = `<tr><td colspan="7" class="text-center p-8 text-red-400">Veri çekilemedi.</td></tr>`;
        } finally {
            loading.classList.add('hidden');
        }
    });

    // === SEKME 6: CRAFT HESAPLAYICI ===
    const renderCraftTable = () => {
        const tbody = document.getElementById('craftTableBody');
        const thead = document.getElementById('craftHeaders');
        if(!tbody || !thead) return;

        if (craftData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center p-8 text-gray-500"><i class="fa-solid fa-ghost text-2xl mb-2 opacity-50"></i><br>Veri bulunamad.</td></tr>`;
            return;
        }

        thead.innerHTML = `<tr class="border-b border-gray-700 bg-gray-800/50">
            <th class="p-3 text-left text-xs font-bold text-gray-400 uppercase">CRAFT EDİLECEK EŞYA</th>
            <th class="p-3 text-xs font-bold text-red-400 uppercase">MALZEME MALİYETİ</th>
            <th class="p-3 text-xs font-bold text-blue-400 uppercase">SATIŞ FİYATI</th>
            <th class="p-3 text-xs font-bold text-yellow-400 uppercase">NET KÂR</th>
            <th class="p-3 text-xs font-bold text-orange-400 uppercase">ROI</th>
            <th class="p-3 text-xs font-bold text-green-400 uppercase">CRAFT SÜRESİ</th>
            <th class="p-3 text-xs font-bold text-purple-400 uppercase">EN İYİ ŞEHİR</th>
            <th class="p-3 text-xs font-bold text-cyan-400 uppercase">AI ÖNERİ</th>
        </tr>`;

        craftData.sort((a, b) => b.profit - a.profit);

        tbody.innerHTML = craftData.map(item => {
            const roi = ((item.profit / item.materialCost) * 100).toFixed(0);
            const craftMinutes = Math.floor(item.craftTime / 60);
            
            let tipHtml = '';
            if (item.profit > 10000) {
                tipHtml = `<div class="bg-green-500/10 border border-green-500/30 rounded p-2">
                    <div class="text-green-400 font-bold text-xs mb-1"><i class="fa-solid fa-fire mr-1"></i>MÜKEMMEL!</div>
                    <div class="text-gray-300 text-[10px]">ROI: ${roi}% → Craft et, sat!</div>
                    <div class="text-gray-400 text-[9px] mt-1">+Craft Puan</div>
                </div>`;
            } else if (item.profit > 5000) {
                tipHtml = `<div class="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                    <div class="text-blue-400 font-semibold text-xs mb-1"><i class="fa-solid fa-check mr-1"></i>İYİ KÂR</div>
                    <div class="text-gray-300 text-[10px]">ROI: ${roi}% → Değerlendir</div>
                </div>`;
            } else if (item.profit > 0) {
                tipHtml = `<div class="bg-amber-500/10 border border-amber-500/30 rounded p-2">
                    <div class="text-amber-400 font-semibold text-xs mb-1"><i class="fa-solid fa-info-circle mr-1"></i>DÜŞÜK KÂR</div>
                    <div class="text-gray-300 text-[10px]">ROI: ${roi}% → Sadece focus ile</div>
                </div>`;
            } else {
                tipHtml = `<div class="text-gray-500 text-[10px]"><i class="fa-solid fa-times-circle mr-1"></i>KÂRSIZ</div>`;
            }
            
            return `<tr class="hover:bg-white/5 transition-colors border-b border-gray-700/50">
                <td class="p-3 border-r border-gray-800/50">
                    <div class="flex items-center">
                        <img src="https://render.albiononline.com/v1/item/${item.itemId}.png" class="w-10 h-10 bg-[#0a0d14] rounded border border-gray-700 p-0.5 mr-3">
                        <div>
                            <div class="font-bold text-white text-xs">${item.itemName}</div>
                            <div class="text-gray-500 text-[9px]">${item.materialCount} malzeme</div>
                        </div>
                    </div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-red-400 font-bold text-xs">${item.materialCost.toLocaleString()} 🥈</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-blue-400 font-bold text-xs">${item.sellPrice.toLocaleString()} 🥈</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="font-black ${item.profit > 0 ? 'text-yellow-400' : 'text-red-400'} text-base">
                        ${item.profit > 0 ? '+' : ''}${item.profit.toLocaleString()} 🥈
                    </div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-orange-400 font-bold text-xs">${roi}%</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-green-400 font-semibold text-xs"><i class="fa-solid fa-clock mr-1"></i>${craftMinutes}dk</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-purple-400 font-semibold text-xs"><i class="fa-solid fa-map-marker-alt mr-1"></i>${item.bestCity}</div>
                </td>
                <td class="p-3">
                    ${tipHtml}
                </td>
            </tr>`;
        }).join('');
    };

    document.getElementById('btnFetchCraft').addEventListener('click', async () => {
        const loading = document.getElementById('craftLoading');
        const resArea = document.getElementById('craftResultArea');
        
        resArea.classList.add('hidden');
        loading.classList.remove('hidden');
        craftData = [];
        
        try {
            const domain = window.getAlbionApiDomain ? window.getAlbionApiDomain() : 'europe.albion-online-data.com';
            
            // Tüm craft edilecek eşyalar ve malzemeler
            const craftedItems = Object.keys(CRAFT_MAPPING);
            const allMaterials = new Set();
            Object.values(CRAFT_MAPPING).forEach(craft => {
                Object.keys(craft.materials).forEach(mat => allMaterials.add(mat));
            });
            
            const allItems = [...craftedItems, ...Array.from(allMaterials)].join(',');
            const locations = encodeURIComponent("Lymhurst,Bridgewatch,Fort Sterling,Martlock,Thetford,Caerleon,Arthur's Rest,Morgana's Rest,Merlyn's Rest");
            const url = `https://${domain}/api/v2/stats/prices/${allItems}.json?locations=${locations}`;
            
            const data = await window.fetchWithProxies(url);
            
            if (data && data.length > 0) {
                // Fiyatları grupla
                const prices = {};
                data.forEach(d => {
                    if (!prices[d.item_id]) prices[d.item_id] = {};
                    if (d.sell_price_min > 0 && getMins(d.sell_price_min_date) <= 45) {
                        prices[d.item_id][d.city] = d.sell_price_min;
                    }
                });
                
                // Her craft işlemi için kâr hesapla
                for (const [itemId, craftInfo] of Object.entries(CRAFT_MAPPING)) {
                    // Malzeme maliyetini hesapla
                    let totalMaterialCost = 0;
                    let materialCount = 0;
                    let allMaterialsFound = true;
                    
                    for (const [matId, matQty] of Object.entries(craftInfo.materials)) {
                        const matPrices = prices[matId] || {};
                        const matValues = Object.values(matPrices);
                        if (matValues.length === 0) {
                            allMaterialsFound = false;
                            break;
                        }
                        const avgMatPrice = matValues.reduce((a, b) => a + b, 0) / matValues.length;
                        totalMaterialCost += avgMatPrice * matQty;
                        materialCount += matQty;
                    }
                    
                    if (!allMaterialsFound || totalMaterialCost === 0) continue;
                    
                    // Satış fiyatını bul (en yüksek)
                    const sellPrices = prices[itemId] || {};
                    const sellValues = Object.values(sellPrices);
                    if (sellValues.length === 0) continue;
                    
                    const bestSellPrice = Math.max(...sellValues);
                    const bestCity = Object.keys(sellPrices).find(city => prices[itemId][city] === bestSellPrice);
                    
                    // Kâr hesapla (vergi dahil)
                    const profit = Math.floor(bestSellPrice * 0.935) - totalMaterialCost;
                    
                    craftData.push({
                        itemId,
                        itemName: (() => {
                            const baseId = itemId.replace('T6_', '');
                            const weaponCat = ARB_CATEGORIES['🗡️ Silahlar (Weapons)'];
                            const armorCat = ARB_CATEGORIES['🛡️ Zırhlar (Armor)'];
                            const accessoryCat = ARB_CATEGORIES['🎒 Aksesuarlar (Accessories)'];
                            
                            for (const cat of [weaponCat, armorCat, accessoryCat]) {
                                if (cat) {
                                    for (const subCat of Object.values(cat)) {
                                        const item = subCat.find(i => i.id === baseId);
                                        if (item) return item.name;
                                    }
                                }
                            }
                            return baseId;
                        })(),
                        materialCost: Math.floor(totalMaterialCost),
                        sellPrice: bestSellPrice,
                        profit,
                        craftTime: craftInfo.craftTime,
                        materialCount,
                        bestCity: bestCity || 'Bilinmiyor'
                    });
                }
            }
            
            renderCraftTable();
            resArea.classList.remove('hidden');
        } catch (e) {
            console.error('Craft hesaplama hatası:', e);
            document.getElementById('craftTableBody').innerHTML = `<tr><td colspan="8" class="text-center p-8 text-red-400">Veri çekilemedi.</td></tr>`;
        } finally {
            loading.classList.add('hidden');
        }
    });

    // Otomatik İlk Çalıştırma
    setTimeout(() => {
        const fetchOpp = document.getElementById('btnFetchOpp');
        if(fetchOpp) fetchOpp.click();
    }, 1000);
    
    console.log('✅ Arbitrage modülü yüklendi!');
}

// Resimleri lazy load ile yukle
let _arbImgObserver = null;
function loadArbitrageImagesLazy() {
  if (!_arbImgObserver) {
    _arbImgObserver = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.item && !img.dataset.loaded) {
            img.dataset.loaded = "1";
            try {
              const imageUrl = await window.getItemImage(
                img.dataset.item, 
                parseInt(img.dataset.quality) || 1, 
                parseInt(img.dataset.size) || 128
              );
              img.src = imageUrl;
            } catch (e) {
              if (window.albionImageCache) img.src = window.albionImageCache.getPlaceholderUrl();
            }
            _arbImgObserver.unobserve(img);
          }
        }
      });
    });
  }
  
  document.querySelectorAll('#arbitrageApp img[data-item]:not([data-loaded="1"])').forEach(img => {
    _arbImgObserver.observe(img);
  });
}

document.addEventListener('DOMContentLoaded', loadArbitrageImagesLazy);

const arbitrageImageObserver = new MutationObserver(() => {
  loadArbitrageImagesLazy();
});

// Güvenli Observer başlatma
setTimeout(() => {
  const appContainer = document.getElementById('arbitrageApp');
  if(appContainer) {
    arbitrageImageObserver.observe(appContainer, {
      childList: true,
      subtree: true
    });
  }
}, 1000);

// Sayfa yüklendiğinde otomatik çalıştır
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadArbitrageModule);
} else {
  loadArbitrageModule();
}
