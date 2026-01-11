'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, X, Clock } from 'lucide-react'

export default function SolutionImprovementNotice({ updatedAt, questionId }) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const dismissedNotices = JSON.parse(localStorage.getItem('dismissedSolutionNotices') || '{}')
    if (dismissedNotices[questionId]) {
      setDismissed(true)
    }
  }, [questionId])

  const handleDismiss = () => {
    const dismissedNotices = JSON.parse(localStorage.getItem('dismissedSolutionNotices') || '{}')
    dismissedNotices[questionId] = true
    localStorage.setItem('dismissedSolutionNotices', JSON.stringify(dismissedNotices))
    setDismissed(true)
  }

  const isRecentlyUpdated = () => {
    if (!updatedAt) return false
    const updateDate = new Date(updatedAt)
    const now = new Date()
    const diffDays = Math.floor((now - updateDate) / (1000 * 60 * 60 * 24))
    return diffDays <= 60
  }

  const formatDate = (date) => {
    if (!date) return 'Recently'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (dismissed || !isRecentlyUpdated()) return null

  return (
    <Card className="p-5 border-2 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -mr-16 -mt-16 blur-2xl" />

      <div className="relative flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex-shrink-0">
          <Sparkles className="h-5 w-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-base mb-1 text-gray-900 dark:text-white">
                Solutions Under Continuous Improvement
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                We regularly refine approaches for better clarity and optimality. Bookmark this page to stay updated with the latest improvements.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                <span>Last updated: {formatDate(updatedAt)}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="flex-shrink-0 h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
