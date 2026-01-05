'use client'

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"

export default function PatternProgress({ questions, patternSlug, initialProgress = [], currentUser }) {
  const [completedQuestions, setCompletedQuestions] = useState(initialProgress)

  useEffect(() => {
    if (currentUser) {
      loadProgress()
    }

    const handleProgressUpdate = (event) => {
      if (!currentUser) return

      if (event.detail) {
        if (event.detail.pattern === patternSlug || event.detail.patternSlug === patternSlug) {
          loadProgress()
        }
      } else {
        loadProgress()
      }
    }

    window.addEventListener('pattern-progress-update', handleProgressUpdate)
    window.addEventListener('dashboard-refresh', handleProgressUpdate)

    return () => {
      window.removeEventListener('pattern-progress-update', handleProgressUpdate)
      window.removeEventListener('dashboard-refresh', handleProgressUpdate)
    }
  }, [patternSlug, currentUser])

  const loadProgress = async () => {
    try {
      const response = await fetch('/api/progress', {
        credentials: 'include',
        cache: 'no-store'
      })

      if (response.status === 401) {
        setCompletedQuestions([])
        return
      }

      if (response.ok) {
        const data = await response.json()
        const patternQuestionIds = questions.map(q => q._id)
        const completedInThisPattern = data.completed.filter(id =>
          patternQuestionIds.includes(id)
        )
        setCompletedQuestions(completedInThisPattern)
      }
    } catch (error) {
      if (!error.message?.includes('401')) {
        console.error('Failed to load progress:', error)
      }
    }
  }

  const totalQuestions = questions.length
  const solvedCount = completedQuestions.length
  const percentage = totalQuestions > 0 ? (solvedCount / totalQuestions) * 100 : 0

  if (!currentUser) {
    return null
  }

  return (
    <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-lg">Your Progress</h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-blue-600">
            {solvedCount}/{totalQuestions}
          </span>
          <span className="text-sm text-muted-foreground ml-2">solved</span>
        </div>
      </div>

      <Progress value={percentage} className="h-3 mb-2" />

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          {Math.round(percentage)}% complete
        </span>
        <span className="text-muted-foreground">
          {totalQuestions - solvedCount} remaining
        </span>
      </div>

      {solvedCount > 0 && (
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
          💪 You're on your way! Keep practicing!
        </p>
      )}
    </div>
  )
}
