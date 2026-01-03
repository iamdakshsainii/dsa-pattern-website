'use client'

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target
} from "lucide-react"
import QuestionList from "@/components/question-list"
import PatternProgress from "@/components/pattern-progress"

export default function PatternDetailPage({
  pattern,
  questions,
  solutions,
  userProgress,
  currentUser,
  patternSlug
}) {
  const [localProgress, setLocalProgress] = useState(userProgress?.completed || [])

  const handleProgressUpdate = (newProgress) => {
    setLocalProgress(newProgress)
  }

  if (!pattern) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Pattern not found</h2>
          <Link href="/patterns">
            <Button>Back to Patterns</Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalQuestions = questions.length
  const solvedQuestions = localProgress.length
  const progressPercentage = totalQuestions > 0
    ? Math.round((solvedQuestions / totalQuestions) * 100)
    : 0

  // Calculate difficulty breakdown
  const difficultyCount = {
    Easy: questions.filter(q => q.difficulty === "Easy").length,
    Medium: questions.filter(q => q.difficulty === "Medium").length,
    Hard: questions.filter(q => q.difficulty === "Hard").length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/patterns">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patterns
              </Button>
            </Link>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{pattern.name}</h1>
              <p className="text-muted-foreground max-w-3xl">
                {pattern.description}
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {totalQuestions} Problems
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Pattern Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5" />
                <h3 className="font-semibold">Your Progress</h3>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">
                  {progressPercentage}%
                </div>
                <p className="text-blue-100 text-sm">
                  {solvedQuestions}/{totalQuestions} completed
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-400">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Remaining</span>
                  <span className="font-semibold">
                    {totalQuestions - solvedQuestions}
                  </span>
                </div>
              </div>
            </Card>

            {/* Difficulty Breakdown */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Difficulty Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Easy</span>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {difficultyCount.Easy}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Medium</span>
                  </div>
                  <Badge variant="outline" className="text-yellow-600">
                    {difficultyCount.Medium}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Hard</span>
                  </div>
                  <Badge variant="outline" className="text-red-600">
                    {difficultyCount.Hard}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* When to Use Pattern */}
            {pattern.when_to_use && (
              <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">When to Use This Pattern</h3>
                    <p className="text-sm text-muted-foreground">
                      {pattern.when_to_use}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Time Complexity */}
            {pattern.time_complexity && (
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">Typical Complexity</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Time: </span>
                        <Badge variant="outline" className="font-mono">
                          {pattern.time_complexity}
                        </Badge>
                      </div>
                      {pattern.space_complexity && (
                        <div>
                          <span className="text-muted-foreground">Space: </span>
                          <Badge variant="outline" className="font-mono">
                            {pattern.space_complexity}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Key Points */}
            {pattern.key_points && pattern.key_points.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-3">Key Points</h3>
                <ul className="space-y-2">
                  {pattern.key_points.map((point, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Main Content - Questions */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pattern Progress Tracker */}
            <PatternProgress
              questions={questions}
              patternSlug={patternSlug}
              initialProgress={localProgress}
            />

            {/* Quick Stats */}
            {currentUser && (
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{solvedQuestions}</p>
                      <p className="text-sm text-muted-foreground">Solved</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {userProgress?.inProgress?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {totalQuestions - solvedQuestions}
                      </p>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Practice Problems Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Practice Problems</h2>
                <p className="text-muted-foreground">
                  {totalQuestions} problems to master this pattern
                </p>
              </div>
              {!currentUser && (
                <Link href="/auth/login">
                  <Button>
                    Login to Track Progress
                  </Button>
                </Link>
              )}
            </div>

            {/* Questions List */}
            {questions.length > 0 ? (
              <QuestionList
                questions={questions}
                patternSlug={patternSlug}
                solutions={solutions}
                userProgress={userProgress}
                currentUser={currentUser}
                onProgressUpdate={handleProgressUpdate}
              />
            ) : (
              <Card className="p-12">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    No problems found for this pattern yet.
                  </p>
                  <Link href="/patterns">
                    <Button variant="outline">
                      Browse Other Patterns
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
