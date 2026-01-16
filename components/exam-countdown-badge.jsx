'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

export default function ExamCountdownBadge({ userId, masterId }) {
  const [examData, setExamData] = useState(null)
  const [timeLeft, setTimeLeft] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExamMode() {
      if (!userId || !masterId) return

      try {
        const res = await fetch(`/api/roadmaps/masters/exam?userId=${userId}&masterId=${masterId}`)
        const data = await res.json()

        if (data.active) {
          setExamData(data.nearestExam)
        }
      } catch (error) {
        console.error('Exam fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExamMode()
  }, [userId, masterId])

  useEffect(() => {
    if (!examData) return

    const updateCountdown = () => {
      const now = new Date()
      const examDate = new Date(examData.examDate)
      const diff = examDate - now

      if (diff <= 0) {
        setTimeLeft('Exam time!')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 3) {
        setTimeLeft(`${days} days`)
      } else {
        setTimeLeft(`${hours}h ${minutes}m`)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [examData])

  if (loading || !examData) return null

  return (
    <div className="fixed top-20 right-6 z-40 animate-in slide-in-from-top-4 fade-in duration-500">
      <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl shadow-2xl p-4 min-w-[180px] border-2 border-orange-400/50">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">Exam Mode</span>
        </div>

        <div className="mb-3">
          <div className="text-2xl font-bold tracking-tight mb-1">
            {timeLeft}
          </div>
          <div className="text-xs opacity-90 truncate">
            {examData.examName}
          </div>
        </div>

        <Link
          href="/academics"
          className="block w-full text-center bg-white text-orange-600 hover:bg-orange-50 font-semibold text-xs py-2 rounded-lg transition-colors shadow-sm"
        >
          Focus on Academics
        </Link>
      </div>
    </div>
  )
}
