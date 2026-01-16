import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getUserStats, getBookmarksCountFixed, getPatternBreakdown, connectToDatabase } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id
    const { db } = await connectToDatabase()
    const { ObjectId } = await import("mongodb")
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [userStats, bookmarksCount, patternBreakdown, currentVisit, recentProgress] = await Promise.all([
      getUserStats(userId),
      getBookmarksCountFixed(userId),
      getPatternBreakdown(userId),
      db.collection("visits").findOne({ userId, date: today }),
      db.collection("user_progress").find({ user_id: userId, status: "completed" }).sort({ updated_at: -1 }).limit(10).toArray()
    ])

    const allProgress = await db.collection("user_progress").find({ user_id: userId, status: "completed" }).toArray()

    const recentActivity = await Promise.all(
      recentProgress.map(async (progress) => {
        const question = await db.collection("questions").findOne({ _id: new ObjectId(progress.question_id) })
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
          problemId: question._id.toString(),
          problemName: question.title || "Unknown Problem",
          difficulty: question.difficulty || "Medium",
          pattern: question.pattern_id || "unknown",
          completed: true,
          lastAttemptDate: progress.updated_at
        }
      })
    )

    const difficultyStats = { Easy: { total: 0, solved: 0 }, Medium: { total: 0, solved: 0 }, Hard: { total: 0, solved: 0 } }
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

    const stats = {
      totalQuestions: userStats.totalQuestions,
      solvedProblems: userStats.completedCount,
      bookmarksCount,
      currentStreak: currentVisit?.currentStreak || 0,
      longestStreak: currentVisit?.longestStreak || 0,
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

    return NextResponse.json({ success: true, stats }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=180',
      }
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
