'use client'

import { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import Link from 'next/link'

export default function AcademicsClient({ initialYears }) {
  const [selectedYear, setSelectedYear] = useState(null)
  const [semesters, setSemesters] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleYearSelect = async (year) => {
    setSelectedYear(year)
    setSelectedSemester(null)
    setSubjects([])

    const res = await fetch(`/api/academics?year=${year}`)
    const data = await res.json()
    setSemesters(data.semesters || [])
  }

  const handleSemesterSelect = async (semester) => {
    setSelectedSemester(semester)

    const res = await fetch(`/api/academics?year=${selectedYear}&semester=${semester}`)
    const data = await res.json()
    setSubjects(data.subjects || [])
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    const res = await fetch(`/api/academics?query=${encodeURIComponent(query)}`)
    const data = await res.json()
    setSearchResults(data.results || [])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          📚 Academic Resources
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Master your semester with curated resources</p>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search subjects, resources..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
            {searchResults.map((result, idx) => (
              <Link
                key={idx}
                href={`/academics/resources?year=${result.year}&semester=${result.semester}&subject=${encodeURIComponent(result.subject)}`}
              >
                <div className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer border-b dark:border-gray-700 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{result.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{result.subject}</p>
                      <p className="text-xs text-gray-500">Year {result.year} • Semester {result.semester}</p>
                    </div>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                      {result.resources?.length} resources
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Year Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {initialYears.map((year) => (
          <button
            key={year}
            onClick={() => handleYearSelect(year)}
            className={`p-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
              selectedYear === year
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-blue-500'
            }`}
          >
            Year {year}
          </button>
        ))}
      </div>

      {/* Semester Selection */}
      {selectedYear && semesters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {semesters.map((sem) => (
            <button
              key={sem}
              onClick={() => handleSemesterSelect(sem)}
              className={`p-8 rounded-xl transition-all duration-300 ${
                selectedSemester === sem
                  ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-xl scale-105'
                  : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500'
              }`}
            >
              <div className="text-3xl mb-2">📖</div>
              <h3 className="text-xl font-bold">Semester {sem}</h3>
              {selectedSemester === sem && subjects.length > 0 && (
                <p className="text-sm mt-2 opacity-90">{subjects.length} subjects</p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Subjects Grid */}
      {selectedSemester && subjects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            Year {selectedYear} • Semester {selectedSemester}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, idx) => (
              <Link
                key={idx}
                href={`/academics/resources?year=${subject.year}&semester=${subject.semester}&subject=${encodeURIComponent(subject.subject)}`}
              >
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105 cursor-pointer border border-gray-200 dark:border-gray-700">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                    <div className="text-4xl mb-3">{subject.icon}</div>
                    <h3 className="font-bold text-lg">{subject.subject}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {subject.resources?.length || 0} resources
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {subject.resources?.slice(0, 3).map((r, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                        >
                          {r.type === 'youtube' && '▶️'}
                          {r.type === 'notes' && '📝'}
                          {r.type === 'article' && '📄'}
                          {r.type === 'quantum' && '📖'}
                          {r.type}
                        </span>
                      ))}
                      {subject.resources?.length > 3 && (
                        <span className="text-xs text-gray-500">+{subject.resources.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!selectedYear && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Select a year to get started</p>
        </div>
      )}
    </div>
  )
}
