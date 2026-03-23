import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const FARMING_DATA = {
  resources: [
    { name: 'Ore', base_yield: 100, premium_yield: 150, focus_bonus: 50, best_zone: 'Mountain', best_time: 'Night', tool_bonus: 25 },
    { name: 'Fiber', base_yield: 100, premium_yield: 150, focus_bonus: 50, best_zone: 'Forest', best_time: 'Morning', tool_bonus: 25 },
    { name: 'Hide', base_yield: 100, premium_yield: 150, focus_bonus: 50, best_zone: 'Swamp', best_time: 'Evening', tool_bonus: 25 },
    { name: 'Wood', base_yield: 100, premium_yield: 150, focus_bonus: 50, best_zone: 'Forest', best_time: 'Afternoon', tool_bonus: 25 },
    { name: 'Stone', base_yield: 100, premium_yield: 150, focus_bonus: 50, best_zone: 'Mountain', best_time: 'Night', tool_bonus: 25 },
    { name: 'Rock', base_yield: 100, premium_yield: 150, focus_bonus: 50, best_zone: 'Mountain', best_time: 'Morning', tool_bonus: 25 }
  ],
  zones: [
    { name: 'Mountain', ore_bonus: 25, fiber_bonus: -10, hide_bonus: 5, wood_bonus: -15, stone_bonus: 30, rock_bonus: 35, danger: 'High' },
    { name: 'Forest', ore_bonus: -20, fiber_bonus: 30, hide_bonus: 10, wood_bonus: 35, stone_bonus: -10, rock_bonus: -15, danger: 'Medium' },
    { name: 'Swamp', ore_bonus: -10, fiber_bonus: 5, hide_bonus: 35, wood_bonus: 10, stone_bonus: 5, rock_bonus: -5, danger: 'Medium' },
    { name: 'Steppe', ore_bonus: 15, fiber_bonus: 20, hide_bonus: 15, wood_bonus: 20, stone_bonus: 10, rock_bonus: 5, danger: 'Low' }
  ],
  tools: [
    { name: 'T8_Pick', ore_bonus: 50, other_bonus: 10, durability: 500 },
    { name: 'T8_Sickle', fiber_bonus: 50, other_bonus: 10, durability: 500 },
    { name: 'T8_Skinning_Knife', hide_bonus: 50, other_bonus: 10, durability: 500 },
    { name: 'T8_Axe', wood_bonus: 50, other_bonus: 10, durability: 500 },
    { name: 'T8_Hammer', stone_bonus: 50, other_bonus: 10, durability: 500 },
    { name: 'T8_Pickaxe', rock_bonus: 50, other_bonus: 10, durability: 500 }
  ],
  focus_efficiency: [
    { level: 0, efficiency: 100, cost: 0 },
    { level: 100, efficiency: 150, cost: 10000 },
    { level: 200, efficiency: 200, cost: 25000 },
    { level: 300, efficiency: 250, cost: 45000 },
    { level: 400, efficiency: 300, cost: 70000 },
    { level: 500, efficiency: 350, cost: 100000 }
  ]
}

const FARMING_PLANS = [
  {
    id: 'plan_1',
    name: 'Ore Farming Planı',
    target_resource: 'Ore',
    target_amount: 10000,
    duration_hours: 8,
    zone: 'Mountain',
    tool: 'T8_Pick',
    focus_level: 400,
    expected_yield: 3500,
    profit_estimate: 2500000,
    difficulty: 'Hard'
  },
  {
    id: 'plan_2',
    name: 'Fiber Farming Planı',
    target_resource: 'Fiber',
    target_amount: 5000,
    duration_hours: 6,
    zone: 'Forest',
    tool: 'T8_Sickle',
    focus_level: 300,
    expected_yield: 2250,
    profit_estimate: 1800000,
    difficulty: 'Medium'
  },
  {
    id: 'plan_3',
    name: 'Balanced Farming',
    target_resource: 'Mixed',
    target_amount: 8000,
    duration_hours: 10,
    zone: 'Steppe',
    tool: 'T8_Multi_Tool',
    focus_level: 200,
    expected_yield: 4000,
    profit_estimate: 2000000,
    difficulty: 'Easy'
  }
]

const COLORS = ['#ef4444', '#f5c842', '#10b981', '#3b82f6', '#8b5cf6', '#f97316']

