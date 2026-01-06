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

  const nodes = await getRoadmapNodes(slug)
  const node = nodes.find(n => n.nodeId === nodeId)

  if (!node) {
    notFound()
  }

  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token") 
  let currentUser = null
  let completedSubtopics = []

  if (authToken) {
    try {
      const payload = verifyToken(authToken.value)

      if (payload && payload.email) {
        currentUser = await getUser(payload.email)

        if (currentUser && currentUser._id) {
          const progress = await getUserRoadmapProgress(currentUser._id.toString(), slug)
          const nodeProgress = progress?.nodesProgress?.find(np => np.nodeId === nodeId)
          completedSubtopics = nodeProgress?.completedSubtopics || []
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
    }
  }

  const serializedUser = currentUser ? {
    _id: currentUser._id.toString(),
    email: currentUser.email,
    name: currentUser.name,
  } : null

  return (
    <NodeDetailClient
      node={node}
      roadmapSlug={slug}
      roadmapTitle={roadmap.title}
      roadmapIcon={roadmap.icon}
      weekNumber={node.weekNumber}
      currentUser={serializedUser}
      initialCompletedSubtopics={completedSubtopics}
    />
  )
}
