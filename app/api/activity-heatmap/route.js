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

    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31, 23, 59, 59)

    const completedQuestions = await db
      .collection("user_progress")
      .find({
        user_id: user.id,
        status: "completed",
        updated_at: { $gte: startDate, $lte: endDate }
      })
      .toArray()

    const heatmapData = {}

    completedQuestions.forEach((question) => {
      const date = new Date(question.updated_at)
      const dateKey = date.toISOString().split('T')[0]

      if (!heatmapData[dateKey]) {
        heatmapData[dateKey] = 0
      }
      heatmapData[dateKey]++
    })

    const daysInYear = 366
    const heatmap = []

    for (let i = 0; i < daysInYear; i++) {
      const date = new Date(year, 0, 1)
      date.setDate(date.getDate() + i)
      const dateKey = date.toISOString().split('T')[0]

      heatmap.push({
        date: dateKey,
        count: heatmapData[dateKey] || 0
      })
    }

    return NextResponse.json({
      success: true,
      heatmap
    })

  } catch (error) {
    console.error("Activity heatmap error:", error)
    return NextResponse.json(
      { error: "Failed to fetch heatmap data" },
      { status: 500 }
    )
  }
}
