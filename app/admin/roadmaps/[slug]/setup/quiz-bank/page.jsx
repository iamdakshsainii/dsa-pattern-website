import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { getRoadmap, getQuizBank } from "@/lib/db"
import QuizBankSetup from "./quiz-bank-setup"

export default async function QuizBankSetupPage({ params }) {
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

  return <QuizBankSetup roadmap={roadmap} existingQuizzes={quizzes} />
}

