'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, X } from "lucide-react"

const CATEGORIES = [
  "All", "DSA", "Data Science", "Web Development",
  "Cybersecurity", "Mobile Development", "DevOps", "Machine Learning"
]

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"]

export default function RoadmapFilters({ onFilterChange, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    category: initialFilters.category || "All",
    difficulty: initialFilters.difficulty || "All",
    search: initialFilters.search || ""
  })

  const handleCategoryChange = (category) => {
    const newFilters = { ...filters, category }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleDifficultyChange = (difficulty) => {
    const newFilters = { ...filters, difficulty }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSearchChange = (e) => {
    const search = e.target.value
    const newFilters = { ...filters, search }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const newFilters = { category: "All", difficulty: "All", search: "" }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const hasActiveFilters = filters.category !== "All" ||
                          filters.difficulty !== "All" ||
                          filters.search !== ""

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search roadmaps..."
          value={filters.search}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Category
          </h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={filters.category === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className="text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Difficulty</h3>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((difficulty) => (
            <Button
              key={difficulty}
              variant={filters.difficulty === difficulty ? "default" : "outline"}
              size="sm"
              onClick={() => handleDifficultyChange(difficulty)}
              className="text-xs"
            >
              {difficulty}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
