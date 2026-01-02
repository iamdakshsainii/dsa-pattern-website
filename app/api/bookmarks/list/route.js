import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getBookmarkedQuestions } from "@/lib/db"

export async function GET() {
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

    const result = await getBookmarkedQuestions(payload.userId)

    return NextResponse.json({
      questions: result.questions || [],
      userProgress: result.userProgress || {}
    })
  } catch (error) {
    console.error("Fetch bookmarks error:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    )
  }
}
