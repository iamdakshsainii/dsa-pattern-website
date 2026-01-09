import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id
    const client = await clientPromise
    const db = client.db("dsa_patterns")

    // Get all questions count
    const questionsCollection = db.collection("questions")
    const totalQuestions = await questionsCollection.countDocuments()

    // Get user progress
    const progressCollection = db.collection("progress")
    const userProgress = await progressCollection
      .find({ userId })
      .toArray()

    // Calculate statistics
    const solvedProblems = userProgress.filter(p => p.completed).length
    const bookmarksCount = userProgress.filter(p => p.bookmarked).length
    const inProgressProblems = userProgress.filter(p => !p.completed && p.attempts > 0).length

    // Pattern stats
    const patternStats = {}
    userProgress.forEach(problem => {
      const pattern = problem.pattern || 'Unknown'
      if (!patternStats[pattern]) {
        patternStats[pattern] = { total: 0, solved: 0, inProgress: 0 }
      }
      patternStats[pattern].total++
      if (problem.completed) {
        patternStats[pattern].solved++
      } else if (problem.attempts > 0) {
        patternStats[pattern].inProgress++
      }
    })

    // Difficulty stats - get actual counts from questions collection
    const difficultyStats = {
      Easy: { total: 0, solved: 0 },
      Medium: { total: 0, solved: 0 },
      Hard: { total: 0, solved: 0 }
    }

    const allQuestions = await questionsCollection.find({}).toArray()

    // Count total for each difficulty
    allQuestions.forEach(q => {
      const difficulty = q.difficulty || 'Unknown'
      if (difficultyStats[difficulty]) {
        difficultyStats[difficulty].total++
      }
    })

    // Count solved for each difficulty
    userProgress.forEach(problem => {
      const difficulty = problem.difficulty || 'Unknown'
      if (difficultyStats[difficulty] && problem.completed) {
        difficultyStats[difficulty].solved++
      }
    })

    // Recent activity (last 10)
    const recentActivity = userProgress
      .filter(p => p.lastAttemptDate)
      .sort((a, b) => new Date(b.lastAttemptDate) - new Date(a.lastAttemptDate))
      .slice(0, 10)
      .map(p => ({
        problemId: p.questionId || p.problemId,
        problemName: p.problemName,
        pattern: p.pattern,
        difficulty: p.difficulty,
        completed: p.completed,
        lastAttemptDate: p.lastAttemptDate,
        attempts: p.attempts
      }))

    // Calculate streak
    const visitsCollection = db.collection("visits")
    const visits = await visitsCollection
      .find({ userId })
      .sort({ date: -1 })
      .toArray()

    let currentStreak = 0
    let lastDate = null

    for (const visit of visits) {
      const visitDate = new Date(visit.date)
      visitDate.setHours(0, 0, 0, 0)

      if (!lastDate) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (visitDate.getTime() === today.getTime() || visitDate.getTime() === yesterday.getTime()) {
          currentStreak = 1
          lastDate = visitDate
        } else {
          break
        }
      } else {
        const expectedDate = new Date(lastDate)
        expectedDate.setDate(expectedDate.getDate() - 1)

        if (visitDate.getTime() === expectedDate.getTime()) {
          currentStreak++
          lastDate = visitDate
        } else {
          break
        }
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalQuestions,
        solvedProblems,
        bookmarksCount,
        inProgressProblems,
        completionRate: totalQuestions > 0 ? Math.round((solvedProblems / totalQuestions) * 100) : 0,
        currentStreak,
        patternStats,
        difficultyStats,
        recentActivity
      }
    })
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics", details: error.message },
      { status: 500 }
    )
  }
}
