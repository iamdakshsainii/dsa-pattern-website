"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ArrowLeft, Info, BookOpen, Database, List, LayoutGrid } from "lucide-react"
import Link from "next/link"
import QuizPoolTable from "./quiz-pool-table"
import QuizPoolFilters from "./quiz-pool-filters"
import RoadmapQuizzesTable from "./roadmap-quizzes-table"
import CreateQuizDialog from "./create-quiz-dialog"

export default function QuizManagerClient() {
  const [poolData, setPoolData] = useState({ questions: [], sets: [], topics: [] })
  const [roadmapQuizzes, setRoadmapQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("pool")
  const [viewMode, setViewMode] = useState("sets")
  const [filters, setFilters] = useState({
    search: '',
    roadmap: 'all',
    difficulty: 'all',
    topic: 'all',
    source: 'all'
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (activeTab === 'pool') {
      fetchPoolData()
    }
  }, [filters, activeTab])

  async function fetchData() {
    try {
      const roadmapRes = await fetch("/api/admin/quiz-manager/roadmap-quizzes")
      const roadmapData = await roadmapRes.json()
      setRoadmapQuizzes(roadmapData.quizzes || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchPoolData() {
    try {
      const params = new URLSearchParams()
      if (filters.roadmap !== 'all') params.set('roadmap', filters.roadmap)
      if (filters.difficulty !== 'all') params.set('difficulty', filters.difficulty)
      if (filters.topic !== 'all') params.set('topic', filters.topic)
      if (filters.source !== 'all') params.set('source', filters.source)

      const poolRes = await fetch(`/api/admin/quiz-manager/pool?${params.toString()}`)
      const poolData = await poolRes.json()

      let filteredData = { ...poolData }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredData.sets = poolData.sets?.filter(set =>
          set.setName.toLowerCase().includes(searchLower) ||
          set.questions.some(q => q.question.toLowerCase().includes(searchLower))
        ) || []

        filteredData.questions = poolData.questions?.filter(q =>
          q.question.toLowerCase().includes(searchLower) ||
          q.setName.toLowerCase().includes(searchLower)
        ) || []
      }

      setPoolData(filteredData)
    } catch (error) {
      console.error("Failed to fetch pool data:", error)
    }
  }

  const totalQuestions = poolData.questions?.length || 0
  const totalSets = poolData.sets?.length || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mt-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Quiz Manager</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage quiz pool and roadmap quizzes
            </p>
          </div>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Quiz Pool</strong> shows all questions from all quiz sets across all roadmaps.
            Questions stay in their original sets and are referenced when used in quizzes.
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm text-muted-foreground">Total Questions</div>
          </div>
          <div className="text-2xl font-bold">{totalQuestions}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-sm text-muted-foreground">Quiz Sets</div>
          </div>
          <div className="text-2xl font-bold">{totalSets}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Database className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm text-muted-foreground">Avg Questions/Set</div>
          </div>
          <div className="text-2xl font-bold">
            {totalSets > 0 ? Math.round(totalQuestions / totalSets) : 0}
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="pool" className="flex-1 sm:flex-initial text-xs sm:text-sm">
              Quiz Pool ({totalQuestions})
            </TabsTrigger>
            <TabsTrigger value="roadmaps" className="flex-1 sm:flex-initial text-xs sm:text-sm">
              By Roadmap ({roadmapQuizzes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pool" className="mt-6 space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <QuizPoolFilters
                onFilterChange={setFilters}
                topics={poolData.topics || []}
              />
              <div className="flex gap-2 w-full lg:w-auto">
                <Button
                  variant={viewMode === "sets" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("sets")}
                  className="flex-1 lg:flex-initial"
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Set View
                </Button>
                <Button
                  variant={viewMode === "questions" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("questions")}
                  className="flex-1 lg:flex-initial"
                >
                  <List className="w-4 h-4 mr-2" />
                  Question View
                </Button>
              </div>
            </div>

            <QuizPoolTable
              sets={poolData.sets}
              questions={poolData.questions}
              viewMode={viewMode}
              loading={loading}
              onRefresh={fetchPoolData}
            />
          </TabsContent>

          <TabsContent value="roadmaps" className="mt-6">
            <RoadmapQuizzesTable
              quizzes={roadmapQuizzes}
              loading={loading}
              onRefresh={fetchData}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <CreateQuizDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => {
          fetchData()
          fetchPoolData()
        }}
      />
    </div>
  )
}
