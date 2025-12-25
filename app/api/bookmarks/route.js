import { NextResponse } from "next/server"
import { toggleBookmark } from "@/lib/db"

export async function POST(request) {
  try {
    const { userId, questionId } = await request.json()

    if (!userId || !questionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await toggleBookmark(userId, questionId)

    return NextResponse.json({ success: true, bookmarked: result.bookmarked })
  } catch (error) {
    console.error("Bookmark error:", error)
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 })
  }
}
