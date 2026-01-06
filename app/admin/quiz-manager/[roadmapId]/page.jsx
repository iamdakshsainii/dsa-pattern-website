'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Plus,
  Settings,
  Save,
  RefreshCw,
  FileQuestion
} from "lucide-react"
import QuestionEditor from "./components/question-editor"
import QuizSettings from "./components/quiz-settings"
import QuestionList from "./components/question-list"

export default function QuizEditorPage() {
  const params = useParams()
  const router = useRouter()
  const roadmapId = params.roadmapId

  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [showNewQuestion, setShowNewQuestion] = useState(false)

  useEffect(() => {
    fetchQuizConfig()
  }, [roadmapId])

  const fetchQuizConfig = async () => {
    try {
      const res = await fetch(`/api/admin/quiz/${roadmapId}`, {
        credentials: 'include'
      })

      if (res.ok) {
        const data = await res.json()
        setConfig(data.config)
      }
    } catch (error) {
      console.error('Failed to fetch quiz config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async (newSettings) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/quiz/${roadmapId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...config,
          settings: newSettings
        })
      })

      if (res.ok) {
        setConfig(prev => ({ ...prev, settings: newSettings }))
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddQuestion = async (questionData) => {
    try {
      const res = await fetch(`/api/admin/quiz/${roadmapId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(questionData)
      })

      if (res.ok) {
        fetchQuizConfig()
        setShowNewQuestion(false)
      }
    } catch (error) {
      console.error('Failed to add question:', error)
    }
  }

  const handleUpdateQuestion = async (questionId, questionData) => {
    try {
      const res = await fetch(`/api/admin/quiz/${roadmapId}/questions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ questionId, ...questionData })
      })

      if (res.ok) {
        fetchQuizConfig()
        setEditingQuestion(null)
      }
    } catch (error) {
      console.error('Failed to update question:', error)
    }
  }

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Delete this question?')) return

    try {
      const res = await fetch(
        `/api/admin/quiz/${roadmapId}/questions?questionId=${questionId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      if (res.ok) {
        fetchQuizConfig()
      }
    } catch (error) {
      console.error('Failed to delete question:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-red-600 mb-4">Failed to load quiz configuration</p>
          <Button onClick={() => router.push('/admin/quiz-manager')}>
            Back to Quiz Manager
          </Button>
        </Card>
      </div>
    )
  }

  const questionCount = config.questions?.length || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin/quiz-manager')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <FileQuestion className="h-6 w-6" />
                  Quiz Editor
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {roadmapId} • {questionCount} questions
                </p>
              </div>
            </div>
            <Button onClick={fetchQuizConfig} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions" className="gap-2">
              <FileQuestion className="h-4 w-4" />
              Questions ({questionCount})
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-6">
            {showNewQuestion ? (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">New Question</h3>
                <QuestionEditor
                  onSave={handleAddQuestion}
                  onCancel={() => setShowNewQuestion(false)}
                />
              </Card>
            ) : (
              <Button onClick={() => setShowNewQuestion(true)} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Question
              </Button>
            )}

            {editingQuestion && (
              <Card className="p-6 border-2 border-primary">
                <h3 className="text-lg font-semibold mb-4">Edit Question</h3>
                <QuestionEditor
                  question={editingQuestion}
                  onSave={(data) => handleUpdateQuestion(editingQuestion.id, data)}
                  onCancel={() => setEditingQuestion(null)}
                />
              </Card>
            )}

            <QuestionList
              questions={config.questions || []}
              onEdit={setEditingQuestion}
              onDelete={handleDeleteQuestion}
            />

            {questionCount === 0 && !showNewQuestion && (
              <Card className="p-12 text-center">
                <FileQuestion className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No questions yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your first custom question to get started
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <QuizSettings
              settings={config.settings}
              onSave={handleSaveSettings}
              saving={saving}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
