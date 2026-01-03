// Replace: components/question-list.jsx
// ✅ FIX: Correct URL path for question detail page

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Youtube, BookOpen, Code, CheckCircle2, Circle, Bookmark, BookmarkCheck } from "lucide-react"

export default function QuestionList({ questions, patternSlug, solutions, userProgress, currentUser, onProgressUpdate }) {
  const [localProgress, setLocalProgress] = useState(userProgress?.completed || [])
  const [localBookmarks, setLocalBookmarks] = useState(userProgress?.bookmarks || [])
  const [loading, setLoading] = useState({})

  useEffect(() => {
    if (currentUser) {
      loadUserData()
    }
  }, [currentUser])

  const loadUserData = async () => {
    try {
      const [progressRes, bookmarksRes] = await Promise.all([
        fetch("/api/progress", { credentials: "include" }),
        fetch("/api/bookmarks", { credentials: "include" })
      ])

      if (progressRes.ok) {
        const progressData = await progressRes.json()
        const patternQuestionIds = questions.map(q => q._id)
        const completedInThisPattern = progressData.completed.filter(id =>
          patternQuestionIds.includes(id)
        )
        setLocalProgress(completedInThisPattern)
      }

      if (bookmarksRes.ok) {
        const bookmarksData = await bookmarksRes.json()
        setLocalBookmarks(bookmarksData.bookmarkIds || [])
      }
    } catch (error) {
      console.error("Failed to load user data:", error)
    }
  }

  const difficultyColors = {
    Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  const handleCheckboxClick = async (question) => {
    if (!currentUser) {
      alert("Please login to track your progress!")
      return
    }

    const questionId = question._id
    setLoading(prev => ({ ...prev, [questionId]: true }))

    const isCompleted = localProgress.includes(questionId)
    const newStatus = isCompleted ? "not_started" : "completed"

    const newProgress = isCompleted
      ? localProgress.filter(id => id !== questionId)
      : [...localProgress, questionId]
    setLocalProgress(newProgress)

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          questionId,
          status: newStatus,
          difficulty: question.difficulty,
          pattern: patternSlug,
          problemName: question.title
        }),
      })

      if (response.ok) {
        if (onProgressUpdate) {
          onProgressUpdate(newProgress)
        }

        window.dispatchEvent(new CustomEvent('pattern-progress-update', {
          detail: {
            pattern: patternSlug,
            completed: newProgress
          }
        }))

        window.dispatchEvent(new Event("dashboard-refresh"))
      } else {
        setLocalProgress(localProgress)
        alert("Failed to update progress. Please try again.")
      }
    } catch (error) {
      console.error("Failed to update progress:", error)
      setLocalProgress(localProgress)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(prev => ({ ...prev, [questionId]: false }))
    }
  }

  const handleBookmarkClick = async (question) => {
    if (!currentUser) {
      alert("Please login to bookmark questions!")
      return
    }

    const questionId = question._id
    setLoading(prev => ({ ...prev, [`bookmark-${questionId}`]: true }))

    const isCurrentlyBookmarked = localBookmarks.includes(questionId)
    const newBookmarks = isCurrentlyBookmarked
      ? localBookmarks.filter(id => id !== questionId)
      : [...localBookmarks, questionId]
    setLocalBookmarks(newBookmarks)

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          questionId,
          difficulty: question.difficulty,
          pattern: patternSlug,
          problemName: question.title
        }),
      })

      if (response.ok) {
        window.dispatchEvent(new Event("dashboard-refresh"))
      } else {
        setLocalBookmarks(localBookmarks)
        alert("Failed to update bookmark. Please try again.")
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error)
      setLocalBookmarks(localBookmarks)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(prev => ({ ...prev, [`bookmark-${questionId}`]: false }))
    }
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => {
        const solution = solutions[question._id]
        const isCompleted = localProgress.includes(question._id)
        const isBookmarked = localBookmarks.includes(question._id)
        const isCheckboxLoading = loading[question._id]
        const isBookmarkLoading = loading[`bookmark-${question._id}`]

        const uniqueKey = `${question._id}-${question.slug || question.title}`

        return (
          <Card
            key={uniqueKey}
            className={`p-6 hover:shadow-lg transition-all ${
              isCompleted ? "bg-green-50/50 dark:bg-green-950/20 border-green-300 dark:border-green-800" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <button
                onClick={() => handleCheckboxClick(question)}
                disabled={isCheckboxLoading || !currentUser}
                className={`flex-shrink-0 mt-1 transition-all ${
                  !currentUser ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"
                } ${isCheckboxLoading ? "animate-pulse" : ""}`}
                title={!currentUser ? "Login to track progress" : isCompleted ? "Mark as incomplete" : "Mark as complete"}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </button>

              <div className="flex-1 space-y-3">
                {/* Question Title and Difficulty */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">
                      {question.title}
                    </h3>
                    {isCompleted && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300">
                        ✓ Completed
                      </Badge>
                    )}
                  </div>
                  <Badge className={difficultyColors[question.difficulty]}>
                    {question.difficulty}
                  </Badge>
                </div>

                {/* Tags */}
                {solution?.tags && solution.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {solution.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {solution.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{solution.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {solution?.resources?.leetcode && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={solution.resources.leetcode} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        LeetCode
                      </a>
                    </Button>
                  )}

                  {solution?.resources?.videos?.[0] && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={solution.resources.videos[0].url} target="_blank" rel="noopener noreferrer">
                        <Youtube className="w-4 h-4 mr-1" />
                        Video
                      </a>
                    </Button>
                  )}

                  {solution?.resources?.practice?.[0] && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={solution.resources.practice[0].url} target="_blank" rel="noopener noreferrer">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {solution.resources.practice[0].platform}
                      </a>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBookmarkClick(question)}
                    disabled={isBookmarkLoading || !currentUser}
                    title={!currentUser ? "Login to bookmark" : isBookmarked ? "Remove bookmark" : "Add bookmark"}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 mr-1 text-blue-600" />
                    ) : (
                      <Bookmark className="w-4 h-4 mr-1" />
                    )}
                    {isBookmarked ? "Bookmarked" : "Bookmark"}
                  </Button>

                  {/* ✅ FIXED: Correct URL path */}
                  <Button variant="default" size="sm" asChild>
                    <Link href={`/questions/${question._id}`}>
                      <Code className="w-4 h-4 mr-1" />
                      View Solution
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
