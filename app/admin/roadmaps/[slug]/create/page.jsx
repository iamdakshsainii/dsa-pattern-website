import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { getRoadmap } from "@/lib/db"
import QuizCreator from "./quiz-creator"

export default async function CreateQuizPage({ params }) {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user)) {
    redirect("/dashboard")
  }

  const { slug } = await params
  const roadmap = await getRoadmap(slug)

  if (!roadmap) {
    redirect("/admin/roadmaps")
  }

  return <QuizCreator roadmap={roadmap} />
}
