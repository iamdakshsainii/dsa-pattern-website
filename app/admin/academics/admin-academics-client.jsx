'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Edit2, BarChart3 } from 'lucide-react'

const YEARS = [1, 2, 3, 4]
const SEMESTERS = [1, 2]
const RESOURCE_TYPES = ['youtube', 'notes', 'article', 'quantum']

export default function AdminAcademicsClient() {
  const [activeTab, setActiveTab] = useState('manage')
  const [selectedYear, setSelectedYear] = useState(1)
  const [selectedSemester, setSelectedSemester] = useState(1)
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [editingSubject, setEditingSubject] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    icon: '📚',
    resources: []
  })

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchSubjects()
    } else {
      fetchStats()
    }
  }, [selectedYear, selectedSemester, activeTab])

  const fetchSubjects = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/academics?year=${selectedYear}&semester=${selectedSemester}`)
      const data = await res.json()
      setSubjects(data.subjects || [])
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
    setLoading(false)
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/academics?analytics=true')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleDeleteSubject = async (subject) => {
    if (!confirm(`Delete "${subject}"?`)) return

    try {
      const res = await fetch('/api/admin/academics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          year: selectedYear,
          semester: selectedSemester,
          subject
        })
      })
      if (res.ok) {
        fetchSubjects()
      }
    } catch (error) {
      console.error('Error deleting subject:', error)
    }
  }

  const handleDeleteResource = async (subject, index) => {
    try {
      const res = await fetch('/api/admin/academics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteResource',
          year: selectedYear,
          semester: selectedSemester,
          subject,
          resourceIndex: index
        })
      })
      if (res.ok) {
        fetchSubjects()
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
    }
  }

  const handleSaveSubject = async () => {
    if (!formData.subject) {
      alert('Subject name required')
      return
    }

    try {
      const res = await fetch('/api/admin/academics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editingSubject ? 'update' : 'create',
          year: selectedYear,
          semester: selectedSemester,
          subject: editingSubject,
          data: {
            year: selectedYear,
            semester: selectedSemester,
            subject: formData.subject,
            icon: formData.icon,
            resources: formData.resources
          }
        })
      })

      if (res.ok) {
        setShowForm(false)
        setFormData({ subject: '', icon: '📚', resources: [] })
        setEditingSubject(null)
        fetchSubjects()
      }
    } catch (error) {
      console.error('Error saving subject:', error)
    }
  }

  const handleAddResource = () => {
    setFormData({
      ...formData,
      resources: [
        ...formData.resources,
        { type: 'youtube', title: '', url: '' }
      ]
    })
  }

  const handleResourceChange = (index, field, value) => {
    const updated = [...formData.resources]
    updated[index][field] = value
    setFormData({ ...formData, resources: updated })
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'manage'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 dark:text-gray-400'
          }`}
        >
          Manage Resources
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'stats'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 dark:text-gray-400'
          }`}
        >
          Statistics
        </button>
      </div>

      {activeTab === 'manage' && (
        <div>
          {/* Year & Semester Selection */}
          <div className="flex gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Year</label>
              <div className="flex gap-2">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    className={`px-4 py-2 rounded font-semibold transition-colors ${
                      selectedYear === y
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Semester</label>
              <div className="flex gap-2">
                {SEMESTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSemester(s)}
                    className={`px-4 py-2 rounded font-semibold transition-colors ${
                      selectedSemester === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Add New Subject Button */}
          <Button
            onClick={() => {
              setEditingSubject(null)
              setFormData({ subject: '', icon: '📚', resources: [] })
              setShowForm(true)
            }}
            className="mb-6 gap-2"
          >
            <Plus className="h-4 w-4" /> Add Subject
          </Button>

          {/* Form */}
          {showForm && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4">{editingSubject ? 'Edit' : 'New'} Subject</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Subject Name</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border dark:bg-slate-700 dark:border-gray-600 rounded"
                    placeholder="e.g., Data Structures"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border dark:bg-slate-700 dark:border-gray-600 rounded"
                    maxLength="2"
                  />
                </div>

                {/* Resources */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-semibold">Resources</label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAddResource}
                      className="gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {formData.resources.map((resource, idx) => (
                      <div key={idx} className="border dark:border-gray-600 rounded p-3 space-y-2">
                        <div className="flex gap-2">
                          <select
                            value={resource.type}
                            onChange={(e) => handleResourceChange(idx, 'type', e.target.value)}
                            className="flex-1 px-2 py-1 border dark:bg-slate-700 dark:border-gray-600 rounded text-sm"
                          >
                            {RESOURCE_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              setFormData({
                                ...formData,
                                resources: formData.resources.filter((_, i) => i !== idx)
                              })
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={resource.title}
                          onChange={(e) => handleResourceChange(idx, 'title', e.target.value)}
                          className="w-full px-2 py-1 border dark:bg-slate-700 dark:border-gray-600 rounded text-sm"
                          placeholder="Resource title"
                        />

                        <input
                          type="url"
                          value={resource.url}
                          onChange={(e) => handleResourceChange(idx, 'url', e.target.value)}
                          className="w-full px-2 py-1 border dark:bg-slate-700 dark:border-gray-600 rounded text-sm"
                          placeholder="URL"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSaveSubject} className="gap-2">
                    Save Subject
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Subjects List */}
          {loading ? (
            <p>Loading...</p>
          ) : subjects.length === 0 ? (
            <p className="text-gray-500">No subjects yet. Create one to get started.</p>
          ) : (
            <div className="space-y-4">
              {subjects.map((subject, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{subject.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{subject.subject}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{subject.resources?.length} resources</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSubject(subject.subject)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Resources Preview */}
                  <div className="space-y-2">
                    {subject.resources?.map((res, rIdx) => (
                      <div key={rIdx} className="flex justify-between items-center bg-gray-50 dark:bg-slate-700 p-2 rounded text-sm">
                        <span>{res.type} • {res.title}</span>
                        <button
                          onClick={() => handleDeleteResource(subject.subject, rIdx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div>
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Total Subjects</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalSubjects}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Total Resources</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalResources}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Average per Subject</h3>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalSubjects > 0 ? (stats.totalResources / stats.totalSubjects).toFixed(1) : 0}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
