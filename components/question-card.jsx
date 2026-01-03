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
        window.dispatchEvent(new Event("dashboard-refresh"))
        window.dispatchEvent(new CustomEvent("pattern-progress-update", {
          detail: { patternSlug, questionId: question._id, completed: newStatus }
        }))
        if (onProgressUpdate) onProgressUpdate()
      } else {
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
        if (onBookmarkUpdate) onBookmarkUpdate()
      } else {
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
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Checkbox */}
        <div
          onClick={handleCheckboxClick}
          className={`flex-shrink-0 mt-1 ${!currentUser ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
          <Checkbox
            checked={localCompleted}
            disabled={loading || !currentUser}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Difficulty */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">
                {question.title}
              </h3>
              <div className="flex items-center gap-2">
                <Badge className={difficultyColors[question.difficulty]}>
                  {question.difficulty}
                </Badge>
                {localCompleted && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    ✓ Completed
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {solution?.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {solution.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {solution.tags.length > 3 && (
                <Badge variant="secondary">
                  +{solution.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* External Links */}
            {solution?.resources?.leetcode && (
              <Link href={solution.resources.leetcode} target="_blank">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  LeetCode
                </Button>
              </Link>
            )}

            {solution?.resources?.videos?.[0] && (
              <Link href={solution.resources.videos[0].url} target="_blank">
                <Button variant="outline" size="sm">
                  <Youtube className="h-4 w-4 mr-1" />
                  Video
                </Button>
              </Link>
            )}

            {/* Bookmark Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmarkClick}
              disabled={loading || !currentUser}
            >
              {localBookmarked ? (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-1" />
                  Bookmarked
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 mr-1" />
                  Bookmark
                </>
              )}
            </Button>

            {/* View Solution */}
            <Link href={`/patterns/${patternSlug}/questions/${question._id}`}>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-1" />
                View Solution
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
