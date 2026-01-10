import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const [patterns, userProgress] = await Promise.all([
      db.collection("patterns").find({}).sort({ order: 1 }).toArray(),
      db.collection("user_progress").find({ user_id: user.id }).toArray()
    ])

    const enrichedPatterns = await Promise.all(
      patterns.map(async (pattern) => {
        const questions = await db.collection("questions")
          .find({ pattern_id: pattern.slug })
          .toArray()

        const completedInPattern = userProgress.filter(p =>
          questions.some(q => q._id.toString() === p.question_id) &&
          p.status === "completed"
        ).length

        return {
          _id: pattern._id.toString(),
          name: pattern.name,
          slug: pattern.slug,
          total: questions.length,
          solved: completedInPattern,
          percentage: questions.length > 0
            ? Math.round((completedInPattern / questions.length) * 100)
            : 0
        }
      })
    )

    return NextResponse.json({
      success: true,
      patterns: enrichedPatterns
    })
  } catch (error) {
    console.error("Get patterns error:", error)
    return NextResponse.json(
      { error: "Failed to fetch patterns" },
      { status: 500 }
    )
  }
}
