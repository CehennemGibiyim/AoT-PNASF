# AoT — PNASF
### Albion Online Tools · Powered Nexus & AI Smart Feed

<div align="center">

![AoT-PNASF Banner](https://render.albiononline.com/v1/item/T8_2H_CLAYMORE.png)

**Türkiye'nin #1 AI Destekli Albion Online Platformu**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?style=for-the-badge&logo=github)](https://cehennemgibiyim.github.io/AoT-PNASF/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20Powered-gold?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Data](https://img.shields.io/badge/Data-AODP%20API-orange?style=for-the-badge)](https://www.albion-online-data.com/)

[🌐 Canlı Site](https://cehennemgibiyim.github.io/AoT-PNASF/) · [📊 Market](https://cehennemgibiyim.github.io/AoT-PNASF/src/pages/market.html) · [⚔️ PvP](https://cehennemgibiyim.github.io/AoT-PNASF/src/pages/pvp.html) · [📚 Rehberler](https://cehennemgibiyim.github.io/AoT-PNASF/src/pages/guides.html)

</div>

---

## 📖 İçindekiler

- [🎯 Proje Hakkında](#-proje-hakkında)
- [✨ Özellikler](#-özellikler)
- [🗺️ Site Haritası](#️-site-haritası)
- [🔧 Teknolojiler](#-teknolojiler)
- [📡 API Kaynakları](#-api-kaynakları)
- [🤖 GitHub Actions Botları](#-github-actions-botları)
- [📁 Dosya Yapısı](#-dosya-yapısı)
- [🚀 Kurulum](#-kurulum)
- [🗓️ Yol Haritası](#️-yol-haritası)

---

## 🎯 Proje Hakkında

**AoT-PNASF** (Albion Online Tools · Powered Nexus & AI Smart Feed), Albion Online oyuncuları için geliştirilmiş kapsamlı bir araç platformudur.

> 💡 **Sıfır maliyet, maksimum güç.** GitHub Pages üzerinde tamamen ücretsiz çalışır. Sunucu gerekmez, aylık ücret yoktur.

### Neden AoT-PNASF?

| Özellik | AoT-PNASF | Rakipler |
|---------|-----------|----------|
| 🇹🇷 Türkçe Destek | ✅ Tam | ❌ Yok |
| 🌐 9 Dil | ✅ TR/EN/RU/DE/FR/PL/PT/ES/KR | ❌ Sadece EN |
| 🤖 AI Rehber | ✅ Gemini AI | ❌ Yok |
| 🎨 Tema Sistemi | ✅ 8 Tema + Özel | ❌ Yok |
| 🗡️ Outlands Rest | ✅ Arthur's/Merlyn's/Morgana's | ❌ Eksik |
| 💰 Maliyet | ✅ Ücretsiz | ❌ Ücretli özellikler |

---

## ✨ Özellikler

### 💹 Market & Ekonomi
```
✅ Gerçek zamanlı fiyatlar — EU, US, Asia
✅ 11 lokasyon (7 Royal + Mist + 3 Outlands Rest + Black Market)
✅ Fiyat geçmişi grafiği (Chart.js — günlük/6sa/saatlik)
✅ 3 Sunucu karşılaştırma (EU vs US vs Asia yan yana)
✅ Top Traded Items (en çok işlem, artan, düşen)
✅ Flip & Arbitraj (Şehirler arası + Black Market + Rest)
✅ Kalite & Enchant karşılaştırması (+0/+1/+2/+3)
✅ Gold fiyat grafiği (7/30/90 günlük)
✅ Transport kâr hesabı
```

### 🔨 Crafting & Üretim
```
✅ Crafting kâr hesabı — gerçek zamanlı fiyatlarla
✅ Refining hesabı — 5 kaynak türü, bonus şehirler
✅ Farming hesabı — tarla verimi, günlük gelir
✅ Journal hesabı — 9 günlük tipi karşılaştırma
✅ Transport kâr modülü
✅ Black Market flip modülü
✅ Return rate & Focus optimizasyonu
```

### ⚔️ PvP & İstatistik
```
✅ Oyuncu arama & profil (Kill/Death/Fame istatistikleri)
✅ Guild arama & üye listesi
✅ Kill Feed — canlı (GitHub Actions her 5 dakikada günceller)
✅ Battle Board — son ZvZ/GvG muharebeleri
✅ EU/US/Asia sunucu geçişi
✅ Ekipman görselleri kill kartlarında
✅ Resmi Albion Killboard yönlendirmesi
```

### 📚 Rehberler
```
✅ 14 hazır rehber kategorisi
✅ Gemini AI dinamik rehber üretimi
✅ 9 dilde AI yanıt
✅ YouTube video entegrasyonu
✅ Sabit AI chat paneli (her an soru sorulabilir)
✅ Popüler konu hızlı erişim
```

### ⚙️ Ayarlar & Tema
```
✅ 8 hazır tema (Obsidian Gold, Void Purple, Blood Moon, Arctic Cyan, Forest Keeper, Amber Fire, Silver Knight, Neon Nexus)
✅ Özel tema editörü (renk dairesi + parlaklık/doygunluk/yoğunluk)
✅ 9 dil desteği
✅ EU/US/Asia sunucu tercihi
✅ localStorage ile kalıcı tercihler
```

---

## 🗺️ Site Haritası

```
AoT-PNASF
│
├── 🏠 Ana Sayfa (index.html)
│   ├── Hero — Hızlı eşya arama
│   ├── Gold + Geri Sayım Şeridi (Radiant Wilds)
│   ├── İstatistik Sayaçları (canlı)
│   ├── Topluluk Canlılık Şeridi (fiyat hareketleri)
│   ├── Araç Kartları (6 modül)
│   ├── AI Smart Feed (Gemini bot — 6 saatte bir)
│   ├── Silver Kazanç Widget (interaktif hesap)
│   └── Data Client Bölümü (AFM Client yönlendirme)
│
├── 💹 Market (src/pages/market.html)
│   ├── Tab 1: Fiyatlar (11 lokasyon)
│   ├── Tab 2: Fiyat Geçmişi Grafiği
│   ├── Tab 3: Top Traded Items
│   ├── Tab 4: Flip & Arbitraj
│   ├── Tab 5: Kalite & Enchant
│   └── Tab 6: Gold Grafiği
│
├── 🔨 Crafting (src/pages/crafting.html)
│   ├── Tab 1: Crafting Kâr
│   ├── Tab 2: Refining
│   ├── Tab 3: Farming
│   ├── Tab 4: Transport
│   ├── Tab 5: Journal
│   └── Tab 6: Black Market
│
├── ⚔️ PvP (src/pages/pvp.html)
│   ├── Tab 1: Oyuncu/Guild/Alliance Profil
│   ├── Tab 2: Kill Feed (canlı)
│   └── Tab 3: Battle Board
│
├── 🗺️ Haritalar (src/pages/maps.html) [Aşama 6 — Yakında]
│
├── 📚 Rehberler (src/pages/guides.html)
│   ├── Sol: Kategori + AI Üretici + Popüler Konular
│   ├── Sağ: Rehber İçeriği + YouTube Embed
│   └── Alt: Sabit AI Chat Paneli
│
└── 🛠️ Araçlar (src/pages/tools.html) [Aşama 7 — Yakında]
    ├── Party Builder & Aktivite Planlayıcısı
    ├── Avalon Dungeon Rehberleri
    └── PvP Killboard Analizi
```

---

## 🔧 Teknolojiler

| Teknoloji | Kullanım |
|-----------|----------|
| **HTML5 / CSS3 / Vanilla JS** | Sıfır framework — hız öncelikli |
| **Chart.js** | Fiyat geçmişi ve gold grafikleri |
| **Gemini API** | AI rehber üretimi ve chat |
| **GitHub Pages** | Ücretsiz hosting |
| **GitHub Actions** | Otomatik bot sistemi |

---

## 📡 API Kaynakları

### AODP (Albion Online Data Project)
```
EU:   https://europe.albion-online-data.com
US:   https://west.albion-online-data.com
Asia: https://east.albion-online-data.com

Endpoints:
/api/v2/stats/prices/{items}    → Anlık fiyatlar
/api/v2/stats/history/{items}   → Fiyat geçmişi
/api/v2/stats/gold.json         → Gold fiyatı
```

### GameInfo API
```
EU:   https://gameinfo-ams.albiononline.com/api/gameinfo
US:   https://gameinfo.albiononline.com/api/gameinfo
Asia: https://gameinfo-sgp.albiononline.com/api/gameinfo

Endpoints:
/search?q={name}           → Oyuncu/Guild arama
/players/{id}              → Oyuncu profili
/players/{id}/kills        → Kill geçmişi
/events?limit=20           → Kill feed
/battles?sort=recent       → Battle board
```

### Render API
```
https://render.albiononline.com/v1/item/{ITEM_ID}.png
https://render.albiononline.com/v1/item/{ITEM_ID}@{enchant}.png
```

### ao-bin-dumps (Planlanan)
```
https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json
https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/world.json
https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/cluster/
```

---

## 🤖 GitHub Actions Botları

### 1. AI Smart Feed Bot (`ai-bot.yml`)
```yaml
Tetiklenme: Her 6 saatte bir
Görev: Albion Steam News API üzerinden haberleri ve patch notlarını tarar (Cloudflare 403 engelini atlatır)
Çıktı: src/data/feed.json güncellenir
API: Google Gemini API & Steam API
```

### 2. PvP Feed Fetcher (`pvp-fetcher.yml`)
```yaml
Tetiklenme: Her 5 dakikada bir
Görev: GameInfo API'den kill feed + battle çeker
Çıktı: src/data/pvp-feed.json güncellenir
Sunucular: EU + US + Asia (3'ü birden)
```

### 3. GitHub Deploy (`deploy.yml`)
```yaml
Tetiklenme: Her push'ta
Görev: GitHub Pages'e deploy
```

### 4. ao-bin-dumps Senkronizasyonu (Planlanan)
```yaml
Tetiklenme: ao-bin-dumps commit tarihi değişince
Görev: items.json + world.json çeker, items-data.js üretir
Çıktı: src/data/items-data.js otomatik güncellenir
Bonus: Web sitesinde "Güncelle" butonu — herkes tetikleyebilir
```

---

## 📁 Dosya Yapısı

```
AoT-PNASF/
│
├── 📄 index.html                    # Ana sayfa
├── 📄 404.html                      # Hata sayfası
├── 📄 package.json                  # Proje yapılandırması
│
├── 📁 .github/workflows/
│   ├── deploy.yml                   # GitHub Pages deploy
│   ├── ai-bot.yml                   # AI haber botu
│   └── pvp-fetcher.yml              # PvP kill feed botu
│
├── 📁 scripts/
│   ├── ai-scanner.js                # Gemini AI tarayıcı
│   └── pvp-fetcher.cjs              # PvP veri çekici (CommonJS)
│
└── 📁 src/
    ├── 📁 data/
    │   ├── items-data.js            # Tüm eşya veritabanı (2000+)
    │   ├── feed.json                # AI haber feed
    │   └── pvp-feed.json            # PvP kill feed (5dk'da bir)
    │
    ├── 📁 lib/
    │   ├── lang.js                  # 9 dil sistemi
    │   ├── nav.js                   # Navbar & mobil menü
    │   ├── settings.js              # Tema & ayarlar core
    │   ├── settings-panel.js        # Ayarlar paneli UI
    │   ├── feed.js                  # AI feed render
    │   ├── home.js                  # Ana sayfa logic
    │   ├── market.js                # Market modülü
    │   ├── crafting.js              # Crafting modülü
    │   ├── pvp.js                   # PvP modülü
    │   └── guides.js                # Rehberler & AI chat
    │
    ├── 📁 styles/
    │   ├── main.css                 # Global stiller & değişkenler
    │   ├── settings.css             # Ayarlar paneli stilleri
    │   ├── home.css                 # Ana sayfa stilleri
    │   ├── market.css               # Market stilleri
    │   ├── crafting.css             # Crafting stilleri
    │   ├── pvp.css                  # PvP stilleri
    │   └── guides.css               # Rehberler stilleri
    │
    └── 📁 pages/
        ├── market.html              # Market & Ekonomi
        ├── crafting.html            # Crafting & Üretim
        ├── pvp.html                 # PvP & İstatistik
        ├── guides.html              # Rehberler
        ├── maps.html                # Haritalar (Aşama 6)
        └── tools.html               # Araçlar (Aşama 7)
```

---

## 🚀 Kurulum

### GitHub Pages üzerinde yayınlama

```bash
# 1. Repoyu fork'la veya klonla
git clone https://github.com/CehennemGibiyim/AoT-PNASF.git
cd AoT-PNASF

# 2. GitHub Secrets'a ekle
# Settings → Secrets → Actions:
GEMINI_API_KEY=your_gemini_api_key_here

# 3. GitHub Pages'i aktif et
# Settings → Pages → Source: Deploy from branch → main

# 4. Deploy otomatik başlar
# https://kullaniciadiniz.github.io/AoT-PNASF/
```

### Lokal geliştirme

```bash
# Basit HTTP server
npx serve .

# veya Python
python -m http.server 8080

# Site: http://localhost:8080
```

---

## 🗓️ Yol Haritası

| Aşama | İçerik | Durum |
|-------|--------|-------|
| ✅ Aşama 1 | Ana Sayfa + AI Bot + Ayarlar Paneli | **Tamamlandı** |
| ✅ Aşama 2 | Market & Ekonomi (6 modül, 11 lokasyon) | **Tamamlandı** |
| ✅ Aşama 3 | Crafting & Üretim (6 modül) | **Tamamlandı** |
| ✅ Aşama 4 | PvP & İstatistik + GitHub Actions Bot | **Tamamlandı** |
| ✅ Aşama 5 | Rehberler + Gemini AI Chat | **Tamamlandı** |
| ✅ Aşama 6 | Haritalar (world.json + pathfinding) | **Tamamlandı** |
| ✅ Aşama 7 | Build & Meta + Party Builder + Avalon Dungeon | **Tamamlandı** |
| 🔜 Aşama 8 | ao-bin-dumps Tam Entegrasyon + Güncelle Butonu | **Planlandı** |
| 🔜 Aşama 9 | PvP Killboard Analizi (Saatlik grafik, filtreler) | **Planlandı** |

---

## 📊 Desteklenen Lokasyonlar

| Bölge | Şehirler |
|-------|---------|
| 🏰 Royal Cities | Caerleon, Lymhurst, Bridgewatch, Martlock, Thetford, Fort Sterling |
| 🌫️ Mist | Brecilien |
| 🗡️ Outlands Rest | Arthur's Rest, Merlyn's Rest, Morgana's Rest |
| 🖤 Özel | Black Market |

---

## 🌐 Desteklenen Diller

🇹🇷 Türkçe · 🇬🇧 English · 🇷🇺 Русский · 🇩🇪 Deutsch · 🇫🇷 Français · 🇵🇱 Polski · 🇵🇹 Português · 🇪🇸 Español · 🇰🇷 한국어

---

## ⚠️ Yasal Uyarı

> Bu site Sandbox Interactive GmbH ile resmi olarak bağlantılı değildir. Tüm Albion Online varlıkları Sandbox Interactive GmbH'ın mülkiyetindedir.
>
> Market verileri [Albion Online Data Project (AODP)](https://www.albion-online-data.com/) tarafından sağlanmaktadır.
>
> AI içerikleri Google Gemini tarafından üretilmektedir.

---

<div align="center">

**© 2025 AoT-PNASF · Powered by Claude AI & Gemini AI**

Geliştirici: [@CehennemGibiyim](https://github.com/CehennemGibiyim)

⭐ Bu projeyi beğendiysen yıldız vermeyi unutma!

</div>
