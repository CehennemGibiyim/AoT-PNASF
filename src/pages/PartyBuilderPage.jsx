import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const ACTIVITY_TEMPLATES = [
  {
    id: 'zvz_siege',
    name: 'ZvZ Kuşatma Savaşı',
    type: 'pvp',
    difficulty: 'Extreme',
    min_players: 30,
    max_players: 50,
    recommended_ip: '1200+',
    duration: '45-60 dakika',
    location: 'Black Zone Territory',
    objectives: ['Enemy Territory Capture', 'Siege Weapons Destroy', 'Defensive Points Hold'],
    rewards: { fame: '5M-10M', silver: '10M-20M', territory_control: true },
    party_composition: {
      tanks: 8,
      healers: 6,
      dps: 28,
      supports: 8
    }
  },
  {
    id: 'avalon_dungeon_run',
    name: 'Avalon Dungeon Run',
    type: 'dungeon',
    difficulty: 'Hard',
    min_players: 5,
    max_players: 10,
    recommended_ip: '1000+',
    duration: '30-45 dakika',
    location: 'Avalonian Roads',
    objectives: ['Boss Defeat', 'Chest Collection', 'Elite Enemy Clear'],
    rewards: { fame: '2M-5M', silver: '3M-8M', artifacts: 'High' },
    party_composition: {
      tanks: 2,
      healers: 2,
      dps: 4,
      supports: 2
    }
  },
  {
    id: 'world_boss_hunt',
    name: 'World Boss Avı',
    type: 'world_event',
    difficulty: 'Very Hard',
    min_players: 20,
    max_players: 40,
    recommended_ip: '1100+',
    duration: '15-25 dakika',
    location: 'Random Royal Cities',
    objectives: ['Boss Defeat', 'Phase Management', 'Survival'],
    rewards: { fame: '3M-7M', silver: '5M-15M', unique_items: 'Guaranteed' },
    party_composition: {
      tanks: 6,
      healers: 4,
      dps: 24,
      supports: 6
    }
  },
  {
    id: 'hellgate_championship',
    name: 'Hellgate Şampiyonası',
    type: 'pvpve',
    difficulty: 'Hard',
    min_players: 5,
    max_players: 5,
    recommended_ip: '1000+',
    duration: '20-30 dakika',
    location: 'Random Hellgate',
    objectives: ['Enemy Party Defeat', 'Boss Clear', 'Treasure Collection'],
    rewards: { fame: '1M-3M', silver: '2M-6M', hellgate_points: 'High' },
    party_composition: {
      tanks: 1,
      healers: 1,
      dps: 3,
      supports: 0
    }
  },
  {
    id: 'resource_expedition',
    name: 'Kaynak Seferi',
    type: 'gathering',
    difficulty: 'Medium',
    min_players: 4,
    max_players: 8,
    recommended_ip: '800+',
    duration: '60-90 dakika',
    location: 'Black Zone Resource Areas',
    objectives: ['Resource Collection', 'Escort Duty', 'Base Defense'],
    rewards: { fame: '500K-1M', silver: '1M-3M', resources: 'Massive' },
    party_composition: {
      tanks: 2,
      healers: 1,
      dps: 3,
      supports: 2
    }
  }
]

