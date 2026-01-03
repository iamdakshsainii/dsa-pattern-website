'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"
import FilterDrawer from "./filter-drawer"
import SearchFilter from "@/components/filters/search-filter"

export default function MobileFilterBar({
  filters,
  onFilterChange,
  companies = [],
  tags = [],
  showSearch = true,
  showCompany = true,
  showTag = true
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== ''
    return value !== 'All'
  }).length

  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const clearAllFilters = () => {
    onFilterChange({
      difficulty: 'All',
      company: 'All',
      tag: 'All',
      search: ''
    })
  }

  return (
    <>
      <div className="space-y-3">
        {showSearch && (
          <SearchFilter
            value={filters.search}
            onChange={(value) => updateFilter('search', value)}
          />
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex-1 justify-between h-11"
            onClick={() => setDrawerOpen(true)}
          >
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </span>
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11"
              onClick={clearAllFilters}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.difficulty !== 'All' && (
              <Badge variant="secondary" className="gap-1">
                {filters.difficulty}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter('difficulty', 'All')}
                />
              </Badge>
            )}
            {filters.company !== 'All' && (
              <Badge variant="secondary" className="gap-1">
                {filters.company}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter('company', 'All')}
                />
              </Badge>
            )}
            {filters.tag !== 'All' && (
              <Badge variant="secondary" className="gap-1">
                {filters.tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter('tag', 'All')}
                />
              </Badge>
            )}
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.search.slice(0, 20)}
                {filters.search.length > 20 && '...'}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter('search', '')}
                />
              </Badge>
            )}
          </div>
        )}
      </div>

      <FilterDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        filters={filters}
        onFilterChange={onFilterChange}
        companies={companies}
        tags={tags}
        showCompany={showCompany}
        showTag={showTag}
      />
    </>
  )
}
