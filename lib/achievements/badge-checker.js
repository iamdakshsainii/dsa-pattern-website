import { getNewlyUnlockedBadges, getBadgeById } from './badge-definitions'

export async function checkAndUnlockBadges(userId, stats) {
  try {
    // Get user's current badges
    const response = await fetch('/api/achievements', {
      credentials: 'include'
    })

    if (!response.ok) return []

    const data = await response.json()
    const userBadges = data.badges || []

    // Check for newly unlocked badges
    const newBadges = getNewlyUnlockedBadges(stats, userBadges)

    // Save newly unlocked badges to database
    for (const badge of newBadges) {
      await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ badgeId: badge.id })
      })
    }

    return newBadges
  } catch (error) {
    console.error('Error checking badges:', error)
    return []
  }
}

export function getBadgeColor(color) {
  const colors = {
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    orange: 'bg-orange-100 text-orange-700 border-orange-300',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    green: 'bg-green-100 text-green-700 border-green-300',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    gold: 'bg-yellow-200 text-yellow-800 border-yellow-400',
    pink: 'bg-pink-100 text-pink-700 border-pink-300'
  }
  return colors[color] || colors.blue
}
