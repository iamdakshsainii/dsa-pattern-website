"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ExternalLink,
  Youtube,
  FileText,
  Bookmark,
  BookmarkCheck
} from "lucide-react"

export default function QuestionCard({
  question,
  number,
  solution,
  patternSlug,
  isCompleted,
  isBookmarked,
  currentUser,
  onProgressUpdate,
  onBookmarkUpdate
}) {
  const [localCompleted, setLocalCompleted] = useState(isCompleted)
  const [localBookmarked, setLocalBookmarked] = useState(isBookmarked)
  const [loading, setLoading] = useState(false)

  const difficultyColors = {
    Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  const handleCheckboxClick = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      alert("Please login to track your progress!")
      return
    }

    setLoading(true)
    const newStatus = !localCompleted

    // Update UI immediately for instant feedback
    setLocalCompleted(newStatus)

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          questionId: question._id,
          status: newStatus ? "completed" : "not_started",
          difficulty: question.difficulty,
          pattern: patternSlug,
          problemName: question.title
        }),
      })

      if (response.ok) {
        // Dispatch events immediately after success
        window.dispatchEvent(new Event("dashboard-refresh"))

        // Dispatch with proper details
        window.dispatchEvent(new CustomEvent("pattern-progress-update", {
          detail: {
            patternSlug: patternSlug,
            pattern: patternSlug,
            questionId: question._id,
            completed: newStatus
          }
        }))

        // Call callback immediately
        if (onProgressUpdate) {
          setTimeout(() => onProgressUpdate(), 100)
        }
      } else {
        // Revert on failure
        setLocalCompleted(!newStatus)
        alert("Failed to update progress")
      }
    } catch (error) {
      console.error("Failed to update progress:", error)
      setLocalCompleted(!newStatus)
    } finally {
      setLoading(false)
    }
  }

  const handleBookmarkClick = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      alert("Please login to bookmark questions!")
      return
    }

    setLoading(true)
    const newBookmarked = !localBookmarked

    // Update UI immediately
    setLocalBookmarked(newBookmarked)

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          questionId: question._id,
          difficulty: question.difficulty,
          pattern: patternSlug,
          problemName: question.title
        }),
      })

      if (response.ok) {
        window.dispatchEvent(new Event("dashboard-refresh"))
        if (onBookmarkUpdate) {
          setTimeout(() => onBookmarkUpdate(), 100)
        }
      } else {
        // Revert on failure
        setLocalBookmarked(!newBookmarked)
        alert("Failed to update bookmark")
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error)
      setLocalBookmarked(!newBookmarked)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={`p-4 md:p-6 hover:shadow-lg transition-shadow ${
      localCompleted ? 'bg-green-50/50 dark:bg-green-950/20 border-green-300 dark:border-green-800' : ''
    }`}>
      <div className="flex gap-3 md:gap-4">
        <div
          onClick={handleCheckboxClick}
          className={`flex-shrink-0 mt-1 ${!currentUser ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
          <Checkbox
            checked={localCompleted}
            disabled={loading || !currentUser}
            className="w-5 h-5 md:w-6 md:h-6"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 md:gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {number && (
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                    {number}
                  </span>
                )}
                <h3 className="text-base md:text-lg font-semibold truncate md:line-clamp-2">
                  {question.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={difficultyColors[question.difficulty]}>
                  {question.difficulty}
                </Badge>
                {question.acceptanceRate && (
                  <Badge variant="outline" className="text-xs">
                    {question.acceptanceRate}% acceptance
                  </Badge>
                )}
                {localCompleted && (
                  <Badge variant="outline" className="text-green-600 border-green-600 hidden md:inline-flex">
                    Completed
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {solution?.tags && solution.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
              {solution.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {solution.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{solution.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {question.companies && question.companies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 md:mb-4">
              {question.companies.slice(0, 3).map((company) => (
                <Badge key={company} variant="outline" className="text-xs">
                  {company}
                </Badge>
              ))}
              {question.companies.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{question.companies.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {question.complexity && (
            <div className="hidden md:flex items-center gap-4 mb-3 text-xs text-muted-foreground">
              {question.complexity.time && (
                <span>Time: <code className="px-1.5 py-0.5 rounded bg-muted">{question.complexity.time}</code></span>
              )}
              {question.complexity.space && (
                <span>Space: <code className="px-1.5 py-0.5 rounded bg-muted">{question.complexity.space}</code></span>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {solution?.resources?.leetcode && (
              <Link href={solution.resources.leetcode} target="_blank" className="hidden md:inline-block">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  LeetCode
                </Button>
              </Link>
            )}

            {solution?.resources?.videos?.[0] && (
              <Link href={solution.resources.videos[0].url} target="_blank" className="hidden md:inline-block">
                <Button variant="outline" size="sm">
                  <Youtube className="h-4 w-4 mr-1" />
                  Video
                </Button>
              </Link>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmarkClick}
              disabled={loading || !currentUser}
              className="h-9 md:h-10"
            >
              {localBookmarked ? (
                <>
                  <BookmarkCheck className="h-4 w-4 md:mr-1" />
                  <span className="hidden md:inline">Bookmarked</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 md:mr-1" />
                  <span className="hidden md:inline">Bookmark</span>
                </>
              )}
            </Button>

            <Link href={`/patterns/${patternSlug}/questions/${question._id}`} className="flex-1 md:flex-initial">
              <Button size="sm" className="w-full md:w-auto h-9 md:h-10">
                <FileText className="h-4 w-4 mr-1" />
                Solve
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
