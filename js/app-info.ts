// Uygulama sürümü ve derleme bilgisi.
//
// Vite derlemesi bu sabitleri `define` ile enjekte eder (vite.config.mts).
// Değerler derleme anında gömülüdür; böylece arayüz "hangi paket kurulu"
// sorusunu yanıtlar. Kaynak dosya doğrudan (define olmadan) çalıştırılırsa
// `typeof` kontrolü sayesinde yedek değerler kullanılır.

declare const __AOT_VERSION__: string;
declare const __AOT_COMMIT__: string;
declare const __AOT_BUILD_DATE__: string;
declare const __AOT_BUILD_SOURCE__: string;

function buildDegeri(deger: string | undefined, yedek: string): string {
  return typeof deger === 'string' && deger.trim() ? deger.trim() : yedek;
}

/** package.json sürümü (örn. "1.0.0"). */
export const APP_VERSION = buildDegeri(
  typeof __AOT_VERSION__ === 'undefined' ? undefined : __AOT_VERSION__,
  '1.0.0',
);

/** Kısa git commit kimliği (örn. "e948599") ya da "bilinmiyor". */
export const BUILD_COMMIT = buildDegeri(
  typeof __AOT_COMMIT__ === 'undefined' ? undefined : __AOT_COMMIT__,
  'bilinmiyor',
);

/** Commit tarihi (YYYY-MM-DD) — derleme anından bağımsız, tekrarlanabilir. */
export const BUILD_DATE = buildDegeri(
  typeof __AOT_BUILD_DATE__ === 'undefined' ? undefined : __AOT_BUILD_DATE__,
  'bilinmiyor',
);

/** Derlemeyi üreten ortam: "local" | "ci". */
export const BUILD_SOURCE = buildDegeri(
  typeof __AOT_BUILD_SOURCE__ === 'undefined' ? undefined : __AOT_BUILD_SOURCE__,
  'local',
);

interface AotDesktopBilgisi {
  isDesktop?: boolean;
  shell?: string;
  versions?: Record<string, string | undefined>;
}

/** Uygulamanın çalıştığı ortam: Web, Electron veya Tauri. */
export function getPlatformBilgisi(): { etiket: string; ayrinti: string } {
  const masaustu = (window as unknown as { aotDesktop?: AotDesktopBilgisi }).aotDesktop;
  const tauri = typeof (window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ !== 'undefined';

  if (tauri || masaustu?.shell === 'tauri') {
    return { etiket: 'Masaüstü (Tauri)', ayrinti: 'Sistem WebView · Windows' };
  }
  if (masaustu?.isDesktop) {
    const v = masaustu.versions || {};
    const parcalar = [v.electron ? `Electron ${v.electron}` : '', v.chrome ? `Chromium ${v.chrome}` : ''].filter(Boolean);
    return { etiket: 'Masaüstü (Electron)', ayrinti: parcalar.join(' · ') || 'Electron' };
  }
  return { etiket: 'Web', ayrinti: location.host || 'yerel dosya' };
}

/** Hata bildirimine yapıştırılabilecek tek satırlık sürüm metni. */
export function surumOzeti(): string {
  const platform = getPlatformBilgisi();
  return `AoT PNASF v${APP_VERSION} · ${BUILD_COMMIT} (${BUILD_DATE}) · ${platform.etiket}`;
}
