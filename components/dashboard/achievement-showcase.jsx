'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Lock } from 'lucide-react'
import { getAllBadges, getBadgeById } from '@/lib/achievements/badge-definitions'
import { getBadgeColor } from '@/lib/achievements/badge-checker'

export default function AchievementShowcase({ stats }) {
  const [userBadges, setUserBadges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserBadges()
  }, [])

  const fetchUserBadges = async () => {
    try {
      const response = await fetch('/api/achievements', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setUserBadges(data.badges || [])
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoading(false)
    }
  }

  const allBadges = getAllBadges()
  const unlockedBadgeIds = userBadges.map(b => b.badgeId)

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold">Achievements</h3>
        </div>
        <Badge variant="outline">
          {unlockedBadgeIds.length}/{allBadges.length}
        </Badge>
      </div>

      {unlockedBadgeIds.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-2">No badges yet</p>
          <p className="text-gray-400 text-xs">
            Start solving problems to unlock achievements!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {allBadges.slice(0, 8).map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id)
            const unlockedBadge = userBadges.find(b => b.badgeId === badge.id)

            return (
              <div
                key={badge.id}
                className={`relative p-3 rounded-lg border-2 transition-all ${
                  isUnlocked
                    ? `${getBadgeColor(badge.color)} hover:shadow-md cursor-pointer`
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-50'
                }`}
                title={badge.description}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 rounded-lg">
                    <Lock className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="text-center">
                  <div className="text-3xl mb-1">{badge.icon}</div>
                  <p className="text-xs font-semibold truncate">
                    {badge.name}
                  </p>
                  {isUnlocked && unlockedBadge && (
                    <p className="text-[10px] text-gray-500 mt-1">
                      {new Date(unlockedBadge.unlockedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {allBadges.length > 8 && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          Showing {Math.min(8, allBadges.length)} of {allBadges.length} badges
        </p>
      )}
    </Card>
  )
}
