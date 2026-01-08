import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { setId } = await params
    const { quizName, questions } = await request.json()

    const { db } = await connectToDatabase()

    await db.collection("quiz_bank").updateOne(
      { quizId: setId },
      {
        $set: {
          quizName,
          questions: questions.map(q => ({
            ...q,
            id: q.id || Date.now().toString()
          })),
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating pool quiz:", error)
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 })
  }
}
