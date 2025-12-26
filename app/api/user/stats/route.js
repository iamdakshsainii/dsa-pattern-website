import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import {
  getUserStats,
  getRecentActivity,
  getDailyStreak,
  getPatternBreakdown,
  getActivityHeatmap
} from "@/lib/db"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = currentUser.userId

    // Fetch all analytics data in parallel
    const [stats, recentActivity, streak, patternBreakdown, heatmap] = await Promise.all([
      getUserStats(userId),
      getRecentActivity(userId, 10),
      getDailyStreak(userId),
      getPatternBreakdown(userId),
      getActivityHeatmap(userId)
    ])

    return NextResponse.json({
      stats,
      recentActivity,
      streak,
      patternBreakdown,
      heatmap
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
}
