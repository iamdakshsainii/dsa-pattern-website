'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MapPin, PlayCircle, TrendingUp, CheckCircle2 } from 'lucide-react'

export default function SmartRoadmapWidget({ userId }) {
  const [activeRoadmaps, setActiveRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActiveRoadmaps()

    const interval = setInterval(fetchActiveRoadmaps, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchActiveRoadmaps = async () => {
    try {
      const response = await fetch('/api/roadmaps/user/active', {
        credentials: 'include',
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setActiveRoadmaps(data.activeRoadmaps || [])
      }
    } catch (error) {
      console.error('Failed to fetch roadmaps:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    )
  }

  if (activeRoadmaps.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
        <div className="text-center py-6">
          <MapPin className="h-12 w-12 text-purple-400 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Start Your Journey</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose a roadmap to begin structured learning
          </p>
          <Link href="/roadmaps">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Browse Roadmaps
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  const primaryRoadmap = activeRoadmaps[0]
  const progressPercent = Math.round(primaryRoadmap.overallProgress || 0)
  const isNearComplete = progressPercent >= 90
  const completedNodes = primaryRoadmap.nodesProgress?.filter(n => n.status === 'completed').length || 0

  return (
    <Card className="p-6 border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Active Roadmap</h3>
        </div>
        {activeRoadmaps.length > 1 && (
          <Badge variant="secondary">{activeRoadmaps.length} active</Badge>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="text-4xl flex-shrink-0">{primaryRoadmap.roadmap?.icon || '📚'}</span>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-lg mb-1 truncate">
              {primaryRoadmap.roadmap?.title || 'Learning Roadmap'}
            </h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>{completedNodes} nodes completed</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-bold text-blue-600">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            {isNearComplete && (
              <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-200">
                🔥 Almost there! Complete to unlock the quiz
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link href={`/roadmaps/${primaryRoadmap.roadmapId}`} className="block">
            <Button className="w-full" size="sm">
              <PlayCircle className="h-4 w-4 mr-2" />
              Continue Learning
            </Button>
          </Link>
          <Link href="/roadmaps" className="block">
            <Button variant="outline" className="w-full" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {activeRoadmaps.length > 1 && (
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">Other Active:</p>
            <div className="space-y-1">
              {activeRoadmaps.slice(1, 3).map((roadmap) => (
                <Link
                  key={roadmap.roadmapId}
                  href={`/roadmaps/${roadmap.roadmapId}`}
                  className="flex items-center gap-2 p-2 rounded hover:bg-accent text-sm transition-colors"
                >
                  <span>{roadmap.roadmap?.icon}</span>
                  <span className="truncate flex-1">{roadmap.roadmap?.title}</span>
                  <span className="text-xs text-muted-foreground">{Math.round(roadmap.overallProgress)}%</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
