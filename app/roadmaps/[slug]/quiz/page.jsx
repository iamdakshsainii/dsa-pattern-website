import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getRoadmap, isQuizUnlocked, getQuizResult } from "@/lib/db"
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

  const quizResult = await getQuizResult(user.id, roadmap.slug)

  return (
    <QuizClient
      roadmap={roadmap}
      currentUser={user}
      previousResult={quizResult}
    />
  )
}
