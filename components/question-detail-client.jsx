'use client'
import NotesManager from "@/components/notes-manager"
import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Lightbulb,
  Clock,
  Database,
  AlertCircle,
  Lightbulb as HintIcon,
  ArrowRight,
  Building2,
  Hash,
  LogIn,
  BookmarkPlus,
  Target,
  Brain,
  BookOpen,
  ArrowLeft
} from "lucide-react"
import SolutionTabs from "@/components/solution-tabs"
import NotesSection from "@/components/notes-section"
import ResourcesSection from "@/components/resources-section"

export default function QuestionDetailClient({
  pattern,
  question,
  currentUser,
  patternSlug
}) {
  const router = useRouter()

  const handleBack = () => {
    if (patternSlug) {
      router.push(`/patterns/${patternSlug}`)
    } else {
      router.back()
    }
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Question not found</h2>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg shadow-green-500/30"
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg shadow-yellow-500/30"
      case "hard":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg shadow-red-500/30"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  const hasResources = question.resources || question.links
  const resourcesData = question.resources || (question.links ? {
    leetcode: question.links.leetcode,
    videos: question.links.youtube ? [{
      title: "Video Tutorial",
      url: question.links.youtube,
      channel: "Tutorial"
    }] : [],
    articles: question.links.gfg ? [{
      title: "GeeksforGeeks Article",
      url: question.links.gfg,
      source: "GeeksforGeeks"
    }] : (question.links.article ? [{
      title: "Article",
      url: question.links.article,
      source: "Article"
    }] : [])
  } : null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20">
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4 max-w-6xl">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {pattern?.name || "Back"}
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <h1 className="text-xl font-bold truncate bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {question.title}
            </h1>
            <Badge className={getDifficultyColor(question.difficulty)}>
              {question.difficulty}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        {hasResources && (
          <ResourcesSection resources={resourcesData} />
        )}

        {question.patternTriggers && (
          <Card className="group p-6 border-2 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950/20 dark:via-amber-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800 shadow-lg hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  Why This Pattern Works
                  <Target className="h-4 w-4 text-yellow-600" />
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {question.patternTriggers}
                </p>
              </div>
            </div>
          </Card>
        )}

        {(question.tags?.length > 0 || question.companies?.length > 0) && (
          <Card className="p-6 border-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="space-y-5">
              {question.tags?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Hash className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm font-medium hover:scale-105 transition-transform cursor-pointer">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {question.companies?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Building2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-lg">Asked By</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {question.companies.map((company, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1 text-sm font-semibold border-2 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:scale-105 transition-all cursor-pointer">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {question.approaches?.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Solutions & Approaches
              </h2>
            </div>
            <SolutionTabs approaches={question.approaches} />
          </div>
        )}

        {question.complexity && (
          <Card className="p-6 border-2 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
              Complexity Analysis
            </h2>
            <div className="space-y-4">
              {question.complexity.time && (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-800 hover:shadow-md transition-all">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-lg">Time Complexity:</span>
                      <Badge variant="outline" className="font-mono text-base px-3 py-1 border-2 border-blue-500 text-blue-600 dark:text-blue-400">
                        {question.complexity.time}
                      </Badge>
                    </div>
                    {question.complexity.timeExplanation && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {question.complexity.timeExplanation}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {question.complexity.space && (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-800 hover:shadow-md transition-all">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-lg">Space Complexity:</span>
                      <Badge variant="outline" className="font-mono text-base px-3 py-1 border-2 border-purple-500 text-purple-600 dark:text-purple-400">
                        {question.complexity.space}
                      </Badge>
                    </div>
                    {question.complexity.spaceExplanation && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {question.complexity.spaceExplanation}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {currentUser && (
         <NotesManager
  questionId={question._id.toString()}
  userId={currentUser.id}
  questionTitle={question.title}
/>
        )}
      </main>
    </div>
  )
}
