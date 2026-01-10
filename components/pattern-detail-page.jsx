'use client'

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Lightbulb,
  CheckCircle2,
  Clock,
  Target,
  ArrowUpDown,
  LogIn,
  Sparkles,
  ExternalLink,
  Code,
  Circle
} from "lucide-react"
import QuestionList from "@/components/question-list"
import QuestionTable from "@/components/tables/question-table"
import ViewToggle from "@/components/tables/view-toggle"
import PatternProgress from "@/components/pattern-progress"
import FilterBar from "@/components/filters/filter-bar"
import StatsPanel from "@/components/stats/stats-panel"
import ProgressBreakdown from "@/components/stats/progress-breakdown"
import {
  filterQuestions,
  sortQuestions,
  getFilterStats
} from "@/lib/filter-utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PatternDetailPage({
  pattern,
  questions,
  solutions,
  userProgress,
  currentUser,
  patternSlug
}) {
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    difficulty: searchParams.get('difficulty') || 'All',
    status: searchParams.get('status') || 'All',
    company: searchParams.get('company') || 'All',
    tag: searchParams.get('tag') || 'All',
    search: searchParams.get('search') || ''
  })

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'Default')
  const [viewMode, setViewMode] = useState(searchParams.get('view') || 'card')
  const [localProgress, setLocalProgress] = useState(userProgress?.completed || [])

  useEffect(() => {
    if (currentUser) {
      loadProgress()
    }

    const handleProgressUpdate = () => {
      if (currentUser) {
        loadProgress()
      }
    }

    window.addEventListener('dashboard-refresh', handleProgressUpdate)
    window.addEventListener('pattern-progress-update', handleProgressUpdate)

    return () => {
      window.removeEventListener('dashboard-refresh', handleProgressUpdate)
      window.removeEventListener('pattern-progress-update', handleProgressUpdate)
    }
  }, [currentUser])

  const loadProgress = async () => {
    try {
      const response = await fetch('/api/progress', {
        credentials: 'include',
        cache: 'no-store'
      })

      if (response.status === 401) {
        setLocalProgress([])
        return
      }

      if (response.ok) {
        const data = await response.json()
        const patternQuestionIds = questions.map(q => q._id)
        const completedInThisPattern = data.completed.filter(id =>
          patternQuestionIds.includes(id)
        )
        setLocalProgress(completedInThisPattern)
      }
    } catch (error) {
      console.error('Failed to load progress:', error)
    }
  }

  const updateFilters = (newFilters) => {
    setFilters(newFilters)

    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (key === 'status') return
      if (value && value !== 'All' && value !== '') {
        params.set(key, value)
      }
    })
    if (sortBy !== 'Default') {
      params.set('sort', sortBy)
    }
    if (viewMode !== 'card') {
      params.set('view', viewMode)
    }

    const queryString = params.toString()
    const newUrl = `/patterns/${patternSlug}${queryString ? `?${queryString}` : ''}`

    window.history.replaceState(null, '', newUrl)
  }

  const updateSort = (value) => {
    setSortBy(value)
    const params = new URLSearchParams(searchParams)
    if (value !== 'Default') {
      params.set('sort', value)
    } else {
      params.delete('sort')
    }
    const newUrl = `/patterns/${patternSlug}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }

  const updateViewMode = (value) => {
    setViewMode(value)
    const params = new URLSearchParams(searchParams)
    if (value !== 'card') {
      params.set('view', value)
    } else {
      params.delete('view')
    }
    const newUrl = `/patterns/${patternSlug}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }

  const handleProgressUpdate = (newProgress) => {
    loadProgress()
  }

  const companies = useMemo(() => {
    const allCompanies = new Set()
    questions.forEach(q => {
      if (q.companies && Array.isArray(q.companies)) {
        q.companies.forEach(c => allCompanies.add(c))
      }
    })
    return Array.from(allCompanies).sort()
  }, [questions])

  const tags = useMemo(() => {
    const allTags = new Set()
    questions.forEach(q => {
      if (q.tags && Array.isArray(q.tags)) {
        q.tags.forEach(t => allTags.add(t))
      }
    })
    return Array.from(allTags).sort()
  }, [questions])

  const progressData = useMemo(() => ({
    completed: localProgress,
    inProgress: userProgress?.inProgress || [],
    bookmarks: userProgress?.bookmarks || []
  }), [localProgress, userProgress])

  const filteredQuestions = useMemo(() => {
    const filtered = filterQuestions(questions, filters, progressData)
    return sortQuestions(filtered, sortBy, progressData)
  }, [questions, filters, sortBy, progressData])

  const stats = useMemo(() => {
    return getFilterStats(filteredQuestions, progressData)
  }, [filteredQuestions, progressData])

  const totalStats = useMemo(() => {
    return getFilterStats(questions, progressData)
  }, [questions, progressData])

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }
    return colors[difficulty] || "bg-gray-100 text-gray-800"
  }

  if (!pattern) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Pattern not found</h2>
          <Link href="/patterns">
            <Button>Back to Patterns</Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalQuestions = questions.length
  const solvedQuestions = localProgress.length
  const progressPercentage = totalQuestions > 0
    ? Math.round((solvedQuestions / totalQuestions) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/patterns">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patterns
              </Button>
            </Link>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{pattern.name}</h1>
              <p className="text-muted-foreground max-w-3xl">
                {pattern.description}
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {totalQuestions} Problems
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-1 space-y-6">
            {currentUser ? (
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5" />
                  <h3 className="font-semibold">Your Progress</h3>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{progressPercentage}%</div>
                  <p className="text-blue-100 text-sm">{solvedQuestions}/{totalQuestions} completed</p>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-400">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Remaining</span>
                    <span className="font-semibold">{totalQuestions - solvedQuestions}</span>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      Track Your Progress
                      <Sparkles className="h-4 w-4 text-primary" />
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Sign in to mark problems solved and track your learning journey
                    </p>
                    <Link href="/auth/login">
                      <Button size="sm" className="w-full gap-2">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}

            <ProgressBreakdown stats={totalStats} />

            {pattern.when_to_use && (
              <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">When to Use This Pattern</h3>
                    <p className="text-sm text-muted-foreground">{pattern.when_to_use}</p>
                  </div>
                </div>
              </Card>
            )}

            {pattern.time_complexity && (
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">Typical Complexity</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Time: </span>
                        <Badge variant="outline" className="font-mono">
                          {pattern.time_complexity}
                        </Badge>
                      </div>
                      {pattern.space_complexity && (
                        <div>
                          <span className="text-muted-foreground">Space: </span>
                          <Badge variant="outline" className="font-mono">
                            {pattern.space_complexity}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {pattern.key_points && pattern.key_points.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-3">Key Points</h3>
                <ul className="space-y-2">
                  {pattern.key_points.map((point, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          <div className="lg:col-span-3 space-y-4">
            <PatternProgress
              questions={questions}
              patternSlug={patternSlug}
              initialProgress={localProgress}
              currentUser={currentUser}
            />

            {currentUser ? (
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{solvedQuestions}</p>
                      <p className="text-sm text-muted-foreground">Solved</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">{userProgress?.inProgress?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{totalQuestions - solvedQuestions}</p>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-dashed border-primary/30">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Save your progress as you solve</p>
                  <p className="text-xs text-muted-foreground">
                    Sign in to track completed problems and see your stats
                  </p>
                </div>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="shrink-0 gap-2">
                    <LogIn className="h-3.5 w-3.5" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}

            <FilterBar
              filters={filters}
              onFilterChange={updateFilters}
              companies={companies}
              tags={tags}
              hideStatus={true}
            />

            <StatsPanel stats={stats} totalQuestions={totalQuestions} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold">Practice Problems</h2>
            <div className="flex items-center gap-4">
              <ViewToggle view={viewMode} onViewChange={updateViewMode} />
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={updateSort}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Default">Default Order</SelectItem>
                    <SelectItem value="Difficulty">Difficulty</SelectItem>
                    <SelectItem value="Title">Title (A-Z)</SelectItem>
                    <SelectItem value="Status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {filteredQuestions.length > 0 ? (
            viewMode === 'card' ? (
              <QuestionList
                questions={filteredQuestions}
                patternSlug={patternSlug}
                solutions={solutions}
                userProgress={progressData}
                currentUser={currentUser}
                onProgressUpdate={handleProgressUpdate}
              />
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-lg border-2 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-b-2">
                      <tr>
                        <th className="px-6 py-4 text-center text-sm font-bold">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Title</th>
                        <th className="px-6 py-4 text-center text-sm font-bold">Difficulty</th>
                        <th className="px-6 py-4 text-center text-sm font-bold">Tags</th>
                        <th className="px-6 py-4 text-center text-sm font-bold">Companies</th>
                        <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuestions.map((question) => {
                        const isCompleted = progressData.completed.includes(question._id)

                        const handleToggleComplete = async (e) => {
                          e.preventDefault()
                          if (!currentUser) return

                          try {
                            const response = await fetch('/api/progress', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                questionId: question._id,
                                status: isCompleted ? 'not_started' : 'completed'
                              })
                            })

                            if (response.ok) {
                              loadProgress()
                              window.dispatchEvent(new Event('pattern-progress-update'))
                            }
                          } catch (error) {
                            console.error('Error updating progress:', error)
                          }
                        }

                        return (
                          <tr
                            key={question._id}
                            className={`border-b hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20 transition-all ${
                              isCompleted ? 'bg-green-50/30 dark:bg-green-950/10' : ''
                            }`}
                          >
                            <td className="px-6 py-5 text-center">
                              {currentUser ? (
                                <button onClick={handleToggleComplete} className="mx-auto">
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-600 hover:scale-110 transition-transform cursor-pointer" />
                                  ) : (
                                    <Circle className="h-6 w-6 text-gray-300 hover:text-gray-400 hover:scale-110 transition-all cursor-pointer" />
                                  )}
                                </button>
                              ) : (
                                isCompleted ? (
                                  <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto" />
                                ) : (
                                  <Circle className="h-6 w-6 text-gray-300 mx-auto" />
                                )
                              )}
                            </td>

                            <td className="px-6 py-5">
                              <Link href={`/questions/${question._id}`}>
                                <span className="font-semibold text-base hover:text-primary transition-colors">
                                  {question.title}
                                </span>
                              </Link>
                            </td>

                            <td className="px-6 py-5 text-center">
                              <Badge className={`${getDifficultyColor(question.difficulty)} font-semibold px-3 py-1`}>
                                {question.difficulty}
                              </Badge>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex flex-wrap gap-1.5 justify-center">
                                {question.tags && question.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {question.tags && question.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs font-semibold">
                                    +{question.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex flex-wrap gap-1.5 justify-center">
                                {question.companies && question.companies.slice(0, 2).map((company) => (
                                  <Badge key={company} variant="outline" className="text-xs">
                                    {company}
                                  </Badge>
                                ))}
                                {question.companies && question.companies.length > 2 && (
                                  <Badge variant="outline" className="text-xs font-semibold">
                                    +{question.companies.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex gap-2 justify-center">
                                <Link href={`/questions/${question._id}`}>
                                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    <Code className="h-3.5 w-3.5 mr-1" />
                                    Solve
                                  </Button>
                                </Link>
                                {question.links?.leetcode && (
                                  <a href={question.links.leetcode} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline">
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </Button>
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No problems match your filters.</p>
                <Button
                  variant="outline"
                  onClick={() => updateFilters({
                    difficulty: 'All',
                    status: 'All',
                    company: 'All',
                    tag: 'All',
                    search: ''
                  })}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
