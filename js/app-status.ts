// Çevrimdışı durum göstergesi.
//
// Masaüstü kabuğu çevrimdışıyken de açılır; eşya ikonları, bölge haritaları
// ve canlı feed'ler internet ister. Bağlantı yokken boş görseller "bozuk"
// sanılmasın diye sağ altta kalıcı bir rozet gösterilir; "Yeniden dene"
// düğmesi gerçek bir istekle bağlantıyı yoklar.

const ROZET_ID = 'aotOfflineBadge';
const CEVRIMDISI_METIN = 'Çevrimdışısınız — eşya ikonları, haritalar ve canlı veriler yüklenemiyor.';
let probeSuruyor = false;

function rozetOlustur(): HTMLElement {
  const mevcut = document.getElementById(ROZET_ID);
  if (mevcut) return mevcut;

  const rozet = document.createElement('div');
  rozet.id = ROZET_ID;
  rozet.setAttribute('role', 'status');
  rozet.setAttribute('aria-live', 'polite');
  rozet.style.cssText = [
    'position:fixed',
    'right:16px',
    'bottom:16px',
    'z-index:9999',
    'display:none',
    'align-items:center',
    'gap:10px',
    'max-width:min(92vw,420px)',
    'padding:10px 12px',
    'border-radius:10px',
    'border:1px solid rgba(255,180,77,0.45)',
    'background:rgba(20,16,8,0.96)',
    'box-shadow:0 8px 24px rgba(0,0,0,0.45)',
    'color:#ffedd5',
    'font:500 12px/1.45 system-ui,sans-serif',
  ].join(';');
  rozet.innerHTML = `
    <span aria-hidden="true" style="font-size:15px">⚠</span>
    <span id="aotOfflineText" style="flex:1">${CEVRIMDISI_METIN}</span>
    <button type="button" id="aotOfflineRetry" style="flex:none;background:#ffb84d;color:#1a1206;border:0;border-radius:7px;padding:6px 10px;font:700 11px/1 system-ui,sans-serif;cursor:pointer">
      Yeniden dene
    </button>
  `;
  document.body.appendChild(rozet);

  rozet.querySelector('#aotOfflineRetry')?.addEventListener('click', () => { void yenidenDene(); });
  return rozet;
}

function rozetGoster(goster: boolean): void {
  const rozet = rozetOlustur();
  rozet.style.display = goster ? 'flex' : 'none';
}

function metinAyarla(metin: string): void {
  const el = document.getElementById('aotOfflineText');
  if (el) el.textContent = metin;
}

/** Bağlantıyı küçük bir istekle yoklar; başarılıysa sayfayı tazeler. */
async function yenidenDene(): Promise<void> {
  if (probeSuruyor) return;
  probeSuruyor = true;
  const btn = document.getElementById('aotOfflineRetry') as HTMLButtonElement | null;
  if (btn) { btn.disabled = true; btn.textContent = 'Deneniyor…'; }

  let basarili = false;
  try {
    const yanit = await fetch(`data/pvp-feed.json?ping=${Date.now()}`, { cache: 'no-store' });
    basarili = yanit.ok;
  } catch {
    basarili = false;
  }

  probeSuruyor = false;
  if (basarili) {
    metinAyarla('Bağlantı sağlandı — veriler yenileniyor…');
    window.dispatchEvent(new CustomEvent('app_network_restored'));
    setTimeout(() => location.reload(), 600);
    return;
  }

  metinAyarla('Hâlâ çevrimdışı. İnternet bağlantınızı kontrol edip tekrar deneyin.');
  if (btn) { btn.disabled = false; btn.textContent = 'Yeniden dene'; }
}

function durumGuncelle(): void {
  const cevrimici = navigator.onLine;
  // Çevrimdışıyken gösterilir; çevrimiçi olup rozet görünürse (bağlantı geri
  // geldi) kullanıcıya tazeleme seçeneği sunulur.
  metinAyarla(cevrimici ? 'Bağlantı geri geldi — verileri tazelemek için "Yeniden dene"ye tıklayın.' : CEVRIMDISI_METIN);
  if (!cevrimici) rozetGoster(true);
}

function baslat(): void {
  if (document.body) {
    durumGuncelle();
  } else {
    document.addEventListener('DOMContentLoaded', durumGuncelle, { once: true });
  }
  // Bağlantı geri geldiğinde sayfayı kendiliğinden yenilemiyoruz: kullanıcı
  // formda veya bir hesaplamada olabilir. Bunun yerine rozet "Yenile"
  // seçeneği sunar; tazeleme kullanıcı isteğiyle yapılır.
  window.addEventListener('online', () => {
    metinAyarla('Bağlantı geri geldi — verileri tazelemek için "Yeniden dene"ye tıklayın.');
    window.dispatchEvent(new CustomEvent('app_network_restored'));
  });
  window.addEventListener('offline', durumGuncelle);
}

baslat();

export { yenidenDene as yenidenDeneBaglantisi, rozetGoster };
