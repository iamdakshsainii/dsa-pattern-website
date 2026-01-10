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
  CheckCircle2,
  Zap,
  Target,
  TrendingUp
} from "lucide-react"

export default function RoadmapCard({ roadmap, userProgress, compact = false }) {
  if (!roadmap) {
    return null
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const progress = userProgress?.overallProgress || 0
  const isStarted = userProgress && userProgress.startedAt
  const isCompleted = userProgress?.completedAt
  const cardColor = roadmap.color || '#3b82f6'

  // Compact mode
  if (compact) {
    return (
      <Link href={`/roadmaps/${roadmap.slug || '#'}`}>
        <Card className="group relative overflow-hidden cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/50 group-hover:via-purple-50/50 group-hover:to-pink-50/50 dark:from-blue-950/0 dark:via-purple-950/0 dark:to-pink-950/0 dark:group-hover:from-blue-950/20 dark:group-hover:via-purple-950/20 dark:group-hover:to-pink-950/20 transition-all duration-500" />

          {isCompleted && (
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl" />
          )}

          <div className="relative p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="relative">
                <div className={`text-3xl transition-transform duration-300 group-hover:scale-110 ${isCompleted ? 'animate-pulse' : ''}`}>
                  {roadmap.icon || '📚'}
                </div>
                {isCompleted && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-1">
                  {roadmap.title || 'Untitled Roadmap'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-700">
                    {roadmap.category || 'General'}
                  </Badge>
                </div>
              </div>

              {isCompleted ? (
                <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm shrink-0">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Done
                </Badge>
              ) : isStarted ? (
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-sm shrink-0">
                  <Zap className="h-3 w-3 mr-1" />
                  {Math.round(progress)}%
                </Badge>
              ) : (
                <Badge variant="outline" className="border-slate-300 dark:border-slate-700 shrink-0">
                  <Target className="h-3 w-3 mr-1" />
                  New
                </Badge>
              )}
            </div>

            {isStarted && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Progress</span>
                  <span className={`text-sm font-bold ${
                    isCompleted
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress
                  value={progress}
                  className={`h-2 ${isCompleted ? 'bg-green-100 dark:bg-green-950' : 'bg-slate-100 dark:bg-slate-800'}`}
                />
              </div>
            )}

            <Button
              className={`w-full group/btn transition-all duration-300 font-semibold ${
                isCompleted
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                  : isStarted
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100'
              }`}
              size="sm"
            >
              <span className="flex items-center justify-center gap-2 text-white">
                {isCompleted ? (
                  <>
                    Review Roadmap
                    <TrendingUp className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </>
                ) : isStarted ? (
                  <>
                    Continue Learning • {Math.round(progress)}%
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </>
                ) : (
                  <>
                    <span className="text-slate-900 dark:text-slate-100">🚀 Start Learning</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 text-slate-900 dark:text-slate-100" />
                  </>
                )}
              </span>
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </Card>
      </Link>
    )
  }

  // Regular (non-compact) card
  return (
    <Link href={`/roadmaps/${roadmap.slug || '#'}`}>
      <Card className="group relative overflow-hidden cursor-pointer border-0 shadow-md hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-900 h-full">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/50 group-hover:via-purple-50/50 group-hover:to-pink-50/50 dark:from-blue-950/0 dark:via-purple-950/0 dark:to-pink-950/0 dark:group-hover:from-blue-950/20 dark:group-hover:via-purple-950/20 dark:group-hover:to-pink-950/20 transition-all duration-500" />

        {isCompleted && (
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl" />
        )}

        <div className="relative p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <div className={`text-4xl transition-transform duration-300 group-hover:scale-110 ${isCompleted ? 'animate-pulse' : ''}`}>
                {roadmap.icon || '📚'}
              </div>
              {isCompleted && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                {roadmap.title || 'Untitled Roadmap'}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-700">
                  {roadmap.category || 'General'}
                </Badge>
                {roadmap.difficulty && (
                  <Badge className={`text-xs border ${getDifficultyColor(roadmap.difficulty)}`}>
                    {roadmap.difficulty}
                  </Badge>
                )}
              </div>
            </div>

            {isCompleted ? (
              <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm shrink-0">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Done
              </Badge>
            ) : isStarted ? (
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-sm shrink-0">
                <Zap className="h-3 w-3 mr-1" />
                {Math.round(progress)}%
              </Badge>
            ) : (
              <Badge variant="outline" className="border-slate-300 dark:border-slate-700 shrink-0">
                <Target className="h-3 w-3 mr-1" />
                New
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {roadmap.description || 'No description available'}
          </p>

          {isStarted && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Your Progress</span>
                <span className={`text-sm font-bold ${
                  isCompleted
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}>
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress
                value={progress}
                className={`h-2 ${isCompleted ? 'bg-green-100 dark:bg-green-950' : 'bg-slate-100 dark:bg-slate-800'}`}
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-t border-b border-slate-200 dark:border-slate-800">
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
              <p className="text-xs text-muted-foreground mb-2 font-medium">You'll Learn:</p>
              <div className="flex flex-wrap gap-1.5">
                {roadmap.outcomes.slice(0, 3).map((outcome, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300"
                  >
                    {outcome}
                  </span>
                ))}
                {roadmap.outcomes.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300">
                    +{roadmap.outcomes.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <Button
            className={`w-full group/btn transition-all duration-300 font-semibold ${
              isCompleted
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                : isStarted
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100'
            }`}
          >
            <span className="flex items-center justify-center gap-2 text-white">
              {isCompleted ? (
                <>
                  Review Roadmap
                  <TrendingUp className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </>
              ) : isStarted ? (
                <>
                  Continue Learning • {Math.round(progress)}%
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </>
              ) : (
                <>
                  <span className="text-slate-900 dark:text-slate-100">🚀 Start Learning</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 text-slate-900 dark:text-slate-100" />
                </>
              )}
            </span>
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </Card>
    </Link>
  )
}
