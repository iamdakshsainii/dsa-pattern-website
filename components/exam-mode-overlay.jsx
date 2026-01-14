'use client'

import { useEffect, useState } from 'react'
import { BookOpen, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ExamModeOverlay() {
  const [showOverlay, setShowOverlay] = useState(false)
  const [examData, setExamData] = useState(null)

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const res = await fetch('/api/roadmaps/masters/exam')
        if (res.ok) {
          const data = await res.json()
          if (data.active && data.nearestExam) {
            const daysRemaining = Math.ceil(
              (new Date(data.nearestExam.examDate) - new Date()) / (1000 * 60 * 60 * 24)
            )
            if (daysRemaining <= 14) {
              // Check if user dismissed today
              const lastDismiss = localStorage.getItem('examModeDismiss')
              const today = new Date().toDateString()
              if (lastDismiss !== today) {
                setExamData({ ...data.nearestExam, daysRemaining })
                setShowOverlay(true)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching exam data:', error)
      }
    }

    fetchExamData()
  }, [])

  const handleDismiss = () => {
    const today = new Date().toDateString()
    localStorage.setItem('examModeDismiss', today)
    setShowOverlay(false)
  }

  if (!showOverlay || !examData) return null

  const isUrgent = examData.daysRemaining <= 7

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden ${
        isUrgent
          ? 'border-2 border-red-500'
          : 'border-2 border-yellow-500'
      }`}
      >
        {/* Animated background */}
        <div className={`absolute inset-0 opacity-10 ${
          isUrgent ? 'bg-red-500' : 'bg-yellow-500'
        }`} />

        {/* Content */}
        <div className="relative z-10">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center">
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Exam Mode Active
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your {examData.examName} is in {examData.daysRemaining} days
            </p>

            <div className={`p-4 rounded-lg mb-6 ${
              isUrgent
                ? 'bg-red-100 dark:bg-red-900/30'
                : 'bg-yellow-100 dark:bg-yellow-900/30'
            }`}
            >
              <p className={`font-semibold ${
                isUrgent
                  ? 'text-red-800 dark:text-red-200'
                  : 'text-yellow-800 dark:text-yellow-200'
              }`}
              >
                {isUrgent ? '⚠️ Time to focus!' : '⏰ Start preparing now'}
              </p>
              <p className={`text-sm mt-2 ${
                isUrgent
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-yellow-700 dark:text-yellow-300'
              }`}
              >
                Access curated academic resources to boost your CGPA
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/academics" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                  <BookOpen className="h-4 w-4" />
                  Focus on Academics
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="w-full"
              >
                Remind Later
              </Button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              This reminder will show once per day
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
