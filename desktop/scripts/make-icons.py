#!/usr/bin/env python3
"""AoT PNASF masaüstü ikonlarını üretir (Electron + Tauri).

Tasarım: index.html'deki favicon'un aynısı — koyu zemin, altın halka ve
şimşek. Tek kaynak: bu betik; çıktılar depoda tutulur.

Kullanım: python3 desktop/scripts/make-icons.py
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
GOLD = (212, 175, 55, 255)
DARK = (10, 13, 20, 255)
SCALE = 8  # 64 birimlik favicon → 512 px

# favicon path: M32 16 L38 28 L32 28 L38 44 L26 32 L32 32 L26 16 Z
BOLT = [(32, 16), (38, 28), (32, 28), (38, 44), (26, 32), (32, 32), (26, 16)]


def render(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pad = round(size * 0.04)
    radius = round(size * 0.22)
    d.rounded_rectangle([pad, pad, size - pad, size - pad], radius=radius, fill=DARK)

    ring = round(size * 0.10)
    d.ellipse(
        [ring, ring, size - ring, size - ring],
        outline=GOLD,
        width=max(2, round(size * 0.045)),
    )

    k = size / (64 * 1.0)
    d.polygon([(x * k, y * k) for x, y in BOLT], fill=GOLD)
    return img


def main() -> None:
    electron_build = ROOT / "desktop" / "electron" / "build"
    electron_icons = electron_build / "icons"
    tauri_icons = ROOT / "desktop" / "tauri" / "src-tauri" / "icons"
    for d in (electron_build, electron_icons, tauri_icons):
        d.mkdir(parents=True, exist_ok=True)

    master = render(512)
    master.save(electron_build / "icon.png")
    master.save(electron_icons / "512x512.png")

    # Windows .ico (çok boyutlu)
    ico_sizes = [16, 24, 32, 48, 64, 128, 256]
    master.save(electron_build / "icon.ico", sizes=[(s, s) for s in ico_sizes])
    master.save(tauri_icons / "icon.ico", sizes=[(s, s) for s in ico_sizes])

    render(32).save(tauri_icons / "32x32.png")
    render(128).save(tauri_icons / "128x128.png")
    render(256).save(tauri_icons / "128x128@2x.png")
    master.save(tauri_icons / "icon.png")

    print("✅ ikonlar üretildi: desktop/electron/build, desktop/tauri/src-tauri/icons")


if __name__ == "__main__":
    main()
