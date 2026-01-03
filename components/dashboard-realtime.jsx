'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Target, CheckCircle2, Circle,
  BookMarked, ArrowLeft, RefreshCw, Flame,
  Calendar, Grid3x3, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardRealTime({ userId, userName, userEmail }) {
  const [stats, setStats] = useState(null)
  const [heatmapData, setHeatmapData] = useState([])
  const [allPatterns, setAllPatterns] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const patternsPerPage = 3

  useEffect(() => {
    recordVisit()
    fetchAllData()
    fetchAllPatterns()

    const handleRefresh = () => {
      fetchAllData()
      fetchHeatmapData()
    }

    window.addEventListener('dashboard-refresh', handleRefresh)
    return () => window.removeEventListener('dashboard-refresh', handleRefresh)
  }, [])

  useEffect(() => {
    fetchHeatmapData()
  }, [selectedYear])

  const recordVisit = async () => {
    try {
      await fetch('/api/record-visit', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Failed to record visit:', error)
    }
  }

  const fetchAllData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/stats', {
        cache: 'no-store',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchHeatmapData = async () => {
    try {
      const response = await fetch(`/api/activity-heatmap?year=${selectedYear}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setHeatmapData(data.heatmap || [])
      }
    } catch (error) {
      console.error('Error fetching heatmap:', error)
    }
  }

  const fetchAllPatterns = async () => {
    try {
      const response = await fetch('/api/all-patterns', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        console.log('All Patterns API Response:', data)
        console.log('Patterns array:', data.patterns)
        console.log('Patterns length:', data.patterns?.length)
        setAllPatterns(data.patterns || [])
      } else {
        console.error('Failed to fetch patterns, status:', response.status)
      }
    } catch (error) {
      console.error('Error fetching patterns:', error)
    }
  }

  const getHeatmapColor = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
    if (count <= 2) return 'bg-green-200 dark:bg-green-900 border border-green-300 dark:border-green-800'
    if (count <= 4) return 'bg-green-400 dark:bg-green-700 border border-green-500 dark:border-green-600'
    if (count <= 6) return 'bg-green-600 dark:bg-green-500 border border-green-700 dark:border-green-400'
    return 'bg-green-800 dark:bg-green-400 border border-green-900 dark:border-green-300'
  }

  const handleRefreshClick = () => {
    fetchAllData()
    fetchHeatmapData()
  }

  const handleYearChange = (year) => {
    setSelectedYear(year)
  }

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard</p>
          <Button onClick={fetchAllData}>Try Again</Button>
        </div>
      </div>
    )
  }

  const progress = stats.totalQuestions > 0
    ? (stats.solvedProblems / stats.totalQuestions) * 100
    : 0

  const easyTotal = stats.difficultyStats?.Easy?.total || 0
  const easySolved = stats.difficultyStats?.Easy?.solved || 0
  const mediumTotal = stats.difficultyStats?.Medium?.total || 0
  const mediumSolved = stats.difficultyStats?.Medium?.solved || 0
  const hardTotal = stats.difficultyStats?.Hard?.total || 0
  const hardSolved = stats.difficultyStats?.Hard?.solved || 0

  const totalSubmissions = heatmapData.reduce((sum, day) => sum + day.count, 0)
  const todaySubmissions = heatmapData.find(d => {
    const today = new Date().toISOString().split('T')[0]
    return d.date === today
  })?.count || 0

  // Pagination
  const totalPages = Math.ceil(allPatterns.length / patternsPerPage)
  const startIndex = (currentPage - 1) * patternsPerPage
  const currentPatterns = allPatterns.slice(startIndex, startIndex + patternsPerPage)

  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {userName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {userEmail}
              </p>
            </div>
          </div>
          <Button
            onClick={handleRefreshClick}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total</p>
                <p className="text-3xl font-bold mt-2">{stats.totalQuestions}</p>
              </div>
              <Target className="h-10 w-10 text-blue-200 opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Solved</p>
                <p className="text-3xl font-bold mt-2">{stats.solvedProblems}</p>
                <p className="text-green-100 text-xs mt-1">{Math.round(progress)}%</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-200 opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Bookmarks</p>
                <p className="text-3xl font-bold mt-2">{stats.bookmarksCount}</p>
              </div>
              <BookMarked className="h-10 w-10 text-purple-200 opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Streak</p>
                <p className="text-3xl font-bold mt-2">{stats.currentStreak}</p>
                <p className="text-orange-100 text-xs mt-1">days</p>
              </div>
              <Flame className="h-10 w-10 text-orange-200 opacity-80" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Heatmap */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {totalSubmissions} submissions in the last year
                  </h3>
                  {todaySubmissions > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      {todaySubmissions} {todaySubmissions === 1 ? 'submission' : 'submissions'} today ✨
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {selectedYear} <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {[2024, 2025, 2026].map(year => (
                      <DropdownMenuItem
                        key={year}
                        onClick={() => handleYearChange(year)}
                      >
                        {year}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="overflow-x-auto pb-2">
                <div className="inline-flex flex-col gap-[3px] min-w-max">
                  <div className="flex gap-[3px] mb-1">
                    <div className="w-8"></div>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                      <div key={month} className="text-xs text-gray-500 w-[44px]">
                        {month}
                      </div>
                    ))}
                  </div>
                  {['Mon', 'Wed', 'Fri'].map((day, dayIndex) => (
                    <div key={day} className="flex items-center gap-[3px]">
                      <span className="text-xs text-gray-500 w-8">{day}</span>
                      <div className="flex gap-[3px]">
                        {Array.from({ length: 53 }).map((_, weekIndex) => {
                          const actualDayIndex = dayIndex === 0 ? 1 : dayIndex === 1 ? 3 : 5
                          const dataIndex = weekIndex * 7 + actualDayIndex
                          const dayData = heatmapData[dataIndex]
                          return (
                            <div
                              key={`${weekIndex}-${actualDayIndex}`}
                              className={`w-[10px] h-[10px] rounded-sm ${getHeatmapColor(dayData?.count || 0)} cursor-pointer hover:ring-2 hover:ring-gray-400 transition-all`}
                              title={dayData ? `${dayData.date}: ${dayData.count} ${dayData.count === 1 ? 'problem' : 'problems'}` : 'No data'}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                  <span>Less</span>
                  <div className="flex gap-1">
                    {[0, 1, 3, 5, 7].map(count => (
                      <div key={count} className={`w-[10px] h-[10px] rounded-sm ${getHeatmapColor(count)}`} />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
            </Card>

            {/* Solved Problems Progress */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Solved Problems</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{stats.solvedProblems}</span>
                  <span className="text-gray-500">/ {stats.totalQuestions}</span>
                </div>
                <Progress value={progress} className="h-2" />

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Easy</div>
                    <div className="text-xl font-bold text-green-600">
                      {easySolved}<span className="text-sm text-gray-400">/{easyTotal}</span>
                    </div>
                    <Progress value={easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0} className="h-1 mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Medium</div>
                    <div className="text-xl font-bold text-yellow-600">
                      {mediumSolved}<span className="text-sm text-gray-400">/{mediumTotal}</span>
                    </div>
                    <Progress value={mediumTotal > 0 ? (mediumSolved / mediumTotal) * 100 : 0} className="h-1 mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Hard</div>
                    <div className="text-xl font-bold text-red-600">
                      {hardSolved}<span className="text-sm text-gray-400">/{hardTotal}</span>
                    </div>
                    <Progress value={hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0} className="h-1 mt-2" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Skills (Paginated Patterns) */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Skills</h3>
                <Link href="/patterns">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>

              <div className="space-y-4">
                {allPatterns.length > 0 ? (
                  <>
                    <p className="text-xs text-gray-500 mb-2">
                      Showing {currentPatterns.length} of {allPatterns.length} patterns (Page {currentPage} of {totalPages})
                    </p>
                    {currentPatterns.map((pattern) => (
                      <Link
                        key={pattern.slug}
                        href={`/patterns/${pattern.slug}`}
                        className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-base">{pattern.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {pattern.solved}/{pattern.total}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={pattern.percentage} className="flex-1 h-2.5" />
                          <span className="text-sm font-semibold w-12 text-right text-gray-700 dark:text-gray-300">
                            {Math.round(pattern.percentage)}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {pattern.solved > 0
                            ? `${pattern.solved} solved • ${Math.max(0, pattern.total - pattern.solved)} remaining`
                            : `${pattern.total} problems to solve`
                          }
                        </p>
                      </Link>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {getPageNumbers().map((page, idx) => (
                          page === '...' ? (
                            <span key={`ellipsis-${idx}`} className="px-2">...</span>
                          ) : (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="min-w-[36px]"
                            >
                              {page}
                            </Button>
                          )
                        ))}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No patterns available</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Total patterns fetched: {allPatterns.length}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={fetchAllPatterns}
                    >
                      Retry Loading Patterns
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Submissions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Submissions</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity, index) => (
                    <Link
                      key={index}
                      href={`/patterns/${activity.pattern}/questions/${activity.problemId}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        {activity.completed ? (
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                            <Circle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {activity.problemName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs font-medium ${
                              activity.difficulty === 'Easy' ? 'text-green-600 dark:text-green-400' :
                              activity.difficulty === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {activity.difficulty}
                            </span>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(activity.lastAttemptDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">No submissions yet</p>
                    <Link href="/patterns">
                      <Button variant="outline" size="sm">Start Solving</Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/patterns">
                  <Button className="w-full justify-start" variant="outline">
                    <Grid3x3 className="h-4 w-4 mr-2" />
                    All Patterns
                  </Button>
                </Link>
                <Link href="/bookmarks">
                  <Button className="w-full justify-start" variant="outline">
                    <BookMarked className="h-4 w-4 mr-2" />
                    Bookmarks
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
