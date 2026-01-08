'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Lock, Sparkles, ArrowRight } from 'lucide-react'
import { getAllBadges, checkBadgeUnlock } from '@/lib/achievements/badge-definitions'
import { getBadgeColor } from '@/lib/achievements/badge-checker'

export default function AchievementShowcase({ stats }) {
  const [userBadges, setUserBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [nextBadge, setNextBadge] = useState(null)

  useEffect(() => {
    fetchUserBadges()

    const interval = setInterval(fetchUserBadges, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (stats && userBadges.length >= 0) {
      findNextBadge()
    }
  }, [stats, userBadges])

  const fetchUserBadges = async () => {
    try {
      const response = await fetch('/api/achievements', {
        credentials: 'include',
        cache: 'no-store'
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

  const findNextBadge = () => {
    if (!stats) return

    const allBadges = getAllBadges()
    const unlockedIds = userBadges.map(b => b.badgeId)

    const progressTrackable = [
      {
        badge: allBadges.find(b => b.id === 'problem-solver-50'),
        current: stats.solvedProblems || 0,
        target: 50,
        type: 'problems'
      },
      {
        badge: allBadges.find(b => b.id === 'streak-7'),
        current: stats.currentStreak || 0,
        target: 7,
        type: 'days'
      },
      {
        badge: allBadges.find(b => b.id === 'streak-30'),
        current: stats.currentStreak || 0,
        target: 30,
        type: 'days'
      },
      {
        badge: allBadges.find(b => b.id === 'problem-solver-100'),
        current: stats.solvedProblems || 0,
        target: 100,
        type: 'problems'
      }
    ]

    const candidates = progressTrackable
      .filter(item => item.badge && !unlockedIds.includes(item.badge.id) && item.current < item.target)
      .sort((a, b) => {
        const progressA = (a.current / a.target) * 100
        const progressB = (b.current / b.target) * 100
        return progressB - progressA
      })

    if (candidates.length > 0) {
      setNextBadge(candidates[0])
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </Card>
    )
  }

  const allBadges = getAllBadges()
  const unlockedCount = userBadges.length

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold">Achievements</h3>
        </div>
        <Badge variant="outline">
          {unlockedCount}/{allBadges.length}
        </Badge>
      </div>

      {nextBadge ? (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-3xl shadow-lg">
              {nextBadge.badge.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Next Achievement</span>
              </div>
              <h4 className="font-bold text-lg mb-1">{nextBadge.badge.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">{nextBadge.badge.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {nextBadge.current} / {nextBadge.target} {nextBadge.type}
                  </span>
                  <span className="font-bold text-purple-600">
                    {Math.round((nextBadge.current / nextBadge.target) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(nextBadge.current / nextBadge.target) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {nextBadge.target - nextBadge.current} more to unlock! 🎯
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : unlockedCount === 0 ? (
        <div className="text-center py-8">
          <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-2">No badges yet</p>
          <p className="text-gray-400 text-xs">
            Start solving problems to unlock achievements!
          </p>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-3">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h4 className="font-bold text-lg mb-1">All Caught Up! 🎉</h4>
          <p className="text-sm text-muted-foreground mb-4">
            You've unlocked {unlockedCount} achievements
          </p>
        </div>
      )}

      <Link href="/achievements">
        <Button variant="outline" className="w-full mt-4" size="sm">
          View All Badges
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </Card>
  )
}
