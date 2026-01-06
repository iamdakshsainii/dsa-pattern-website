'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, TrendingUp, Target, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function QuizSummaryWidget() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchQuizStats()
  }, [])

  const fetchQuizStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use the comprehensive activities API instead of basic stats
      const response = await fetch('/api/profile/activities', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }

      const result = await response.json()

      // Handle response format
      if (result.success && result.data) {
        setData(result.data)
      } else if (result.quizAnalytics) {
        // Legacy format
        setData(result)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Failed to fetch quiz stats:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className="p-6 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Unable to Load Quiz Data</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button size="sm" variant="outline" onClick={fetchQuizStats}>
          Try Again
        </Button>
      </Card>
    )
  }

  // Extract quiz analytics safely
  const quizAnalytics = data?.quizAnalytics || {}
  const recentQuizzes = quizAnalytics.recentQuizzes || []

  const stats = {
    totalAttempts: quizAnalytics.totalQuizzesTaken || 0,
    passed: quizAnalytics.totalPassed || 0,
    averageScore: quizAnalytics.averageScore || 0
  }

  // Empty state - no quizzes taken
  if (stats.totalAttempts === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-600" />
          Quiz Progress
        </h3>
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            Complete roadmap lessons to unlock quizzes
          </p>
          <Link href="/roadmaps">
            <Button size="sm">Explore Roadmaps</Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-600" />
          Quiz Progress
        </h3>
        <Link href="/profile/quiz-history">
          <Button size="sm" variant="ghost">View All</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-1">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.passed}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Passed</p>
        </div>

        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.averageScore}%
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Avg Score</p>
        </div>

        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-1">
            <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.totalAttempts}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Attempts</p>
        </div>
      </div>

      {/* Recent Quizzes */}
      {recentQuizzes.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Recent Quizzes
          </p>
          <div className="space-y-2">
            {recentQuizzes.slice(0, 3).map((quiz, idx) => (
              <Link
                key={quiz._id || idx}
                href={`/roadmaps/${quiz.roadmapId}/quiz/result/${quiz._id}`}
                className="block p-3 rounded-lg hover:bg-accent transition-colors border hover:border-blue-300 dark:hover:border-blue-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-2xl flex-shrink-0">{quiz.roadmapIcon || "📚"}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {quiz.roadmapTitle || quiz.roadmapId?.replace(/-/g, ' ') || 'Quiz'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="font-semibold">{quiz.percentage || 0}%</span>
                        <span>•</span>
                        <span>
                          {new Date(quiz.completedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={quiz.passed ? "default" : "destructive"}
                    className="ml-2 flex-shrink-0"
                  >
                    {quiz.passed ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 space-y-2">
        <Link href="/profile/activities">
          <Button variant="outline" className="w-full" size="sm">
            View Activity Dashboard
          </Button>
        </Link>
        <Link href="/roadmaps">
          <Button variant="secondary" className="w-full" size="sm">
            Browse Roadmaps
          </Button>
        </Link>
      </div>
    </Card>
  )
}
