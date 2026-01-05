'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight } from "lucide-react"
import MobilePhaseSection from "./mobile-phase-section"

export default function MobileAccordion({
  nodes,
  userProgress,
  currentUser,
  onMarkComplete
}) {
  const [expandedWeek, setExpandedWeek] = useState(null)

  // Group nodes by week
  const groupedNodes = nodes.reduce((acc, node) => {
    const week = node.weekNumber || 1
    if (!acc[week]) acc[week] = []
    acc[week].push(node)
    return acc
  }, {})

  const weeks = Object.keys(groupedNodes).sort((a, b) => Number(a) - Number(b))

  const getWeekProgress = (weekNodes) => {
    const completed = weekNodes.filter(node => {
      const nodeProgress = userProgress?.nodesProgress?.find(n => n.nodeId === node.nodeId)
      return nodeProgress?.status === "completed"
    }).length
    return (completed / weekNodes.length) * 100
  }

  const toggleWeek = (week) => {
    setExpandedWeek(expandedWeek === week ? null : week)
  }

  return (
    <div className="space-y-3 pb-20">
      {weeks.map((week) => {
        const weekNodes = groupedNodes[week]
        const progress = getWeekProgress(weekNodes)
        const isExpanded = expandedWeek === week

        return (
          <Card key={week} className="overflow-hidden">
            {/* Week Header */}
            <button
              onClick={() => toggleWeek(week)}
              className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {week}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Week {week}</h3>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(progress)}% complete
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={progress === 100 ? "default" : "outline"} className="text-xs">
                  {weekNodes.filter(n => {
                    const np = userProgress?.nodesProgress?.find(p => p.nodeId === n.nodeId)
                    return np?.status === "completed"
                  }).length}/{weekNodes.length}
                </Badge>
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1">
              <div
                className="bg-primary h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Nodes */}
            {isExpanded && (
              <MobilePhaseSection
                nodes={weekNodes}
                userProgress={userProgress}
                currentUser={currentUser}
                onMarkComplete={onMarkComplete}
              />
            )}
          </Card>
        )
      })}
    </div>
  )
}
