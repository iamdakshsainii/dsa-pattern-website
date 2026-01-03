'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function ActiveFilters({ filters, onRemove, onClearAll }) {
  const activeFilters = []

  if (filters.difficulty && filters.difficulty !== 'All') {
    activeFilters.push({ key: 'difficulty', label: filters.difficulty })
  }
  if (filters.status && filters.status !== 'All') {
    activeFilters.push({ key: 'status', label: filters.status })
  }
  if (filters.company && filters.company !== 'All') {
    activeFilters.push({ key: 'company', label: filters.company })
  }
  if (filters.tag && filters.tag !== 'All') {
    activeFilters.push({ key: 'tag', label: filters.tag })
  }
  if (filters.search) {
    activeFilters.push({ key: 'search', label: `"${filters.search}"` })
  }

  if (activeFilters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {activeFilters.map(({ key, label }) => (
        <Badge
          key={key}
          variant="secondary"
          className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
        >
          {label}
          <button
            onClick={() => onRemove(key)}
            className="ml-1 rounded-full hover:bg-background/50 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-7 text-xs"
      >
        Clear all
      </Button>
    </div>
  )
}
