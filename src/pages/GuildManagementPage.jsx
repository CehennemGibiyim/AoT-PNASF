import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const GUILD_DATA = [
  {
    id: 'GUILD_ALPHA',
    name: 'Alpha Legion',
    tag: '[ALPHA]',
    founded: '2021-03-15',
    members: 156,
    active_members: 89,
    territory_count: 12,
    total_kills: 45678,
    total_deaths: 23456,
    kd_ratio: 1.95,
    alliance: 'RED_ALLIANCE',
    reputation: 4500,
    tax_rate: 15,
    description: 'PvP odaklı, ZVZ ve Avalon aktiviteleri',
    recruitment_status: 'open',
    requirements: 'IP 800+, Discord zorunlu',
    focus: ['ZVZ', 'Avalon', 'Ganking'],
    achievements: [
      { name: 'Territory Dominator', description: '30+ bölge kontrolü', date: '2024-01-15' },
      { name: 'ZVZ Champions', description: '100+ ZVZ zaferi', date: '2024-02-28' },
      { name: 'Avalon Masters', description: '50+ Avalon dungeon temizliği', date: '2024-03-10' }
    ]
  },
  {
    id: 'GUILD_BETA',
    name: 'Beta Guardians',
    tag: '[BETA]',
    founded: '2020-11-22',
    members: 234,
    active_members: 167,
    territory_count: 8,
    total_kills: 67890,
    total_deaths: 34567,
    kd_ratio: 1.96,
    alliance: 'BLUE_ALLIANCE',
    reputation: 5200,
    tax_rate: 10,
    description: 'Balanslı oyun tarzı, PvE ve PvP',
    recruitment_status: 'selective',
    requirements: 'IP 1000+, mükemmel reputasyon',
    focus: ['PvE', 'Crafting', 'Trade'],
    achievements: [
      { name: 'Craft Masters', description: '10M+ crafting fame', date: '2023-12-01' },
      { name: 'Trade Empire', description: '100M+ ticaret hacmi', date: '2024-01-20' }
    ]
  },
  {
    id: 'GUILD_GAMMA',
    name: 'Gamma Raiders',
    tag: '[GAMMA]',
    founded: '2022-06-10',
    members: 89,
    active_members: 67,
    territory_count: 5,
    total_kills: 23456,
    total_deaths: 12345,
    kd_ratio: 1.90,
    alliance: null,
    reputation: 3200,
    tax_rate: 20,
    description: 'Ganking ve solo PvP uzmanı',
    recruitment_status: 'closed',
    requirements: 'IP 1200+, PvP kanıtı',
    focus: ['Ganking', 'Solo PvP', 'HCE'],
    achievements: [
      { name: 'Gank Lords', description: '5000+ solo kill', date: '2024-02-14' }
    ]
  }
]

const ALLIANCE_DATA = [
  {
    name: 'RED_ALLIANCE',
    tag: 'RED',
    guilds: ['GUILD_ALPHA', 'GUILD_DELTA', 'GUILD_EPSILON'],
    total_members: 567,
    total_territory: 28,
    dominance_score: 8900,
    color: '#ef4444'
  },
  {
    name: 'BLUE_ALLIANCE',
    tag: 'BLUE',
    guilds: ['GUILD_BETA', 'GUILD_ZETA', 'GUILD_ETA'],
    total_members: 789,
    total_territory: 35,
    dominance_score: 9500,
    color: '#3b82f6'
  }
]

const TERRITORY_DATA = [
  { zone: 'Caerleon', owner: 'GUILD_ALPHA', tax_rate: 15, value: 'High', resources: ['Stone', 'Metal'] },
  { zone: 'Thetford', owner: 'GUILD_BETA', tax_rate: 10, value: 'Medium', resources: ['Fiber', 'Wood'] },
  { zone: 'Bridgewatch', owner: 'GUILD_GAMMA', tax_rate: 20, value: 'Low', resources: ['Ore', 'Hide'] },
  { zone: 'Lymhurst', owner: 'GUILD_ALPHA', tax_rate: 15, value: 'High', resources: ['Wood', 'Fiber'] },
  { zone: 'Martlock', owner: 'GUILD_BETA', tax_rate: 10, value: 'Medium', resources: ['Ore', 'Stone'] }
]

const COLORS = ['#ef4444', '#f5c842', '#10b981', '#3b82f6', '#8b5cf6', '#f97316']

