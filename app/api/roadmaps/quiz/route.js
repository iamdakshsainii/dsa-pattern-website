import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { saveQuizResult, incrementQuizAttempt, getUserQuizBadgeStats, recalculateRoadmapProgress } from "@/lib/db"

export async function POST(request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { roadmapId, quizId, answers, score, timeTaken } = await request.json()

    const result = await saveQuizResult(
      user.id,
      roadmapId,
      score,
      answers,
      timeTaken,
      quizId
    )

    await incrementQuizAttempt(user.id, roadmapId, quizId)

    // 🔥 ADD THIS - Recalculate progress after quiz submission
    if (result.evaluation?.status === "mastered") {
      await recalculateRoadmapProgress(user.id, roadmapId)
    }

    const badgeStats = await getUserQuizBadgeStats(user.id)

    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/achievements/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          stats: badgeStats
        })
      })
    } catch (badgeError) {
      console.error('Badge check failed:', badgeError)
    }

    return NextResponse.json({
      ...result,
      badgeStats
    })
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    )
  }
}
