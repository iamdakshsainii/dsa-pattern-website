'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Clock,
  CheckCircle2,
  Circle,
  ChevronRight,
  Lock,
  BookOpen
} from 'lucide-react'

export default function MetroMapNode({
  node,
  roadmapSlug,
  isLocked,
  progress,
  completedSubtopics,
  totalSubtopics,
  currentUser,
  onMarkComplete
}) {
  const isComplete = progress === 100
  const isInProgress = progress > 0 && progress < 100
  const isNotStarted = progress === 0

  // If locked, render as non-clickable card
  if (isLocked) {
    return (
      <Card className="p-6 opacity-50 relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex items-start gap-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center shrink-0
            bg-gray-200 dark:bg-gray-800 text-gray-400
          `}>
            <Circle className="h-8 w-8" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1 text-gray-500">{node.title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {node.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {node.estimatedHours}h
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {totalSubtopics} subtopics
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Unlocked node - clickable
  return (
    <Card className={`
      p-6 transition-all hover:shadow-lg cursor-pointer relative overflow-hidden
      ${isComplete ? 'border-2 border-green-500 bg-green-50 dark:bg-green-950/20' : ''}
      ${isInProgress ? 'border-2 border-blue-500' : ''}
    `}>
      {isComplete && (
        <div className="absolute top-4 right-4">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
      )}

      <Link href={`/roadmaps/${roadmapSlug}/${node.nodeId}`}>
        <div className="flex items-start gap-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-all
            ${isComplete
              ? 'bg-green-500 text-white'
              : isInProgress
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }
          `}>
            {isComplete ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : isInProgress ? (
              <Circle className="h-8 w-8 fill-current" />
            ) : (
              <Circle className="h-8 w-8" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                  {node.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {node.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {node.estimatedHours}h
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {totalSubtopics} subtopics
              </div>
              {currentUser && (
                <Badge variant={isComplete ? "default" : "outline"} className="ml-auto">
                  {completedSubtopics}/{totalSubtopics} complete
                </Badge>
              )}
            </div>

            {currentUser && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <Button variant="ghost" size="sm" className="gap-2">
                {isComplete ? (
                  <>Review Topics</>
                ) : isInProgress ? (
                  <>Continue Learning</>
                ) : (
                  <>Start Learning</>
                )}
                <ChevronRight className="h-4 w-4" />
              </Button>

              {node.keyTakeaways && (
                <Badge variant="secondary" className="text-xs">
                  {node.keyTakeaways.length} key takeaways
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}
