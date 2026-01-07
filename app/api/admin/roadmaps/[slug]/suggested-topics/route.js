import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { generateSuggestedTopics } from "@/lib/db"

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    const { slug } = await params
    const topics = await generateSuggestedTopics(slug)
    return NextResponse.json(topics)
  } catch (error) {
    console.error("Error generating suggested topics:", error)
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 })
  }
}
