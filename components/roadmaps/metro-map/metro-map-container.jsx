'use client'

import { useState, useEffect, useRef } from "react"
import PhaseGroup from "./phase-group"
import ProgressSidebar from "../progress/progress-sidebar"

export default function MetroMapContainer({
  nodes,
  userProgress,
  roadmap,
  currentUser,
  onMarkComplete
}) {
  const [expandedNodeId, setExpandedNodeId] = useState(null)
  const containerRef = useRef(null)

  // Group nodes by week
  const groupedNodes = nodes.reduce((acc, node) => {
    const week = node.weekNumber || 1
    if (!acc[week]) acc[week] = []
    acc[week].push(node)
    return acc
  }, {})

  const weeks = Object.keys(groupedNodes).sort((a, b) => Number(a) - Number(b))

  // Scroll to active node on mount
  useEffect(() => {
    if (userProgress?.currentNodeId && containerRef.current) {
      const activeElement = document.getElementById(`node-${userProgress.currentNodeId}`)
      if (activeElement) {
        setTimeout(() => {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 500)
      }
    }
  }, [userProgress])

  const getNodeStatus = (nodeId) => {
    if (!userProgress) return "unlocked"
    const nodeProgress = userProgress.nodesProgress?.find(n => n.nodeId === nodeId)
    return nodeProgress?.status || "unlocked"
  }

  const isNodeUnlocked = (node) => {
    if (!node.prerequisites || node.prerequisites.length === 0) return true
    if (!userProgress) return false

    return node.prerequisites.every(prereqId => {
      const prereqProgress = userProgress.nodesProgress?.find(n => n.nodeId === prereqId)
      return prereqProgress?.status === "completed"
    })
  }

  const handleNodeClick = (nodeId) => {
    setExpandedNodeId(expandedNodeId === nodeId ? null : nodeId)
  }

  const overallProgress = userProgress?.overallProgress || 0
  const currentNodeId = userProgress?.currentNodeId

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Metro Map */}
      <div className="lg:col-span-3">
        <div className="mb-6">
          {currentUser && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div
          ref={containerRef}
          className="relative bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-8 min-h-screen"
        >
          <div className="max-w-3xl mx-auto space-y-12">
            {weeks.map((week, index) => (
              <PhaseGroup
                key={week}
                weekNumber={week}
                nodes={groupedNodes[week]}
                userProgress={userProgress}
                currentUser={currentUser}
                expandedNodeId={expandedNodeId}
                currentNodeId={currentNodeId}
                onNodeClick={handleNodeClick}
                onMarkComplete={onMarkComplete}
                getNodeStatus={getNodeStatus}
                isNodeUnlocked={isNodeUnlocked}
                isLastPhase={index === weeks.length - 1}
                roadmapSlug={roadmap.slug}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Sidebar */}
      <div className="lg:col-span-1 hidden lg:block">
        <ProgressSidebar
          roadmap={roadmap}
          nodes={nodes}
          userProgress={userProgress}
          overallProgress={overallProgress}
        />
      </div>
    </div>
  )
}
