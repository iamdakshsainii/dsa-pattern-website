import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("dsa_patterns")
    const visitsCollection = db.collection("visits")

    const now = new Date()
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const existingToday = await visitsCollection.findOne({
      userId: user.id,
      date: today
    })

    if (existingToday) {
      return NextResponse.json({
        success: true,
        showPopup: false,
        streak: existingToday.currentStreak || 0
      })
    }

    const yesterdayVisit = await visitsCollection.findOne({
      userId: user.id,
      date: yesterday
    })

    let currentStreak = 1
    if (yesterdayVisit) {
      currentStreak = (yesterdayVisit.currentStreak || 0) + 1
    }

    const allVisits = await visitsCollection
      .find({ userId: user.id })
      .sort({ date: -1 })
      .toArray()

    let longestStreak = currentStreak
    let tempStreak = 1
    let prevDate = null

    for (const visit of allVisits) {
      if (prevDate) {
        const diffDays = Math.floor((prevDate - visit.date.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) {
          tempStreak++
          longestStreak = Math.max(longestStreak, tempStreak)
        } else {
          tempStreak = 1
        }
      }
      prevDate = visit.date.getTime()
    }

    await visitsCollection.insertOne({
      userId: user.id,
      date: today,
      lastVisit: now,
      currentStreak,
      longestStreak,
      createdAt: now
    })

    return NextResponse.json({
      success: true,
      showPopup: true,
      streak: currentStreak,
      longestStreak
    })
  } catch (error) {
    console.error("Record visit error:", error)
    return NextResponse.json(
      { error: "Failed to record visit", details: error.message },
      { status: 500 }
    )
  }
}
