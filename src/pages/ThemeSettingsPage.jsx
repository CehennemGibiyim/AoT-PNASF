import { useState, useEffect } from 'react'

const THEME_PRESETS = {
  dark: {
    name: 'Koyu Tema',
    background: '#0d0f14',
    card: '#1a1d29',
    border: '#2a2f3e',
    text: '#e2e8f0',
    subtext: '#94a3b8',
    accent: '#f5c842',
    success: '#10b981',
    warning: '#f97316',
    danger: '#ef4444',
    info: '#3b82f6',
    primary: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #1a1d29 0%, #0d0f14 100%)'
  },
  light: {
    name: 'Açık Tema',
    background: '#ffffff',
    card: '#f8fafc',
    border: '#e2e8f0',
    text: '#1a202c',
    subtext: '#4a5568',
    accent: '#3182ce',
    success: '#38a169',
    warning: '#d69e2e',
    danger: '#e53e3e',
    info: '#3182ce',
    primary: '#805ad5',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
  },
  ocean: {
    name: 'Okyanus Teması',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: '#f1f5f9',
    subtext: '#94a3b8',
    accent: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    primary: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
  },
  forest: {
    name: 'Orman Teması',
    background: '#14532d',
    card: '#166534',
    border: '#15803d',
    text: '#dcfce7',
    subtext: '#86efac',
    accent: '#22c55e',
    success: '#16a34a',
    warning: '#eab308',
    danger: '#dc2626',
    info: '#2563eb',
    primary: '#7c3aed',
    gradient: 'linear-gradient(135deg, #14532d 0%, #166534 100%)'
  },
  sunset: {
    name: 'Gün Batımı Teması',
    background: '#431407',
    card: '#7c2d12',
    border: '#9a3412',
    text: '#fed7aa',
    subtext: '#fdba74',
    accent: '#ea580c',
    success: '#16a34a',
    warning: '#fbbf24',
    danger: '#dc2626',
    info: '#2563eb',
    primary: '#7c3aed',
    gradient: 'linear-gradient(135deg, #431407 0%, #7c2d12 100%)'
  },
  midnight: {
    name: 'Gece Yarısı Teması',
    background: '#0c0a09',
    card: '#1c1917',
    border: '#292524',
    text: '#faf5ff',
    subtext: '#e7d5ff',
    accent: '#a78bfa',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
    info: '#60a5fa',
    primary: '#f472b6',
    gradient: 'linear-gradient(135deg, #0c0a09 0%, #1c1917 100%)'
  },
  cyberpunk: {
    name: 'Cyberpunk Teması',
    background: '#0a0e27',
    card: '#151932',
    border: '#1e2139',
    text: '#cdd6f4',
    subtext: '#94a3b8',
    accent: '#f72585',
    success: '#06ffa5',
    warning: '#ffbe0b',
    danger: '#fb5607',
    info: '#3a86ff',
    primary: '#8338ec',
    gradient: 'linear-gradient(135deg, #0a0e27 0%, #151932 100%)'
  },
  royal: {
    name: 'Kraliyet Teması',
    background: '#1e1b4b',
    card: '#312e81',
    border: '#4c1d95',
    text: '#e9d5ff',
    subtext: '#c084fc',
    accent: '#fbbf24',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
    info: '#60a5fa',
    primary: '#f472b6',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
  },
  frost: {
    name: 'Buz Teması',
    background: '#082f49',
    card: '#0c4a6e',
    border: '#075985',
    text: '#e0f2fe',
    subtext: '#7dd3fc',
    accent: '#0ea5e9',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    primary: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #082f49 0%, #0c4a6e 100%)'
  },
  volcanic: {
    name: 'Volkanik Teması',
    background: '#450a0a',
    card: '#7f1d1d',
    border: '#991b1b',
    text: '#fecaca',
    subtext: '#fca5a5',
    accent: '#dc2626',
    success: '#16a34a',
    warning: '#fbbf24',
    danger: '#dc2626',
    info: '#2563eb',
    primary: '#7c3aed',
    gradient: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)'
  },
  custom: {
    name: 'Özel Tema',
    background: '#1a1a2e',
    card: '#16213e',
    border: '#0f3460',
    text: '#e94560',
    subtext: '#533483',
    accent: '#ff6b6b',
    success: '#4ecdc4',
    warning: '#ffe66d',
    danger: '#ff6b6b',
    info: '#4ecdc4',
    primary: '#a8e6cf',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
  }
}

