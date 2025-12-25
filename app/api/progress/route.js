import { NextResponse } from "next/server"
import { updateUserProgress } from "@/lib/db"

export async function POST(request) {
  try {
    const { userId, questionId, status } = await request.json()

    if (!userId || !questionId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await updateUserProgress(userId, questionId, { status })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Progress update error:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}
