// Replace: components/pattern-detail-page.jsx

'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  ArrowUpDown
} from "lucide-react"
import QuestionList from "@/components/question-list"
import PatternProgress from "@/components/pattern-progress"
import FilterBar from "@/components/filters/filter-bar"
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

  // Initialize filters from URL (NO status by default)
  const [filters, setFilters] = useState({
    difficulty: searchParams.get('difficulty') || 'All',
    status: searchParams.get('status') || 'All', // Keep for compatibility
    company: searchParams.get('company') || 'All',
    tag: searchParams.get('tag') || 'All',
    search: searchParams.get('search') || ''
  })

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'Default')
  const [localProgress, setLocalProgress] = useState(userProgress?.completed || [])

  const updateFilters = (newFilters) => {
    setFilters(newFilters)

    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      // Don't include status in URL
      if (key === 'status') return
      if (value && value !== 'All' && value !== '') {
        params.set(key, value)
      }
    })
    if (sortBy !== 'Default') {
      params.set('sort', sortBy)
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

  const handleProgressUpdate = (newProgress) => {
    setLocalProgress(newProgress)
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
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl px-4 py-4">
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

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
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

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Difficulty Breakdown
              </h3>
              <div className="space-y-3">
                {['Easy', 'Medium', 'Hard'].map((diff, idx) => {
                  const colors = ['green', 'yellow', 'red']
                  const color = colors[idx]
                  return (
                    <div key={diff} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-${color}-500`}></div>
                        <span className="text-sm">{diff}</span>
                      </div>
                      <Badge variant="outline" className={`text-${color}-600`}>
                        {totalStats.completedByDifficulty[diff]}/{totalStats.byDifficulty[diff]}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </Card>

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

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <PatternProgress
              questions={questions}
              patternSlug={patternSlug}
              initialProgress={localProgress}
            />

            {currentUser && (
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
            )}

            {/* ✅ FILTER BAR with hideStatus=true */}
            <FilterBar
              filters={filters}
              onFilterChange={updateFilters}
              companies={companies}
              tags={tags}
              hideStatus={true}
            />

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Practice Problems</h2>
                <p className="text-muted-foreground">
                  Showing {stats.total} of {totalQuestions} problems
                  {stats.total !== totalQuestions && ` (${totalQuestions - stats.total} filtered out)`}
                </p>
              </div>

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

            {filteredQuestions.length > 0 ? (
              <QuestionList
                questions={filteredQuestions}
                patternSlug={patternSlug}
                solutions={solutions}
                userProgress={progressData}
                currentUser={currentUser}
                onProgressUpdate={handleProgressUpdate}
              />
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
        </div>
      </main>
    </div>
  )
}
