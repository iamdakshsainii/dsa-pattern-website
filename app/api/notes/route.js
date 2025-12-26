// app/api/notes/route.js
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getUserNotes, saveUserNote } from "@/lib/db"

// GET - Fetch user's notes for a question
export async function GET(request) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(authToken.value)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get("questionId")

    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      )
    }

    // Use payload.id instead of payload.userId
    const note = await getUserNotes(payload.id, questionId)

    return NextResponse.json({
      success: true,
      note: note?.content || ""
    })
  } catch (error) {
    console.error("Fetch note error:", error)
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    )
  }
}

// POST - Save user's notes for a question
export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(authToken.value)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { questionId, content } = await request.json()

    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      )
    }

    // Use payload.id instead of payload.userId
    await saveUserNote(payload.id, questionId, content || "")

    return NextResponse.json({
      success: true,
      message: "Note saved successfully"
    })
  } catch (error) {
    console.error("Save note error:", error)
    return NextResponse.json(
      { error: "Failed to save note" },
      { status: 500 }
    )
  }
}
