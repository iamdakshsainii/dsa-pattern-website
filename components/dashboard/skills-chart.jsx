'use client'

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target } from 'lucide-react'
import Link from 'next/link'

export default function SkillsChart({ patterns }) {
  if (!patterns || patterns.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Skills Progress
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No patterns available</p>
        </div>
      </Card>
    )
  }

  // Sort patterns by completion percentage (descending)
  const sortedPatterns = [...patterns].sort((a, b) => b.percentage - a.percentage)

  // Show top 6 patterns
  const displayPatterns = sortedPatterns.slice(0, 6)

  const getProgressColor = (percentage) => {
    if (percentage === 0) return 'bg-gray-300'
    if (percentage < 30) return 'bg-red-500'
    if (percentage < 60) return 'bg-yellow-500'
    if (percentage < 100) return 'bg-blue-500'
    return 'bg-green-500'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Skills Progress
        </h3>
        <Link href="/patterns">
          <button className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
            View All →
          </button>
        </Link>
      </div>

      <div className="space-y-4">
        {displayPatterns.map((pattern, index) => (
          <Link
            key={pattern.slug}
            href={`/patterns/${pattern.slug}`}
            className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400 w-6">#{index + 1}</span>
                <span className="font-semibold text-sm">{pattern.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {pattern.solved}/{pattern.total}
                </Badge>
                <span className={`text-xs font-bold ${
                  pattern.percentage === 100 ? 'text-green-600' :
                  pattern.percentage >= 60 ? 'text-blue-600' :
                  pattern.percentage >= 30 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {Math.round(pattern.percentage)}%
                </span>
              </div>
            </div>

            <div className="relative">
              <Progress value={pattern.percentage} className="h-2" />
              <div
                className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(pattern.percentage)}`}
                style={{ width: `${pattern.percentage}%` }}
              />
            </div>

            {pattern.percentage === 100 && (
              <div className="mt-2 flex items-center gap-1 text-green-600 text-xs font-medium">
                <span>✓</span>
                <span>Mastered</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {patterns.length > 6 && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          Showing top 6 of {patterns.length} patterns
        </p>
      )}
    </Card>
  )
}
