import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getAllQuizResults, getRoadmaps } from "@/lib/db"
import QuizHistoryClient from "./quiz-history-client"

export const metadata = {
  title: "Quiz History | Track Your Progress",
  description: "View all your quiz attempts and detailed performance metrics"
}

export default async function QuizHistoryPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  try {
    // Fetch data on server side for better performance
    const [quizResults, roadmaps] = await Promise.all([
      getAllQuizResults(user.id),
      getRoadmaps()
    ])

    return (
      <QuizHistoryClient
        results={quizResults || []}
        roadmaps={roadmaps || []}
        userId={user.id}
      />
    )
  } catch (error) {
    console.error("Failed to load quiz history:", error)

    // ✅ Graceful error handling
    return (
      <QuizHistoryClient
        results={[]}
        roadmaps={[]}
        userId={user.id}
      />
    )
  }
}
