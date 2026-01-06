import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import {
  getUser,
  getQuizResult,
  generateCertificateRecord,
  getRoadmap,
  getUserCertificates
} from "@/lib/db"

// GET: Fetch certificate data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const roadmapId = searchParams.get('roadmapId')
    const userId = searchParams.get('userId') // For certificates list

    // Handle certificate list request
    if (userId && !roadmapId) {
      const certificates = await getUserCertificates(userId)
      return NextResponse.json({ certificates })
    }

    if (!roadmapId) {
      return NextResponse.json(
        { error: "roadmapId is required" },
        { status: 400 }
      )
    }

    // Get current user
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token") || cookieStore.get("auth-token") || cookieStore.get("authToken")

    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const payload = verifyToken(authToken.value)
    if (!payload || !payload.email) {
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

    // Check if quiz passed
    const quizResult = await getQuizResult(currentUser._id.toString(), roadmapId)

    if (!quizResult || !quizResult.passed) {
      return NextResponse.json(
        {
          error: "Certificate not available",
          message: "Pass the quiz with 70% or higher to earn certificate"
        },
        { status: 403 }
      )
    }

    // Get roadmap details
    const roadmap = await getRoadmap(roadmapId)

    // Generate certificate ID
    const certificateId = `CERT-${roadmapId.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    return NextResponse.json({
      userName: currentUser.name,
      roadmapTitle: roadmap.title,
      roadmapIcon: roadmap.icon,
      roadmapId: roadmapId,
      quizScore: `${quizResult.score}/${quizResult.totalQuestions} (${quizResult.percentage}%)`,
      certificateId,
      issuedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error("Error in certificate GET:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST: Generate and save certificate
export async function POST(request) {
  try {
    const body = await request.json()
    const { roadmapId } = body

    if (!roadmapId) {
      return NextResponse.json(
        { error: "roadmapId is required" },
        { status: 400 }
      )
    }

    // Get current user
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")

    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const payload = verifyToken(authToken.value)
    if (!payload || !payload.email) {
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

    // Verify quiz passed
    const quizResult = await getQuizResult(currentUser._id.toString(), roadmapId)

    if (!quizResult || !quizResult.passed) {
      return NextResponse.json(
        { error: "Quiz not passed" },
        { status: 403 }
      )
    }

    // Generate certificate record
    const certificate = await generateCertificateRecord(
      currentUser._id.toString(),
      roadmapId,
      quizResult.score
    )

    return NextResponse.json({
      success: true,
      certificateId: certificate.certificateId
    })

  } catch (error) {
    console.error("Error in certificate POST:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
