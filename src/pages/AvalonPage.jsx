import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const AVALON_DUNGEONS = [
  {
    id: 'avalon_1',
    name: 'Avalonian Road Dungeon',
    type: 'Group',
    difficulty: 'Hard',
    recommended_ip: '1200+',
    recommended_fame: '50M+',
    location: 'Avalonian Roads',
    bosses: [
      { name: 'Ancient Knight', hp: '2.5M', mechanics: ['Charge', 'Shield Wall', 'AoE'] },
      { name: 'Mystic Guardian', hp: '3.2M', mechanics: ['Teleport', 'Magic Shield', 'Reflect'] },
      { name: 'Final Boss', hp: '5.8M', mechanics: ['Phase 1', 'Phase 2', 'Enrage'] }
    ],
    party_composition: {
      tank: '1 Guardian',
      healer: '1 Holy', 
      dps: '3-4 DPS',
      support: '0-1 Support'
    },
    rewards: {
      artifacts: ['Avalonian Weapon', 'Avalonian Armor', 'Runes'],
      resources: '2-5M Silver',
      fame: '500K-1M Fame'
    },
    map_code: 'AVL001'
  },
  {
    id: 'avalon_2', 
    name: 'Mists Dungeon',
    type: 'Solo/Group',
    difficulty: 'Medium',
    recommended_ip: '800+',
    recommended_fame: '20M+',
    location: 'The Mists',
    bosses: [
      { name: 'Shadow Beast', hp: '1.8M', mechanics: ['Stealth', 'Poison', 'Summon'] },
      { name: 'Mist Lord', hp: '2.9M', mechanics: ['Fog', 'Clone', 'Drain'] }
    ],
    party_composition: {
      tank: '1 Tank (optional)',
      healer: '0-1 Healer',
      dps: '2-4 DPS',
      support: '0-1 Support'
    },
    rewards: {
      artifacts: ['Mist Essence', 'Shadow Items'],
      resources: '1-3M Silver',
      fame: '200K-500K Fame'
    },
    map_code: 'MST001'
  },
  {
    id: 'hellgate_5',
    name: 'Hellgate 5v5',
    type: 'PvPvE',
    difficulty: 'Extreme',
    recommended_ip: '1000+',
    recommended_fame: '30M+',
    location: 'Random Yellow/Red Zones',
    bosses: [
      { name: 'Demon Lord', hp: '4.2M', mechanics: ['Fire AoE', 'Fear', 'Summon Minions'] },
      { name: 'Hell Guardians', hp: '1.5M each', mechanics: ['Coordinated Attack', 'Buff'] }
    ],
    party_composition: {
      tank: '1 Guardian',
      healer: '1 Holy',
      dps: '3 DPS (balanced)',
      support: '0 Support'
    },
    rewards: {
      artifacts: ['Demon Items', 'Hellgate Artifacts'],
      resources: '3-8M Silver',
      fame: '800K-1.5M Fame'
    },
    map_code: 'HG5'
  },
  {
    id: 'corrupted_8',
    name: 'Corrupted Dungeon',
    type: 'Solo',
    difficulty: 'Hard',
    recommended_ip: '900+',
    recommended_fame: '25M+',
    location: 'Red/Black Zones',
    bosses: [
      { name: 'Corrupted Keeper', hp: '2.1M', mechanics: ['Corruption', 'Decay', 'Life Steal'] }
    ],
    party_composition: {
      tank: 'Self-sufficient',
      healer: 'Self-heal',
      dps: 'High DPS',
      support: 'Utility'
    },
    rewards: {
      artifacts: ['Corrupted Items', 'Ancient Relics'],
      resources: '1.5-4M Silver',
      fame: '300K-800K Fame'
    },
    map_code: 'COR8'
  }
]

const BUILD_RECOMMENDATIONS = {
  tank: {
    weapons: ['Guardian Staff', 'Cursed Staff', 'Sword & Shield'],
    armor: 'Heavy Armor (Plate)',
    boots: 'Soldier Boots',
    helmet: 'Guardian Helmet',
    cape: 'Cleric Cape',
    mount: 'Armored Horse',
    skills: ['Shield Wall', 'Iron Will', 'Purify', 'Heal']
  },
  healer: {
    weapons: ['Holy Staff', 'Nature Staff', 'Cursed Staff'],
    armor: 'Cloth Armor (Healer)',
    boots: 'Scholar Boots',
    helmet: 'Cleric Helmet', 
    cape: 'Healer Cape',
    mount: 'Giant Stag',
    skills: ['Heal', 'Purify', 'Resurrect', 'Group Heal']
  },
  dps: {
    weapons: ['Dagger Pair', 'Bow', 'Fire Staff', 'Curse Staff'],
    armor: 'Leather/Cloth Armor',
    boots: 'Assassin/Scholar Boots',
    helmet: 'Assassin/Scholar Helmet',
    cape: 'Assassin/Mage Cape',
    mount: 'Mustang/Saddled Swamp Dragon',
    skills: ['High Damage', 'Mobility', 'Burst', 'Sustain']
  }
}

const DUNGEON_STATS = [
  { dungeon: 'Avalon 1', completion_rate: 78, avg_time: 45, deaths_per_run: 2.3 },
  { dungeon: 'Mists', completion_rate: 65, avg_time: 28, deaths_per_run: 3.1 },
  { dungeon: 'Hellgate 5v5', completion_rate: 42, avg_time: 35, deaths_per_run: 4.7 },
  { dungeon: 'Corrupted 8', completion_rate: 71, avg_time: 18, deaths_per_run: 1.8 }
]

