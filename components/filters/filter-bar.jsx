'use client'

import { Card } from "@/components/ui/card"
import DifficultyFilter from "./difficulty-filter"
import StatusFilter from "./status-filter"
import SearchFilter from "./search-filter"
import CompanyFilter from "./company-filter"
import TagFilter from "./tag-filter"
import ActiveFilters from "./active-filters"

export default function FilterBar({
  filters,
  onFilterChange,
  companies = [],
  tags = [],
  counts = {},
  showSearch = true,
  showCompany = true,
  showTag = true
}) {
  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const removeFilter = (key) => {
    const newFilters = { ...filters }
    if (key === 'search') {
      newFilters.search = ''
    } else {
      newFilters[key] = 'All'
    }
    onFilterChange(newFilters)
  }

  const clearAllFilters = () => {
    onFilterChange({
      difficulty: 'All',
      status: 'All',
      company: 'All',
      tag: 'All',
      search: ''
    })
  }

  return (
    <Card className="p-4 space-y-4">
      {/* Search Row */}
      {showSearch && (
        <div className="flex items-center gap-4">
          <SearchFilter
            value={filters.search}
            onChange={(value) => updateFilter('search', value)}
          />
        </div>
      )}

      {/* Filter Pills Row */}
      <div className="flex flex-wrap gap-4">
        <DifficultyFilter
          selected={filters.difficulty}
          onChange={(value) => updateFilter('difficulty', value)}
          counts={counts.difficulty}
        />

        <StatusFilter
          selected={filters.status}
          onChange={(value) => updateFilter('status', value)}
          counts={counts.status}
        />
      </div>

      {/* Dropdown Filters Row */}
      {(showCompany || showTag) && (companies.length > 0 || tags.length > 0) && (
        <div className="flex flex-wrap gap-4 items-center">
          {showCompany && companies.length > 0 && (
            <CompanyFilter
              selected={filters.company}
              onChange={(value) => updateFilter('company', value)}
              companies={companies}
            />
          )}

          {showTag && tags.length > 0 && (
            <TagFilter
              selected={filters.tag}
              onChange={(value) => updateFilter('tag', value)}
              tags={tags}
            />
          )}
        </div>
      )}

      {/* Active Filters */}
      <ActiveFilters
        filters={filters}
        onRemove={removeFilter}
        onClearAll={clearAllFilters}
      />
    </Card>
  )
}
