import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { updateRoadmap } from "@/lib/db"

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    const { slug } = await params
    const { published } = await request.json()
    await updateRoadmap(slug, { published })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Toggle publish error:", error)
    return NextResponse.json({ error: "Failed to toggle" }, { status: 500 })
  }
}
