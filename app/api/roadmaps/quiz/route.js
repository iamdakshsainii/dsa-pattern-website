import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getUser, saveQuizResult, incrementQuizAttempt } from "@/lib/db"

export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token") || cookieStore.get("authToken")

    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const payload = verifyToken(authToken.value)
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }

    const currentUser = await getUser(payload.email)
    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const { roadmapId, answers, score, timeTaken, quizId } = await request.json()

    if (!roadmapId || !answers) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    await incrementQuizAttempt(currentUser._id.toString(), roadmapId, quizId)

    const result = await saveQuizResult(
      currentUser._id.toString(),
      roadmapId,
      score,
      answers,
      timeTaken
    )

    return NextResponse.json(result)

  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


