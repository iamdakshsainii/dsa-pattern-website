import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get('year') || new Date().getFullYear())

    const client = await clientPromise
    const db = client.db("dsa_patterns")
    const progressCollection = db.collection("progress")

    // Get all completions for the user in the specified year
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31, 23, 59, 59)

    const completions = await progressCollection
      .find({
        userId: user.id,
        completed: true,
        completedDate: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .toArray()

    // Create heatmap data (371 days = 53 weeks * 7 days)
    const heatmap = []
    const today = new Date()
    const startOfYear = new Date(year, 0, 1)

    // Count completions by date
    const completionsByDate = {}
    completions.forEach(c => {
      if (c.completedDate) {
        const date = new Date(c.completedDate)
        const dateStr = date.toISOString().split('T')[0]
        completionsByDate[dateStr] = (completionsByDate[dateStr] || 0) + 1
      }
    })

    // Generate 371 days of data (53 weeks)
    for (let i = 0; i < 371; i++) {
      const date = new Date(startOfYear)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]

      heatmap.push({
        date: dateStr,
        count: completionsByDate[dateStr] || 0
      })
    }

    return NextResponse.json({
      success: true,
      heatmap,
      year
    })
  } catch (error) {
    console.error("Activity heatmap error:", error)
    return NextResponse.json(
      { error: "Failed to fetch activity heatmap", details: error.message },
      { status: 500 }
    )
  }
}
