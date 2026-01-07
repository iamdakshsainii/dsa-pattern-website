import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { deleteQuizFromBank, updateQuizInBank } from "@/lib/db"

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { quizId } = await params
    const quizData = await request.json()

    const result = await updateQuizInBank(quizId, quizData)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating quiz:", error)
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { quizId } = await params
    const result = await deleteQuizFromBank(quizId)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting quiz:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete quiz" },
      { status: 500 }
    )
  }
}
