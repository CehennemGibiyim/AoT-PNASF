//! AoT PNASF — Tauri kabuğu.
//!
//! Arayüz depo kökündeki `dist/` çıktısıdır (tauri.conf.json → frontendDist).
//! WebView kendi protokolü üzerinden servis ettiği için `fetch('data/*.json')`
//! çağrıları web sürümüyle aynı çalışır.

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("AoT PNASF başlatılamadı");
}
