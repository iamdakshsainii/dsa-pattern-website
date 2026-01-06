import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getAllQuizResults } from "@/lib/db"

export async function GET(request) {
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
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const roadmapId = searchParams.get('roadmapId')

    if (!roadmapId) {
      return NextResponse.json(
        { error: "roadmapId required" },
        { status: 400 }
      )
    }

    const allResults = await getAllQuizResults(payload.id)
    const roadmapAttempts = allResults
      .filter(result => result.roadmapId === roadmapId)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .map((result, index) => ({
        attemptNumber: allResults.filter(r =>
          r.roadmapId === roadmapId &&
          new Date(r.completedAt) <= new Date(result.completedAt)
        ).length,
        percentage: result.percentage,
        passed: result.passed,
        score: result.score,
        completedAt: result.completedAt
      }))

    return NextResponse.json({
      attempts: roadmapAttempts,
      totalAttempts: roadmapAttempts.length
    })

  } catch (error) {
    console.error("Error fetching quiz attempts:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