export default function FarmingCalculatorPage() {
  const [selectedTab, setSelectedTab] = useState('calculator')
  const [selectedResource, setSelectedResource] = useState(FARMING_DATA.resources[0])
  const [selectedZone, setSelectedZone] = useState(FARMING_DATA.zones[0])
  const [selectedTool, setSelectedTool] = useState(FARMING_DATA.tools[0])
  const [focusLevel, setFocusLevel] = useState(100)
  const [farmingPlans, setFarmingPlans] = useState(FARMING_PLANS)
  const [customPlan, setCustomPlan] = useState({
    name: '',
    target_resource: 'Ore',
    target_amount: 1000,
    duration_hours: 4,
    zone: 'Mountain',
    tool: 'T8_Pick',
    focus_level: 100
  })

  const calculateYield = () => {
    const baseYield = selectedResource.base_yield
    const zoneBonus = selectedZone[`${selectedResource.name.toLowerCase()}_bonus`] || 0
    const toolBonus = selectedTool[`${selectedResource.name.toLowerCase()}_bonus`] || 0
    const focusMultiplier = FARMING_DATA.focus_efficiency.find(f => f.level === focusLevel)?.efficiency || 100
    
    return Math.floor(baseYield * (1 + zoneBonus/100) * (1 + toolBonus/100) * (focusMultiplier/100))
  }

  const calculateProfit = (harvest, resource) => {
    const basePrice = {
      'Ore': 500,
      'Fiber': 300,
      'Hide': 400,
      'Wood': 250,
      'Stone': 200,
      'Rock': 350
    }
    return harvest * (basePrice[resource] || 300)
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Hard': return '#ef4444'
      case 'Medium': return '#f5c842'
      case 'Easy': return '#10b981'
      default: return '#6b7280'
    }
  }

  const addCustomPlan = () => {
    if (customPlan.name && customPlan.target_amount > 0) {
      const newPlan = {
        ...customPlan,
        id: `custom_${Date.now()}`,
        expected_yield: calculateYield(),
        profit_estimate: calculateProfit(calculateYield(), customPlan.target_resource),
        difficulty: customPlan.zone === 'Mountain' ? 'Hard' : customPlan.zone === 'Forest' ? 'Medium' : 'Easy'
      }
      setFarmingPlans([...farmingPlans, newPlan])
      setCustomPlan({
        name: '',
        target_resource: 'Ore',
        target_amount: 1000,
        duration_hours: 4,
        zone: 'Mountain',
        tool: 'T8_Pick',
        focus_level: 100
      })
    }
  }

  const currentYield = calculateYield()
  const currentProfit = calculateProfit(currentYield, selectedResource.name)

  return (
    <div style={{ padding: '1.5rem', minHeight: '100vh', background: '#0d0f14' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#f5c842', fontSize: 28, fontWeight: 700, margin: 0 }}>
          Farming Calculator ve Resource Planner
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
          Verimlilik hesaplayıcısı, farming planları ve kaynak optimizasyonu
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {['calculator', 'plans', 'optimizer'].map(tab => (
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
            {tab === 'calculator' && 'Hesaplayıcı'}
            {tab === 'plans' && 'Planlar'}
            {tab === 'optimizer' && 'Optimizatör'}
          </button>
        ))}
      </div>

      {selectedTab === 'calculator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Farming Hesaplayıcısı
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Kaynak Seçimi</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {FARMING_DATA.resources.map(resource => (
                  <button
                    key={resource.name}
                    onClick={() => setSelectedResource(resource)}
                    style={{
                      background: selectedResource.name === resource.name ? '#f5c842' : '#0d0f14',
                      color: selectedResource.name === resource.name ? '#0d0f14' : '#e2e8f0',
                      border: selectedResource.name === resource.name ? '1px solid #f5c842' : '1px solid #2a2f3e',
                      borderRadius: 6,
                      padding: '8px',
                      fontSize: 11,
                      cursor: 'pointer'
                    }}
                  >
                    {resource.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Bölge Seçimi</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {FARMING_DATA.zones.map(zone => (
                  <button
                    key={zone.name}
                    onClick={() => setSelectedZone(zone)}
                    style={{
                      background: selectedZone.name === zone.name ? '#f5c842' : '#0d0f14',
                      color: selectedZone.name === zone.name ? '#0d0f14' : '#e2e8f0',
                      border: selectedZone.name === zone.name ? '1px solid #f5c842' : '1px solid #2a2f3e',
                      borderRadius: 6,
                      padding: '8px',
                      fontSize: 11,
                      cursor: 'pointer'
                    }}
                  >
                    {zone.name}
                    <div style={{ fontSize: 10, color: '#64748b' }}>
                      {zone.danger} Risk
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Alet Seçimi</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {FARMING_DATA.tools.map(tool => (
                  <button
                    key={tool.name}
                    onClick={() => setSelectedTool(tool)}
                    style={{
                      background: selectedTool.name === tool.name ? '#f5c842' : '#0d0f14',
                      color: selectedTool.name === tool.name ? '#0d0f14' : '#e2e8f0',
                      border: selectedTool.name === tool.name ? '1px solid #f5c842' : '1px solid #2a2f3e',
                      borderRadius: 6,
                      padding: '8px',
                      fontSize: 11,
                      cursor: 'pointer'
                    }}
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Focus Seviyesi</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={focusLevel}
                  onChange={(e) => setFocusLevel(parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ color: '#f5c842', fontSize: 14, fontWeight: 600, minWidth: 60 }}>
                  {focusLevel} ({FARMING_DATA.focus_efficiency.find(f => f.level === focusLevel)?.efficiency || 100}%)
                </span>
              </div>
            </div>

            <div style={{ 
              background: '#0d0f14', 
              border: '1px solid #2a2f3e', 
              borderRadius: 8, 
              padding: '1rem',
              marginBottom: '1.5rem' 
            }}>
              <h3 style={{ color: '#f5c842', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Hesaplama Sonuçları</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Beklenen Verim</div>
                  <div style={{ color: '#10b981', fontSize: 16, fontWeight: 700 }}>{currentYield.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Tahmini Kâr</div>
                  <div style={{ color: '#f5c842', fontSize: 16, fontWeight: 700 }}>{currentProfit.toLocaleString()} Silver</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Verimlilik Detayları
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{selectedResource.name} Bonusları</h3>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                <div><strong>Beklenen Hasat:</strong> {currentYield.toLocaleString()}</div>
                <div><strong>Tahmini Kâr:</strong> {currentProfit.toLocaleString()} Silver</div>
                <div><strong>Temel Verim:</strong> {selectedResource.base_yield}%</div>
                <div><strong>Premium Verim:</strong> {selectedResource.premium_yield}%</div>
                <div><strong>Focus Bonus:</strong> +{selectedResource.focus_bonus}%</div>
                <div><strong>En İyi Bölge:</strong> {selectedResource.best_zone}</div>
                <div><strong>En İyi Zaman:</strong> {selectedResource.best_time}</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{selectedZone.name} Bölge Bonusları</h3>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                <div><strong>Ore Bonus:</strong> {selectedZone.ore_bonus > 0 ? `+${selectedZone.ore_bonus}%` : `${selectedZone.ore_bonus}%`}</div>
                <div><strong>Fiber Bonus:</strong> {selectedZone.fiber_bonus > 0 ? `+${selectedZone.fiber_bonus}%` : `${selectedZone.fiber_bonus}%`}</div>
                <div><strong>Hide Bonus:</strong> {selectedZone.hide_bonus > 0 ? `+${selectedZone.hide_bonus}%` : `${selectedZone.hide_bonus}%`}</div>
                <div><strong>Wood Bonus:</strong> {selectedZone.wood_bonus > 0 ? `+${selectedZone.wood_bonus}%` : `${selectedZone.wood_bonus}%`}</div>
                <div><strong>Stone Bonus:</strong> {selectedZone.stone_bonus > 0 ? `+${selectedZone.stone_bonus}%` : `${selectedZone.stone_bonus}%`}</div>
                <div><strong>Rock Bonus:</strong> {selectedZone.rock_bonus > 0 ? `+${selectedZone.rock_bonus}%` : `${selectedZone.rock_bonus}%`}</div>
                <div><strong>Risk Seviyesi:</strong> <span style={{ color: getDifficultyColor(selectedZone.danger) }}>{selectedZone.danger}</span></div>
              </div>
            </div>

            <div>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{selectedTool.name} Alet Bonusları</h3>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                <div><strong>Açık Bonus:</strong> +{selectedTool[`${selectedResource.name.toLowerCase()}_bonus`] || selectedTool.other_bonus}%</div>
                <div><strong>Dayanıklılık:</strong> {selectedTool.durability}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'plans' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Farming Planları
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Özel Plan Oluştur</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, marginBottom: 4 }}>Plan Adı</label>
                <input
                  type="text"
                  value={customPlan.name}
                  onChange={(e) => setCustomPlan(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    background: '#0d0f14',
                    color: '#e2e8f0',
                    border: '1px solid #2a2f3e',
                    borderRadius: 4,
                    padding: '6px 8px',
                    fontSize: 12,
                    width: '100%'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, marginBottom: 4 }}>Hedef Miktar</label>
                <input
                  type="number"
                  value={customPlan.target_amount}
                  onChange={(e) => setCustomPlan(prev => ({ ...prev, target_amount: parseInt(e.target.value) }))}
                  style={{
                    background: '#0d0f14',
                    color: '#e2e8f0',
                    border: '1px solid #2a2f3e',
                    borderRadius: 4,
                    padding: '6px 8px',
                    fontSize: 12,
                    width: '100%'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, marginBottom: 4 }}>Süre (Saat)</label>
                <input
                  type="number"
                  value={customPlan.duration_hours}
                  onChange={(e) => setCustomPlan(prev => ({ ...prev, duration_hours: parseInt(e.target.value) }))}
                  style={{
                    background: '#0d0f14',
                    color: '#e2e8f0',
                    border: '1px solid #2a2f3e',
                    borderRadius: 4,
                    padding: '6px 8px',
                    fontSize: 12,
                    width: '100%'
                  }}
                />
              </div>
              <div>
                <button
                  onClick={addCustomPlan}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontSize: 12,
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Plan Ekle
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {[...FARMING_PLANS, ...farmingPlans].map(plan => (
              <div key={plan.id} style={{ 
                background: '#0d0f14', 
                border: '1px solid #2a2f3e', 
                borderRadius: 8, 
                padding: '1rem' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ color: '#f5c842', fontSize: 14, fontWeight: 600, margin: 0 }}>
                    {plan.name}
                  </h3>
                  <span style={{ 
                    background: getDifficultyColor(plan.difficulty),
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 10
                  }}>
                    {plan.difficulty}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                  <div><strong>Hedef:</strong> {plan.target_amount} {plan.target_resource}</div>
                  <div><strong>Süre:</strong> {plan.duration_hours} saat</div>
                  <div><strong>Bölge:</strong> {plan.zone}</div>
                  <div><strong>Alet:</strong> {plan.tool}</div>
                  <div><strong>Focus:</strong> Level {plan.focus_level}</div>
                  <div><strong>Beklenen Verim:</strong> {plan.expected_yield.toLocaleString()}</div>
                  <div><strong>Tahmini Kâr:</strong> {plan.profit_estimate.toLocaleString()} Silver</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'optimizer' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Farming Optimizatörü
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Focus Verimliliği</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={FARMING_DATA.focus_efficiency}>
                  <XAxis dataKey="level" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
                  />
                  <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                <div><strong>Optimal Focus:</strong> 400-500 seviyesi arası</div>
                <div><strong>Maliyet/Fayda Oranı:</strong> En iyi 300-400 seviyesinde</div>
              </div>
            </div>

            <div>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Bölge Karşılaştırması</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={FARMING_DATA.zones.map(zone => ({
                  zone: zone.name,
                  'Ore': zone.ore_bonus,
                  'Fiber': zone.fiber_bonus,
                  'Hide': zone.hide_bonus,
                  'Wood': zone.wood_bonus,
                  'Stone': zone.stone_bonus,
                  'Rock': zone.rock_bonus
                }))}>
                  <XAxis dataKey="zone" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
                  />
                  <Bar dataKey="Ore" fill="#f97316" />
                  <Bar dataKey="Fiber" fill="#10b981" />
                  <Bar dataKey="Hide" fill="#8b5cf6" />
                  <Bar dataKey="Wood" fill="#f5c842" />
                  <Bar dataKey="Stone" fill="#ef4444" />
                  <Bar dataKey="Rock" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Zaman Optimizasyonu</h3>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                <div><strong>Sabah (6:00-12:00):</strong> Fiber ve Wood için ideal</div>
                <div><strong>Öğlen (12:00-18:00):</strong> Tüm kaynaklar için iyi</div>
                <div><strong>Akşam (18:00-24:00):</strong> Ore ve Stone için en iyi</div>
                <div><strong>Gece (0:00-6:00):</strong> Ore ve Rock için optimal</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
