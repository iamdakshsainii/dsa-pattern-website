// Replace: components/patterns-client-page.jsx
// ✨ ONLY CHANGE: Added order number badges to cards

'use client'

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Clock, Database, Target, TrendingUp, BookOpen,
  LayoutGrid, LayoutList, Search, CheckCircle2, Circle, Code
} from "lucide-react"
import DifficultyFilter from "./filters/difficulty-filter"
import SearchFilter from "./filters/search-filter"
import CompanyFilter from "./filters/company-filter"
import TagFilter from "./filters/tag-filter"
import ActiveFilters from "./filters/active-filters"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PatternsClientPage({ patterns, userProgress, currentUser }) {
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    difficulty: searchParams.get('difficulty') || 'All',
    company: searchParams.get('company') || 'All',
    tag: searchParams.get('tag') || 'All',
    search: searchParams.get('search') || ''
  })

  const [viewMode, setViewMode] = useState('card') // 'card' or 'list'
  const [searchMode, setSearchMode] = useState('pattern') // 'pattern' or 'question'

  const [allQuestions, setAllQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAllQuestions() {
      setLoading(true)
      try {
        const questions = []
        for (const pattern of patterns) {
          const response = await fetch(`/api/patterns/${pattern.slug}/questions`)
          if (response.ok) {
            const data = await response.json()
            const questionsWithPattern = data.map(q => ({
              ...q,
              patternName: pattern.name,
              patternSlug: pattern.slug
            }))
            questions.push(...questionsWithPattern)
          }
        }
        setAllQuestions(questions)
      } catch (error) {
        console.error('Error fetching questions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllQuestions()
  }, [patterns])

  // ✨ NEW: Sort patterns by order number
  const sortedPatterns = useMemo(() => {
    return [...patterns].sort((a, b) => {
      const orderA = a.order || 999
      const orderB = b.order || 999
      return orderA - orderB
    })
  }, [patterns])

  const updateFilters = (newFilters) => {
    setFilters(newFilters)
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'All' && value !== '') {
        params.set(key, value)
      }
    })
    const newUrl = `/patterns${params.toString() ? `?${params.toString()}` : ''}`
    window.history.replaceState(null, '', newUrl)
  }

  const updateFilter = (key, value) => {
    updateFilters({ ...filters, [key]: value })
  }

  const removeFilter = (key) => {
    const newFilters = { ...filters }
    if (key === 'search') {
      newFilters.search = ''
    } else {
      newFilters[key] = 'All'
    }
    updateFilters(newFilters)
  }

  const clearAllFilters = () => {
    updateFilters({
      difficulty: 'All',
      company: 'All',
      tag: 'All',
      search: ''
    })
  }

  const { companies, tags } = useMemo(() => {
    const companiesSet = new Set()
    const tagsSet = new Set()
    allQuestions.forEach(q => {
      q.companies?.forEach(c => companiesSet.add(c))
      q.tags?.forEach(t => tagsSet.add(t))
    })
    return {
      companies: Array.from(companiesSet).sort(),
      tags: Array.from(tagsSet).sort()
    }
  }, [allQuestions])

  // ✨ CHANGED: Use sortedPatterns instead of patterns
  const filteredPatterns = useMemo(() => {
    if (!filters.difficulty && !filters.search && !filters.company && !filters.tag) {
      return sortedPatterns
    }

    return sortedPatterns.filter(pattern => {
      const patternQuestions = allQuestions.filter(q => q.patternSlug === pattern.slug)
      const matchingQuestions = patternQuestions.filter(q => {
        if (filters.difficulty && filters.difficulty !== 'All') {
          if (q.difficulty !== filters.difficulty) return false
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          const patternMatch = pattern.name.toLowerCase().includes(searchLower)
          const titleMatch = q.title?.toLowerCase().includes(searchLower)
          const tagsMatch = q.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          if (!patternMatch && !titleMatch && !tagsMatch) return false
        }
        if (filters.company && filters.company !== 'All') {
          if (!q.companies?.includes(filters.company)) return false
        }
        if (filters.tag && filters.tag !== 'All') {
          if (!q.tags?.includes(filters.tag)) return false
        }
        return true
      })
      return matchingQuestions.length > 0
    })
  }, [sortedPatterns, allQuestions, filters])

  const filteredQuestions = useMemo(() => {
    let result = allQuestions

    if (filters.difficulty && filters.difficulty !== 'All') {
      result = result.filter(q => q.difficulty === filters.difficulty)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(q => {
        const titleMatch = q.title?.toLowerCase().includes(searchLower)
        const tagsMatch = q.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        const patternMatch = q.patternName?.toLowerCase().includes(searchLower)
        return titleMatch || tagsMatch || patternMatch
      })
    }

    if (filters.company && filters.company !== 'All') {
      result = result.filter(q => q.companies?.includes(filters.company))
    }

    if (filters.tag && filters.tag !== 'All') {
      result = result.filter(q => q.tags?.includes(filters.tag))
    }

    return result
  }, [allQuestions, filters])

  const stats = useMemo(() => {
    const totalQuestions = allQuestions.length
    const completedQuestions = userProgress?.completed?.length || 0
    const byDifficulty = {
      Easy: allQuestions.filter(q => q.difficulty === 'Easy').length,
      Medium: allQuestions.filter(q => q.difficulty === 'Medium').length,
      Hard: allQuestions.filter(q => q.difficulty === 'Hard').length
    }
    const completedByDifficulty = {
      Easy: allQuestions.filter(q => q.difficulty === 'Easy' && userProgress?.completed?.includes(q._id)).length,
      Medium: allQuestions.filter(q => q.difficulty === 'Medium' && userProgress?.completed?.includes(q._id)).length,
      Hard: allQuestions.filter(q => q.difficulty === 'Hard' && userProgress?.completed?.includes(q._id)).length
    }
    return {
      total: totalQuestions,
      completed: completedQuestions,
      remaining: totalQuestions - completedQuestions,
      percentage: totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0,
      byDifficulty,
      completedByDifficulty
    }
  }, [allQuestions, userProgress])

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800'
  }

  return (
    <main className="container px-4 py-8 max-w-7xl mx-auto">
      {/* Progress Section */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5" />
            <h3 className="font-semibold">Overall Progress</h3>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{stats.percentage}%</div>
            <p className="text-blue-100 text-sm">{stats.completed}/{stats.total} completed</p>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-400">
            <div className="flex justify-between text-sm">
              <span className="text-blue-100">Remaining</span>
              <span className="font-semibold">{stats.remaining}</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-3 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress by Difficulty
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {['Easy', 'Medium', 'Hard'].map((diff) => (
              <div key={diff} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    diff === 'Easy' ? 'bg-green-500' :
                    diff === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium">{diff}</span>
                </div>
                <div className={`text-2xl font-bold ${
                  diff === 'Easy' ? 'text-green-600' :
                  diff === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {stats.completedByDifficulty[diff]}/{stats.byDifficulty[diff]}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stats.byDifficulty[diff] > 0
                    ? Math.round((stats.completedByDifficulty[diff] / stats.byDifficulty[diff]) * 100)
                    : 0}% done
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Hero */}
      <div className="mb-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          {patterns.length} Patterns Available • {stats.total} Questions
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Master the Fundamentals</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Learn these essential patterns to solve any coding problem with confidence
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="p-6 space-y-4 mb-8 max-w-6xl mx-auto">
        {/* Top Row: Search + Mode Toggles */}
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <SearchFilter
              value={filters.search}
              onChange={(value) => updateFilter('search', value)}
              placeholder={
                searchMode === 'pattern'
                  ? "Search patterns or questions..."
                  : "Search questions by name or tags..."
              }
            />
          </div>

          {/* Search Mode Toggle */}
          <Select value={searchMode} onValueChange={setSearchMode}>
            <SelectTrigger className="w-[180px] shrink-0">
              <Search className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pattern">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Pattern Mode
                </div>
              </SelectItem>
              <SelectItem value="question">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Question Mode
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[150px] shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Card View
                </div>
              </SelectItem>
              <SelectItem value="list">
                <div className="flex items-center gap-2">
                  <LayoutList className="h-4 w-4" />
                  List View
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 justify-center">
          <DifficultyFilter
            selected={filters.difficulty}
            onChange={(value) => updateFilter('difficulty', value)}
          />
        </div>

        {/* Dropdowns Row */}
        {(companies.length > 0 || tags.length > 0) && (
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {companies.length > 0 && (
              <CompanyFilter
                selected={filters.company}
                onChange={(value) => updateFilter('company', value)}
                companies={companies}
              />
            )}
            {tags.length > 0 && (
              <TagFilter
                selected={filters.tag}
                onChange={(value) => updateFilter('tag', value)}
                tags={tags}
              />
            )}
          </div>
        )}

        <ActiveFilters filters={filters} onRemove={removeFilter} onClearAll={clearAllFilters} hideStatus={true} />
      </Card>

      {/* Results Info */}
      <div className="mb-4 text-sm text-muted-foreground text-center">
        {searchMode === 'pattern' ? (
          <>Showing {filteredPatterns.length} of {patterns.length} patterns</>
        ) : (
          <>Showing {filteredQuestions.length} of {stats.total} questions</>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading questions...</p>
        </div>
      ) : (
        <>
          {/* PATTERN MODE - Show Patterns */}
          {searchMode === 'pattern' && (
            <>
              {/* CARD VIEW */}
              {viewMode === 'card' && filteredPatterns.length > 0 && (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {filteredPatterns.map((pattern) => {
                    const patternQuestions = allQuestions.filter(q => q.patternSlug === pattern.slug)
                    const completedCount = patternQuestions.filter(q => userProgress?.completed?.includes(q._id)).length
                    const totalCount = patternQuestions.length
                    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

                    return (
                      <Link key={pattern._id} href={`/patterns/${pattern.slug}`}>
                        <Card className="group relative p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full bg-card/50 backdrop-blur border-muted hover:border-primary/50">
                          {/* ✨ NEW: Order Badge */}
                          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md z-10">
                            {pattern.order || '?'}
                          </div>

                          {/* ✨ CHANGED: Added pl-10 to make space for badge */}
                          <div className="pl-10">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                                {pattern.name}
                              </h3>
                              <Badge variant="secondary" className="shrink-0 ml-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                {totalCount}
                              </Badge>
                            </div>

                            {currentUser && (
                              <div className="mb-3">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{completedCount}/{totalCount}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {pattern.description}
                            </p>

                            {pattern.complexity && (
                              <div className="pt-3 border-t border-muted flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                  <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">
                                    {pattern.complexity.time}
                                  </code>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Database className="h-3.5 w-3.5 text-muted-foreground" />
                                  <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">
                                    {pattern.complexity.space}
                                  </code>
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              )}

              {/* LIST VIEW */}
              {viewMode === 'list' && filteredPatterns.length > 0 && (
                <div className="space-y-3 max-w-6xl mx-auto">
                  {filteredPatterns.map((pattern) => {
                    const patternQuestions = allQuestions.filter(q => q.patternSlug === pattern.slug)
                    const completedCount = patternQuestions.filter(q => userProgress?.completed?.includes(q._id)).length
                    const totalCount = patternQuestions.length
                    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

                    return (
                      <Link key={pattern._id} href={`/patterns/${pattern.slug}`}>
                        <Card className="group relative p-5 hover:shadow-lg transition-all duration-200 cursor-pointer border-muted hover:border-primary/50">
                          {/* ✨ NEW: Order Badge for List View */}
                          <div className="absolute top-5 left-5 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-md z-10">
                            {pattern.order || '?'}
                          </div>

                          {/* ✨ CHANGED: Added pl-16 to make space for badge */}
                          <div className="flex items-center gap-6 pl-16">
                            {/* Left: Pattern Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
                                  {pattern.name}
                                </h3>
                                <Badge variant="secondary" className="shrink-0">{totalCount} problems</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                                {pattern.description}
                              </p>
                              {pattern.complexity && (
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    <code className="px-1.5 py-0.5 rounded bg-muted">{pattern.complexity.time}</code>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Database className="h-3.5 w-3.5" />
                                    <code className="px-1.5 py-0.5 rounded bg-muted">{pattern.complexity.space}</code>
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Right: Progress */}
                            {currentUser && (
                              <div className="w-40 shrink-0">
                                <div className="text-center mb-1.5">
                                  <div className="text-2xl font-bold">{progressPercent}%</div>
                                  <div className="text-xs text-muted-foreground">
                                    {completedCount}/{totalCount} done
                                  </div>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* QUESTION MODE - Show Questions */}
          {searchMode === 'question' && filteredQuestions.length > 0 && (
            <>
              {/* CARD VIEW for Questions */}
              {viewMode === 'card' && (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
                  {filteredQuestions.map((question) => {
                    const isCompleted = userProgress?.completed?.includes(question._id)

                    return (
                      <Card
                        key={question._id}
                        className={`p-5 hover:shadow-lg transition-all duration-200 ${
                          isCompleted ? 'bg-green-50/50 dark:bg-green-950/20 border-green-300 dark:border-green-800' : 'hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <Link href={`/questions/${question._id}`}>
                              <h3 className="text-base font-semibold hover:text-primary transition-colors mb-2 line-clamp-1">
                                {question.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 flex-wrap mb-3">
                              <Badge className={getDifficultyColor(question.difficulty)}>
                                {question.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {question.patternName}
                              </Badge>
                            </div>

                            {question.tags && question.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {question.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {question.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{question.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Link href={`/questions/${question._id}`}>
                                <Button size="sm" className="h-8">
                                  <Code className="w-3.5 h-3.5 mr-1" />
                                  Solve
                                </Button>
                              </Link>
                              <Link href={`/patterns/${question.patternSlug}`}>
                                <Button variant="outline" size="sm" className="h-8">
                                  <BookOpen className="w-3.5 h-3.5 mr-1" />
                                  Pattern
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}

              {/* LIST VIEW for Questions */}
              {viewMode === 'list' && (
                <div className="space-y-3 max-w-6xl mx-auto">
                  {filteredQuestions.map((question) => {
                    const isCompleted = userProgress?.completed?.includes(question._id)

                    return (
                      <Card
                        key={question._id}
                        className={`p-4 hover:shadow-lg transition-all duration-200 ${
                          isCompleted ? 'bg-green-50/50 dark:bg-green-950/20 border-green-300 dark:border-green-800' : 'hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <Link href={`/questions/${question._id}`}>
                                <h3 className="text-base font-semibold hover:text-primary transition-colors truncate">
                                  {question.title}
                                </h3>
                              </Link>
                              <Badge className={getDifficultyColor(question.difficulty)}>
                                {question.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-xs shrink-0">
                                {question.patternName}
                              </Badge>
                            </div>

                            {question.tags && question.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {question.tags.slice(0, 4).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {question.tags.length > 4 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{question.tags.length - 4}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <Link href={`/questions/${question._id}`}>
                              <Button size="sm" className="h-8">
                                <Code className="w-3.5 h-3.5 mr-1" />
                                Solve
                              </Button>
                            </Link>
                            <Link href={`/patterns/${question.patternSlug}`}>
                              <Button variant="outline" size="sm" className="h-8">
                                <BookOpen className="w-3.5 h-3.5 mr-1" />
                                Pattern
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* Empty States */}
          {((searchMode === 'pattern' && filteredPatterns.length === 0) ||
            (searchMode === 'question' && filteredQuestions.length === 0)) && (
            <Card className="p-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  No {searchMode === 'pattern' ? 'patterns' : 'questions'} match your filters.
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </main>
  )
}
