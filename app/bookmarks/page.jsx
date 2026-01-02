// app/bookmarks/page.jsx
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getBookmarkedQuestions } from "@/lib/db"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Bookmark,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink
} from "lucide-react"

async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) return null

  try {
    return await verifyToken(token.value)
  } catch {
    return null
  }
}

export default async function BookmarksPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get bookmarked questions with user progress
  const { questions, userProgress } = await getBookmarkedQuestions(user.id)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
      case "hard":
        return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (questionId) => {
    if (userProgress.completed.includes(questionId)) {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />
    }
    if (userProgress.inProgress.includes(questionId)) {
      return <Clock className="h-5 w-5 text-yellow-600" />
    }
    return <Circle className="h-5 w-5 text-gray-400" />
  }

  const getStatusText = (questionId) => {
    if (userProgress.completed.includes(questionId)) {
      return { text: "Completed", color: "text-green-600" }
    }
    if (userProgress.inProgress.includes(questionId)) {
      return { text: "In Progress", color: "text-yellow-600" }
    }
    return { text: "Not Started", color: "text-gray-600" }
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900">
            <Bookmark className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold">Your Bookmarks</h1>
        </div>
        <p className="text-muted-foreground">
          Problems you've saved for later practice
        </p>
      </div>

      {/* Bookmarks List */}
      {questions.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                <Bookmark className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-6">
              Start bookmarking problems you want to revisit later!
            </p>
            <Link href="/patterns">
              <Button>
                Browse Problems
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {questions.map((question) => {
            const status = getStatusText(question._id)
            return (
              <Card
                key={question._id}
                className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Side - Question Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusIcon(question._id)}
                      <Badge
                        variant="outline"
                        className={getDifficultyColor(question.difficulty)}
                      >
                        {question.difficulty || "Medium"}
                      </Badge>
                      <span className={`text-sm font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>

                    <Link href={`/questions/${question._id}`}>
                      <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                        {question.title}
                      </h3>
                    </Link>

                    {question.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {question.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {question.pattern_name && (
                        <span className="flex items-center gap-1">
                          Pattern: <strong>{question.pattern_name}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Actions */}
                  <div className="flex flex-col gap-2">
                    <Link href={`/questions/${question._id}`}>
                      <Button size="sm" className="gap-2 w-full">
                        Solve
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    {question.leetcode_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        asChild
                      >
                        <a
                          href={question.leetcode_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LeetCode
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Stats Footer */}
      {questions.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Bookmarked</p>
            <p className="text-3xl font-bold">{questions.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-600">
              {questions.filter((q) => userProgress.completed.includes(q._id)).length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Remaining</p>
            <p className="text-3xl font-bold text-blue-600">
              {questions.filter((q) => !userProgress.completed.includes(q._id)).length}
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}
