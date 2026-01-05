import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getRoadmap, getRoadmapNodes, getUser, getUserRoadmapProgress } from "@/lib/db"
import RoadmapDetailClient from "./roadmap-detail-client"
// ❌ REMOVE THIS LINE:
// import { ProgressProvider } from "@/contexts/progress-context"

export default async function RoadmapDetailPage({ params }) {
  const { slug } = await params
  const roadmap = await getRoadmap(slug)

  if (!roadmap) {
    notFound()
  }

  const nodes = await getRoadmapNodes(slug)

  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token")
  let currentUser = null
  let userProgress = null

  if (authToken) {
    const payload = verifyToken(authToken.value)
    if (payload) {
      currentUser = await getUser(payload.email)
      userProgress = await getUserRoadmapProgress(payload.id, slug)
    }
  }

 return (
  <RoadmapDetailClient
    roadmap={roadmap}
    nodes={nodes}
    userProgress={userProgress}  // ← Passed as prop
    currentUser={currentUser}
  />
)
}
