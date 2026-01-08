import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getRoadmap, isQuizUnlocked, getQuizStatusForUser, getNextQuizForUser } from "@/lib/db"
import QuizClient from "./quiz-client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Trophy, Award, Briefcase, BookOpen, ArrowLeft } from "lucide-react"

export default async function QuizPage({ params }) {
  const { slug } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    redirect("/auth/login")
  }

  const user = await verifyToken(token.value)
  if (!user) {
    redirect("/auth/login")
  }

  const roadmap = await getRoadmap(slug)
  if (!roadmap) {
    notFound()
  }

  const unlocked = await isQuizUnlocked(user.id, roadmap.slug)
  if (!unlocked) {
    redirect(`/roadmaps/${slug}`)
  }

  const quizStatus = await getQuizStatusForUser(user.id, slug)

  if (!quizStatus) {
    redirect(`/roadmaps/${slug}?error=quiz-unavailable`)
  }

  if (quizStatus.status === "mastered") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Card className="p-12 text-center border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="mb-6">
              <Trophy className="h-24 w-24 text-green-600 mx-auto mb-4 animate-bounce" />
              <Badge className="bg-green-600 text-white text-lg px-6 py-2 mb-4">
                Roadmap Mastered!
              </Badge>
            </div>

            <h1 className="text-4xl font-bold mb-4 text-green-800 dark:text-green-300">
              Congratulations! 🎉
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              You've mastered this roadmap with {quizStatus.passed} successful attempts!
              No need for more quizzes - it's time to start applying for jobs and ace those interviews!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
              <Card className="p-4 bg-white dark:bg-gray-800">
                <div className="text-3xl font-bold text-green-600">{quizStatus.totalAttempts}</div>
                <div className="text-sm text-muted-foreground">Total Attempts</div>
              </Card>
              <Card className="p-4 bg-white dark:bg-gray-800">
                <div className="text-3xl font-bold text-green-600">{quizStatus.passed}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </Card>
              <Card className="p-4 bg-white dark:bg-gray-800">
                <div className="text-3xl font-bold text-green-600">{quizStatus.bestScore}%</div>
                <div className="text-sm text-muted-foreground">Best Score</div>
              </Card>
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              <Link href={`/roadmaps/${slug}/certificate`}>
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                  <Award className="h-5 w-5 mr-2" />
                  View Certificate
                </Button>
              </Link>

              <Link href="/jobs">
                <Button size="lg" variant="outline" className="w-full">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Browse Job Opportunities
                </Button>
              </Link>

              <Link href={`/roadmaps/${slug}`}>
                <Button size="lg" variant="outline" className="w-full">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Revise Roadmap Concepts
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button size="lg" variant="ghost" className="w-full">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              Come back anytime to revise concepts from the roadmap!
            </p>
          </Card>
        </div>
      </div>
    )
  }

  if (!quizStatus.canTakeQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Card className="p-12 text-center border-2 border-red-500">
            <Trophy className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">No Attempts Remaining</h2>
            <p className="text-muted-foreground mb-6">
              You've used all {quizStatus.attemptsUnlocked} attempts for this roadmap.
            </p>
            <div className="space-y-3 max-w-md mx-auto">
              <Link href={`/roadmaps/${slug}`}>
                <Button size="lg" className="w-full">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Back to Roadmap
                </Button>
              </Link>
              <Link href="/activity/quizzes">
                <Button size="lg" variant="outline" className="w-full">
                  View Quiz History
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const quiz = await getNextQuizForUser(user.id, slug)

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    redirect(`/roadmaps/${slug}?error=no-quiz`)
  }

  return (
    <QuizClient
      roadmapId={roadmap.slug}
      questions={quiz.questions}
      settings={quiz.settings}
      attemptsRemaining={quizStatus.attemptsRemaining}
      quizId={quiz.quizId}
    />
  )
}
