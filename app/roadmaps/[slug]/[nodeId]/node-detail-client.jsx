'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Clock, CheckCircle2, Circle, ChevronRight, Sparkles, Target, Award } from 'lucide-react'
import ResourceActionButtons from '@/components/roadmaps/content/resource-action-buttons'
import ProgressUnlockCard from '@/components/roadmaps/progress-unlock-card'
import SubtopicLockIcon from '@/components/roadmaps/subtopic-lock-icon'

export default function NodeDetailClient({
  node,
  roadmapSlug,
  roadmapTitle,
  roadmapIcon,
  weekNumber,
  currentUser,
  initialCompletedSubtopics
}) {
  const [completedSubtopics, setCompletedSubtopics] = useState(
    new Set(initialCompletedSubtopics || [])
  )

  useEffect(() => {
    setCompletedSubtopics(new Set(initialCompletedSubtopics || []))
  }, [initialCompletedSubtopics])

  const progressPercentage = node.subtopics?.length > 0
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
          roadmapId: roadmapSlug,
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

    const allSubtopicIds = node.subtopics.map(st => st.subtopicId)
    const previousState = new Set(completedSubtopics)
    setCompletedSubtopics(new Set(allSubtopicIds))

    try {
      const response = await fetch('/api/roadmaps/node/mark-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmapId: roadmapSlug,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(white,transparent_85%)]" />

      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative">
        <div className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href={`/roadmaps/${roadmapSlug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>{roadmapIcon} {roadmapTitle}</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Week {weekNumber}</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-foreground">
                  {node.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {node.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{node.estimatedHours}h estimated</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Target className="h-4 w-4" />
                    <span>{node.subtopics?.length || 0} subtopics</span>
                  </div>
                  {currentUser && progressPercentage === 100 && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-foreground border-0">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>

              {!currentUser && (
                <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-primary/20 backdrop-blur-sm">
                  <ProgressUnlockCard />
                </Card>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Learning Path
                  </h2>
                  {currentUser && node.subtopics?.length > 0 && (
                    <Button
                      onClick={handleMarkAllComplete}
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      Mark All Complete
                    </Button>
                  )}
                </div>

                {node.subtopics && node.subtopics.length > 0 ? (
                  <div className="space-y-3">
                    {node.subtopics.map((subtopic, index) => {
                      const isCompleted = completedSubtopics.has(subtopic.subtopicId)
                      return (
                        <Card
                          key={subtopic.subtopicId}
                          className={`group relative overflow-hidden transition-all duration-300 ${
                            isCompleted
                              ? 'bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20'
                              : 'hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30'
                          }`}
                        >
                          <div className="p-5">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 pt-0.5">
                                {currentUser ? (
                                  <Checkbox
                                    checked={isCompleted}
                                    onCheckedChange={() => handleSubtopicToggle(subtopic.subtopicId)}
                                    className="data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-600 data-[state=checked]:border-0 h-5 w-5"
                                  />
                                ) : (
                                  <SubtopicLockIcon />
                                )}
                              </div>

                              <div className="flex-1 min-w-0 space-y-3">
                                <div>
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <h3 className={`font-semibold text-base ${isCompleted ? 'text-green-700 dark:text-green-400' : ''}`}>
                                      {index + 1}. {subtopic.title}
                                    </h3>
                                    {isCompleted && (
                                      <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 flex-shrink-0">
                                        Done
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {subtopic.description}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{subtopic.estimatedMinutes} min</span>
                                  </div>
                                  <ResourceActionButtons
                                    subtopicId={subtopic.subtopicId}
                                    resourceLinks={subtopic.resourceLinks}
                                    roadmapSlug={roadmapSlug}
                                    nodeId={node.nodeId}
                                    currentUser={currentUser}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground">No subtopics available for this node yet.</p>
                  </Card>
                )}
              </div>

              {node.keyTakeaways && node.keyTakeaways.length > 0 && (
                <Card className="p-6 backdrop-blur-sm bg-card/50">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Key Takeaways
                  </h3>
                  <ul className="space-y-2">
                    {node.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">•</span>
                        <span className="flex-1">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            <div className="lg:sticky lg:top-24 h-fit space-y-4">
              {currentUser && (
                <Card className="p-6 backdrop-blur-xl bg-card/80 border-border/50 shadow-xl">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-muted/20"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#progress-gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - progressPercentage / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        />
                        <defs>
                          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-foreground">
                          {Math.round(progressPercentage)}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Complete</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="font-semibold">{completedSubtopics.size}/{node.subtopics?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <span className="text-sm text-muted-foreground">Remaining</span>
                      <span className="font-semibold">{(node.subtopics?.length || 0) - completedSubtopics.size}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <span className="text-sm text-muted-foreground">Time Left</span>
                      <span className="font-semibold">
                        {Math.round(((node.subtopics?.length || 0) - completedSubtopics.size) * (node.estimatedHours || 0) / (node.subtopics?.length || 1))}h
                      </span>
                    </div>
                  </div>

                  {progressPercentage === 100 && (
                    <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
                      <div className="text-2xl mb-2">🎉</div>
                      <p className="font-semibold text-green-700 dark:text-green-400 text-sm">
                        Topic Completed!
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Great work! Continue to the next topic.
                      </p>
                    </div>
                  )}
                </Card>
              )}

              <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-primary/20">
                <h4 className="font-semibold text-sm mb-2 text-muted-foreground">QUICK TIP</h4>
                <p className="text-sm leading-relaxed">
                  Complete each subtopic in order for the best learning experience. Click on resource buttons to access materials.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
