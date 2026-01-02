"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ApproachCard from "./approach-card"
import { ChevronRight } from "lucide-react"

export default function SolutionTabs({ approaches }) {
  const [selectedApproach, setSelectedApproach] = useState(0)

  if (!approaches || approaches.length === 0) {
    return null
  }

  // Sort approaches by order
  const sortedApproaches = [...approaches].sort((a, b) => a.order - b.order)

  const getApproachBadgeColor = (order, isSelected) => {
    const baseClass = "transition-all duration-200"
    if (isSelected) {
      if (order === 1) return `${baseClass} bg-red-600 text-white hover:bg-red-700`
      if (order === sortedApproaches.length)
        return `${baseClass} bg-green-600 text-white hover:bg-green-700`
      return `${baseClass} bg-yellow-600 text-white hover:bg-yellow-700`
    }
    if (order === 1) return `${baseClass} bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400`
    if (order === sortedApproaches.length)
      return `${baseClass} bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400`
    return `${baseClass} bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400`
  }

  const getApproachLabel = (order) => {
    if (order === 1) return "Brute Force"
    if (order === sortedApproaches.length) return "Optimal"
    return "Better"
  }

  return (
    <div className="space-y-6">
      {/* Approach Selector */}
      <Card className="p-6 border-blue-200 dark:border-blue-900">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Choose an Approach
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            {sortedApproaches.map((approach, index) => (
              <Button
                key={index}
                onClick={() => setSelectedApproach(index)}
                className={getApproachBadgeColor(approach.order, selectedApproach === index)}
                size="lg"
              >
                <span className="font-semibold">
                  {getApproachLabel(approach.order)}
                </span>
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
            <span>Brute Force (Slow)</span>
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 ml-4"></span>
            <span>Better (Optimized)</span>
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 ml-4"></span>
            <span>Optimal (Best)</span>
          </div>
        </div>
      </Card>

      {/* Selected Approach Details */}
      <ApproachCard
        approach={sortedApproaches[selectedApproach]}
        number={selectedApproach + 1}
        total={sortedApproaches.length}
      />

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setSelectedApproach(Math.max(0, selectedApproach - 1))}
          disabled={selectedApproach === 0}
          className="gap-2"
        >
          ← Previous Approach
        </Button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {selectedApproach + 1} of {sortedApproaches.length}
        </span>
        <Button
          variant="outline"
          onClick={() =>
            setSelectedApproach(Math.min(sortedApproaches.length - 1, selectedApproach + 1))
          }
          disabled={selectedApproach === sortedApproaches.length - 1}
          className="gap-2"
        >
          Next Approach →
        </Button>
      </div>
    </div>
  )
}
