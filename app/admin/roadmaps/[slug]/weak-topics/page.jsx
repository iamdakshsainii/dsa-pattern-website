import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { getRoadmap, getQuizConfig } from "@/lib/db"
import WeakTopicsManager from "./weak-topics-manager"

export default async function ManageWeakTopicsPage({ params }) {
  const user = await getCurrentUser()

if (!user || !isAdmin(user)) {
    redirect("/dashboard")
  }

  const { slug } = await params
  const roadmap = await getRoadmap(slug)

  if (!roadmap) {
    redirect("/admin/roadmaps")
  }

  const quizConfig = await getQuizConfig(slug)
  const existingResources = quizConfig?.settings?.topicResources || []

  return <WeakTopicsManager roadmap={roadmap} existingResources={existingResources} />
}
