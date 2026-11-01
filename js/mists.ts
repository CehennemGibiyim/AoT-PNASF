/* AoT-PNASF — The Mists & Brecilien Rehberi
 *
 * Sırlar Diyarı (The Mists) ve gizli şehir Brecilien için oyuncu rehberi:
 * wisp nadirlik tablosu, wisp türleri, Brecilien açılışı/tesisleri,
 * Knightfall Abbey, kamplar, nadir doğuşlar, build ipuçları ve 20 dakikalık
 * Mist süre sayacı. Veriler topluluk rehberlerinden derlenmiştir.
 */
(() => {
  'use strict';

  const MIST_MINUTES = 20;          // Mist yaşam süresi
  const CLOSING_WARNING_MIN = 15;   // 15. dakikada kapanış penceresi uyarısı

  function t(key: string, fallback?: string) {
    return (window as any).t ? (window as any).t(key, fallback) : (fallback || key);
  }

  function esc(value: any) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c] as string));
  }

  // Wisp nadirliği → Mist tier dağılımı (topluluk tablosu)
  const RARITY_ROWS = [
    { key: 'common',    normal: 'T5 (100%)',            lethal: 'T6 (100%)' },
    { key: 'uncommon',  normal: 'T5 %67 / T6 %33',      lethal: 'T6 %67 / T7 %33' },
    { key: 'rare',      normal: 'T5 %40 / T6 %53 / T7 %7', lethal: 'T6 %40 / T7 %53 / T8 %7' },
    { key: 'epic',      normal: 'T6 %75 / T7 %25',      lethal: 'T7 %75 / T8 %25' },
    { key: 'legendary', normal: 'T7 (100%)',            lethal: 'T8 (100%)' }
  ];

  function card(icon: string, titleKey: string, titleFallback: string, bodyHtml: string, accent = false) {
    return `
      <div class="bg-albion-800 border ${accent ? 'border-albion-accent/50' : 'border-gray-700'} rounded-xl p-5 shadow-lg transition-colors">
        <div class="text-xs text-albion-accent font-bold mb-3 uppercase flex items-center border-b border-gray-700 pb-2">
          <i class="fa-solid ${icon} mr-2 text-lg"></i> <span>${esc(t(titleKey, titleFallback))}</span>
        </div>
        ${bodyHtml}
      </div>`;
  }

  function render() {
    const app = document.getElementById('mistsApp');
    if (!app) return;

    const rarityBody = `
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="text-[11px] uppercase text-gray-400 border-b border-gray-700">
            <th class="text-left py-2 pr-2">${esc(t('mists-col-rarity', 'Nadirlik'))}</th>
            <th class="text-left py-2 pr-2">${esc(t('mists-col-normal', 'Normal Mist'))}</th>
            <th class="text-left py-2">${esc(t('mists-col-lethal', 'Öldürücü Mist'))}</th>
          </tr>
        </thead>
        <tbody>
          ${RARITY_ROWS.map((r) => `
            <tr class="border-b border-gray-700/50">
              <td class="py-2 pr-2 font-bold text-white">${esc(t('mists-rarity-' + r.key, r.key.charAt(0).toUpperCase() + r.key.slice(1)))}</td>
              <td class="py-2 pr-2 text-gray-300 font-mono text-xs">${esc(r.normal)}</td>
              <td class="py-2 text-gray-300 font-mono text-xs">${esc(r.lethal)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      <p class="text-[10px] text-gray-500 mt-3">${esc(t('mists-rarity-note', 'Dağılımlar topluluk verisidir; oyun içi değişiklik olabilir.'))}</p>`;

    const wispsBody = `
      <div class="space-y-3">
        <div class="bg-albion-900 border border-gray-700 rounded-lg p-3">
          <div class="text-sm font-bold text-white mb-1"><i class="fa-solid fa-wand-magic-sparkles text-albion-accent mr-2"></i>${esc(t('mists-wisp-normal-t', "Will o' Wisp (Normal)"))}</div>
          <p class="text-xs text-gray-300 leading-relaxed">${esc(t('mists-wisp-normal-d', 'Ana yollardan uzakta bulunur (ıslık sesini dinle). İz rengi nadirliği gösterir; yanından geçince (~30 sn ömürlü) aynı nadirlikte rastgele bir Mist portalı açar. Görünmez/kalkanlıyken tetiklemez. Mavi bölgede wisp genelde yoktur; sarı bölgeden girilen Mist öldürücü değildir, kırmızı/siyah bölgesinden girilen öldürücüdür.'))}</p>
        </div>
        <div class="bg-albion-900 border border-red-500/30 rounded-lg p-3">
          <div class="text-sm font-bold text-white mb-1"><i class="fa-solid fa-people-group text-red-400 mr-2"></i>${esc(t('mists-wisp-greater-t', 'Greater Wisp'))}</div>
          <p class="text-xs text-gray-300 leading-relaxed">${esc(t('mists-wisp-greater-d', 'Greater Mist (ikili/duo) portalı açar: en fazla 2 kişiyle girilir ve HER ZAMAN öldürücüdür. Sadece kırmızı bölge, Outlands ve Avalon Yolları\'ndan girilir. Brecilien portalı değildir.'))}</p>
        </div>
        <div class="bg-albion-900 border border-green-500/30 rounded-lg p-3">
          <div class="text-sm font-bold text-white mb-1"><i class="fa-solid fa-gem text-green-400 mr-2"></i>${esc(t('mists-wisp-green-t', 'Yeşil Wisp (Resource Mist)'))}</div>
          <p class="text-xs text-gray-300 leading-relaxed">${esc(t('mists-wisp-green-d', 'Dinamik kaynak hotspotlarında görünür; o hotspotun kaynağından T6-T8 zengin, küçük bir Mist açar (solo ve "orta" sürümleri vardır). Kaynak toplamak için en verimli giriş.'))}</p>
        </div>
        <p class="text-xs text-gray-400 border-l-4 border-albion-accent/60 pl-3 py-1">${esc(t('mists-entry-note', 'Girişte faction flag düşer. Mist süresi ~20 dakikadır; kapanış penceresinde yeni bir wisp bulamazsan girdiğin noktaya dönersin. Mist içindeki portalları harita ikonundan oku: Knightfall Abbey (~2 dk ömür), Brecilien (nadir; haritada halkalı ikon) ve Avalon Yolu portalları farklı görünür.'))}</p>
      </div>`;

    const brecilienBody = `
      <ul class="text-xs text-gray-300 space-y-2.5 leading-relaxed">
        <li class="flex items-start"><i class="fa-solid fa-lock-open text-albion-accent mr-2 mt-0.5"></i><span><b class="text-white">${esc(t('mists-breci-unlockLabel', 'Açılış:'))}</b> ${esc(t('mists-breci-unlock', "50.000 Brecilien Standing ('Accepted' unvanı). Standing; kamplar, sandıklar, Crystal Spiderling, kafesten kurtarılan wisps ve özellikle Turbulent Mists'te zayıflamış wisp eskortuyla kazanılır (binme yasak; sadece standing + fame verir)."))}</span></li>
        <li class="flex items-start"><i class="fa-solid fa-circle-question text-albion-accent mr-2 mt-0.5"></i><span><b class="text-white">${esc(t('mists-breci-findLabel', 'Portalı bulma:'))}</b> ${esc(t('mists-breci-find', 'Mist içinde (nadir) veya Avalon Yolları\'nda belirir; yerel haritada portal ikonunun çevresinde halka var. Avalon portallarıyla karıştırma!'))}</span></li>
        <li class="flex items-start"><i class="fa-solid fa-building text-albion-accent mr-2 mt-0.5"></i><span><b class="text-white">${esc(t('mists-breci-facLabel', 'Tesisler:'))}</b> ${esc(t('mists-breci-facilities', 'Market, banka, crafting istasyonları, Vanity Merchant, Energy Manipulator, Travel Planner, Artificer (standing ile açılan Brecilien\'e özel eşyalar), şehir parselleri ve adalar.'))}</span></li>
        <li class="flex items-start"><i class="fa-solid fa-plane-departure text-albion-accent mr-2 mt-0.5"></i><span><b class="text-white">${esc(t('mists-breci-travelLabel', 'Çıkış:'))}</b> ${esc(t('mists-breci-travel', 'Brecilien\'i ziyaret etmek şehir sayıldığından Journey Back kullanılamaz. Travel Planner ile çık (ücret: eşya ağırlığı × 150 silver, her Brecilien rotası mesafe2 sayılır) veya üst kattaki kalıcı Avalon portalını kullan. Üst katta hep açık bir Mist portalı da vardır.'))}</span></li>
        <li class="flex items-start"><i class="fa-solid fa-flag text-albion-accent mr-2 mt-0.5"></i><span>${esc(t('mists-breci-faction', "Brecilien'in kendi faction'ı yoktur; Faction Warfare NPC'si bulunmaz."))}</span></li>
      </ul>`;

    const abbeyBody = `
      <ul class="text-xs text-gray-300 space-y-2.5 leading-relaxed">
        <li class="flex items-start"><i class="fa-solid fa-dungeon text-albion-accent mr-2 mt-0.5"></i><span>${esc(t('mists-abbey-desc', "Mists'in tek zindanıdır; Mist içindeki portaldan girilir (~2 dk ömür), T5-T8 arası olur ve tier mob/loot kalitesini belirler. Sabit düzen: sokaklarla bağlı 9 bina."))}</span></li>
        <li class="flex items-start"><i class="fa-solid fa-box-open text-albion-accent mr-2 mt-0.5"></i><span>${esc(t('mists-abbey-chests', 'Mob grubu temizliği sana ya combat buff (daha sık) ya da Common→Legendary kalitede sandık verir; boss odaları her zaman daha iyi sandık verir. Herkese açık en az bir global sandık ve yaklaştıkça görünen Coffer\'lar vardır. İçeride kaynak ve mythical creature yoktur.'))}</span></li>
        <li class="flex items-start"><i class="fa-solid fa-triangle-exclamation text-red-400 mr-2 mt-0.5"></i><span><b class="text-white">${esc(t('mists-abbey-riskLabel', 'Risk:'))}</b> ${esc(t('mists-abbey-risk', 'Aynı Abbey\'e başka oyuncular girebilir (portal birisi girince kapanır ama içerdekiler kalır). Can azken odaya girme, odaları hızlı temizle, dövüş seslerini dinle; kapanışta yerel haritadaki çıkışlardan birini kullan.'))}</span></li>
      </ul>`;

    const campBody = `
      <ul class="text-xs text-gray-300 space-y-2.5 leading-relaxed">
        <li class="flex items-start"><i class="fa-solid fa-campground text-albion-accent mr-2 mt-0.5"></i><span>${esc(t('mists-camp-desc', 'Her Mist\'te 1-4 kamp bulunur; büyük kamplar daha çok ödül verir. Kamp fame görevi tamamlanınca Common→Legendary kalitede Cache pop olur. Kamp dairesi sarı bölgede bile PvP\'ye açıktır.'))}</span></li>
        <li class="flex items-start"><i class="fa-solid fa-dragon text-albion-accent mr-2 mt-0.5"></i><span><b class="text-white">${esc(t('mists-camp-rareLabel', 'Nadir doğuşlar:'))}</b> ${esc(t('mists-camp-rare', 'Griffin, Fey Dragon ve Mistcrawler (Uncommon+ Mistlerde); Crystal Spiderling sadece siyah bölge/Greater Mists\'te doğar ve sandık seviyesinde ödül verir.'))}</span></li>
      </ul>`;

    const tipsBody = `
      <ul class="text-xs text-gray-300 space-y-2.5 leading-relaxed list-none">
        <li class="flex items-start"><i class="fa-solid fa-shield-halved text-albion-accent mr-2 mt-0.5"></i><span>${esc(t('mists-tip1', 'Solo Mist konsensusu: net temiz hasarı + savunma/heal + enerji yönetimi + sprint/görünmezlik kaçışı olan bir build. Seti ucuza tut — öldürücü Mist\'te kaybedersin.'))}</span></li>
        <li class="flex items-start"><i class="fa-solid fa-khanda text-albion-accent mr-2 mt-0.5"></i><span><b class="text-white">${esc(t('mists-tip2Label', 'Popüler solo silahlar:'))}</b> ${esc(t('mists-tip2', 'Battleaxe, Dual Swords, Deathgivers, Fists of Avalon, Cursed Staff, Prowling Staff, Bloodletter.'))}</span></li>
        <li class="flex items-start"><i class="fa-solid fa-mask text-albion-accent mr-2 mt-0.5"></i><span>${esc(t('mists-tip3', 'Kaçış: Guardian Helmet (anında binme), görünmezlik iksiri, mobilite botları. Mist\'te heal büyüsü etkisi solo ~%40, duo ~%35 azalır (oyun içi doğrulayın).'))}</span></li>
        <li class="flex items-start"><i class="fa-solid fa-sack-dollar text-albion-accent mr-2 mt-0.5"></i><span>${esc(t('mists-tip4', 'Taşıdığın ganimet set değerini aşınca bankala veya çık; 20 dakikalık Mist süresini sayacınla takip et.'))}</span></li>
      </ul>`;

    app.innerHTML = `
      <div class="flex flex-col h-full gap-4">
        <div class="bg-albion-900 border border-gray-700 p-4 rounded-xl shadow-lg shrink-0 transition-colors">
          <h3 class="text-xl font-bold text-white flex items-center">
            <i class="fa-solid fa-smog text-albion-accent mr-2"></i> <span>${esc(t('mists-title', 'The Mists & Brecilien Rehberi'))}</span>
          </h3>
          <p class="text-gray-400 text-xs mt-1">${esc(t('mists-desc', "Sırlar Diyarı: wisp'ler, nadirlikler, kamplar, Knightfall Abbey ve gizli şehir Brecilien. Tüm bilgiler topluluk rehberlerinden derlenmiştir."))}</p>
        </div>

        <!-- Mist Süre Sayacı -->
        <div class="bg-albion-900 border border-albion-accent/40 p-4 rounded-xl shadow-lg shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors">
          <div class="flex items-center gap-4">
            <div class="text-4xl font-black font-mono text-albion-accent drop-shadow-md" id="mistsTimerDisplay">--:--</div>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-white">${esc(t('mists-timer-title', 'Mist Süre Sayacı'))}</span>
              <span class="text-[11px] text-gray-400">${esc(t('mists-timer-desc', 'Mist ömrü ~20 dk; son 5 dk kapanış penceresidir.'))}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span id="mistsTimerWarn" class="text-xs font-bold text-red-400 hidden"><i class="fa-solid fa-triangle-exclamation mr-1"></i><span id="mistsTimerWarnText">${esc(t('mists-timer-warning', 'Kapanış penceresi! Yeni wisp bul ya da çık.'))}</span></span>
            <button id="mistsTimerStart" class="bg-albion-accent hover:bg-albion-accent_hover text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors"><i class="fa-solid fa-play mr-1"></i>${esc(t('mists-timer-start', 'Başlat'))}</button>
            <button id="mistsTimerReset" class="bg-albion-900 border border-albion-700 text-gray-300 hover:text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"><i class="fa-solid fa-rotate-left mr-1"></i>${esc(t('mists-timer-reset', 'Sıfırla'))}</button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-10">
          ${card('fa-wand-magic-sparkles', 'mists-wisp-rarity-title', "Wisp Nadirliği → Mist Tier'ı", rarityBody)}
          ${card('fa-tower-observation', 'mists-wisp-title', 'Wisp Türleri', wispsBody)}
          ${card('fa-city', 'mists-breci-t', 'Brecilien (Gizli Şehir)', brecilienBody, true)}
          ${card('fa-dungeon', 'mists-abbey-t', 'Knightfall Abbey', abbeyBody)}
          ${card('fa-campground', 'mists-camp-t', 'Kamplar & Nadir Doğuşlar', campBody)}
          ${card('fa-khanda', 'mists-tips-t', 'Build & Kaçış İpuçları', tipsBody)}
        </div>
      </div>`;

    initTimer();
  }

  // ─── 20 dakikalık Mist süre sayacı ────────────────────────
  let timerHandle: ReturnType<typeof setInterval> | null = null;
  let remainingSec = MIST_MINUTES * 60;

  function fmt(sec: number) {
    const m = Math.floor(Math.max(0, sec) / 60);
    const s = Math.max(0, sec) % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function paint() {
    const display = document.getElementById('mistsTimerDisplay');
    const warn = document.getElementById('mistsTimerWarn');
    if (display) {
      display.textContent = fmt(remainingSec);
      const elapsedMin = MIST_MINUTES - remainingSec / 60;
      const closing = elapsedMin >= CLOSING_WARNING_MIN && remainingSec > 0;
      const done = remainingSec <= 0;
      display.classList.toggle('text-red-400', closing || done);
      display.classList.toggle('text-albion-accent', !(closing || done));
      if (warn) warn.classList.toggle('hidden', !closing);
      if (done && warn) {
        const wt = document.getElementById('mistsTimerWarnText');
        if (wt) wt.textContent = t('mists-timer-done', 'Mist kapandı! Girdiğin noktaya döndün.');
      }
    }
  }

  function stopTimer() {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
  }

  function initTimer() {
    const startBtn = document.getElementById('mistsTimerStart');
    const resetBtn = document.getElementById('mistsTimerReset');
    paint();
    startBtn?.addEventListener('click', () => {
      stopTimer();
      remainingSec = MIST_MINUTES * 60;
      const wt = document.getElementById('mistsTimerWarnText');
      if (wt) wt.textContent = t('mists-timer-warning', 'Kapanış penceresi! Yeni wisp bul ya da çık.');
      paint();
      timerHandle = setInterval(() => {
        remainingSec -= 1;
        paint();
        if (remainingSec <= 0) stopTimer();
      }, 1000);
    });
    resetBtn?.addEventListener('click', () => {
      stopTimer();
      remainingSec = MIST_MINUTES * 60;
      const wt = document.getElementById('mistsTimerWarnText');
      if (wt) wt.textContent = t('mists-timer-warning', 'Kapanış penceresi! Yeni wisp bul ya da çık.');
      paint();
    });
  }

  document.addEventListener('DOMContentLoaded', render);
  Object.defineProperty(window, 'initMistsModule', { value: render, configurable: true, enumerable: true });
})();

export {};
