import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { getRoadmap, getQuizFromBank } from "@/lib/db"
import QuizEditor from "./quiz-editor"

export default async function EditQuizPage({ params }) {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user)) {
    redirect("/dashboard")
  }

  const { slug, quizId } = await params
  const roadmap = await getRoadmap(slug)
  const quiz = await getQuizFromBank(quizId)

  if (!roadmap || !quiz) {
    redirect("/admin/roadmaps")
  }

  return <QuizEditor roadmap={roadmap} existingQuiz={quiz} />
}
