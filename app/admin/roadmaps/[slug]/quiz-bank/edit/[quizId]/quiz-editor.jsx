'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import QuizQuestionForm from "@/components/admin/quiz-question-form"
import QuizQuestionList from "@/components/admin/quiz-question-list"

export default function QuizEditor({ roadmap, existingQuiz }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [quizName, setQuizName] = useState(existingQuiz.quizName || '')
  const [questions, setQuestions] = useState(existingQuiz.questions || [])
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [settings] = useState(existingQuiz.settings || {
    timeLimit: 20,
    passingScore: 70,
    shuffleQuestions: true,
    shuffleOptions: true,
    showExplanations: 'after_submit'
  })

  const handleAddQuestion = (question) => {
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === editingQuestion.id ? question : q))
      setEditingQuestion(null)
    } else {
      setQuestions([...questions, { ...question, id: `q_${Date.now()}` }])
    }
    toast({
      title: "Success",
      description: editingQuestion ? "Question updated" : "Question added"
    })
  }

  const handleEditQuestion = (question) => {
    setEditingQuestion(question)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId))
    toast({
      title: "Success",
      description: "Question deleted"
    })
  }

  const handleSave = async () => {
    if (!quizName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quiz name",
        variant: "destructive"
      })
      return
    }

    if (questions.length < 5) {
      toast({
        title: "Error",
        description: "Add at least 5 questions",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/quiz-bank/${existingQuiz.quizId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizName: quizName.trim(),
          questions,
          settings
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update quiz')
      }

      toast({
        title: "Success",
        description: "Quiz updated successfully"
      })
      router.push(`/admin/roadmaps/${roadmap.slug}/quiz-bank`)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quiz",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href={`/admin/roadmaps/${roadmap.slug}/quiz-bank`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quiz Bank
        </Button>
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Edit Quiz</h1>
        <p className="text-muted-foreground">{roadmap.title}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <Label htmlFor="quizName">Quiz Name</Label>
            <Input
              id="quizName"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              placeholder="e.g., Quiz Set 1"
              className="mt-2"
            />
          </Card>

          <QuizQuestionForm
            onSubmit={handleAddQuestion}
            editingQuestion={editingQuestion}
            onCancel={() => setEditingQuestion(null)}
          />

          <QuizQuestionList
            questions={questions}
            onEdit={handleEditQuestion}
            onDelete={handleDeleteQuestion}
          />
        </div>

        <div className="space-y-6">
          <Card className="p-6 sticky top-6">
            <h3 className="font-semibold mb-4">Quiz Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions:</span>
                <span className="font-semibold">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Limit:</span>
                <span className="font-semibold">{settings.timeLimit} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Passing Score:</span>
                <span className="font-semibold">{settings.passingScore}%</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <Button
                onClick={handleSave}
                disabled={loading || questions.length < 5}
                className="w-full"
                size="lg"
              >
                {loading ? "Saving..." : "Update Quiz"}
              </Button>
              {questions.length < 5 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Add at least 5 questions
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
