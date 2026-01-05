'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, CheckCircle2, Clock } from "lucide-react"

export default function RoadmapCardCompact({ node, roadmapSlug, nodeProgress, onClick }) {
  // Handle undefined node gracefully
  if (!node) {
    return null
  }

  // Calculate progress percentage
  const totalSubtopics = node.subtopics?.length || 0
  const completedSubtopics = nodeProgress?.completedSubtopics?.length || 0
  const progressValue = totalSubtopics > 0
    ? Math.round((completedSubtopics / totalSubtopics) * 100)
    : 0

  const isCompleted = progressValue === 100
  const isInProgress = progressValue > 0 && progressValue < 100

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div
        className="h-2 w-full bg-blue-500"
        style={{ backgroundColor: node.color || '#3b82f6' }}
      />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl" role="img" aria-label={node.title || 'Topic'}>
            {node.icon || '📚'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold group-hover:text-primary transition-colors truncate">
              {node.title || 'Untitled'}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {node.description || ''}
            </p>
          </div>
          {isCompleted && (
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
          )}
        </div>

        {/* Subtopic Progress */}
        <div className="mb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>{completedSubtopics} / {totalSubtopics} subtopics completed</span>
            {node.estimatedHours && (
              <span className="ml-auto">~{node.estimatedHours}h</span>
            )}
          </div>
        </div>

        {progressValue > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium">{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-1.5" />
          </div>
        )}

        <Button
          className="w-full"
          size="sm"
          variant={isInProgress ? "default" : "outline"}
        >
          {isCompleted ? (
            <>
              Review
              <ArrowRight className="h-3 w-3 ml-2" />
            </>
          ) : isInProgress ? (
            <>
              Continue Learning
              <ArrowRight className="h-3 w-3 ml-2" />
            </>
          ) : (
            <>
              Start Learning
              <ArrowRight className="h-3 w-3 ml-2" />
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
