import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { updateRoadmapSetupStatus } from "@/lib/db"

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser()

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { slug } = await params
    const { field, status } = await request.json()

    await updateRoadmapSetupStatus(slug, field, status)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating status:", error)
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    )
  }
}
