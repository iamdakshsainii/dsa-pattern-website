'use client'

import { Card } from "@/components/ui/card"
import DifficultyFilter from "./difficulty-filter"
import StatusFilter from "./status-filter"
import SearchFilter from "./search-filter"
import CompanyFilter from "./company-filter"
import TagFilter from "./tag-filter"
import ActiveFilters from "./active-filters"
import MobileFilterBar from "@/components/mobile/mobile-filter-bar"

export default function FilterBar({
  filters,
  onFilterChange,
  companies = [],
  tags = [],
  counts = {},
  showSearch = true,
  showCompany = true,
  showTag = true,
  hideStatus = false
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
      status: hideStatus ? undefined : 'All',
      company: 'All',
      tag: 'All',
      search: ''
    })
  }

  return (
    <>
      <div className="block md:hidden">
        <MobileFilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          companies={companies}
          tags={tags}
          showSearch={showSearch}
          showCompany={showCompany}
          showTag={showTag}
        />
      </div>

      <Card className="hidden md:block p-4 space-y-4 max-w-4xl mx-auto">
        {showSearch && (
          <div className="flex items-center gap-4">
            <SearchFilter
              value={filters.search}
              onChange={(value) => updateFilter('search', value)}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center">
          <DifficultyFilter
            selected={filters.difficulty}
            onChange={(value) => updateFilter('difficulty', value)}
            counts={counts.difficulty}
          />

          {!hideStatus && (
            <StatusFilter
              selected={filters.status}
              onChange={(value) => updateFilter('status', value)}
              counts={counts.status}
            />
          )}
        </div>

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

        <div className="flex justify-center">
          <ActiveFilters
            filters={filters}
            onRemove={removeFilter}
            onClearAll={clearAllFilters}
            hideStatus={hideStatus}
          />
        </div>
      </Card>
    </>
  )
}
