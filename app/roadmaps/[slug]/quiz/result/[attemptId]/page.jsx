import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getQuizAttempt, getRoadmap } from "@/lib/db"
import QuizResultClient from "./quiz-result-client"

export default async function QuizResultPage({ params }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { slug, attemptId } = await params

  const [attempt, roadmap] = await Promise.all([
    getQuizAttempt(attemptId),
    getRoadmap(slug)
  ])

  if (!attempt || attempt.userId !== user.id) {
    redirect("/profile/quiz-history")
  }

  return <QuizResultClient attempt={attempt} roadmap={roadmap} />
}
