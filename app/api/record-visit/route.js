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

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Record visit for today
    await visitsCollection.updateOne(
      {
        userId: user.id,
        date: today
      },
      {
        $set: {
          userId: user.id,
          date: today,
          lastVisit: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Record visit error:", error)
    return NextResponse.json(
      { error: "Failed to record visit", details: error.message },
      { status: 500 }
    )
  }
}
