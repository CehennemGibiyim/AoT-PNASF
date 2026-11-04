/**
 * Oturum mağazası — masaüstü dinleyicisinin çekirdeği.
 *
 * Electron'a bağımlı değildir; testler doğrudan bu modülü kullanır.
 * Olaylar loot / kill / death / fame / damage türlerindedir. Değerler
 * istemciden gelir; burada yalnızca toplanır, oyun belleğine veya ağ
 * trafiğine erişilmez.
 *
 * Sınır: Albion'un paketleri şifreli Photon UDP'dir; bu modül paket çözmez.
 * Amaç, yerel bir yardımcı aracın (veya elle girişin) ürettiği olayları
 * güvenli biçimde toplayıp oturum özeti çıkarmaktır.
 */
const fs = require('node:fs');
const path = require('node:path');

const MAX_EVENTS = 500;
const TURLER = new Set(['loot', 'kill', 'death', 'fame', 'damage']);
const FAME_ALANLARI = new Set(['pve', 'pvp', 'gather', 'craft']);

function sayi(deger, varsayilan = 0) {
  const n = Number(deger);
  return Number.isFinite(n) && n >= 0 ? n : varsayilan;
}

function metin(deger, enFazla = 120) {
  return String(deger == null ? '' : deger).slice(0, enFazla);
}

class SessionStore {
  constructor(dosya) {
    this.dosya = dosya;
    this.dinleyiciler = new Set();
    this.durum = this._bos();
    this._yukle();
  }

  _bos() {
    return {
      surum: 1,
      aktif: false,
      basladi: null,
      bitti: null,
      toplam: { silver: 0, fame: 0, kills: 0, deaths: 0, hasar: 0, loot: 0 },
      fame: { pve: 0, pvp: 0, gather: 0, craft: 0 },
      olaylar: [],
    };
  }

  _yukle() {
    try {
      const ham = JSON.parse(fs.readFileSync(this.dosya, 'utf8'));
      if (!ham || typeof ham !== 'object') return;
      this.durum = {
        ...this._bos(),
        ...ham,
        toplam: { ...this._bos().toplam, ...(ham.toplam || {}) },
        fame: { ...this._bos().fame, ...(ham.fame || {}) },
        olaylar: Array.isArray(ham.olaylar) ? ham.olaylar.slice(0, MAX_EVENTS) : [],
      };
    } catch {
      /* dosya yoksa veya bozuksa temiz başla */
    }
  }

  _kaydet() {
    try {
      fs.mkdirSync(path.dirname(this.dosya), { recursive: true });
      fs.writeFileSync(this.dosya, JSON.stringify(this.durum));
    } catch {
      /* disk hatası oturumu durdurmasın */
    }
  }

  _yayinla() {
    const anlik = this.ozet();
    for (const fn of this.dinleyiciler) {
      try { fn(anlik); } catch { /* dinleyici hatası yutulur */ }
    }
  }

  abone(fn) {
    this.dinleyiciler.add(fn);
    return () => this.dinleyiciler.delete(fn);
  }

  basla(zaman = new Date().toISOString()) {
    this.durum.aktif = true;
    this.durum.basladi = zaman;
    this.durum.bitti = null;
    this.durum.olaylar = [];
    this.durum.toplam = this._bos().toplam;
    this.durum.fame = this._bos().fame;
    this._kaydet();
    this._yayinla();
    return this.ozet();
  }

  bitir(zaman = new Date().toISOString()) {
    if (this.durum.aktif) {
      this.durum.aktif = false;
      this.durum.bitti = zaman;
      this._kaydet();
      this._yayinla();
    }
    return this.ozet();
  }

  temizle() {
    this.durum = this._bos();
    this._kaydet();
    this._yayinla();
    return this.ozet();
  }

  /**
   * Tek olay ekler. Geçersiz tür veya negatif değer sessizce yok sayılır.
   * @returns {{kabul: boolean, hata?: string}}
   */
  olayEkle(ham) {
    if (!ham || typeof ham !== 'object') return { kabul: false, hata: 'olay nesnesi gerekli' };
    const tur = metin(ham.tur || ham.type, 16).toLowerCase();
    if (!TURLER.has(tur)) return { kabul: false, hata: `bilinmeyen tür: ${tur || '(boş)'}` };

    const zaman = ham.zaman && !Number.isNaN(Date.parse(ham.zaman)) ? new Date(ham.zaman).toISOString() : new Date().toISOString();
    const olay = { tur, zaman };
    const toplam = this.durum.toplam;

    if (tur === 'loot') {
      const adet = Math.max(1, Math.round(sayi(ham.adet, 1)));
      const birim = sayi(ham.birimDeger ?? ham.unitValue, 0);
      const deger = sayi(ham.deger ?? ham.value, adet * birim);
      olay.ad = metin(ham.ad || ham.name || ham.itemId, 80) || 'Eşya';
      olay.adet = adet;
      olay.deger = Math.round(deger);
      toplam.silver += olay.deger;
      toplam.loot += 1;
    } else if (tur === 'kill' || tur === 'death') {
      const fame = sayi(ham.fame, 0);
      olay.ad = metin(ham.ad || ham.name, 60);
      olay.fame = Math.round(fame);
      if (tur === 'kill') { toplam.kills += 1; toplam.fame += olay.fame; }
      else { toplam.deaths += 1; }
    } else if (tur === 'fame') {
      const miktar = sayi(ham.miktar ?? ham.amount, 0);
      const alan = FAME_ALANLARI.has(metin(ham.alan || ham.category, 12)) ? metin(ham.alan || ham.category, 12) : 'pve';
      olay.miktar = Math.round(miktar);
      olay.alan = alan;
      this.durum.fame[alan] += olay.miktar;
      toplam.fame += olay.miktar;
    } else {
      const miktar = sayi(ham.miktar ?? ham.amount, 0);
      olay.miktar = Math.round(miktar);
      toplam.hasar += olay.miktar;
    }

    this.durum.olaylar.unshift(olay);
    if (this.durum.olaylar.length > MAX_EVENTS) this.durum.olaylar.length = MAX_EVENTS;
    if (!this.durum.aktif) {
      this.durum.aktif = true;
      this.durum.basladi = this.durum.basladi || zaman;
    }
    this._kaydet();
    this._yayinla();
    return { kabul: true };
  }

  /** Toplu olay; en fazla 100 kabul eder. */
  olaylariEkle(liste) {
    if (!Array.isArray(liste)) return { kabul: 0, hata: 'dizi gerekli' };
    let kabul = 0;
    for (const o of liste.slice(0, 100)) if (this.olayEkle(o).kabul) kabul++;
    return { kabul };
  }

  /** UI ve HTTP için özet; olayların tamamı gönderilmez. */
  ozet() {
    const d = this.durum;
    const bitis = d.aktif ? Date.now() : d.bitti ? Date.parse(d.bitti) : Date.now();
    const baslangic = d.basladi ? Date.parse(d.basladi) : bitis;
    const sure = Math.max(0, Math.round((bitis - baslangic) / 1000));
    return {
      ...d,
      olaylar: d.olaylar.slice(0, 30),
      sure,
      dps: sure > 0 ? Math.round(d.toplam.hasar / sure) : 0,
      fameSaat: sure > 0 ? Math.round((d.toplam.fame / sure) * 3600) : 0,
      silverSaat: sure > 0 ? Math.round((d.toplam.silver / sure) * 3600) : 0,
    };
  }
}

module.exports = { SessionStore, MAX_EVENTS, TURLER };
