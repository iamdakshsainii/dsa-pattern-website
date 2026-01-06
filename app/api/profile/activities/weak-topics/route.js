import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getUserWeakTopics } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const weakTopics = await getUserWeakTopics(user.id)

    return NextResponse.json(weakTopics || [])
  } catch (error) {
    console.error("Error fetching weak topics:", error)
    return NextResponse.json({ error: "Failed to fetch weak topics" }, { status: 500 })
  }
}
