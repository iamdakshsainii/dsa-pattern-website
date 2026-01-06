'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileQuestion,
  Settings,
  Plus,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Ban,
  CheckCircle2
} from "lucide-react"

export default function QuizManagerPage() {
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})

  useEffect(() => {
    fetchRoadmaps()
  }, [])

  const fetchRoadmaps = async () => {
    try {
      const res = await fetch('/api/admin/quiz/list', {
        credentials: 'include'
      })

      if (res.ok) {
        const data = await res.json()
        setRoadmaps(data.quizzes)
      }
    } catch (error) {
      console.error('Failed to fetch roadmaps:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModeChange = async (roadmapId, newMode) => {
    setUpdating(prev => ({ ...prev, [roadmapId]: true }))

    try {
      const res = await fetch(`/api/admin/quiz/${roadmapId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mode: newMode })
      })

      if (res.ok) {
        // Update local state
        setRoadmaps(prev => prev.map(r =>
          r.slug === roadmapId
            ? { ...r, quizMode: newMode, questionCount: newMode === 'custom' ? r.questionCount : 0 }
            : r
        ))
      }
    } catch (error) {
      console.error('Failed to update mode:', error)
    } finally {
      setUpdating(prev => ({ ...prev, [roadmapId]: false }))
    }
  }

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'auto':
        return <Sparkles className="h-4 w-4" />
      case 'custom':
        return <FileQuestion className="h-4 w-4" />
      case 'none':
        return <Ban className="h-4 w-4" />
      default:
        return null
    }
  }

  const getModeColor = (mode) => {
    switch (mode) {
      case 'auto':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'custom':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'none':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <FileQuestion className="h-6 w-6" />
                  Quiz Manager
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure quizzes for each roadmap
                </p>
              </div>
            </div>
            <Button onClick={fetchRoadmaps} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Quiz Modes
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <strong>Auto-Generated:</strong> Uses questions from lib/roadmaps/quiz-questions.js
            </div>
            <div className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4" />
              <strong>Custom:</strong> Create your own questions with full control
            </div>
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4" />
              <strong>None:</strong> No quiz available for this roadmap
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {roadmaps.map((roadmap) => (
            <Card key={roadmap.slug} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-4xl">{roadmap.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{roadmap.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline">{roadmap.category}</Badge>
                      <Badge variant="outline">{roadmap.difficulty}</Badge>
                      {roadmap.quizMode === 'custom' && (
                        <Badge className={getModeColor('custom')}>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {roadmap.questionCount} questions
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Select
                    value={roadmap.quizMode}
                    onValueChange={(value) => handleModeChange(roadmap.slug, value)}
                    disabled={updating[roadmap.slug]}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Auto-Generated
                        </div>
                      </SelectItem>
                      <SelectItem value="custom">
                        <div className="flex items-center gap-2">
                          <FileQuestion className="h-4 w-4" />
                          Custom
                        </div>
                      </SelectItem>
                      <SelectItem value="none">
                        <div className="flex items-center gap-2">
                          <Ban className="h-4 w-4" />
                          None
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {roadmap.quizMode === 'custom' && (
                    <Link href={`/admin/quiz-manager/${roadmap.slug}`}>
                      <Button size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Questions
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
