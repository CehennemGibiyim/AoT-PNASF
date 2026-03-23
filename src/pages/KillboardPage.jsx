import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const KILLBOARD_DATA = {
  recentKills: [
    { id: 1, victim: 'Player123', killer: 'WarriorX', guild: 'GUILD_A', value: 450000, item: 'T8_BOW', time: '2 dk önce', location: 'Caerleon' },
    { id: 2, victim: 'NoobMaster', killer: 'ProSlayer', guild: 'GUILD_B', value: 1200000, item: 'T8_2H_AXE', time: '5 dk önce', location: 'Black Market' },
    { id: 3, victim: 'CraftyJoe', killer: 'GankSquad', guild: 'GUILD_C', value: 890000, item: 'T8_ARMOR_LEATHER', time: '8 dk önce', location: 'Thetford' },
    { id: 4, victim: 'TraderBob', killer: 'HighwayMan', guild: 'SOLO', value: 2300000, item: 'T7_MOUNT_HORSE', time: '12 dk önce', location: 'Forest Cross' },
    { id: 5, victim: 'MinerMike', killer: 'GankTeam', guild: 'GUILD_D', value: 340000, item: 'T8_PICK', time: '15 dk önce', location: 'Mountain Pass' }
  ],
  hourlyStats: [
    { hour: '00:00', kills: 45, deaths: 32, fame: 125000 },
    { hour: '04:00', kills: 28, deaths: 41, fame: 89000 },
    { hour: '08:00', kills: 67, deaths: 58, fame: 234000 },
    { hour: '12:00', kills: 89, deaths: 76, fame: 456000 },
    { hour: '16:00', kills: 123, deaths: 98, fame: 678000 },
    { hour: '20:00', kills: 156, deaths: 134, fame: 890000 },
    { hour: '23:00', kills: 98, deaths: 87, fame: 567000 }
  ],
  topGuilds: [
    { name: 'GUILD_A', kills: 1234, deaths: 876, kd: 1.41, members: 45 },
    { name: 'GUILD_B', kills: 987, deaths: 654, kd: 1.51, members: 38 },
    { name: 'GUILD_C', kills: 876, deaths: 543, kd: 1.61, members: 42 },
    { name: 'GUILD_D', kills: 765, deaths: 432, kd: 1.77, members: 35 },
    { name: 'GUILD_E', kills: 654, deaths: 321, kd: 2.04, members: 28 }
  ],
  weaponStats: [
    { weapon: 'Sword', kills: 2345, percentage: 28 },
    { weapon: 'Bow', kills: 1876, percentage: 22 },
    { weapon: 'Staff', kills: 1567, percentage: 19 },
    { weapon: 'Axe', kills: 1234, percentage: 15 },
    { weapon: 'Dagger', kills: 987, percentage: 12 },
    { weapon: 'Other', kills: 432, percentage: 4 }
  ],
  zoneStats: [
    { zone: 'Red Zone', kills: 3456, danger: 'High' },
    { zone: 'Black Zone', kills: 2876, danger: 'Extreme' },
    { zone: 'Yellow Zone', kills: 1234, danger: 'Medium' },
    { zone: 'Blue Zone', kills: 456, danger: 'Low' }
  ]
}

const COLORS = ['#ef4444', '#f5c842', '#10b981', '#3b82f6', '#8b5cf6', '#f97316']

