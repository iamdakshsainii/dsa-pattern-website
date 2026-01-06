'use client'

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, Target, ExternalLink, BookOpen, Video } from "lucide-react"

export default function QuizResultClient({ attempt, roadmap }) {
  if (!attempt) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8 text-center">
          <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Quiz Attempt Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This quiz attempt doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/profile/quiz-history">
            <Button>Back to Quiz History</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const { score, totalQuestions, percentage, passed, timeTaken, answers, completedAt } = attempt

  const correctCount = answers?.filter(a => a.isCorrect).length || 0
  const wrongCount = answers?.filter(a => !a.isCorrect).length || 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/profile/quiz-history">
          <Button variant="ghost" size="sm" className="mb-4">← Back to History</Button>
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{roadmap?.icon || "📚"}</div>
          <div>
            <h1 className="text-3xl font-bold">{roadmap?.title || "Quiz"}</h1>
            <p className="text-muted-foreground">
              Completed on {new Date(completedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 text-center">
          <div className={`text-4xl font-bold mb-2 ${passed ? "text-green-600" : "text-red-600"}`}>
            {percentage}%
          </div>
          <div className="text-sm text-muted-foreground">Score</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-4xl font-bold mb-2 text-blue-600">
            {score}/{totalQuestions}
          </div>
          <div className="text-sm text-muted-foreground">Questions</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-4xl font-bold mb-2 text-purple-600">
            {timeTaken || 0}
          </div>
          <div className="text-sm text-muted-foreground">Minutes</div>
        </Card>

        <Card className="p-6 text-center">
          <Badge variant={passed ? "default" : "destructive"} className="text-lg py-2">
            {passed ? "Passed" : "Failed"}
          </Badge>
        </Card>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Performance Summary</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Correct Answers</span>
              <span className="font-semibold text-green-600">{correctCount}</span>
            </div>
            <Progress value={(correctCount / totalQuestions) * 100} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Wrong Answers</span>
              <span className="font-semibold text-red-600">{wrongCount}</span>
            </div>
            <Progress value={(wrongCount / totalQuestions) * 100} className="h-2 bg-red-100" />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Detailed Review</h2>

        {answers?.map((answer, idx) => (
          <Card key={idx} className={`p-6 border-l-4 ${answer.isCorrect ? "border-l-green-500" : "border-l-red-500"}`}>
            <div className="flex items-start gap-3 mb-4">
              {answer.isCorrect ? (
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Question {idx + 1}</Badge>
                  {answer.topic && <Badge variant="secondary">{answer.topic}</Badge>}
                  {answer.difficulty && (
                    <Badge variant={
                      answer.difficulty === "easy" ? "default" :
                      answer.difficulty === "medium" ? "secondary" : "destructive"
                    }>
                      {answer.difficulty}
                    </Badge>
                  )}
                </div>
                <p className="font-medium text-lg mb-3">{answer.question}</p>

                <div className="space-y-2 mb-4">
                  {answer.options?.map((opt, i) => {
                    const isUserAnswer = answer.userAnswer === opt
                    const isCorrect = answer.correctAnswer === opt || answer.correctAnswers?.includes(opt)

                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${
                          isCorrect
                            ? "bg-green-50 border-green-300 dark:bg-green-900/20"
                            : isUserAnswer
                            ? "bg-red-50 border-red-300 dark:bg-red-900/20"
                            : "bg-gray-50 border-gray-200 dark:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isCorrect && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {isUserAnswer && !isCorrect && <XCircle className="h-4 w-4 text-red-600" />}
                          <span className={isCorrect || isUserAnswer ? "font-medium" : ""}>
                            {opt}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {answer.explanation && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                    <p className="text-sm font-medium mb-1">Explanation:</p>
                    <p className="text-sm">{answer.explanation}</p>
                  </div>
                )}

                {!answer.isCorrect && answer.resources && answer.resources.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Learn More:
                    </p>
                    <div className="space-y-2">
                      {answer.resources.map((resource, ridx) => (
                        <a
                          key={ridx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                          {resource.type === "video" ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <BookOpen className="h-4 w-4" />
                          )}
                          {resource.title}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <Link href={`/roadmaps/${roadmap?.slug || attempt.roadmapId}/quiz`}>
          <Button>Retake Quiz</Button>
        </Link>
        <Link href="/profile/quiz-history">
          <Button variant="outline">View All Attempts</Button>
        </Link>
      </div>
    </div>
  )
}
