// Sürüm denetimi ve güncelleme.
//
// İki kanal:
//   • Web (GitHub Pages): yayımdaki `version.json` ile karşılaştırılır; yeni
//     sürüm varsa önbellek temizlenip sayfa yeniden yüklenir.
//   • Masaüstü (Electron/Tauri): GitHub Releases'teki en son sürüm okunur.
//     Electron'da kurulum dosyası indirilir, SHA-256 doğrulanır ve başlatılır
//     (desktop/electron/update.cjs). Tauri'de indirme sayfası açılır.
//
// Sessiz kurulum yapılmaz: Windows paketleri kod imzalı değil, bu yüzden
// kurulum her zaman kullanıcının "Güncelle" düğmesine basmasıyla başlar
// (bkz. desktop/SIGNING.md).

import { APP_VERSION, getPlatformBilgisi } from './app-info';

const DEPO = 'CehennemGibiyim/AoT-PNASF';
const KONTROL_ANAHTARI = 'aot-update-check';
const YOKSAYILAN_ANAHTAR = 'aot-update-dismissed';
const KONTROL_ARALIGI_MS = 6 * 60 * 60 * 1000; // 6 saat
const NOT_SINIRI = 900;

export type GuncellemeKaynagi = 'surum-dosyasi' | 'github-surumu' | 'yok';

export interface GuncellemeDurumu {
  durum: 'guncel' | 'yeni' | 'bilinmiyor';
  kaynak: GuncellemeKaynagi;
  kurulu: string;
  son?: string;
  sayfa?: string;
  indirme?: string;
  dogrulama?: string;
  dosyaAdi?: string;
  notlar?: string;
  mesaj?: string;
  zaman: number;
}

interface SurumDosyasi {
  version?: string;
  commit?: string;
  date?: string;
}

interface GithubVarlik {
  name?: string;
  browser_download_url?: string;
}

interface GithubSurumu {
  tag_name?: string;
  html_url?: string;
  body?: string;
  assets?: GithubVarlik[];
}

interface GuncellemeKoprusu {
  indir(istek: { url: string; dogrulama?: string; ad: string }): Promise<{ tamam: boolean; hata?: string }>;
  onIlerleme?: (cb: (yuzde: number) => void) => () => void;
}

declare global {
  interface Window {
    aotUpdate?: GuncellemeKoprusu;
  }
}

function surumParcala(surum: string): number[] {
  return surum
    .replace(/^v/i, '')
    .split(/[.\-+]/)
    .map((p) => parseInt(p, 10))
    .map((n) => (Number.isFinite(n) ? n : 0));
}

/** a > b ise pozitif, eşitse 0, küçükse negatif. */
export function surumKarsilastir(a: string, b: string): number {
  const pa = surumParcala(a);
  const pb = surumParcala(b);
  const uzunluk = Math.max(pa.length, pb.length);
  for (let i = 0; i < uzunluk; i += 1) {
    const fark = (pa[i] || 0) - (pb[i] || 0);
    if (fark !== 0) return fark;
  }
  return 0;
}

function masaustuMu(): boolean {
  return getPlatformBilgisi().etiket.startsWith('Masaüstü');
}

function guvenliAdres(deger: unknown): string {
  if (typeof deger !== 'string' || !deger) return '';
  try {
    const adres = new URL(deger, location.href);
    return adres.protocol === 'https:' ? adres.href : '';
  } catch {
    return '';
  }
}

function guvenliSurum(deger: unknown): string {
  if (typeof deger !== 'string') return '';
  const aday = deger.trim().replace(/^v/i, '');
  return /^[0-9][0-9A-Za-z.\-+]{0,31}$/.test(aday) ? aday : '';
}

function notlariKirp(metin: unknown): string {
  if (typeof metin !== 'string') return '';
  const temiz = metin.replace(/\r\n/g, '\n').trim();
  return temiz.length > NOT_SINIRI ? `${temiz.slice(0, NOT_SINIRI).trimEnd()}…` : temiz;
}

// ─── SÜRÜM KAYNAKLARI ────────────────────────────────────

