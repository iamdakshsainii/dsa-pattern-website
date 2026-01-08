import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { getQuizFromBank } from "@/lib/db"
import PoolQuizEditor from "./pool-quiz-editor"

export default async function EditPoolQuizPage({ params }) {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user)) {
    redirect("/dashboard")
  }

  const { setId } = await params
  const quizSet = await getQuizFromBank(setId)

  if (!quizSet) {
    redirect("/admin/quiz-manager")
  }

  return <PoolQuizEditor existingQuiz={quizSet} />
}
