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
          className="px-6 py-3 border-2 border-border rounded-xl font-semibold hover:bg-accent inline-flex items-center gap-2"
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
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ChevronUp className="h-4 w-4" />
          Collapse
        </button>
      </div>

      <div className="overflow-x-auto bg-card border-2 border-border rounded-xl">
        <table className="w-full">
          <thead className="bg-muted border-b-2 border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Sheet Name
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-accent"
                onClick={() => handleSort('time')}
              >
                Time {sortBy === 'time' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-accent"
                onClick={() => handleSort('problems')}
              >
                Problems {sortBy === 'problems' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Coverage
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Best For
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedSheets.map((sheet, index) => (
              <tr key={index} className="hover:bg-accent">
                <td className="px-6 py-4">
                  <div className="font-semibold">{sheet.name}</div>
                  <div className="text-xs text-muted-foreground">{sheet.difficulty}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xl">{getTimeIndicator(sheet.count)}</span>
                </td>
                <td className="px-6 py-4 font-semibold">
                  {sheet.count}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    getCoverage(sheet.count) === 'Core' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                    getCoverage(sheet.count) === 'Wide' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                    'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                  }`}>
                    {getCoverage(sheet.count)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs">
                  {sheet.description.substring(0, 50)}...
                </td>
                <td className="px-6 py-4">
                  <a
                    href={sheet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm"
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
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Pick ONE sheet based on your timeline and stick with it
        </p>
      </div>
    </div>
  )
}
