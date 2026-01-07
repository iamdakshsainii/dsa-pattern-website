'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  ExternalLink,
  Trash2,
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function QuizHistoryClient({ results, roadmaps, userId }) {
  const router = useRouter()
  const { toast } = useToast()
  const [expandedAttempts, setExpandedAttempts] = useState({})

  const toggleExpand = (attemptId) => {
    setExpandedAttempts(prev => ({
      ...prev,
      [attemptId]: !prev[attemptId]
    }))
  }

  const getRoadmapInfo = (roadmapId) => {
    return roadmaps.find(r => r.slug === roadmapId) || {
      title: roadmapId,
      icon: '📚'
    }
  }

  const handleDelete = async (attemptId) => {
    try {
      const res = await fetch(`/api/quiz/attempts/${attemptId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Quiz attempt deleted successfully"
        })
        router.refresh()
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete quiz attempt",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (passed) => {
    return passed
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case 'youtube':
        return '🎥'
      case 'article':
        return '📄'
      case 'practice':
        return '💻'
      default:
        return '🔗'
    }
  }

  if (!results || results.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/profile/activities">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Activities
            </Button>
          </Link>
        </div>

        <Card className="p-12 text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Quiz History Yet</h3>
          <p className="text-muted-foreground mb-6">
            Complete roadmaps and take quizzes to see your history here
          </p>
          <Link href="/roadmaps">
            <Button>Browse Roadmaps</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/profile/activities">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Activities
          </Button>
        </Link>
        <Badge variant="outline">{results.length} Total Attempts</Badge>
      </div>

      <div className="space-y-4">
        {results.map((result) => {
          const roadmap = getRoadmapInfo(result.roadmapId)
          const isExpanded = expandedAttempts[result._id]

          return (
            <Card key={result._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-3xl">{roadmap.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{roadmap.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(result.completedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span>Attempt #{result.attemptNumber}</span>
                      {result.timeTaken && (
                        <span>{Math.round(result.timeTaken)} min</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(result._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{result.score}/{result.totalQuestions}</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{result.percentage}%</div>
                  <div className="text-xs text-muted-foreground">Percentage</div>
                </div>
                <div
                  className="text-center p-3 rounded-lg"
                  style={{
                    backgroundColor: result.passed
                      ? 'rgb(34 197 94 / 0.1)'
                      : 'rgb(239 68 68 / 0.1)'
                  }}
                >
                  <Badge className={getStatusColor(result.passed)}>
                    {result.passed ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Passed
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Failed
                      </>
                    )}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">Status</div>
                </div>
              </div>

              {result.answers && result.answers.length > 0 && (
                <div className="border-t pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(result._id)}
                    className="mb-3"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        View Detailed Answers
                      </>
                    )}
                  </Button>

                  {isExpanded && (
                    <div className="space-y-3">
                      {result.answers.map((answer, idx) => (
                        <Card
                          key={idx}
                          className={`p-4 ${
                            answer.isCorrect
                              ? 'bg-green-50 dark:bg-green-900/10 border-green-200'
                              : 'bg-red-50 dark:bg-red-900/10 border-red-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  Q{idx + 1}
                                </Badge>
                                {answer.topic && (
                                  <Badge variant="secondary" className="text-xs">
                                    {answer.topic}
                                  </Badge>
                                )}
                                {answer.difficulty && (
                                  <Badge variant="outline" className="text-xs">
                                    {answer.difficulty}
                                  </Badge>
                                )}
                              </div>

                              <p className="font-medium mb-3">{answer.question}</p>

                              <div className="space-y-2 mb-3">
                                <div className="text-sm">
                                  <span className="font-medium">Your Answer: </span>
                                  <span
                                    className={
                                      answer.isCorrect
                                        ? 'text-green-700 dark:text-green-400'
                                        : 'text-red-700 dark:text-red-400'
                                    }
                                  >
                                    {answer.userAnswer}
                                  </span>
                                </div>
                                {!answer.isCorrect && (
                                  <div className="text-sm">
                                    <span className="font-medium">Correct Answer: </span>
                                    <span className="text-green-700 dark:text-green-400">
                                      {answer.correctAnswer || answer.correctAnswers?.join(', ')}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {answer.explanation && (
                                <div className="text-sm text-muted-foreground mb-3 p-3 bg-muted/50 rounded">
                                  <span className="font-medium">Explanation: </span>
                                  {answer.explanation}
                                </div>
                              )}

                              {answer.resources && answer.resources.length > 0 && (
                                <div>
                                  <div className="text-sm font-medium mb-2">Learning Resources:</div>
                                  <div className="flex flex-wrap gap-2">
                                    {answer.resources.map((resource, rIdx) => (
                                      <a
                                        key={rIdx}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                      >
                                        <span>{getResourceIcon(resource.type)}</span>
                                        <span>{resource.title}</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="ml-4">
                              {answer.isCorrect ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
