import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET(request) {
  try {
    const { db } = await connectToDatabase()

    const patterns = await db
      .collection("patterns")
      .find({})
      .sort({ order: 1 })
      .toArray()

    // Count questions for each pattern
    for (let pattern of patterns) {
      const questionCount = await db
        .collection("questions")
        .countDocuments({ pattern_id: pattern.slug })

      pattern.questionCount = questionCount
    }

    return NextResponse.json({
      success: true,
      patterns
    })
  } catch (error) {
    console.error("Error fetching patterns:", error)
    return NextResponse.json(
      { error: "Failed to fetch patterns" },
      { status: 500 }
    )
  }
}
