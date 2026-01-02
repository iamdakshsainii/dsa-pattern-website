import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { toggleBookmark } from "@/lib/db"

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

    const { questionId } = await request.json()

    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      )
    }

    const result = await toggleBookmark(payload.userId, questionId)

    return NextResponse.json({ success: true, bookmarked: result.bookmarked })
  } catch (error) {
    console.error("Bookmark toggle error:", error)
    return NextResponse.json(
      { error: "Failed to toggle bookmark" },
      { status: 500 }
    )
  }
}
