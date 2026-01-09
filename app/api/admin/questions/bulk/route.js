import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { questions } = await request.json()

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Questions array is required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Validate all questions
    for (const q of questions) {
      if (!q.title || !q.pattern_id || !q.slug) {
        return NextResponse.json(
          { error: "Each question must have title, pattern_id, and slug" },
          { status: 400 }
        )
      }
    }

    // Add timestamps
    const questionsToInsert = questions.map(q => ({
      ...q,
      created_at: new Date(),
      updated_at: new Date()
    }))

    const result = await db.collection("questions").insertMany(questionsToInsert)

    return NextResponse.json({
      success: true,
      created: result.insertedCount
    })
  } catch (error) {
    console.error("Bulk create error:", error)
    return NextResponse.json(
      { error: "Failed to create questions" },
      { status: 500 }
    )
  }
}


