document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('avalonApp');
  if (!container) return;

  container.innerHTML = `
    <div class="h-full flex flex-col p-4 md:p-6 bg-albion-900 animate-fade-in relative">
        
        <!-- Header -->
        <div class="mb-4 shrink-0">
            <h2 class="text-2xl font-black text-white"><i class="fa-solid fa-route text-albion-accent mr-2"></i> ${window.t('avalon-title', 'Avalon Harita Platformları')}</h2>
            <p class="text-gray-400 text-sm mt-1">İstediğiniz Avalon Roads harita sağlayıcısına doğrudan bu pencereden, sekme değiştirmeden erişebilirsiniz.</p>
            <div class="mt-3 text-[11px] text-yellow-500 bg-yellow-900/20 border border-yellow-700/50 p-2.5 rounded-lg flex items-start shadow-inner">
                <i class="fa-solid fa-triangle-exclamation mr-2 mt-0.5 text-yellow-400 text-sm"></i>
                <p><strong>Önemli Bilgi:</strong> Bazı web siteleri güvenlik ayarları gereği (X-Frame-Options) başka bir sitenin içinde (iframe) çalışmayı reddedebilir. Eğer ekran beyaz kalır veya bağlantı hatası verirse, bu tamamen o sitenin kendi korumasından kaynaklanır.</p>
            </div>
        </div>

        <!-- Site Sekmeleri (Tarayıcı Mantığı) -->
        <div class="flex flex-wrap gap-2 mb-4 shrink-0 bg-albion-800 p-2 rounded-xl border border-gray-700 shadow-lg">
            <button class="avalon-tab-btn flex-1 md:flex-none px-5 py-2.5 bg-albion-accent text-black font-bold rounded-lg transition-colors flex items-center justify-center shadow-md" data-url="https://www.albionroads.com/">
                <i class="fa-solid fa-globe mr-2"></i> Albion Roads
            </button>
            <button class="avalon-tab-btn flex-1 md:flex-none px-5 py-2.5 bg-transparent text-gray-400 hover:text-white font-bold rounded-lg transition-colors flex items-center justify-center" data-url="https://www.albionmaps.com.br/">
                <i class="fa-solid fa-map mr-2"></i> Albion Maps (BR)
            </button>
            <button class="avalon-tab-btn flex-1 md:flex-none px-5 py-2.5 bg-transparent text-gray-400 hover:text-white font-bold rounded-lg transition-colors flex items-center justify-center" data-url="https://avalonroads-97617.web.app/">
                <i class="fa-solid fa-satellite-dish mr-2"></i> Avalon Tracker
            </button>
        </div>

        <!-- İç Tarayıcı (Iframe) Konteyneri -->
        <div class="flex-1 w-full bg-[#0a0a0a] rounded-xl border border-gray-600 overflow-hidden relative shadow-2xl">
            <!-- Yükleniyor Göstergesi -->
            <div id="avalonLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-0 transition-opacity duration-300">
               <div class="relative flex items-center justify-center w-16 h-16 bg-black/40 rounded-full border border-albion-accent shadow-[0_0_15px_rgba(212,175,55,0.4)] mb-4">
                  <i class="fa-solid fa-satellite text-2xl text-albion-accent animate-[spin_4s_linear_infinite]"></i>
                  <i class="fa-solid fa-signal absolute text-xs text-white animate-pulse"></i>
               </div>
               <span class="text-albion-accent font-bold tracking-widest uppercase text-sm">Site Bağlantısı Kuruluyor...</span>
            </div>
            
            <!-- Siteyi Gösteren Iframe -->
            <iframe id="avalonIframe" src="https://www.albionroads.com/" class="w-full h-full relative z-10 transition-opacity duration-500 bg-white" style="opacity: 0;" frameborder="0" allowfullscreen sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
        </div>
        
    </div>
  `;

  // Mantık ve Olay Dinleyicileri
  const btns = document.querySelectorAll('.avalon-tab-btn');
  const iframe = document.getElementById('avalonIframe');
  const loading = document.getElementById('avalonLoading');

  btns.forEach(btn => {
      btn.addEventListener('click', () => {
          // Buton renklerini sıfırla
          btns.forEach(b => {
              b.classList.remove('bg-albion-accent', 'text-black', 'shadow-md');
              b.classList.add('bg-transparent', 'text-gray-400');
          });
          
          // Tıklanan butonu aktifleştir
          btn.classList.add('bg-albion-accent', 'text-black', 'shadow-md');
          btn.classList.remove('bg-transparent', 'text-gray-400');

          // URL'yi al ve Iframe'i güncelle
          const url = btn.getAttribute('data-url');
          
          // Geçiş efekti için yükleniyor ekranını aç
          iframe.style.opacity = '0';
          iframe.style.pointerEvents = 'none';
          loading.style.opacity = '1';
          loading.style.zIndex = '20';
          
          // Yeni siteyi yükle
          setTimeout(() => {
             iframe.src = url;
          }, 200);
      });
  });

  // Site yüklendiğinde loading'i gizle
  iframe.addEventListener('load', () => {
      loading.style.opacity = '0';
      setTimeout(() => { loading.style.zIndex = '0'; }, 300);
      iframe.style.opacity = '1';
      iframe.style.pointerEvents = 'auto';
  });

});
