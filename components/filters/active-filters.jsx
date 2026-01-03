// Replace: components/filters/active-filters.jsx

'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function ActiveFilters({ filters, onRemove, onClearAll, hideStatus = false }) {
  const activeFilters = []

  // Difficulty
  if (filters.difficulty && filters.difficulty !== 'All') {
    activeFilters.push({
      key: 'difficulty',
      label: filters.difficulty,
      value: filters.difficulty
    })
  }

  // Status - ONLY if NOT hidden
  if (!hideStatus && filters.status && filters.status !== 'All') {
    activeFilters.push({
      key: 'status',
      label: filters.status,
      value: filters.status
    })
  }

  // Company
  if (filters.company && filters.company !== 'All') {
    activeFilters.push({
      key: 'company',
      label: filters.company,
      value: filters.company
    })
  }

  // Tag
  if (filters.tag && filters.tag !== 'All') {
    activeFilters.push({
      key: 'tag',
      label: filters.tag,
      value: filters.tag
    })
  }

  // Search
  if (filters.search) {
    activeFilters.push({
      key: 'search',
      label: `Search: "${filters.search}"`,
      value: filters.search
    })
  }

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Active:</span>
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="gap-1 pr-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
          onClick={() => onRemove(filter.key)}
        >
          {filter.label}
          <X className="h-3 w-3" />
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 text-xs"
      >
        Clear all
      </Button>
    </div>
  )
}
