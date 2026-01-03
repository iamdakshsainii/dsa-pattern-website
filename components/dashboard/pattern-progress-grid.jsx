'use client'

import Link from 'next/link'
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Grid3x3, CheckCircle2, Circle } from 'lucide-react'

export default function PatternProgressGrid({ patterns }) {
  if (!patterns || patterns.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Grid3x3 className="h-5 w-5" />
          All Patterns
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No patterns available</p>
        </div>
      </Card>
    )
  }

  const completedPatterns = patterns.filter(p => p.percentage === 100).length
  const inProgressPatterns = patterns.filter(p => p.percentage > 0 && p.percentage < 100).length
  const notStartedPatterns = patterns.filter(p => p.percentage === 0).length

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Grid3x3 className="h-5 w-5 text-purple-600" />
          All Patterns
        </h3>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-600">{completedPatterns} done</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">{inProgressPatterns} in progress</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <span className="text-gray-600">{notStartedPatterns} not started</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
        {patterns.map((pattern) => (
          <Link
            key={pattern.slug}
            href={`/patterns/${pattern.slug}`}
            className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-2 flex-1">
                {pattern.percentage === 100 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : pattern.percentage > 0 ? (
                  <Circle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                )}
                <span className="font-semibold text-sm leading-tight">{pattern.name}</span>
              </div>
              <Badge
                variant="outline"
                className={`text-xs ml-2 flex-shrink-0 ${
                  pattern.percentage === 100 ? 'bg-green-50 text-green-700 border-green-300' :
                  pattern.percentage > 0 ? 'bg-blue-50 text-blue-700 border-blue-300' :
                  'bg-gray-50 text-gray-600 border-gray-300'
                }`}
              >
                {pattern.solved}/{pattern.total}
              </Badge>
            </div>

            <Progress value={pattern.percentage} className="h-1.5 mb-2" />

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{Math.round(pattern.percentage)}% complete</span>
              {pattern.percentage > 0 && pattern.percentage < 100 && (
                <span className="text-blue-600 font-medium">
                  {pattern.total - pattern.solved} left
                </span>
              )}
              {pattern.percentage === 100 && (
                <span className="text-green-600 font-medium">✓ Completed</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
