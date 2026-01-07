import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { getStudentWeakTopicsByRoadmap } from "@/lib/db"

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { slug } = await params
    const weakTopics = await getStudentWeakTopicsByRoadmap(slug)

    return NextResponse.json(weakTopics)
  } catch (error) {
    console.error("Error fetching student weak topics:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
