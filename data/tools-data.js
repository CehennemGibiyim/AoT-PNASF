// AoT-PNASF — Araçlar modülü veri deposu
// Party Builder (ZvZ / küçük ölçek) · Avalon Dungeon & HCE PvE rehberi
// Kaynaklar: Metabattle, AlbionOnlineGrind (2026 comps), Quazars Avalon rehberi, HCE rehberi (2025)

window.AO_TOOLS_DATA = {
  party: {
    formats: [
      {
        id: 'small',
        nominal: 7,
        label: { tr: 'Küçük Ölçek (5-7 kişi)', en: 'Small Scale (5-7 players)' },
        desc: {
          tr: 'Yollar, arena ve açık dünya küçük çatışmaları için hızlı kompozisyon.',
          en: 'Fast composition for roads, arena and small open-world fights.'
        },
        roles: [
          {
            role: 'tank', count: 1,
            weapons: ['Heavy Mace', 'Great Hammer', 'Earthrune Staff'],
            note: {
              tr: 'Tek tank: clump kurar, disengage çağırır. Grovekeeper ikinci tank olarak 10v10\'da devreye girer.',
              en: 'Solo tank: sets up clumps, calls disengage. Grovekeeper joins as second tank in 10v10.'
            }
          },
          {
            role: 'healer', count: 1,
            weapons: ['Hallowfall', 'Blight Staff'],
            note: {
              tr: 'Hallowfall baskın, Blight daha ucuz brawllar için.',
              en: 'Hallowfall is standard; Blight for cheaper brawls.'
            }
          },
          {
            role: 'support', count: 1,
            weapons: ['Primal Staff', 'Great Arcane'],
            note: {
              tr: 'Küçük ölçekte zaman warp ve kalkan sinerjileri önem kazanır.',
              en: 'Time Warp and shield synergies matter more at small scale.'
            }
          },
          {
            role: 'melee', count: 2,
            weapons: ['Bloodmoon Staff', 'Carving Sword', 'Carrioncaller', 'Heron Spear', 'Forgehammer'],
            note: {
              tr: 'Carrioncaller heal-denial, Bloodmoon/Infinity Blade infaz odaklıdır.',
              en: 'Carrioncaller denies heals; Bloodmoon/Infinity Blade are executes.'
            }
          },
          {
            role: 'ranged', count: 2,
            weapons: ['Longbow', 'Rotcaller Staff', 'Cursed Skull', 'Great Frost Staff', 'Dawnsong'],
            note: {
              tr: 'Rotcaller ve Cursed Skull baskın hasar; Longbow güvenilir genel RDPS.',
              en: 'Rotcaller and Cursed Skull for burst; Longbow as reliable general RDPS.'
            }
          }
        ]
      },
      {
        id: 'zvz',
        nominal: 20,
        label: { tr: 'ZvZ / Grup Savaşı (10-20 kişi)', en: 'ZvZ / Group Fight (10-20 players)' },
        desc: {
          tr: 'Klasik ZvZ oranı: her 10 oyuncuda ~2-2.5 tank, 1.5-2 destek, 2 şifacı, 1-2 melee, 2-3.5 ranged.',
          en: 'Classic ZvZ ratio: per 10 players ~2-2.5 tanks, 1.5-2 support, 2 healers, 1-2 melee, 2-3.5 ranged.'
        },
        roles: [
          {
            role: 'tank', count: 4,
            weapons: ['1H Mace', 'Grovekeeper', 'Heavy Mace', 'Earthrune Staff', 'SoulScythe', 'Camlann', 'Grailseeker'],
            note: {
              tr: 'Shotcaller genelde 1H Mace kullanır; Air Compressor ile clump. Earthrune en yaygın engage tankıdır.',
              en: 'Shotcaller usually on 1H Mace, clumping with Air Compressor. Earthrune is the most common engage tank.'
            }
          },
          {
            role: 'support', count: 4,
            weapons: ['Great Arcane', 'Rootbound Staff', 'Lifecurse Staff', 'Damnation Staff', 'Oathkeepers', 'Malevolent Locus'],
            note: {
              tr: 'Malevolent Locus kubbesi tüm ZvZ\'nin en etkili yeteneğidir; purge + cleanse + direnç.',
              en: 'The Malevolent Locus dome is the most impactful ability in ZvZ: purge + cleanse + resistance.'
            }
          },
          {
            role: 'healer', count: 4,
            weapons: ['Hallowfall', 'Fallen Staff', 'Blight Staff', 'Rampant Staff'],
            note: {
              tr: '2 Hallowfall/Fallen + 1-2 Blight/Rampant. Fallen Staff toplu cleanse sağlar.',
              en: '2 Hallowfall/Fallen + 1-2 Blight/Rampant. Fallen Staff provides mass cleanse.'
            }
          },
          {
            role: 'melee', count: 4,
            weapons: ['Realmbreaker', 'Spirithunter', 'Rift Glaive', 'Galatine Pair', 'Bloodletter', 'Spiked Gauntlets', 'Carving Sword'],
            note: {
              tr: '2026 çekirdeği: Spirithunter + Realmbreaker + Rift Glaive.',
              en: '2026 core: Spirithunter + Realmbreaker + Rift Glaive.'
            }
          },
          {
            role: 'ranged', count: 4,
            weapons: ['Permafrost Prism', 'Dawnsong', 'Siegebow', 'Longbow', 'Wailing Bow', 'Mistpiercer', 'Energy Shaper', 'Weeping Repeater'],
            note: {
              tr: 'Siegebow duvar arkası true damage; Energy Shaper savunmacı pozisyon için en iyisi.',
              en: 'Siegebow for true damage through walls; Energy Shaper best for defensive holds.'
            }
          }
        ]
      }
    ],
    synergies: [
      {
        title: { tr: 'Malevolent Locus Kubbesi', en: 'Malevolent Locus Dome' },
        desc: {
          tr: 'Düşman bufflarını temizler, dost debuffları kaldırır, direnç ekler. ZvZ\'nin tek başına en etkili yeteneği; shotcaller çağırır.',
          en: 'Purges enemy buffs, cleanses ally debuffs, adds resistance. The single most impactful ZvZ ability; called by the shotcaller.'
        }
      },
      {
        title: { tr: '1H Arcane E Purge', en: '1H Arcane E Purge' },
        desc: {
          tr: 'Royal Hood ve Cleric Robe hasar amplifikatörlerini strip eder; flankleri durdurur.',
          en: 'Strips Royal Hood and Cleric Robe damage amps; shuts down flanks.'
        }
      },
      {
        title: { tr: 'Judicator Armor Kubbesi', en: 'Judicator Armor Dome' },
        desc: {
          tr: 'Stack edilmiş Judi kubbeleri brawl\'ı mümkün kılar. Çok sayıda Judi varsa tanklar Demon Armor\'a geçer.',
          en: 'Stacked Judi domes enable brawling. With many Judis present, tanks switch to Demon Armor.'
        }
      },
      {
        title: { tr: 'Cleric Robe — Everlasting Spirit', en: 'Cleric Robe — Everlasting Spirit' },
        desc: {
          tr: '3 sn dokunulmazlık + %20-30 hasar/iyileştirme amplifikasyonu; tetiklenmek için hasar almak gerekir, E\'den önce bir vuruş yiyin.',
          en: '3s immunity + 20-30% damage/heal amp; must take a hit to trigger — soak one before your E.'
        }
      },
      {
        title: { tr: 'Knight Helmet — Displacement Immunity', en: 'Knight Helmet — Displacement Immunity' },
        desc: {
          tr: 'Camlann çekimlerine, Grovekeeper Ground Pound\'a ve Icicle slow\'larına karşı cevap.',
          en: 'The counter to Camlann pulls, Grovekeeper Ground Pound and Icicle slows.'
        }
      },
      {
        title: { tr: 'Camlann Clump + Clap', en: 'Camlann Clump + Clap' },
        desc: {
          tr: 'Klasik clump-then-clap; Knight Helmet ile counterlanır, takım arkadaşınıza doğru yürümek cezalandırılır.',
          en: 'The classic clump-then-clap; countered by Knight Helmet, punished by walking toward allies while camlanned.'
        }
      },
      {
        title: { tr: 'Grovekeeper Inertia Ring + Ground Pound', en: 'Grovekeeper Inertia Ring + Ground Pound' },
        desc: {
          tr: 'Standart gap-maker: düşman frontline\'ını backline\'dan ayırır, hareket hızı bufflarını purge eder.',
          en: 'The standard gap-maker: separates enemy frontline from backline, purges their move-speed buffs.'
        }
      },
      {
        title: { tr: 'Fallen Staff E — Toplu Cleanse', en: 'Fallen Staff E — Mass Cleanse' },
        desc: {
          tr: 'DoT/purge kompozisyonlarına (Damnation, Cursed Skull) karşı toplu iyileştirme + cleanse.',
          en: 'Mass heal + cleanse against DoT/purge comps (Damnation, Cursed Skull).'
        }
      },
      {
        title: { tr: 'Disarray (26+ oyuncu)', en: 'Disarray (26+ players)' },
        desc: {
          tr: '26 oyuncudan sonra bonus hasar, savunma, CC süresi ve iyileştirme düşer — bu yüzden blob\'lar 20\'lik partilere bölünür.',
          en: 'At 26+ players bonus damage, defense, CC duration and healing received drop — this is why blobs split into 20-man parties.'
        }
      }
    ],
    consumables: [
      {
        role: { tr: 'Tank', en: 'Tank' },
        food: 'Avalonian Pork Omelette / Avalonian Beef Sandwich',
        potion: { tr: 'Major Resistance · aşırı pozisyonda Major Gigantify', en: 'Major Resistance · Major Gigantify when over-extended' }
      },
      {
        role: { tr: 'Şifacı', en: 'Healer' },
        food: 'Avalonian Pork Omelette (CDR + cast speed)',
        potion: { tr: 'Major Resistance · talep üzerine Major Energy (değiştirmek cooldown tetiklemez)', en: 'Major Resistance · Major Energy on demand (swapping does not trigger cooldowns)' }
      },
      {
        role: { tr: 'Destek', en: 'Support' },
        food: 'Avalonian Pork Omelette (Locus kubbesi zamanlaması için CDR)',
        potion: { tr: 'Major Resistance / Major Gigantify', en: 'Major Resistance / Major Gigantify' }
      },
      {
        role: { tr: 'Ranged DPS', en: 'Ranged DPS' },
        food: 'Beef Stew 8.1–8.2 (düz hasar)',
        potion: { tr: 'Major Gigantify (Immortal ile zincirlenir)', en: 'Major Gigantify (chains with Immortal)' }
      },
      {
        role: { tr: 'Melee DPS', en: 'Melee DPS' },
        food: 'Beef Stew veya Avalonian Beef Sandwich (HP + CC süresi)',
        potion: { tr: 'Resistance veya Gigantify', en: 'Resistance or Gigantify' }
      }
    ]
  },

  avalon: {
    intro: {
      tr: 'Avalon Dungeons büyük grup zindanlarıdır: 1-2 kat, 3-7 boss (rastgele boss\'lar + her zaman final boss Sir Bedivere). Her boss\'tan sonra Avalonian Gate Core kesilerek kapı açılır (3:05 yeniden doğar). Sandık olasılıkları: boss başına ~%61 tek purple, %29 çift purple, %9 tek altın.',
      en: 'Avalonian Dungeons are large group dungeons: 1-2 floors, 3-7 bosses (random regulars + always Sir Bedivere as final). After each boss an Avalonian Gate Core is killed to open the gate (respawns in 3:05). Chest odds: per boss ~61% single purple, 29% double purple, 9% single gold.'
    },
    ip: {
      tr: 'Önerilen IP: T6 = 1100/.0 – 1400/.3 · T7 = 1200–1500 · T8 = 1300–1600. Her kişi 50+ T4 zehir, 4 yemek, tamir kiti ve kaçış bineği (Gallant Horse / bütçe Frost Ram) getirmeli.',
      en: 'Recommended IP: T6 = 1100/.0 – 1400/.3 · T7 = 1200–1500 · T8 = 1300–1600. Each player should bring 50+ T4 poisons, 4 foods, a repair kit and an escape mount (Gallant Horse / budget Frost Ram).'
    },
    bosses: [
      {
        name: 'Avalonian Archmage',
        phases: {
          tr: 'Faz 1: Kapanan Daire → Çift Lazer → Geri İtme Bulutları. Faz 2: Bullet Hell.',
          en: 'Phase 1: Closing Circle → Double Laser → Knockback Clouds. Phase 2: Bullet Hell.'
        },
        counter: {
          tr: 'Daire kapanmadan önce önceden konumlanın, Çift Lazer için grup hasar azaltma cooldown\'larını sırayla kullanın, geri itme bulutlarında durmayın (insanları lazer hattına iter).',
          en: 'Pre-position before the circle closes, rotate group damage-reduction cooldowns for the Double Laser, never stand in knockback clouds (they push players into laser lines).'
        },
        drops: { tr: 'Standart Avalon sandıkları (purple/altın).', en: 'Standard Avalon chests (purple/gold).' }
      },
      {
        name: 'Avalonian Crystal Basilisk',
        phases: {
          tr: 'Faz 1: temel konumlanma. Faz 2: Nuke Fazı. Divine Impulse yığınları ve Cleansing Cloud uygular.',
          en: 'Phase 1: basic positioning. Phase 2: Nuke Phase. Applies Divine Impulse stacks and a Cleansing Cloud.'
        },
        counter: {
          tr: 'Nuke fazından önce Cleansing Cloud içinde cleanse olun; Divine Impulse yığınlarını yönetin.',
          en: 'Cleanse inside the Cleansing Cloud before the nuke phase; manage Divine Impulse stacks.'
        },
        drops: { tr: 'Standart Avalon sandıkları.', en: 'Standard Avalon chests.' }
      },
      {
        name: 'Avalonian Construct',
        phases: {
          tr: 'Enerji yığınları 5\'te Faz 1, 10\'da Faz 2. Compensator mob\'u enerji/zayıflık mekaniğini yönetir.',
          en: 'Phase 1 at five Energy stacks, Phase 2 at ten. The Compensator mob manages the energy/vulnerability mechanic.'
        },
        counter: {
          tr: 'Enerji yığınlarını takip edin; Attack Drone köprüsünde Soldier Helmet zamanlaması kritiktir.',
          en: 'Track energy stacks; timing Soldier Helmet on the Attack Drone bridge is critical.'
        },
        drops: { tr: 'Standart Avalon sandıkları.', en: 'Standard Avalon chests.' }
      },
      {
        name: 'Avalonian High Priestess',
        phases: {
          tr: '"Pinata" olarak bilinen en kolay boss: Divine Sacrifice iyileştirme dairesi, Summon Shadows, Pulse Fazı.',
          en: 'The easiest boss, known as "the piñata": Divine Sacrifice healing circle, Summon Shadows, Pulse Phase.'
        },
        counter: {
          tr: 'İyileştirme dairesini kesintiye uğratın ve çağrılan gölgeleri öldürün (onu iyileştirmelerine izin vermeyin); Pulse fazında grup toplanıp dodge eder.',
          en: 'Interrupt the healing circle and kill the summoned shadows (do not let them heal her); group up and dodge during the pulse phase.'
        },
        drops: { tr: 'Standart Avalon sandıkları.', en: 'Standard Avalon chests.' }
      },
      {
        name: 'Avalonian Knight Captain',
        phases: {
          tr: 'Ağır ön/slam deseni, iki faz ve sıkı konumlanma gerektirir.',
          en: 'Heavy frontal/slam pattern, two phases and strict positioning.'
        },
        counter: {
          tr: 'İki tank gerekir (ya da sandık arkasına saklanma) + tank için shrine buff. Off-tank slam\'i taunt ile çeker.',
          en: 'Requires two tanks (or hiding behind a chest) + a shrine buff for the tank. The off-tank taunts the slam away.'
        },
        drops: { tr: 'Standart Avalon sandıkları.', en: 'Standard Avalon chests.' }
      },
      {
        name: 'Sir Bedivere (Final Boss)',
        phases: {
          tr: 'Fate of the Unworthy yığınları (2 sn\'de bir hasar), Cleave, Blade Storm, Reflecting Shield, Earth Shatter, Undead Grasp + Faz 2 geçişi.',
          en: 'Fate of the Unworthy stacks (ticking damage every 2s), Cleave, Blade Storm, Reflecting Shield, Earth Shatter, Undead Grasp + Phase 2 transition.'
        },
        counter: {
          tr: 'Reflecting Shield sırasında DPS\'i durdurun; tank için Guardian Helmet; grup Earth Shatter için birlikte hareket eder, Undead Grasp\'in insanları pozisondan çekmesine izin vermeyin.',
          en: 'Stop DPS during Reflecting Shield; Guardian Helmet on the tank; the group moves as one for Earth Shatter and keeps Undead Grasp from pulling people out of position.'
        },
        drops: { tr: 'Boss başına ~%78 çift purple, %18 tek altın.', en: 'Per boss ~78% double purple, 18% single gold.' }
      }
    ],
    mobs: [
      {
        name: 'Avalonian Acolyte',
        mechanic: {
          tr: 'Floating Orb yığınları: yığın başına -%35 hasar, -%15 iyileştirme (cleanse edilebilir). Purge Smoke ile işaretlenen oyuncu gruptan uzaklaşmalıdır.',
          en: 'Floating Orb stacks: -35% damage dealt, -15% healing per stack (cleanseable). The player marked by Purge Smoke must run away from the group.'
        }
      },
      {
        name: 'Avalonian Archer',
        mechanic: {
          tr: 'Silence Shot geri iter, düşürür ve ~10 sn alan sessizliği uygular. İşaretlendiyseniz dostlardan uzaklaşın.',
          en: 'Silence Shot knocks back, downs and applies ~10s area silence. Get away from allies when marked.'
        }
      },
      {
        name: 'Avalonian Spearman / Monk',
        mechanic: {
          tr: 'Neredeyse anında cast eder ve kesintiye uğratılamaz — grup wipe\'larının ana sebebi bu pullardır.',
          en: 'Cast almost immediately and cannot be interrupted — these pulls are the main cause of group wipes.'
        }
      },
      {
        name: 'Avalonian Spellweaver / Wizard',
        mechanic: {
          tr: 'Kesintiye uğratılamayan büyük nuke\'lar. Bir cast turunu tanklayın, sonra rotasyona devam edin.',
          en: 'Big uninterruptible nukes. Tank through one cast round, then resume the rotation.'
        }
      }
    ],
    counterKit: {
      tr: 'Çekirdek stun rotasyonu: Great Arcane → Hammer stun → 1h Arcane → tekrar (mob\'ları 15-20 sn kilitleyerek). Great arcane E (Time Freeze) sırasında mob\'lar direnç kırılmasına immune\'dir — Realmbreaker/Shadowcaller/Armor Piercer/Incubus E\'lerini freeze sonrası zamanlayın. CC\'nin azalan getirisi vardır (stun/silence/root ayrı); DR sırasında silence kullanın. Mob\'lar displacement\'a immune\'dur (Air Compressor, Camlann) — clump için yol bulma + Hammer Inertia Ring kullanın.',
      en: 'Core stun rotation: Great Arcane → Hammer stun → 1h Arcane → repeat (locks mobs out of casting for 15-20s). While mobs are in Great Arcane E (Time Freeze) they are immune to resistance shred — time Realmbreaker/Shadowcaller/Armor Piercer/Incubus E after the freeze. CC has diminishing returns per category (stun/silence/root separately); use silence during DR to reset stuns. Most mobs are immune to displacement (Air Compressor, Camlann) — clump via pathing plus a Hammer Inertia Ring.'
    },
    comp: [
      { role: { tr: 'Ana Tank', en: 'Main Tank' }, picks: 'Incubus Mace (yüksek IP, auto-attack örmek aggro tutmak için şart)' },
      { role: { tr: 'CC Tank', en: 'CC Tank' }, picks: 'Hammer (shotcaller): F → E → Q → D, Inertia Ring; boss\'larda Soldier Helmet swap\'i' },
      { role: { tr: 'Şifacılar', en: 'Healers' }, picks: '1 ana (Holy) + 2 Ironroot (boss\'larda grup iyileştirmesine geçer)' },
      { role: { tr: 'Arcane Destek', en: 'Arcane Support' }, picks: 'Great Arcane (Time Freeze clump) + 1h Arcane (ikinci stun)' },
      { role: { tr: 'Hasar Destekleri', en: 'Damage Supports' }, picks: 'Ironroot (hasar amp) · Shadowcaller (direnç kırıcı) · Realmbreaker (direnç kırıcı)' },
      { role: { tr: 'DPS', en: 'DPS' }, picks: 'Blazing Staff (max 1 — E stacklenmez) · Chillhowl/Permafrost · Light Crossbow · Lightcaller · Mistpiercer · Specter Jacket melee (max 1)' }
    ]
  },

  hce: {
    intro: {
      tr: 'Hardcore Expeditions (HCE), şehirlerdeki Expedition Master NPC\'sinden harita eşyası ile girilen 5 kişilik yüksek zorluklu PvE instance\'larıdır. 18 seviye vardır: süresi içinde temizlenen harita bir sonraki seviyeye yükselir. 10 harita türü, sabit mob ailesi ve boss vardır. HCE güvenlidir (kırmızı/siyah bölge yok), ölümdüre eşya kaybı yoktur.',
      en: 'Hardcore Expeditions (HCE) are 5-player high-difficulty PvE instances entered with a map item via the Expedition Master NPC in cities. There are 18 levels: clearing a map within the time limit upgrades it to the next level. 10 map types with fixed mob families and bosses. HCE is safe (no red/black zone) and has no gear loss on death.'
    },
    maps: [
      { name: 'Preaching to the Death', family: 'Undead', difficulty: '4/5', boss: 'Veteran Haunted Deathlord' },
      { name: 'Fishy Business', family: 'Heretic', difficulty: '1/5', boss: 'Veteran Mad Chops' },
      { name: 'Stone Wars', family: 'Keeper', difficulty: '2/5', boss: 'Veteran Rockgrinder Chieftain' },
      { name: 'Lumber Lunacy', family: 'Heretic', difficulty: '1/5', boss: 'Veteran Mad Weaponsmaster' },
      { name: 'Lurking Underneath', family: 'Undead', difficulty: '3/5', boss: 'Veteran Haunted Ghast' },
      { name: 'Fungicide', family: 'Keeper', difficulty: '4/5', boss: 'Veteran Rockgrinder Elder' },
      { name: 'Three Sisters', family: 'Morgana', difficulty: '3/5', boss: 'Veteran Obsessed Raven / Magistra / Fang' },
      { name: 'Eternal Battle', family: 'Undead', difficulty: '4/5', boss: 'Veteran Haunted Governor' },
      { name: 'Fistful of Silver', family: 'Heretic', difficulty: '4/5', boss: 'Veteran Mad Shadowmask' },
      { name: 'In the Raven Claws', family: 'Morgana', difficulty: '5/5', boss: 'Veteran Obsessed Tormentor' }
    ],
    comp: [
      { role: { tr: 'Tank', en: 'Tank' }, picks: 'En bilgi isteyen rol: clump, CC ve temiz disengage (Guardian Rune ile). Ekipman seviyesi healer\'dan daha kritik.' },
      { role: { tr: 'Şifacı', en: 'Healer' }, picks: 'Holy Staff Q1/W2 · boss\'larda Druid Crawl · trash\'te Graveguard Helmet · tank E\'den hemen önce Royal Jacket uygula.' },
      { role: { tr: 'Shadowcaller', en: 'Shadowcaller' }, picks: 'Q3/W4 · Specter Jacket ana hasar kaynağı · 10+ T5 Sticky Potion · Roast Pork · E\'yi Ironclad tanka uygula (mob dirençlerini kırar).' },
      { role: { tr: 'DPS ×2', en: 'DPS ×2' }, picks: 'Chillhowl (frost) standart: Q2 · boss\'larda Obelisk W, trash\'te Frost Bomb · Chest → Head → E → W → Q rotasyonu · boss\'ta kendine E ile Morgana Cape tetikle.' }
    ],
    mechanics: [
      {
        map: 'Lumber Lunacy',
        tr: 'Dagger mob\'ları %50 HP altındaki her oyuncuya ışınlanır (aggro\'dan bağımsız). Boss meteor yağdırır — tankın arkasında toplanın, Guardian Rune kapsar.',
        en: 'Dagger mobs teleport to any player under 50% HP regardless of aggro. The boss rains meteors — group on the tank\'s back, Guardian Rune covers it.'
      },
      {
        map: 'Fistful of Silver',
        tr: 'Varil mob\'ları zincirleme çeker. Boss rastgele hedefli DoT ve yanan zemin uygular; DoT aktarken yanan zemin üstünde durmak grup çapraz patlaması yapar. Tank dışındakiler Dodge alır, şifacı AoE iyileştirmeye geçer.',
        en: 'Barrel mobs chain-pull. The boss applies a random-target DoT and burning floor; standing on burning floor while the DoT is active causes a group-wide explosion. Everyone but the tank takes Dodge, healer swaps to AoE heal.'
      },
      {
        map: 'Stone Wars',
        tr: 'Faz 1: boss\'un kaya oluğunda tamamen hareketsiz durun. Faz 2: dönüş saldırısı — tank dışındakiler geri çekilir.',
        en: 'Phase 1: stand completely still in the rock crevice. Phase 2: spin attack — everyone but the tank backs off.'
      },
      {
        map: 'Fungicide / Preaching to the Death / Eternal Battle',
        tr: 'Ağır zemin tehlikeli haritalar; şifacı sorunlu Mage\'leri susturmak için Great Arcane + Hellion Hood taşır. Eternal Battle boss\'unda parlayan işarete toplanın, çekme + iskelet çağırma sırasında hareket etmeyin.',
        en: 'Heavy floor-hazard maps; the healer brings Great Arcane + Hellion Hood to silence troublesome Mages. On the Eternal Battle boss stack on the glowing mark and do not move during the pull-in + skeleton summon.'
      }
    ]
  }
};
