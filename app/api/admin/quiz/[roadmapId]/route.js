import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { getQuizConfig, saveCustomQuiz, setQuizMode } from "@/lib/db"

export async function GET(request, { params }) {
  try {
    const { roadmapId } = await params

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

    const config = await getQuizConfig(roadmapId)

    return NextResponse.json({
      success: true,
      config
    })

  } catch (error) {
    console.error("Error fetching quiz config:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { roadmapId } = await params

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

    const body = await request.json()

    // If only mode is being changed
    if (body.mode && !body.settings && !body.questions) {
      const result = await setQuizMode(roadmapId, body.mode)
      return NextResponse.json(result)
    }

    // Otherwise save full config
    const result = await saveCustomQuiz(roadmapId, body)

    return NextResponse.json(result)

  } catch (error) {
    console.error("Error updating quiz config:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
