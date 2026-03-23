import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const PERSONAL_STATS = {
  overview: {
    total_kills: 1247,
    total_deaths: 892,
    total_fame: 4567890,
    total_silver_earned: 89234567,
    total_silver_lost: 12345678,
    playtime_hours: 342,
    avg_ip: 1150,
    current_ip: 1278,
    guild_rank: 3,
    global_rank: 1247
  },
  pvp_performance: [
    { season: 'Winter 2024', kills: 456, deaths: 234, kd_ratio: 1.95, fame_gained: 1234567, best_kill_streak: 12 },
    { season: 'Fall 2024', kills: 678, deaths: 456, kd_ratio: 1.49, fame_gained: 2345678, best_kill_streak: 18 },
    { season: 'Summer 2024', kills: 892, deaths: 678, kd_ratio: 1.32, fame_gained: 3456789, best_kill_streak: 25 }
  ],
  weapon_mastery: [
    { weapon: 'Sword', kills: 234, deaths: 123, accuracy: 78.5, avg_damage: 450, mastery_level: 85 },
    { weapon: 'Bow', kills: 189, deaths: 156, accuracy: 82.3, avg_damage: 380, mastery_level: 72 },
    { weapon: 'Fire Staff', kills: 167, deaths: 145, accuracy: 75.8, avg_damage: 520, mastery_level: 68 },
    { weapon: 'Dagger Pair', kills: 298, deaths: 234, accuracy: 85.2, avg_damage: 380, mastery_level: 91 },
    { weapon: 'Axe', kills: 123, deaths: 98, accuracy: 71.4, avg_damage: 680, mastery_level: 64 }
  ],
  gathering_stats: {
    ore: { total_gathered: 1234567, hourly_rate: 450, best_zone: 'Mountain', best_hour: 'Night' },
    fiber: { total_gathered: 987654, hourly_rate: 380, best_zone: 'Forest', best_hour: 'Morning' },
    hide: { total_gathered: 876543, hourly_rate: 320, best_zone: 'Swamp', best_hour: 'Evening' },
    wood: { total_gathered: 2345678, hourly_rate: 520, best_zone: 'Forest', best_hour: 'Afternoon' },
    stone: { total_gathered: 654321, hourly_rate: 280, best_zone: 'Mountain', best_hour: 'Night' },
    rock: { total_gathered: 543210, hourly_rate: 240, best_zone: 'Mountain', best_hour: 'Morning' }
  },
  crafting_stats: {
    total_crafted: 1234,
    successful_crafts: 1189,
    failed_crafts: 45,
    total_resources_spent: 23456789,
    total_item_value: 34567890,
    profit_margin: 47.3,
    favorite_crafting: 'T8_Weapons',
    crafting_mastery: {
      'Warrior': 85,
      'Hunter': 72,
      'Mage': 68,
      'Toolmaker': 91
    }
  },
  dungeon_performance: [
    { dungeon: 'Avalon Road', runs: 234, successful_runs: 189, avg_time: 45, best_time: 28, death_rate: 19.2 },
    { dungeon: 'Hellgate 5v5', runs: 156, successful_runs: 89, avg_time: 35, best_time: 22, death_rate: 42.9 },
    { dungeon: 'Corrupted Dungeon', runs: 445, successful_runs: 389, avg_time: 18, best_time: 12, death_rate: 12.6 },
    { dungeon: 'Mists', runs: 678, successful_runs: 567, avg_time: 28, best_time: 15, death_rate: 16.4 }
  ]
}

const COLORS = ['#ef4444', '#f5c842', '#10b981', '#3b82f6', '#8b5cf6', '#f97316']

