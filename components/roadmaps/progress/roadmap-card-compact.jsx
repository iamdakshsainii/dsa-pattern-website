'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Clock, BookOpen, Target, Zap } from "lucide-react"

export default function RoadmapCardCompact({ node, roadmapSlug, nodeProgress, onClick }) {
  if (!node) {
    return null
  }

  const totalSubtopics = node.subtopics?.length || 0
  const completedSubtopics = nodeProgress?.completedSubtopics?.length || 0
  const progressValue = totalSubtopics > 0
    ? Math.round((completedSubtopics / totalSubtopics) * 100)
    : 0

  const isCompleted = progressValue === 100
  const isInProgress = progressValue > 0 && progressValue < 100

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900"
      onClick={onClick}
    >
      {/* Gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
      />

      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/50 group-hover:via-purple-50/50 group-hover:to-pink-50/50 dark:from-blue-950/0 dark:via-purple-950/0 dark:to-pink-950/0 dark:group-hover:from-blue-950/20 dark:group-hover:via-purple-950/20 dark:group-hover:to-pink-950/20 transition-all duration-500" />

      {/* Completion glow effect */}
      {isCompleted && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl" />
      )}

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative">
            <div className={`text-3xl transition-transform duration-300 group-hover:scale-110 ${isCompleted ? 'animate-pulse' : ''}`}>
              {node.icon || '📚'}
            </div>
            {isCompleted && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-1">
              {node.title || 'Untitled'}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {node.description || ''}
            </p>
          </div>

          {/* Status badge */}
          {isCompleted ? (
            <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Done
            </Badge>
          ) : isInProgress ? (
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-sm">
              <Zap className="h-3 w-3 mr-1" />
              Active
            </Badge>
          ) : (
            <Badge variant="outline" className="border-slate-300 dark:border-slate-700">
              <Target className="h-3 w-3 mr-1" />
              New
            </Badge>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-4 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span className="font-medium">{completedSubtopics}/{totalSubtopics} topics</span>
          </div>
          {node.estimatedHours && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-medium">~{node.estimatedHours}h</span>
            </div>
          )}
          {progressValue > 0 && (
            <div className="ml-auto">
              <span className={`font-bold text-sm ${
                isCompleted
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-blue-600 dark:text-blue-400'
              }`}>
                {progressValue}%
              </span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {progressValue > 0 && (
          <div className="mb-4">
            <Progress
              value={progressValue}
              className={`h-2 ${isCompleted ? 'bg-green-100 dark:bg-green-950' : 'bg-slate-100 dark:bg-slate-800'}`}
            />
          </div>
        )}

        {/* Action button */}
        <Button
          className={`w-full group/btn transition-all duration-300 ${
            isCompleted
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
              : isInProgress
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
              : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600'
          }`}
          size="sm"
        >
          <span className="flex items-center justify-center gap-2">
            {isCompleted ? (
              <>
                Review Topics
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </>
            ) : isInProgress ? (
              <>
                Continue Learning
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </>
            ) : (
              <>
                Start Learning
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </>
            )}
          </span>
        </Button>
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </Card>
  )
}
