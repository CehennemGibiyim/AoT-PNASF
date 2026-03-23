import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const AI_PREDICTIONS = {
  market: [
    { item: 'T8_BOW', current_price: 4500000, predicted_price: 4800000, confidence: 85, trend: 'up' },
    { item: 'T8_STAFF', current_price: 3200000, predicted_price: 2900000, confidence: 72, trend: 'down' },
    { item: 'T8_ARMOR_PLATE', current_price: 2800000, predicted_price: 3100000, confidence: 78, trend: 'up' },
    { item: 'T8_2H_AXE', current_price: 5200000, predicted_price: 5400000, confidence: 91, trend: 'up' },
    { item: 'T8_MOUNT_HORSE', current_price: 1800000, predicted_price: 1700000, confidence: 65, trend: 'down' }
  ],
  build_optimization: [
    { role: 'Tank', weapon: 'Guardian Staff', armor: 'Heavy Plate', effectiveness: 92 },
    { role: 'Healer', weapon: 'Holy Staff', armor: 'Cloth', effectiveness: 88 },
    { role: 'DPS', weapon: 'Dagger Pair', armor: 'Leather', effectiveness: 95 },
    { role: 'Support', weapon: 'Nature Staff', armor: 'Leather', effectiveness: 85 },
    { role: 'Ganker', weapon: 'Bow', armor: 'Leather', effectiveness: 90 }
  ],
  pvp_analysis: [
    { zone: 'Red Zone', win_rate: 65, avg_fame: 45000, risk_level: 'High' },
    { zone: 'Black Zone', win_rate: 42, avg_fame: 89000, risk_level: 'Extreme' },
    { zone: 'Yellow Zone', win_rate: 78, avg_fame: 12000, risk_level: 'Medium' },
    { zone: 'Blue Zone', win_rate: 92, avg_fame: 3000, risk_level: 'Low' }
  ],
  gathering_efficiency: [
    { resource: 'Ore', efficiency: 85, best_zone: 'Mountain', best_time: 'Night' },
    { resource: 'Fiber', efficiency: 78, best_zone: 'Forest', best_time: 'Morning' },
    { resource: 'Hide', efficiency: 82, best_zone: 'Swamp', best_time: 'Evening' },
    { resource: 'Wood', efficiency: 88, best_zone: 'Forest', best_time: 'Afternoon' },
    { resource: 'Stone', efficiency: 75, best_zone: 'Mountain', best_time: 'Night' },
    { resource: 'Rock', efficiency: 80, best_zone: 'Mountain', best_time: 'Morning' }
  ]
}

const AI_INSIGHTS = [
  {
    type: 'market',
    title: 'Piyasa Fırsatı',
    description: 'T8 Bows fiyatları 24 saat içinde %6.7 artacak. Şimdi satın alıp sonra satmak için iyi fırsat.',
    urgency: 'High',
    confidence: 85
  },
  {
    type: 'pvp',
    title: 'PvP Stratejisi',
    description: 'Black Zone\'de saat 20:00-22:00 arası ZVZ aktivitesi %45 artıyor. Parti hazırlamanız önerilir.',
    urgency: 'Medium',
    confidence: 72
  },
  {
    type: 'gathering',
    title: 'Toplama Optimizasyonu',
    description: 'Thetford yakınlarında fiber toplama verimliliği bu gece %32 artacak. Ekipman hazırlayın.',
    urgency: 'Low',
    confidence: 68
  },
  {
    type: 'dungeon',
    title: 'Dungeon Fırsatı',
    description: 'Avalon Road dungeonlarında bu akşam player density %25 daha düşük. Solo farming için ideal zaman.',
    urgency: 'Medium',
    confidence: 79
  }
]

const COLORS = ['#ef4444', '#f5c842', '#10b981', '#3b82f6', '#8b5cf6', '#f97316']

