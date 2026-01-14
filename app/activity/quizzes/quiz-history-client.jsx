'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Clock, TrendingUp, CheckCircle2, XCircle, Award, ArrowLeft, RotateCcw, Zap } from "lucide-react"
import Link from "next/link"

export default function QuizHistoryClient({ results, roadmaps, userId }) {
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRoadmap, setFilterRoadmap] = useState("all")

  const roadmapMap = {}
  roadmaps.forEach(r => {
    roadmapMap[r.slug] = r
  })

  const enrichedResults = results.map(result => ({
    ...result,
    roadmapTitle: roadmapMap[result.roadmapId]?.title || result.roadmapId,
    roadmapIcon: roadmapMap[result.roadmapId]?.icon || "📚"
  }))

  const filteredResults = enrichedResults.filter(result => {
    if (filterStatus === "passed" && !result.passed) return false
    if (filterStatus === "failed" && result.passed) return false
    if (filterRoadmap !== "all" && result.roadmapId !== filterRoadmap) return false
    return true
  })

  const groupedByRoadmap = {}
  filteredResults.forEach(result => {
    if (!groupedByRoadmap[result.roadmapId]) {
      groupedByRoadmap[result.roadmapId] = []
    }
    groupedByRoadmap[result.roadmapId].push(result)
  })

  Object.keys(groupedByRoadmap).forEach(roadmapId => {
    groupedByRoadmap[roadmapId].sort((a, b) =>
      new Date(b.completedAt) - new Date(a.completedAt)
    )
  })

  const stats = {
    total: results.length,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => !r.passed).length,
    avgScore: results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
      : 0
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quiz History</h1>
            <p className="text-muted-foreground">Track your quiz attempts and progress</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Attempts</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Passed</p>
                <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Score</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Attempts</SelectItem>
                  <SelectItem value="passed">Passed Only</SelectItem>
                  <SelectItem value="failed">Failed Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
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

        {filteredResults.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Quiz Attempts Yet</h3>
            <p className="text-muted-foreground mb-6">
              Complete roadmaps to unlock quizzes and earn certificates
            </p>
            <Link href="/roadmaps">
              <Button>Browse Roadmaps</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByRoadmap).map(([roadmapId, attempts]) => {
              const roadmap = roadmapMap[roadmapId]
              const bestScore = Math.max(...attempts.map(a => a.percentage))
              const latestAttempt = attempts[0]
              const passedCount = attempts.filter(a => a.passed).length
              const isMastered = passedCount >= 3

              return (
                <Card key={roadmapId} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{roadmap?.icon || "📚"}</div>
                      <div>
                        <h3 className="text-xl font-bold">{roadmap?.title || roadmapId}</h3>
                        <p className="text-sm text-muted-foreground">
                          {attempts.length} attempt{attempts.length !== 1 ? 's' : ''} • Best: {bestScore}%
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isMastered ? (
                        <Badge variant="default" className="bg-green-600 text-white px-4 py-2 text-sm">
                          ✅ Mastered
                        </Badge>
                      ) : !latestAttempt.passed ? (
                        <Link href={`/roadmaps/${roadmapId}/quiz`}>
                          <Button size="sm" variant="outline">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Retake Quiz
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/roadmaps/${roadmapId}/quiz`}>
                          <Button size="sm" variant="outline">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Practice Again
                          </Button>
                        </Link>
                      )}
                      {latestAttempt.passed && (
                        <Link href={`/roadmaps/${roadmapId}/certificate`}>
                          <Button size="sm">
                            <Award className="h-4 w-4 mr-2" />
                            View Certificate
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {attempts.map((attempt, idx) => (
                      <Card
                        key={attempt._id}
                        className={`p-4 ${attempt.passed ? 'border-green-500' : 'border-red-500'} border`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                                {attempt.percentage}%
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {attempt.score}/{attempt.totalQuestions}
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={attempt.passed ? "default" : "destructive"}>
                                  Attempt {attempt.attemptNumber}
                                </Badge>

                                {/* ✅ NEW: Card Test Badge */}
                                {attempt.isCardTest && (
                                  <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Card Test
                                  </Badge>
                                )}

                                {idx === 0 && (
                                  <Badge variant="outline">Latest</Badge>
                                )}
                                {attempt.percentage === bestScore && attempts.length > 1 && (
                                  <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900">
                                    Best Score
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{formatDate(attempt.completedAt)}</span>
                                {attempt.timeTaken && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTime(attempt.timeTaken)}
                                  </span>
                                )}
                              </div>

                              {/* ✅ NEW: Progress Impact */}
                              {attempt.cardProgressImpact && (
                                <div className="text-xs text-muted-foreground mt-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded">
                                  <span className="font-medium">Progress Impact:</span> {attempt.cardProgressImpact.cardBefore}% → {attempt.cardProgressImpact.cardAfter}%
                                </div>
                              )}
                            </div>
                          </div>

                          {attempt.passed ? (
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-600" />
                          )}
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
