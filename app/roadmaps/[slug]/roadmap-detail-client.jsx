'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Target,
  Briefcase,
  Download
} from "lucide-react"
import MetroMapContainer from "@/components/roadmaps/metro-map/metro-map-container"

export default function RoadmapDetailClient({
  roadmap,
  nodes,
  userProgress: initialUserProgress,
  currentUser
}) {
  const [userProgress, setUserProgress] = useState(initialUserProgress)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshProgress = async () => {
    if (!currentUser) return

    setIsRefreshing(true)
    try {
      const response = await fetch(
        `/api/roadmaps/progress?roadmapId=${roadmap.slug}`
      )
      if (response.ok) {
        const data = await response.json()
        setUserProgress(data.progress)
      }
    } catch (error) {
      console.error('Error refreshing progress:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && currentUser) {
        refreshProgress()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [currentUser, roadmap.slug])

  const overallProgress = userProgress?.overallProgress || 0

  const totalSubtopics = nodes.reduce(
    (sum, node) => sum + (node.subtopics?.length || 0),
    0
  )

  const completedSubtopics = userProgress?.nodesProgress?.reduce(
    (sum, nodeProgress) => sum + (nodeProgress.completedSubtopics?.length || 0),
    0
  ) || 0

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
      case "Advanced":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  const handleMarkComplete = async (nodeId) => {
    if (!currentUser) {
      alert("Please login to track progress")
      return
    }

    try {
      const response = await fetch('/api/roadmaps/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmapId: roadmap.slug,
          nodeId,
          status: "completed",
          completedSubtopics: []
        })
      })

      if (response.ok) {
        await refreshProgress()
      }
    } catch (error) {
      console.error("Failed to update progress:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <Link href="/roadmaps">
            <Button variant="ghost" size="sm" className="mb-3">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roadmaps
            </Button>
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{roadmap.icon}</div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{roadmap.title}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{roadmap.category}</Badge>
                  <Badge className={getDifficultyColor(roadmap.difficulty)}>
                    {roadmap.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {roadmap.estimatedWeeks} weeks
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    {nodes.length} topics
                  </div>
                </div>
              </div>
            </div>
          </div>

          {currentUser && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm font-medium">
                  {completedSubtopics}/{totalSubtopics} subtopics • {Math.round(overallProgress)}%
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {roadmap.notesAttachments && roadmap.notesAttachments.length > 0 && (
          <Card className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📚</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  Study Materials Available
                  <Badge variant="secondary">{roadmap.notesAttachments.length} files</Badge>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.notesAttachments.map((attachment, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-2"
                    >
                      <a
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-3 w-3" />
                        {attachment.fileName}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({attachment.fileSize})
                        </span>
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">About This Roadmap</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {roadmap.description}
              </p>

              {roadmap.prerequisites && roadmap.prerequisites.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Prerequisites
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {roadmap.prerequisites.map((prereq, idx) => (
                      <li key={idx}>• {prereq}</li>
                    ))}
                  </ul>
                </div>
              )}

              {roadmap.outcomes && roadmap.outcomes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-2">What You'll Learn</h4>
                  <div className="flex flex-wrap gap-1">
                    {roadmap.outcomes.map((outcome, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {outcome}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {roadmap.targetRoles && roadmap.targetRoles.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Target Roles
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {roadmap.targetRoles.map((role, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </aside>

          <div className="lg:col-span-3">
            <MetroMapContainer
              nodes={nodes}
              userProgress={userProgress}
              roadmap={roadmap}
              currentUser={currentUser}
              onMarkComplete={handleMarkComplete}
              onProgressUpdate={refreshProgress}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
