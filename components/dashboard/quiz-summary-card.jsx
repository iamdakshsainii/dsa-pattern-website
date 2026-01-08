'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, ArrowRight, Award } from "lucide-react"

export default function QuizSummaryCard({ userId }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchQuizStats()
    }
  }, [userId])

  async function fetchQuizStats() {
    try {
      const res = await fetch('/api/profile/activities', {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        const quizData = data.data?.quizAnalytics || data.quizAnalytics || {}

        setStats({
          totalAttempts: quizData.totalQuizzesTaken || 0,
          passed: quizData.passedQuizzes || 0,
          failed: quizData.failedQuizzes || 0,
          avgScore: quizData.averageScore || 0,
          masteredRoadmaps: quizData.masteredRoadmaps || 0,
          recentQuizzes: quizData.recentQuizzes || []
        })
      }
    } catch (error) {
      console.error('Failed to fetch quiz stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    )
  }

  if (!stats || stats.totalAttempts === 0) {
    return (
      <Card className="p-6 hover:shadow-lg transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Quiz Performance</h3>
              <p className="text-sm text-muted-foreground">No attempts yet</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Complete a roadmap to unlock quizzes and earn certificates
        </p>

        <Link href="/roadmaps">
          <Button variant="outline" className="w-full">
            Browse Roadmaps
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </Card>
    )
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <Trophy className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Quiz Performance</h3>
            <p className="text-sm text-muted-foreground">
              {stats.totalAttempts} total attempt{stats.totalAttempts !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {stats.masteredRoadmaps > 0 && (
          <Badge className="bg-green-600 text-white">
            <Award className="h-3 w-3 mr-1" />
            {stats.masteredRoadmaps} Mastered
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
          <div className="text-xs text-muted-foreground">Passed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-xs text-muted-foreground">Failed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.avgScore}%</div>
          <div className="text-xs text-muted-foreground">Avg Score</div>
        </div>
      </div>

      {stats.recentQuizzes && stats.recentQuizzes.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Latest:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{stats.recentQuizzes[0].roadmapTitle || 'Recent Quiz'}</span>
              <Badge variant={stats.recentQuizzes[0].passed ? "default" : "destructive"} className="text-xs">
                {stats.recentQuizzes[0].percentage}%
              </Badge>
            </div>
          </div>
        </div>
      )}

      <Link href="/activity/quizzes">
        <Button variant="outline" className="w-full">
          View All Activity
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </Card>
  )
}
