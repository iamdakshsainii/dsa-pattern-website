import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getRoadmap, isQuizUnlocked, getUserQuizAttempts, getRandomAvailableQuiz } from "@/lib/db"
import QuizClient from "./quiz-client"

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

  const attempts = await getUserQuizAttempts(user.id, roadmap.slug)
  const attemptLimit = roadmap.quizAttemptLimit || 3
  const attemptsUsed = attempts?.attemptsUsed || 0

  if (attemptsUsed >= attemptLimit) {
    redirect(`/roadmaps/${slug}?error=no-attempts`)
  }

  const quiz = await getRandomAvailableQuiz(user.id, roadmap.slug)

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    redirect(`/roadmaps/${slug}?error=no-quiz`)
  }

  return (
    <QuizClient
      roadmapId={roadmap.slug}
      questions={quiz.questions}
      settings={quiz.settings}
      attemptsRemaining={attemptLimit - attemptsUsed}
      quizId={quiz.quizId}
    />
  )
}
