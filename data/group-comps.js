// AoT-PNASF — Grup İçeriği Meta Kompozisyonları
// Kaynak: 2026 meta araştırması (metabattle, albiononlinegrind, resmi Dragonfire/Realm Divided patch notları)
// Her "id" AO_ITEMS taban ID'sidir; kademe (T4-T8) çalışma zamanında AO_ITEMS.tiers üzerinden çözülür.
// Tüm ID'ler render.albiononline.com görselleriyle doğrulanmıştır.
window.AO_GROUP_COMPS = [
  {
    id: 'group-dungeon',
    name: 'Grup Zindanı (5-6 Kişi)',
    players: '5-6',
    difficulty: 'Orta',
    strategy: "Klasik tank-and-spank: Tank pull'ları toplar, Destek-DPS hedefi deler (armor shred), Uzak DPS topluluğu temizler. Kuzey/Doğu BZ zindanlarında 8.2-8.4 aralığı en verimli bandır; pull'ları duvara sıkıştırmayın, alan daraltan mob'lar dışarıda bırakın.",
    roles: [
      {
        roleName: 'Ana Tank', count: 1,
        note: 'Pulları topla, Enfeeble Aura ile gruba alan ver, patronlarda threat tut.',
        items: {
          weapon: { name: 'Incubus Mace', id: 'MAIN_MACE_HELL' },
          offhand: { name: 'Sarcophagus', id: 'OFF_TOWERSHIELD_UNDEAD' },
          head: { name: 'Guardian Helmet', id: 'HEAD_PLATE_SET3' },
          chest: { name: 'Guardian Armor', id: 'ARMOR_PLATE_SET3' },
          shoes: { name: 'Royal Shoes', id: 'SHOES_LEATHER_ROYAL' },
          cape: { name: 'Martlock Cape', id: 'CAPEITEM_FW_MARTLOCK' },
          food: { name: 'Goat Sandwich', id: 'MEAL_SANDWICH' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Şifacı', count: 1,
        note: 'Holy heal; Graveguard Helmet ile kritik anlarda Sacrifice, tenacity ayakları i-frame verir.',
        items: {
          weapon: { name: 'Hallowfall', id: 'MAIN_HOLYSTAFF_AVALON' },
          offhand: { name: 'Celestial Censer', id: 'OFF_CENSER_AVALON' },
          head: { name: 'Graveguard Helmet', id: 'HEAD_PLATE_UNDEAD' },
          chest: { name: 'Royal Robe', id: 'ARMOR_CLOTH_ROYAL' },
          shoes: { name: 'Shoes of Tenacity', id: 'SHOES_LEATHER_AVALON' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'Destek-DPS (Pierce)', count: 1,
        note: 'Realmbreaker ile zırh delme; Royal Armor parti mana basar.',
        items: {
          weapon: { name: 'Realmbreaker', id: '2H_AXE_AVALON' },
          head: { name: 'Stalker Hood', id: 'HEAD_LEATHER_MORGANA' },
          chest: { name: 'Royal Armor', id: 'ARMOR_PLATE_ROYAL' },
          shoes: { name: 'Cultist Sandals', id: 'SHOES_CLOTH_MORGANA' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Uzak DPS (AoE)', count: 1,
        note: 'Weeping Repeater ile kalabalık pulları erit.',
        items: {
          weapon: { name: 'Weeping Repeater', id: '2H_REPEATINGCROSSBOW_UNDEAD' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Yakın DPS', count: 1,
        note: 'Twin Slayers ile tek hedefi kes; Specter takımı mobilite verir.',
        items: {
          weapon: { name: 'Twin Slayers', id: '2H_DAGGERPAIR_CRYSTAL' },
          head: { name: 'Specter Hood', id: 'HEAD_LEATHER_UNDEAD' },
          chest: { name: 'Specter Jacket', id: 'ARMOR_LEATHER_UNDEAD' },
          shoes: { name: 'Specter Shoes', id: 'SHOES_LEATHER_UNDEAD' },
          cape: { name: 'Smuggler Cape', id: 'CAPEITEM_SMUGGLER' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      }
    ]
  },
  {
    id: 'group-camp',
    name: 'Grup Kampı (5 Kişi)',
    players: '5',
    difficulty: 'Düşük-Orta',
    strategy: "Hızlı fame farmı: Kamp moblarını hızlı topla, Shadowcaller debuff'ı ile Uzak DPS patlatır. Pull sürekliliği önemlidir — duraklamayın, mavi/yellow zone kamp rotalarında saatlik verim en yüksektir.",
    roles: [
      {
        roleName: 'Tank', count: 1,
        note: "Hızlı toplama; Guardian Armor koruma aura'sı ile grubu ayakta tutar.",
        items: {
          weapon: { name: 'Incubus Mace', id: 'MAIN_MACE_HELL' },
          head: { name: 'Soldier Helmet', id: 'HEAD_PLATE_SET1' },
          chest: { name: 'Guardian Armor', id: 'ARMOR_PLATE_SET3' },
          shoes: { name: 'Hunter Shoes', id: 'SHOES_LEATHER_SET2' },
          cape: { name: 'Martlock Cape', id: 'CAPEITEM_FW_MARTLOCK' },
          food: { name: 'Goat Sandwich', id: 'MEAL_SANDWICH' },
          potion: { name: 'Major Resistance Potion', id: 'POTION_STONESKIN' }
        }
      },
      {
        roleName: 'Şifacı', count: 1,
        note: 'Blight Staff bütçe dostu; geniş alan heal.',
        items: {
          weapon: { name: 'Blight Staff', id: '2H_NATURESTAFF_HELL' },
          head: { name: 'Scholar Cowl', id: 'HEAD_CLOTH_SET1' },
          chest: { name: 'Scholar Robe', id: 'ARMOR_CLOTH_SET1' },
          shoes: { name: 'Scholar Sandals', id: 'SHOES_CLOTH_SET1' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'Destek-DPS (Shadowcaller)', count: 1,
        note: 'Mistcaller off-hand ile yetenek döngüsü; Specter/Royal karışımı mobil ve dayanıklı.',
        items: {
          weapon: { name: 'Shadowcaller', id: 'MAIN_CURSEDSTAFF_AVALON' },
          offhand: { name: 'Mistcaller', id: 'OFF_HORN_KEEPER' },
          head: { name: 'Specter Hood', id: 'HEAD_LEATHER_UNDEAD' },
          chest: { name: 'Royal Jacket', id: 'ARMOR_LEATHER_ROYAL' },
          shoes: { name: 'Stalker Shoes', id: 'SHOES_LEATHER_MORGANA' },
          cape: { name: 'Smuggler Cape', id: 'CAPEITEM_SMUGGLER' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Resistance Potion', id: 'POTION_STONESKIN' }
        }
      },
      {
        roleName: 'Uzak DPS (Blaze)', count: 1,
        note: 'Blazing Staff ile alan hasarı; Druid takımı ile hasar.',
        items: {
          weapon: { name: 'Blazing Staff', id: '2H_INFERNOSTAFF_MORGANA' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Uzak DPS (Mistpiercer)', count: 1,
        note: 'Uzun menzilli tek/alan hasarı; Druid set.',
        items: {
          weapon: { name: 'Mistpiercer', id: '2H_BOW_AVALON' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      }
    ]
  },
  {
    id: 'avalon-dungeon',
    name: 'Avalon Zindanı (7 Kişi)',
    players: '7',
    difficulty: 'Yüksek',
    strategy: "Avalon zindanlarında boss mekaniği her şeydir: trash pull'larında topluluk hasarı, boss'larda kaçış penceresi. Destek-DPS Realmbreaker ile zırh deler, geri kalan4 DPS toplama + tek hedef dengesi kurar. Yeni oyuncular için \"oneshot/clap\" varyantı yerine sürdürülebilir hasar tercih edilir.",
    roles: [
      {
        roleName: 'Ana Tank', count: 1,
        note: 'Incubus + Sarcophagus; boss mekaniklerinde konumlanmayı bozma.',
        items: {
          weapon: { name: 'Incubus Mace', id: 'MAIN_MACE_HELL' },
          offhand: { name: 'Sarcophagus', id: 'OFF_TOWERSHIELD_UNDEAD' },
          head: { name: 'Guardian Helmet', id: 'HEAD_PLATE_SET3' },
          chest: { name: 'Guardian Armor', id: 'ARMOR_PLATE_SET3' },
          shoes: { name: 'Royal Shoes', id: 'SHOES_LEATHER_ROYAL' },
          cape: { name: 'Martlock Cape', id: 'CAPEITEM_FW_MARTLOCK' },
          food: { name: 'Goat Sandwich', id: 'MEAL_SANDWICH' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Şifacı', count: 1,
        note: 'Hallowfall; patlama anlarında Sacrifice kullan.',
        items: {
          weapon: { name: 'Hallowfall', id: 'MAIN_HOLYSTAFF_AVALON' },
          offhand: { name: 'Celestial Censer', id: 'OFF_CENSER_AVALON' },
          head: { name: 'Graveguard Helmet', id: 'HEAD_PLATE_UNDEAD' },
          chest: { name: 'Royal Robe', id: 'ARMOR_CLOTH_ROYAL' },
          shoes: { name: 'Shoes of Tenacity', id: 'SHOES_LEATHER_AVALON' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'Destek-DPS (Pierce)', count: 1,
        note: 'Realmbreaker ile boss zırhını del.',
        items: {
          weapon: { name: 'Realmbreaker', id: '2H_AXE_AVALON' },
          head: { name: 'Stalker Hood', id: 'HEAD_LEATHER_MORGANA' },
          chest: { name: 'Royal Armor', id: 'ARMOR_PLATE_ROYAL' },
          shoes: { name: 'Cultist Sandals', id: 'SHOES_CLOTH_MORGANA' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Uzak DPS (AoE)', count: 2,
        note: "Blazing + Weeping ikilisi trash pull'larını eritir.",
        items: {
          weapon: { name: 'Blazing Staff', id: '2H_INFERNOSTAFF_MORGANA' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Uzak DPS (Ok)', count: 1,
        note: 'Mistpiercer ile uzun menzilli güvenli hasar.',
        items: {
          weapon: { name: 'Mistpiercer', id: '2H_BOW_AVALON' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Yakın DPS', count: 1,
        note: 'Twin Slayers ile tek hedef; boss penceresinde burst.',
        items: {
          weapon: { name: 'Twin Slayers', id: '2H_DAGGERPAIR_CRYSTAL' },
          head: { name: 'Specter Hood', id: 'HEAD_LEATHER_UNDEAD' },
          chest: { name: 'Specter Jacket', id: 'ARMOR_LEATHER_UNDEAD' },
          shoes: { name: 'Specter Shoes', id: 'SHOES_LEATHER_UNDEAD' },
          cape: { name: 'Smuggler Cape', id: 'CAPEITEM_SMUGGLER' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      }
    ]
  },
  {
    id: 'avalon-gold',
    name: 'Avalon Altın Sandık · Saf PvE (7 Kişi)',
    players: '7',
    difficulty: 'Yüksek',
    strategy: 'Altın sandık koşularında sadece PvE hasarı ve süreklilik önemli. Permafrost + Boltcasters alan hasarını maksimize eder; dive beklentisi olmadığı için iksirler tam hasar odaklıdır. Sandık odasına girmeden önce tüm trash temizlensin.',
    roles: [
      {
        roleName: 'Ana Tank', count: 1,
        note: 'Sandık odası pullarını kontrollü açar.',
        items: {
          weapon: { name: 'Incubus Mace', id: 'MAIN_MACE_HELL' },
          offhand: { name: 'Sarcophagus', id: 'OFF_TOWERSHIELD_UNDEAD' },
          head: { name: 'Guardian Helmet', id: 'HEAD_PLATE_SET3' },
          chest: { name: 'Guardian Armor', id: 'ARMOR_PLATE_SET3' },
          shoes: { name: 'Royal Shoes', id: 'SHOES_LEATHER_ROYAL' },
          cape: { name: 'Martlock Cape', id: 'CAPEITEM_FW_MARTLOCK' },
          food: { name: 'Goat Sandwich', id: 'MEAL_SANDWICH' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Şifacı', count: 1,
        note: 'Sürekli alan heal; tempo düşmesin.',
        items: {
          weapon: { name: 'Hallowfall', id: 'MAIN_HOLYSTAFF_AVALON' },
          offhand: { name: 'Celestial Censer', id: 'OFF_CENSER_AVALON' },
          head: { name: 'Graveguard Helmet', id: 'HEAD_PLATE_UNDEAD' },
          chest: { name: 'Royal Robe', id: 'ARMOR_CLOTH_ROYAL' },
          shoes: { name: 'Shoes of Tenacity', id: 'SHOES_LEATHER_AVALON' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'Destek-DPS (Pierce)', count: 1,
        note: 'Zırh delme + parti hasar senkronu.',
        items: {
          weapon: { name: 'Realmbreaker', id: '2H_AXE_AVALON' },
          head: { name: 'Stalker Hood', id: 'HEAD_LEATHER_MORGANA' },
          chest: { name: 'Royal Armor', id: 'ARMOR_PLATE_ROYAL' },
          shoes: { name: 'Cultist Sandals', id: 'SHOES_CLOTH_MORGANA' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Uzak DPS (Blaze)', count: 1,
        note: 'Alan hasarı çekirdeği.',
        items: {
          weapon: { name: 'Blazing Staff', id: '2H_INFERNOSTAFF_MORGANA' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Uzak DPS (Permafrost)', count: 1,
        note: 'Buz hasarı + kitle kontrolü.',
        items: {
          weapon: { name: 'Permafrost Prism', id: '2H_ICECRYSTAL_UNDEAD' },
          head: { name: 'Mage Cowl', id: 'HEAD_CLOTH_SET3' },
          chest: { name: 'Mage Robe', id: 'ARMOR_CLOTH_SET3' },
          shoes: { name: 'Mage Sandals', id: 'SHOES_CLOTH_SET3' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Uzak DPS (Boltcasters)', count: 1,
        note: 'Zincir hasarı ile kalabalık pull.',
        items: {
          weapon: { name: 'Boltcasters', id: '2H_DUALCROSSBOW_HELL' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Yakın DPS', count: 1,
        note: 'Tek hedef sandık hasarı.',
        items: {
          weapon: { name: 'Twin Slayers', id: '2H_DAGGERPAIR_CRYSTAL' },
          head: { name: 'Specter Hood', id: 'HEAD_LEATHER_UNDEAD' },
          chest: { name: 'Specter Jacket', id: 'ARMOR_LEATHER_UNDEAD' },
          shoes: { name: 'Specter Shoes', id: 'SHOES_LEATHER_UNDEAD' },
          cape: { name: 'Smuggler Cape', id: 'CAPEITEM_SMUGGLER' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      }
    ]
  },
  {
    id: 'avalon-dive',
    name: 'Avalon Altın & Dive · PvPvE (7 Kişi)',
    players: '7',
    difficulty: 'Çok Yüksek',
    strategy: 'PvPvE modu: Sandık koşusu + karşı grup dive ihtimali. Claw ile catch, Invisibility Potion ile kaçış vardır; Şifacı konumu arkada tutulur. Karşı grup gelirse sandığı bırakıp konumu savunmak genelde daha kârlıdır.',
    roles: [
      {
        roleName: 'Ana Tank', count: 1,
        note: 'Hem mob tankı hem ilk dive karşıtı hat.',
        items: {
          weapon: { name: 'Incubus Mace', id: 'MAIN_MACE_HELL' },
          offhand: { name: 'Sarcophagus', id: 'OFF_TOWERSHIELD_UNDEAD' },
          head: { name: 'Guardian Helmet', id: 'HEAD_PLATE_SET3' },
          chest: { name: 'Guardian Armor', id: 'ARMOR_PLATE_SET3' },
          shoes: { name: 'Royal Shoes', id: 'SHOES_LEATHER_ROYAL' },
          cape: { name: 'Martlock Cape', id: 'CAPEITEM_FW_MARTLOCK' },
          food: { name: 'Goat Sandwich', id: 'MEAL_SANDWICH' },
          potion: { name: 'Invisibility Potion', id: 'POTION_CLEANSE' }
        }
      },
      {
        roleName: 'Şifacı', count: 1,
        note: 'Arka hat; dive anında Invisibility ile hayatta kal.',
        items: {
          weapon: { name: 'Hallowfall', id: 'MAIN_HOLYSTAFF_AVALON' },
          offhand: { name: 'Celestial Censer', id: 'OFF_CENSER_AVALON' },
          head: { name: 'Graveguard Helmet', id: 'HEAD_PLATE_UNDEAD' },
          chest: { name: 'Royal Robe', id: 'ARMOR_CLOTH_ROYAL' },
          shoes: { name: 'Shoes of Tenacity', id: 'SHOES_LEATHER_AVALON' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Invisibility Potion', id: 'POTION_CLEANSE' }
        }
      },
      {
        roleName: 'Catch (Yakalama)', count: 1,
        note: 'Claws ile kaçan düşmanı yakala, ilk hedefi kilitle.',
        items: {
          weapon: { name: 'Claws', id: '2H_CLAWPAIR' },
          head: { name: 'Assassin Hood', id: 'HEAD_LEATHER_SET3' },
          chest: { name: 'Assassin Jacket', id: 'ARMOR_LEATHER_SET3' },
          shoes: { name: 'Assassin Shoes', id: 'SHOES_LEATHER_SET3' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Roast Chicken', id: 'MEAL_ROAST' },
          potion: { name: 'Invisibility Potion', id: 'POTION_CLEANSE' }
        }
      },
      {
        roleName: 'Yakın Burst DPS', count: 1,
        note: 'Deathgivers ile hedef kilitleme hasarı.',
        items: {
          weapon: { name: 'Deathgivers', id: '2H_DUALSICKLE_UNDEAD' },
          head: { name: 'Specter Hood', id: 'HEAD_LEATHER_UNDEAD' },
          chest: { name: 'Specter Jacket', id: 'ARMOR_LEATHER_UNDEAD' },
          shoes: { name: 'Specter Shoes', id: 'SHOES_LEATHER_UNDEAD' },
          cape: { name: 'Smuggler Cape', id: 'CAPEITEM_SMUGGLER' },
          food: { name: 'Roast Chicken', id: 'MEAL_ROAST' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'Uzak DPS', count: 1,
        note: 'Weeping ile hem mob hem düşman hasarı.',
        items: {
          weapon: { name: 'Weeping Repeater', id: '2H_REPEATINGCROSSBOW_UNDEAD' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Destek (Debuff)', count: 1,
        note: 'Realmbreaker ile karşı grubun tankını erit.',
        items: {
          weapon: { name: 'Realmbreaker', id: '2H_AXE_AVALON' },
          head: { name: 'Stalker Hood', id: 'HEAD_LEATHER_MORGANA' },
          chest: { name: 'Royal Armor', id: 'ARMOR_PLATE_ROYAL' },
          shoes: { name: 'Cultist Sandals', id: 'SHOES_CLOTH_MORGANA' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Invisibility Potion', id: 'POTION_CLEANSE' }
        }
      }
    ]
  },
  {
    id: 'hce',
    name: 'HCE · Hardcore Expedition (5 Kişi)',
    players: '5',
    difficulty: 'Yüksek (Mekanik)',
    strategy: 'HCE sabit kompozisyon 1 Tank + 1 Healer + 3 Uzak DPS. Mekanikler önceliklidir: alan kaçışları ve interrupt zamanlaması DPS kaybından önce gelir. Chillhowl/Weeping/Light Crossbow üçlüsü hem kitle hem tek hedef hasarı verir.',
    roles: [
      {
        roleName: 'Ana Tank', count: 1,
        note: 'Mekanik kaçışlarında ayakta kal; Guardian aura şart.',
        items: {
          weapon: { name: 'Incubus Mace', id: 'MAIN_MACE_HELL' },
          offhand: { name: 'Sarcophagus', id: 'OFF_TOWERSHIELD_UNDEAD' },
          head: { name: 'Guardian Helmet', id: 'HEAD_PLATE_SET3' },
          chest: { name: 'Guardian Armor', id: 'ARMOR_PLATE_SET3' },
          shoes: { name: 'Royal Shoes', id: 'SHOES_LEATHER_ROYAL' },
          cape: { name: 'Martlock Cape', id: 'CAPEITEM_FW_MARTLOCK' },
          food: { name: 'Goat Sandwich', id: 'MEAL_SANDWICH' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Şifacı', count: 1,
        note: 'Hallowfall; Sacrifice penceresini boss burstlarına sakla.',
        items: {
          weapon: { name: 'Hallowfall', id: 'MAIN_HOLYSTAFF_AVALON' },
          offhand: { name: 'Celestial Censer', id: 'OFF_CENSER_AVALON' },
          head: { name: 'Graveguard Helmet', id: 'HEAD_PLATE_UNDEAD' },
          chest: { name: 'Royal Robe', id: 'ARMOR_CLOTH_ROYAL' },
          shoes: { name: 'Shoes of Tenacity', id: 'SHOES_LEATHER_AVALON' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'Uzak DPS (Chillhowl)', count: 1,
        note: 'Buz hasarı + kitle yavaşlatma.',
        items: {
          weapon: { name: 'Chillhowl', id: 'MAIN_FROSTSTAFF_AVALON' },
          head: { name: 'Mage Cowl', id: 'HEAD_CLOTH_SET3' },
          chest: { name: 'Mage Robe', id: 'ARMOR_CLOTH_SET3' },
          shoes: { name: 'Mage Sandals', id: 'SHOES_CLOTH_SET3' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Uzak DPS (Weeping)', count: 1,
        note: 'Alan hasarı; kalabalık dalgaları siler.',
        items: {
          weapon: { name: 'Weeping Repeater', id: '2H_REPEATINGCROSSBOW_UNDEAD' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Uzak DPS (Light Crossbow)', count: 1,
        note: 'Tek hedef hasarı + interrupt desteği.',
        items: {
          weapon: { name: 'Light Crossbow', id: 'MAIN_1HCROSSBOW' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      }
    ]
  },
  {
    id: 'tracking',
    name: 'Tracking · Grup İz Sürme (4-5 Kişi)',
    players: '4-5',
    difficulty: 'Orta',
    strategy: 'Beast tracking T7+ ekipman gerektirir; hedefi vurduktan sonra kaçış yok — hasar sürekliliği şart. Forgebark sabit heal, Witchwork + Blueflame Torch mob dalgalarını eritir. Boss kaçışlarında tank hayatta kalmalı.',
    roles: [
      {
        roleName: 'Tank', count: 1,
        note: 'Incubus ile boss threat; kaçışları bedene al.',
        items: {
          weapon: { name: 'Incubus Mace', id: 'MAIN_MACE_HELL' },
          offhand: { name: 'Sarcophagus', id: 'OFF_TOWERSHIELD_UNDEAD' },
          head: { name: 'Guardian Helmet', id: 'HEAD_PLATE_SET3' },
          chest: { name: 'Guardian Armor', id: 'ARMOR_PLATE_SET3' },
          shoes: { name: 'Royal Shoes', id: 'SHOES_LEATHER_ROYAL' },
          cape: { name: 'Martlock Cape', id: 'CAPEITEM_FW_MARTLOCK' },
          food: { name: 'Goat Sandwich', id: 'MEAL_SANDWICH' },
          potion: { name: 'Major Resistance Potion', id: 'POTION_STONESKIN' }
        }
      },
      {
        roleName: 'Şifacı', count: 1,
        note: 'Forgebark; hareketli heal, boss burstlarını karşılar.',
        items: {
          weapon: { name: 'Forgebark Staff', id: 'MAIN_NATURESTAFF_CRYSTAL' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Druid Sandals', id: 'SHOES_CLOTH_KEEPER' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'Yakın DPS (Twin Slayers)', count: 1,
        note: 'Kritik pencere burstları.',
        items: {
          weapon: { name: 'Twin Slayers', id: '2H_DAGGERPAIR_CRYSTAL' },
          head: { name: 'Stalker Hood', id: 'HEAD_LEATHER_MORGANA' },
          chest: { name: 'Stalker Jacket', id: 'ARMOR_LEATHER_MORGANA' },
          shoes: { name: 'Stalker Shoes', id: 'SHOES_LEATHER_MORGANA' },
          cape: { name: 'Smuggler Cape', id: 'CAPEITEM_SMUGGLER' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Uzak DPS (Witchwork)', count: 1,
        note: 'Blueflame Torch ile alan hasarı.',
        items: {
          weapon: { name: 'Witchwork Staff', id: 'MAIN_ARCANESTAFF_UNDEAD' },
          offhand: { name: 'Blueflame Torch', id: 'OFF_TORCH_CRYSTAL' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Yakın DPS (Dagger Pair)', count: 1,
        note: 'Esnek slot: 4 kişiye düşerse bu rol çıkar.',
        items: {
          weapon: { name: 'Dagger Pair', id: '2H_DAGGERPAIR' },
          head: { name: 'Specter Hood', id: 'HEAD_LEATHER_UNDEAD' },
          chest: { name: 'Specter Jacket', id: 'ARMOR_LEATHER_UNDEAD' },
          shoes: { name: 'Specter Shoes', id: 'SHOES_LEATHER_UNDEAD' },
          cape: { name: 'Smuggler Cape', id: 'CAPEITEM_SMUGGLER' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      }
    ]
  },
  {
    id: 'ganking',
    name: 'Ganking · Grup Yakalama (3-8 Kişi)',
    players: '3-8',
    difficulty: 'PvP Beceri',
    strategy: 'Tank/şifacı yok: Catch rolü ilk hedefi kilitler, ranged burst aynı hedefe patlar, melee cleanup toplar. Hedef düşmeden iksir israf etmeyin; Invisibility Potion kaçış için saklıdır. Small-scale gankta sayı üstünlüğü her zaman meta önceliğidir.',
    roles: [
      {
        roleName: 'Catch (Yakalama)', count: 1,
        note: 'Claws ile ilk hedefi kilitle.',
        items: {
          weapon: { name: 'Claws', id: '2H_CLAWPAIR' },
          head: { name: 'Assassin Hood', id: 'HEAD_LEATHER_SET3' },
          chest: { name: 'Assassin Jacket', id: 'ARMOR_LEATHER_SET3' },
          shoes: { name: 'Assassin Shoes', id: 'SHOES_LEATHER_SET3' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Roast Chicken', id: 'MEAL_ROAST' },
          potion: { name: 'Invisibility Potion', id: 'POTION_CLEANSE' }
        }
      },
      {
        roleName: 'Uzak Burst DPS', count: 1,
        note: 'Heavy Crossbow ile yakalanan hedefe ilk patlama.',
        items: {
          weapon: { name: 'Heavy Crossbow', id: '2H_CROSSBOWLARGE' },
          head: { name: 'Mage Cowl', id: 'HEAD_CLOTH_SET3' },
          chest: { name: 'Mage Robe', id: 'ARMOR_CLOTH_SET3' },
          shoes: { name: 'Mage Sandals', id: 'SHOES_CLOTH_SET3' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Roast Chicken', id: 'MEAL_ROAST' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'Yakın Burst DPS', count: 1,
        note: 'Bloodletter ile kaçan hedefi tamamla.',
        items: {
          weapon: { name: 'Bloodletter', id: 'MAIN_RAPIER_MORGANA' },
          head: { name: 'Hellion Hood', id: 'HEAD_LEATHER_HELL' },
          chest: { name: 'Hellion Jacket', id: 'ARMOR_LEATHER_HELL' },
          shoes: { name: 'Hellion Shoes', id: 'SHOES_LEATHER_HELL' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Roast Chicken', id: 'MEAL_ROAST' },
          potion: { name: 'Invisibility Potion', id: 'POTION_CLEANSE' }
        }
      },
      {
        roleName: 'Cleanup DPS', count: 1,
        note: 'Deathgivers ile kalan hedefleri temizle; 3 kişiye düşerse bu rol çıkar.',
        items: {
          weapon: { name: 'Deathgivers', id: '2H_DUALSICKLE_UNDEAD' },
          head: { name: 'Specter Hood', id: 'HEAD_LEATHER_UNDEAD' },
          chest: { name: 'Specter Jacket', id: 'ARMOR_LEATHER_UNDEAD' },
          shoes: { name: 'Specter Shoes', id: 'SHOES_LEATHER_UNDEAD' },
          cape: { name: 'Smuggler Cape', id: 'CAPEITEM_SMUGGLER' },
          food: { name: 'Roast Chicken', id: 'MEAL_ROAST' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      }
    ]
  },
  {
    id: 'dragon-sanctuary',
    name: 'Dragon Sanctuary (20 Kişi Raid)',
    players: '20',
    difficulty: 'Çok Yüksek',
    strategy: "Dragonfire güncellemesinin 20 kişilik saf PvE raid'i (Spirit Waystone ile giriş, IP cap yok). Dünya-first raporu: 1 ana tank, 5 healer, 2 support, geri kalan DPS. Azaryon tüm raid'in pozisyonuna/threat'ine tepki verir; mob'ların çoğu forced-movement'a bağışıklı olduğu için klasik clump & burst çalışmaz. Kill sonrası Lingering Dragon Spirit 7 gün boyunca tekrar denemeleri zorlaştırır — haftada bir clear planlayın.",
    roles: [
      {
        roleName: 'Ana Tank', count: 1,
        note: 'Azaryon threat kontrolü; kayaların arkasında Inferno kaçışı.',
        items: {
          weapon: { name: 'Incubus Mace', id: 'MAIN_MACE_HELL' },
          offhand: { name: 'Sarcophagus', id: 'OFF_TOWERSHIELD_UNDEAD' },
          head: { name: 'Guardian Helmet', id: 'HEAD_PLATE_SET3' },
          chest: { name: 'Guardian Armor', id: 'ARMOR_PLATE_SET3' },
          shoes: { name: 'Royal Shoes', id: 'SHOES_LEATHER_ROYAL' },
          cape: { name: 'Martlock Cape', id: 'CAPEITEM_FW_MARTLOCK' },
          food: { name: 'Goat Sandwich', id: 'MEAL_SANDWICH' },
          potion: { name: 'Lifeward Potion', id: 'POTION_LIFEWARD' }
        }
      },
      {
        roleName: 'Off-Tank / Kontrol', count: 1,
        note: 'Drake ve add kontrolü; tank düştüğünde threat devralır.',
        items: {
          weapon: { name: 'Heavy Mace', id: '2H_MACE' },
          head: { name: 'Knight Helmet', id: 'HEAD_PLATE_SET2' },
          chest: { name: 'Knight Armor', id: 'ARMOR_PLATE_SET2' },
          shoes: { name: 'Knight Boots', id: 'SHOES_PLATE_SET2' },
          cape: { name: 'Martlock Cape', id: 'CAPEITEM_FW_MARTLOCK' },
          food: { name: 'Goat Sandwich', id: 'MEAL_SANDWICH' },
          potion: { name: 'Lifeward Potion', id: 'POTION_LIFEWARD' }
        }
      },
      {
        roleName: 'Şifacı (Hallowfall)', count: 3,
        note: 'Sürekli raid heal; Leyfin Omelette yeni patch heal seçeneği.',
        items: {
          weapon: { name: 'Hallowfall', id: 'MAIN_HOLYSTAFF_AVALON' },
          offhand: { name: 'Celestial Censer', id: 'OFF_CENSER_AVALON' },
          head: { name: 'Graveguard Helmet', id: 'HEAD_PLATE_UNDEAD' },
          chest: { name: 'Royal Robe', id: 'ARMOR_CLOTH_ROYAL' },
          shoes: { name: 'Shoes of Tenacity', id: 'SHOES_LEATHER_AVALON' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Carefree Leyfin Omelette', id: 'MEAL_OMELETTE_DRAGONAREA' },
          potion: { name: 'Lifeward Potion', id: 'POTION_LIFEWARD' }
        }
      },
      {
        roleName: 'Heal Support (Fallen)', count: 2,
        note: 'Grup heal katmanı; Dragonslayer Jacket hasar azaltır.',
        items: {
          weapon: { name: 'Fallen Staff', id: '2H_HOLYSTAFF_HELL' },
          head: { name: 'Soldier Helmet', id: 'HEAD_PLATE_SET1' },
          chest: { name: 'Dragonslayer Jacket', id: 'ARMOR_LEATHER_DRAGON' },
          shoes: { name: 'Royal Shoes', id: 'SHOES_LEATHER_ROYAL' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Carefree Leyfin Omelette', id: 'MEAL_OMELETTE_DRAGONAREA' },
          potion: { name: 'Lifeward Potion', id: 'POTION_LIFEWARD' }
        }
      },
      {
        roleName: 'Destek (Enigmatic)', count: 1,
        note: 'Protective Beam ile tekrar eden kalkan.',
        items: {
          weapon: { name: 'Enigmatic Staff', id: '2H_ENIGMATICSTAFF' },
          head: { name: 'Scholar Cowl', id: 'HEAD_CLOTH_SET1' },
          chest: { name: 'Scholar Robe', id: 'ARMOR_CLOTH_SET1' },
          shoes: { name: 'Scholar Sandals', id: 'SHOES_CLOTH_SET1' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Carefree Leyfin Omelette', id: 'MEAL_OMELETTE_DRAGONAREA' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'Destek (Locus / Cleanse)', count: 1,
        note: 'The Void ile debuff temizliği; Brecilien Cape.',
        items: {
          weapon: { name: 'Malevolent Locus', id: '2H_ENIGMATICORB_MORGANA' },
          head: { name: 'Scholar Cowl', id: 'HEAD_CLOTH_SET1' },
          chest: { name: 'Scholar Robe', id: 'ARMOR_CLOTH_SET1' },
          shoes: { name: 'Scholar Sandals', id: 'SHOES_CLOTH_SET1' },
          cape: { name: 'Brecilien Cape', id: 'CAPEITEM_FW_BRECILIEN' },
          food: { name: 'Carefree Leyfin Omelette', id: 'MEAL_OMELETTE_DRAGONAREA' },
          potion: { name: 'Invisibility Potion', id: 'POTION_CLEANSE' }
        }
      },
      {
        roleName: 'Mobil Uzak DPS', count: 5,
        note: "Mevcut patch'in doğrulanmış Sanctuary build'i: Weeping Repeater.",
        items: {
          weapon: { name: 'Weeping Repeater', id: '2H_REPEATINGCROSSBOW_UNDEAD' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Lifeward Potion', id: 'POTION_LIFEWARD' }
        }
      },
      {
        roleName: 'Mobil Yakın DPS', count: 6,
        note: 'Stalker tam set ile hareketli hasar; boss penceresinde burst.',
        items: {
          weapon: { name: 'Twin Slayers', id: '2H_DAGGERPAIR_CRYSTAL' },
          head: { name: 'Stalker Hood', id: 'HEAD_LEATHER_MORGANA' },
          chest: { name: 'Stalker Jacket', id: 'ARMOR_LEATHER_MORGANA' },
          shoes: { name: 'Stalker Shoes', id: 'SHOES_LEATHER_MORGANA' },
          cape: { name: 'Smuggler Cape', id: 'CAPEITEM_SMUGGLER' },
          food: { name: 'Roast Chicken', id: 'MEAL_ROAST' },
          potion: { name: 'Lifeward Potion', id: 'POTION_LIFEWARD' }
        }
      }
    ]
  },
  {
    id: 'ancient-lands',
    name: 'Ancient Lands · PvPvE (1-20 Kişi)',
    players: '1-20 (Portal: 1-5 / 5-7 / 15-20)',
    difficulty: 'Değişken',
    strategy: "Dragonfire'ın PvPvE adaları: IP soft cap 1200 olduğu için pahalı 8.x setlerin getirisi düşük — ucuz, yerine konabilir setler meta. Küçük portalda (1-5) AoE DPS + hareket yeterlidir; Drake'lerde tank aggro tutup drake'i partiden uzağa çevirir. Büyük portal (15-20) Dragon Sanctuary raid şablonuna döner. Knock-down sonrası Bleedout/revive döngüsüne dikkat.",
    roles: [
      {
        roleName: 'Hareketli Şifacı', count: 1,
        note: 'Mobil heal; Drake döngülerinde ayakta kal.',
        items: {
          weapon: { name: 'Blight Staff', id: '2H_NATURESTAFF_HELL' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Druid Sandals', id: 'SHOES_CLOTH_KEEPER' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'AoE Uzak DPS', count: 1,
        note: 'Leygate savunması ve mob temizliği.',
        items: {
          weapon: { name: 'Blazing Staff', id: '2H_INFERNOSTAFF_MORGANA' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Yakın DPS / Kaçış', count: 1,
        note: 'Deathgivers hem hasar hem mobility; düşman grubu görürsen Invisibility.',
        items: {
          weapon: { name: 'Deathgivers', id: '2H_DUALSICKLE_UNDEAD' },
          head: { name: 'Specter Hood', id: 'HEAD_LEATHER_UNDEAD' },
          chest: { name: 'Specter Jacket', id: 'ARMOR_LEATHER_UNDEAD' },
          shoes: { name: 'Specter Shoes', id: 'SHOES_LEATHER_UNDEAD' },
          cape: { name: 'Smuggler Cape', id: 'CAPEITEM_SMUGGLER' },
          food: { name: 'Roast Chicken', id: 'MEAL_ROAST' },
          potion: { name: 'Invisibility Potion', id: 'POTION_CLEANSE' }
        }
      },
      {
        roleName: 'Destek (Cleanse)', count: 1,
        note: 'Locus ile debuff temizliği ve kalkan.',
        items: {
          weapon: { name: 'Malevolent Locus', id: '2H_ENIGMATICORB_MORGANA' },
          head: { name: 'Scholar Cowl', id: 'HEAD_CLOTH_SET1' },
          chest: { name: 'Scholar Robe', id: 'ARMOR_CLOTH_SET1' },
          shoes: { name: 'Scholar Sandals', id: 'SHOES_CLOTH_SET1' },
          cape: { name: 'Brecilien Cape', id: 'CAPEITEM_FW_BRECILIEN' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Resistance Potion', id: 'POTION_STONESKIN' }
        }
      }
    ]
  },
  {
    id: 'bandit-assault',
    name: 'Bandit Assault · Faction Saldırısı (Zerg)',
    players: 'Büyük Grup / Zerg',
    difficulty: 'Çok Yüksek',
    strategy: "Realm Divided II ile yeniden tasarlanan iki fazlı faction etkinliği. Faz 1'de kırmızı bölgelerde Camp/Chest/Outpost alınır (Supplies), Faz 2'de iki Province Fortress'ının merkezindeki sandığa yarışılır. Clump tank engage eder, Locus debuff temizler, AoE DPS zerg'i eritir; taşıyıcılar korunur.",
    roles: [
      {
        roleName: 'Clump / Engage Tank', count: 2,
        note: 'Camlann ile zergi topla; Guardian aura öncelikli.',
        items: {
          weapon: { name: 'Camlann Mace', id: '2H_MACE_MORGANA' },
          head: { name: 'Knight Helmet', id: 'HEAD_PLATE_SET2' },
          chest: { name: 'Guardian Armor', id: 'ARMOR_PLATE_SET3' },
          shoes: { name: 'Royal Shoes', id: 'SHOES_LEATHER_ROYAL' },
          cape: { name: 'Martlock Cape', id: 'CAPEITEM_FW_MARTLOCK' },
          food: { name: 'Goat Sandwich', id: 'MEAL_SANDWICH' },
          potion: { name: 'Major Resistance Potion', id: 'POTION_STONESKIN' }
        }
      },
      {
        roleName: 'Şifacı', count: 3,
        note: 'Great Holy ile alan heal; hat düşmesin.',
        items: {
          weapon: { name: 'Great Holy Staff', id: '2H_HOLYSTAFF' },
          head: { name: 'Graveguard Helmet', id: 'HEAD_PLATE_UNDEAD' },
          chest: { name: 'Royal Robe', id: 'ARMOR_CLOTH_ROYAL' },
          shoes: { name: 'Shoes of Tenacity', id: 'SHOES_LEATHER_AVALON' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'Temizlik Destek', count: 2,
        note: 'Locus ile debuff/engage temizliği.',
        items: {
          weapon: { name: 'Malevolent Locus', id: '2H_ENIGMATICORB_MORGANA' },
          head: { name: 'Scholar Cowl', id: 'HEAD_CLOTH_SET1' },
          chest: { name: 'Scholar Robe', id: 'ARMOR_CLOTH_SET1' },
          shoes: { name: 'Scholar Sandals', id: 'SHOES_CLOTH_SET1' },
          cape: { name: 'Brecilien Cape', id: 'CAPEITEM_FW_BRECILIEN' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Invisibility Potion', id: 'POTION_CLEANSE' }
        }
      },
      {
        roleName: 'AoE Uzak DPS', count: 6,
        note: 'Boltcasters ile kalabalık eritme.',
        items: {
          weapon: { name: 'Boltcasters', id: '2H_DUALCROSSBOW_HELL' },
          head: { name: 'Mage Cowl', id: 'HEAD_CLOTH_SET3' },
          chest: { name: 'Mage Robe', id: 'ARMOR_CLOTH_SET3' },
          shoes: { name: 'Mage Sandals', id: 'SHOES_CLOTH_SET3' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Yakın AoE DPS', count: 4,
        note: 'Realmbreaker ile clump hasarı + zırh delme.',
        items: {
          weapon: { name: 'Realmbreaker', id: '2H_AXE_AVALON' },
          head: { name: 'Stalker Hood', id: 'HEAD_LEATHER_MORGANA' },
          chest: { name: 'Royal Armor', id: 'ARMOR_PLATE_ROYAL' },
          shoes: { name: 'Cultist Sandals', id: 'SHOES_CLOTH_MORGANA' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      }
    ]
  },
  {
    id: 'faction-camp',
    name: 'Faction Kamp & Bayrak (Grup 5)',
    players: '5',
    difficulty: 'Orta',
    strategy: "Faction Camps temizliği ve Battle Standards (bayrak taşıma) için5 kişilik mobil grup: Camp'ler Supplies verir, bayrak taşıyıcıyı koruyarak Faction Points kazanın. Açık dünya olduğu için düşman sightline'ı sürekli izlenir; Invisibility Potion kaçış için hazır tutulur.",
    roles: [
      {
        roleName: 'Tank', count: 1,
        note: 'Heavy Mace ile camp pulları ve bayrak koruması.',
        items: {
          weapon: { name: 'Heavy Mace', id: '2H_MACE' },
          head: { name: 'Guardian Helmet', id: 'HEAD_PLATE_SET3' },
          chest: { name: 'Guardian Armor', id: 'ARMOR_PLATE_SET3' },
          shoes: { name: 'Royal Shoes', id: 'SHOES_LEATHER_ROYAL' },
          cape: { name: 'Martlock Cape', id: 'CAPEITEM_FW_MARTLOCK' },
          food: { name: 'Goat Sandwich', id: 'MEAL_SANDWICH' },
          potion: { name: 'Major Resistance Potion', id: 'POTION_STONESKIN' }
        }
      },
      {
        roleName: 'Mobil Şifacı', count: 1,
        note: 'Blight ile hareketli heal; bayrak koşularında ayakta kal.',
        items: {
          weapon: { name: 'Blight Staff', id: '2H_NATURESTAFF_HELL' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Druid Sandals', id: 'SHOES_CLOTH_KEEPER' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'Temizlik Destek', count: 1,
        note: 'Locus ile debuff temizliği; skirmish avantajı.',
        items: {
          weapon: { name: 'Malevolent Locus', id: '2H_ENIGMATICORB_MORGANA' },
          head: { name: 'Scholar Cowl', id: 'HEAD_CLOTH_SET1' },
          chest: { name: 'Scholar Robe', id: 'ARMOR_CLOTH_SET1' },
          shoes: { name: 'Scholar Sandals', id: 'SHOES_CLOTH_SET1' },
          cape: { name: 'Brecilien Cape', id: 'CAPEITEM_FW_BRECILIEN' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Invisibility Potion', id: 'POTION_CLEANSE' }
        }
      },
      {
        roleName: 'Uzak DPS', count: 1,
        note: 'Siegebow ile uzun menzilli alan hasarı.',
        items: {
          weapon: { name: 'Siegebow', id: '2H_CROSSBOWLARGE_MORGANA' },
          head: { name: 'Mage Cowl', id: 'HEAD_CLOTH_SET3' },
          chest: { name: 'Mage Robe', id: 'ARMOR_CLOTH_SET3' },
          shoes: { name: 'Mage Sandals', id: 'SHOES_CLOTH_SET3' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Yakın DPS', count: 1,
        note: 'Carving Sword ile hedef kilitleme.',
        items: {
          weapon: { name: 'Carving Sword', id: '2H_CLEAVER_HELL' },
          head: { name: 'Stalker Hood', id: 'HEAD_LEATHER_MORGANA' },
          chest: { name: 'Stalker Jacket', id: 'ARMOR_LEATHER_MORGANA' },
          shoes: { name: 'Stalker Shoes', id: 'SHOES_LEATHER_MORGANA' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Roast Chicken', id: 'MEAL_ROAST' },
          potion: { name: 'Invisibility Potion', id: 'POTION_CLEANSE' }
        }
      }
    ]
  },
  {
    id: 'faction-zvz',
    name: 'Faction ZvZ (Büyük Ölçek)',
    players: 'Zerg (20+)',
    difficulty: 'Çok Yüksek',
    strategy: 'Büyük ölçekli faction savaşları: Frontline clump atar, healer hattı tutar, support buff/cleanse basar, ranged AoE arkadan eritir. Gruplar halinde hareket edin, solo kalmayın; çağrı gelmeden engage yapmayın.',
    roles: [
      {
        roleName: 'Frontline / Clump Tank', count: 4,
        note: 'Camlann/Heavy Mace ile clump; First E onay ile.',
        items: {
          weapon: { name: 'Camlann Mace', id: '2H_MACE_MORGANA' },
          head: { name: 'Knight Helmet', id: 'HEAD_PLATE_SET2' },
          chest: { name: 'Guardian Armor', id: 'ARMOR_PLATE_SET3' },
          shoes: { name: 'Royal Shoes', id: 'SHOES_LEATHER_ROYAL' },
          cape: { name: 'Martlock Cape', id: 'CAPEITEM_FW_MARTLOCK' },
          food: { name: 'Goat Sandwich', id: 'MEAL_SANDWICH' },
          potion: { name: 'Major Resistance Potion', id: 'POTION_STONESKIN' }
        }
      },
      {
        roleName: 'Healer', count: 4,
        note: 'Hallowfall ana heal; hat düşerse geri çekil.',
        items: {
          weapon: { name: 'Hallowfall', id: 'MAIN_HOLYSTAFF_AVALON' },
          offhand: { name: 'Celestial Censer', id: 'OFF_CENSER_AVALON' },
          head: { name: 'Graveguard Helmet', id: 'HEAD_PLATE_UNDEAD' },
          chest: { name: 'Royal Robe', id: 'ARMOR_CLOTH_ROYAL' },
          shoes: { name: 'Shoes of Tenacity', id: 'SHOES_LEATHER_AVALON' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'Support (Buff/Cleanse)', count: 3,
        note: 'Locus ile debuff temizliği; engage öncesi buff.',
        items: {
          weapon: { name: 'Malevolent Locus', id: '2H_ENIGMATICORB_MORGANA' },
          head: { name: 'Scholar Cowl', id: 'HEAD_CLOTH_SET1' },
          chest: { name: 'Scholar Robe', id: 'ARMOR_CLOTH_SET1' },
          shoes: { name: 'Scholar Sandals', id: 'SHOES_CLOTH_SET1' },
          cape: { name: 'Brecilien Cape', id: 'CAPEITEM_FW_BRECILIEN' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Invisibility Potion', id: 'POTION_CLEANSE' }
        }
      },
      {
        roleName: 'Ranged AoE DPS', count: 6,
        note: 'Siegebow ile clump arkası alan hasarı.',
        items: {
          weapon: { name: 'Siegebow', id: '2H_CROSSBOWLARGE_MORGANA' },
          head: { name: 'Mage Cowl', id: 'HEAD_CLOTH_SET3' },
          chest: { name: 'Mage Robe', id: 'ARMOR_CLOTH_SET3' },
          shoes: { name: 'Mage Sandals', id: 'SHOES_CLOTH_SET3' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Melee DPS', count: 5,
        note: 'Carving ile hedef kilitleme; clump sonrası cleanup.',
        items: {
          weapon: { name: 'Carving Sword', id: '2H_CLEAVER_HELL' },
          head: { name: 'Stalker Hood', id: 'HEAD_LEATHER_MORGANA' },
          chest: { name: 'Stalker Jacket', id: 'ARMOR_LEATHER_MORGANA' },
          shoes: { name: 'Stalker Shoes', id: 'SHOES_LEATHER_MORGANA' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Roast Chicken', id: 'MEAL_ROAST' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      }
    ]
  },
  {
    id: 'crystal-arena',
    name: 'Crystal Arena (5v5)',
    players: '5',
    difficulty: 'Yüksek',
    strategy: "Sabit arena şablonu: 1 Tank + 1 Şifacı + 3 DPS (1 AoE uzak, 1 melee, 1 destek-DPS). Takım elması toplama odaklanır; kill değil puan kazanır. İlk engage çağrısı tank'tan gelir.",
    roles: [
      {
        roleName: 'Ana Tank', count: 1,
        note: 'Elmas odası kontrolü ve ilk engage.',
        items: {
          weapon: { name: 'Incubus Mace', id: 'MAIN_MACE_HELL' },
          offhand: { name: 'Sarcophagus', id: 'OFF_TOWERSHIELD_UNDEAD' },
          head: { name: 'Guardian Helmet', id: 'HEAD_PLATE_SET3' },
          chest: { name: 'Guardian Armor', id: 'ARMOR_PLATE_SET3' },
          shoes: { name: 'Royal Shoes', id: 'SHOES_LEATHER_ROYAL' },
          cape: { name: 'Martlock Cape', id: 'CAPEITEM_FW_MARTLOCK' },
          food: { name: 'Goat Sandwich', id: 'MEAL_SANDWICH' },
          potion: { name: 'Major Resistance Potion', id: 'POTION_STONESKIN' }
        }
      },
      {
        roleName: 'Şifacı', count: 1,
        note: "Hallowfall; arena burst'larında Sacrifice.",
        items: {
          weapon: { name: 'Hallowfall', id: 'MAIN_HOLYSTAFF_AVALON' },
          offhand: { name: 'Celestial Censer', id: 'OFF_CENSER_AVALON' },
          head: { name: 'Graveguard Helmet', id: 'HEAD_PLATE_UNDEAD' },
          chest: { name: 'Royal Robe', id: 'ARMOR_CLOTH_ROYAL' },
          shoes: { name: 'Shoes of Tenacity', id: 'SHOES_LEATHER_AVALON' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'Uzak DPS (AoE)', count: 1,
        note: 'Weeping ile elmas alanı hasarı.',
        items: {
          weapon: { name: 'Weeping Repeater', id: '2H_REPEATINGCROSSBOW_UNDEAD' },
          head: { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
          chest: { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
          shoes: { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Goat Stew', id: 'MEAL_STEW' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      },
      {
        roleName: 'Yakın DPS', count: 1,
        note: 'Carving ile hedef kilitleme.',
        items: {
          weapon: { name: 'Carving Sword', id: '2H_CLEAVER_HELL' },
          head: { name: 'Stalker Hood', id: 'HEAD_LEATHER_MORGANA' },
          chest: { name: 'Stalker Jacket', id: 'ARMOR_LEATHER_MORGANA' },
          shoes: { name: 'Stalker Shoes', id: 'SHOES_LEATHER_MORGANA' },
          cape: { name: 'Caerleon Cape', id: 'CAPEITEM_FW_CAERLEON' },
          food: { name: 'Roast Chicken', id: 'MEAL_ROAST' },
          potion: { name: 'Major Energy Potion', id: 'POTION_ENERGY' }
        }
      },
      {
        roleName: 'Destek-DPS (Pierce)', count: 1,
        note: 'Realmbreaker ile tank delme + parti hasarı.',
        items: {
          weapon: { name: 'Realmbreaker', id: '2H_AXE_AVALON' },
          head: { name: 'Stalker Hood', id: 'HEAD_LEATHER_MORGANA' },
          chest: { name: 'Royal Armor', id: 'ARMOR_PLATE_ROYAL' },
          shoes: { name: 'Cultist Sandals', id: 'SHOES_CLOTH_MORGANA' },
          cape: { name: 'Lymhurst Cape', id: 'CAPEITEM_FW_LYMHURST' },
          food: { name: 'Chicken Omelette', id: 'MEAL_OMELETTE' },
          potion: { name: 'Major Acid Potion', id: 'POTION_ACID' }
        }
      }
    ]
  }
];
