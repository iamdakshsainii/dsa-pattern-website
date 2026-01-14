'use client'

import { useState, useEffect } from 'react'
import { Calendar, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function ExamCalendarDialog({ userId, masterId, isOpen, onClose }) {
  const [exams, setExams] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    examName: '',
    examDate: '',
    hideProjects: true
  })

  useEffect(() => {
    if (isOpen) {
      fetchExams()
    }
  }, [isOpen])

  async function fetchExams() {
    try {
      const res = await fetch(`/api/roadmaps/masters/exam?userId=${userId}&masterId=${masterId}`)
      const data = await res.json()
      setExams(data.allExams || [])
    } catch (error) {
      console.error('Fetch exams error:', error)
    }
  }

  async function handleAdd() {
    try {
      const res = await fetch('/api/roadmaps/masters/exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterId,
          examName: formData.examName,
          examDate: formData.examDate,
          hideProjects: formData.hideProjects
        })
      })

      if (res.ok) {
        await fetchExams()
        setShowForm(false)
        setFormData({ examName: '', examDate: '', hideProjects: true })
      }
    } catch (error) {
      console.error('Add exam error:', error)
    }
  }

  async function handleDelete(index) {
    try {
      const res = await fetch(`/api/roadmaps/masters/exam?masterId=${masterId}&index=${index}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        await fetchExams()
      }
    } catch (error) {
      console.error('Delete exam error:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Exam Calendar
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {exams.length === 0 && !showForm && (
            <p className="text-center text-gray-500 py-8">No upcoming exams</p>
          )}

          {exams.map((exam, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{exam.name}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(exam.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              {exam.hideProjects && (
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  ✓ Projects will be hidden
                </p>
              )}
            </div>
          ))}

          {showForm && (
            <div className="border rounded-lg p-4 space-y-3">
              <input
                type="text"
                placeholder="Exam Name"
                value={formData.examName}
                onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="date"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hideProjects}
                  onChange={(e) => setFormData({ ...formData, hideProjects: e.target.checked })}
                />
                <span className="text-sm">Hide projects during exam mode</span>
              </label>
              <div className="flex gap-2">
                <Button onClick={handleAdd} className="flex-1">Add Exam</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {!showForm && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Exam Date
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
