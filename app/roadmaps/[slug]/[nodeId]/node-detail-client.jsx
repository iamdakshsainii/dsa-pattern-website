'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Circle,
  ChevronRight
} from 'lucide-react'
import ResourceActionButtons from '@/components/roadmaps/content/resource-action-buttons'

export default function NodeDetailClient({
  node,
  roadmapSlug,
  roadmapId,
  roadmapTitle,
  roadmapIcon,
  weekNumber,
  currentUser,
  initialCompletedSubtopics
}) {
  const [completedSubtopics, setCompletedSubtopics] = useState(
    new Set(initialCompletedSubtopics || [])
  )

  const progress = node.subtopics?.length > 0
    ? (completedSubtopics.size / node.subtopics.length) * 100
    : 0

  const handleSubtopicToggle = async (subtopicId) => {
    if (!currentUser) {
      alert("Please login to track progress")
      return
    }

    setCompletedSubtopics(prev => {
      const newCompleted = new Set(prev)
      if (newCompleted.has(subtopicId)) {
        newCompleted.delete(subtopicId)
      } else {
        newCompleted.add(subtopicId)
      }
      return newCompleted
    })

    try {
      const response = await fetch('/api/roadmaps/subtopic/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmapId: roadmapId,
          nodeId: node.nodeId,
          subtopicId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to toggle subtopic')
      }
    } catch (error) {
      console.error("Failed to toggle subtopic:", error)

      setCompletedSubtopics(prev => {
        const newCompleted = new Set(prev)
        if (newCompleted.has(subtopicId)) {
          newCompleted.delete(subtopicId)
        } else {
          newCompleted.add(subtopicId)
        }
        return newCompleted
      })

      alert("Failed to update progress. Please try again.")
    }
  }

  const handleMarkAllComplete = async () => {
    if (!currentUser) {
      alert("Please login to track progress")
      return
    }

    const allSubtopicIds = new Set(
      node.subtopics.map(st => st.subtopicId)
    )
    const previousState = new Set(completedSubtopics)
    setCompletedSubtopics(allSubtopicIds)

    try {
      const response = await fetch('/api/roadmaps/node/mark-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmapId: roadmapId,
          nodeId: node.nodeId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to mark all complete')
      }
    } catch (error) {
      console.error("Failed to mark all complete:", error)
      setCompletedSubtopics(previousState)
      alert("Failed to update progress. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <Link href={`/roadmaps/${roadmapSlug}`}>
            <Button variant="ghost" size="sm" className="mb-3">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roadmap
            </Button>
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <span className="text-2xl">{roadmapIcon}</span>
            <span>{roadmapTitle}</span>
            <ChevronRight className="h-4 w-4" />
            <span>Week {weekNumber}</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">{node.title}</h1>
          <p className="text-muted-foreground mb-4">{node.description}</p>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {node.estimatedHours}h estimated
            </div>
            <Badge variant="outline">
              {node.subtopics?.length || 0} subtopics
            </Badge>
            {progress === 100 && (
              <Badge className="bg-green-500">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>

          {currentUser && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm font-medium">
                  {completedSubtopics.size}/{node.subtopics?.length || 0} completed • {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Learning Path</h2>
            {currentUser && node.subtopics?.length > 0 && (
              <Button
                onClick={handleMarkAllComplete}
                variant="outline"
                size="sm"
                disabled={completedSubtopics.size === node.subtopics.length}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark All Complete
              </Button>
            )}
          </div>

          {node.subtopics && node.subtopics.length > 0 ? (
            <div className="space-y-4">
              {node.subtopics.map((subtopic, index) => {
                const isCompleted = completedSubtopics.has(subtopic.subtopicId)

                return (
                  <div
                    key={subtopic.subtopicId}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isCompleted
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                        : 'bg-card border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {currentUser ? (
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={() => handleSubtopicToggle(subtopic.subtopicId)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3
                              className={`font-semibold mb-1 ${
                                isCompleted ? 'line-through text-muted-foreground' : ''
                              }`}
                            >
                              {index + 1}. {subtopic.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {subtopic.description}
                            </p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {subtopic.estimatedMinutes} min
                          </Badge>
                        </div>

                        <ResourceActionButtons
                          resourceLinks={subtopic.resourceLinks}
                          subtopicId={subtopic.subtopicId}
                          roadmapSlug={roadmapSlug}
                          nodeId={node.nodeId}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Circle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No subtopics available for this node yet.</p>
            </div>
          )}
        </Card>

        {node.keyTakeaways && node.keyTakeaways.length > 0 && (
          <Card className="p-6 mt-6">
            <h3 className="font-semibold mb-4">Key Takeaways</h3>
            <ul className="space-y-2">
              {node.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm">{takeaway}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </main>
    </div>
  )
}
