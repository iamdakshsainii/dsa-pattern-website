'use client'

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import QuestionTableRow from "./question-table-row"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function QuestionTable({
  questions,
  patternSlug,
  solutions,
  userProgress,
  currentUser,
  onProgressUpdate
}) {
  const [localProgress, setLocalProgress] = useState(userProgress?.completed || [])
  const [localBookmarks, setLocalBookmarks] = useState(userProgress?.bookmarks || [])

  useEffect(() => {
    if (currentUser) {
      loadUserData()
    }

    // Listen for updates
    const handleUpdate = () => {
      if (currentUser) {
        loadUserData()
      }
    }

    window.addEventListener('dashboard-refresh', handleUpdate)
    window.addEventListener('pattern-progress-update', handleUpdate)

    return () => {
      window.removeEventListener('dashboard-refresh', handleUpdate)
      window.removeEventListener('pattern-progress-update', handleUpdate)
    }
  }, [currentUser])

  const loadUserData = async () => {
    try {
      const [progressRes, bookmarksRes] = await Promise.all([
        fetch("/api/progress", {
          credentials: "include",
          cache: "no-store"
        }),
        fetch("/api/bookmarks", {
          credentials: "include",
          cache: "no-store"
        })
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

  const handleProgressUpdate = () => {
    loadUserData()
    if (onProgressUpdate) {
      setTimeout(() => {
        onProgressUpdate(localProgress)
      }, 100)
    }
  }

  const handleBookmarkUpdate = () => {
    loadUserData()
  }

  return (
    <div className="space-y-4">
      {/* Login Prompt for Table View */}
      {!currentUser && (
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-dashed border-primary/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <LogIn className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Sign in to track your progress</p>
              <p className="text-xs text-muted-foreground">
                Check off problems as you complete them
              </p>
            </div>
          </div>
          <Link href="/auth/login">
            <Button size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </Link>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 text-center">
                  <span className="sr-only">Status</span>
                </TableHead>
                <TableHead className="w-16 text-center">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-24">Difficulty</TableHead>
                <TableHead className="w-28 text-center">Acceptance</TableHead>
                <TableHead className="w-40 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question, index) => {
                const solution = solutions[question._id]
                const isCompleted = localProgress.includes(question._id)
                const isBookmarked = localBookmarks.includes(question._id)
                const uniqueKey = `${question._id}-${question.slug || question.title}`

                return (
                  <QuestionTableRow
                    key={uniqueKey}
                    question={question}
                    number={index + 1}
                    solution={solution}
                    patternSlug={patternSlug}
                    isCompleted={isCompleted}
                    isBookmarked={isBookmarked}
                    currentUser={currentUser}
                    onProgressUpdate={handleProgressUpdate}
                    onBookmarkUpdate={handleBookmarkUpdate}
                  />
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
        <div>
          Showing <span className="font-medium text-foreground">{questions.length}</span> problems
        </div>
        {currentUser && (
          <div>
            <span className="font-medium text-green-600">{localProgress.length}</span> completed
          </div>
        )}
      </div>
    </div>
  )
}
