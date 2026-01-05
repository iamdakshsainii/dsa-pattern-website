import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { toggleSubtopicCompletion, getUserRoadmapProgress } from "@/lib/db"

export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")

    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const payload = verifyToken(authToken.value)
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { roadmapId, nodeId, subtopicId } = body

    if (!roadmapId || !nodeId || !subtopicId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const result = await toggleSubtopicCompletion(
      payload.id,
      roadmapId,
      nodeId,
      subtopicId
    )

    const updatedProgress = await getUserRoadmapProgress(
      payload.id,
      roadmapId
    )

    return NextResponse.json({
      success: true,
      completed: result.completed,
      progress: updatedProgress
    })

  } catch (error) {
    console.error("Toggle subtopic error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to toggle subtopic" },
      { status: 500 }
    )
  }
}
