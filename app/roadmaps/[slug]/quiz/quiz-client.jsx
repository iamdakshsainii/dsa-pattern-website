'use client'

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"

export default function QuizClient({ roadmapId, questions: initialQuestions }) {
  const router = useRouter()
  const [questions, setQuestions] = useState(initialQuestions || [])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(20 * 60) // 20 minutes in seconds
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Save progress to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const progress = {
        roadmapId,
        currentQuestion,
        userAnswers,
        timeLeft,
        timestamp: Date.now()
      }
      sessionStorage.setItem(`quiz_progress_${roadmapId}`, JSON.stringify(progress))
    }
  }, [roadmapId, currentQuestion, userAnswers, timeLeft])

  // Load progress on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(`quiz_progress_${roadmapId}`)
      if (saved) {
        try {
          const progress = JSON.parse(saved)
          // Only restore if less than 30 minutes old
          if (Date.now() - progress.timestamp < 30 * 60 * 1000) {
            setCurrentQuestion(progress.currentQuestion || 0)
            setUserAnswers(progress.userAnswers || {})
            setTimeLeft(progress.timeLeft || 20 * 60)
          }
        } catch (err) {
          console.error('Failed to restore quiz progress:', err)
        }
      }
    }
  }, [roadmapId])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = useCallback(async () => {
    if (submitting) return

    setSubmitting(true)
    setError(null)

    try {
      const startTime = 20 * 60 // 20 minutes
      const timeTaken = Math.round((startTime - timeLeft) / 60) // Convert to minutes

      // ✅ CRITICAL FIX: Build complete answer objects with ALL required fields
      const completeAnswers = questions.map((question, index) => {
        const userAnswer = userAnswers[question.id] || userAnswers[index] || ''

        // Determine correct answer (handle both formats)
        const correctAnswer = question.correct || question.correctAnswer ||
                            (Array.isArray(question.correctAnswers) ? question.correctAnswers[0] : '')

        const isCorrect = userAnswer === correctAnswer

        return {
          // Question identification
          questionId: question.id || `q_${index}`,

          // Question content
          question: question.question || question.text || '',
          options: question.options || [],

          // User's answer
          userAnswer: userAnswer,

          // Correct answer
          correctAnswer: correctAnswer,
          correctAnswers: question.correctAnswers || [correctAnswer],

          // Correctness
          isCorrect: isCorrect,

          // ✅ CRITICAL: Topic for weak topics analysis
          topic: question.topic || question.category || 'General',

          // Difficulty
          difficulty: question.difficulty || 'medium',

          // Learning resources
          explanation: question.explanation || '',
          resources: question.resources || []
        }
      })

      // Calculate score
      const score = completeAnswers.filter(a => a.isCorrect).length

      // Submit to API
      const response = await fetch('/api/roadmaps/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          roadmapId,
          score,
          answers: completeAnswers, // ✅ Send complete answer objects
          timeTaken
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to submit quiz: ${response.status}`)
      }

      const result = await response.json()

      // Clear saved progress
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`quiz_progress_${roadmapId}`)
      }

      // Redirect to results
      if (result.insertedId || result.attemptId) {
        router.push(`/roadmaps/${roadmapId}/quiz/result/${result.insertedId || result.attemptId}`)
      } else {
        throw new Error('No attempt ID returned')
      }
    } catch (err) {
      console.error('Quiz submission error:', err)
      setError(err.message)
      setSubmitting(false)
    }
  }, [questions, userAnswers, timeLeft, roadmapId, router, submitting])

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !submitting) {
      handleSubmit()
    }
  }, [timeLeft, submitting, handleSubmit])

  if (!questions || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-12 text-center border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Quiz Not Available</h2>
          <p className="text-muted-foreground mb-6">
            No questions found for this quiz. Please try again later.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </Card>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const answeredCount = Object.keys(userAnswers).length
  const progressPercentage = (answeredCount / questions.length) * 100
  const isLastQuestion = currentQuestion === questions.length - 1
  const hasAnsweredCurrent = userAnswers[currentQ?.id] || userAnswers[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with Timer */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              disabled={submitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Quiz
            </Button>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeLeft < 300 ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
            }`}>
              <Clock className="h-5 w-5" />
              <span className="text-xl font-bold font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress: {answeredCount}/{questions.length} answered</span>
              <span>{Math.round(progressPercentage)}% complete</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-6 border-2">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="outline" className="text-base px-3 py-1">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
            {currentQ?.topic && (
              <Badge variant="secondary" className="text-base px-3 py-1">
                {currentQ.topic}
              </Badge>
            )}
            {currentQ?.difficulty && (
              <Badge
                variant={
                  currentQ.difficulty === 'easy' ? 'default' :
                  currentQ.difficulty === 'hard' ? 'destructive' : 'secondary'
                }
                className="text-base px-3 py-1"
              >
                {currentQ.difficulty}
              </Badge>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-8 leading-relaxed">
            {currentQ?.question || currentQ?.text}
          </h2>

          {/* Options */}
          <RadioGroup
            value={userAnswers[currentQ?.id] || userAnswers[currentQuestion] || ''}
            onValueChange={(value) => handleAnswerSelect(currentQ?.id || currentQuestion, value)}
            className="space-y-4"
            disabled={submitting}
          >
            {(currentQ?.options || []).map((option, idx) => {
              const optionId = `option-${currentQuestion}-${idx}`
              const isSelected = (userAnswers[currentQ?.id] || userAnswers[currentQuestion]) === option

              return (
                <div
                  key={optionId}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-accent ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => !submitting && handleAnswerSelect(currentQ?.id || currentQuestion, option)}
                >
                  <RadioGroupItem
                    value={option}
                    id={optionId}
                    disabled={submitting}
                  />
                  <Label
                    htmlFor={optionId}
                    className="flex-1 cursor-pointer text-base leading-relaxed"
                  >
                    {option}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="p-4 mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-red-900 dark:text-red-100">Submission Failed</p>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || submitting}
            size="lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                disabled={submitting}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  idx === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : userAnswers[questions[idx]?.id] || userAnswers[idx]
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting || answeredCount === 0}
              size="lg"
              className="min-w-[140px]"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Quiz
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={submitting}
              size="lg"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Submit Warning */}
        {answeredCount < questions.length && (
          <Card className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                  {questions.length - answeredCount} unanswered question{questions.length - answeredCount !== 1 ? 's' : ''}
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Make sure to answer all questions before submitting. Unanswered questions will be marked as incorrect.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