const PARTY_SETS = {
  zvz_siege: {
    tanks: [
      {
        name: 'Guardian Tank',
        weapon: 'T8_Guardian_Staff',
        armor: 'T8_Armor_Heavy_Plate',
        offhand: 'T8_Shield_Heavy',
        boots: 'T8_Soldier_Boots',
        helmet: 'T8_Guardian_Helmet',
        cape: 'T8_Cleric_Cape',
        mount: 'T8_Armored_Horse',
        food: 'T8_Stew',
        potions: ['T8_Heal_Potion', 'T8_Energy_Potion', 'T8_Resist_Potion'],
        skills: ['Shield Wall', 'Iron Will', 'Purify', 'Group Heal'],
        role: 'Frontline Defender',
        description: 'Yüksek defans ve group utility, ZvZ için ideal'
      },
      {
        name: 'Cursed Tank',
        weapon: 'T8_Cursed_Staff',
        armor: 'T8_Armor_Heavy_Cursed',
        offhand: 'T8_Cursed_Book',
        boots: 'T8_Soldier_Boots',
        helmet: 'T8_Guardian_Helmet',
        cape: 'T8_Demon_Cape',
        mount: 'T8_Armored_Horse',
        food: 'T8_Stew',
        potions: ['T8_Heal_Potion', 'T8_Energy_Potion', 'T8_Cleansing_Potion'],
        skills: ['Life Siphon', 'Corruption Field', 'Group Damage', 'Self Sustain'],
        role: 'Sustained Damage Tank',
        description: 'Sustained damage ve group support'
      }
    ],
    healers: [
      {
        name: 'Holy Healer',
        weapon: 'T8_Holy_Staff',
        armor: 'T8_Armor_Cloth_Holy',
        offhand: 'T8_Holy_Book',
        boots: 'T8_Scholar_Boots',
        helmet: 'T8_Cleric_Helmet',
        cape: 'T8_Healer_Cape',
        mount: 'T8_Giant_Stag',
        food: 'T8_Pie',
        potions: ['T8_Heal_Potion', 'T8_Energy_Potion', 'T8_Resist_Potion'],
        skills: ['Divine Light', 'Group Heal', 'Resurrect', 'Purify'],
        role: 'Primary Healer',
        description: 'En yüksek healing potansiyeli'
      },
      {
        name: 'Nature Healer',
        weapon: 'T8_Nature_Staff',
        armor: 'T8_Armor_Leather_Nature',
        offhand: 'T8_Nature_Book',
        boots: 'T8_Scholar_Boots',
        helmet: 'T8_Cleric_Helmet',
        cape: 'T8_Healer_Cape',
        mount: 'T8_Giant_Stag',
        food: 'T8_Salad',
        potions: ['T8_Heal_Potion', 'T8_Energy_Potion', 'T8_Regeneration_Potion'],
        skills: ['Heal over Time', 'Group Buffs', 'Mobility', 'Sustain'],
        role: 'Support Healer',
        description: 'HoT ve group support odaklı'
      }
    ],
    dps: [
      {
        name: 'Dagger Ganker',
        weapon: 'T8_Dagger_Pair',
        armor: 'T8_Armor_Leather_Assassin',
        offhand: 'T8_Demon_Skull',
        boots: 'T8_Assassin_Boots',
        helmet: 'T8_Assassin_Helmet',
        cape: 'T8_Assassin_Cape',
        mount: 'T8_Mustang',
        food: 'T8_Roast_Beef',
        potions: ['T8_Energy_Potion', 'T8_Invisibility_Potion', 'T8_Speed_Potion'],
        skills: ['Ambush', 'Burst Damage', 'Stealth', 'Mobility'],
        role: 'Burst DPS',
        description: 'High burst damage ve stealth'
      },
      {
        name: 'Bow DPS',
        weapon: 'T8_Warbow',
        armor: 'T8_Armor_Leather_Hunter',
        offhand: 'T8_Quiver',
        boots: 'T8_Assassin_Boots',
        helmet: 'T8_Hunter_Helmet',
        cape: 'T8_Assassin_Cape',
        mount: 'T8_Mustang',
        food: 'T8_Roast_Beef',
        potions: ['T8_Energy_Potion', 'T8_Speed_Potion', 'T8_Resist_Potion'],
        skills: ['Kiting', 'Range Damage', 'Mobility', 'Crowd Control'],
        role: 'Range DPS',
        description: 'Uzak mesafe hasarı ve kiting'
      },
      {
        name: 'Fire Staff',
        weapon: 'T8_Fire_Staff',
        armor: 'T8_Armor_Cloth_Mage',
        offhand: 'T8_Fire_Book',
        boots: 'T8_Scholar_Boots',
        helmet: 'T8_Mage_Helmet',
        cape: 'T8_Mage_Cape',
        mount: 'T8_Saddled_Swamp_Dragon',
        food: 'T8_Pie',
        potions: ['T8_Energy_Potion', 'T8_Resist_Potion', 'T8_Mana_Potion'],
        skills: ['AoE Damage', 'Zone Control', 'Burst', 'CC'],
        role: 'AoE DPS',
        description: 'AoE damage ve zone control'
      },
      {
        name: 'Sword DPS',
        weapon: 'T8_Cleaver',
        armor: 'T8_Armor_Leather_Assassin',
        offhand: 'T8_Demon_Skull',
        boots: 'T8_Assassin_Boots',
        helmet: 'T8_Assassin_Helmet',
        cape: 'T8_Assassin_Cape',
        mount: 'T8_Mustang',
        food: 'T8_Roast_Beef',
        potions: ['T8_Energy_Potion', 'T8_Speed_Potion', 'T8_Resist_Potion'],
        skills: ['Sustained Damage', 'Burst', 'Mobility', 'Survivability'],
        role: 'Melee DPS',
        description: 'Sustained ve burst damage kombinasyonu'
      }
    ],
    supports: [
      {
        name: 'Support Staff',
        weapon: 'T8_Holy_Staff',
        armor: 'T8_Armor_Cloth_Holy',
        offhand: 'T8_Holy_Book',
        boots: 'T8_Scholar_Boots',
        helmet: 'T8_Cleric_Helmet',
        cape: 'T8_Healer_Cape',
        mount: 'T8_Giant_Stag',
        food: 'T8_Pie',
        potions: ['T8_Heal_Potion', 'T8_Energy_Potion', 'T8_Resist_Potion'],
        skills: ['Group Buffs', 'Debuff Removal', 'Utility', 'Support'],
        role: 'Support/Utility',
        description: 'Group buffleri ve utility'
      },
      {
        name: 'Nature Support',
        weapon: 'T8_Nature_Staff',
        armor: 'T8_Armor_Leather_Nature',
        offhand: 'T8_Nature_Book',
        boots: 'T8_Scholar_Boots',
        helmet: 'T8_Cleric_Helmet',
        cape: 'T8_Healer_Cape',
        mount: 'T8_Giant_Stag',
        food: 'T8_Salad',
        potions: ['T8_Heal_Potion', 'T8_Energy_Potion', 'T8_Regeneration_Potion'],
        skills: ['Group Sustain', 'Mobility Buffs', 'Defense Buffs', 'Support'],
        role: 'Support/Sustain',
        description: 'Group sustain ve mobility'
      }
    ]
  },
  avalon_dungeon: {
    tanks: [
      {
        name: 'Avalon Tank',
        weapon: 'T8_Guardian_Staff',
        armor: 'T8_Armor_Heavy_Plate',
        offhand: 'T8_Shield_Heavy',
        boots: 'T8_Soldier_Boots',
        helmet: 'T8_Guardian_Helmet',
        cape: 'T8_Cleric_Cape',
        mount: 'T8_Armored_Horse',
        food: 'T8_Stew',
        potions: ['T8_Heal_Potion', 'T8_Energy_Potion', 'T8_Resist_Potion'],
        skills: ['Shield Wall', 'Iron Will', 'Purify', 'Group Heal'],
        role: 'Dungeon Tank',
        description: 'Avalon dungeon\'lar için optimize edilmiş'
      }
    ],
    healers: [
      {
        name: 'Dungeon Healer',
        weapon: 'T8_Holy_Staff',
        armor: 'T8_Armor_Cloth_Holy',
        offhand: 'T8_Holy_Book',
        boots: 'T8_Scholar_Boots',
        helmet: 'T8_Cleric_Helmet',
        cape: 'T8_Healer_Cape',
        mount: 'T8_Giant_Stag',
        food: 'T8_Pie',
        potions: ['T8_Heal_Potion', 'T8_Energy_Potion', 'T8_Resist_Potion'],
        skills: ['Divine Light', 'Group Heal', 'Resurrect', 'Purify'],
        role: 'Primary Healer',
        description: 'Dungeon healing için optimize edilmiş'
      }
    ],
    dps: [
      {
        name: 'Dungeon DPS',
        weapon: 'T8_Fire_Staff',
        armor: 'T8_Armor_Cloth_Mage',
        offhand: 'T8_Fire_Book',
        boots: 'T8_Scholar_Boots',
        helmet: 'T8_Mage_Helmet',
        cape: 'T8_Mage_Cape',
        mount: 'T8_Saddled_Swamp_Dragon',
        food: 'T8_Pie',
        potions: ['T8_Energy_Potion', 'T8_Resist_Potion', 'T8_Mana_Potion'],
        skills: ['AoE Damage', 'Zone Control', 'Burst', 'CC'],
        role: 'AoE DPS',
        description: 'Dungeon AoE damage için optimize edilmiş'
      }
    ],
    supports: [
      {
        name: 'Dungeon Support',
        weapon: 'T8_Nature_Staff',
        armor: 'T8_Armor_Leather_Nature',
        offhand: 'T8_Nature_Book',
        boots: 'T8_Scholar_Boots',
        helmet: 'T8_Cleric_Helmet',
        cape: 'T8_Healer_Cape',
        mount: 'T8_Giant_Stag',
        food: 'T8_Salad',
        potions: ['T8_Heal_Potion', 'T8_Energy_Potion', 'T8_Regeneration_Potion'],
        skills: ['Group Sustain', 'Mobility Buffs', 'Defense Buffs', 'Support'],
        role: 'Support/Sustain',
        description: 'Dungeon support için optimize edilmiş'
      }
    ]
  }
}

