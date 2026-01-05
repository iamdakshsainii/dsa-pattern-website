import { NextResponse } from "next/server"
import { getUserRoadmapProgress, saveRoadmapProgress, updateNodeProgress, getUserActiveRoadmaps } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// GET /api/roadmaps/progress
export async function GET(request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const roadmapId = searchParams.get('roadmapId')

    if (roadmapId) {
      const progress = await getUserRoadmapProgress(currentUser.id, roadmapId)
      return NextResponse.json({ progress })
    } else {
      const activeRoadmaps = await getUserActiveRoadmaps(currentUser.id)
      return NextResponse.json({ activeRoadmaps })
    }
  } catch (error) {
    console.error("Error fetching progress:", error)
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    )
  }
}

// POST /api/roadmaps/progress
export async function POST(request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { roadmapId, nodeId, status, completedSubtopics } = body

    if (!roadmapId || !nodeId) {
      return NextResponse.json(
        { error: "roadmapId and nodeId are required" },
        { status: 400 }
      )
    }

    const result = await updateNodeProgress(
      currentUser.id,
      roadmapId,
      nodeId,
      status,
      completedSubtopics || []
    )

    return NextResponse.json({
      success: true,
      result
    })
  } catch (error) {
    console.error("Error saving progress:", error)
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    )
  }
}
