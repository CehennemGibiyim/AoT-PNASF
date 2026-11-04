# AoT PNASF — Masaüstü kabukları

Web sürümü (`dist/`) iki farklı masaüstü kabukla paketlenebilir. İkisi de aynı
çıktıyı gömer, aynı arayüzü gösterir; farklılık yalnızca çalışma zamanı,
paket boyutu ve kurulum biçimindedir.

| | **Electron** (`desktop/electron`) | **Tauri v2** (`desktop/tauri`) |
|---|---|---|
| Çalışma zamanı | Chromium + Node (gömülü) | Sistem WebView2 (Windows 10/11'de hazır) |
| Kurulum paketi | `NSIS setup.exe` + `portable.exe` | `NSIS setup.exe` + `MSI` |
| Yaklaşık boyut | ~90–120 MB kurulum | ~5–10 MB kurulum |
| Derleme gereksinimi | Node 20 + (Windows'ta) NSIS | Node 20 + Rust stable + WebView2 |
| Yerel dosya erişimi | Özel `aot://app/` protokolü | Tauri asset protokolü (`frontendDist`) |
| Service worker | Kapalı (masaüstünde gereksiz) | Kapalı |
| Dış bağlantılar | Sistem tarayıcısında açılır | WebView'de açılır |
| Artı | Olgun araç zinciri, tek komutla portable build | Çok küçük paket, düşük bellek, imzalama kolay |
| Eksi | Büyük paket, her sürümde Chromium güncellemesi | Rust derleme süresi, WebView2 bağımlılığı |

Her iki kabuk da arayüzü **depo kökündeki `dist/`** klasöründen okur. Yani önce
web sürümünü derlemek gerekir:

```bash
npm ci
npm run build          # → dist/
```

## Electron

```bash
cd desktop/electron
npm ci
npm start              # dist'i app/ içine kopyalar ve uygulamayı açar
npm run pack:win       # NSIS setup.exe + portable.exe  (Windows veya wine)
npm run pack:linux     # AppImage                        (Linux)
```

- `scripts/prepare.cjs` → `dist/` içeriğini `app/` klasörüne kopyalar
  (`app/` ve `release/` sürüm kontrolüne girmez).
- `serve.cjs` → `aot://app/...` isteklerini dosyaya çözer; dizin dışına çıkan
  (`../`) istekler 403 döner, uzantısız yollar `index.html`'e düşer.
- `fetch('data/*.json')` bu protokol sayesinde `file://` CORS engeline takılmaz.
- Icons: `desktop/scripts/make-icons.py` (Pillow) → `build/icon.ico`, `build/icon.png`,
  `build/icons/512x512.png`.

## Tauri v2

```bash
cd desktop/tauri
npm ci
npm run dev            # vite dev sunucusu + tauri penceresi (5173)
npm run build:win      # NSIS + MSI                          (Windows)
```

- `src-tauri/tauri.conf.json` → `frontendDist: "../../../dist"`,
  `beforeBuildCommand` depo kökünde `npm run build` çalıştırır.
- `src-tauri/src/lib.rs` yalnızca pencereyi açar; ek plugin/izin yok
  (`capabilities/default.json` içinde sadece `core:default`).
- Icons: `src-tauri/icons/*` (aynı betik üretir).

## Windows kurulum paketleri ve `windows/` klasörü

Paketler tek yerde toplanır: **`desktop/windows/kurulum/`** (setup.exe,
portable.exe, MSI + `SHA256SUMS.txt` + `SURUM.txt` + `KURULUM-OKU.txt`).
Klasörün içeriği commit edilmez, yapı ve toplama mantığı commit edilir.

```bash
# Windows'ta hepsini derle + topla + zip'le
npm run windows:installer

# yalnızca üretilmiş paketleri topla (her platformda)
npm run windows:collect
```

Ayrıntı: [`desktop/windows/README.md`](windows/README.md)

Linux/macOS üzerinde Windows kurulum dosyası üretmek ek araçlar ister
(Electron için `wine`, Tauri için çapraz Rust hedefi + WebView2). Bu yüzden
depoda hazır bir CI iş akışı var:

`.github/workflows/desktop-build.yml`

- `workflow_dispatch` ile elle veya `v*` etiketiyle tetiklenir.
- `windows-latest` üzerinde iki derleme işi paralel çalışır:
  - **Electron**: `npm ci` → `npm run build` → `electron-builder --win nsis portable`
  - **Tauri**: Rust stable + `cargo` önbelleği → `tauri build --bundles nsis,msi`
- Ardından `topla` işi iki çıktıyı indirip `collect-windows.mjs` ile tek
  klasörde birleştirir ve **`AoT-PNASF-Windows-Kurulum`** artifact'ı olarak
  yükler (paketler + `SHA256SUMS.txt` + `SURUM.txt` + zip).


Yerelde Windows'ta üretmek için yukarıdaki `pack:win` / `build:win`
komutları yeterlidir (Visual Studio Build Tools + Rust gerekir).

## Sürüm, güncelleme ve imzalama

- Kurulu sürüm arayüzde görünür: **Ayarlar → Hakkında** (sürüm, commit,
  derleme tarihi, ortam). Değerler derleme anında gömülür
  (`vite.config.mts` → `define`, okuma `js/app-info.ts`).
- Yeni sürüm bildirimi: `js/update-check.ts` GitHub Releases'i kontrol eder ve
  yeni sürüm varsa indirme bağlantısı gösterir.
- Kod imzalama ve sessiz (otomatik) güncellemeye geçiş adımları:
  [`SIGNING.md`](SIGNING.md).

## Oturum dinleyicisi (masaüstü)

**Atölye → Oturum** paneli, oyun oturumunuzun loot, kill, fame, ölüm ve hasar
olaylarını toplar; süre, saatlik fame/gümüş, K/D ve oturum ortalaması DPS
gösterir. Veri `userData/oturum.json` içinde tutulur, uygulama kapanınca silinmez.

Dinleyici yalnızca **127.0.0.1** üzerinde rastgele bir portta açılır ve her
istekte oturumluk token ister. Port ve token paneldeki **Kopyala** düğmesiyle
hazır `curl` komutu olarak alınabilir:

```bash
curl -X POST http://127.0.0.1:<port>/olay \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"tur":"loot","ad":"T6 Deri","adet":2,"birimDeger":500}'
```

Olay türleri: `loot` (`ad`, `adet`, `birimDeger`/`deger`), `kill` (`fame`),
`death`, `fame` (`miktar`, `alan`: pve/pvp/gather/craft), `damage` (`miktar`).
`/olaylar` uç noktası en fazla 100 olaylık dizi kabul eder; `/baslat`, `/bitir`,
`/temizle` ve `/durum` diğer uçlardır.

Testler: `cd desktop/electron && npm run test:session`.

### Neden paket çözücü yok?

Albion trafiği şifreli Photon UDP'dir; istemci paketlerini çözmek oyun
belleğine/anahtarlarına erişmeyi gerektirir ve ToS riski taşır. Bu yüzden
dinleyici istemciye dokunmaz; olayları yerel yardımcı araçlar veya elle
gönderim sağlar. Radar/cheat, istemci değiştirme ve overlay kapsam dışıdır.

## Bilinen sınırlar

- Masaüstü kabuğu çevrimdışı çalışır ama bazı veriler canlı gelir: eşya
  ikonları (`render.albiononline.com`), bölge haritaları (`cdn.th.gl`) ve
  market/killboard feed'leri. İnternet yoksa arayüz açılır, bu görseller boş kalır.
- Kurulum paketleri imzasız üretilir; SmartScreen uyarısı çıkar. Dağıtımdan
  önce kod imzalama sertifikası eklenmesi önerilir (`win.certificateSubjectName`
  / Tauri `certificateThumbprint`).
- Sessiz otomatik güncelleme yapılandırılmadı (imzasız paketlerde bilinçli
  tercih); bildirim + indirme bağlantısı var. Ayrıntı: `SIGNING.md`.
