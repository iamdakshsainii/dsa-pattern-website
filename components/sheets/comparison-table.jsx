'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

export default function ComparisonTable({ sheets }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [sortBy, setSortBy] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortOrder('asc')
    }
  }

  const getSortValue = (sheet, key) => {
    switch (key) {
      case 'time':
        return sheet.count
      case 'problems':
        return sheet.count
      default:
        return sheet[key]
    }
  }

  const sortedSheets = [...sheets].sort((a, b) => {
    if (!sortBy) return 0
    const aVal = getSortValue(a, sortBy)
    const bVal = getSortValue(b, sortBy)
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
  })

  const getTimeIndicator = (count) => {
    if (count < 100) return '⚡⚡'
    if (count < 200) return '⚡⚡⚡'
    return '⚡⚡⚡⚡⚡'
  }

  const getCoverage = (count) => {
    if (count < 100) return 'Core'
    if (count < 200) return 'Wide'
    return 'Full'
  }

  if (!isExpanded) {
    return (
      <div className="text-center py-8">
        <button
          onClick={() => setIsExpanded(true)}
          className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 inline-flex items-center gap-2"
        >
          <ChevronDown className="h-5 w-5" />
          View Detailed Comparison Table
        </button>
      </div>
    )
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">📊 Side-by-Side Comparison</h2>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
        >
          <ChevronUp className="h-4 w-4" />
          Collapse
        </button>
      </div>

      <div className="overflow-x-auto bg-white border-2 border-gray-200 rounded-xl">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Sheet Name
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('time')}
              >
                Time {sortBy === 'time' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('problems')}
              >
                Problems {sortBy === 'problems' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Coverage
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Best For
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedSheets.map((sheet, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{sheet.name}</div>
                  <div className="text-xs text-gray-500">{sheet.difficulty}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xl">{getTimeIndicator(sheet.count)}</span>
                </td>
                <td className="px-6 py-4 font-semibold">
                  {sheet.count}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    getCoverage(sheet.count) === 'Core' ? 'bg-blue-100 text-blue-800' :
                    getCoverage(sheet.count) === 'Wide' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {getCoverage(sheet.count)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  {sheet.description.substring(0, 50)}...
                </td>
                <td className="px-6 py-4">
                  <a
                    href={sheet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    View
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          💡 <strong>Tip:</strong> Pick ONE sheet based on your timeline and stick with it
        </p>
      </div>
    </div>
  )
}
