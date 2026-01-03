'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { X } from "lucide-react"
import DifficultyFilter from "@/components/filters/difficulty-filter"
import CompanyFilter from "@/components/filters/company-filter"
import TagFilter from "@/components/filters/tag-filter"

export default function FilterDrawer({
  open,
  onOpenChange,
  filters,
  onFilterChange,
  companies = [],
  tags = [],
  showCompany = true,
  showTag = true
}) {
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

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== ''
    return value !== 'All'
  }).length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-2">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          <SheetDescription>
            Refine your problem search
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Difficulty</h3>
            <div className="flex flex-col gap-2">
              {['All', 'Easy', 'Medium', 'Hard'].map(diff => {
                const getColor = () => {
                  switch(diff) {
                    case 'Easy': return 'border-green-500 bg-green-50 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300'
                    case 'Medium': return 'border-yellow-500 bg-yellow-50 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300'
                    case 'Hard': return 'border-red-500 bg-red-50 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300'
                    default: return ''
                  }
                }

                return (
                  <Button
                    key={diff}
                    variant={filters.difficulty === diff ? "default" : "outline"}
                    className={`w-full justify-start h-12 ${
                      filters.difficulty !== diff ? getColor() : ''
                    }`}
                    onClick={() => updateFilter('difficulty', diff)}
                  >
                    {diff}
                  </Button>
                )
              })}
            </div>
          </div>

          {showCompany && companies.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Company</h3>
              <CompanyFilter
                selected={filters.company}
                onChange={(value) => updateFilter('company', value)}
                companies={companies}
              />
            </div>
          )}

          {showTag && tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Tags</h3>
              <TagFilter
                selected={filters.tag}
                onChange={(value) => updateFilter('tag', value)}
                tags={tags}
              />
            </div>
          )}
        </div>

        <SheetFooter className="flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
          <Button
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