const COLORS = ['#ef4444', '#f5c842', '#10b981', '#3b82f6', '#8b5cf6', '#f97316']

export default function PartyBuilderPage() {
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITY_TEMPLATES[0])
  const [selectedRole, setSelectedRole] = useState('tanks')
  const [partyComposition, setPartyComposition] = useState({})
  const [language, setLanguage] = useState('tr')
  const [theme, setTheme] = useState('dark')

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Extreme': return '#ef4444'
      case 'Very Hard': return '#dc2626'
      case 'Hard': return '#f97316'
      case 'Medium': return '#f5c842'
      case 'Easy': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getRoleIcon = (role) => {
    switch(role) {
      case 'tanks': return '🛡️'
      case 'healers': return '💚'
      case 'dps': return '⚔️'
      case 'supports': return '✨'
      default: return '❓'
    }
  }

  const getRoleColor = (role) => {
    switch(role) {
      case 'tanks': return '#3b82f6'
      case 'healers': return '#10b981'
      case 'dps': return '#ef4444'
      case 'supports': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  const addToParty = (build) => {
    const currentRole = selectedRole.slice(0, -1) // Remove 's' from plural
    const currentCount = partyComposition[currentRole] || 0
    const maxCount = selectedActivity.party_composition[selectedRole] || 0
    
    if (currentCount < maxCount) {
      setPartyComposition(prev => ({
        ...prev,
        [currentRole]: [...(prev[currentRole] || []), build]
      }))
    }
  }

  const removeFromParty = (role, index) => {
    setPartyComposition(prev => ({
      ...prev,
      [role]: prev[role].filter((_, i) => i !== index)
    }))
  }

  const getPartyProgress = () => {
    const progress = {}
    Object.entries(selectedActivity.party_composition).forEach(([role, count]) => {
      const current = partyComposition[role] || []
      progress[role] = {
        current: current.length,
        max: count,
        percentage: (current.length / count) * 100
      }
    })
    return progress
  }

  const partyProgress = getPartyProgress()

  const translations = {
    tr: {
      title: 'Party Builder ve Aktivite Planlayıcısı',
      activity: 'Aktivite',
      difficulty: 'Zorluk',
      min_players: 'Min Oyuncu',
      max_players: 'Max Oyuncu',
      recommended_ip: 'Önerilen IP',
      duration: 'Süre',
      location: 'Konum',
      objectives: 'Hedefler',
      rewards: 'Ödüller',
      party_composition: 'Party Kompozisyonu',
      equipment: 'Ekipman',
      skills: 'Yetenekler',
      role: 'Rol',
      description: 'Açıklama',
      add_to_party: 'Party\'ye Ekle',
      remove_from_party: 'Party\'den Çıkar',
      party_ready: 'Party Hazır!',
      party_incomplete: 'Party Tamamlanmadı',
      language: 'Dil',
      theme: 'Tema',
      dark: 'Koyu',
      light: 'Açık',
      custom: 'Özel'
    },
    en: {
      title: 'Party Builder & Activity Planner',
      activity: 'Activity',
      difficulty: 'Difficulty',
      min_players: 'Min Players',
      max_players: 'Max Players',
      recommended_ip: 'Recommended IP',
      duration: 'Duration',
      location: 'Location',
      objectives: 'Objectives',
      rewards: 'Rewards',
      party_composition: 'Party Composition',
      equipment: 'Equipment',
      skills: 'Skills',
      role: 'Role',
      description: 'Description',
      add_to_party: 'Add to Party',
      remove_from_party: 'Remove from Party',
      party_ready: 'Party Ready!',
      party_incomplete: 'Party Incomplete',
      language: 'Language',
      theme: 'Theme',
      dark: 'Dark',
      light: 'Light',
      custom: 'Custom'
    },
    de: {
      title: 'Party Builder & Aktivitätsplaner',
      activity: 'Aktivität',
      difficulty: 'Schwierigkeit',
      min_players: 'Min Spieler',
      max_players: 'Max Spieler',
      recommended_ip: 'Empfohlenes IP',
      duration: 'Dauer',
      location: 'Standort',
      objectives: 'Ziele',
      rewards: 'Belohnungen',
      party_composition: 'Party-Zusammensetzung',
      equipment: 'Ausrüstung',
      skills: 'Fähigkeiten',
      role: 'Rolle',
      description: 'Beschreibung',
      add_to_party: 'Zur Party hinzufügen',
      remove_from_party: 'Aus Party entfernen',
      party_ready: 'Party Bereit!',
      party_incomplete: 'Party Unvollständig',
      language: 'Sprache',
      theme: 'Thema',
      dark: 'Dunkel',
      light: 'Hell',
      custom: 'Benutzerdefiniert'
    },
    fr: {
      title: 'Constructeur de Party & Planificateur d\'Activité',
      activity: 'Activité',
      difficulty: 'Difficulté',
      min_players: 'Min Joueurs',
      max_players: 'Max Joueurs',
      recommended_ip: 'IP Recommandé',
      duration: 'Durée',
      location: 'Lieu',
      objectives: 'Objectifs',
      rewards: 'Récompenses',
      party_composition: 'Composition du Party',
      equipment: 'Équipement',
      skills: 'Compétences',
      role: 'Rôle',
      description: 'Description',
      add_to_party: 'Ajouter au Party',
      remove_from_party: 'Retirer du Party',
      party_ready: 'Party Prêt!',
      party_incomplete: 'Party Incomplet',
      language: 'Langue',
      theme: 'Thème',
      dark: 'Sombre',
      light: 'Clair',
      custom: 'Personnalisé'
    },
    es: {
      title: 'Constructor de Party y Planificador de Actividades',
      activity: 'Actividad',
      difficulty: 'Dificultad',
      min_players: 'Min Jugadores',
      max_players: 'Max Jugadores',
      recommended_ip: 'IP Recomendado',
      duration: 'Duración',
      location: 'Ubicación',
      objectives: 'Objetivos',
      rewards: 'Recompensas',
      party_composition: 'Composición del Party',
      equipment: 'Equipo',
      skills: 'Habilidades',
      role: 'Rol',
      description: 'Descripción',
      add_to_party: 'Añadir al Party',
      remove_from_party: 'Quitar del Party',
      party_ready: '¡Party Listo!',
      party_incomplete: 'Party Incompleto',
      language: 'Idioma',
      theme: 'Tema',
      dark: 'Oscuro',
      light: 'Claro',
      custom: 'Personalizado'
    },
    ru: {
      title: 'Создатель Пати и Планировщик Активностей',
      activity: 'Активность',
      difficulty: 'Сложность',
      min_players: 'Мин Игроков',
      max_players: 'Макс Игроков',
      recommended_ip: 'Рекомендуемое IP',
      duration: 'Длительность',
      location: 'Местоположение',
      objectives: 'Цели',
      rewards: 'Награды',
      party_composition: 'Состав Пати',
      equipment: 'Снаряжение',
      skills: 'Навыки',
      role: 'Роль',
      description: 'Описание',
      add_to_party: 'Добавить в Пати',
      remove_from_party: 'Удалить из Пати',
      party_ready: 'Пати Готово!',
      party_incomplete: 'Пати Незавершено',
      language: 'Язык',
      theme: 'Тема',
      dark: 'Тёмная',
      light: 'Светлая',
      custom: 'Пользовательская'
    }
  }

  const t = translations[language]

  const getThemeColors = () => {
    switch(theme) {
      case 'light':
        return {
          background: '#ffffff',
          card: '#f8fafc',
          border: '#e2e8f0',
          text: '#1a202c',
          subtext: '#4a5568',
          accent: '#3182ce',
          success: '#38a169',
          warning: '#d69e2e',
          danger: '#e53e3e'
        }
      case 'custom':
        return {
          background: '#1a1a2e',
          card: '#16213e',
          border: '#0f3460',
          text: '#e94560',
          subtext: '#533483',
          accent: '#ff6b6b',
          success: '#4ecdc4',
          warning: '#ffe66d',
          danger: '#ff6b6b'
        }
      default: // dark
        return {
          background: '#0d0f14',
          card: '#1a1d29',
          border: '#2a2f3e',
          text: '#e2e8f0',
          subtext: '#94a3b8',
          accent: '#f5c842',
          success: '#10b981',
          warning: '#f97316',
          danger: '#ef4444'
        }
    }
  }

  const themeColors = getThemeColors()

  return (
    <div style={{ 
      padding: '1.5rem', 
      minHeight: '100vh', 
      background: themeColors.background,
      color: themeColors.text
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: themeColors.accent, fontSize: 28, fontWeight: 700, margin: 0 }}>
          {t.title}
        </h1>
        <p style={{ color: themeColors.subtext, margin: 0, fontSize: 14 }}>
          Aktivite planlaması, party kompozisyonu ve set önerileri
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: themeColors.subtext, fontSize: 12 }}>{t.language}:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: themeColors.card,
              color: themeColors.text,
              border: `1px solid ${themeColors.border}`,
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 12
            }}
          >
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="ru">Русский</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: themeColors.subtext, fontSize: 12 }}>{t.theme}:</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{
              background: themeColors.card,
              color: themeColors.text,
              border: `1px solid ${themeColors.border}`,
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 12
            }}
          >
            <option value="dark">{t.dark}</option>
            <option value="light">{t.light}</option>
            <option value="custom">{t.custom}</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ 
          background: themeColors.card, 
          border: `1px solid ${themeColors.border}`, 
          borderRadius: 12, 
          padding: '1.5rem' 
        }}>
          <h2 style={{ color: themeColors.accent, fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            {t.activity}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ACTIVITY_TEMPLATES.map(activity => (
              <button
                key={activity.id}
                onClick={() => {
                  setSelectedActivity(activity)
                  setPartyComposition({})
                }}
                style={{
                  background: selectedActivity.id === activity.id ? themeColors.accent : themeColors.background,
                  color: selectedActivity.id === activity.id ? themeColors.background : themeColors.text,
                  border: selectedActivity.id === activity.id ? `1px solid ${themeColors.accent}` : `1px solid ${themeColors.border}`,
                  borderRadius: 8,
                  padding: '12px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ color: selectedActivity.id === activity.id ? themeColors.background : themeColors.text, fontSize: 14, fontWeight: 600 }}>
                    {activity.name}
                  </div>
                  <span style={{ 
                    background: getDifficultyColor(activity.difficulty),
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 10
                  }}>
                    {activity.difficulty}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: themeColors.subtext, lineHeight: 1.4 }}>
                  <div><strong>{t.min_players}:</strong> {activity.min_players}-{activity.max_players}</div>
                  <div><strong>{t.recommended_ip}:</strong> {activity.recommended_ip}</div>
                  <div><strong>{t.duration}:</strong> {activity.duration}</div>
                  <div><strong>{t.location}:</strong> {activity.location}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ 
          background: themeColors.card, 
          border: `1px solid ${themeColors.border}`, 
          borderRadius: 12, 
          padding: '1.5rem' 
        }}>
          <h2 style={{ color: themeColors.accent, fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            {selectedActivity.name}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ color: themeColors.text, fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{t.objectives}</h3>
              <ul style={{ margin: 0, paddingLeft: 16, color: themeColors.subtext, fontSize: 12 }}>
                {selectedActivity.objectives.map((objective, idx) => (
                  <li key={idx}>{objective}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ color: themeColors.text, fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{t.rewards}</h3>
              <div style={{ fontSize: 11, color: themeColors.subtext, lineHeight: 1.4 }}>
                <div><strong>Fame:</strong> {selectedActivity.rewards.fame}</div>
                <div><strong>Silver:</strong> {selectedActivity.rewards.silver}</div>
                {selectedActivity.rewards.territory_control && <div><strong>Territory Control:</strong> ✓</div>}
                {selectedActivity.rewards.artifacts && <div><strong>Artifacts:</strong> {selectedActivity.rewards.artifacts}</div>}
                {selectedActivity.rewards.unique_items && <div><strong>Unique Items:</strong> {selectedActivity.rewards.unique_items}</div>}
                {selectedActivity.rewards.resources && <div><strong>Resources:</strong> {selectedActivity.rewards.resources}</div>}
                {selectedActivity.rewards.hellgate_points && <div><strong>Hellgate Points:</strong> {selectedActivity.rewards.hellgate_points}</div>}
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ color: themeColors.text, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{t.party_composition}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {Object.entries(selectedActivity.party_composition).map(([role, count]) => {
                const progress = partyProgress[role] || { current: 0, max: count, percentage: 0 }
                return (
                  <div key={role} style={{ 
                    background: themeColors.background, 
                    border: `1px solid ${themeColors.border}`, 
                    borderRadius: 8, 
                    padding: '12px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 16 }}>{getRoleIcon(role)}</span>
                      <div>
                        <div style={{ color: themeColors.text, fontSize: 12, fontWeight: 600 }}>
                          {role.charAt(0).toUpperCase() + role.slice(1)} ({count})
                        </div>
                        <div style={{ color: themeColors.subtext, fontSize: 10 }}>
                          {progress.current}/{progress.max}
                        </div>
                      </div>
                    </div>
                    <div style={{ 
                      height: 4, 
                      background: themeColors.border, 
                      borderRadius: 2, 
                      overflow: 'hidden',
                      marginBottom: 8
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${progress.percentage}%`,
                        background: getRoleColor(role),
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                    <button
                      onClick={() => setSelectedRole(role)}
                      style={{
                        background: selectedRole === role ? getRoleColor(role) : themeColors.background,
                        color: selectedRole === role ? 'white' : themeColors.text,
                        border: selectedRole === role ? `1px solid ${getRoleColor(role)}` : `1px solid ${themeColors.border}`,
                        borderRadius: 4,
                        padding: '4px 8px',
                        fontSize: 10,
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      {progress.current < count ? t.add_to_party : t.party_ready}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ 
          background: themeColors.card, 
          border: `1px solid ${themeColors.border}`, 
          borderRadius: 12, 
          padding: '1.5rem' 
        }}>
          <h2 style={{ color: themeColors.accent, fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Setleri
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(PARTY_SETS[selectedActivity.id]?.[selectedRole] || []).map((build, idx) => (
              <div key={idx} style={{ 
                background: themeColors.background, 
                border: `1px solid ${themeColors.border}`, 
                borderRadius: 8, 
                padding: '12px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ color: themeColors.text, fontSize: 14, fontWeight: 600 }}>
                      {build.name}
                    </div>
                    <div style={{ color: themeColors.subtext, fontSize: 11 }}>{build.role}</div>
                  </div>
                  <button
                    onClick={() => addToParty(build)}
                    disabled={partyProgress[selectedRole.slice(0, -1)]?.current >= selectedActivity.party_composition[selectedRole.slice(0, -1)]}
                    style={{
                      background: partyProgress[selectedRole.slice(0, -1)]?.current >= selectedActivity.party_composition[selectedRole.slice(0, -1)] ? themeColors.border : themeColors.success,
                      color: partyProgress[selectedRole.slice(0, -1)]?.current >= selectedActivity.party_composition[selectedRole.slice(0, -1)] ? themeColors.subtext : 'white',
                      border: 'none',
                      borderRadius: 4,
                      padding: '4px 8px',
                      fontSize: 10,
                      cursor: partyProgress[selectedRole.slice(0, -1)]?.current >= selectedActivity.party_composition[selectedRole.slice(0, -1)] ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {t.add_to_party}
                  </button>
                </div>
                <div style={{ fontSize: 11, color: themeColors.subtext, lineHeight: 1.4, marginBottom: 8 }}>
                  {build.description}
                </div>
                <div style={{ fontSize: 10, color: themeColors.subtext, lineHeight: 1.4 }}>
                  <div><strong>{t.equipment}:</strong></div>
                  <div>• {build.weapon}</div>
                  <div>• {build.armor}</div>
                  <div>• {build.offhand}</div>
                  <div>• {build.mount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          background: themeColors.card, 
          border: `1px solid ${themeColors.border}`, 
          borderRadius: 12, 
          padding: '1.5rem' 
        }}>
          <h2 style={{ color: themeColors.accent, fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Mevcut Party
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(partyComposition).length > 0 ? (
              Object.entries(partyComposition).map(([role, members]) => (
                <div key={role} style={{ 
                  background: themeColors.background, 
                  border: `1px solid ${themeColors.border}`, 
                  borderRadius: 8, 
                  padding: '12px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 16 }}>{getRoleIcon(role)}</span>
                    <div style={{ color: themeColors.text, fontSize: 14, fontWeight: 600 }}>
                      {role.charAt(0).toUpperCase() + role.slice(1)} ({members.length})
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {members.map((member, idx) => (
                      <div key={idx} style={{ 
                        background: themeColors.card, 
                        border: `1px solid ${themeColors.border}`, 
                        borderRadius: 6, 
                        padding: '8px' 
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ color: themeColors.text, fontSize: 12, fontWeight: 600 }}>
                            {member.name}
                          </div>
                          <button
                            onClick={() => removeFromParty(role, idx)}
                            style={{
                              background: themeColors.danger,
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              padding: '2px 6px',
                              fontSize: 10,
                              cursor: 'pointer'
                            }}
                          >
                            {t.remove_from_party}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                background: themeColors.background, 
                border: `1px solid ${themeColors.border}`, 
                borderRadius: 8, 
                padding: '2rem',
                textAlign: 'center',
                color: themeColors.subtext
              }}>
                Henüz party üyesi eklenmedi.
              </div>
            )}
          </div>

          <div style={{ 
            marginTop: '1rem',
            padding: '12px',
            background: Object.values(partyProgress).every(p => p.percentage === 100) ? themeColors.success : themeColors.warning,
            border: `1px solid ${Object.values(partyProgress).every(p => p.percentage === 100) ? themeColors.success : themeColors.warning}`,
            borderRadius: 8,
            textAlign: 'center',
            color: 'white',
            fontSize: 14,
            fontWeight: 600
          }}>
            {Object.values(partyProgress).every(p => p.percentage === 100) ? t.party_ready : t.party_incomplete}
          </div>
        </div>
      </div>
    </div>
  )
}