export default function AIAnalyticsPage() {
  const [selectedTab, setSelectedTab] = useState('predictions')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const simulateAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'High': return '#ef4444'
      case 'Medium': return '#f5c842'
      case 'Low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return '#10b981'
    if (confidence >= 60) return '#f5c842'
    return '#ef4444'
  }

  const formatSilver = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return value.toString()
  }

  return (
    <div style={{ padding: '1.5rem', minHeight: '100vh', background: '#0d0f14' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h1 style={{ color: '#f5c842', fontSize: 28, fontWeight: 700, margin: 0 }}>
            Yapay Zeka Analizleri
          </h1>
          <button
            onClick={simulateAnalysis}
            disabled={isAnalyzing}
            style={{
              background: isAnalyzing ? '#2a2f3e' : '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: 13,
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span style={{ 
              display: 'inline-block',
              width: 16,
              height: 16,
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: isAnalyzing ? 'spin 1s linear infinite' : 'none'
            }}></span>
            {isAnalyzing ? 'Analiz Ediliyor...' : 'Yeni Analiz Başlat'}
          </button>
        </div>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
          AI destekli piyasa tahminleri, build optimizasyonları ve stratejik öneriler
        </p>
      </div>

      {isAnalyzing && (
        <div style={{ 
          background: '#1a1d29', 
          border: '1px solid #2a2f3e', 
          borderRadius: 8, 
          padding: '12px', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{ color: '#8b5cf6', fontSize: 12 }}>AI Analizi:</span>
          <div style={{ 
            flex: 1, 
            height: 6, 
            background: '#2a2f3e', 
            borderRadius: 3,
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${analysisProgress}%`,
              height: '100%',
              background: '#8b5cf6',
              transition: 'width 0.2s ease'
            }}></div>
          </div>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>{analysisProgress}%</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {['predictions', 'insights', 'builds', 'pvp', 'gathering'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{
              background: selectedTab === tab ? '#8b5cf6' : '#1a1d29',
              color: selectedTab === tab ? 'white' : '#94a3b8',
              border: selectedTab === tab ? '1px solid #8b5cf6' : '1px solid #2a2f3e',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: selectedTab === tab ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab === 'predictions' && 'Tahminler'}
            {tab === 'insights' && 'İçgörüler'}
            {tab === 'builds' && 'Buildler'}
            {tab === 'pvp' && 'PvP'}
            {tab === 'gathering' && 'Toplama'}
          </button>
        ))}
      </div>

      {selectedTab === 'predictions' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#8b5cf6', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Piyasa Tahminleri
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {AI_PREDICTIONS.market.map((item, idx) => (
              <div key={idx} style={{ 
                background: '#0d0f14', 
                border: '1px solid #2a2f3e', 
                borderRadius: 8, 
                padding: '12px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{item.item}</div>
                  <div style={{ 
                    background: getConfidenceColor(item.confidence),
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 10
                  }}>
                    {item.confidence}%
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: 11 }}>Mevcut</div>
                    <div style={{ color: '#e2e8f0', fontSize: 12 }}>{formatSilver(item.current_price)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#94a3b8', fontSize: 11 }}>Tahmin</div>
                    <div style={{ 
                      color: item.trend === 'up' ? '#10b981' : '#ef4444',
                      fontSize: 12,
                      fontWeight: 600
                    }}>
                      {item.trend === 'up' ? '↑' : '↓'} {formatSilver(item.predicted_price)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'insights' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#8b5cf6', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            AI İçgörüleri
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {AI_INSIGHTS.map((insight, idx) => (
              <div key={idx} style={{ 
                background: '#0d0f14', 
                border: '1px solid #2a2f3e', 
                borderRadius: 8, 
                padding: '16px',
                borderLeft: `4px solid ${getUrgencyColor(insight.urgency)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ color: '#8b5cf6', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                      {insight.title}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>
                      {insight.description}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <div style={{ 
                      background: getUrgencyColor(insight.urgency),
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 10
                    }}>
                      {insight.urgency}
                    </div>
                    <div style={{ 
                      background: getConfidenceColor(insight.confidence),
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 10
                    }}>
                      {insight.confidence}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'builds' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#8b5cf6', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Build Optimizasyonları
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={AI_PREDICTIONS.build_optimization}>
              <PolarGrid stroke="#2a2f3e" />
              <PolarAngleAxis dataKey="role" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Radar name="Etkinlik" dataKey="effectiveness" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Tooltip
                contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '1rem' }}>
            {AI_PREDICTIONS.build_optimization.map((build, idx) => (
              <div key={idx} style={{ background: '#0d0f14', border: '1px solid #2a2f3e', borderRadius: 8, padding: '12px' }}>
                <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{build.role}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                  <div>Weapon: <span style={{ color: '#e2e8f0' }}>{build.weapon}</span></div>
                  <div>Armor: <span style={{ color: '#e2e8f0' }}>{build.armor}</span></div>
                  <div>Etkinlik: <span style={{ color: '#10b981' }}>{build.effectiveness}%</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'pvp' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#8b5cf6', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            PvP Analizleri
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={AI_PREDICTIONS.pvp_analysis}>
              <XAxis dataKey="zone" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
              />
              <Bar dataKey="win_rate" fill="#10b981" />
              <Bar dataKey="avg_fame" fill="#f5c842" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {selectedTab === 'gathering' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#8b5cf6', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Toplama Verimliliği
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={AI_PREDICTIONS.gathering_efficiency}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ resource, efficiency }) => `${resource}: ${efficiency}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="efficiency"
              >
                {AI_PREDICTIONS.gathering_efficiency.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '1rem' }}>
            {AI_PREDICTIONS.gathering_efficiency.map((resource, idx) => (
              <div key={idx} style={{ background: '#0d0f14', border: '1px solid #2a2f3e', borderRadius: 8, padding: '12px' }}>
                <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{resource.resource}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                  <div>Verimlilik: <span style={{ color: '#10b981' }}>{resource.efficiency}%</span></div>
                  <div>En İyi Bölge: <span style={{ color: '#e2e8f0' }}>{resource.best_zone}</span></div>
                  <div>En İyi Zaman: <span style={{ color: '#e2e8f0' }}>{resource.best_time}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
