
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get('year') || new Date().getFullYear())

    const { db } = await connectToDatabase()

    // Date range for the year
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31, 23, 59, 59)

    // Get completions from user_progress (correct collection!)
    const completions = await db
      .collection("user_progress")
      .find({
        user_id: user.id,
        status: "completed",
        updated_at: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .toArray()

    // Also get quiz completions
    const quizCompletions = await db
      .collection("quiz_results")
      .find({
        userId: user.id,
        completedAt: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .toArray()

    // Count by date
    const countsByDate = {}

    // Add problem completions
    completions.forEach(c => {
      if (c.updated_at) {
        const dateStr = new Date(c.updated_at).toISOString().split('T')[0]
        countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1
      }
    })

    // Add quiz completions
    quizCompletions.forEach(q => {
      if (q.completedAt) {
        const dateStr = new Date(q.completedAt).toISOString().split('T')[0]
        countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1
      }
    })

    // Generate 371 days (53 weeks × 7 days)
    const heatmap = []
    const startOfYear = new Date(year, 0, 1)

    for (let i = 0; i < 371; i++) {
      const date = new Date(startOfYear)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]

      heatmap.push({
        date: dateStr,
        count: countsByDate[dateStr] || 0
      })
    }

    return NextResponse.json({
      success: true,
      heatmap,
      year,
      totalSubmissions: Object.values(countsByDate).reduce((sum, count) => sum + count, 0)
    })

  } catch (error) {
    console.error("Activity heatmap error:", error)
    return NextResponse.json(
      { error: "Failed to fetch heatmap", details: error.message },
      { status: 500 }
    )
  }
}
