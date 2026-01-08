'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle2, Lock, BookOpen, ExternalLink } from "lucide-react"
import Link from "next/link"
import ProgressSidebar from "./progress/progress-sidebar"

export default function RoadmapListView({
  nodes,
  userProgress,
  roadmap,
  currentUser,
  quizStatus
}) {
  const groupedNodes = nodes.reduce((acc, node) => {
    const week = node.weekNumber || 1
    if (!acc[week]) acc[week] = []
    acc[week].push(node)
    return acc
  }, {})

  const weeks = Object.keys(groupedNodes).sort((a, b) => Number(a) - Number(b))

  const getNodeProgress = (node) => {
    if (!userProgress) return 0
    const nodeProgress = userProgress.nodesProgress?.find(n => n.nodeId === node.nodeId)
    if (!nodeProgress) return 0

    const total = node.subtopics?.length || 0
    const completed = nodeProgress.completedSubtopics?.length || 0

    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const getNodeStatus = (node) => {
    if (!userProgress) return "locked"
    const nodeProgress = userProgress.nodesProgress?.find(n => n.nodeId === node.nodeId)
    return nodeProgress?.status || "locked"
  }

  const isNodeUnlocked = (node) => {
    if (!node.prerequisites || node.prerequisites.length === 0) return true
    if (!userProgress) return false

    return node.prerequisites.every(prereqId => {
      const prereqProgress = userProgress.nodesProgress?.find(n => n.nodeId === prereqId)
      return prereqProgress?.status === "completed"
    })
  }

  const overallProgress = Math.min(100, userProgress?.overallProgress || 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {weeks.map((week) => {
          const weekNodes = groupedNodes[week]
          const completedInWeek = weekNodes.filter(n => getNodeStatus(n) === "completed").length
          const weekProgress = Math.round((completedInWeek / weekNodes.length) * 100)

          return (
            <div key={week} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-lg font-bold">
                    {week}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Week {week}</h2>
                    <p className="text-sm text-muted-foreground">
                      {completedInWeek}/{weekNodes.length} topics completed
                    </p>
                  </div>
                </div>
                <Badge variant={weekProgress === 100 ? "default" : "outline"} className="text-base">
                  {weekProgress}%
                </Badge>
              </div>

              <div className="space-y-3">
                {weekNodes.map((node) => {
                  const nodeProgress = getNodeProgress(node)
                  const status = getNodeStatus(node)
                  const unlocked = isNodeUnlocked(node)

                  return (
                    <Card
                      key={node.nodeId}
                      className={`p-5 transition-all ${
                        unlocked
                          ? 'hover:shadow-md cursor-pointer'
                          : 'opacity-60 cursor-not-allowed'
                      } ${
                        status === 'completed'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                          : status === 'in-progress'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                          : ''
                      }`}
                    >
                      {unlocked ? (
                        <Link href={`/roadmaps/${roadmap.slug}/${node.nodeId}`}>
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{node.title}</h3>
                                  {status === 'completed' && (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {node.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {node.estimatedHours}h
                              </div>
                              {node.subtopics && (
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4" />
                                  {node.subtopics.length} subtopics
                                </div>
                              )}
                              {node.resources && (
                                <div className="flex items-center gap-1">
                                  <ExternalLink className="h-4 w-4" />
                                  {node.resources.length} resources
                                </div>
                              )}
                            </div>

                            {currentUser && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{nodeProgress}%</span>
                                </div>
                                <Progress value={nodeProgress} className="h-2" />
                              </div>
                            )}
                          </div>
                        </Link>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{node.title}</h3>
                                <Lock className="h-5 w-5 text-gray-400" />
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {node.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {node.estimatedHours}h
                            </div>
                            {node.subtopics && (
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {node.subtopics.length} subtopics
                              </div>
                            )}
                          </div>

                          <Badge variant="secondary" className="text-xs">
                            Complete previous topics to unlock
                          </Badge>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
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
