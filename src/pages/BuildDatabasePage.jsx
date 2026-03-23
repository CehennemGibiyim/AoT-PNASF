import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const META_BUILDS = {
  tank: [
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
      usage_rate: 23.4,
      win_rate: 78.5,
      ip_required: 1200,
      description: 'ZVZ ve Avalon için en güvenilir tank build',
      strengths: ['Yüksek defans', 'Grup heal', 'CC resistance'],
      weaknesses: ['Düşük hasar', 'Yavaş mobilite']
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
      usage_rate: 18.7,
      win_rate: 75.2,
      ip_required: 1100,
      description: 'Sustained damage ve group utility',
      strengths: ['Sustained damage', 'Group utility', 'Life steal'],
      weaknesses: ['Burst damage zayıf', 'High mana cost']
    }
  ],
  healer: [
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
      usage_rate: 31.2,
      win_rate: 82.3,
      ip_required: 900,
      description: 'En yüksek healing potansiyeline sahip build',
      strengths: ['En yüksek heal', 'Grup buffleri', 'Resurrect'],
      weaknesses: ['Düşük defans', 'Mana yoğun']
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
      usage_rate: 25.8,
      win_rate: 79.6,
      ip_required: 950,
      description: 'HoT ve group support odaklı',
      strengths: ['HoT (Heal over Time)', 'Group support', 'Mobilite'],
      weaknesses: ['Burst heal zayıf', 'Single target focus']
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
      usage_rate: 34.5,
      win_rate: 71.8,
      ip_required: 1000,
      description: 'High burst damage ve stealth',
      strengths: ['Burst damage', 'Stealth', 'High mobility'],
      weaknesses: ['Düşük sustain', 'Vulnerable to CC']
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
      usage_rate: 28.9,
      win_rate: 74.2,
      ip_required: 950,
      description: 'Uzak mesafe hasarı ve kiting',
      strengths: ['Range damage', 'Kiting', 'High mobility'],
      weaknesses: ['Melee zayıf', 'Posisyon gerektirir']
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
      usage_rate: 22.3,
      win_rate: 76.7,
      ip_required: 1100,
      description: 'AoE damage ve zone control',
      strengths: ['AoE damage', 'Zone control', 'High burst'],
      weaknesses: ['Düşük defans', 'Mana yoğun', 'Skillshot']
    }
  ]
}

const META_STATS = {
  popular_weapons: [
    { weapon: 'T8_Dagger_Pair', usage: 34.5, win_rate: 71.8, role: 'DPS' },
    { weapon: 'T8_Warbow', usage: 28.9, win_rate: 74.2, role: 'DPS' },
    { weapon: 'T8_Fire_Staff', usage: 22.3, win_rate: 76.7, role: 'DPS' },
    { weapon: 'T8_Holy_Staff', usage: 31.2, win_rate: 82.3, role: 'Healer' },
    { weapon: 'T8_Guardian_Staff', usage: 23.4, win_rate: 78.5, role: 'Tank' },
    { weapon: 'T8_Cursed_Staff', usage: 18.7, win_rate: 75.2, role: 'Tank' }
  ],
  armor_meta: [
    { armor: 'T8_Armor_Heavy_Plate', usage: 15.6, win_rate: 78.5, role: 'Tank' },
    { armor: 'T8_Armor_Leather_Assassin', usage: 28.4, win_rate: 71.8, role: 'DPS' },
    { armor: 'T8_Armor_Cloth_Mage', usage: 22.1, win_rate: 76.7, role: 'DPS' },
    { armor: 'T8_Armor_Cloth_Holy', usage: 31.2, win_rate: 82.3, role: 'Healer' }
  ],
  counter_builds: [
    {
      target: 'Dagger Ganker',
      counter: 'Guardian Tank',
      counter_rate: 68.5,
      reasoning: 'High defans ve CC resistance, gankleri absorb eder'
    },
    {
      target: 'Fire Staff',
      counter: 'Dagger Ganker',
      counter_rate: 73.2,
      reasoning: 'Stealth ve burst damage, mages one-shot eder'
    },
    {
      target: 'Guardian Tank',
      counter: 'Cursed Staff',
      counter_rate: 62.8,
      reasoning: 'Sustained damage ve armor penetration'
    }
  ]
}

const COLORS = ['#ef4444', '#f5c842', '#10b981', '#3b82f6', '#8b5cf6', '#f97316']

