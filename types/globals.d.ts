/**
 * Klasik (betik) dönemden kalan global erişimlerin tip tanımları.
 *
 * - `data/*.js` oyun verisi ve CDN kütüphaneleri (Chart.js, Gun, Leaflet…)
 *   ES modülü olmadıkları için TypeScript programına girmez; burada tanıtılır.
 * - `window.*` üzerinden yapılan dinamik erişimler ilk aşamada geniş bırakıldı;
 *   dönüşüm tamamlandıkça bu alanlar tek tek tiplenecek.
 */

declare global {
  // --- Oyun verisi (data/*.js, klasik betik) ---
  var AO_ITEMS: any;
  var AO_SEARCH: any;
  var AO_API: any;
  var AO_ICON: any;
  var AO_PRICE_API: any;
  var WORLD_DATA: any;
  var ZONE_BONUSES: any;
  var AOT_DATA: any;

  // --- CDN kütüphaneleri ---
  var Chart: any;
  var Gun: any;
  var L: any;
  var _: any;
  var html2canvas: any;
  var tailwind: any;

  // --- Klasik betikler window üzerinden paylaştığı için çıplak adla da okunur ---
  var miniappsAI: any;
  var miniappI18n: any;
  var fetchWithProxies: any;
  var calcSimRRR: any;
  var albionImageCache: any;

  interface Window {
    [key: string]: any;
  }

  // DOM üzerinde sık kullanılan dinamik erişimler (dönüşüm aşaması)
  interface HTMLElement {
    value: any;
    checked: any;
    disabled: any;
    placeholder: any;
    required: any;
    hidden: any;
    src: any;
    name: any;
    min: any;
    step: any;
    add: any;
    getContext: any;
    _chartInst: any;
    _lazyPromise: any;
  }

  interface Element {
    dataset: any;
    style: any;
    src: any;
    name: any;
    content: any;
    hidden: any;
    placeholder: any;
    click: any;
    _lazyPromise: any;
  }

  interface EventTarget {
    closest: any;
    value: any;
    classList: any;
    getAttribute: any;
  }
}

export {};
