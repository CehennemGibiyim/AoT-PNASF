# `desktop/windows/` — Windows kurulum klasörü

Bu klasör, Windows kurulum paketlerinin **tek yerde toplandığı** yerdir.
Paketler depoya commit edilmez (ikili dosyalar); klasör yapısı, kullanıcı
talimatı ve toplama mantığı sürüm kontrolündedir.

```
desktop/windows/
├── KURULUM-OKU.txt      # paketle birlikte dağıtılan son kullanıcı talimatı
├── README.md            # bu dosya
└── kurulum/             # ÇIKTI (gitignore) — setup.exe, portable.exe, msi, SHA256SUMS.txt, SURUM.txt
```

## Nasıl doldurulur

### Windows'ta (tek komut)

```powershell
powershell -ExecutionPolicy Bypass -File desktop/scripts/build-windows.ps1
```

Yaptıkları: `dist/` derler → Electron `setup.exe` + `portable.exe` →
Tauri `NSIS` + `MSI` → hepsini `desktop/windows/kurulum/` içine kopyalar,
`SHA256SUMS.txt` ve `SURUM.txt` yazar, son olarak
`desktop/windows/AoT-PNASF-Windows-1.0.0.zip` paketini üretir.

Sadece bir kabuk için: `-SkipTauri` veya `-SkipElectron`.

Gereksinimler: Node 20+, Tauri için Rust (`rustup.rs`) ve Visual Studio
Build Tools (C++ masaüstü iş yükü).

### GitHub Actions (Windows gerekmez)

`Actions → Desktop Installers (Windows) → Run workflow`.
İş bitince **`AoT-PNASF-Windows-Kurulum`** artifact'ını indirin; içinde bu
klasörün aynısı (paketler + `SHA256SUMS.txt` + `SURUM.txt` + `KURULUM-OKU.txt`) olur.

### Elle (paketler zaten derlendiyse)

```bash
node desktop/scripts/collect-windows.mjs
# veya farklı dizinlerden:
node desktop/scripts/collect-windows.mjs --electron <release> --tauri <bundle> --out <hedef>
```

Toplayıcı yalnızca üretilmiş paketleri taşır; derleme yapmaz. Hiç paket
bulamazsa hata verir (`--allow-empty` ile susturulabilir).

## Neden burada üretilmiyor?

Windows kurulum dosyası Linux üzerinde üretilemez: Electron NSIS için wine,
Tauri MSI/NSIS için Windows SDK + Rust Windows hedefi gerekir. Bu yüzden
paketleme Windows'ta (yerel veya CI) yapılır, sonuç bu klasörde toplanır.
