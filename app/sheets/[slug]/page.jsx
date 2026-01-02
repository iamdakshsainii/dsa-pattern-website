import { notFound } from "next/navigation"
import { getSheetBySlug, getQuestionsForSheet, getUserProgress } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import QuestionCard from "@/components/question-card"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, FileSpreadsheet } from "lucide-react"

export default async function SheetPage({ params }) {
  const { slug } = await params

  const sheet = await getSheetBySlug(slug)

  if (!sheet) {
    notFound()
  }

  const questions = await getQuestionsForSheet(sheet.name)

  let userProgress = null
  const currentUser = await getCurrentUser()

  if (currentUser) {
    userProgress = await getUserProgress(currentUser.userId)
  }

  const completedCount = userProgress?.completed?.length || 0
  const totalCount = questions.length
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container px-4 py-8 space-y-8">
        <Card className="p-8 bg-gradient-to-br from-purple-500 to-purple-600 border-purple-400 text-white">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileSpreadsheet className="w-8 h-8" />
                  <h1 className="text-4xl font-bold">{sheet.name}</h1>
                </div>
                <p className="text-purple-100 text-lg">{sheet.description}</p>
              </div>
              <Badge className="bg-white text-purple-600 text-lg px-4 py-2">
                {questions.length} Questions
              </Badge>
            </div>

            {currentUser && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">Your Progress</span>
                  </div>
                  <span className="text-xl font-bold">
                    {completedCount}/{totalCount} solved
                  </span>
                </div>
                <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Practice Questions</h2>
          {questions.map((question) => (
            <QuestionCard
              key={question._id}
              question={question}
              userProgress={userProgress}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
