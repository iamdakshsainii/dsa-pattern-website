import { NextResponse } from "next/server"
import { getYearTestQuestions, submitYearTest, getUserTestAttempts } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const masterId = searchParams.get('masterId')
    const yearNumber = parseInt(searchParams.get('yearNumber'))
    const action = searchParams.get('action')

    if (!masterId || !yearNumber) {
      return NextResponse.json(
        { error: "masterId and yearNumber are required" },
        { status: 400 }
      )
    }

    if (action === 'attempts') {
      const attempts = await getUserTestAttempts(currentUser.id, masterId, yearNumber)
      return NextResponse.json({ attempts })
    }

    const questions = await getYearTestQuestions(masterId, yearNumber, 10)

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "No test questions available for this year" },
        { status: 404 }
      )
    }

    const questionsWithoutAnswers = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      topic: q.topic
    }))

    return NextResponse.json({ questions: questionsWithoutAnswers })
  } catch (error) {
    console.error("Error fetching test questions:", error)
    return NextResponse.json(
      { error: "Failed to fetch test questions" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { masterId, yearNumber, answers } = body

    if (!masterId || !yearNumber || !answers) {
      return NextResponse.json(
        { error: "masterId, yearNumber, and answers are required" },
        { status: 400 }
      )
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "answers must be a non-empty array" },
        { status: 400 }
      )
    }

    const result = await submitYearTest(currentUser.id, masterId, yearNumber, answers)

    return NextResponse.json({
      success: true,
      result
    })
  } catch (error) {
    console.error("Error submitting test:", error)
    return NextResponse.json(
      { error: "Failed to submit test" },
      { status: 500 }
    )
  }
}
