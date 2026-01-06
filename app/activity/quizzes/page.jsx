import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getAllQuizResults, getRoadmaps } from "@/lib/db"
import QuizHistoryClient from "./quiz-history-client"

export const metadata = {
  title: "Quiz History",
  description: "View your quiz attempts and scores"
}

export default async function QuizHistoryPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const [quizResults, roadmaps] = await Promise.all([
    getAllQuizResults(user.id),
    getRoadmaps()
  ])

  return <QuizHistoryClient results={quizResults} roadmaps={roadmaps} userId={user.id} />
}
