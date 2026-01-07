'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, ArrowLeft, Check, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function QuizBankSetup({ roadmap, existingQuizzes }) {
  const router = useRouter()
  const { toast } = useToast()
  const [quizzes, setQuizzes] = useState(existingQuizzes || [])
  const [loading, setLoading] = useState(false)

  const steps = [
    { number: 1, title: "Basic Info", active: false, completed: true },
    { number: 2, title: "Weak Topics", active: false, completed: true },
    { number: 3, title: "Quiz Bank", active: true, completed: false }
  ]

  const canPublish = quizzes.length >= 2

  const handleDelete = async (quizId) => {
    if (quizzes.length <= 2) {
      toast({
        title: "Cannot Delete",
        description: "Minimum 2 quizzes required",
        variant: "destructive"
      })
      return
    }

    try {
      const res = await fetch(`/api/admin/quiz-bank/${quizId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setQuizzes(quizzes.filter(q => q.quizId !== quizId))
        toast({
          title: "Success",
          description: "Quiz deleted"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete quiz",
        variant: "destructive"
      })
    }
  }

  const handlePublish = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/roadmaps/${roadmap.slug}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Failed to publish')
      }

      toast({
        title: "Success",
        description: "Roadmap published successfully!"
      })

      router.push('/admin/roadmaps')
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish roadmap",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    router.push(`/admin/roadmaps/${roadmap.slug}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/admin/roadmaps">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roadmaps
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-2">Setup: {roadmap.title}</h1>
      <p className="text-muted-foreground mb-6">Step 3 of 3: Create quiz bank (minimum 2 quizzes required)</p>

      <div className="flex items-center justify-between mb-8">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step.completed
                  ? 'bg-green-600 text-white'
                  : step.active
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step.completed ? <Check className="h-5 w-5" /> : step.number}
              </div>
              <span className={`text-sm mt-2 ${step.active ? 'font-semibold' : 'text-muted-foreground'}`}>
                {step.title}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${step.completed ? 'bg-green-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {!canPublish && (
        <Card className="p-4 mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                {quizzes.length}/2 Quizzes Created
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                You need at least 2 quizzes to publish this roadmap. Students will get random quizzes from your bank.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Quiz Bank</h2>
        <Link href={`/admin/roadmaps/${roadmap.slug}/setup/quiz-bank/create`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Button>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">No Quizzes Yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first quiz to get started
          </p>
          <Link href={`/admin/roadmaps/${roadmap.slug}/setup/quiz-bank/create`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create First Quiz
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3 mb-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.quizId} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{quiz.quizName}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="outline">
                      {quiz.questions?.length || 0} questions
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {quiz.settings?.timeLimit || 20} min • {quiz.settings?.passingScore || 70}% to pass
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/roadmaps/${roadmap.slug}/setup/quiz-bank/edit/${quiz.quizId}`}>
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(quiz.quizId)}
                    disabled={quizzes.length <= 2}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          onClick={handlePublish}
          disabled={!canPublish || loading}
          size="lg"
        >
          {loading ? "Publishing..." : "Publish Roadmap"}
        </Button>
        <Button
          onClick={handleSkip}
          variant="outline"
          size="lg"
        >
          Skip & Manage Later
        </Button>
        <Link href="/admin/roadmaps">
          <Button variant="outline" size="lg">
            Save & Exit
          </Button>
        </Link>
      </div>
    </div>
  )
}
