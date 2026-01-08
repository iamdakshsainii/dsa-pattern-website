'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"
import QuizQuestionForm from "@/components/admin/quiz-question-form"
import QuizQuestionList from "@/components/admin/quiz-question-list"

export default function PoolQuizEditor({ existingQuiz }) {
  const router = useRouter()
  const [quizName, setQuizName] = useState(existingQuiz?.quizName || "")
  const [questions, setQuestions] = useState(existingQuiz?.questions || [])
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [saving, setSaving] = useState(false)
  const [jsonInput, setJsonInput] = useState("")

  function handleAddQuestion(questionData) {
    if (editingQuestion) {
      setQuestions(questions.map(q =>
        q.id === editingQuestion.id ? { ...questionData, id: q.id } : q
      ))
      setEditingQuestion(null)
    } else {
      setQuestions([...questions, { ...questionData, id: `q_${Date.now()}` }])
    }
  }

  function handleEditQuestion(question) {
    setEditingQuestion(question)
  }

  function handleDeleteQuestion(questionId) {
    if (!confirm("Delete this question?")) return
    setQuestions(questions.filter(q => q.id !== questionId))
  }

  function handleImportJSON() {
    try {
      const parsed = JSON.parse(jsonInput)

      if (Array.isArray(parsed)) {
        const imported = parsed.map((q, idx) => ({
          id: `q_${Date.now()}_${idx}`,
          question: q.question,
          options: q.options || ['', '', '', ''],
          correctAnswers: q.correctAnswers || [],
          type: q.type || 'single',
          topic: q.topic || '',
          difficulty: q.difficulty || 'medium',
          explanation: q.explanation || '',
          resources: q.resources || [],
          code: q.code || '',
          image: q.image || ''
        }))
        setQuestions([...questions, ...imported])
        setJsonInput("")
        alert(`Imported ${imported.length} questions`)
      } else if (parsed.question) {
        const imported = {
          id: `q_${Date.now()}`,
          question: parsed.question,
          options: parsed.options || ['', '', '', ''],
          correctAnswers: parsed.correctAnswers || [],
          type: parsed.type || 'single',
          topic: parsed.topic || '',
          difficulty: parsed.difficulty || 'medium',
          explanation: parsed.explanation || '',
          resources: parsed.resources || [],
          code: parsed.code || '',
          image: parsed.image || ''
        }
        setQuestions([...questions, imported])
        setJsonInput("")
        alert("Imported 1 question")
      } else {
        alert("Invalid JSON format")
      }
    } catch (error) {
      alert("Invalid JSON: " + error.message)
    }
  }

  async function handleSave() {
    if (questions.length === 0) {
      alert("Add at least one question")
      return
    }

    setSaving(true)

    try {
      const endpoint = existingQuiz
        ? `/api/admin/quiz-manager/pool/${existingQuiz.quizId}`
        : `/api/admin/quiz-manager/pool`

      const method = existingQuiz ? "PUT" : "POST"

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizName: quizName.trim() || `Pool Set ${Date.now()}`,
          questions,
          roadmapId: null
        })
      })

      if (res.ok) {
        router.push("/admin/quiz-manager")
        router.refresh()
      } else {
        alert("Failed to save quiz set")
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save quiz set")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/quiz-manager">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Pool Quiz</h1>
          <p className="text-muted-foreground">Update questions in pool</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <Label>Quiz Set Name (optional)</Label>
          <Input
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            placeholder="Leave empty for auto-generated name"
          />
        </div>

        <Tabs defaultValue="manual">
          <TabsList className="mb-4">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="json">Import JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <QuizQuestionForm
              onSubmit={handleAddQuestion}
              editingQuestion={editingQuestion}
              onCancel={() => setEditingQuestion(null)}
            />
          </TabsContent>

          <TabsContent value="json">
            <div className="space-y-4">
              <Label>Paste JSON (single question or array)</Label>
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder={`Single: {"question":"What is...","options":["A","B","C","D"],"correctAnswers":["A"],"type":"single","difficulty":"medium"}

Array: [{"question":"Q1...","options":[],"correctAnswers":[]},{"question":"Q2..."}]`}
                rows={12}
                className="font-mono text-xs"
              />
              <Button onClick={handleImportJSON} disabled={!jsonInput.trim()}>
                <Upload className="w-4 h-4 mr-2" />
                Import JSON
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {questions.length > 0 && (
        <QuizQuestionList
          questions={questions}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
        />
      )}

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving || questions.length === 0} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : `Save ${questions.length} Question${questions.length !== 1 ? 's' : ''}`}
        </Button>
        <Link href="/admin/quiz-manager">
          <Button variant="outline" size="lg">Cancel</Button>
        </Link>
      </div>
    </div>
  )
}
