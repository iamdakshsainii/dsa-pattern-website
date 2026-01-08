"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"

export default function QuizPoolFilters({ onFilterChange, topics = [] }) {
  const [roadmaps, setRoadmaps] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    roadmap: 'all',
    difficulty: 'all',
    topic: 'all',
    source: 'all'
  })

  useEffect(() => {
    fetchRoadmaps()
  }, [])

  async function fetchRoadmaps() {
    try {
      const res = await fetch('/api/admin/roadmaps')
      const data = await res.json()
      setRoadmaps(data.roadmaps || [])
    } catch (error) {
      console.error('Failed to fetch roadmaps:', error)
    }
  }

  function handleChange(key, value) {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  function clearFilters() {
    const cleared = {
      search: '',
      roadmap: 'all',
      difficulty: 'all',
      topic: 'all',
      source: 'all'
    }
    setFilters(cleared)
    onFilterChange(cleared)
  }

  const hasActiveFilters = filters.search ||
                          filters.roadmap !== 'all' ||
                          filters.difficulty !== 'all' ||
                          filters.topic !== 'all' ||
                          filters.source !== 'all'

  return (
    <div className="space-y-4 flex-1">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[300px]">
          <label className="text-sm font-medium mb-2 block">Search Questions</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by question text or set name..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="w-[180px]">
          <label className="text-sm font-medium mb-2 block">Source</label>
          <Select value={filters.source} onValueChange={(v) => handleChange('source', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="pool">Pool Only</SelectItem>
              <SelectItem value="roadmap">From Roadmaps</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[200px]">
          <label className="text-sm font-medium mb-2 block">Roadmap</label>
          <Select value={filters.roadmap} onValueChange={(v) => handleChange('roadmap', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roadmaps</SelectItem>
              {roadmaps.map(roadmap => (
                <SelectItem key={roadmap.slug} value={roadmap.slug}>
                  {roadmap.icon} {roadmap.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[150px]">
          <label className="text-sm font-medium mb-2 block">Difficulty</label>
          <Select value={filters.difficulty} onValueChange={(v) => handleChange('difficulty', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[200px]">
          <label className="text-sm font-medium mb-2 block">Topic</label>
          <Select value={filters.topic} onValueChange={(v) => handleChange('topic', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map(topic => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
