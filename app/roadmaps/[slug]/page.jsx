import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getRoadmap, getRoadmapNodes, getUser, getUserRoadmapProgress, getQuizStatusForUser } from "@/lib/db"
import RoadmapDetailClient from "./roadmap-detail-client"
import AuthCTABanner from "@/components/roadmaps/auth-cta-banner"

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
  let quizStatus = null

  if (authToken) {
    const payload = verifyToken(authToken.value)
    if (payload) {
      currentUser = await getUser(payload.email)
      if (currentUser) {
        userProgress = await getUserRoadmapProgress(currentUser._id.toString(), slug)
        quizStatus = await getQuizStatusForUser(currentUser._id.toString(), slug)
      }
    }
  }

  return (
    <>
      {!currentUser && <AuthCTABanner />}
      <RoadmapDetailClient
        roadmap={roadmap}
        nodes={nodes}
        userProgress={userProgress}
        currentUser={currentUser}
        quizStatus={quizStatus}
      />
    </>
  )
}
