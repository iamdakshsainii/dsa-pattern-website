import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getRoadmap, getNodeWithSubtopics } from "@/lib/db"
import SubtopicPageClient from "./subtopic-page-client"

export default async function SubtopicPage({ params, searchParams }) {
  // ✅ FIX: Await params and searchParams
  const { slug, nodeId, subtopicId } = await params
  const query = await searchParams

  const roadmap = await getRoadmap(slug)
  if (!roadmap) {
    notFound()
  }

  const node = await getNodeWithSubtopics(nodeId)
  if (!node || node.roadmapId !== slug) {
    notFound()
  }

  const subtopic = node.subtopics?.find(s => s.subtopicId === subtopicId)
  if (!subtopic) {
    notFound()
  }

  const resourceType = query.type || 'youtube'

  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token")

  let currentUser = null

  if (authToken) {
    try {
      const payload = verifyToken(authToken.value)
      if (payload) {
        currentUser = { id: payload.id, name: payload.name, email: payload.email }
      }
    } catch (error) {
      console.error("Auth error:", error)
    }
  }

  return (
    <SubtopicPageClient
      roadmap={roadmap}
      node={node}
      subtopic={subtopic}
      resourceType={resourceType}
      currentUser={currentUser}
    />
  )
}
