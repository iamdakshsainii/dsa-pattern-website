import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET(request) {
  try {
    console.log("Stats API called")

    const user = await getCurrentUser()
    console.log("User:", user)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id
    const client = await clientPromise
    const db = client.db("dsa_patterns")

    console.log("Connected to DB")

    // Get all questions count
    const questionsCollection = db.collection("questions")
    const totalQuestions = await questionsCollection.countDocuments()
    console.log("Total questions:", totalQuestions)

    // Get user progress
    const progressCollection = db.collection("progress")
    const userProgress = await progressCollection
      .find({ userId })
      .toArray()
    console.log("User progress count:", userProgress.length)

    const response = {
      success: true,
      stats: {
        totalQuestions,
        solvedProblems: userProgress.filter(p => p.completed).length,
        bookmarksCount: userProgress.filter(p => p.bookmarked).length,
        inProgressProblems: userProgress.filter(p => !p.completed && p.attempts > 0).length,
        completionRate: totalQuestions > 0 ? Math.round((userProgress.filter(p => p.completed).length / totalQuestions) * 100) : 0,
        currentStreak: 0,
        patternStats: {},
        difficultyStats: {
          Easy: { total: 0, solved: 0 },
          Medium: { total: 0, solved: 0 },
          Hard: { total: 0, solved: 0 }
        },
        recentActivity: []
      }
    }

    console.log("Returning response:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics", details: error.message, stack: error.stack },
      { status: 500 }
    )
  }
}