export default function AvalonPage() {
  const [selectedDungeon, setSelectedDungeon] = useState(AVALON_DUNGEONS[0])
  const [selectedRole, setSelectedRole] = useState('tank')
  const [showMechanics, setShowMechanics] = useState(true)

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Extreme': return '#ef4444'
      case 'Hard': return '#f97316'
      case 'Medium': return '#f5c842'
      case 'Easy': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getTypeColor = (type) => {
    switch(type) {
      case 'PvPvE': return '#ef4444'
      case 'Group': return '#f5c842'
      case 'Solo': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{ padding: '1.5rem', minHeight: '100vh', background: '#0d0f14' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#f5c842', fontSize: 28, fontWeight: 700, margin: 0 }}>
          Avalon Dungeon Rehberleri
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
          Avalon dungeonları, boss stratejileri ve build önerileri
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Dungeon Listesi
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {AVALON_DUNGEONS.map(dungeon => (
              <button
                key={dungeon.id}
                onClick={() => setSelectedDungeon(dungeon)}
                style={{
                  background: selectedDungeon.id === dungeon.id ? '#f5c842' : '#0d0f14',
                  color: selectedDungeon.id === dungeon.id ? '#0d0f14' : '#e2e8f0',
                  border: selectedDungeon.id === dungeon.id ? '1px solid #f5c842' : '1px solid #2a2f3e',
                  borderRadius: 8,
                  padding: '12px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{dungeon.name}</div>
                <div style={{ fontSize: 11, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ 
                    background: getTypeColor(dungeon.type), 
                    color: 'white', 
                    padding: '2px 6px', 
                    borderRadius: 4 
                  }}>
                    {dungeon.type}
                  </span>
                  <span style={{ 
                    background: getDifficultyColor(dungeon.difficulty), 
                    color: 'white', 
                    padding: '2px 6px', 
                    borderRadius: 4 
                  }}>
                    {dungeon.difficulty}
                  </span>
                  <span>{dungeon.recommended_ip}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            {selectedDungeon.name} Detayları
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>Konum</div>
              <div style={{ color: '#e2e8f0', fontSize: 14 }}>{selectedDungeon.location}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>Zorluk</div>
              <div style={{ color: getDifficultyColor(selectedDungeon.difficulty), fontSize: 14, fontWeight: 600 }}>
                {selectedDungeon.difficulty}
              </div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>IP Önerisi</div>
              <div style={{ color: '#e2e8f0', fontSize: 14 }}>{selectedDungeon.recommended_ip}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>Fame Önerisi</div>
              <div style={{ color: '#e2e8f0', fontSize: 14 }}>{selectedDungeon.recommended_fame}</div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#f5c842', fontSize: 14, fontWeight: 600, marginBottom: '8px' }}>
              Bosslar ve Mekanikler
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedDungeon.bosses.map((boss, idx) => (
                <div key={idx} style={{ background: '#0d0f14', border: '1px solid #2a2f3e', borderRadius: 8, padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ color: '#ef4444', fontSize: 14, fontWeight: 600 }}>{boss.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: 12 }}>HP: {boss.hp}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {boss.mechanics.map(mechanic => (
                      <span key={mechanic} style={{
                        background: '#2a2f3e',
                        color: '#94a3b8',
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 11
                      }}>
                        {mechanic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#f5c842', fontSize: 14, fontWeight: 600, marginBottom: '8px' }}>
              Parti Kompozisyonu
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {Object.entries(selectedDungeon.party_composition).map(([role, count]) => (
                <div key={role} style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 12 }}>
                  <span>{role.charAt(0).toUpperCase() + role.slice(1)}:</span>
                  <span style={{ color: '#e2e8f0' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ color: '#f5c842', fontSize: 14, fontWeight: 600, marginBottom: '8px' }}>
              Ödüller
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Artifacts</div>
                <div style={{ color: '#e2e8f0', fontSize: 12 }}>{selectedDungeon.rewards.artifacts.join(', ')}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Silver</div>
                <div style={{ color: '#f5c842', fontSize: 12 }}>{selectedDungeon.rewards.resources}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Fame</div>
                <div style={{ color: '#10b981', fontSize: 12 }}>{selectedDungeon.rewards.fame}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Build Önerileri
          </h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            {['tank', 'healer', 'dps'].map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                style={{
                  background: selectedRole === role ? '#f5c842' : '#2a2f3e',
                  color: selectedRole === role ? '#0d0f14' : '#94a3b8',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                {role.toUpperCase()}
              </button>
            ))}
          </div>
          
          <div style={{ background: '#0d0f14', border: '1px solid #2a2f3e', borderRadius: 8, padding: '12px' }}>
            <div style={{ display: 'grid', gap: '8px' }}>
              {Object.entries(BUILD_RECOMMENDATIONS[selectedRole]).map(([slot, items]) => (
                <div key={slot} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{slot.charAt(0).toUpperCase() + slot.slice(1)}:</span>
                  <span style={{ color: '#e2e8f0' }}>{Array.isArray(items) ? items.join(', ') : items}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Dungeon İstatistikleri
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={DUNGEON_STATS}>
              <XAxis dataKey="dungeon" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
              />
              <Area type="monotone" dataKey="completion_rate" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
        <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
          Harita Kodları
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {AVALON_DUNGEONS.map(dungeon => (
            <div key={dungeon.id} style={{ background: '#0d0f14', border: '1px solid #2a2f3e', borderRadius: 8, padding: '12px' }}>
              <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                {dungeon.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: 11 }}>Harita Kodu:</span>
                <code style={{ background: '#2a2f3e', color: '#f5c842', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>
                  {dungeon.map_code}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
