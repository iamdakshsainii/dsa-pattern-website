// app/roadmaps/roadmaps-client.jsx
'use client'

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import RoadmapCard from "@/components/roadmaps/roadmap-card"
import RoadmapFilters from "@/components/roadmaps/roadmap-filters"
import { MapPin, Sparkles } from "lucide-react"

export default function RoadmapsClient({
  initialRoadmaps,
  userActiveRoadmaps,
  currentUser
}) {
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
    return userActiveRoadmaps?.find(r => r.roadmapId === roadmapId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">

      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl relative z-10">

        <div className="mb-8 sm:mb-12 relative">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <div className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg transform group-hover:scale-110 transition duration-300">
                <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-foreground animate-in fade-in slide-in-from-bottom-3 duration-700">
              Learning Roadmaps
            </h1>
          </div>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 ml-16 sm:ml-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Choose your path to mastery. Structured learning for every goal.
          </p>
        </div>

        {currentUser && userActiveRoadmaps && userActiveRoadmaps.length > 0 && (
          <div className="relative mb-8 sm:mb-12 group animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500 animate-gradient-x"></div>
            <Card className="relative p-6 sm:p-8 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

              <div className="relative flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg shadow-lg animate-pulse">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-foreground">
                  Continue Learning
                </h2>
              </div>

              <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userActiveRoadmaps
                  .filter(active => active.roadmap !== null)
                  .map((active) => (
                    <Card key={active.roadmapId} className="p-5 hover:shadow-lg transition-shadow bg-white dark:bg-slate-900">
                      <Link href={`/roadmaps/${active.roadmap.slug}`}>
                        <div className="flex items-start gap-4 mb-4">
                          <div className="text-3xl">{active.roadmap.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {active.roadmap.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {active.roadmap.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="font-semibold text-pink-600">
                              {active.overallProgress}%
                            </span>
                          </div>
                          <Progress value={active.overallProgress} className="h-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {active.completedNodes} of {active.totalNodes} topics completed
                          </p>
                        </div>
                      </Link>
                    </Card>
                  ))}
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 animate-in fade-in slide-in-from-left-5 duration-700 delay-300">
            <div className="lg:sticky lg:top-6 transition-all duration-300">
              <Card className="p-6 border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <h2 className="relative text-lg font-bold mb-5 text-slate-900 dark:text-slate-50">
                  Filters
                </h2>
                <div className="relative">
                  <RoadmapFilters
                    onFilterChange={handleFilterChange}
                    initialFilters={filters}
                  />
                </div>
              </Card>
            </div>
          </aside>

          <main className="lg:col-span-3 animate-in fade-in slide-in-from-right-5 duration-700 delay-300">
            <div className="mb-6 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-full border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Showing {roadmaps.length} roadmap{roadmaps.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {roadmaps.length === 0 ? (
              <Card className="p-12 sm:p-16 text-center border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-base text-slate-600 dark:text-slate-400">
                    No roadmaps found matching your filters
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {roadmaps.map((roadmap, idx) => (
                  <div
                    key={roadmap._id}
                    className="animate-in fade-in slide-in-from-bottom-6 duration-500 hover:scale-[1.02] transition-transform"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <RoadmapCard
                      roadmap={roadmap}
                      userProgress={getUserProgress(roadmap.slug)}
                    />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
