'use client'

import { useState, useEffect } from 'react'
import { X, BookOpen, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ExamModeOverlay({ userId, masterId }) {
  const [showOverlay, setShowOverlay] = useState(false)
  const [examData, setExamData] = useState(null)

  useEffect(() => {
    async function checkExamMode() {
      if (!userId || !masterId) return

      // TEMPORARILY DISABLED FOR TESTING - REMOVE THESE COMMENTS IN PRODUCTION
      // const dismissed = localStorage.getItem('exam-overlay-dismissed')
      // const dismissedDate = dismissed ? new Date(dismissed) : null
      // const now = new Date()

      // if (dismissedDate && (now - dismissedDate) < 24 * 60 * 60 * 1000) {
      //   return
      // }

      try {
        const res = await fetch(`/api/roadmaps/masters/exam?userId=${userId}&masterId=${masterId}`)
        const data = await res.json()

        if (data.active && data.nearestExam) {
          const now = new Date()
          const daysRemaining = Math.ceil((new Date(data.nearestExam.examDate) - now) / (1000 * 60 * 60 * 24))

          if (daysRemaining <= 14) {
            setExamData(data.nearestExam)
            setShowOverlay(true)
          }
        }
      } catch (error) {
        console.error('Exam overlay error:', error)
      }
    }

    checkExamMode()
  }, [userId, masterId])

  const handleDismiss = () => {
    // localStorage.setItem('exam-overlay-dismissed', new Date().toISOString()) // DISABLED FOR TESTING
    setShowOverlay(false)
  }

  if (!showOverlay || !examData) return null

  const daysRemaining = Math.ceil((new Date(examData.examDate) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-10 w-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
            Exam Mode Active
          </h2>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-6">
            <p className="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-1">
              {examData.examName}
            </p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {daysRemaining} Days Remaining
            </p>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Focus on your academic preparation. All study resources are available in the Academics section.
          </p>

          <div className="space-y-3">
            <Link href="/academics">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-6 text-lg">
                <BookOpen className="h-5 w-5 mr-2" />
                Go to Academic Resources
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={handleDismiss}
              className="w-full"
            >
              Dismiss for 24 Hours
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
