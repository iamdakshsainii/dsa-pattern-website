// Replace: components/filters/filter-bar.jsx

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
  showTag = true,
  hideStatus = false // ✅ NEW PROP to hide status filter
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
      status: hideStatus ? undefined : 'All', // Don't include status if hidden
      company: 'All',
      tag: 'All',
      search: ''
    })
  }

  return (
    // ✅ CENTERED with max-w-4xl and mx-auto
    <Card className="p-4 space-y-4 max-w-4xl mx-auto">
      {/* Search Row */}
      {showSearch && (
        <div className="flex items-center gap-4">
          <SearchFilter
            value={filters.search}
            onChange={(value) => updateFilter('search', value)}
          />
        </div>
      )}

      {/* Filter Pills Row - CENTERED */}
      <div className="flex flex-wrap gap-4 justify-center">
        <DifficultyFilter
          selected={filters.difficulty}
          onChange={(value) => updateFilter('difficulty', value)}
          counts={counts.difficulty}
        />

        {/* ✅ ONLY show status filter if NOT hidden */}
        {!hideStatus && (
          <StatusFilter
            selected={filters.status}
            onChange={(value) => updateFilter('status', value)}
            counts={counts.status}
          />
        )}
      </div>

      {/* Dropdown Filters Row - CENTERED */}
      {(showCompany || showTag) && (companies.length > 0 || tags.length > 0) && (
        <div className="flex flex-wrap gap-4 items-center justify-center">
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

      {/* Active Filters - CENTERED */}
      <div className="flex justify-center">
        <ActiveFilters
          filters={filters}
          onRemove={removeFilter}
          onClearAll={clearAllFilters}
          hideStatus={hideStatus}
        />
      </div>
    </Card>
  )
}
