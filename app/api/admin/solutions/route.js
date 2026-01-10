import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get last 3 edited questions that have approaches
    const recentSolutions = await db
      .collection("questions")
      .find({
        approaches: { $exists: true, $ne: [] }
      })
      .sort({ updatedAt: -1 })
      .limit(3)
      .toArray()

    return NextResponse.json({
      success: true,
      solutions: recentSolutions
    })
  } catch (error) {
    console.error("Error fetching recent solutions:", error)
    return NextResponse.json(
      { error: "Failed to fetch recent solutions" },
      { status: 500 }
    )
  }
}
