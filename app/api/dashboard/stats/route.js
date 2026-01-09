import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import {
  getUserStats,
  getBookmarksCountFixed,
  getPatternBreakdown,
  connectToDatabase
} from "@/lib/db"

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    const { db } = await connectToDatabase()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Fetch all data in parallel
    const [userStats, bookmarksCount, patternBreakdown, currentVisit] = await Promise.all([
      getUserStats(userId),
      getBookmarksCountFixed(userId),
      getPatternBreakdown(userId),
      db.collection("visits").findOne({ userId, date: today })
    ])

    // Get recent activity
    const recentProgress = await db
      .collection("user_progress")
      .find({ user_id: userId, status: "completed" })
      .sort({ updated_at: -1 })
      .limit(10)
      .toArray()

    // Get all completed for difficulty stats
    const allProgress = await db
      .collection("user_progress")
      .find({ user_id: userId, status: "completed" })
      .toArray()

    // Build recent activity with MongoDB question data
    const recentActivity = await Promise.all(
      recentProgress.map(async (progress) => {
        const question = await db.collection("questions").findOne({
          _id: progress.question_id
        })

        if (!question) {
          return {
            problemId: progress.question_id,
            problemName: "Unknown Problem",
            difficulty: "Medium",
            pattern: "unknown",
            completed: true,
            lastAttemptDate: progress.updated_at
          }
        }

        return {
          problemId: progress.question_id,
          problemName: question.title || "Unknown Problem",
          difficulty: question.difficulty || "Medium",
          pattern: question.pattern_id || "unknown",
          completed: true,
          lastAttemptDate: progress.updated_at
        }
      })
    )

    // Calculate difficulty stats from MongoDB
    const difficultyStats = {
      Easy: { total: 0, solved: 0 },
      Medium: { total: 0, solved: 0 },
      Hard: { total: 0, solved: 0 }
    }

    const allQuestions = await db.collection("questions").find({}).toArray()
    const completedIds = new Set(allProgress.map(p => p.question_id))

    allQuestions.forEach(q => {
      const diff = q.difficulty || "Medium"
      if (difficultyStats[diff]) {
        difficultyStats[diff].total++
        if (completedIds.has(q._id.toString())) {
          difficultyStats[diff].solved++
        }
      }
    })

    // Get streak from visits
    const currentStreak = currentVisit?.currentStreak || 0
    const longestStreak = currentVisit?.longestStreak || 0

    const stats = {
      totalQuestions: userStats.totalQuestions,
      solvedProblems: userStats.completedCount,
      bookmarksCount,
      currentStreak,
      longestStreak,
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
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats", details: error.message },
      { status: 500 }
    )
  }
}