async function surumDosyasiOku(): Promise<{ surum: string; sayfa?: string; notlar?: string } | null> {
  try {
    const adres = new URL('version.json', document.baseURI);
    adres.searchParams.set('_', String(Date.now()));
    const yanit = await fetch(adres.toString(), { cache: 'no-store' });
    if (!yanit.ok) return null;
    const veri = (await yanit.json()) as SurumDosyasi;
    const surum = guvenliSurum(veri?.version);
    return surum ? { surum } : null;
  } catch {
    return null;
  }
}

// İndirici (desktop/electron/update.cjs) yalnızca düz dosya adlarını kabul
// eder; boşluk/özel karakter içeren varlık seçilirse indirme reddedilir.
function dosyaAdiGuvenliMi(ad: string): boolean {
  return /^[A-Za-z0-9._-]{1,120}$/.test(ad);
}

function platformaUygunVarlik(ad: string): number {
  const dosya = ad.toLowerCase();
  const platform = typeof navigator !== 'undefined' ? navigator.platform.toLowerCase() : '';
  const windows = /^win/.test(platform);
  const mac = /^mac/.test(platform);
  if (windows) {
    if (/setup\.exe$/.test(dosya)) return 3;
    if (/\.msi$/.test(dosya)) return 2;
    if (/portable\.exe$/.test(dosya)) return 1;
    return 0;
  }
  if (mac) return /\.dmg$/.test(dosya) ? 2 : 0;
  return /\.appimage$/.test(dosya) ? 2 : 0;
}

async function githubSurumuOku(): Promise<
  | { tur: 'surum'; surum: string; sayfa: string; notlar: string; indirme?: string; dogrulama?: string; dosyaAdi?: string }
  | { tur: 'yok'; mesaj: string }
