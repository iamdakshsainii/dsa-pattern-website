import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getNextQuizForUser, getQuizStatusForUser, getRoadmap } from "@/lib/db"

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

    const quizStatus = await getQuizStatusForUser(user.id, slug)

    if (!quizStatus) {
      return NextResponse.json(
        { error: "Quiz status not found" },
        { status: 404 }
      )
    }

    if (quizStatus.status === "mastered") {
      return NextResponse.json(
        {
          error: "Quiz mastered",
          message: "Congratulations! You've mastered this roadmap. No need for more quizzes - start applying for jobs!",
          status: "mastered"
        },
        { status: 403 }
      )
    }

    if (!quizStatus.canTakeQuiz) {
      return NextResponse.json(
        {
          error: "No attempts remaining",
          attemptsUsed: quizStatus.attemptsUsed,
          attemptsUnlocked: quizStatus.attemptsUnlocked
        },
        { status: 403 }
      )
    }

    const quiz = await getNextQuizForUser(user.id, slug)

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
      attemptsRemaining: quizStatus.attemptsRemaining,
      status: quizStatus.status
    })
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    )
  }
}
