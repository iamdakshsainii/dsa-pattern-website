'use client'

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  BookOpen,
  Users,
  ArrowRight,
  CheckCircle2
} from "lucide-react"

export default function RoadmapCard({ roadmap, userProgress, compact = false }) {

  if (!roadmap) {
    return null
  }

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

  const progress = userProgress?.overallProgress || 0
  const isStarted = userProgress && userProgress.startedAt
  const isCompleted = userProgress?.completedAt

  const cardColor = roadmap.color || '#3b82f6'

  // Compact mode rendering
  if (compact) {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div
          className="h-2 w-full"
          style={{ backgroundColor: cardColor }}
        />

        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl" role="img" aria-label={roadmap.title || 'Roadmap'}>
              {roadmap.icon || '📚'}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                {roadmap.title || 'Untitled Roadmap'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {roadmap.category || 'General'}
                </Badge>
              </div>
            </div>
          </div>

          {isStarted && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}

          <Link href={`/roadmaps/${roadmap.slug || '#'}`}>
            <Button
              className="w-full"
              variant={isStarted ? "default" : "outline"}
              size="sm"
            >
              {isCompleted ? (
                <>
                  Review Roadmap
                  <ArrowRight className="h-3 w-3 ml-2" />
                </>
              ) : progress === 0 || !isStarted ? (
                <>
                  🚀 Start Learning
                  <ArrowRight className="h-3 w-3 ml-2" />
                </>
              ) : (
                <>
                  Continue • {Math.round(progress)}%
                  <ArrowRight className="h-3 w-3 ml-2" />
                </>
              )}
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div
        className="h-2 w-full"
        style={{ backgroundColor: cardColor }}
      />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl" role="img" aria-label={roadmap.title || 'Roadmap'}>
              {roadmap.icon || '📚'}
            </div>
            <div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                {roadmap.title || 'Untitled Roadmap'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {roadmap.category || 'General'}
                </Badge>
                {roadmap.difficulty && (
                  <Badge className={getDifficultyColor(roadmap.difficulty)}>
                    {roadmap.difficulty}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {isCompleted && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {roadmap.description || 'No description available'}
        </p>

        {isStarted && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Your Progress</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-t border-b">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="text-sm font-medium">{roadmap.estimatedWeeks || 0}w</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Topics</div>
              <div className="text-sm font-medium">{roadmap.stats?.totalNodes || 0}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Learners</div>
              <div className="text-sm font-medium">{roadmap.stats?.followers || 0}</div>
            </div>
          </div>
        </div>

        {roadmap.outcomes && roadmap.outcomes.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">You'll Learn:</p>
            <div className="flex flex-wrap gap-1">
              {roadmap.outcomes.slice(0, 3).map((outcome, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {outcome}
                </Badge>
              ))}
              {roadmap.outcomes.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{roadmap.outcomes.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <Link href={`/roadmaps/${roadmap.slug || '#'}`}>
          <Button
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            variant={isStarted ? "default" : "outline"}
          >
            {isCompleted ? (
              <>
                Review Roadmap
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            ) : progress === 0 || !isStarted ? (
              <>
                🚀 Start Learning
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                Continue Learning • {Math.round(progress)}%
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
