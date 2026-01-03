import { NextResponse } from "next/server"
import { getQuestionsByPattern } from "@/lib/db"

export async function GET(request, { params }) {
  try {
    const { slug } = await params
    const questions = await getQuestionsByPattern(slug)

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}
