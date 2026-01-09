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

    const { searchParams } = new URL(request.url)
    const pattern = searchParams.get('pattern')

    if (!pattern) {
      return NextResponse.json({ error: "Pattern required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const questions = await db
      .collection("questions")
      .find({ pattern_id: pattern })
      .sort({ order: -1 })
      .limit(1)
      .toArray()

    const nextOrder = questions.length > 0 ? (questions[0].order || 0) + 1 : 1

    return NextResponse.json({
      success: true,
      nextOrder
    })
  } catch (error) {
    console.error("Get next order error:", error)
    return NextResponse.json(
      { error: "Failed to fetch next order" },
      { status: 500 }
    )
  }
}
