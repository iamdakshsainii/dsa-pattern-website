'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, CheckCircle2 } from "lucide-react"

export default function QuizQuestionList({ questions, onEdit, onDelete }) {
  if (!questions || questions.length === 0) {
    return null
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "hard":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Questions ({questions.length})</h3>
      {questions.map((question, index) => (
        <Card key={question.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm text-muted-foreground">Q{index + 1}</span>
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
                {question.topic && (
                  <Badge variant="outline">{question.topic}</Badge>
                )}
                {question.type === "multiple" && (
                  <Badge variant="secondary">Multiple Choice</Badge>
                )}
              </div>

              <p className="font-medium mb-3">{question.question}</p>

              <div className="space-y-1 mb-3">
                {question.options.filter(o => o.trim()).map((option, idx) => {
                  const isCorrect = question.correctAnswers?.includes(option)
                  return (
                    <div
                      key={idx}
                      className={`text-sm p-2 rounded ${
                        isCorrect
                          ? "bg-green-50 dark:bg-green-900/20 border border-green-200"
                          : "bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isCorrect && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        <span>{option}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {question.resources && question.resources.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {question.resources.length} learning resource{question.resources.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(question)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(question.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
