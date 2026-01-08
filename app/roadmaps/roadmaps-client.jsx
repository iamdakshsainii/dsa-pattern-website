'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import RoadmapCard from "@/components/roadmaps/roadmap-card"
import RoadmapFilters from "@/components/roadmaps/roadmap-filters"
import { MapPin, Sparkles } from "lucide-react"

export default function RoadmapsClient({ initialRoadmaps, userActiveRoadmaps, currentUser }) {
  const [roadmaps, setRoadmaps] = useState(initialRoadmaps)
  const [filters, setFilters] = useState({ category: "All", difficulty: "All", search: "" })

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)

    let filtered = initialRoadmaps

    if (newFilters.category !== "All") {
      filtered = filtered.filter(r => r.category === newFilters.category)
    }

    if (newFilters.difficulty !== "All") {
      filtered = filtered.filter(r => r.difficulty === newFilters.difficulty)
    }

    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase()
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower) ||
        r.category.toLowerCase().includes(searchLower)
      )
    }

    setRoadmaps(filtered)
  }

  const getUserProgress = (roadmapId) => {
    return userActiveRoadmaps.find(r => r.roadmapId === roadmapId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Learning Roadmaps</h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
            Choose your path to mastery. Structured learning for every goal.
          </p>
        </div>

        {currentUser && userActiveRoadmaps.length > 0 && (
          <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">Continue Learning</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userActiveRoadmaps.slice(0, 3).map((progress) => (
                <RoadmapCard
                  key={progress.roadmapId}
                  roadmap={progress.roadmap}
                  userProgress={progress}
                />
              ))}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          <aside className="lg:col-span-1">
            <Card className="p-4 sm:p-6 lg:sticky lg:top-4">
              <h2 className="text-base sm:text-lg font-semibold mb-4">Filters</h2>
              <RoadmapFilters
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />
            </Card>
          </aside>

          <main className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {roadmaps.length} roadmap{roadmaps.length !== 1 ? 's' : ''}
              </p>
            </div>

            {roadmaps.length === 0 ? (
              <Card className="p-8 sm:p-12 text-center">
                <p className="text-sm sm:text-base text-muted-foreground mb-4">No roadmaps found matching your filters</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {roadmaps.map((roadmap) => (
                  <RoadmapCard
                    key={roadmap._id}
                    roadmap={roadmap}
                    userProgress={getUserProgress(roadmap.slug)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
