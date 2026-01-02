import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { updateUserProgress } from "@/lib/db"

export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(authToken.value)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { questionId, status } = await request.json()

    if (!questionId || !status) {
      return NextResponse.json(
        { error: "Question ID and status are required" },
        { status: 400 }
      )
    }

    await updateUserProgress(payload.userId, questionId, { status })

    return NextResponse.json({ success: true, status })
  } catch (error) {
    console.error("Progress update error:", error)
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    )
  }
}
