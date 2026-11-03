# Kod imzalama ve güncelleme akışı

## Neden gerekli?

İmzasız Windows paketleri SmartScreen'de "bilinmeyen yayımcı" uyarısı verir ve
kullanıcıların bir kısmı kurulumu yarıda bırakır. İmzalama ayrıca sessiz
(otomatik) güncellemenin ön koşuludur.

## Şu anki durum

| | Durum |
|---|---|
| Windows kurulumları | İmzasız üretilir (CI'da sertifika secret'ı yoksa) |
| Güncelleme | **Bildirim tabanlı**: uygulama GitHub Releases'i kontrol eder, yeni sürüm varsa "İndir" bağlantısı gösterir (`js/update-check.ts`) |
| Sessiz kurulum (electron-updater / Tauri updater) | Etkin değil — imzalı paket şartı sağlandığında açılacak |

Bildirim tabanlı akış bilinçli bir tercih: imzasız bir paketi kullanıcının
haberi olmadan indirip çalıştırmak güvenlik açısından doğru değil.

## Electron imzalama (CI'da otomatik)

`desktop-build.yml` Electron adımına şu secret'lar geçirilir; tanımlıysa
electron-builder otomatik imzalar, tanımlı değilse imzasız devam eder:

| Secret | İçerik |
|---|---|
| `WINDOWS_CERT_PFX_BASE64` | `.pfx` dosyasının base64 hâli |
| `WINDOWS_CERT_PASSWORD` | PFX parolası |

```bash
# pfx'i base64'e çevir (yerelde, dosyayı depoya koymayın)
base64 -w0 cert.pfx > cert.pfx.b64
```

Yerel imzalı derleme:

```powershell
$env:CSC_LINK = "<pfx yolu veya base64>"
$env:CSC_KEY_PASSWORD = "<parola>"
npm run windows:installer
```

Azure Trusted Signing kullanıyorsanız `desktop/electron/package.json` içindeki
`build.win` altına `azureSignOptions` eklenmeli (electron-builder ≥ 26).

## Tauri imzalama (CI'da otomatik)

Tauri, Windows sertifika deposundaki parmak iziyle imzalar. CI'da
`WINDOWS_CERT_THUMBPRINT` secret'ı tanımlıysa iş akışı geçici bir
`sign.conf.json` üretip `tauri build --config` ile birleştirir:

| Secret | İçerik |
|---|---|
| `WINDOWS_CERT_THUMBPRINT` | Sertifikanın SHA-1 parmak izi (boşluksuz) |

Sertifika, derleme yapan runner'ın sertifika deposunda bulunmalıdır; CI'da bu
genelde bir `Import-PfxCertificate` adımıyla yapılır. Parmak izi yoksa derleme
imzasız tamamlanır.

## Sessiz güncellemeye geçiş (imzalama sonrası)

1. **Electron:** `electron-updater` ekle, `build.publish` içine GitHub sağlayıcısını
   yaz, `main.cjs` içinde `app.isPackaged` kontrolüyle
   `autoUpdater.checkForUpdatesAndNotify()` çağır. CI, `latest.yml` dosyasını
   Release'e yüklemeli.
2. **Tauri:** `tauri-plugin-updater` + `tauri-plugin-process`, `bundle.createUpdaterArtifacts: true`,
   `plugins.updater.endpoints` + `pubkey`. Özel anahtar
   `TAURI_SIGNING_PRIVATE_KEY` secret'ında tutulur (`npx tauri signer generate`).
3. Her iki durumda da sürüm numarası `package.json` ile Release etiketi
   (`v1.2.3`) eşleşmeli; uygulama `js/app-info.ts` üzerinden kendi sürümünü bilir.
