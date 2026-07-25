async function downloadProjectAsZip() {
  // 1. Arayüz oluştur
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(10,13,20,0.9);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;font-family:sans-serif;backdrop-filter:blur(8px);';
  
  const icon = document.createElement('div');
  icon.innerHTML = '<i class="fa-solid fa-file-zipper" style="font-size:4rem;color:#d4af37;margin-bottom:20px;"></i>';
  
  const title = document.createElement('h2');
  title.innerText = 'Proje Paketleniyor...';
  title.style.cssText = 'color:#d4af37;font-size:24px;margin-bottom:10px;font-weight:900;';
  
  const status = document.createElement('div');
  status.innerText = 'Tüm dosyalar ve klasörler toplanıyor...';
  status.style.cssText = 'margin-bottom:20px;color:#a3a3a3;font-size:14px;text-align:center;max-width:80%;';
  
  const pContainer = document.createElement('div');
  pContainer.style.cssText = 'width:300px;height:12px;background:#262626;border-radius:6px;overflow:hidden;border:1px solid #333;';
  
  const pFill = document.createElement('div');
  pFill.style.cssText = 'width:0%;height:100%;background:#d4af37;transition:width 0.2s ease-out;box-shadow:0 0 10px rgba(212,175,55,0.5);';
  
  pContainer.appendChild(pFill);
  overlay.appendChild(icon);
  overlay.appendChild(title);
  overlay.appendChild(status);
  overlay.appendChild(pContainer);
  document.body.appendChild(overlay);

  try {
    status.innerText = 'Kütüphaneler yükleniyor...';
    
    // JSZip ve FileSaver kütüphanelerini dinamik olarak yükle
    if (typeof JSZip === 'undefined') {
      await new Promise((res, rej) => { const s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
    }
    if (typeof saveAs === 'undefined') {
      await new Promise((res, rej) => { const s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js'; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
    }

    // Sistemdeki tüm dosyaların güncel listesi
    const files = [
      ".github/workflows/ai-bot.yml",
      ".github/workflows/ao-data-updater.yml",
      ".github/workflows/deploy.yml",
      ".github/workflows/pvp-fetcher.yml",
      ".gitignore",
      "data/feed.json",
      "data/fetch_items.js",
      "data/items-data.js",
      "data/items-weight.json",
      "data/opportunities.json",
      "data/pvp-feed.json",
      "data/spells-data.json",
      "data/sync-info.json",
      "data/world-data.js",
      "data/zone-bonuses.js",
      "generate-translations.py",
      "index.html",
      "js/ai-build.js",
      "js/arbitrage.js",
      "js/avalon.js",
      "js/crafting-new.js",
      "js/crafting.js",
      "js/events.js",
      "js/gathering.js",
      "js/i18n-helper.js",
      "js/image-cache.js",
      "js/lang.js",
      "js/loot.js",
      "js/main.js",
      "js/market-new.js",
      "js/nav.js",
      "js/pvp.js",
      "js/settings-lib.js",
      "js/settings-panel.js",
      "js/silver-calculator.js",
      "js/smart-scanner.js",
      "js/sync-button.js",
      "js/zipper.js",
      "lib/crafting.js",
      "lib/feed.js",
      "lib/guides.js",
      "lib/home.js",
      "lib/lang.js",
      "lib/maps.js",
      "lib/market.js",
      "lib/nav.js",
      "lib/pvp.js",
      "lib/settings-panel.js",
      "license",
      "locales/tr-official.json",
      "locales/tr.json",
      "miniapp.i18n.json",
      "package.json",
      "pages/crafting.html",
      "pages/guides.html",
      "pages/maps.html",
      "pages/market.html",
      "pages/pvp.html",
      "pages/tools.html",
      "readme.md",
      "scripts/ai-scanner.js",
      "scripts/ao-data-extractor.cjs",
      "scripts/pvp-fencher.cjs",
      "styles.css",
      "styles/crafting.css",
      "styles/main.css",
      "styles/market.css",
      "styles/settings.css"
    ];

    const zip = new JSZip();
    let success = 0;

    for (let i = 0; i < files.length; i++) {
      const path = files[i];
      status.innerText = `${path} klasöre ekleniyor... (${i+1}/${files.length})`;
      pFill.style.width = ((i + 1) / files.length * 100) + '%';
      
      try {
        let fetchUrl = path;
        
        // Cache bypass parametresi ekle
        fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + 't=' + Date.now();

        const res = await fetch(fetchUrl);
        if (res.ok) {
          let blob = await res.blob();
          zip.file(path, blob);
          success++;
        } else {
          console.warn("Dosya çekilemedi:", path, "HTTP:", res.status);
          
          // index.html için ekstra fallback
          if (path === 'index.html' || path === 'index.html?t=' + Date.now()) {
             // Sunucudan çekemediysek sayfanın anlık DOM yedeğini al
             const htmlContent = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
             zip.file('index.html', new Blob([htmlContent], {type: "text/html"}));
             success++;
          }
        }
      } catch(e) { 
        console.warn("Atlandı (Hata):", path, e); 
      }
    }
    
    status.innerText = 'Dosyalar sıkıştırılıyor (ZIP oluşturuluyor)...';
    const content = await zip.generateAsync({type:"blob"});
    saveAs(content, "AoT-PNASF-Full-Project.zip");
    
    status.innerText = `İndirme Başarılı! (${success} dosya arşivlendi)`;
    status.style.color = '#4ade80'; // yeşil
    
    setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.5s';
        setTimeout(() => overlay.remove(), 500);
    }, 2000);
    
  } catch (err) {
    console.error(err);
    status.innerText = 'Hata: ' + err.message;
    status.style.color = '#ef4444'; // kırmızı
    const btn = document.createElement('button');
    btn.innerText = 'Kapat';
    btn.style.cssText = 'margin-top:20px;background:#262626;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;';
    btn.onclick = () => overlay.remove();
    overlay.appendChild(btn);
  }
}