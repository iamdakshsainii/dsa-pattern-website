'use client'

import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ExamCountdownWidget() {
  const [examData, setExamData] = useState(null)
  const [daysRemaining, setDaysRemaining] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const res = await fetch('/api/roadmaps/masters/exam')
        if (res.ok) {
          const data = await res.json()
          if (data.active && data.nearestExam) {
            setExamData(data.nearestExam)
            const days = Math.ceil(
              (new Date(data.nearestExam.examDate) - new Date()) / (1000 * 60 * 60 * 24)
            )
            setDaysRemaining(days)
          }
        }
      } catch (error) {
        console.error('Error fetching exam data:', error)
      }
      setLoading(false)
    }

    fetchExamData()
    const interval = setInterval(fetchExamData, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  if (loading || !examData) return null

  const isUrgent = daysRemaining <= 7

  return (
    <Link href="/academics">
      <div
        className={`mx-4 my-4 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
          isUrgent
            ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
        }`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
            isUrgent ? 'text-red-600' : 'text-yellow-600'
          }`} />
          <div className="flex-1 min-w-0">
            <p className={`font-bold text-sm ${
              isUrgent ? 'text-red-800 dark:text-red-200' : 'text-yellow-800 dark:text-yellow-200'
            }`}>
              📚 {examData.examName}
            </p>
            <p className={`text-xs mt-1 ${
              isUrgent ? 'text-red-700 dark:text-red-300' : 'text-yellow-700 dark:text-yellow-300'
            }`}>
              {daysRemaining} days remaining • Click to focus
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
