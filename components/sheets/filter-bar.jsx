'use client'

import { useState } from 'react'

export default function FilterBar({ onFilterChange, matchCount, totalCount }) {
  const [filters, setFilters] = useState({
    timeline: 'all',
    goal: 'all',
    level: 'all'
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const resetFilters = { timeline: 'all', goal: 'all', level: 'all' }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== 'all')

  return (
    <div className="bg-card border-2 border-border rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">🔍 Find Your Sheet</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            ⏰ Timeline
          </label>
          <select
            value={filters.timeline}
            onChange={(e) => handleFilterChange('timeline', e.target.value)}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:border-purple-600 focus:outline-none bg-background"
          >
            <option value="all">Any timeline</option>
            <option value="short">Under 1 month</option>
            <option value="medium">1-3 months</option>
            <option value="long">3+ months</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            🎯 Goal
          </label>
          <select
            value={filters.goal}
            onChange={(e) => handleFilterChange('goal', e.target.value)}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:border-purple-600 focus:outline-none bg-background"
          >
            <option value="all">Any goal</option>
            <option value="interview">Interview prep</option>
            <option value="learning">Deep learning</option>
            <option value="competitive">Competitive programming</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            📊 Your Level
          </label>
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:border-purple-600 focus:outline-none bg-background"
          >
            <option value="all">Any level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Showing <span className="font-semibold text-purple-600 dark:text-purple-400">{matchCount}</span> of {totalCount} sheets
        </span>
        {hasActiveFilters && (
          <span className="text-muted-foreground">
            Active filters: {Object.values(filters).filter(v => v !== 'all').length}
          </span>
        )}
      </div>
    </div>
  )
}
