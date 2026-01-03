'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Bookmark,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  BookmarkX,
  ArrowLeft
} from "lucide-react"

export default function BookmarksClient({ questions: initialQuestions, userProgress: initialProgress, userId }) {
  // ✅ FIX: Ensure userProgress always has required arrays
  const [questions, setQuestions] = useState(initialQuestions || [])
  const [userProgress, setUserProgress] = useState({
    completed: initialProgress?.completed || [],
    inProgress: initialProgress?.inProgress || [],
    bookmarks: initialProgress?.bookmarks || []
  })
  const [loading, setLoading] = useState({})

  useEffect(() => {
    // Load fresh bookmarks on mount
    fetchBookmarks()

    const handleRefresh = () => {
      fetchBookmarks()
    }

    window.addEventListener('dashboard-refresh', handleRefresh)
    return () => window.removeEventListener('dashboard-refresh', handleRefresh)
  }, [])

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('/api/bookmarks', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Bookmarks data:', data)

        // ✅ FIX: Use questions from API, keep existing progress
        setQuestions(data.questions || [])

        // ✅ FIX: Keep the completed/inProgress from initial state, only update bookmarks
        setUserProgress(prev => ({
          completed: prev.completed || [], // Keep existing completed status
          inProgress: prev.inProgress || [], // Keep existing inProgress status
          bookmarks: data.bookmarkIds || [] // Update bookmarks list
        }))
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error)
    }
  }

  const handleRemoveBookmark = async (questionId) => {
    setLoading(prev => ({ ...prev, [questionId]: true }))

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ questionId })
      })

      if (response.ok) {
        // Remove from local state
        setQuestions(prev => prev.filter(q => q._id !== questionId))
        setUserProgress(prev => ({
          ...prev,
          bookmarks: (prev.bookmarks || []).filter(id => id !== questionId)
        }))

        // Emit event for dashboard refresh
        window.dispatchEvent(new Event('dashboard-refresh'))
      }
    } catch (error) {
      console.error('Failed to remove bookmark:', error)
    } finally {
      setLoading(prev => ({ ...prev, [questionId]: false }))
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
      case "hard":
        return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (questionId) => {
    // ✅ FIX: Safe array access with optional chaining
    if (userProgress?.completed?.includes(questionId)) {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />
    }
    if (userProgress?.inProgress?.includes(questionId)) {
      return <Clock className="h-5 w-5 text-yellow-600" />
    }
    return <Circle className="h-5 w-5 text-gray-400" />
  }

  const getStatusText = (questionId) => {
    // ✅ FIX: Safe array access with optional chaining
    if (userProgress?.completed?.includes(questionId)) {
      return { text: "Completed", color: "text-green-600" }
    }
    if (userProgress?.inProgress?.includes(questionId)) {
      return { text: "In Progress", color: "text-yellow-600" }
    }
    return { text: "Not Started", color: "text-gray-600" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Bookmark className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold">Your Bookmarks</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Problems you've saved for later practice
          </p>
        </div>

        {/* Stats - ✅ FIX: Safe array access */}
        {questions?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <p className="text-sm text-muted-foreground mb-1">Total Bookmarked</p>
              <p className="text-4xl font-bold text-blue-600">{questions.length}</p>
            </Card>
            <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-4xl font-bold text-green-600">
                {questions.filter((q) => userProgress?.completed?.includes(q._id)).length}
              </p>
            </Card>
            <Card className="p-6 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
              <p className="text-sm text-muted-foreground mb-1">Remaining</p>
              <p className="text-4xl font-bold text-orange-600">
                {questions.filter((q) => !userProgress?.completed?.includes(q._id)).length}
              </p>
            </Card>
          </div>
        )}

        {/* Bookmarks List */}
        {!questions || questions.length === 0 ? (
          <Card className="p-12 bg-white dark:bg-slate-900">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted">
                  <Bookmark className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2">No bookmarks yet</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Start bookmarking problems you want to revisit later!
              </p>
              <Link href="/patterns">
                <Button size="lg">
                  Browse Problems
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {questions.map((question) => {
              const status = getStatusText(question._id)
              const patternSlug = question.pattern_id || question.pattern || 'unknown'

              return (
                <Card
                  key={question._id}
                  className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50 bg-white dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Side - Question Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        {getStatusIcon(question._id)}
                        <Badge
                          variant="outline"
                          className={getDifficultyColor(question.difficulty)}
                        >
                          {question.difficulty || "Medium"}
                        </Badge>
                        <span className={`text-sm font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </div>

                      <Link href={`/questions/${question._id}`}>
                        <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                          {question.title}
                        </h3>
                      </Link>

                      {question.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {question.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {patternSlug && patternSlug !== 'unknown' && (
                          <span className="flex items-center gap-1">
                            Pattern: <strong className="capitalize">{patternSlug.replace(/-/g, ' ')}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex flex-col gap-2">
                      <Link href={`/questions/${question._id}`}>
                        <Button size="sm" className="gap-2 w-full">
                          Solve
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleRemoveBookmark(question._id)}
                        disabled={loading[question._id]}
                      >
                        <BookmarkX className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
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
