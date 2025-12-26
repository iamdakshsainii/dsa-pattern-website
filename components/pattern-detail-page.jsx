"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Lightbulb, AlertCircle, Target, CheckCircle2 } from "lucide-react"
import QuestionList from "@/components/question-list"
import BackNavigation from "@/components/back-navigation"

export default function PatternDetailPage({ pattern, questions, solutions, userProgress, currentUser }) {
  const [completedQuestions, setCompletedQuestions] = useState(userProgress?.completed || [])

  // Calculate progress statistics
  const totalQuestions = questions.length
  const completedCount = completedQuestions.filter(qId =>
    questions.some(q => q._id === qId)
  ).length
  const progressPercentage = totalQuestions > 0
    ? Math.round((completedCount / totalQuestions) * 100)
    : 0

  // Update local state when progress changes
  const handleProgressUpdate = (newProgress) => {
    setCompletedQuestions(newProgress)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container flex h-16 items-center gap-4 px-4 max-w-7xl mx-auto">
          <BackNavigation label="Patterns" href="/patterns" />
          <h1 className="text-2xl font-bold">{pattern.name}</h1>
        </div>
      </div>

      <main className="container px-4 py-8 max-w-5xl mx-auto space-y-8">
        {/* Progress Card (Only show if user is logged in) */}
        {currentUser && (
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-lg">Your Progress</h3>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {completedCount}/{totalQuestions} solved
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{progressPercentage}% complete</span>
                  <span>{totalQuestions - completedCount} remaining</span>
                </div>
                <div className="h-3 bg-white/50 dark:bg-gray-800/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Motivational Message */}
              {progressPercentage === 100 && (
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                  🎉 Congratulations! You've completed all questions in this pattern!
                </p>
              )}
              {progressPercentage >= 50 && progressPercentage < 100 && (
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                  🔥 Great progress! Keep going!
                </p>
              )}
              {progressPercentage > 0 && progressPercentage < 50 && (
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                  💪 You're on your way! Keep practicing!
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Login Prompt (Only show if user is NOT logged in) */}
        {!currentUser && (
          <Card className="p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Track Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Login to mark questions as complete, bookmark your favorites, and track your learning journey!
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Pattern Explanation */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            When to Use This Pattern
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">{pattern.description}</p>

          {pattern.whenToUse && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Pattern Triggers:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {pattern.whenToUse.map((trigger, i) => (
                  <li key={i}>{trigger}</li>
                ))}
              </ul>
            </div>
          )}

          {pattern.commonMistakes && (
            <div className="mt-6 space-y-2">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Common Mistakes to Avoid:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {pattern.commonMistakes.map((mistake, i) => (
                  <li key={i}>{mistake}</li>
                ))}
              </ul>
            </div>
          )}

          {pattern.complexity && (
            <div className="mt-6 flex gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Time Complexity:</span>
                <Badge variant="outline" className="font-mono">{pattern.complexity.time}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Space Complexity:</span>
                <Badge variant="outline" className="font-mono">{pattern.complexity.space}</Badge>
              </div>
            </div>
          )}
        </Card>

        {/* Questions Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              Practice Problems
            </h2>
            <p className="text-muted-foreground">
              {questions.length} {questions.length === 1 ? 'problem' : 'problems'} to master this pattern
            </p>
          </div>

          <QuestionList
            questions={questions}
            patternSlug={pattern.slug}
            solutions={solutions}
            userProgress={{ completed: completedQuestions, bookmarks: userProgress?.bookmarks || [] }}
            currentUser={currentUser}
            onProgressUpdate={handleProgressUpdate}
          />
        </div>
      </main>
    </div>
  )
}
