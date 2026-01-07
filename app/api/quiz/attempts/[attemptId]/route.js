import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { deleteQuizAttempt } from "@/lib/db"

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { attemptId } = await params
    const deleted = await deleteQuizAttempt(attemptId, user.id)

    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete attempt" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting quiz attempt:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
