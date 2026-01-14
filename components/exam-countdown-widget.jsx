'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

export default function ExamCountdownWidget({ userId, masterId }) {
  const [examData, setExamData] = useState(null)
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

  if (loading || !examData) return null

  const daysRemaining = Math.ceil((new Date(examData.examDate) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 text-white shadow-lg">
      <div className="flex items-start gap-3">
        <Calendar className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">Exam Mode Active</h4>
          <p className="text-xs opacity-90 mb-2">{examData.examName}</p>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span className="font-bold">{daysRemaining} days remaining</span>
          </div>
        </div>
      </div>
      <Link
        href="/academics"
        className="mt-3 block w-full bg-white text-orange-600 text-center py-2 rounded font-semibold text-sm hover:bg-orange-50 transition-colors"
      >
        Focus on Academics
      </Link>
    </div>
  )
}
