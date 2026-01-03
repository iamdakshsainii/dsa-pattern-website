import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

// GET - Fetch interview prep checklist
export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("dsa_patterns")

    const prep = await db.collection("interview_prep").findOne({ userId: user.id })

    return NextResponse.json({
      success: true,
      checklist: prep?.checklist || {}
    })
  } catch (error) {
    console.error("Interview prep fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch interview prep" },
      { status: 500 }
    )
  }
}

// POST - Update checklist item
export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId, value } = await request.json()

    if (!itemId || typeof value !== 'boolean') {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("dsa_patterns")

    await db.collection("interview_prep").updateOne(
      { userId: user.id },
      {
        $set: {
          [`checklist.${itemId}`]: value,
          updatedAt: new Date()
        },
        $setOnInsert: {
          userId: user.id,
          createdAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: "Checklist updated"
    })
  } catch (error) {
    console.error("Interview prep update error:", error)
    return NextResponse.json(
      { error: "Failed to update checklist" },
      { status: 500 }
    )
  }
}
