import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { cleanOrphanedProgress } from "@/lib/db"

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

    const { roadmapId } = await request.json()

    const result = await cleanOrphanedProgress(payload.id, roadmapId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Cleanup error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to cleanup" },
      { status: 500 }
    )
  }
}
