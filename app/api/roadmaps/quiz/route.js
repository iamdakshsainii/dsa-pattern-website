import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getUser, getQuizConfig, saveQuizResult } from "@/lib/db"
import { getQuizQuestions } from "@/lib/roadmaps/quiz-questions"

// GET - Fetch quiz questions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const roadmapId = searchParams.get('roadmapId')

    if (!roadmapId) {
      return NextResponse.json(
        { error: "roadmapId required" },
        { status: 400 }
      )
    }

    // Get quiz configuration
    const config = await getQuizConfig(roadmapId)

    let questions = []

    if (config.mode === 'none') {
      return NextResponse.json(
        { error: "No quiz available for this roadmap" },
        { status: 404 }
      )
    }

    if (config.mode === 'custom' && config.questions && config.questions.length > 0) {
      // Use custom questions
      questions = config.questions

      // Apply shuffling if enabled
      if (config.settings?.shuffleQuestions) {
        questions = shuffleArray([...questions])
      }

      // Shuffle options if enabled
      if (config.settings?.shuffleOptions) {
        questions = questions.map(q => ({
          ...q,
          options: shuffleArray([...q.options])
        }))
      }
    } else {
      // Fall back to auto-generated questions
      questions = getQuizQuestions(roadmapId, 10)

      if (!questions || questions.length === 0) {
        return NextResponse.json(
          { error: "No questions available for this roadmap" },
          { status: 404 }
        )
      }
    }

    // Remove correct answers from response (client shouldn't see them)
    const questionsForClient = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      topic: q.topic,
      imageUrl: q.imageUrl,
      codeSnippet: q.codeSnippet,
      type: q.type || 'single'
    }))

    return NextResponse.json({
      questions: questionsForClient,
      settings: config.settings
    })

  } catch (error) {
    console.error("Error fetching quiz:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Submit quiz results
export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token") || cookieStore.get("authToken")

    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const payload = verifyToken(authToken.value)
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }

    const currentUser = await getUser(payload.email)
    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const { roadmapId, answers, score, timeTaken } = await request.json()

    if (!roadmapId || !answers) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Save quiz result
    const result = await saveQuizResult(
      currentUser._id.toString(),
      roadmapId,
      score,
      answers,
      timeTaken
    )

    return NextResponse.json(result)

  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Helper function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