export default function KillboardPage() {
  const [selectedTab, setSelectedTab] = useState('recent')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [realTimeKills, setRealTimeKills] = useState(KILLBOARD_DATA.recentKills)
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Simulate real-time kill data
      const newKill = {
        id: Date.now(),
        victim: `Player${Math.floor(Math.random() * 9999)}`,
        killer: `Killer${Math.floor(Math.random() * 999)}`,
        guild: `GUILD_${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        value: Math.floor(Math.random() * 3000000) + 100000,
        item: `T${7 + Math.floor(Math.random() * 2)}_${['SWORD', 'BOW', 'STAFF', 'AXE'][Math.floor(Math.random() * 4)]}`,
        time: 'Az önce',
        location: ['Caerleon', 'Thetford', 'Bridgewatch', 'Lymhurst', 'Martlock'][Math.floor(Math.random() * 5)]
      }

      setRealTimeKills(prev => [newKill, ...prev.slice(0, 9)])
    }, 5000)

    return () => clearInterval(interval)
  }, [isLive])

  const formatSilver = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return value.toString()
  }

  const getDangerColor = (danger) => {
    switch(danger) {
      case 'Extreme': return '#ef4444'
      case 'High': return '#f97316'
      case 'Medium': return '#f5c842'
      case 'Low': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{ padding: '1.5rem', minHeight: '100vh', background: '#0d0f14' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h1 style={{ color: '#f5c842', fontSize: 28, fontWeight: 700, margin: 0 }}>
            PvP Killboard
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ 
                width: 8, height: 8, background: isLive ? '#10b981' : '#ef4444', 
                borderRadius: '50%', animation: isLive ? 'pulse 2s infinite' : 'none' 
              }}></div>
              <span style={{ color: '#94a3b8', fontSize: 12 }}>
                {isLive ? 'Canlı' : 'Duraklatıldı'}
              </span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              style={{
                background: isLive ? '#ef4444' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              {isLive ? 'Duraklat' : 'Devam Et'}
            </button>
          </div>
        </div>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
          Gerçek zamanlı PvP verileri ve killboard istatistikleri
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {['recent', 'hourly', 'guilds', 'weapons', 'zones'].map(tab => (
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
            {tab === 'recent' && 'Son Killler'}
            {tab === 'hourly' && 'Saatlik'}
            {tab === 'guilds' && 'Klanlar'}
            {tab === 'weapons' && 'Silahlar'}
            {tab === 'zones' && 'Bölgeler'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          style={{
            background: '#1a1d29',
            color: '#e2e8f0',
            border: '1px solid #2a2f3e',
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: 12
          }}
        >
          <option value="all">Tüm Bölgeler</option>
          <option value="americas">Americas</option>
          <option value="europe">Europe</option>
          <option value="asia">Asia</option>
        </select>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: '#64748b', fontSize: 12 }}>Filtreler:</span>
          {['ZVZ', 'Solo', 'Ganking', 'HCE', 'Avalon'].map(filter => (
            <button
              key={filter}
              style={{
                background: '#2a2f3e',
                color: '#94a3b8',
                border: '1px solid #2a2f3e',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 11,
                cursor: 'pointer'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {selectedTab === 'recent' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Son Killler ({realTimeKills.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {realTimeKills.map(kill => (
              <div
                key={kill.id}
                style={{
                  background: '#0d0f14',
                  border: '1px solid #2a2f3e',
                  borderRadius: 8,
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ color: '#ef4444', fontSize: 13, fontWeight: 600 }}>
                      {kill.killer} → {kill.victim}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
                      [{kill.guild}] • {kill.location} • {kill.time}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#f5c842', fontSize: 13, fontWeight: 600 }}>
                    {formatSilver(kill.value)} G
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 11 }}>
                    {kill.item}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'hourly' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Saatlik PvP Aktivitesi
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={KILLBOARD_DATA.hourlyStats}>
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Line type="monotone" dataKey="kills" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="deaths" stroke="#f5c842" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {selectedTab === 'guilds' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Top Klanlar
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {KILLBOARD_DATA.topGuilds.map(guild => (
              <div key={guild.name} style={{ background: '#0d0f14', border: '1px solid #2a2f3e', borderRadius: 8, padding: '12px' }}>
                <div style={{ color: '#f5c842', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                  {guild.name}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                  <div>Kills: <span style={{ color: '#ef4444' }}>{guild.kills}</span></div>
                  <div>Deaths: <span style={{ color: '#f5c842' }}>{guild.deaths}</span></div>
                  <div>K/D: <span style={{ color: '#10b981' }}>{guild.kd}</span></div>
                  <div>Üyeler: {guild.members}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'weapons' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Silah İstatistikleri
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={KILLBOARD_DATA.weaponStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ weapon, percentage }) => `${weapon}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="kills"
              >
                {KILLBOARD_DATA.weaponStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {selectedTab === 'zones' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Bölge İstatistikleri
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={KILLBOARD_DATA.zoneStats}>
              <XAxis dataKey="zone" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
              />
              <Bar dataKey="kills" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {KILLBOARD_DATA.zoneStats.map(zone => (
              <div key={zone.zone} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 12, height: 12, background: getDangerColor(zone.danger),
                  borderRadius: 2
                }}></div>
                <span style={{ color: '#94a3b8', fontSize: 11 }}>
                  {zone.zone}: {zone.danger}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