export default function GuildManagementPage() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedGuild, setSelectedGuild] = useState(GUILD_DATA[0])
  const [showApplications, setShowApplications] = useState(false)

  const getReputationColor = (rep) => {
    if (rep >= 5000) return '#10b981'
    if (rep >= 3000) return '#f5c842'
    if (rep >= 1000) return '#f97316'
    return '#ef4444'
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return '#10b981'
      case 'selective': return '#f5c842'
      case 'closed': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{ padding: '1.5rem', minHeight: '100vh', background: '#0d0f14' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#f5c842', fontSize: 28, fontWeight: 700, margin: 0 }}>
          Klan Yönetimi
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
          Klan bilgileri, ittifaklar ve bölge yönetimi
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {['overview', 'guilds', 'alliances', 'territories', 'applications'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{
              background: selectedTab === tab ? '#f5c842' : '#1a1d29',
              color: selectedTab === tab ? '#0d0f14' : '#94a3b8',
              border: selectedTab === tab ? '1px solid #f5c842' : '1px solid #2a2f3e',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: selectedTab === tab ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab === 'overview' && 'Genel Bakış'}
            {tab === 'guilds' && 'Klanlar'}
            {tab === 'alliances' && 'İttifaklar'}
            {tab === 'territories' && 'Bölgeler'}
            {tab === 'applications' && 'Başvurular'}
          </button>
        ))}
      </div>

      {selectedTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Klan İstatistikleri
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {[
                { label: 'Toplam Klan', value: GUILD_DATA.length },
                { label: 'Toplam Üye', value: GUILD_DATA.reduce((sum, g) => sum + g.members, 0) },
                { label: 'Aktif Üye', value: GUILD_DATA.reduce((sum, g) => sum + g.active_members, 0) },
                { label: 'Toplam Bölge', value: GUILD_DATA.reduce((sum, g) => sum + g.territory_count, 0) },
                { label: 'Ortalama K/D', value: (GUILD_DATA.reduce((sum, g) => sum + g.kd_ratio, 0) / GUILD_DATA.length).toFixed(2) },
                { label: 'Toplam Kill', value: GUILD_DATA.reduce((sum, g) => sum + g.total_kills, 0) }
              ].map((stat, idx) => (
                <div key={idx} style={{ background: '#0d0f14', border: '1px solid #2a2f3e', borderRadius: 8, padding: '12px' }}>
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>{stat.label}</div>
                  <div style={{ color: '#e2e8f0', fontSize: 18, fontWeight: 700 }}>{stat.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Aktivite Grafiği
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={GUILD_DATA.map(g => ({ name: g.tag, members: g.members, active: g.active_members }))}>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="members" stroke="#f5c842" strokeWidth={2} />
                <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedTab === 'guilds' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Klan Detayları
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {GUILD_DATA.map(guild => (
              <div key={guild.id} style={{ 
                background: '#0d0f14', 
                border: '1px solid #2a2f3e', 
                borderRadius: 8, 
                padding: '1.5rem',
                borderLeft: `4px solid ${guild.alliance ? ALLIANCE_DATA.find(a => a.name === guild.alliance)?.color : '#6b7280'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <h3 style={{ color: '#f5c842', fontSize: 18, fontWeight: 700, margin: 0 }}>
                        {guild.name}
                      </h3>
                      <span style={{ 
                        background: '#2a2f3e', 
                        color: '#94a3b8', 
                        padding: '4px 8px', 
                        borderRadius: 4,
                        fontSize: 12
                      }}>
                        {guild.tag}
                      </span>
                    </div>
                    <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>{guild.description}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                      <span>Kuruluş: {guild.founded}</span>
                      <span>İttifak: {guild.alliance || 'Bağımsız'}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      background: getStatusColor(guild.recruitment_status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      marginBottom: 8
                    }}>
                      {guild.recruitment_status === 'open' ? 'Açık' : guild.recruitment_status === 'selective' ? 'Seçici' : 'Kapalı'}
                    </div>
                    <div style={{ color: getReputationColor(guild.reputation), fontSize: 12, fontWeight: 600 }}>
                      Rep: {guild.reputation.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Üyeler</div>
                    <div style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>{guild.members}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Aktif</div>
                    <div style={{ color: '#10b981', fontSize: 14, fontWeight: 600 }}>{guild.active_members}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Bölgeler</div>
                    <div style={{ color: '#f5c842', fontSize: 14, fontWeight: 600 }}>{guild.territory_count}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>K/D</div>
                    <div style={{ color: '#f97316', fontSize: 14, fontWeight: 600 }}>{guild.kd_ratio}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: '#f5c842', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Odak Alanlar</h4>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {guild.focus.map(focus => (
                      <span key={focus} style={{
                        background: '#2a2f3e',
                        color: '#94a3b8',
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 11
                      }}>
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#f5c842', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Başvuru Şartları</h4>
                  <div style={{ color: '#94a3b8', fontSize: 12 }}>{guild.requirements}</div>
                </div>

                <div>
                  <h4 style={{ color: '#f5c842', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Başarılar</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {guild.achievements.map((achievement, idx) => (
                      <div key={idx} style={{ 
                        background: '#1a1d29', 
                        border: '1px solid #2a2f3e', 
                        borderRadius: 6, 
                        padding: '8px' 
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600 }}>{achievement.name}</div>
                            <div style={{ color: '#64748b', fontSize: 11 }}>{achievement.description}</div>
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: 11 }}>{achievement.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'alliances' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            İttifaklar
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {ALLIANCE_DATA.map(alliance => (
              <div key={alliance.name} style={{ 
                background: '#0d0f14', 
                border: `2px solid ${alliance.color}`, 
                borderRadius: 8, 
                padding: '1rem' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ 
                    width: 16, 
                    height: 16, 
                    background: alliance.color, 
                    borderRadius: 4 
                  }}></div>
                  <h3 style={{ color: alliance.color, fontSize: 16, fontWeight: 700, margin: 0 }}>
                    {alliance.tag} Alliance
                  </h3>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4 }}>
                  <div>Klanlar: {alliance.guilds.length}</div>
                  <div>Toplam Üye: {alliance.total_members.toLocaleString()}</div>
                  <div>Bölge Sayısı: {alliance.total_territory}</div>
                  <div>Hakimiyet Skoru: {alliance.dominance_score.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'territories' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Bölge Kontrolü
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {TERRITORY_DATA.map(territory => (
              <div key={territory.zone} style={{ 
                background: '#0d0f14', 
                border: '1px solid #2a2f3e', 
                borderRadius: 8, 
                padding: '1rem' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, margin: 0 }}>
                    {territory.zone}
                  </h3>
                  <span style={{ 
                    background: '#2a2f3e', 
                    color: '#94a3b8', 
                    padding: '2px 6px', 
                    borderRadius: 4,
                    fontSize: 10
                  }}>
                    {territory.value}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                  <div>Sahip: <span style={{ color: '#f5c842' }}>{territory.owner}</span></div>
                  <div>Vergi Oranı: <span style={{ color: '#ef4444' }}>{territory.tax_rate}%</span></div>
                  <div>Kaynaklar: <span style={{ color: '#10b981' }}>{territory.resources.join(', ')}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'applications' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Klan Başvuruları
          </h2>
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setShowApplications(!showApplications)}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              {showApplications ? 'Başvuruları Gizle' : 'Başvuruları Göster'}
            </button>
          </div>

          {showApplications && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { player: 'Player123', guild: 'GUILD_ALPHA', status: 'pending', date: '2024-03-15', ip: 850, focus: 'PvP' },
                { player: 'ProPlayer', guild: 'GUILD_BETA', status: 'accepted', date: '2024-03-14', ip: 1200, focus: 'Crafting' },
                { player: 'NoobMaster', guild: 'GUILD_GAMMA', status: 'rejected', date: '2024-03-13', ip: 450, focus: 'PvE' }
              ].map((app, idx) => (
                <div key={idx} style={{ 
                  background: '#0d0f14', 
                  border: '1px solid #2a2f3e', 
                  borderRadius: 8, 
                  padding: '12px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{app.player}</div>
                      <div style={{ color: '#64748b', fontSize: 11 }}>IP: {app.ip} • {app.focus}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#f5c842', fontSize: 12 }}>{app.guild}</div>
                      <div style={{ 
                        color: app.status === 'accepted' ? '#10b981' : app.status === 'rejected' ? '#ef4444' : '#f5c842',
                        fontSize: 11,
                        fontWeight: 600
                      }}>
                        {app.status === 'accepted' ? 'Kabul' : app.status === 'rejected' ? 'Red' : 'Beklemede'}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: 10 }}>{app.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
