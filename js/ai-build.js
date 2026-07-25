const MODEL_ID = 'ba695aee-f2ec-497f-9335-1c796cb0c30d'; // RolePlay v1 (Ücretsiz)

// --- MOCK AI SERVICE (Local Testing İçin) ---
// Gerçek Telegram Mini Apps ortamında bu obje otomatik olarak sağlanır
if (!window.miniappsAI) {
  console.log('⚠️ window.miniappsAI bulunamadı, mock AI servisi kullanılıyor');
  
  window.miniappsAI = {
    callModel: async (params) => {
      console.log('🤖 Mock AI çağrısı:', params);
      
      const isPersonalBuild = params.messages.some(m => m.content.includes('pve') && m.content.includes('pvp'));
      
      if (isPersonalBuild) {
        const userMessage = params.messages.find(m => m.role === 'user');
        const weaponMatch = userMessage.content.match(/"([^"]+)" \(T[^)]+\)/);
        const selectedWeaponName = weaponMatch ? weaponMatch[1] : "Broadsword";
        const selectedWeaponId = weaponMatch ? weaponMatch[2] : "T8_MAIN_SWORD";
        
        return {
          result: JSON.stringify({
            pve: {
              name: "PVX Farm Build",
              description: `Efficient mob farming build using ${selectedWeaponName}`,
              items: {
                weapon: {name: selectedWeaponName, id: selectedWeaponId, skills: ["Q1: Active Skill 1", "W1: Active Skill 2", "E: Ultimate", "P2: Passive 2"]},
                head: {name: "Scholar Cowl", id: "T8_HEAD_CLOTH_SET1", skills: ["D: Escape", "P1: Arcane Insight"]},
                chest: {name: "Mercenary Jacket", id: "T8_ARMOR_LEATHER_SET1", skills: ["R: Taunt", "P1: Iron Will"]},
                shoes: {name: "Scholar Sandals", id: "T8_SHOES_CLOTH_SET1", skills: ["F: Sprint", "P1: Quick Step"]},
                cape: {name: "Thetford Cape", id: "T8_CAPEITEM_FW_THETFORD", skills: ["P1: Elemental Shield"]},
                food: {name: "Omelette", id: "T8_MEAL_OMELETTE", skills: []},
                potion: {name: "Poison Potion", id: "T6_POTION_POISON", skills: []}
              }
            },
            pvp: {
              name: "Small Scale PvP Build",
              description: `Aggressive dueling build using ${selectedWeaponName}`,
              items: {
                weapon: {name: selectedWeaponName, id: selectedWeaponId, skills: ["Q1: Active Skill 1", "W1: Active Skill 2", "E: Ultimate", "P2: Passive 2"]},
                head: {name: "Hellion Hood", id: "T8_HEAD_LEATHER_HELL", skills: ["D: Smoke Shield", "P1: Fiery Resolve"]},
                chest: {name: "Stalker Jacket", id: "T8_ARMOR_LEATHER_MORGANA", skills: ["R: Ambush", "P1: Assassin"]},
                shoes: {name: "Hellion Shoes", id: "T8_SHOES_LEATHER_HELL", skills: ["F: Dash", "P1: Burning Steps"]},
                cape: {name: "Caerleon Cape", id: "T8_CAPEITEM_FW_CAERLEON", skills: ["P1: Energy Shield"]},
                food: {name: "Roast Pork", id: "T8_MEAL_ROAST", skills: []},
                potion: {name: "Invisibility Potion", id: "T8_POTION_CLEANSE", skills: []}
              }
            }
          })
        };
      } else {
        return {
          result: JSON.stringify({
            title: "Standard 5-man Group",
            strategy: "Basic tank and spank.",
            roles: [
              {
                roleName: "Main Tank",
                items: {
                  weapon: {name: "Incubus Mace", id: "T8_MAIN_MACE_HELL", skills: ["Q1: Shield Bash", "W1: Wall", "E: Undead Armor", "P2: Spectral Defense"]},
                  head: {name: "Guardian Helmet", id: "T8_HEAD_PLATE_SET3", skills: ["D: Taunt", "P1: Iron Will"]},
                  chest: {name: "Guardian Armor", id: "T8_ARMOR_PLATE_SET3", skills: ["R: Divine Protection", "P1: Fortitude"]},
                  shoes: {name: "Guardian Boots", id: "T8_SHOES_PLATE_SET3", skills: ["F: Charge", "P1: Heavy Foot"]}
                }
              }
            ]
          })
        };
      }
    },
    extractText: (result) => {
      return result.result || '';
    },
    storage: {
      getItem: async (key, options) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      },
      setItem: async (key, value, options) => {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const btnPersonal = document.getElementById('btnAiPersonal');
  const btnGroup = document.getElementById('btnAiGroup');
  const viewPersonal = document.getElementById('aiViewPersonal');
  const viewGroup = document.getElementById('aiViewGroup');
  
  const resultDiv = document.getElementById('aiBuildResult');
  const loadingDiv = document.getElementById('aiBuildLoading');

  let currentMode = 'personal';

  if(btnPersonal && btnGroup && viewPersonal && viewGroup && resultDiv) {
      btnPersonal.addEventListener('click', () => {
        currentMode = 'personal';
        btnPersonal.classList.replace('bg-transparent', 'bg-albion-accent');
        btnPersonal.classList.replace('text-gray-400', 'text-black');
        btnGroup.classList.replace('bg-albion-accent', 'bg-transparent');
        btnGroup.classList.replace('text-black', 'text-gray-400');
        
        viewPersonal.classList.remove('hidden');
        viewGroup.classList.add('hidden');
        resultDiv.classList.add('hidden');
      });

      btnGroup.addEventListener('click', () => {
        currentMode = 'group';
        btnGroup.classList.replace('bg-transparent', 'bg-albion-accent');
        btnGroup.classList.replace('text-gray-400', 'text-black');
        btnPersonal.classList.replace('bg-albion-accent', 'bg-transparent');
        btnPersonal.classList.replace('text-black', 'text-gray-400');
        
        viewGroup.classList.remove('hidden');
        viewPersonal.classList.add('hidden');
        resultDiv.classList.add('hidden');
      });
  }

  let weaponDB = [ { category: "🔍 Canlı Arama", isSearch: true } ];
  
  const catContainer = document.getElementById('weaponCategories');
  const gridContainer = document.getElementById('weaponGrid');
  const inputWeaponId = document.getElementById('selectedWeaponId');
  const inputWeaponName = document.getElementById('selectedWeaponName');
  const iconTarget = document.getElementById('selectedWeaponIcon');
  const textTarget = document.getElementById('selectedWeaponText');
  const btnSubmit = document.getElementById('btnPersonalSubmit');

  function renderWeaponPickerData(itemsData) {
    const catMap = {
       sword: "Kılıçlar", axe: "Baltalar", mace: "Gürzler", hammer: "Çekiçler",
       dagger: "Hançerler", spear: "Mızraklar", knuckles: "Eldivenler",
       bow: "Yaylar", crossbow: "Arbaletler", qstaff: "Sopalar",
       fire: "Ateş Asaları", frost: "Buz Asaları", arcane: "Gizem Asaları",
       curse: "Lanetli Asalar", nature: "Doğa Asaları", holy: "Kutsal Asalar",
       shape: "Şekil Değiştirenler",
       phelmet: "Plaka Kafalık", parmor: "Plaka Gövdelik", pshoes: "Plaka Ayakkabı",
       chelmet: "Kumaş Kafalık", carmor: "Kumaş Gövdelik", cshoes: "Kumaş Ayakkabı",
       lhelmet: "Deri Kafalık", larmor: "Deri Gövdelik", lshoes: "Deri Ayakkabı",
       offhand: "Off-hand", cape: "Pelerin",
       other: "Diğer Eşyalar"
    };
    
    const newDB = [ { category: "🔍 Canlı Arama", isSearch: true } ];
    const grouped = {};
    
    itemsData.forEach(i => {
       const key = i.subCat;
       if (!grouped[key]) grouped[key] = [];
       grouped[key].push(i);
    });

    for (const [key, items] of Object.entries(grouped)) {
       const title = catMap[key] || (key.charAt(0).toUpperCase() + key.slice(1));
       items.sort((a,b) => a.name.localeCompare(b.name));
       if (items.length > 0) newDB.push({ category: title, items: items });
    }

    weaponDB = newDB;
    renderWeaponPicker();
  }

  function initDynamicWeaponDB() {
    if(catContainer) catContainer.innerHTML = '';
    let exhaustiveWeaponDB = [];

    // Gerçek crafting verisi window.AO_ITEMS üzerinden eşyaları çıkar
    if (window.AO_ITEMS) {
        const validWeaponCats = ['sword','axe','mace','hammer','spear','bow','crossbow','nature','holy','fire','frost','arcane','curse','dagger','qstaff','knuckles','shape','phelmet','parmor','pshoes','chelmet','carmor','cshoes','lhelmet','larmor','lshoes','offhand','cape'];
        window.AO_ITEMS.forEach(item => {
           // İstenmeyen eşyaları (vanity, token, artifact) menüden temizleyelim
           if (item.id.includes('@') || item.id.includes('ARTEFACT') || item.id.includes('UNIQUE') || item.id.includes('PROTOTYPE') || item.id.includes('NON_TRADABLE') || item.id.includes('DEBUG') || item.id.includes('DECAY') || item.id.includes('ARENA') || item.id.includes('VANITY') || item.en === item.id) return;
           if (!validWeaponCats.includes(item.cat)) return;
           // Sadece savaş pelerinleri
           if (item.cat === 'cape' && item.id !== 'CAPE' && !item.id.startsWith('CAPEITEM_')) return;
           
           let maxTier = 8; // Standart olarak T8 resimlerini getireceğiz
           if(item.tiers && item.tiers.length > 0) maxTier = Math.max(...item.tiers);
           
           let idToUse = item.id.match(/^T\d_/) ? item.id : `T${maxTier}_${item.id}`;
           
           let cleanName = item.tr || item.en;
           cleanName = cleanName.replace(/^(Beginner's|Novice's|Journeyman's|Adept's|Expert's|Master's|Grandmaster's|Elder's|Tecrübesiz|Acemi|Çırak|Kalfa|Ehil|Uzman|Büyük Usta|Usta|Üstat|Yüce)\s+/i, '').trim();
           
           exhaustiveWeaponDB.push({
               id: idToUse,
               name: cleanName,
               subCat: item.cat
           });
        });

        // Çiftleri temizle
        const unique = [];
        const seen = new Set();
        exhaustiveWeaponDB.forEach(i => {
            if (!seen.has(i.id)) {
                seen.add(i.id);
                unique.push(i);
            }
        });
        exhaustiveWeaponDB = unique;
    }

    renderWeaponPickerData(exhaustiveWeaponDB);
  }

  function renderWeaponPicker() {
    if (!catContainer || !gridContainer) return;
    catContainer.innerHTML = '';
    
    weaponDB.forEach((cat, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      
      const isSearchBtn = cat.isSearch;
      btn.className = `px-3 py-1 text-[10px] font-bold rounded-lg whitespace-nowrap transition-colors border shrink-0 ${index === 0 ? 'bg-albion-accent text-black border-albion-accent' : 'bg-albion-900 text-gray-400 border-gray-600 hover:text-white'}`;
      btn.innerText = cat.category;
      
      btn.onclick = () => {
         Array.from(catContainer.children).forEach(c => {
           c.classList.remove('bg-albion-accent', 'text-black', 'border-albion-accent');
           c.classList.add('bg-albion-900', 'text-gray-400', 'border-gray-600');
         });
         btn.classList.add('bg-albion-accent', 'text-black', 'border-albion-accent');
         btn.classList.remove('bg-albion-900', 'text-gray-400', 'border-gray-600');
         
         if (isSearchBtn) {
            renderLiveSearch();
         } else {
            renderWeaponGrid(cat.items);
         }
      };
      catContainer.appendChild(btn);
    });

    renderLiveSearch();
  }

  function renderLiveSearch() {
    if(!gridContainer) return;
    gridContainer.innerHTML = `
       <div class="col-span-full mb-2 bg-[#0a0d14] border border-gray-700 p-2 rounded-lg shadow-inner">
         <div class="text-[10px] text-gray-400 mb-1.5 font-bold uppercase tracking-wider"><i class="fa-solid fa-cloud-arrow-down mr-1"></i> Albion Canlı Veritabanında Ara</div>
         <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-500 text-sm"></i>
            <input type="text" id="liveWeaponInput" placeholder="İngilizce Eşya adı yazın (Örn: Infinity, Crystal, Bloodletter)..." class="w-full bg-albion-900 border border-gray-600 rounded p-1.5 pl-8 text-sm text-white focus:border-albion-accent focus:outline-none transition-colors">
         </div>
         <div id="liveSearchLoading" class="hidden text-xs text-albion-accent mt-2 font-bold"><i class="fa-solid fa-spinner fa-spin mr-1"></i> Sunucudan çekiliyor...</div>
       </div>
       <div id="liveSearchGrid" class="col-span-full grid grid-cols-7 sm:grid-cols-10 lg:grid-cols-14 gap-1 w-full max-h-[160px] overflow-y-auto custom-scroll pr-1">
         <div class="col-span-full text-[10px] text-gray-500 py-2 italic text-center">Menülerden eşya seçebilir veya isimle arayabilirsiniz.</div>
       </div>
    `;

    const input = document.getElementById('liveWeaponInput');
    let timeout = null;
    if(input) {
        input.addEventListener('input', (e) => {
           clearTimeout(timeout);
           timeout = setTimeout(() => performLiveSearch(e.target.value), 600);
        });
    }
  }

  async function performLiveSearch(query) {
    if(query.trim().length < 3) return;
    const loading = document.getElementById('liveSearchLoading');
    const grid = document.getElementById('liveSearchGrid');
    if(!loading || !grid) return;

    loading.classList.remove('hidden');
    
    try {
      const targetUrl = `https://gameinfo.albiononline.com/api/gameinfo/search?q=${encodeURIComponent(query)}`;
      const urls = [
        targetUrl,
        'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(targetUrl),
        'https://corsproxy.io/?' + encodeURIComponent(targetUrl)
      ];
      
      let items = [];
      for (let url of urls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data && data.items) {
               items = data.items;
               break;
            }
          }
        } catch(err) {}
      }

      const formattedItems = items
         .filter(i => i.Id && i.Id.match(/^T[4-8]_/))
         .map(i => ({ id: i.Id, name: i.Name }));
         
      if(formattedItems.length === 0) {
         grid.innerHTML = '<div class="col-span-full text-xs text-gray-500 py-2 text-center">Sonuç bulunamadı. Tam ismini yazmayı deneyin.</div>';
      } else {
         renderGridItems(formattedItems, grid);
      }
    } catch (err) {
      grid.innerHTML = '<div class="col-span-full text-xs text-red-400 py-2 text-center">Arama sırasında hata oluştu.</div>';
    } finally {
      loading.classList.add('hidden');
    }
  }

  function renderGridItems(items, targetContainer) {
    targetContainer.innerHTML = '';
    items.forEach(item => {
       const btn = document.createElement('button');
       btn.type = 'button';
       btn.className = `relative w-full aspect-square bg-[#0a0d14] border border-gray-700 rounded p-0.5 hover:border-albion-accent hover:scale-105 transition-all group overflow-hidden shadow-inner flex items-center justify-center shrink-0`;
       
       const imgStr = `<img loading="lazy" src="https://render.albiononline.com/v1/item/${item.id}" class="w-full h-full object-contain drop-shadow-md transition-opacity" alt="${item.name}" onerror="this.style.display='none'">`;
       const titleHover = `<div class="absolute bottom-0 left-0 right-0 bg-black/90 text-[6px] md:text-[7px] text-white font-bold leading-tight py-0.5 px-0.5 text-center truncate opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">${item.name}</div>`;
       
       btn.innerHTML = imgStr + titleHover;
       
       if (inputWeaponId && inputWeaponId.value === item.id) {
          btn.classList.add('border-albion-accent', 'shadow-[0_0_10px_rgba(212,175,55,0.4)]');
       }

       btn.onclick = () => {
          if (inputWeaponId) inputWeaponId.value = item.id;
          if (inputWeaponName) inputWeaponName.value = item.name;
          
          document.querySelectorAll('#weaponGrid button, #liveSearchGrid button').forEach(c => c.classList.remove('border-albion-accent', 'shadow-[0_0_10px_rgba(212,175,55,0.4)]'));
          btn.classList.add('border-albion-accent', 'shadow-[0_0_10px_rgba(212,175,55,0.4)]');
          
          if (iconTarget) {
              iconTarget.innerHTML = `<img loading="lazy" src="https://render.albiononline.com/v1/item/${item.id}" class="w-full h-full object-contain p-0.5" onerror="this.style.display='none'">`;
          }
          if (textTarget) {
              textTarget.innerText = item.name;
              textTarget.classList.add('text-albion-accent');
          }
          
          if (btnSubmit) {
              btnSubmit.disabled = false;
              btnSubmit.classList.remove('bg-gray-600', 'text-gray-400', 'cursor-not-allowed');
              btnSubmit.classList.add('bg-albion-accent', 'hover:bg-albion-accent_hover', 'text-black');
          }
       };
       targetContainer.appendChild(btn);
    });
  }

  function renderWeaponGrid(items) {
    if(!gridContainer) return;
    gridContainer.innerHTML = '';
    renderGridItems(items, gridContainer);
  }

  // Dinamik olarak window.AO_ITEMS yüklendiyse ondan beslen, gecikme ihtimaline karşı setTimeout
  setTimeout(() => {
    initDynamicWeaponDB();
  }, 500);

  function parseJSONSafely(text) {
    if (typeof text !== 'string') text = String(text);
    let cleanText = text.replace(/```(?:json)?/gi, '').replace(/`/g, '').trim();
    
    const start = cleanText.indexOf('{');
    const end = cleanText.lastIndexOf('}');
    
    if (start !== -1 && end !== -1 && end >= start) {
      let jsonStr = cleanText.substring(start, end + 1);
      jsonStr = jsonStr.replace(/,\s*([\]}])/g, '$1'); // sondaki virgülleri düzelt
      
      try { 
        return JSON.parse(jsonStr); 
      } catch (e) {
         try {
           const fixed = jsonStr.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":').replace(/'/g, '"');
           return JSON.parse(fixed);
         } catch(e2) {
           console.error("JSON parse hatası:", e, "Metin:", jsonStr);
         }
      }
    }
    
    throw new Error("Yapay Zeka doğru formatta (JSON) veri döndüremedi. Lütfen tekrar deneyin.");
  }

  // YAPAY ZEKA HALÜSİNASYON TEMİZLEYİCİ - ÇOK KATMANLI
  function sanitizeItemId(id) {
    if(!id || id === 'null' || id === 'NULL' || id.toLowerCase() === 'yok' || id.includes('...')) return 'NULL';
    let cid = id.toUpperCase().trim();
    
    cid = cid.replace(/^(T\d+_)+/, match => match.substring(0, 3));
    if (!cid.match(/^T[4-8]_/) && cid !== 'NULL') cid = 'T8_' + cid;

    // Halüsinasyon Regex Düzeltmeleri
    cid = cid.replace('_CHEST_', '_ARMOR_')
             .replace('_CLOAK_', '_CAPEITEM_')
             .replace('_BOOTS_', '_SHOES_')
             .replace('_HELMET_', '_HEAD_')
             .replace('FOOD_DRINK', 'POTION_ENERGY')
             .replace('FOOD_HEALING', 'POTION_HEAL')
             .replace('FOOD_POISON', 'POTION_POISON')
             .replace('MEAL_DRINK', 'POTION_ENERGY')
             .replace('OFFHAND_CROSSBOW', 'OFF_HORN')
             .replace('OFFHAND_', 'OFF_');

    if(cid.includes('FOOD_')) cid = 'T8_MEAL_STEW';
    if(cid.includes('MEAL_') && !cid.includes('STEW') && !cid.includes('OMELETTE') && !cid.includes('SANDWICH') && !cid.includes('PIE') && !cid.includes('SALAD')) cid = 'T8_MEAL_STEW';

    // Standart İsimlerden ID'ye Dönüştürme (Orijinal veritabanındaki tam adlara uyumlu)
    cid = cid.replace('MAGE_COWL', 'HEAD_CLOTH_SET2')
             .replace('CLERIC_COWL', 'HEAD_CLOTH_SET3')
             .replace('SCHOLAR_COWL', 'HEAD_CLOTH_SET1')
             .replace('MERCENARY_HOOD', 'HEAD_LEATHER_SET1')
             .replace('HUNTER_HOOD', 'HEAD_LEATHER_SET2')
             .replace('ASSASSIN_HOOD', 'HEAD_LEATHER_SET3')
             .replace('STALKER_HOOD', 'HEAD_LEATHER_MORGANA')
             .replace('HELLION_HOOD', 'HEAD_LEATHER_HELL')
             .replace('SPECTER_HOOD', 'HEAD_LEATHER_UNDEAD')
             .replace('SOLDIER_HELMET', 'HEAD_PLATE_SET1')
             .replace('KNIGHT_HELMET', 'HEAD_PLATE_SET2')
             .replace('JUDICATOR_HELMET', 'HEAD_PLATE_KEEPER')
             .replace('DUSKWEAVER_HELMET', 'HEAD_PLATE_FEY')
             .replace('MAGE_ROBE', 'ARMOR_CLOTH_SET2')
             .replace('CLERIC_ROBE', 'ARMOR_CLOTH_SET3')
             .replace('SCHOLAR_ROBE', 'ARMOR_CLOTH_SET1')
             .replace('MERCENARY_JACKET', 'ARMOR_LEATHER_SET1')
             .replace('HUNTER_JACKET', 'ARMOR_LEATHER_SET2')
             .replace('ASSASSIN_JACKET', 'ARMOR_LEATHER_SET3')
             .replace('STALKER_JACKET', 'ARMOR_LEATHER_MORGANA')
             .replace('HELLION_JACKET', 'ARMOR_LEATHER_HELL')
             .replace('SPECTER_JACKET', 'ARMOR_LEATHER_UNDEAD')
             .replace('SOLDIER_ARMOR', 'ARMOR_PLATE_SET1')
             .replace('KNIGHT_ARMOR', 'ARMOR_PLATE_SET2')
             .replace('JUDICATOR_ARMOR', 'ARMOR_PLATE_KEEPER')
             .replace('MAGE_SANDALS', 'SHOES_CLOTH_SET2')
             .replace('CLERIC_SANDALS', 'SHOES_CLOTH_SET3')
             .replace('SCHOLAR_SANDALS', 'SHOES_CLOTH_SET1')
             .replace('MERCENARY_SHOES', 'SHOES_LEATHER_SET1')
             .replace('HUNTER_SHOES', 'SHOES_LEATHER_SET2')
             .replace('ASSASSIN_SHOES', 'SHOES_LEATHER_SET3')
             .replace('STALKER_SHOES', 'SHOES_LEATHER_MORGANA')
             .replace('HELLION_SHOES', 'SHOES_LEATHER_HELL')
             .replace('SPECTER_SHOES', 'SHOES_LEATHER_UNDEAD')
             .replace('SOLDIER_BOOTS', 'SHOES_PLATE_SET1')
             .replace('KNIGHT_BOOTS', 'SHOES_PLATE_SET2')
             .replace('JUDICATOR_BOOTS', 'SHOES_PLATE_KEEPER')
             .replace('THETFORD_CAPE', 'CAPEITEM_FW_THETFORD')
             .replace('MARTLOCK_CAPE', 'CAPEITEM_FW_MARTLOCK')
             .replace('UNDEAD_CAPE', 'CAPEITEM_UNDEAD')
             .replace('LYMHURST_CAPE', 'CAPEITEM_FW_LYMHURST')
             .replace('BRIDGEWATCH_CAPE', 'CAPEITEM_FW_BRIDGEWATCH')
             .replace('CAERLEON_CAPE', 'CAPEITEM_FW_CAERLEON')
             .replace('AVALONIAN_CAPE', 'CAPEITEM_AVALON')
             .replace('MORGANAS_CAPE', 'CAPEITEM_MORGANA')
             .replace('BRECILIEN_CAPE', 'CAPEITEM_FW_BRECILIEN');

    if(cid === 'T8_BOOK' || cid === 'BOOK') cid = 'T8_OFF_BOOK';
    if(cid === 'T8_SHIELD' || cid === 'SHIELD') cid = 'T8_OFF_SHIELD';
    if(cid === 'T8_HORN' || cid === 'HORN') cid = 'T8_OFF_HORN';
    if(cid === 'T8_TORCH' || cid === 'TORCH') cid = 'T8_OFF_TORCH';

    // Force exact potion tiers
    if (cid.includes('POTION_HEAL')) cid = 'T6_POTION_HEAL';
    if (cid.includes('POTION_MANA') || cid.includes('POTION_ENERGY')) cid = 'T6_POTION_ENERGY';
    if (cid.includes('POTION_POISON')) cid = 'T6_POTION_POISON';
    if (cid.includes('POTION_STONESKIN')) cid = 'T8_POTION_STONESKIN';
    if (cid.includes('POTION_COOLDOWN')) cid = 'T8_POTION_COOLDOWN';

    // Append SET1 if missing for armors
    if(cid.match(/^T[4-8]_SHOES_[A-Z]+$/)) cid += '_SET1';
    if(cid.match(/^T[4-8]_HEAD_[A-Z]+$/)) cid += '_SET1';
    if(cid.match(/^T[4-8]_ARMOR_[A-Z]+$/)) cid += '_SET1';

    // Cleanup misformatted capes
    cid = cid.replace('_CAPEITEM_SET1', '_CAPEITEM');

    return cid;
  }

  function renderVisualSlot(slotName, itemData, iconClass) {
    const cleanId = itemData && itemData.id ? sanitizeItemId(itemData.id) : 'NULL';
    
    if (!itemData || cleanId === 'NULL') {
       return `<div class="w-10 h-10 md:w-12 md:h-12 bg-[#0a0d14] border border-gray-800 rounded flex items-center justify-center opacity-40 shadow-inner"><i class="fa-solid ${iconClass} text-lg md:text-xl text-gray-700"></i></div>`;
    }
    
    // Consumable itemlar (yemek, iksir)
    const isConsumable = cleanId.includes('MEAL') || cleanId.includes('POTION');
    
    if (isConsumable) {
       const consumableIcon = cleanId.includes('MEAL') ? 'fa-utensils' : 'fa-flask';
       return `
         <div class="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#1a2233] to-[#0a0d14] border border-gray-500 rounded shadow-lg flex items-center justify-center p-1 group shrink-0">
            <i class="fa-solid ${consumableIcon} text-lg md:text-xl text-gray-400 group-hover:text-albion-accent transition-colors"></i>
            <div class="absolute -bottom-2 md:-bottom-2.5 left-1/2 transform -translate-x-1/2 bg-black/95 border border-gray-600 text-[7px] md:text-[8px] text-white font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-md">${itemData.name}</div>
         </div>
       `;
    }
    
    return `
      <div class="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#1a2233] to-[#0a0d14] border border-gray-500 rounded shadow-lg flex items-center justify-center p-1 group shrink-0">
         <img loading="lazy" src="https://render.albiononline.com/v1/item/${cleanId}" class="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform" alt="${itemData.name}" onerror="this.style.display='none';">
         <div class="absolute -bottom-2 md:-bottom-2.5 left-1/2 transform -translate-x-1/2 bg-black/95 border border-gray-600 text-[7px] md:text-[8px] text-white font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-md">${itemData.name}</div>
      </div>
    `;
  }

  function renderDetailRow(slotName, itemData) {
    const cleanId = itemData && itemData.id ? sanitizeItemId(itemData.id) : 'NULL';
    if (!itemData || cleanId === 'NULL') return '';
    
    const isConsumable = cleanId.includes('MEAL') || cleanId.includes('POTION');
    const consumableIcon = cleanId.includes('MEAL') ? 'fa-utensils' : 'fa-flask';
    const slotIconMap = {
      'Silah': 'fa-gavel',
      'Kafalık': 'fa-helmet-safety',
      'Gövdelik': 'fa-shirt',
      'Ayakkabı': 'fa-shoe-prints',
      'Pelerin': 'fa-user-ninja',
      'Off-hand': 'fa-shield',
      'Yemek': 'fa-utensils',
      'Iksir': 'fa-flask'
    };
    const fallbackIcon = isConsumable ? consumableIcon : (slotIconMap[slotName] || 'fa-box');
    
    let skillsHtml = '';
    if (itemData.skills && itemData.skills.length > 0) {
        const skillsContent = itemData.skills.map(s => {
             let key = ''; let text = s;
             const match = s.match(/^([QWEDFRP]\d*|Pasif)\s*[:-]\s*(.*)/i);
             if(match) { 
                key = match[1].toUpperCase(); 
                text = match[2]; 
             } else { 
                text = s; 
             }
             
             const isPassive = key.startsWith('P') || key === 'PASIF';
             if(key === 'PASIF') key = 'P1';

             const bgClass = isPassive ? 'bg-blue-900/40 border-blue-500/50 text-blue-300' : 'bg-albion-accent/20 border-albion-accent/50 text-albion-accent';
             const iconClass = isPassive ? 'fa-shield-halved' : 'fa-bolt';
             
             const keyHtml = key ? `<span class="bg-black/60 px-1 py-0.5 rounded mr-1 shadow-inner">${key}</span>` : '';
             
             return `<span class="text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded border shadow-sm ${bgClass} flex items-center"><i class="fa-solid ${iconClass} mr-1 text-[8px]"></i>${keyHtml}<span class="tracking-wide">${text}</span></span>`;
          }).join('');
        skillsHtml = `<div class="mt-1 flex flex-wrap gap-1 items-center">${skillsContent}</div>`;
    }

    return `
      <div class="bg-albion-900 border border-gray-700 p-2 rounded-lg flex items-start space-x-2.5 hover:border-albion-accent/50 transition-colors shadow-inner w-full">
        <div class="relative w-8 h-8 md:w-10 md:h-10 bg-[#0a0d14] rounded border border-gray-800 flex items-center justify-center p-0.5 shrink-0 group mt-0.5">
          ${isConsumable ? `<i class="fa-solid ${fallbackIcon} text-sm md:text-base text-gray-400"></i>` : `<img loading="lazy" src="https://render.albiononline.com/v1/item/${cleanId}" class="w-full h-full object-contain group-hover:scale-110 transition-transform" onerror="this.style.display='none';">`}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5 mb-0.5">
             <div class="text-[7px] md:text-[8px] bg-gray-800 border border-gray-600 px-1 py-0.5 rounded text-gray-400 uppercase font-black tracking-widest shrink-0">${slotName}</div>
             <div class="text-[10px] md:text-xs font-bold text-white tracking-wide truncate" title="${itemData.name}">${itemData.name}</div>
          </div>
          ${skillsHtml}
        </div>
      </div>
    `;
  }

  // --- DEPO SANTRALI (CACHE) FONKSİYONLARI ---
  async function getCachedBuild(cacheKey) {
     if(window.miniappsAI && window.miniappsAI.storage) {
        try {
           const data = await window.miniappsAI.storage.getItem(cacheKey, { area: 'persistent' });
           if(data) return JSON.parse(data);
        } catch(e) { console.warn("Cache read err:", e); }
     }
     return null;
  }

  async function setCachedBuild(cacheKey, data) {
     if(window.miniappsAI && window.miniappsAI.storage) {
        try {
           await window.miniappsAI.storage.setItem(cacheKey, JSON.stringify(data), { area: 'persistent' });
        } catch(e) { console.warn("Cache write err:", e); }
     }
  }


  // --- DUAL BUILD SUBMIT (PvE & PvP) ---
  if(btnSubmit) {
      btnSubmit.addEventListener('click', async (e) => {
        e.preventDefault();
        const weaponId = document.getElementById('selectedWeaponId').value;
        const weaponName = document.getElementById('selectedWeaponName').value;
        const extraInput = document.getElementById('buildExtra');
        const extra = extraInput ? extraInput.value.trim() : '';
        
        if (!weaponId) return;

        viewPersonal.classList.add('hidden');
        resultDiv.classList.add('hidden');
        loadingDiv.classList.remove('hidden');
        loadingDiv.classList.add('flex');

        try {
          const cacheKey = `ai_build_personal_${weaponId}_${extra.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
          const cachedData = await getCachedBuild(cacheKey);
          
          if (cachedData) {
             renderDualBuild(cachedData.pve, cachedData.pvp);
             loadingDiv.classList.add('hidden');
             loadingDiv.classList.remove('flex');
             return;
          }

          const extraPrompt = extra ? `\\nAyrıca kullanıcının şu özel notunu kesinlikle dikkate al: "${extra}"` : '';

          let spellContext = '';
          if (window.AOT_DATA && window.AOT_DATA.spells && window.AOT_DATA.spells[weaponId]) {
              const weaponSpells = window.AOT_DATA.spells[weaponId];
              const spellText = weaponSpells.map(s => `${s.slot}: ${s.name} (${s.cooldown}s CD, ${s.energy} Enerji)`).join('\\n');
              spellContext = `\\n\\n[EŞYANIN GERÇEK OYUN İÇİ YETENEKLERİ]:\\n${spellText}\\n(Lütfen build açıklamalarında bu yeteneklerin orijinal bekleme sürelerini ve enerji bedellerini de kesinlikle kullan.)\\n`;
          }
          
          let libraryContext = '';
          if (window.AO_ITEMS) {
              const equipCats = ['phelmet', 'parmor', 'pshoes', 'chelmet', 'carmor', 'cshoes', 'lhelmet', 'larmor', 'lshoes', 'cape', 'offhand'];
              const filtered = window.AO_ITEMS.filter(i => equipCats.includes(i.cat));
              const compactList = filtered.map(i => `${i.en.replace(/^(Novice's|Journeyman's|Adept's|Expert's|Master's|Grandmaster's|Elder's) /i, '')}: ${i.id}`);
              libraryContext = `\\n\\n[KÜTÜPHANE VERİLERİMİZ - SADECE BU ID'LERİ KULLAN]:\\n` + compactList.join(', ');
          }

          const prompt = `Kullanıcı görsel arayüzden "${weaponName}" (${weaponId}) eşyasını seçti. \\nLütfen bu eşyayı kullanarak, 1 adet "Solo PvE" (Zindan/Farm) ve 1 adet "Solo/Small PvP" (Ganking/1v1) olmak üzere İKİ FARKLI set oluştur.${extraPrompt}${spellContext}${libraryContext}\\n\\nÖNEMLİ KURALLAR - LÜTFEN BİR MAKİNE GİBİ UY:\\n1. "id" kısımlarına KESİNLİKLE Kütüphane Verilerimizde geçen gerçek ID'leri yaz. ASLA uydurma ID (T8_FOOD_DRINK, vb.) yazma! (ID'lerin başına T8_ eklemeyi unutma).\\n2. Pelerin için: T8_CAPE, T8_CAPEITEM_UNDEAD, T8_CAPEITEM_FW_THETFORD, vb. kullan.\\n3. Yemek için SADECE: T8_MEAL_STEW, T8_MEAL_OMELETTE, T8_MEAL_SANDWICH, T7_MEAL_PIE, T8_MEAL_SALAD kullan.\\n4. İksir için SADECE: T6_POTION_HEAL, T6_POTION_POISON, T6_POTION_ENERGY, T8_POTION_STONESKIN kullan.\\n5. Yetenekleri (skills) "Q1: [İsim]", "W1: [İsim]", "E: [İsim]", "P2: [Pasif]" formatında ÇOK KISA YAZ (maksimum 3 kelime). Asla uzun cümle kurma! SADECE VE SADECE TEK BİR JSON OBJESİ (HEM PVE HEM PVP'Yİ İÇERECEK ŞEKİLDE) DÖN, BAŞKA HİÇBİR METİN YAZMA:\\n{\n  "pve": {\n    "name": "PvE - Hızlı Temizleme",\n    "description": "Kısa ve öz açıklama (maks 1 cümle).",\n    "items": {\n      "weapon": {"name": "İngilizce Silah", "id": "T8_...", "skills": ["Q1: ...", "W1: ...", "E: ...", "P2: ..."]},\n      "offhand": {"name": "İngilizce Offhand (Yoksa null)", "id": "T8_...", "skills": []},\n      "head": {"name": "İngilizce Kafalık", "id": "T8_...", "skills": ["D: ...", "P1: ..."]},\n      "chest": {"name": "İngilizce Gövdelik", "id": "T8_...", "skills": ["R: ...", "P1: ..."]},\n      "shoes": {"name": "İngilizce Ayakkabı", "id": "T8_...", "skills": ["F: ...", "P1: ..."]},\n      "cape": {"name": "İngilizce Pelerin", "id": "T8_...", "skills": ["P1: ..."]},\n      "food": {"name": "İngilizce Yemek", "id": "T8_MEAL_STEW", "skills": []},\n      "potion": {"name": "İngilizce İksir", "id": "T6_POTION_POISON", "skills": []}\n    }\n  },\n  "pvp": { ...Aynı yapı... }\n}`;

          if (!window.miniappsAI || !window.miniappsAI.callModel) {
            throw new Error("AI servisi yüklenemedi. Lütfen sayfayı yenileyin.");
          }

          const result = await window.miniappsAI.callModel({
            modelId: MODEL_ID,
            messages: [
              { role: 'system', content: 'You are an Albion Online build generator. Output EXACTLY ONE valid JSON containing BOTH `pve` and `pvp` keys. DO NOT output two separate JSON blocks. NO TEXT OUTSIDE JSON. KEEP DESCRIPTIONS EXTREMELY SHORT. NEVER translate item names. NEVER invent fake IDs.' },
              { role: 'user', content: prompt }
            ],
            timeoutMs: 40000
          });

          const text = window.miniappsAI.extractText(result);
          const buildData = parseJSONSafely(text);
          
          if(!buildData.pve || !buildData.pvp) throw new Error("Yapay Zeka beklenen formatta çift set döndüremedi.");
          
          await setCachedBuild(cacheKey, buildData);
          renderDualBuild(buildData.pve, buildData.pvp);

        } catch (err) {
          handleError(err);
        } finally {
          loadingDiv.classList.add('hidden');
          loadingDiv.classList.remove('flex');
        }
      });
  }

  // --- GROUP BUILD SUBMIT ---
  const btnGroupSubmit = document.getElementById('btnGroupSubmit');
  if(btnGroupSubmit) {
      btnGroupSubmit.addEventListener('click', async (e) => {
        e.preventDefault();
        const contentSelect = document.getElementById('buildContentGroup');
        const content = contentSelect ? contentSelect.value : 'Grup İçeriği';

        viewGroup.classList.add('hidden');
        resultDiv.classList.add('hidden');
        loadingDiv.classList.remove('hidden');
        loadingDiv.classList.add('flex');

        try {
          const cacheKey = `ai_build_group_${content.replace(/[^a-z0-9]/gi, '')}`;
          const cachedData = await getCachedBuild(cacheKey);
          
          if (cachedData) {
             renderGroupBuild(cachedData, content);
             loadingDiv.classList.add('hidden');
             loadingDiv.classList.remove('flex');
             return;
          }

          let libraryContext = '';
          if (window.AO_ITEMS) {
              const equipCats = ['phelmet', 'parmor', 'pshoes', 'chelmet', 'carmor', 'cshoes', 'lhelmet', 'larmor', 'lshoes', 'cape', 'offhand'];
              const filtered = window.AO_ITEMS.filter(i => equipCats.includes(i.cat));
              const compactList = filtered.map(i => `${i.en.replace(/^(Novice's|Journeyman's|Adept's|Expert's|Master's|Grandmaster's|Elder's) /i, '')}: ${i.id}`);
              libraryContext = `\\n\\n[KÜTÜPHANE VERİLERİMİZ - SADECE BU ID'LERİ KULLAN]:\\n` + compactList.join(', ');
          }

          const prompt = `Sen bir Albion Online Meta kompozisyon uzmanısın. Kullanıcı "${content}" içerik türünü seçti. \\nLütfen bu içerik için en ideal "Meta Grup Kompozisyonunu" oluştur. İstenen yapıya tam uy.${libraryContext}\\nÖNEMLİ KURALLAR:\\n1. "title", "strategy", "roleName" Türkçe olsun. Eşyaların "name" (isim) kısmını İngilizce orijinal haliyle bırak.\\n2. Yetenekleri KESİNLİKLE "Q1: İsim", "W1: İsim", "E: İsim", "P2: Pasif" formatında Türkçe DÖN VE ÇOK KISA (maks 3 kelime) yaz.\\n3. "id" kısmına KESİNLİKLE Kütüphane Verilerimizde geçen gerçek ID'leri yaz (Başına T8_ ekle). Asla uydurma ID'ler kullanma.\\nSadece JSON dön.\\n{\n  "title": "Kompozisyon Adı",\n  "strategy": "Grubun genel stratejisi (kısa ve öz)...",\n  "roles": [\n    {\n      "roleName": "Rol Adı",\n      "items": {\n        "weapon": {"name": "Silah", "id": "T8_MAIN_...", "skills": ["Q1: ...", "W1: ...", "E: ...", "P2: ..."]},\n        "head": {"name": "Kafalık", "id": "T8_HEAD_...", "skills": ["D: ...", "P1: ..."]},\n        "chest": {"name": "Gövdelik", "id": "T8_ARMOR_...", "skills": ["R: ...", "P1: ..."]},\n        "shoes": {"name": "Ayakkabı", "id": "T8_SHOES_...", "skills": ["F: ...", "P1: ..."]}\n      }\n    }\n  ]\n}`;

          if (!window.miniappsAI || !window.miniappsAI.callModel) {
            throw new Error("AI servisi yüklenemedi. Lütfen sayfayı yenileyin.");
          }

          const result = await window.miniappsAI.callModel({
            modelId: MODEL_ID,
            messages: [
              { role: 'system', content: 'You are an Albion Online meta group composer. ONLY output valid JSON. KEEP DESCRIPTIONS EXTREMELY SHORT. NEVER translate item names. USE EXACT IN-GAME IDs. NO FAKE IDs.' },
              { role: 'user', content: prompt }
            ],
            timeoutMs: 40000
          });

          const text = window.miniappsAI.extractText(result);
          const buildData = parseJSONSafely(text);
          
          await setCachedBuild(cacheKey, buildData);
          renderGroupBuild(buildData, content);

        } catch (err) {
          handleError(err);
        } finally {
          loadingDiv.classList.add('hidden');
          loadingDiv.classList.remove('flex');
        }
      });
  }


  // --- RENDER FUNCTIONS ---
  window.downloadBuildImage = function() {
    if (typeof html2canvas === 'undefined') {
        alert('Görsel kaydetme özelliği tarayıcı güvenlik politikası nedeniyle geçici olarak devre dışıdır.');
        return;
    }
    const buildElement = document.getElementById('buildExportArea');
    if(!buildElement) return;
    
    const dlBtn = document.getElementById('btnDownloadImage');
    if(dlBtn) dlBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Hazırlanıyor...';

    html2canvas(buildElement, { backgroundColor: '#0a0a0a', useCORS: true, scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'AoT-PNASF-Build.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        if(dlBtn) dlBtn.innerHTML = '<i class="fa-solid fa-camera mr-2"></i> Görseli Kaydet / Paylaş';
    }).catch(err => {
        console.error("Görsel oluşturma hatası:", err);
        if(dlBtn) dlBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-2"></i> Hata Oluştu';
    });
  };

  function createBuildBlock(data, isPvp) {
     const titleColor = isPvp ? 'text-red-400' : 'text-blue-400';
     const borderColor = isPvp ? 'border-red-500' : 'border-blue-500';
     const bgAccent = isPvp ? 'bg-red-900/10' : 'bg-blue-900/10';
     const icon = isPvp ? 'fa-khanda' : 'fa-dragon';

     const offhandHtml = data.items.offhand && data.items.offhand.id && sanitizeItemId(data.items.offhand.id) !== 'NULL' 
          ? renderVisualSlot('Kalkan', data.items.offhand, 'fa-shield') 
          : '<div class="w-10 h-10 md:w-12 md:h-12 bg-black/50 border border-gray-800 rounded flex items-center justify-center opacity-40"><i class="fa-solid fa-shield text-sm text-gray-700"></i></div>';

     const offhandDetailHtml = data.items.offhand && data.items.offhand.id && sanitizeItemId(data.items.offhand.id) !== 'NULL' 
          ? renderDetailRow('Off-hand', data.items.offhand) 
          : '';

     const capeDetailHtml = data.items.cape && data.items.cape.id && sanitizeItemId(data.items.cape.id) !== 'NULL' 
          ? renderDetailRow('Pelerin', data.items.cape) 
          : '';

     return `
        <div class="bg-albion-800 p-4 rounded-xl border border-gray-700 shadow-xl mb-4 relative overflow-hidden" style="background-color: #1a1a1a;">
           <div class="absolute top-0 right-0 w-24 h-24 ${bgAccent} rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
           
           <div class="flex justify-between items-start mb-2 relative z-10">
             <div>
               <h3 class="text-base md:text-lg font-black ${titleColor} drop-shadow-sm mb-0.5"><i class="fa-solid ${icon} mr-2"></i>${data.name || 'Build'}</h3>
             </div>
             <div class="text-[7px] md:text-[8px] text-gray-500 font-bold uppercase tracking-widest border border-gray-700 px-1.5 py-0.5 rounded shrink-0">AoT-PNASF</div>
           </div>
           
           <p class="text-gray-300 mb-3 bg-[#0a0a0a]/50 p-2.5 rounded-lg border-l-4 ${borderColor} italic text-[10px] md:text-xs leading-relaxed relative z-10" style="background-color: #0d0d0d;">
              ${data.description || ''}
           </p>
           
           <div class="flex flex-col lg:flex-row gap-3 relative z-10">
              <div class="w-full lg:w-auto flex justify-center items-center bg-[#0a0d14] border border-gray-800 p-2.5 rounded-xl shadow-inner shrink-0 relative overflow-hidden h-max">
                 <div class="grid grid-cols-3 gap-1.5 relative z-10">
                    <div class="flex justify-center">${renderVisualSlot('Pelerin', data.items.cape, 'fa-user-ninja')}</div>
                    <div class="flex justify-center">${renderVisualSlot('Kafalık', data.items.head, 'fa-helmet-safety')}</div>
                    <div class="flex justify-center"><div class="w-10 h-10 md:w-12 md:h-12 bg-black/50 border border-gray-800 rounded flex items-center justify-center opacity-40"><i class="fa-solid fa-sack-xmark text-sm text-gray-700"></i></div></div>
                    
                    <div class="flex justify-center">${renderVisualSlot('Silah', data.items.weapon, 'fa-gavel')}</div>
                    <div class="flex justify-center">${renderVisualSlot('Gövdelik', data.items.chest, 'fa-shirt')}</div>
                    <div class="flex justify-center">${offhandHtml}</div>
                    
                    <div class="flex justify-center">${renderVisualSlot('Yemek', data.items.food, 'fa-utensils')}</div>
                    <div class="flex justify-center">${renderVisualSlot('Ayakkabı', data.items.shoes, 'fa-shoe-prints')}</div>
                    <div class="flex justify-center">${renderVisualSlot('İksir', data.items.potion, 'fa-flask')}</div>
                 </div>
              </div>

              <div class="flex-1 flex flex-col gap-1.5 justify-center">
                 ${renderDetailRow('Silah', data.items.weapon)}
                 ${offhandDetailHtml}
                 ${renderDetailRow('Kafalık', data.items.head)}
                 ${renderDetailRow('Gövdelik', data.items.chest)}
                 ${renderDetailRow('Ayakkabı', data.items.shoes)}
                 ${capeDetailHtml}
              </div>
           </div>
        </div>
     `;
  }

  function renderDualBuild(pveData, pvpData) {
    if(!resultDiv) return;
    let html = `
      <div class="flex justify-between items-center mb-4">
         <button class="back-to-form-btn text-gray-400 hover:text-white bg-albion-900 px-3 py-1.5 text-xs rounded-lg border border-gray-600 transition-colors font-bold"><i class="fa-solid fa-arrow-left mr-2"></i> Seçimi Değiştir</button>
         <button id="btnDownloadImage" class="build-download-btn bg-albion-accent hover:bg-albion-accent_hover text-black px-3 py-1.5 text-xs rounded-lg font-bold transition-transform hover:scale-105 shadow-md flex items-center">
            <i class="fa-solid fa-camera mr-2"></i> Görseli Kaydet
         </button>
      </div>

      <div id="buildExportArea" class="bg-[#0a0a0a] p-3 rounded-xl border-2 border-gray-800 max-w-6xl mx-auto">
         ${createBuildBlock(pveData, false)}
         ${createBuildBlock(pvpData, true)}
      </div>
    `;

    resultDiv.innerHTML = html;
    resultDiv.classList.remove('hidden');
  }

  function renderGroupBuild(data, contentStr) {
    if(!resultDiv) return;
    let rolesHtml = '';
    
    if (data.roles && Array.isArray(data.roles)) {
       rolesHtml = data.roles.map(role => `
          <div class="bg-black/30 border border-gray-700 rounded-xl p-3 shadow-lg" style="background-color: rgba(0,0,0,0.3);">
             <h4 class="text-sm font-black text-white mb-2 border-b border-gray-600 pb-1.5 flex justify-between items-center">
                <span><i class="fa-solid fa-user-shield text-albion-accent mr-2"></i>${role.roleName}</span>
             </h4>
             
             <div class="flex flex-col xl:flex-row gap-2.5">
                <div class="flex items-center justify-center bg-[#0a0d14] p-2.5 rounded-xl border border-gray-800 shrink-0 shadow-inner">
                   <div class="grid grid-cols-2 gap-1.5">
                      ${renderVisualSlot('Kafalık', role.items.head, 'fa-helmet-safety')}
                      ${renderVisualSlot('Gövdelik', role.items.chest, 'fa-shirt')}
                      ${renderVisualSlot('Silah', role.items.weapon, 'fa-gavel')}
                      ${renderVisualSlot('Ayakkabı', role.items.shoes, 'fa-shoe-prints')}
                   </div>
                </div>
                
                <div class="flex-1 flex flex-col gap-1.5 justify-center">
                   ${renderDetailRow('Silah', role.items.weapon)}
                   ${renderDetailRow('Kafalık', role.items.head)}
                   ${renderDetailRow('Gövdelik', role.items.chest)}
                   ${renderDetailRow('Ayakkabı', role.items.shoes)}
                </div>
             </div>
          </div>
       `).join('');
    }

    let html = `
      <div class="flex justify-between items-center mb-4">
         <button class="back-to-form-btn text-gray-400 hover:text-white bg-albion-900 px-3 py-1.5 text-xs rounded-lg border border-gray-600 transition-colors font-bold"><i class="fa-solid fa-arrow-left mr-2"></i> Geri Dön</button>
         <button id="btnDownloadImage" class="build-download-btn bg-blue-500 hover:bg-blue-400 text-white px-3 py-1.5 text-xs rounded-lg font-bold transition-transform hover:scale-105 shadow-md flex items-center">
            <i class="fa-solid fa-camera mr-2"></i> Görseli Kaydet
         </button>
      </div>

      <div id="buildExportArea" class="bg-albion-800 p-4 rounded-xl border border-gray-700 shadow-xl max-w-6xl mx-auto" style="background-color: #1a1a1a;">
        <div class="flex justify-between items-start mb-3">
          <div>
             <h3 class="text-lg md:text-xl font-black text-blue-400 drop-shadow-md mb-1"><i class="fa-solid fa-users-viewfinder mr-2\"></i>${data.title || 'Meta Kompozisyonu'}</h3>
             <div class="text-[10px] font-bold text-gray-300 bg-black/40 px-2 py-0.5 rounded inline-block border border-gray-700 shadow-sm">${contentStr}</div>
          </div>
          <div class="text-[7px] md:text-[8px] text-gray-500 font-bold uppercase tracking-widest border border-gray-700 px-1.5 py-0.5 rounded">AoT-PNASF Meta</div>
        </div>
        <div class="text-gray-200 mb-5 bg-blue-900/10 p-3 rounded-lg border-l-4 border-blue-500 text-[10px] md:text-xs leading-relaxed shadow-inner" style="background-color: rgba(30,58,138,0.1);">
           <strong class="text-blue-400 uppercase tracking-widest text-[9px] mb-1 block"><i class="fa-solid fa-chess mr-1\"></i> Genel Strateji & Kombolar</strong>
           ${data.strategy || 'Bu içerik için özel bir strateji belirtilmedi.'}
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          ${rolesHtml}
        </div>
      </div>
    `;

    resultDiv.innerHTML = html;
    resultDiv.classList.remove('hidden');
  }

  function handleError(err) {
    if(!resultDiv) return;
    console.error("AI Build Error:", err);
    let errMsg = err.message;
    if (errMsg.includes("declined model consent")) {
       errMsg = "İşlemi iptal ettiniz. Yapay Zekanın size öneri yapabilmesi için izin vermeniz gerekmektedir.";
    }

    resultDiv.innerHTML = `<div class="bg-red-900/50 border border-red-500 p-4 rounded-xl shadow-lg max-w-2xl mx-auto text-center">
      <i class="fa-solid fa-triangle-exclamation text-3xl text-red-400 mb-2"></i>
      <h3 class="text-base font-bold text-white mb-1">Bir Hata Oluştu</h3>
      <p class="text-red-200 mb-4 text-[10px] md:text-xs">${errMsg}</p>
      <button class="back-to-form-btn bg-albion-700 hover:bg-albion-600 px-4 py-1.5 rounded-lg font-bold transition-colors text-white shadow-lg text-xs"><i class="fa-solid fa-rotate-left mr-2\"></i> Geri Dön ve Tekrar Dene</button>
    </div>`;
    resultDiv.classList.remove('hidden');
  }

  if(resultDiv) {
      resultDiv.addEventListener('click', (e) => {
        if (e.target.closest('.back-to-form-btn')) {
          if (currentMode === 'personal') {
             viewPersonal.classList.remove('hidden');
          } else {
             viewGroup.classList.remove('hidden');
          }
          resultDiv.classList.add('hidden');
        } else if (e.target.closest('.build-download-btn')) {
          window.downloadBuildImage();
        }
      });
  }
});