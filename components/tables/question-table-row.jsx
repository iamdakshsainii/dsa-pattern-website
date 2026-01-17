'use client'

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Bookmark, BookmarkCheck, LogIn } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"

export default function QuestionTableRow({
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
    Easy: "text-green-600 dark:text-green-400",
    Medium: "text-yellow-600 dark:text-yellow-400",
    Hard: "text-red-600 dark:text-red-400",
  }

  const handleCheckboxClick = async () => {
    if (!currentUser) {
      return // Silent fail, user will see disabled state
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
      }
    } catch (error) {
      console.error("Failed to update progress:", error)
      setLocalCompleted(!newStatus)
    } finally {
      setLoading(false)
    }
  }

  const handleBookmarkClick = async () => {
    if (!currentUser) {
      return // Silent fail
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
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error)
      setLocalBookmarked(!newBookmarked)
    } finally {
      setLoading(false)
    }
  }

  // Calculate acceptance rate (mock for now - replace with real data)
  const acceptanceRate = question.acceptanceRate || Math.floor(Math.random() * 30) + 40

  return (
    <TableRow className={`${localCompleted ? 'bg-green-50/50 dark:bg-green-950/20' : ''} hover:bg-muted/50 transition-colors`}>
      {/* Status Checkbox */}
      <TableCell className="w-12 text-center">
        {currentUser ? (
          <button
            onClick={handleCheckboxClick}
            disabled={loading}
            className="hover:scale-110 transition-transform"
            title={localCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {localCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        ) : (
          <Circle className="w-5 h-5 text-gray-300" title="Sign in to track progress" />
        )}
      </TableCell>

      {/* Number */}
      <TableCell className="w-16 text-center font-mono text-sm text-muted-foreground">
        {number}
      </TableCell>

      {/* Title */}
      <TableCell className="font-medium">
        <Link
          href={`/questions/${question._id}`}
          className="hover:text-primary hover:underline transition-colors"
        >
          {question.title}
        </Link>
      </TableCell>

      {/* Difficulty */}
      <TableCell className="w-24">
        <span className={`font-medium ${difficultyColors[question.difficulty]}`}>
          {question.difficulty}
        </span>
      </TableCell>

      {/* Acceptance Rate */}
      <TableCell className="w-28 text-center">
        <div className="inline-flex items-center gap-1.5">
          <div className="relative w-12 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full ${
                acceptanceRate >= 50 ? 'bg-green-500' :
                acceptanceRate >= 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${acceptanceRate}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {acceptanceRate}%
          </span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="w-40">
        <div className="flex items-center gap-2 justify-end">
          {currentUser ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleBookmarkClick}
                disabled={loading}
                title={localBookmarked ? "Remove bookmark" : "Bookmark"}
              >
                {localBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 text-blue-600" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>

              <Link href={`/patterns/${patternSlug}/questions/${question.slug}`}>
                <Button size="sm" className="h-8 px-3">
                  Solve
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/auth/login">
              <Button size="sm" variant="outline" className="h-8 px-3 gap-1.5">
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
