'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, Flame, Target } from "lucide-react"

export default function MobileProgressFooter({
  roadmap,
  nodes,
  userProgress,
  overallProgress
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const currentStreak = userProgress?.streaks?.current || 0
  const completedCount = userProgress?.nodesProgress?.filter(n => n.status === "completed").length || 0

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="h-full overflow-y-auto p-4">
          <div className="max-w-md mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Progress</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Overall Progress */}
            <Card className="p-4">
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{Math.round(overallProgress)}%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
              <Progress value={overallProgress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center mt-2">
                {completedCount} of {nodes.length} topics completed
              </p>
            </Card>

            {/* Streak */}
            {currentStreak > 0 && (
              <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{currentStreak} days</p>
                    <p className="text-sm text-muted-foreground">Current streak!</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Stats */}
            <Card className="p-4">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Quick Stats
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Topics</span>
                  <span className="font-medium">{nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium text-green-600">{completedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">In Progress</span>
                  <span className="font-medium text-blue-600">
                    {userProgress?.nodesProgress?.filter(n => n.status === "in-progress").length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Time</span>
                  <span className="font-medium">{roadmap.estimatedWeeks} weeks</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-lg">
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors"
      >
        <div className="flex items-center gap-3">
          {currentStreak > 0 && (
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">{currentStreak}</span>
            </div>
          )}
          <div className="text-left">
            <p className="text-sm font-medium">{Math.round(overallProgress)}% Complete</p>
            <p className="text-xs text-muted-foreground">
              {completedCount}/{nodes.length} topics
            </p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Tap for details →
        </div>
      </button>
      <Progress value={overallProgress} className="h-1 rounded-none" />
    </div>
  )
}
