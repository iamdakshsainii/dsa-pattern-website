'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Play, FileText, BookOpen, Lightbulb, Award } from 'lucide-react'

const resourceIcons = {
  youtube: <Play className="h-5 w-5" />,
  notes: <FileText className="h-5 w-5" />,
  article: <BookOpen className="h-5 w-5" />,
  quantum: <Award className="h-5 w-5" />
}

const resourceColors = {
  youtube: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20',
  notes: 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20',
  article: 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20',
  quantum: 'border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-900/20'
}

export default function SemesterDetailClient({ year, semester, subjects, selectedSubjectParam }) {
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [expandedSubject, setExpandedSubject] = useState(selectedSubjectParam || null)

  useEffect(() => {
    if (selectedSubjectParam && subjects.length > 0) {
      const found = subjects.find(s => s.subject === decodeURIComponent(selectedSubjectParam))
      if (found) {
        setSelectedSubject(found)
        setExpandedSubject(found.subject)
      }
    }
  }, [selectedSubjectParam, subjects])

  const groupedResources = selectedSubject
    ? {
        youtube: selectedSubject.resources?.filter(r => r.type === 'youtube') || [],
        notes: selectedSubject.resources?.filter(r => r.type === 'notes') || [],
        article: selectedSubject.resources?.filter(r => r.type === 'article') || [],
        quantum: selectedSubject.resources?.filter(r => r.type === 'quantum') || []
      }
    : {}

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 sticky top-20">
          <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Subjects</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {subjects.map((subject, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedSubject(subject)
                  setExpandedSubject(subject.subject)
                }}
                className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                  expandedSubject === subject.subject
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600'
                }`}
              >
                <div className="text-xl mb-1">{subject.icon}</div>
                <p className="text-sm font-semibold">{subject.subject}</p>
                <p className="text-xs opacity-75">{subject.resources?.length} resources</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-3">
        {selectedSubject ? (
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-5xl">{selectedSubject.icon}</span>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{selectedSubject.subject}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Year {year} • Semester {semester}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedSubject.resources?.length} resources to help you master this subject
              </p>
            </div>

            {/* YouTube Playlists */}
            {groupedResources.youtube?.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-red-600">▶️</span> YouTube Playlists
                </h3>
                <div className="space-y-4">
                  {groupedResources.youtube.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block p-4 rounded-lg border-2 ${resourceColors.youtube} hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white">{resource.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Complete playlist for comprehensive learning</p>
                        </div>
                        <ExternalLink className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Handwritten Notes */}
            {groupedResources.notes?.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-blue-600">📝</span> Handwritten Notes
                </h3>
                <div className="space-y-4">
                  {groupedResources.notes.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block p-4 rounded-lg border-2 ${resourceColors.notes} hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white">{resource.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">PDF • Easy to download and annotate</p>
                        </div>
                        <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Articles & Guides */}
            {groupedResources.article?.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-green-600">📄</span> Articles & Guides
                </h3>
                <div className="space-y-4">
                  {groupedResources.article.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block p-4 rounded-lg border-2 ${resourceColors.article} hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white">{resource.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quick reference and detailed explanations</p>
                        </div>
                        <BookOpen className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Short Books & Quantums */}
            {groupedResources.quantum?.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-purple-600">📖</span> Short Books & Quantum Series
                </h3>
                <div className="space-y-4">
                  {groupedResources.quantum.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block p-4 rounded-lg border-2 ${resourceColors.quantum} hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white">{resource.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Condensed version for quick revision</p>
                        </div>
                        <Award className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Select a subject from the list to view resources</p>
          </div>
        )}
      </div>
    </div>
  )
}
