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

    const roadmaps = await db.collection("roadmaps")
      .find({})
      .project({ slug: 1, title: 1, quizBankIds: 1 })
      .toArray()

    const allQuizzes = []

    for (const roadmap of roadmaps) {
      if (roadmap.quizBankIds && roadmap.quizBankIds.length > 0) {
        const quizzes = await db.collection("quiz_bank")
          .find({ quizId: { $in: roadmap.quizBankIds } })
          .toArray()

        quizzes.forEach(quiz => {
          allQuizzes.push({
            ...quiz,
            _id: quiz._id.toString(),
            roadmapId: roadmap._id.toString(),
            roadmapSlug: roadmap.slug,
            roadmapTitle: roadmap.title
          })
        })
      }
    }

    return NextResponse.json({ quizzes: allQuizzes })
  } catch (error) {
    console.error("Error fetching roadmap quizzes:", error)
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}
