import { NextResponse } from "next/server"
import { getRoadmapNodes, getUserRoadmapProgress } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// GET /api/roadmaps/[slug]/nodes
export async function GET(request, { params }) {
  try {
    const { slug } = params
    const roadmapId = slug

    const nodes = await getRoadmapNodes(roadmapId)

    const currentUser = await getCurrentUser()
    let userProgress = null

    if (currentUser) {
      userProgress = await getUserRoadmapProgress(currentUser.id, roadmapId)
    }

    return NextResponse.json({
      nodes,
      userProgress
    })
  } catch (error) {
    console.error("Error fetching roadmap nodes:", error)
    return NextResponse.json(
      { error: "Failed to fetch nodes" },
      { status: 500 }
    )
  }
}
