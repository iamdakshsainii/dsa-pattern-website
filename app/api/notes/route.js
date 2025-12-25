import { NextResponse } from "next/server"
import { saveUserNote, getUserNotes } from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const questionId = searchParams.get("questionId")

    if (!userId || !questionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const note = await getUserNotes(userId, questionId)

    return NextResponse.json({ note: note?.content || "" })
  } catch (error) {
    console.error("Get note error:", error)
    return NextResponse.json({ error: "Failed to get note" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { userId, questionId, content } = await request.json()

    if (!userId || !questionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await saveUserNote(userId, questionId, content)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Save note error:", error)
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 })
  }
}