export default function BuildDatabasePage() {
  const [selectedRole, setSelectedRole] = useState('tank')
  const [selectedBuild, setSelectedBuild] = useState(META_BUILDS.tank[0])
  const [compareMode, setCompareMode] = useState(false)
  const [compareBuilds, setCompareBuilds] = useState([])

  const getUsageColor = (usage) => {
    if (usage >= 30) return '#10b981'
    if (usage >= 20) return '#f5c842'
    if (usage >= 10) return '#f97316'
    return '#ef4444'
  }

  const getWinRateColor = (rate) => {
    if (rate >= 80) return '#10b981'
    if (rate >= 70) return '#f5c842'
    if (rate >= 60) return '#f97316'
    return '#ef4444'
  }

  const handleCompare = (build) => {
    if (compareBuilds.find(b => b.name === build.name)) {
      setCompareBuilds(compareBuilds.filter(b => b.name !== build.name))
    } else if (compareBuilds.length < 2) {
      setCompareBuilds([...compareBuilds, build])
    }
  }

  return (
    <div style={{ padding: '1.5rem', minHeight: '100vh', background: '#0d0f14' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#f5c842', fontSize: 28, fontWeight: 700, margin: 0 }}>
          Build Database ve Meta Analizleri
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
          Meta build'ler, istatistikler ve karşılaştırma araçları
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {['tank', 'healer', 'dps'].map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            style={{
              background: selectedRole === role ? '#f5c842' : '#1a1d29',
              color: selectedRole === role ? '#0d0f14' : '#94a3b8',
              border: selectedRole === role ? '1px solid #f5c842' : '1px solid #2a2f3e',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: selectedRole === role ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {role === 'tank' && 'Tank'}
            {role === 'healer' && 'Healer'}
            {role === 'dps' && 'DPS'}
          </button>
        ))}
        <button
          onClick={() => setCompareMode(!compareMode)}
          style={{
            background: compareMode ? '#8b5cf6' : '#1a1d29',
            color: compareMode ? 'white' : '#94a3b8',
            border: compareMode ? '1px solid #8b5cf6' : '1px solid #2a2f3e',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 13,
            cursor: 'pointer'
          }}
        >
          {compareMode ? 'Karşılaştırma Modu' : 'Karşılaştır'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: compareMode ? '1fr 1fr' : '1fr 2fr', gap: '1.5rem' }}>
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            {selectedRole.toUpperCase()} Build'leri
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {META_BUILDS[selectedRole].map((build, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedBuild(build)}
                style={{
                  background: selectedBuild.name === build.name ? '#f5c842' : '#0d0f14',
                  color: selectedBuild.name === build.name ? '#0d0f14' : '#e2e8f0',
                  border: selectedBuild.name === build.name ? '1px solid #f5c842' : '1px solid #2a2f3e',
                  borderRadius: 8,
                  padding: '12px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ color: selectedBuild.name === build.name ? '#0d0f14' : '#f5c842', fontSize: 14, fontWeight: 600 }}>
                    {build.name}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ 
                      background: getUsageColor(build.usage_rate),
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 10
                    }}>
                      {build.usage_rate}%
                    </span>
                    <span style={{ 
                      background: getWinRateColor(build.win_rate),
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 10
                    }}>
                      {build.win_rate}%
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', textAlign: 'left', lineHeight: 1.4 }}>
                  {build.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            {selectedBuild.name} Detayları
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Ekipman</h3>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                <div><strong>Silah:</strong> {selectedBuild.weapon}</div>
                <div><strong>Zırh:</strong> {selectedBuild.armor}</div>
                <div><strong>Offhand:</strong> {selectedBuild.offhand}</div>
                <div><strong>Botlar:</strong> {selectedBuild.boots}</div>
                <div><strong>Kask:</strong> {selectedBuild.helmet}</div>
                <div><strong>Pelerin:</strong> {selectedBuild.cape}</div>
                <div><strong>Mount:</strong> {selectedBuild.mount}</div>
                <div><strong>Yiyecek:</strong> {selectedBuild.food}</div>
                <div><strong>İksirler:</strong> {selectedBuild.potions.join(', ')}</div>
              </div>
            </div>
            
            <div>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>İstatistikler</h3>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                <div><strong>Kullanım Oranı:</strong> <span style={{ color: getUsageColor(selectedBuild.usage_rate) }}>{selectedBuild.usage_rate}%</span></div>
                <div><strong>Kazanma Oranı:</strong> <span style={{ color: getWinRateColor(selectedBuild.win_rate) }}>{selectedBuild.win_rate}%</span></div>
                <div><strong>Gerekli IP:</strong> {selectedBuild.ip_required}</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Güçlü Yönler</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {selectedBuild.strengths.map(strength => (
                <span key={strength} style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 11
                }}>
                  {strength}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Zayıf Yönler</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {selectedBuild.weaknesses.map(weakness => (
                <span key={weakness} style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 11
                }}>
                  {weakness}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {compareMode && compareBuilds.length > 0 && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem', marginTop: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Build Karşılaştırma ({compareBuilds.length}/2)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareBuilds.length}, 1fr)`, gap: '1rem' }}>
            {compareBuilds.map((build, idx) => (
              <div key={idx} style={{ 
                background: '#0d0f14', 
                border: '1px solid #2a2f3e', 
                borderRadius: 8, 
                padding: '1rem' 
              }}>
                <h3 style={{ color: '#f5c842', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                  {build.name}
                </h3>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                  <div><strong>Kullanım:</strong> {build.usage_rate}%</div>
                  <div><strong>Kazanma:</strong> {build.win_rate}%</div>
                  <div><strong>Gerekli IP:</strong> {build.ip_required}</div>
                  <div><strong>Silah:</strong> {build.weapon}</div>
                  <div><strong>Zırh:</strong> {build.armor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Popüler Silahlar
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={META_STATS.popular_weapons}>
              <XAxis dataKey="weapon" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
              />
              <Bar dataKey="usage" fill="#f5c842" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Build Karşıtları
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {META_STATS.counter_builds.map((counter, idx) => (
              <div key={idx} style={{ 
                background: '#0d0f14', 
                border: '1px solid #2a2f3e', 
                borderRadius: 8, 
                padding: '12px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <div style={{ color: '#ef4444', fontSize: 13, fontWeight: 600 }}>{counter.target}</div>
                    <div style={{ color: '#64748b', fontSize: 11 }}>Hedef</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#10b981', fontSize: 13, fontWeight: 600 }}>{counter.counter}</div>
                    <div style={{ color: '#64748b', fontSize: 11 }}>{counter.counter_rate}%</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{counter.reasoning}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
