import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { saveQuizResult, incrementQuizAttempt } from "@/lib/db"

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { slug } = await params
    const { quizId, answers, score, timeTaken } = await request.json()

    const result = await saveQuizResult(
      user.id,
      slug,
      score,
      answers,
      timeTaken
    )

    await incrementQuizAttempt(user.id, slug, quizId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    )
  }
}
