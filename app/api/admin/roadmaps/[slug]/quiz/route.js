import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getRandomAvailableQuiz, getUserQuizAttempts, getRoadmap } from "@/lib/db"

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { slug } = await params
    const roadmap = await getRoadmap(slug)

    if (!roadmap) {
      return NextResponse.json(
        { error: "Roadmap not found" },
        { status: 404 }
      )
    }

    const userAttempts = await getUserQuizAttempts(user.id, slug)
    const attemptLimit = roadmap.quizAttemptLimit || 3
    const attemptsUsed = userAttempts?.attemptsUsed || 0

    if (attemptsUsed >= attemptLimit) {
      return NextResponse.json(
        {
          error: "No attempts remaining",
          attemptsUsed,
          attemptLimit
        },
        { status: 403 }
      )
    }

    const quiz = await getRandomAvailableQuiz(user.id, slug)

    if (!quiz) {
      return NextResponse.json(
        { error: "No quiz available" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      quiz: {
        questions: quiz.questions,
        settings: quiz.settings
      },
      quizId: quiz.quizId,
      attemptsRemaining: attemptLimit - attemptsUsed
    })
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    )
  }
}
