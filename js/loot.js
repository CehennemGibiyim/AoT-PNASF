document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('lootApp');
  if (!container) return;

  const titleStr = window.t ? window.t('loot-title', 'Loot Logger') : 'Albion Online Loot Logger';
  const fallbackText = window.t ? window.t('loot-fallback', 'Alternatif: Albion Maps (BR)') : 'Alternatif: Albion Maps (BR)';
  const loadingText = window.t ? window.t('loot-loading', 'Loot Logger Yükleniyor...') : 'Loot Logger Yükleniyor...';
  const openNewTabText = window.t ? window.t('loot-openNewTab', 'Yeni Sekmede Aç (Çalışmazsa)') : 'Yeni Sekmede Aç (Çalışmazsa)';

  container.innerHTML = `
    <div class="w-full h-full flex flex-col bg-albion-900 animate-fade-in relative">
        <div class="bg-albion-800 p-3 md:p-4 border-b border-gray-700 flex justify-between items-center shrink-0 z-20 shadow-md">
            <h2 class="text-lg md:text-xl font-bold text-white flex items-center">
                <i class="fa-solid fa-box-open text-albion-accent mr-2"></i> ${titleStr}
            </h2>
            <div class="flex gap-2">
                <a href="https://albionmaps.com/" target="_blank" class="text-xs md:text-sm bg-blue-900/50 hover:bg-blue-800 border border-blue-600 text-blue-200 px-3 py-1.5 rounded transition-colors flex items-center shadow-sm" title="Alternatif site">
                    <i class="fa-solid fa-map mr-1.5"></i> <span class="hidden md:inline">${fallbackText}</span>
                </a>
                <a href="https://matheus.sampaio.us/ao-loot-logger-viewer/" target="_blank" class="text-xs md:text-sm bg-albion-900 hover:bg-gray-700 border border-gray-600 text-gray-300 px-3 py-1.5 rounded transition-colors flex items-center shadow-sm" title="Eğer sayfa içinde yüklenmezse yeni sekmede açın">
                    <i class="fa-solid fa-arrow-up-right-from-square md:mr-1.5"></i> <span class="hidden md:inline">${openNewTabText}</span>
                </a>
            </div>
        </div>
        <div class="flex-1 w-full relative bg-black">
            <!-- Yükleniyor Göstergesi -->
            <div id="lootLoading" class="absolute inset-0 flex flex-col items-center justify-center text-albion-accent z-0 bg-albion-900">
                <i class="fa-solid fa-spinner fa-spin text-4xl mb-4 drop-shadow-md"></i>
                <span class="text-sm font-bold text-gray-400 tracking-wider">${loadingText}</span>
                <p class="text-xs text-gray-500 mt-2 max-w-md text-center px-4">Site yüklenmezse üstteki "Albion Maps (BR)" veya "Yeni Sekmede Aç" butonlarını kullanabilirsiniz.</p>
            </div>
            
            <!-- Iframe (İç İçe Gömülü Site) -->
            <iframe id="lootIframe" src="https://matheus.sampaio.us/ao-loot-logger-viewer/" class="absolute inset-0 w-full h-full border-0 z-10 opacity-0 transition-opacity duration-500" sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads allow-top-navigation-by-user-activation"></iframe>
        </div>
    </div>
  `;

  // Iframe yüklendiğinde loading animasyonunu gizle
  const iframe = document.getElementById('lootIframe');
  const loading = document.getElementById('lootLoading');
  
  if(iframe && loading) {
      iframe.addEventListener('load', () => {
          loading.classList.add('hidden');
          iframe.classList.remove('opacity-0');
      });
  }
});
