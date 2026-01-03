import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { questionIds } = body

    if (!questionIds || !Array.isArray(questionIds)) {
      return NextResponse.json(
        { error: "questionIds array is required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("dsa_patterns")
    const questionsCollection = db.collection("questions")

    const questions = await questionsCollection
      .find({ _id: { $in: questionIds } })
      .toArray()

    return NextResponse.json({
      success: true,
      questions
    })
  } catch (error) {
    console.error("Get questions error:", error)
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    )
  }
}
