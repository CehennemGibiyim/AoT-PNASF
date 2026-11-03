# Gereksinim: Windows 10/11, PowerShell 5.1+
# Kullanım (depo kökünden):
#   powershell -ExecutionPolicy Bypass -File desktop/scripts/build-windows.ps1
#   powershell -ExecutionPolicy Bypass -File desktop/scripts/build-windows.ps1 -SkipTauri
#
# Hem Electron hem Tauri kurulum paketlerini üretir ve
# desktop/windows/kurulum/ klasöründe toplar.

param(
  [switch]$SkipElectron,
  [switch]$SkipTauri,
  [switch]$NoZip
)

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
Set-Location $repoRoot

function Step($metin) { Write-Host "`n=== $metin ===" -ForegroundColor Cyan }
function Fail($metin) { Write-Host "HATA: $metin" -ForegroundColor Red; exit 1 }

Step 'Araç kontrolü'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Fail 'Node.js bulunamadı (https://nodejs.org, 20+)' }
Write-Host ("node " + (node -v))
if (-not $SkipTauri -and -not (Get-Command cargo -ErrorAction SilentlyContinue)) {
  Fail 'Rust/cargo bulunamadı. Tauri için: https://rustup.rs  (veya -SkipTauri ile sadece Electron derleyin)'
}

Step 'Web sürümü (dist/)'
if (-not (Test-Path 'node_modules')) { npm ci; if ($LASTEXITCODE) { Fail 'npm ci başarısız' } }
npm run build
if ($LASTEXITCODE) { Fail 'npm run build başarısız' }

if (-not $SkipElectron) {
  Step 'Electron — NSIS + portable'
  Push-Location 'desktop/electron'
  try {
    if (-not (Test-Path 'node_modules')) { npm ci; if ($LASTEXITCODE) { Fail 'Electron bağımlılıkları kurulamadı' } }
    npm run pack:win
    if ($LASTEXITCODE) { Fail 'Electron paketleme başarısız' }
  } finally { Pop-Location }
}

if (-not $SkipTauri) {
  Step 'Tauri — NSIS + MSI'
  Push-Location 'desktop/tauri'
  try {
    if (-not (Test-Path 'node_modules')) { npm ci; if ($LASTEXITCODE) { Fail 'Tauri bağımlılıkları kurulamadı' } }
    npm run build:win
    if ($LASTEXITCODE) { Fail 'Tauri paketleme başarısız' }
  } finally { Pop-Location }
}

Step 'Kurulum klasörü'
node desktop/scripts/collect-windows.mjs
if ($LASTEXITCODE) { Fail 'Paketler toplanamadı' }

$kurulum = Join-Path $repoRoot 'desktop/windows/kurulum'

if (-not $NoZip) {
  Step 'ZIP'
  $surum = (Get-Content (Join-Path $repoRoot 'package.json') -Raw | ConvertFrom-Json).version
  $zip = Join-Path $repoRoot ("desktop/windows/AoT-PNASF-Windows-{0}.zip" -f $surum)
  if (Test-Path $zip) { Remove-Item $zip -Force }
  Compress-Archive -Path (Join-Path $kurulum '*') -DestinationPath $zip
  Write-Host ("ZIP: " + $zip)
}

Write-Host "`nTamamlandı. Klasör: desktop\windows\kurulum" -ForegroundColor Green
Get-ChildItem $kurulum | Select-Object Name, @{ n = 'MB'; e = { [math]::Round($_.Length / 1MB, 1) } } | Format-Table
