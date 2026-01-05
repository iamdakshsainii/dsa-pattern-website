import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getRoadmap, getRoadmapNodes, getUserRoadmapProgress } from "@/lib/db"
import RoadmapDetailClient from "./roadmap-detail-client"

export async function generateMetadata({ params }) {
  const { slug } = await params  // ← ADD await
  const roadmap = await getRoadmap(slug)

  if (!roadmap) {
    return {
      title: "Roadmap Not Found"
    }
  }

  return {
    title: `${roadmap.title} | DSA Patterns`,
    description: roadmap.description
  }
}

export default async function RoadmapDetailPage({ params }) {
  const { slug } = await params  // ← ADD await

  const roadmap = await getRoadmap(slug)

  if (!roadmap) {
    redirect('/roadmaps')
  }

  const nodes = await getRoadmapNodes(slug)

  const currentUser = await getCurrentUser()
  let userProgress = null

  if (currentUser) {
    userProgress = await getUserRoadmapProgress(currentUser.id, slug)
  }

  return (
    <RoadmapDetailClient
      roadmap={roadmap}
      nodes={nodes}
      userProgress={userProgress}
      currentUser={currentUser}
    />
  )
}
