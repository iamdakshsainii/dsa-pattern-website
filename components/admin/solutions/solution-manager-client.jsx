"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Lightbulb, Clock, ArrowRight, FileCode, Search, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"

export default function SolutionManagerClient() {
  const [patterns, setPatterns] = useState([])
  const [selectedPattern, setSelectedPattern] = useState(null)
  const [questions, setQuestions] = useState([])
  const [filteredQuestions, setFilteredQuestions] = useState([])
  const [recentSolutions, setRecentSolutions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isRecentExpanded, setIsRecentExpanded] = useState(true)
  const [solutionFilter, setSolutionFilter] = useState("all") // "all", "no-solution", "has-solution"

  useEffect(() => {
    fetchPatterns()
    fetchRecentSolutions()
  }, [])

  useEffect(() => {
    if (selectedPattern) {
      fetchQuestions(selectedPattern)
    }
  }, [selectedPattern])

  useEffect(() => {
    let filtered = questions

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply solution filter
    if (solutionFilter === "no-solution") {
      filtered = filtered.filter(q => !q.approaches || q.approaches.length === 0)
    } else if (solutionFilter === "has-solution") {
      filtered = filtered.filter(q => q.approaches && q.approaches.length > 0)
    }

    setFilteredQuestions(filtered)
  }, [searchQuery, questions, solutionFilter])

  const fetchPatterns = async () => {
    try {
      const res = await fetch("/api/patterns")
      const data = await res.json()
      setPatterns(data.patterns || [])
    } catch (error) {
      console.error("Error fetching patterns:", error)
    }
  }

  const fetchQuestions = async (patternSlug) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/patterns/${patternSlug}/questions`)
      const data = await res.json()
      setQuestions(data.questions || [])
      setFilteredQuestions(data.questions || [])
      setSolutionFilter("all") // Reset filter when changing pattern
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentSolutions = async () => {
    try {
      const res = await fetch("/api/admin/solutions/recent")
      if (res.ok) {
        const data = await res.json()
        setRecentSolutions(data.solutions || [])
      }
    } catch (error) {
      console.error("Error fetching recent solutions:", error)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "bg-green-500/10 text-green-700 border-green-300"
      case "medium": return "bg-yellow-500/10 text-yellow-700 border-yellow-300"
      case "hard": return "bg-red-500/10 text-red-700 border-red-300"
      default: return "bg-gray-500/10 text-gray-700"
    }
  }

  const getSolutionStatus = (question) => {
    const hasApproaches = question.approaches?.length > 0
    const hasHints = question.hints?.length > 0
    const hasResources = question.resources !== null && question.resources !== undefined
    const hasMistakes = question.commonMistakes?.length > 0

    if (hasApproaches && hasHints && hasResources && hasMistakes) {
      return { status: "complete", color: "text-green-600", icon: CheckCircle }
    } else if (hasApproaches) {
      return { status: "partial", color: "text-yellow-600", icon: AlertCircle }
    } else {
      return { status: "empty", color: "text-gray-400", icon: AlertCircle }
    }
  }

  const getFilterCounts = () => {
    const searchFiltered = searchQuery.trim()
      ? questions.filter(q => q.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : questions

    return {
      all: searchFiltered.length,
      noSolution: searchFiltered.filter(q => !q.approaches || q.approaches.length === 0).length,
      hasSolution: searchFiltered.filter(q => q.approaches && q.approaches.length > 0).length
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Solution Manager</h1>
          <p className="text-muted-foreground">Add and manage solutions for questions</p>
        </div>
      </div>

      {recentSolutions.length > 0 && (
        <Card className="p-6">
          <div
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setIsRecentExpanded(!isRecentExpanded)}
          >
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recently Edited Solutions
            </h2>
            {isRecentExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          {isRecentExpanded && (
            <div className="grid gap-3">
              {recentSolutions.map((solution) => (
                <Link key={solution._id} href={`/admin/questions/solutions/${solution._id}`}>
                  <div className="p-4 border rounded-lg hover:bg-accent transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCode className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{solution.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {solution.approaches?.length || 0} approaches
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(solution.difficulty)}>
                        {solution.difficulty}
                      </Badge>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Select Pattern
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {patterns.map((pattern) => (
            <Button
              key={pattern._id}
              variant={selectedPattern === pattern.slug ? "default" : "outline"}
              className="justify-start h-auto p-4"
              onClick={() => {
                setSelectedPattern(pattern.slug)
                setSearchQuery("")
              }}
            >
              <div className="text-left">
                <div className="font-bold">{pattern.name}</div>
                <div className="text-xs opacity-70">
                  {pattern.questionCount || 0} questions
                </div>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {selectedPattern && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              Select Question from {patterns.find(p => p.slug === selectedPattern)?.name}
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredQuestions.length} of {questions.length} questions
            </div>
          </div>

          {questions.length > 5 && (
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {questions.length > 0 && (
            <div className="flex gap-2 mb-4">
              {(() => {
                const counts = getFilterCounts()
                return (
                  <>
                    <Button
                      variant={solutionFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSolutionFilter("all")}
                      className="flex-1"
                    >
                      All Questions ({counts.all})
                    </Button>
                    <Button
                      variant={solutionFilter === "no-solution" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSolutionFilter("no-solution")}
                      className="flex-1"
                    >
                      No Solution ({counts.noSolution})
                    </Button>
                    <Button
                      variant={solutionFilter === "has-solution" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSolutionFilter("has-solution")}
                      className="flex-1"
                    >
                      Has Solution ({counts.hasSolution})
                    </Button>
                  </>
                )
              })()}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading questions...</div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No questions match your search" : "No questions found in this pattern"}
            </div>
          ) : (
            <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredQuestions.map((question) => {
                const solutionStatus = getSolutionStatus(question)
                const StatusIcon = solutionStatus.icon

                return (
                  <Link key={question._id} href={`/admin/questions/solutions/${question._id}`}>
                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-3 flex-1">
                        <StatusIcon className={`h-5 w-5 ${solutionStatus.color}`} />
                        <div className="flex-1">
                          <div className="font-medium">{question.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {question.approaches?.length > 0 ? (
                              <span className="text-green-600">
                                ✓ {question.approaches.length} approach{question.approaches.length > 1 ? 'es' : ''} added
                              </span>
                            ) : (
                              <span className="text-red-600">✗ No solution yet</span>
                            )}
                            {question.hints?.length > 0 && (
                              <span className="ml-3 text-blue-600">
                                • {question.hints.length} hint{question.hints.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </Card>
      )}

      {!selectedPattern && (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Select a pattern to get started</p>
            <p className="text-sm">Choose a pattern above to view and edit solutions for its questions</p>
          </div>
        </Card>
      )}
    </div>
  )
}
