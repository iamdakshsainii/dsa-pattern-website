'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ClipboardCheck, CheckCircle } from 'lucide-react'

const CHECKLIST_ITEMS = [
  {
    id: 'resumeReady',
    label: 'Resume updated and reviewed',
    description: 'Make sure your resume is current and error-free'
  },
  {
    id: 'linkedinUpdated',
    label: 'LinkedIn profile polished',
    description: 'Update your LinkedIn with latest experience'
  },
  {
    id: 'githubProfile',
    label: 'GitHub profile showcased',
    description: 'Pin your best projects and add READMEs'
  },
  {
    id: 'mockInterview',
    label: 'Practiced mock interviews',
    description: 'Do at least 2-3 mock technical interviews'
  },
  {
    id: 'behaviouralPrep',
    label: 'Prepared behavioral answers',
    description: 'Use STAR method for common questions'
  },
  {
    id: 'technicalPrep',
    label: 'Reviewed DSA concepts',
    description: 'Practice core patterns and algorithms'
  }
]

export default function InterviewChecklist() {
  const [checklist, setChecklist] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChecklist()
  }, [])

  const fetchChecklist = async () => {
    try {
      const response = await fetch('/api/interview-prep', {
        credentials: 'include',
        cache: 'no-store'
      })

      if (response.ok) {
        const data = await response.json()
        setChecklist(data.checklist || {})
      }
    } catch (error) {
      console.error('Failed to fetch checklist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (itemId) => {
    const newValue = !checklist[itemId]

    // Optimistic update
    setChecklist(prev => ({ ...prev, [itemId]: newValue }))

    try {
      await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          itemId,
          value: newValue
        })
      })
    } catch (error) {
      console.error('Failed to update checklist:', error)
      // Revert on error
      setChecklist(prev => ({ ...prev, [itemId]: !newValue }))
    }
  }

  const completedCount = Object.values(checklist).filter(Boolean).length
  const progress = (completedCount / CHECKLIST_ITEMS.length) * 100

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Interview Prep Checklist</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            {completedCount}/{CHECKLIST_ITEMS.length}
          </span>
          {completedCount === CHECKLIST_ITEMS.length && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
        </div>
      </div>

      <Progress value={progress} className="h-2 mb-6" />

      <div className="space-y-3">
        {CHECKLIST_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border transition-all ${
              checklist[item.id]
                ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={checklist[item.id] || false}
                onCheckedChange={() => handleToggle(item.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className={`font-medium ${
                  checklist[item.id] ? 'text-green-700 dark:text-green-300 line-through' : ''
                }`}>
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {completedCount === CHECKLIST_ITEMS.length && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
            🎉 Great job! You're interview ready. Good luck!
          </p>
        </div>
      )}
    </Card>
  )
}
