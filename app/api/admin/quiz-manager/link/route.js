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

    const { questionId, sourceSetId, targetSetId, roadmapSlug } = await request.json()

    const { db } = await connectToDatabase()

    const sourceSet = await db.collection("quiz_bank").findOne({ quizId: sourceSetId })
    if (!sourceSet) {
      return NextResponse.json({ error: "Source set not found" }, { status: 404 })
    }

    const question = sourceSet.questions.find(q => q.id === questionId)
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    const newQuestion = {
      id: `q_${Date.now()}`,
      question: question.question,
      options: question.options || ['', '', '', ''],
      correctAnswers: question.correctAnswers || [],
      type: question.type || 'single',
      topic: question.topic || '',
      difficulty: question.difficulty || 'medium',
      explanation: question.explanation || '',
      resources: question.resources || [],
      code: question.code || '',
      image: question.image || '',
      linkedFrom: sourceSetId
    }

    await db.collection("quiz_bank").updateOne(
      { quizId: targetSetId },
      {
        $push: { questions: newQuestion },
        $set: { updatedAt: new Date() }
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error linking question:", error)
    return NextResponse.json({ error: "Failed to link question" }, { status: 500 })
  }
}
