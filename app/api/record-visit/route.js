import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const now = new Date()
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)

    const lastVisit = await db
      .collection("visits")
      .findOne({ userId: user.id }, { sort: { date: -1 } })

    let currentStreak = 1
    let longestStreak = 1
    let showPopup = false
    let streakBroken = false
    let previousStreak = 0

    if (lastVisit) {
      const lastVisitDate = new Date(lastVisit.date)
      lastVisitDate.setHours(0, 0, 0, 0)

      const hoursDiff = Math.floor((now - new Date(lastVisit.lastVisit)) / (1000 * 60 * 60))
      const daysDiff = Math.floor((today - lastVisitDate) / (1000 * 60 * 60 * 24))

      if (daysDiff === 0) {
        await db.collection("visits").updateOne(
          { _id: lastVisit._id },
          { $set: { lastVisit: now } }
        )

        return NextResponse.json({
          success: true,
          streak: lastVisit.currentStreak || 1,
          longestStreak: lastVisit.longestStreak || 1,
          showPopup: false,
          streakBroken: false
        })
      }

      if (hoursDiff > 24) {
        streakBroken = true
        previousStreak = lastVisit.currentStreak || 0
        currentStreak = 1
        longestStreak = lastVisit.longestStreak || 1
      } else if (daysDiff === 1) {
        currentStreak = (lastVisit.currentStreak || 0) + 1
        longestStreak = Math.max(currentStreak, lastVisit.longestStreak || 0)
        showPopup = true
      } else {
        streakBroken = true
        previousStreak = lastVisit.currentStreak || 0
        currentStreak = 1
        longestStreak = lastVisit.longestStreak || 1
      }
    }

    await db.collection("visits").insertOne({
      userId: user.id,
      date: today,
      lastVisit: now,
      currentStreak,
      longestStreak,
      createdAt: now
    })

    return NextResponse.json({
      success: true,
      streak: currentStreak,
      longestStreak,
      showPopup,
      streakBroken,
      previousStreak
    })

  } catch (error) {
    console.error("Record visit error:", error)
    return NextResponse.json(
      { error: "Failed to record visit" },
      { status: 500 }
    )
  }
}
