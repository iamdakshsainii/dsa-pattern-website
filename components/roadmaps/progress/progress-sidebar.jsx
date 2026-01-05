'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ProgressRing from "./progress-ring"
import NextNodeCard from "./next-node-card"
import { Flame, Target } from "lucide-react"
import Link from "next/link"

export default function ProgressSidebar({
  roadmap,
  nodes,
  userProgress,
  overallProgress
}) {
  // Calculate phase breakdown
  const groupedNodes = nodes.reduce((acc, node) => {
    const week = node.weekNumber || 1
    if (!acc[week]) acc[week] = []
    acc[week].push(node)
    return acc
  }, {})

  const phaseBreakdown = Object.keys(groupedNodes).map(week => {
    const phaseNodes = groupedNodes[week]
    const completed = phaseNodes.filter(node => {
      const nodeProgress = userProgress?.nodesProgress?.find(n => n.nodeId === node.nodeId)
      return nodeProgress?.status === "completed"
    }).length
    const total = phaseNodes.length
    const percentage = total > 0 ? (completed / total) * 100 : 0

    return {
      week: `Week ${week}`,
      completed,
      total,
      percentage
    }
  })

  // Find next node
  const nextNode = nodes.find(node => {
    const nodeProgress = userProgress?.nodesProgress?.find(n => n.nodeId === node.nodeId)
    const status = nodeProgress?.status
    return status === "in-progress" || (!status && isNodeUnlocked(node))
  })

  function isNodeUnlocked(node) {
    if (!node.prerequisites || node.prerequisites.length === 0) return true
    if (!userProgress) return false

    return node.prerequisites.every(prereqId => {
      const prereqProgress = userProgress?.nodesProgress?.find(n => n.nodeId === prereqId)
      return prereqProgress?.status === "completed"
    })
  }

  const currentStreak = userProgress?.streaks?.current || 0

  return (
    <div className="sticky top-24 space-y-6">
      {/* Progress Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Your Progress
        </h3>

        {/* Circular Progress Ring */}
        <div className="flex justify-center mb-6">
          <ProgressRing percentage={overallProgress} />
        </div>

        {/* Phase Breakdown */}
        <div className="space-y-3">
          {phaseBreakdown.map((phase, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">{phase.week}</span>
                <span className="font-medium">{Math.round(phase.percentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${phase.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {phase.completed}/{phase.total} topics
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Streak Badge */}
      {currentStreak > 0 && (
        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{currentStreak} days</p>
              <p className="text-sm text-muted-foreground">Current streak!</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Keep learning daily to maintain your streak 🔥
          </p>
        </Card>
      )}

      {/* Next Up Card */}
      {nextNode && (
        <NextNodeCard
          node={nextNode}
          roadmapSlug={roadmap.slug}
        />
      )}

      {/* Quick Stats */}
      <Card className="p-6">
        <h4 className="text-sm font-semibold mb-3">Quick Stats</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Topics</span>
            <span className="font-medium">{nodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Completed</span>
            <span className="font-medium text-green-600">
              {userProgress?.nodesProgress?.filter(n => n.status === "completed").length || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">In Progress</span>
            <span className="font-medium text-blue-600">
              {userProgress?.nodesProgress?.filter(n => n.status === "in-progress").length || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated Time</span>
            <span className="font-medium">{roadmap.estimatedWeeks}w</span>
          </div>
        </div>
      </Card>

      {/* Back to Roadmaps */}
      <Link href="/roadmaps">
        <Button variant="outline" className="w-full">
          ← Back to All Roadmaps
        </Button>
      </Link>
    </div>
  )
}
