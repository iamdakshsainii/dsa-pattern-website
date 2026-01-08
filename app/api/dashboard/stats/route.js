import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import {
  getUserStats,
  getDailyStreak,
  getUserBookmarks,
  getPatternBreakdown,
  connectToDatabase,
  getSolution,
  getQuestionsByPattern
} from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = user.id

    const [
      userStats,
      streakData,
      bookmarks,
      patternBreakdown
    ] = await Promise.all([
      getUserStats(userId),
      getDailyStreak(userId),
      getUserBookmarks(userId),
      getPatternBreakdown(userId)
    ])

    const { db } = await connectToDatabase()

    const recentProgress = await db
      .collection("user_progress")
      .find({
        user_id: userId,
        status: "completed"
      })
      .sort({ updated_at: -1 })
      .limit(10)
      .toArray()

    const allProgress = await db
      .collection("user_progress")
      .find({
        user_id: userId,
        status: "completed"
      })
      .toArray()

    const recentActivity = await Promise.all(
      recentProgress.map(async (progress) => {
        const solution = await getSolution(progress.question_id)
        return {
          problemId: progress.question_id,
          problemName: solution?.title || "Unknown Problem",
          difficulty: solution?.difficulty || "Medium",
          pattern: solution?.pattern || "unknown",
          completed: true,
          lastAttemptDate: progress.updated_at
        }
      })
    )

    const difficultyStats = {
      Easy: { total: 0, solved: 0 },
      Medium: { total: 0, solved: 0 },
      Hard: { total: 0, solved: 0 }
    }

    const completedIds = new Set(allProgress.map(p => p.question_id))

    for (const pattern of patternBreakdown) {
      const questions = await getQuestionsByPattern(pattern.patternSlug)

      questions.forEach(q => {
        const diff = q.difficulty || "Medium"
        if (difficultyStats[diff]) {
          difficultyStats[diff].total++
          if (completedIds.has(q._id)) {
            difficultyStats[diff].solved++
          }
        }
      })
    }

    const stats = {
      totalQuestions: userStats.totalQuestions,
      solvedProblems: userStats.completedCount,
      bookmarksCount: bookmarks.length,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      difficultyStats,
      recentActivity,
      patternStats: patternBreakdown.map(p => ({
        name: p.patternName,
        slug: p.patternSlug,
        total: p.total,
        completed: p.completed,
        percentage: p.percentage
      }))
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard stats",
        details: error.message
      },
      { status: 500 }
    )
  }
}
