export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import { getNewlyUnlockedBadges } from "@/lib/achievements/badge-definitions"

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const badges = await db.collection("user_achievements").find({ userId: user.id }).sort({ unlockedAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      badges: badges.map(b => ({
        _id: b._id.toString(),
        badgeId: b.badgeId,
        unlockedAt: b.unlockedAt,
        createdAt: b.createdAt
      }))
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    })
  } catch (error) {
    console.error("Error fetching achievements:", error)
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { stats } = await request.json()
    if (!stats) {
      return NextResponse.json({ error: "Stats required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const userBadges = await db.collection("user_achievements").find({ userId: user.id }).toArray()
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
      newBadges: newBadges.map(b => ({ id: b.id, name: b.name, description: b.description, icon: b.icon }))
    })
  } catch (error) {
    console.error("Error checking achievements:", error)
    return NextResponse.json({ error: "Failed to check achievements" }, { status: 500 })
  }
}
