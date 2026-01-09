'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Lock, Sparkles } from 'lucide-react'
import { getAllBadges } from '@/lib/achievements/badge-definitions'

export default function AchievementsGallery({ userId }) {
  const [userBadges, setUserBadges] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [badgesRes, statsRes] = await Promise.all([
        fetch('/api/achievements', { credentials: 'include' }),
        fetch('/api/dashboard/stats', { credentials: 'include' })
      ])

      if (badgesRes.ok) {
        const data = await badgesRes.json()
        setUserBadges(data.badges || [])
      }

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    )
  }

  const allBadges = getAllBadges()
  const unlockedIds = userBadges.map(b => b.badgeId)

  const getBadgeProgress = (badge) => {
    if (!stats) return null

    const progressMap = {
      'first-solve': { current: stats.solvedProblems, target: 1, type: 'problems' },
      'problem-solver-50': { current: stats.solvedProblems, target: 50, type: 'problems' },
      'problem-solver-100': { current: stats.solvedProblems, target: 100, type: 'problems' },
      'streak-7': { current: stats.currentStreak, target: 7, type: 'days' },
      'streak-30': { current: stats.currentStreak, target: 30, type: 'days' }
    }

    return progressMap[badge.id] || null
  }

  const getBadgeColor = (color) => {
    const colors = {
      blue: 'from-blue-400 to-blue-600',
      green: 'from-green-400 to-green-600',
      purple: 'from-purple-400 to-purple-600',
      orange: 'from-orange-400 to-orange-600',
      yellow: 'from-yellow-400 to-yellow-600',
      pink: 'from-pink-400 to-pink-600',
      indigo: 'from-indigo-400 to-indigo-600',
      gold: 'from-yellow-500 to-orange-600'
    }
    return colors[color] || 'from-gray-400 to-gray-600'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-yellow-600" />
          <h2 className="text-2xl font-bold">
            {unlockedIds.length} / {allBadges.length} Badges Earned
          </h2>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {Math.round((unlockedIds.length / allBadges.length) * 100)}% Complete
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allBadges.map((badge) => {
          const isUnlocked = unlockedIds.includes(badge.id)
          const progress = getBadgeProgress(badge)
          const userBadge = userBadges.find(b => b.badgeId === badge.id)

          return (
            <Card
              key={badge.id}
              className={`p-6 transition-all duration-300 ${
                isUnlocked
                  ? 'border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 hover:shadow-xl'
                  : 'hover:shadow-md opacity-75'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-lg mb-4 ${
                    isUnlocked
                      ? `bg-gradient-to-br ${getBadgeColor(badge.color)}`
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {isUnlocked ? badge.icon : <Lock className="h-12 w-12 text-gray-400" />}
                </div>

                <h3 className="text-xl font-bold mb-2">{badge.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {badge.description}
                </p>

                {isUnlocked ? (
                  <div className="w-full">
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                      <Sparkles className="h-4 w-4" />
                      <span>Unlocked</span>
                    </div>
                    {userBadge && (
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(userBadge.unlockedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                ) : progress ? (
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{progress.current} / {progress.target} {progress.type}</span>
                      <span className="font-bold">
                        {Math.round((progress.current / progress.target) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(progress.current / progress.target) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {progress.target - progress.current} more to unlock
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Lock className="h-4 w-4" />
                    <span>Locked</span>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
