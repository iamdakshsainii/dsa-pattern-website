import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getQuizStatusForUser } from "@/lib/db"

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { slug } = await params
    const status = await getQuizStatusForUser(user.id, slug)

    if (!status) {
      return NextResponse.json(
        { error: "Quiz status not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error("Error fetching quiz status:", error)
    return NextResponse.json(
      { error: "Failed to fetch quiz status" },
      { status: 500 }
    )
  }
}
