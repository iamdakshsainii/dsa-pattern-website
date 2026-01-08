import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getUserQuizBadgeStats } from "@/lib/db"

export async function GET(request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const stats = await getUserQuizBadgeStats(user.id)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching quiz badge stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch badge stats" },
      { status: 500 }
    )
  }
}
