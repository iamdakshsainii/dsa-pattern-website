'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Clock, TrendingUp, CheckCircle2, XCircle, Award, ArrowLeft, RotateCcw, Eye } from "lucide-react"

export default function QuizHistoryClient({ results, roadmaps, userId }) {
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRoadmap, setFilterRoadmap] = useState("all")

  // Safely create roadmap lookup map
  const roadmapMap = {}
  if (Array.isArray(roadmaps)) {
    roadmaps.forEach(r => {
      if (r && r.slug) {
        roadmapMap[r.slug] = r
      }
    })
  }

  // Safely enrich results with roadmap data
  const enrichedResults = Array.isArray(results) ? results.map(result => ({
    ...result,
    roadmapTitle: roadmapMap[result.roadmapId]?.title || result.roadmapId?.replace(/-/g, ' ') || 'Unknown Roadmap',
    roadmapIcon: roadmapMap[result.roadmapId]?.icon || "📚"
  })) : []

  // Filter results
  const filteredResults = enrichedResults.filter(result => {
    if (filterStatus === "passed" && !result.passed) return false
    if (filterStatus === "failed" && result.passed) return false
    if (filterRoadmap !== "all" && result.roadmapId !== filterRoadmap) return false
    return true
  })

  // Group by roadmap
  const groupedByRoadmap = {}
  filteredResults.forEach(result => {
    if (!groupedByRoadmap[result.roadmapId]) {
      groupedByRoadmap[result.roadmapId] = []
    }
    groupedByRoadmap[result.roadmapId].push(result)
  })

  // Sort attempts within each roadmap (newest first)
  Object.keys(groupedByRoadmap).forEach(roadmapId => {
    groupedByRoadmap[roadmapId].sort((a, b) =>
      new Date(b.completedAt) - new Date(a.completedAt)
    )
  })

  // Calculate statistics
  const stats = {
    total: enrichedResults.length,
    passed: enrichedResults.filter(r => r.passed).length,
    failed: enrichedResults.filter(r => !r.passed).length,
    avgScore: enrichedResults.length > 0
      ? Math.round(enrichedResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / enrichedResults.length)
      : 0
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const formatTime = (seconds) => {
    if (!seconds || seconds < 0) return "0m 0s"
    const mins = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${mins}m ${secs}s`
  }

  const handleViewResult = (roadmapId, attemptId) => {
    router.push(`/roadmaps/${roadmapId}/quiz/result/${attemptId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Quiz History</h1>
            <p className="text-muted-foreground">Track your quiz attempts and progress over time</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Attempts</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Trophy className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Passed</p>
                <p className="text-3xl font-bold text-green-600">{stats.passed}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Score</p>
                <p className="text-3xl font-bold text-purple-600">{stats.avgScore}%</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filter by Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Attempts</SelectItem>
                  <SelectItem value="passed">✅ Passed Only</SelectItem>
                  <SelectItem value="failed">❌ Failed Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filter by Roadmap</label>
              <Select value={filterRoadmap} onValueChange={setFilterRoadmap}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by roadmap" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roadmaps</SelectItem>
                  {roadmaps.map(roadmap => (
                    <SelectItem key={roadmap.slug} value={roadmap.slug}>
                      {roadmap.icon} {roadmap.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Results */}
        {filteredResults.length === 0 ? (
          <Card className="p-16 text-center border-dashed">
            <Trophy className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-bold mb-3">
              {stats.total === 0 ? "No Quiz Attempts Yet" : "No Results Found"}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {stats.total === 0
                ? "Complete roadmaps to unlock quizzes and start tracking your progress"
                : "Try adjusting your filters to see more results"
              }
            </p>
            <Link href="/roadmaps">
              <Button size="lg">
                Browse Roadmaps
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByRoadmap).map(([roadmapId, attempts]) => {
              const roadmap = roadmapMap[roadmapId]
              const bestScore = Math.max(...attempts.map(a => a.percentage || 0))
              const latestAttempt = attempts[0]
              const canRetake = !latestAttempt.passed

              return (
                <Card key={roadmapId} className="p-8 hover:shadow-xl transition-shadow">
                  {/* Roadmap Header */}
                  <div className="flex items-start justify-between mb-6 pb-6 border-b">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{roadmap?.icon || "📚"}</div>
                      <div>
                        <h3 className="text-2xl font-bold mb-1">
                          {roadmap?.title || roadmapId?.replace(/-/g, ' ') || 'Unknown Roadmap'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Trophy className="h-4 w-4" />
                            {attempts.length} attempt{attempts.length !== 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            Best: {bestScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {canRetake && (
                        <Link href={`/roadmaps/${roadmapId}/quiz`}>
                          <Button size="sm" variant="outline" className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Retake Quiz
                          </Button>
                        </Link>
                      )}
                      {latestAttempt.passed && (
                        <Link href={`/roadmaps/${roadmapId}/certificate`}>
                          <Button size="sm" className="gap-2">
                            <Award className="h-4 w-4" />
                            View Certificate
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Attempts List */}
                  <div className="space-y-3">
                    {attempts.map((attempt, idx) => (
                      <Card
                        key={attempt._id}
                        className={`p-5 transition-all hover:shadow-md border-2 ${
                          attempt.passed
                            ? 'border-green-200 hover:border-green-400 bg-green-50/50 dark:bg-green-900/10'
                            : 'border-red-200 hover:border-red-400 bg-red-50/50 dark:bg-red-900/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          {/* Score Display */}
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className={`text-3xl font-bold ${
                                attempt.passed ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {attempt.percentage || 0}%
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {attempt.score || 0}/{attempt.totalQuestions || 10} correct
                              </div>
                            </div>

                            {/* Attempt Details */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge variant={attempt.passed ? "default" : "destructive"}>
                                  Attempt {attempt.attemptNumber || idx + 1}
                                </Badge>
                                {idx === 0 && (
                                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900">
                                    Latest
                                  </Badge>
                                )}
                                {attempt.percentage === bestScore && attempts.length > 1 && (
                                  <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900">
                                    🏆 Best Score
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(attempt.completedAt)}
                                </span>
                                {attempt.timeTaken && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTime(attempt.timeTaken)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Status Icon & Action */}
                          <div className="flex items-center gap-3">
                            {attempt.passed ? (
                              <CheckCircle2 className="h-8 w-8 text-green-600" />
                            ) : (
                              <XCircle className="h-8 w-8 text-red-600" />
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewResult(attempt.roadmapId, attempt._id)}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