> {
  try {
    const yanit = await fetch(`https://api.github.com/repos/${DEPO}/releases/latest`, {
      cache: 'no-store',
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (yanit.status === 404) {
      return { tur: 'yok', mesaj: 'Henüz yayımlanmış masaüstü sürümü yok (v* etiketiyle paket üretilmeli).' };
    }
    if (yanit.status === 403) {
      return { tur: 'yok', mesaj: 'GitHub istek sınırına takıldı; birkaç dakika sonra yeniden deneyin.' };
    }
    if (!yanit.ok) {
      return { tur: 'yok', mesaj: `Sürüm bilgisi alınamadı (HTTP ${yanit.status}).` };
    }
    const veri = (await yanit.json()) as GithubSurumu;
    const surum = guvenliSurum(veri?.tag_name);
    const sayfa = guvenliAdres(veri?.html_url);
    if (!surum || !sayfa) return { tur: 'yok', mesaj: 'Sürüm bilgisi eksik döndü.' };

    const varliklar = Array.isArray(veri.assets) ? veri.assets : [];
    const uygun = varliklar
      .map((varlik) => {
        const ad = typeof varlik?.name === 'string' ? varlik.name : '';
        return {
          ad,
          adres: guvenliAdres(varlik?.browser_download_url),
          puan: dosyaAdiGuvenliMi(ad) ? platformaUygunVarlik(ad) : 0,
        };
      })
      .filter((varlik) => varlik.ad && varlik.adres && varlik.puan > 0)
      .sort((a, b) => b.puan - a.puan);

    const ozetler = varliklar.find((varlik) => /^sha256sums\.txt$/i.test(varlik?.name || ''));
    const dogrulama = guvenliAdres(ozetler?.browser_download_url);

    return {
      tur: 'surum',
      surum,
      sayfa,
      notlar: notlariKirp(veri.body),
      indirme: uygun[0]?.adres,
      dogrulama: uygun.length ? dogrulama : undefined,
      dosyaAdi: uygun[0]?.ad,
    };
  } catch {
    return { tur: 'yok', mesaj: 'Sürüm bilgisi alınamadı (ağ hatası).' };
  }
}

// ─── KONTROL ─────────────────────────────────────────────

function onbellekOku(): GuncellemeDurumu | null {
  try {
    const ham = JSON.parse(localStorage.getItem(KONTROL_ANAHTARI) || 'null') as
      | { zaman?: number; veri?: GuncellemeDurumu }
      | null;
    if (!ham || typeof ham.zaman !== 'number' || !ham.veri) return null;
    if (Date.now() - ham.zaman > KONTROL_ARALIGI_MS) return null;
    if (ham.veri.kurulu !== APP_VERSION) return null;
    return ham.veri;
  } catch {
    return null;
  }
}

function onbellekYaz(durum: GuncellemeDurumu): void {
  try {
    localStorage.setItem(KONTROL_ANAHTARI, JSON.stringify({ zaman: Date.now(), veri: durum }));
  } catch {
    /* depolama kapalı */
  }
}

function yoksayilanSurum(): string {
  try {
    return localStorage.getItem(YOKSAYILAN_ANAHTAR) || '';
  } catch {
    return '';
  }
}

function durumKur(
  durum: GuncellemeDurumu['durum'],
  kaynak: GuncellemeKaynagi,
  ek: Partial<GuncellemeDurumu> = {},
): GuncellemeDurumu {
  return { durum, kaynak, kurulu: APP_VERSION, zaman: Date.now(), ...ek };
}

export async function guncellemeKontrolEt(zorla = false): Promise<GuncellemeDurumu> {
  if (!zorla) {
    const onbellek = onbellekOku();
    if (onbellek) return onbellek;
  }

  let sonuc: GuncellemeDurumu;

  if (masaustuMu()) {
    const github = await githubSurumuOku();
    if (github.tur === 'yok') {
      sonuc = durumKur('bilinmiyor', 'github-surumu', { mesaj: github.mesaj });
    } else if (surumKarsilastir(github.surum, APP_VERSION) > 0) {
      sonuc = durumKur('yeni', 'github-surumu', {
        son: github.surum,
        sayfa: github.sayfa,
        notlar: github.notlar,
        indirme: github.indirme,
        dogrulama: github.dogrulama,
        dosyaAdi: github.dosyaAdi,
      });
    } else {
      sonuc = durumKur('guncel', 'github-surumu', { son: github.surum, sayfa: github.sayfa });
    }
  } else {
    const dosya = await surumDosyasiOku();
    if (!dosya) {
      const yerel = /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(location.hostname);
      sonuc = durumKur('bilinmiyor', 'surum-dosyasi', {
        mesaj: yerel
          ? 'Geliştirme sunucusunda sürüm bildirimi okunamadı.'
          : 'Sürüm bildirimi (version.json) okunamadı; bağlantıyı denetleyin.',
      });
    } else if (surumKarsilastir(dosya.surum, APP_VERSION) > 0) {
      sonuc = durumKur('yeni', 'surum-dosyasi', { son: dosya.surum });
    } else {
      sonuc = durumKur('guncel', 'surum-dosyasi', { son: dosya.surum });
    }
  }

  if (sonuc.durum !== 'bilinmiyor') onbellekYaz(sonuc);
  return sonuc;
}

// ─── UYGULAMA ────────────────────────────────────────────

async function onbellegiTemizle(): Promise<void> {
  try {
    if (typeof caches !== 'undefined') {
      const anahtarlar = await caches.keys();
      await Promise.all(anahtarlar.map((anahtar) => caches.delete(anahtar)));
    }
  } catch {
    /* önbellek API'si yok */
  }
  try {
    const kayitlar = (await navigator.serviceWorker?.getRegistrations?.()) || [];
    await Promise.all(kayitlar.map((kayit) => kayit.update().catch(() => undefined)));
  } catch {
    /* service worker yok */
  }
}

export async function guncellemeUygula(
  durum: GuncellemeDurumu,
  ilerleme: (metin: string) => void = () => {},
): Promise<{ tamam: boolean; hata?: string }> {
  if (durum.durum !== 'yeni') return { tamam: false, hata: 'Güncelleme yok.' };

  if (masaustuMu()) {
    const kopru = window.aotUpdate;
    if (!kopru || !durum.indirme || !durum.dogrulama || !durum.dosyaAdi) {
      if (durum.sayfa) window.open(durum.sayfa, '_blank', 'noopener');
      return { tamam: true };
    }

    ilerleme('Kurulum dosyası indiriliyor…');
    const dinle = kopru.onIlerleme?.((yuzde) => {
      ilerleme(`Kurulum dosyası indiriliyor… %${Math.max(0, Math.min(100, Math.round(yuzde * 100)))}`);
    });
    try {
      const sonuc = await kopru.indir({
        url: durum.indirme,
        dogrulama: durum.dogrulama,
        ad: durum.dosyaAdi,
      });
      if (!sonuc?.tamam) return { tamam: false, hata: sonuc?.hata || 'Güncelleme başlatılamadı.' };
      ilerleme('Kurulum başlatıldı. Uygulama kapanıyor…');
      return { tamam: true };
    } catch (hata) {
      return { tamam: false, hata: hata instanceof Error ? hata.message : 'Güncelleme başlatılamadı.' };
    } finally {
      if (typeof dinle === 'function') dinle();
    }
  }

  ilerleme('Önbellek temizleniyor…');
  await onbellegiTemizle();
  location.reload();
  return { tamam: true };
}

// ─── AÇILIŞ BİLDİRİMİ ────────────────────────────────────

function rozetOlustur(durum: GuncellemeDurumu): void {
  if (!durum.son || document.getElementById('aotUpdateBadge')) return;
  const rozet = document.createElement('div');
  rozet.id = 'aotUpdateBadge';
  rozet.setAttribute('role', 'status');
  rozet.style.cssText = [
    'position:fixed',
    'left:16px',
    'bottom:16px',
    'z-index:9998',
    'display:flex',
    'align-items:center',
    'gap:10px',
    'max-width:min(92vw,420px)',
    'padding:10px 12px',
    'border-radius:10px',
    'border:1px solid rgba(212,175,55,0.45)',
    'background:rgba(14,12,6,0.96)',
    'box-shadow:0 8px 24px rgba(0,0,0,0.45)',
    'color:#f5f5f5',
    'font:500 12px/1.45 system-ui,sans-serif',
  ].join(';');

  const simge = document.createElement('span');
  simge.setAttribute('aria-hidden', 'true');
  simge.style.fontSize = '15px';
  simge.textContent = '⬆';

  const metin = document.createElement('span');
  metin.style.flex = '1';
  metin.append('Yeni sürüm hazır: ');
  const surum = document.createElement('strong');
  surum.textContent = `v${durum.son}`;
  metin.append(surum, ' ');
  const kurulu = document.createElement('span');
  kurulu.style.color = '#a3a3a3';
  kurulu.textContent = `(kurulu v${APP_VERSION})`;
  metin.append(kurulu);

  const baglanti = document.createElement('a');
  baglanti.href = durum.sayfa || `https://github.com/${DEPO}/releases`;
  baglanti.target = '_blank';
  baglanti.rel = 'noopener noreferrer';
  baglanti.textContent = 'İndir';
  baglanti.style.cssText =
    'flex:none;background:#d4af37;color:#141006;border-radius:7px;padding:6px 10px;font:700 11px/1 system-ui,sans-serif;text-decoration:none';

  const kapat = document.createElement('button');
  kapat.type = 'button';
  kapat.setAttribute('aria-label', 'Güncelleme bildirimini kapat');
  kapat.textContent = '✕';
  kapat.style.cssText =
    'flex:none;background:transparent;border:0;color:#a3a3a3;font-size:14px;cursor:pointer;padding:0 2px';
  kapat.addEventListener('click', () => {
    try {
      localStorage.setItem(YOKSAYILAN_ANAHTAR, durum.son || '');
    } catch {
      /* depolama kapalı */
    }
    rozet.remove();
  });

  rozet.append(simge, metin, baglanti, kapat);
  document.body.appendChild(rozet);
}

async function acilisKontrolu(): Promise<void> {
  if (typeof fetch !== 'function') return;
  const durum = await guncellemeKontrolEt();
  if (durum.durum !== 'yeni' || !durum.son) return;
  if (yoksayilanSurum() === durum.son) return;
  if (document.body) rozetOlustur(durum);
  else document.addEventListener('DOMContentLoaded', () => rozetOlustur(durum), { once: true });
}

// Açılıştan hemen sonra değil, uygulama yerleştikten sonra kontrol et.
if (document.readyState === 'complete') {
  setTimeout(() => { void acilisKontrolu(); }, 2500);
} else {
  window.addEventListener('load', () => { setTimeout(() => { void acilisKontrolu(); }, 2500); }, { once: true });
}
