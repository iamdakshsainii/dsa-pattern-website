import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { deleteQuizAttempt, getUser } from "@/lib/db"

export async function DELETE(request) {
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
    if (!payload || !payload.email) {
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

    const { attemptId } = await request.json()

    if (!attemptId) {
      return NextResponse.json(
        { error: "Attempt ID required" },
        { status: 400 }
      )
    }

    const result = await deleteQuizAttempt(attemptId, currentUser._id.toString())

    if (!result) {
      return NextResponse.json(
        { error: "Attempt not found or unauthorized" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Quiz attempt deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting quiz attempt:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
