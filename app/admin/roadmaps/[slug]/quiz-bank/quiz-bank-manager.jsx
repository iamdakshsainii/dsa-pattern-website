'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function QuizBankManager({ roadmap, existingQuizzes }) {
  const { toast } = useToast()
  const [quizzes, setQuizzes] = useState(existingQuizzes || [])

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href={`/admin/roadmaps/${roadmap.slug}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Quiz Bank</h1>
          <p className="text-muted-foreground">{roadmap.title}</p>
        </div>
        <Link href={`/admin/roadmaps/${roadmap.slug}/setup/quiz-bank/create?returnUrl=/admin/roadmaps/${roadmap.slug}/quiz-bank`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
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
                <Link href={`/admin/roadmaps/${roadmap.slug}/quiz-bank/edit/${quiz.quizId}`}>
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
    </div>
  )
}
