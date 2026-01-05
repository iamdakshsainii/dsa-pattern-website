import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getRoadmap, getRoadmapNodes, getUser, getUserRoadmapProgress } from "@/lib/db"
import NodeDetailClient from "./node-detail-client"

export default async function NodeDetailPage({ params }) {
  const { slug, nodeId } = await params

  const roadmap = await getRoadmap(slug)

  if (!roadmap) {
    notFound()
  }

  // ✅ FIX: Pass slug instead of ObjectId
  const nodes = await getRoadmapNodes(slug)  // ← Changed this line
  const node = nodes.find(n => n.nodeId === nodeId)

  if (!node) {
    notFound()
  }

  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token")
  let currentUser = null
  let completedSubtopics = []

  if (authToken) {
    const payload = verifyToken(authToken.value)
    if (payload) {
      currentUser = await getUser(payload.email)
      // ✅ FIX: Also pass slug here for consistency
      const progress = await getUserRoadmapProgress(payload.id, slug)
      const nodeProgress = progress?.nodesProgress?.find(np => np.nodeId === nodeId)
      completedSubtopics = nodeProgress?.completedSubtopics || []
    }
  }

  return (
    <NodeDetailClient
      node={node}
      roadmapSlug={slug}
      roadmapId={roadmap._id.toString()}
      roadmapTitle={roadmap.title}
      roadmapIcon={roadmap.icon}
      weekNumber={node.weekNumber}
      currentUser={currentUser}
      initialCompletedSubtopics={completedSubtopics}
    />
  )
}
