"use client"

import { useState, useEffect } from "react"
import QuestionCard from "@/components/questions/question-card"
export const dynamic = 'force-dynamic'
export default function QuestionList({
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

    // FIXED: Listen for updates
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
          cache: "no-store" // FIXED: Prevent caching
        }),
        fetch("/api/bookmarks", {
          credentials: "include",
          cache: "no-store" // FIXED: Prevent caching
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
      // FIXED: Pass the updated progress array
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
      {questions.map((question, index) => {
        const solution = solutions[question._id]
        const isCompleted = localProgress.includes(question._id)
        const isBookmarked = localBookmarks.includes(question._id)
        const uniqueKey = `${question._id}-${question.slug || question.title}`

        return (
          <QuestionCard
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
    </div>
  )
}
