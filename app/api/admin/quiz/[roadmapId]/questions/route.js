import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { addQuizQuestion, deleteQuizQuestion, updateQuizQuestion } from "@/lib/db"

export async function POST(request, { params }) {
  try {
    const { roadmapId } = await params

    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")

    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const payload = verifyToken(authToken.value)
    if (!payload || !isAdmin(payload)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    const questionData = await request.json()

    // Validate question data
    if (!questionData.question || !questionData.options || questionData.options.length < 2) {
      return NextResponse.json(
        { error: "Question must have text and at least 2 options" },
        { status: 400 }
      )
    }

    if (!questionData.correctAnswers || questionData.correctAnswers.length === 0) {
      return NextResponse.json(
        { error: "Question must have at least one correct answer" },
        { status: 400 }
      )
    }

    const result = await addQuizQuestion(roadmapId, questionData)

    return NextResponse.json(result)

  } catch (error) {
    console.error("Error adding question:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { roadmapId } = await params

    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")

    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const payload = verifyToken(authToken.value)
    if (!payload || !isAdmin(payload)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    const { questionId, ...questionData } = await request.json()

    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID required" },
        { status: 400 }
      )
    }

    const result = await updateQuizQuestion(roadmapId, questionId, questionData)

    return NextResponse.json(result)

  } catch (error) {
    console.error("Error updating question:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { roadmapId } = await params

    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")

    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const payload = verifyToken(authToken.value)
    if (!payload || !isAdmin(payload)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get('questionId')

    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID required" },
        { status: 400 }
      )
    }

    const result = await deleteQuizQuestion(roadmapId, questionId)

    return NextResponse.json(result)

  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
