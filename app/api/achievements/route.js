import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

// GET - Get user's unlocked badges
export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("dsa_patterns")

    const badges = await db.collection("user_achievements")
      .find({ userId: user.id })
      .sort({ unlockedAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      badges: badges.map(b => ({
        badgeId: b.badgeId,
        unlockedAt: b.unlockedAt
      }))
    })
  } catch (error) {
    console.error("Get achievements error:", error)
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    )
  }
}

// POST - Unlock a new badge
export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { badgeId } = await request.json()

    if (!badgeId) {
      return NextResponse.json(
        { error: "Badge ID required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("dsa_patterns")

    // Check if already unlocked
    const existing = await db.collection("user_achievements").findOne({
      userId: user.id,
      badgeId
    })

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Badge already unlocked"
      })
    }

    // Unlock badge
    await db.collection("user_achievements").insertOne({
      userId: user.id,
      badgeId,
      unlockedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      message: "Badge unlocked!"
    })
  } catch (error) {
    console.error("Unlock achievement error:", error)
    return NextResponse.json(
      { error: "Failed to unlock achievement" },
      { status: 500 }
    )
  }
}
