import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import { getNewlyUnlockedBadges } from "@/lib/achievements/badge-definitions"

export async function POST(request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { stats } = await request.json()

    if (!stats) {
      return NextResponse.json(
        { error: "Stats required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const userBadges = await db
      .collection("user_achievements")
      .find({ userId: user.id })
      .toArray()

    const newBadges = getNewlyUnlockedBadges(stats, userBadges)

    for (const badge of newBadges) {
      await db.collection("user_achievements").insertOne({
        userId: user.id,
        badgeId: badge.id,
        unlockedAt: new Date(),
        createdAt: new Date()
      })
    }

    return NextResponse.json({
      success: true,
      newBadges: newBadges.map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
        icon: b.icon
      }))
    })
  } catch (error) {
    console.error("Error checking achievements:", error)
    return NextResponse.json(
      { error: "Failed to check achievements" },
      { status: 500 }
    )
  }
}
