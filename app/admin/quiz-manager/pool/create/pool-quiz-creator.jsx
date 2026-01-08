'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Upload, FileJson } from "lucide-react"
import Link from "next/link"
import QuizQuestionForm from "@/components/admin/quiz-question-form"
import QuizQuestionList from "@/components/admin/quiz-question-list"

export default function PoolQuizCreator() {
  const router = useRouter()
  const [quizName, setQuizName] = useState("")
  const [questions, setQuestions] = useState([])
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [saving, setSaving] = useState(false)
  const [jsonInput, setJsonInput] = useState("")
  const [jsonFile, setJsonFile] = useState(null)

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

  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)

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
          alert(`Imported ${imported.length} questions from file`)
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
          alert("Imported 1 question from file")
        }
      } catch (error) {
        alert("Invalid JSON file: " + error.message)
      }
    }
    reader.readAsText(file)
  }

  async function handleSave() {
    if (questions.length === 0) {
      alert("Add at least one question")
      return
    }

    setSaving(true)

    try {
      const res = await fetch('/api/admin/quiz-manager/pool', {
        method: "POST",
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
        alert("Failed to create quiz set")
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to create quiz set")
    } finally {
      setSaving(false)
    }
  }

  const exampleJSON = {
    question: "What is React?",
    options: ["Library", "Framework", "Language", "Tool"],
    correctAnswers: ["Library"],
    type: "single",
    difficulty: "easy",
    topic: "React Basics",
    explanation: "React is a JavaScript library for building user interfaces",
    code: "",
    image: "",
    resources: [
      { type: "youtube", title: "React Tutorial", url: "https://..." }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/quiz-manager">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Create Pool Quiz</h1>
            <p className="text-sm text-muted-foreground">Add 1 or more questions to pool</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-4 md:p-6">
              <div className="mb-6">
                <Label className="text-sm">Quiz Set Name (optional)</Label>
                <Input
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                  placeholder="Leave empty for auto-generated name"
                  className="mt-2"
                />
              </div>

              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="manual" className="text-xs md:text-sm">Manual</TabsTrigger>
                  <TabsTrigger value="json" className="text-xs md:text-sm">Paste JSON</TabsTrigger>
                  <TabsTrigger value="file" className="text-xs md:text-sm">Upload File</TabsTrigger>
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
                    <div>
                      <Label className="text-sm">Example JSON Format:</Label>
                      <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
{JSON.stringify(exampleJSON, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <Label className="text-sm">Paste JSON (single question or array):</Label>
                      <Textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder="Paste JSON here..."
                        rows={8}
                        className="font-mono text-xs mt-2"
                      />
                    </div>
                    <Button onClick={handleImportJSON} disabled={!jsonInput.trim()} className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Import JSON
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="file">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <FileJson className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <Label htmlFor="json-upload" className="cursor-pointer">
                        <div className="text-sm font-medium mb-2">Upload JSON File</div>
                        <div className="text-xs text-muted-foreground mb-4">
                          Click to select .json file
                        </div>
                        <Button type="button" variant="outline" size="sm">
                          Choose File
                        </Button>
                      </Label>
                      <Input
                        id="json-upload"
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
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
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <Card className="p-4 md:p-6">
              <h3 className="font-semibold mb-4 text-sm md:text-base">Quiz Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions:</span>
                  <span className="font-semibold">{questions.length}</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t space-y-2">
                <Button
                  onClick={handleSave}
                  disabled={saving || questions.length === 0}
                  className="w-full"
                  size="lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : `Save ${questions.length} Question${questions.length !== 1 ? 's' : ''}`}
                </Button>
                <Link href="/admin/quiz-manager" className="block">
                  <Button variant="outline" className="w-full" size="lg">Cancel</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
