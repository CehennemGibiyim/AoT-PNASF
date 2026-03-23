# AoT-PNASF — Albion Online Kapsamlı Portal

**Powered Nexus & AI Smart Feed** | https://cehennemgibiyim.github.io/AoT-PNASF

## Proje Genel Bakış

Bu proje, Albion Online oyuncuları için eksiksiz bir bilgi ve araç portalı oluşturmayı amaçlamaktadır. Sitede oyunla ilgili tüm temel işlemler yapay zeka destekli olarak sunulacak ve kullanıcılar her an güncel bilgilere erişebilecektir. Portal, hem yeni başlayanlar hem de ileri seviye oyuncular için tasarlanmıştır.

## 🎯 Proje Hedefleri

### Ana Hedefler
- Albion Online oyunundaki tüm işlemleri tek bir çatı altında toplamak
- Yapay zeka destekli analiz ve öneri sistemi sunmak
- Gerçek zamanlı veri akışı ile sürekli güncel bilgi sağlamak
- Kullanıcı dostu ve modern bir arayüz oluşturmak
- Oyunun tüm detaylarını kapsayan kapsamlı bir bilgi bankası oluşturmak

### Spesifik Hedefler
- **Killboard Entegrasyonu**: Anlık PvP verileri ve ölüm kayıtları
- **Google Earth Tarzı Harita**: İnteraktif 3D harita sistemi
- **Avalon Dungeon Rehberleri**: Boss stratejileri ve skill gereksinimleri
- **Market Analizleri**: Gerçek zamanlı fiyat takibi ve tahminleme
- **Guild Management**: Klan yönetim araçları
- **Build Database**: Tüm build'lerin detaylı analizi

## 🛠️ Araçlar ve Özellikler

### Mevcut Araçlar
- 💹 **Fiyat Sorgulayıcı** — Tüm şehirlerde anlık alış/satış fiyatları (Albion Data Project)
- ⚒ **Crafting Hesaplayıcı** — Maliyetler, şehir bonusları, focus, ROI
- ↔ **Ticaret Rotaları** — Şehirler arası en karlı alım-satım fırsatları
- ◈ **Kara Pazar Flipper** — Caerleon/şehir → Black Market arbitraj
- ◎ **İnteraktif Harita** — Ağırlıklı pathfinding ile rota planlama
- ▲ **Gold Takip** — Gerçek zamanlı gold fiyat grafiği

### Geliştirilecek Araçlar

#### 1. İstatistik Analiz Entegrasyonu
**Kaynak**: https://github.com/Triky313/AlbionOnline-StatisticsAnalysis
- Windows uygulamasını web'e entegre etme
- Socket ve Npcap tracking özellikleri
- Gerçek zamanlı oyun verisi takibi
- Performans analizi ve istatistikler

#### 2. Gelişmiş Killboard
**Kaynak**: https://killboard-1.com/
- Anlık PvP verileri
- Bölgesel killboard'lar (Americas, Europe, Asia)
- Discord bot entegrasyonu
- Twitch panel desteği
- Lethal Kills, Depths, ZVZ, Stalkers, Ganking kategorileri

#### 3. Google Earth Tarzı İnteraktif Harita
**Kaynak**: https://albionfreemarket.com/albion-map
- 3D harita görüntüleme
- Bölgesel bonus gösterimi (Savaş Namı, Toplayıcılık, Gümüş, Ganimet, Hasar)
- Ağırlıklı pathfinding algoritması
- PvP bölge renklendirmesi (mavi, sarı, kırmızı, siyah)
- Portal ve çıkış işaretleyicileri
- Yolculuk özeti ve analiz

#### 4. Avalon Harita Sistemi
**Kaynak**: https://avalonroads-97617.web.app
- Sadece Avalon bölgelerini kapsayan özel harita
- Dungeon boss konumları
- Grup dungeon rehberleri
- Skill gereksinimleri ve stratejiler

#### 5. Yapay Zeka Destekli Özellikler
- Build öneri sistemi
- Fiyat tahminleme algoritması
- PvP analiz ve öneriler
- Market trend analizi
- Oyun stratejisi önerileri

## 🏗️ Teknoloji Altyapısı

### Frontend
- **React 19.2.4** - Modern ve performanslı UI
- **Vite 8.0.1** - Hızlı development ve build
- **Tailwind CSS v4** - Modern styling
- **React Router DOM 7.5.0** - Client-side routing
- **Recharts 2.15.3** - Veri görselleştirme

### Backend ve Veri Kaynakları
- **Albion Data Project API** - Oyun verileri
- **WebSocket Connections** - Gerçek zamanlı veri akışı
- **GitHub API** - İstatistik analizi verileri
- **Third-party APIs** - Market ve PvP verileri

## 📊 Veri Akış Mimarisi

### Gerçek Zamanlı Veri Kaynakları
1. **Albion Data Project** - Market verileri, item bilgileri
2. **Killboard API'leri** - PvP verileri, guild istatistikleri
3. **Oyun Client Tracking** - Socket/Npcap ile oyun içi veriler
4. **Market API'leri** - Fiyat takibi, arbitraj fırsatları

## 🎨 UI/UX Tasarım Prensipleri

### Ana Sayfa Layout
- **Dashboard**: Önemli metrikler ve hızlı erişim
- **Navigation**: Kategorik menü sistemi
- **Real-time Widgets**: Anlık veri akışı
- **Responsive Design**: Tüm cihazlarda uyum

## 🔧 Geliştirme Planı

### Faz 1: Temel Altyapı (Mevcut)
- [x] Proje kurulumu
- [x] Temel araçlar (market, crafting, harita)
- [x] Responsive tasarım

### Faz 2: İstatistik Entegrasyonu
- [ ] AlbionOnline-StatisticsAnalysis web entegrasyonu
- [ ] Socket tracking sistemi
- [ ] Performans analizi paneli

### Faz 3: Gelişmiş Harita Sistemi
- [ ] Google Earth tarzı 3D harita
- [ ] Bölgesel bonus göstergeleri
- [ ] Avalon özel haritası
- [ ] Pathfinding algoritması

### Faz 4: Killboard ve PvP
- [ ] Anlık killboard entegrasyonu
- [ ] Discord bot bağlantısı
- [ ] PvP analiz araçları

### Faz 5: Yapay Zeka Entegrasyonu
- [ ] AI destekli build önerileri
- [ ] Fiyat tahminleme
- [ ] Strateji önerileri

## 🚀 Hızlı Başlangıç

### Geliştirme Ortamı
```bash
# Proji klonla
git clone https://github.com/CehennemGibiyim/AoT-PNASF.git

# Dependencies kur
npm install

# Development server başlat
npm run dev

# Build için
npm run build
```

---

**Bu proje, Albion Online topluluğu için en kapsamlı ve kullanışlı portal olmayı hedeflemektedir. Her seviyeden oyuncunun ihtiyaçlarını karşılayacak şekilde tasarlanmıştır ve sürekli geliştirilmektedir.**

> Bu site Sandbox Interactive GmbH ile resmi bir bağlantısı yoktur.
