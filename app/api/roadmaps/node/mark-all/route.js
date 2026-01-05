import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { markAllSubtopicsComplete, getUserRoadmapProgress } from "@/lib/db"

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
    const { roadmapId, nodeId } = body

    if (!roadmapId || !nodeId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    await markAllSubtopicsComplete(
      payload.id,
      roadmapId,
      nodeId
    )

    const updatedProgress = await getUserRoadmapProgress(
      payload.id,
      roadmapId
    )

    return NextResponse.json({
      success: true,
      progress: updatedProgress
    })

  } catch (error) {
    console.error("Mark all complete error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to mark all complete" },
      { status: 500 }
    )
  }
}