export default function PersonalStatsPage() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('all')
  const [showComparison, setShowComparison] = useState(false)

  const getPerformanceColor = (value) => {
    if (value >= 80) return '#10b981'
    if (value >= 60) return '#f5c842'
    if (value >= 40) return '#f97316'
    return '#ef4444'
  }

  const formatNumber = (num) => {
    return num.toLocaleString()
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}s ${mins}dk`
  }

  return (
    <div style={{ padding: '1.5rem', minHeight: '100vh', background: '#0d0f14' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#f5c842', fontSize: 28, fontWeight: 700, margin: 0 }}>
          Kişisel İstatistikler ve PvP Takibi
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
          Detaylı kişisel performans analizi, silah ustalığı ve dungeon rekorları
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {['overview', 'pvp', 'weapons', 'gathering', 'crafting', 'dungeons'].map(tab => (
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
            {tab === 'pvp' && 'PvP Performans'}
            {tab === 'weapons' && 'Silah Ustalığı'}
            {tab === 'gathering' && 'Toplama İstatistikleri'}
            {tab === 'crafting' && 'Crafting Analizi'}
            {tab === 'dungeons' && 'Dungeon Rekorları'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            background: '#1a1d29',
            color: '#e2e8f0',
            border: '1px solid #2a2f3e',
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: 12
          }}
        >
          <option value="all">Tüm Zaman</option>
          <option value="season">Sezonluk</option>
          <option value="month">Aylık</option>
          <option value="week">Haftalık</option>
        </select>
        <button
          onClick={() => setShowComparison(!showComparison)}
          style={{
            background: showComparison ? '#8b5cf6' : '#1a1d29',
            color: showComparison ? 'white' : '#94a3b8',
            border: showComparison ? '1px solid #8b5cf6' : '1px solid #2a2f3e',
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          {showComparison ? 'Karşılaştırmayı Gizle' : 'Karşılaştırma Modu'}
        </button>
      </div>

      {selectedTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Toplam Kill', value: formatNumber(PERSONAL_STATS.overview.total_kills), color: '#ef4444' },
            { label: 'Toplam Ölüm', value: formatNumber(PERSONAL_STATS.overview.total_deaths), color: '#f5c842' },
            { label: 'K/D Oranı', value: PERSONAL_STATS.overview.total_kills / PERSONAL_STATS.overview.total_deaths, color: '#10b981' },
            { label: 'Toplam Fame', value: formatNumber(PERSONAL_STATS.overview.total_fame), color: '#8b5cf6' },
            { label: 'Kazanılan Gümüş', value: formatNumber(PERSONAL_STATS.overview.total_silver_earned), color: '#f5c842' },
            { label: 'Kaybedilen Gümüş', value: formatNumber(PERSONAL_STATS.overview.total_silver_lost), color: '#ef4444' },
            { label: 'Oyun Süresi', value: formatTime(PERSONAL_STATS.overview.playtime_hours), color: '#3b82f6' },
            { label: 'Mevcut IP', value: PERSONAL_STATS.overview.current_ip, color: '#f97316' },
            { label: 'Klan Sırası', value: `#${PERSONAL_STATS.overview.guild_rank}`, color: '#8b5cf6' },
            { label: 'Global Sıra', value: `#${PERSONAL_STATS.overview.global_rank}`, color: '#f5c842' }
          ].map((stat, idx) => (
            <div key={idx} style={{ 
              background: '#1a1d29', 
              border: '1px solid #2a2f3e', 
              borderRadius: 8, 
              padding: '1rem' 
            }}>
              <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{stat.label}</div>
              <div style={{ color: stat.color, fontSize: 18, fontWeight: 700 }}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'pvp' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Sezonluk Performans
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={PERSONAL_STATS.pvp_performance.map(season => ({
                season: season.season,
                kills: season.kills,
                deaths: season.deaths,
                kd: season.kd_ratio,
                fame: season.fame_gained
              }))}>
                <XAxis dataKey="season" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="kills" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="deaths" stroke="#f5c842" strokeWidth={2} />
                <Line type="monotone" dataKey="kd" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="fame" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              PvP Başarıları
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {PERSONAL_STATS.pvp_performance.map((season, idx) => (
                <div key={idx} style={{ 
                  background: '#0d0f14', 
                  border: '1px solid #2a2f3e', 
                  borderRadius: 8, 
                  padding: '12px' 
                }}>
                  <h3 style={{ color: '#f5c842', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{season.season}</h3>
                  <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                    <div><strong>Kill:</strong> {season.kills}</div>
                    <div><strong>Ölüm:</strong> {season.deaths}</div>
                    <div><strong>K/D:</strong> <span style={{ color: getPerformanceColor(season.kd_ratio * 100) }}>{season.kd_ratio}</span></div>
                    <div><strong>Fame:</strong> {formatNumber(season.fame_gained)}</div>
                    <div><strong>En İyi Kill Serisi:</strong> {season.best_kill_streak}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'weapons' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Silah Ustalığı
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={PERSONAL_STATS.weapon_mastery.map(weapon => ({
                weapon: weapon.weapon,
                accuracy: weapon.accuracy,
                damage: weapon.avg_damage,
                mastery: weapon.mastery_level
              }))}>
                <PolarGrid stroke="#2a2f3e" />
                <PolarAngleAxis dataKey="weapon" tick={{ fill: '#64748b', fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="Doğruluk" dataKey="accuracy" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Radar name="Hasar" dataKey="damage" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                <Radar name="Ustalık" dataKey="mastery" stroke="#f5c842" fill="#f5c842" fillOpacity={0.6} />
                <Tooltip
                  contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Detaylı İstatistikler
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PERSONAL_STATS.weapon_mastery.map((weapon, idx) => (
                <div key={idx} style={{ 
                  background: '#0d0f14', 
                  border: '1px solid #2a2f3e', 
                  borderRadius: 8, 
                  padding: '12px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>{weapon.weapon}</div>
                    <div style={{ 
                      background: getPerformanceColor(weapon.mastery_level),
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 10
                    }}>
                      Lv.{weapon.mastery_level}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                    <div><strong>Kill:</strong> {weapon.kills}</div>
                    <div><strong>Ölüm:</strong> {weapon.deaths}</div>
                    <div><strong>Doğruluk:</strong> {weapon.accuracy}%</div>
                    <div><strong>Ortalama Hasar:</strong> {weapon.avg_damage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'gathering' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Toplama İstatistikleri
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(PERSONAL_STATS.gathering_stats).map(([resource, data]) => ({
                    name: resource,
                    value: data.total_gathered,
                    hourly_rate: data.hourly_rate
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatNumber(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(PERSONAL_STATS.gathering_stats).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Detaylı Bilgiler
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {Object.entries(PERSONAL_STATS.gathering_stats).map(([resource, data]) => (
                <div key={resource} style={{ 
                  background: '#0d0f14', 
                  border: '1px solid #2a2f3e', 
                  borderRadius: 8, 
                  padding: '12px' 
                }}>
                  <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 8, textTransform: 'capitalize' }}>{resource}</h3>
                  <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                    <div><strong>Toplam:</strong> {formatNumber(data.total_gathered)}</div>
                    <div><strong>Saatlik:</strong> {data.hourly_rate}</div>
                    <div><strong>En İyi Bölge:</strong> {data.best_zone}</div>
                    <div><strong>En İyi Saat:</strong> {data.best_hour}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'crafting' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Crafting Analizi
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '1rem' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Toplam Üretim</div>
                <div style={{ color: '#e2e8f0', fontSize: 18, fontWeight: 700 }}>{PERSONAL_STATS.crafting_stats.total_crafted}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Başarılı Oran</div>
                <div style={{ color: '#10b981', fontSize: 18, fontWeight: 700 }}>
                  {((PERSONAL_STATS.crafting_stats.successful_crafts / PERSONAL_STATS.crafting_stats.total_crafted) * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Kâr Marjı</div>
                <div style={{ color: '#f5c842', fontSize: 18, fontWeight: 700 }}>{PERSONAL_STATS.crafting_stats.profit_margin}%</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Toplam Değer</div>
                <div style={{ color: '#e2e8f0', fontSize: 18, fontWeight: 700 }}>{formatNumber(PERSONAL_STATS.crafting_stats.total_item_value)}</div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Crafting Ustalığı</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={Object.entries(PERSONAL_STATS.crafting_stats.crafting_mastery).map(([profession, level]) => ({
                  profession: profession,
                  mastery: level
                }))}>
                  <XAxis dataKey="profession" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
                  />
                  <Bar dataKey="mastery" fill="#f5c842" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'dungeons' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Dungeon Rekorları
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={PERSONAL_STATS.dungeon_performance.map(dungeon => ({
                dungeon: dungeon.dungeon,
                runs: dungeon.runs,
                success_rate: (dungeon.successful_runs / dungeon.runs * 100),
                avg_time: dungeon.avg_time,
                best_time: dungeon.best_time
              }))}>
                <XAxis dataKey="dungeon" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
                />
                <Bar dataKey="success_rate" fill="#10b981" />
                <Bar dataKey="avg_time" fill="#f5c842" />
                <Bar dataKey="best_time" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Detaylı Performans
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PERSONAL_STATS.dungeon_performance.map((dungeon, idx) => (
                <div key={idx} style={{ 
                  background: '#0d0f14', 
                  border: '1px solid #2a2f3e', 
                  borderRadius: 8, 
                  padding: '12px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>{dungeon.dungeon}</div>
                    <div style={{ 
                      background: getPerformanceColor(dungeon.successful_runs / dungeon.runs * 100),
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 10
                    }}>
                      {(dungeon.successful_runs / dungeon.runs * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                    <div><strong>Toplam Deneme:</strong> {dungeon.runs}</div>
                    <div><strong>Başarılı:</strong> {dungeon.successful_runs}</div>
                    <div><strong>Ortalama Süre:</strong> {dungeon.avg_time}dk</div>
                    <div><strong>En İyi Süre:</strong> {dungeon.best_time}dk</div>
                    <div><strong>Ölüm Oranı:</strong> {dungeon.death_rate}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
