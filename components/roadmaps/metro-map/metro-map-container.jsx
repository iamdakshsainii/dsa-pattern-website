'use client'

import { useState, useEffect, useRef } from "react"
import PhaseGroup from "./phase-group"
import ProgressSidebar from "../progress/progress-sidebar"

export default function MetroMapContainer({
  nodes,
  userProgress,
  roadmap,
  currentUser,
  onMarkComplete,
  quizStatus
}) {
  const [expandedNodeId, setExpandedNodeId] = useState(null)
  const containerRef = useRef(null)

  const groupedNodes = nodes.reduce((acc, node) => {
    const week = node.weekNumber || 1
    if (!acc[week]) acc[week] = []
    acc[week].push(node)
    return acc
  }, {})

  const weeks = Object.keys(groupedNodes).sort((a, b) => Number(a) - Number(b))

  const isWeekUnlocked = (weekNum) => {
    const week = parseInt(weekNum)
    if (week === 1) return true
    if (!currentUser) return false

    const previousWeek = week - 1
    const previousWeekNodes = groupedNodes[previousWeek] || []

    let totalSubtopics = 0
    let completedSubtopics = 0

    previousWeekNodes.forEach(node => {
      const subtopicsCount = node.subtopics?.length || 0
      totalSubtopics += subtopicsCount

      const nodeProgress = userProgress?.nodesProgress?.find(np => np.nodeId === node.nodeId)
      completedSubtopics += nodeProgress?.completedSubtopics?.length || 0
    })

    return totalSubtopics > 0 && completedSubtopics === totalSubtopics
  }

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

  const overallProgress = Math.min(100, userProgress?.overallProgress || 0)
  const currentNodeId = userProgress?.currentNodeId

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div
          ref={containerRef}
          className="relative bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-8 min-h-screen"
        >
          <div className="max-w-3xl mx-auto space-y-12">
            {weeks.map((week, index) => {
              const isUnlocked = isWeekUnlocked(week)

              return (
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
                  isWeekLocked={!isUnlocked}
                />
              )
            })}
          </div>
        </div>
      </div>

      {currentUser && (
        <div className="lg:col-span-1">
          <ProgressSidebar
            roadmap={roadmap}
            nodes={nodes}
            userProgress={userProgress}
            overallProgress={overallProgress}
            quizStatus={quizStatus}
          />
        </div>
      )}
    </div>
  )
}
