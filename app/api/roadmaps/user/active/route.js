import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getUserActiveRoadmaps } from "@/lib/db"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")

    if (!authToken) {
      return NextResponse.json({ roadmaps: [] })
    }

    const payload = verifyToken(authToken.value)
    if (!payload) {
      return NextResponse.json({ roadmaps: [] })
    }

    const roadmaps = await getUserActiveRoadmaps(payload.id)
    return NextResponse.json({ roadmaps })
  } catch (error) {
    return NextResponse.json({ roadmaps: [] })
  }
}
