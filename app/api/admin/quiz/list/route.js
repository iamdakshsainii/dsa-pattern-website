import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { getAllQuizzesForAdmin } from "@/lib/db"

export async function GET() {
  try {
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

    const quizzes = await getAllQuizzesForAdmin()

    return NextResponse.json({
      success: true,
      quizzes
    })

  } catch (error) {
    console.error("Error fetching quizzes for admin:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
