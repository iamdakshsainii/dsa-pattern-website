import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { createQuizInBank } from "@/lib/db"

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
    const quizData = await request.json()

    const result = await createQuizInBank(slug, quizData)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating quiz:", error)
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    )
  }
}
