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

    const { db } = await connectToDatabase()

    const questions = await db.collection("questions")
      .find({ updatedAt: { $exists: true } })
      .sort({ updatedAt: -1 })
      .limit(3)
      .toArray()

    const patterns = await db.collection("patterns").find({}).toArray()
    const patternMap = {}
    patterns.forEach(p => {
      patternMap[p.slug] = p.name
    })

    const solutions = questions.map(q => ({
      _id: q._id.toString(),
      title: q.title,
      difficulty: q.difficulty,
      pattern_id: q.pattern_id,
      pattern_name: patternMap[q.pattern_id] || q.pattern_id,
      approaches: q.approaches || [],
      updatedAt: q.updatedAt
    }))

    return NextResponse.json({ solutions })
  } catch (error) {
    console.error("Error fetching recent solutions:", error)
    return NextResponse.json({ error: "Failed to fetch recent solutions" }, { status: 500 })
  }
}
