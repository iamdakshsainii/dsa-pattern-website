import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const questions = await db
      .collection("questions")
      .find({})
      .toArray()

    const serialized = questions.map(q => ({
      ...q,
      _id: q._id.toString()
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Error fetching all questions:", error)
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    )
  }
}