const LANGUAGE_OPTIONS = {
  tr: { name: 'Türkçe', flag: '🇹🇷' },
  en: { name: 'English', flag: '🇬🇧' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  fr: { name: 'Français', flag: '🇫🇷' },
  es: { name: 'Español', flag: '🇪🇸' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  pt: { name: 'Português', flag: '🇵🇹' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  ja: { name: '日本語', flag: '🇯🇵' },
  ko: { name: '한국어', flag: '🇰🇷' },
  zh: { name: '中文', flag: '🇨🇳' }
}

export default function ThemeSettingsPage() {
  const [selectedTheme, setSelectedTheme] = useState('dark')
  const [selectedLanguage, setSelectedLanguage] = useState('tr')
  const [customTheme, setCustomTheme] = useState(THEME_PRESETS.custom)
  const [isEditingCustom, setIsEditingCustom] = useState(false)
  const [savedThemes, setSavedThemes] = useState([])

  const currentTheme = selectedTheme === 'custom' ? customTheme : THEME_PRESETS[selectedTheme]

  const handleThemeChange = (themeName) => {
    setSelectedTheme(themeName)
    if (themeName !== 'custom') {
      // Apply theme to document
      document.documentElement.style.setProperty('--background-color', THEME_PRESETS[themeName].background)
      document.documentElement.style.setProperty('--card-color', THEME_PRESETS[themeName].card)
      document.documentElement.style.setProperty('--border-color', THEME_PRESETS[themeName].border)
      document.documentElement.style.setProperty('--text-color', THEME_PRESETS[themeName].text)
      document.documentElement.style.setProperty('--subtext-color', THEME_PRESETS[themeName].subtext)
      document.documentElement.style.setProperty('--accent-color', THEME_PRESETS[themeName].accent)
      document.documentElement.style.setProperty('--success-color', THEME_PRESETS[themeName].success)
      document.documentElement.style.setProperty('--warning-color', THEME_PRESETS[themeName].warning)
      document.documentElement.style.setProperty('--danger-color', THEME_PRESETS[themeName].danger)
      document.documentElement.style.setProperty('--info-color', THEME_PRESETS[themeName].info)
      document.documentElement.style.setProperty('--primary-color', THEME_PRESETS[themeName].primary)
    }
  }

  const handleCustomThemeChange = (property, value) => {
    setCustomTheme(prev => ({
      ...prev,
      [property]: value
    }))
  }

  const saveCustomTheme = () => {
    const themeName = prompt('Tema adını girin:')
    if (themeName) {
      setSavedThemes(prev => [...prev, { name: themeName, ...customTheme }])
      setIsEditingCustom(false)
    }
  }

  const applyCustomTheme = () => {
    document.documentElement.style.setProperty('--background-color', customTheme.background)
    document.documentElement.style.setProperty('--card-color', customTheme.card)
    document.documentElement.style.setProperty('--border-color', customTheme.border)
    document.documentElement.style.setProperty('--text-color', customTheme.text)
    document.documentElement.style.setProperty('--subtext-color', customTheme.subtext)
    document.documentElement.style.setProperty('--accent-color', customTheme.accent)
    document.documentElement.style.setProperty('--success-color', customTheme.success)
    document.documentElement.style.setProperty('--warning-color', customTheme.warning)
    document.documentElement.style.setProperty('--danger-color', customTheme.danger)
    document.documentElement.style.setProperty('--info-color', customTheme.info)
    document.documentElement.style.setProperty('--primary-color', customTheme.primary)
  }

  useEffect(() => {
    handleThemeChange(selectedTheme)
  }, [])

  return (
    <div style={{ 
      padding: '1.5rem', 
      minHeight: '100vh', 
      background: currentTheme.background,
      color: currentTheme.text
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: currentTheme.accent, fontSize: 28, fontWeight: 700, margin: 0 }}>
          Tema ve Dil Ayarları
        </h1>
        <p style={{ color: currentTheme.subtext, margin: 0, fontSize: 14 }}>
          Kişiselleştirilebilir tema seçenekleri ve çoklu dil desteği
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ 
          background: currentTheme.card, 
          border: `1px solid ${currentTheme.border}`, 
          borderRadius: 12, 
          padding: '1.5rem' 
        }}>
          <h2 style={{ color: currentTheme.accent, fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Tema Seçenekleri
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
            {Object.entries(THEME_PRESETS).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                style={{
                  background: selectedTheme === key ? currentTheme.accent : currentTheme.background,
                  color: selectedTheme === key ? currentTheme.background : currentTheme.text,
                  border: selectedTheme === key ? `2px solid ${currentTheme.accent}` : `1px solid ${currentTheme.border}`,
                  borderRadius: 8,
                  padding: '12px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    background: theme.gradient,
                    borderRadius: 4,
                    border: `1px solid ${theme.border}`
                  }}></div>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{theme.name}</span>
                </div>
              </button>
            ))}
          </div>

          {selectedTheme === 'custom' && (
            <div style={{ 
              background: currentTheme.background, 
              border: `1px solid ${currentTheme.border}`, 
              borderRadius: 8, 
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: currentTheme.text, fontSize: 14, fontWeight: 600 }}>
                  Özel Tema Düzenle
                </h3>
                <button
                  onClick={() => setIsEditingCustom(!isEditingCustom)}
                  style={{
                    background: currentTheme.accent,
                    color: currentTheme.background,
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  {isEditingCustom ? 'Kaydet' : 'Düzenle'}
                </button>
              </div>

              {isEditingCustom && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {Object.entries(customTheme).map(([key, value]) => (
                    <div key={key}>
                      <label style={{ display: 'block', color: currentTheme.subtext, fontSize: 11, marginBottom: 4 }}>
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                      </label>
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => handleCustomThemeChange(key, e.target.value)}
                        style={{
                          width: '100%',
                          height: 32,
                          border: `1px solid ${currentTheme.border}`,
                          borderRadius: 4,
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                <button
                  onClick={applyCustomTheme}
                  style={{
                    background: currentTheme.success,
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  Uygula
                </button>
                <button
                  onClick={saveCustomTheme}
                  style={{
                    background: currentTheme.info,
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  Kaydet
                </button>
              </div>
            </div>
          )}

          {savedThemes.length > 0 && (
            <div style={{ 
              background: currentTheme.background, 
              border: `1px solid ${currentTheme.border}`, 
              borderRadius: 8, 
              padding: '1rem'
            }}>
              <h3 style={{ color: currentTheme.text, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                Kaydedilen Temalar
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {savedThemes.map((theme, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCustomTheme(theme)
                      setSelectedTheme('custom')
                      applyCustomTheme()
                    }}
                    style={{
                      background: currentTheme.background,
                      color: currentTheme.text,
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: 6,
                      padding: '8px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ 
          background: currentTheme.card, 
          border: `1px solid ${currentTheme.border}`, 
          borderRadius: 12, 
          padding: '1.5rem' 
        }}>
          <h2 style={{ color: currentTheme.accent, fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Dil Seçenekleri
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
            {Object.entries(LANGUAGE_OPTIONS).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => setSelectedLanguage(key)}
                style={{
                  background: selectedLanguage === key ? currentTheme.accent : currentTheme.background,
                  color: selectedLanguage === key ? currentTheme.background : currentTheme.text,
                  border: selectedLanguage === key ? `2px solid ${currentTheme.accent}` : `1px solid ${currentTheme.border}`,
                  borderRadius: 8,
                  padding: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span style={{ fontSize: 20 }}>{lang.flag}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{lang.name}</span>
              </button>
            ))}
          </div>

          <div style={{ 
            background: currentTheme.background, 
            border: `1px solid ${currentTheme.border}`, 
            borderRadius: 8, 
            padding: '1rem'
          }}>
            <h3 style={{ color: currentTheme.text, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
              Mevcut Dil Ayarı
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>{LANGUAGE_OPTIONS[selectedLanguage].flag}</span>
              <div>
                <div style={{ color: currentTheme.text, fontSize: 16, fontWeight: 600 }}>
                  {LANGUAGE_OPTIONS[selectedLanguage].name}
                </div>
                <div style={{ color: currentTheme.subtext, fontSize: 12 }}>
                  Dil Kodu: {selectedLanguage}
                </div>
              </div>
            </div>
          </div>

          <div style={{ 
            background: currentTheme.background, 
            border: `1px solid ${currentTheme.border}`, 
            borderRadius: 8, 
            padding: '1rem',
            marginTop: '1rem'
          }}>
            <h3 style={{ color: currentTheme.text, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
              Tema Önizlemi
            </h3>
            <div style={{ 
              background: currentTheme.gradient,
              borderRadius: 8,
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ color: currentTheme.text, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                {currentTheme.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div style={{
                  background: currentTheme.accent,
                  color: currentTheme.background,
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 11
                }}>
                  Accent
                </div>
                <div style={{
                  background: currentTheme.success,
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 11
                }}>
                  Success
                </div>
                <div style={{
                  background: currentTheme.warning,
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 11
                }}>
                  Warning
                </div>
                <div style={{
                  background: currentTheme.danger,
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 11
                }}>
                  Danger
                </div>
                <div style={{
                  background: currentTheme.info,
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 11
                }}>
                  Info
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        background: currentTheme.card, 
        border: `1px solid ${currentTheme.border}`, 
        borderRadius: 12, 
        padding: '1.5rem',
        marginTop: '1.5rem'
      }}>
        <h2 style={{ color: currentTheme.accent, fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
          Hızlı Ayarlar
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <button
            onClick={() => handleThemeChange('dark')}
            style={{
              background: currentTheme.background,
              color: currentTheme.text,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: 8,
              padding: '12px',
              cursor: 'pointer'
            }}
          >
            🌙 Koyu Tema
          </button>
          <button
            onClick={() => handleThemeChange('light')}
            style={{
              background: currentTheme.background,
              color: currentTheme.text,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: 8,
              padding: '12px',
              cursor: 'pointer'
            }}
          >
            ☀️ Açık Tema
          </button>
          <button
            onClick={() => handleThemeChange('ocean')}
            style={{
              background: currentTheme.background,
              color: currentTheme.text,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: 8,
              padding: '12px',
              cursor: 'pointer'
            }}
          >
            🌊 Okyanus Teması
          </button>
        </div>
      </div>
    </div>
  )
}
