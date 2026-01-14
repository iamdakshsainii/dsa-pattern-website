import { NextResponse } from "next/server"
import { saveTechStackChoice } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { masterId, techStackSlug } = body

    if (!masterId || !techStackSlug) {
      return NextResponse.json(
        { error: "masterId and techStackSlug are required" },
        { status: 400 }
      )
    }

    const result = await saveTechStackChoice(currentUser.id, masterId, techStackSlug)

    return NextResponse.json({
      success: result.success,
      message: result.success ? "Tech stack saved" : "Failed to save tech stack"
    })
  } catch (error) {
    console.error("Error saving tech stack:", error)
    return NextResponse.json(
      { error: "Failed to save tech stack choice" },
      { status: 500 }
    )
  }
}
