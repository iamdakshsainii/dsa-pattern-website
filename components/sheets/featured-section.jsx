import BattleCard from './battle-card'

export default function FeaturedSection({ sheets }) {
  const featured = [
    { name: 'Blind 75', badge: '🥇 MOST POPULAR' },
    { name: 'NeetCode 150', badge: '⚡ BALANCED' },
    { name: 'Striver A2Z DSA', badge: '📚 COMPREHENSIVE' }
  ]

  const featuredSheets = featured.map(f => {
    const sheet = sheets.find(s => s.name === f.name)
    return sheet ? { ...sheet, badge: f.badge } : null
  }).filter(Boolean)

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">⭐ Top Picks</h2>
        <p className="text-sm text-gray-600">Most chosen by students</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {featuredSheets.map(sheet => (
          <BattleCard key={sheet.name} sheet={sheet} featured />
        ))}
      </div>
    </div>
  )
}
