import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getUser, getQuizStats, getAllQuizResults, getRoadmap } from "@/lib/db"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token") || cookieStore.get("authToken")

    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const payload = verifyToken(authToken.value)
    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }

    const currentUser = await getUser(payload.email)
    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const stats = await getQuizStats(currentUser._id.toString())
    const allResults = await getAllQuizResults(currentUser._id.toString())

    const recentQuizzes = await Promise.all(
      allResults.slice(0, 5).map(async (result) => {
        const roadmap = await getRoadmap(result.roadmapId)
        return {
          roadmapId: result.roadmapId,
          roadmapTitle: roadmap?.title || 'Unknown Roadmap',
          roadmapIcon: roadmap?.icon || '📚',
          percentage: result.percentage,
          passed: result.passed,
          completedAt: result.completedAt
        }
      })
    )

    return NextResponse.json({
      stats,
      recentQuizzes
    })

  } catch (error) {
    console.error("Error fetching quiz stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
