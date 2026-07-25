#!/usr/bin/env python3
"""
Otomatik Çeviri JSON Oluşturucu
tr.json'daki tüm key'leri alıp diğer diller için JSON oluşturur
"""

import json
import os

# tr.json'dan key'leri oku
with open('locates/tr.json', 'r', encoding='utf-8') as f:
    tr_data = json.load(f)

# Dil tanımları (Kod, İsim)
languages = {
    'en': 'English',
    'fr': 'Français',
    'es': 'Español',
    'pt': 'Português',
    'ru': 'Русский',
    'pl': 'Polski',
    'zh': '中文',
    'it': 'Italiano'
}

# Basit çeviri mapping'leri (en azından placeholder olsun)
translations = {
    'en': {k: f"[EN] {v}" for k, v in tr_data.items()},
    'fr': {k: f"[FR] {v}" for k, v in tr_data.items()},
    'es': {k: f"[ES] {v}" for k, v in tr_data.items()},
    'pt': {k: f"[PT] {v}" for k, v in tr_data.items()},
    'ru': {k: f"[RU] {v}" for k, v in tr_data.items()},
    'pl': {k: f"[PL] {v}" for k, v in tr_data.items()},
    'zh': {k: f"[ZH] {v}" for k, v in tr_data.items()},
    'it': {k: f"[IT] {v}" for k, v in tr_data.items()}
}

# Her dil için JSON oluştur
for lang_code, lang_name in languages.items():
    output_file = f'locates/{lang_code}.json'
    
    # Eğer dosya zaten varsa (en.json, de.json) skip et
    if os.path.exists(output_file):
        print(f"⏭️  {lang_name} ({lang_code}) zaten var, atlanıyor")
        continue
    
    # JSON dosyası oluştur
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(translations[lang_code], f, ensure_ascii=False, indent=2)
    
    print(f"✅ {lang_name} ({lang_code}) oluşturuldu: {len(translations[lang_code])} key")

print("\n🎉 Tüm dil dosyaları oluşturuldu!")
print("⚠️  NOT: Placeholder çeviriler kullanıldı. Manuel düzenleme gerekli.")
