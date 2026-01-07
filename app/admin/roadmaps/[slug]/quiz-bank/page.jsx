import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { getRoadmap, getQuizBank } from "@/lib/db"
import QuizBankManager from "./quiz-bank-manager"

export default async function ManageQuizBankPage({ params }) {
  const user = await getCurrentUser()
   if (!user || !isAdmin(user)) { 
    redirect("/dashboard")
  }

  const { slug } = await params
  const roadmap = await getRoadmap(slug)

  if (!roadmap) {
    redirect("/admin/roadmaps")
  }

  const quizzes = await getQuizBank(slug)
  return <QuizBankManager roadmap={roadmap} existingQuizzes={quizzes} />
}
