import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get('year') || new Date().getFullYear())

    const { db } = await connectToDatabase()

    const startOfYear = new Date(year, 0, 1)
    startOfYear.setHours(0, 0, 0, 0)

    const endOfYear = new Date(year, 11, 31)
    endOfYear.setHours(23, 59, 59, 999)

    const [userProgress, quizResults] = await Promise.all([
      db.collection("user_progress")
        .find({
          user_id: user.id,
          status: "completed",
          updated_at: { $gte: startOfYear, $lte: endOfYear }
        })
        .toArray(),
      db.collection("quiz_results")
        .find({
          userId: user.id,
          completedAt: { $gte: startOfYear, $lte: endOfYear }
        })
        .toArray()
    ])

    const dateMap = new Map()

    userProgress.forEach(p => {
      const date = new Date(p.updated_at)
      date.setHours(0, 0, 0, 0)
      const dateKey = date.toISOString().split('T')[0]
      dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1)
    })

    quizResults.forEach(q => {
      const date = new Date(q.completedAt)
      date.setHours(0, 0, 0, 0)
      const dateKey = date.toISOString().split('T')[0]
      dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1)
    })

    const heatmapArray = []
    const startDate = new Date(year, 0, 1)
    const daysInYear = year % 4 === 0 ? 366 : 365

    for (let i = 0; i < daysInYear; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const dateKey = currentDate.toISOString().split('T')[0]

      heatmapArray.push({
        date: dateKey,
        count: dateMap.get(dateKey) || 0
      })
    }

    return NextResponse.json({
      success: true,
      heatmap: heatmapArray,
      year
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    })

  } catch (error) {
    console.error("Heatmap error:", error)
    return NextResponse.json(
      { error: "Failed to fetch heatmap", details: error.message },
      { status: 500 }
    )
  }
}
