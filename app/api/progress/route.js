import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("dsa_patterns")
    const progressCollection = db.collection("progress")

    const userProgress = await progressCollection
      .find({ userId: user.id })
      .toArray()

    const completed = userProgress
      .filter(p => p.completed)
      .map(p => p.questionId || p.problemId)

    return NextResponse.json({
      success: true,
      progress: userProgress,
      completed
    })
  } catch (error) {
    console.error("Get progress error:", error)
    return NextResponse.json(
      { error: "Failed to fetch progress", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  console.log("POST /api/progress called")

  try {
    const user = await getCurrentUser()
    console.log("User:", user)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Request body:", body)

    const { questionId, status, difficulty, pattern, problemName } = body

    if (!questionId) {
      return NextResponse.json(
        { error: "questionId is required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("dsa_patterns")
    const progressCollection = db.collection("progress")
    const questionsCollection = db.collection("questions")

    // Try multiple methods to find the question
    let questionData = null

    // Method 1: Try as ObjectId
    if (ObjectId.isValid(questionId)) {
      try {
        questionData = await questionsCollection.findOne({
          _id: new ObjectId(questionId)
        })
        console.log("Found question by ObjectId:", questionData?._id)
      } catch (err) {
        console.log("ObjectId search failed:", err.message)
      }
    }

    // Method 2: Try as string _id
    if (!questionData) {
      try {
        questionData = await questionsCollection.findOne({
          _id: questionId
        })
        console.log("Found question by string _id:", questionData?._id)
      } catch (err) {
        console.log("String _id search failed:", err.message)
      }
    }

    // Method 3: Try by id field (if it exists)
    if (!questionData) {
      try {
        questionData = await questionsCollection.findOne({
          id: questionId
        })
        console.log("Found question by id field:", questionData?._id)
      } catch (err) {
        console.log("id field search failed:", err.message)
      }
    }

    console.log("Question data found:", questionData ? {
      _id: questionData._id,
      title: questionData.title,
      difficulty: questionData.difficulty,
      pattern: questionData.pattern
    } : "null")

    // Use provided data OR fallback to DB data OR defaults
    const finalDifficulty = difficulty || questionData?.difficulty || "Medium"
    const finalPattern = pattern || questionData?.pattern || "unknown"
    const finalProblemName = problemName || questionData?.title || `Question ${questionId.slice(-8)}`

    const completed = status === "completed"

    const updateData = {
      userId: user.id,
      questionId,
      problemId: questionId,
      completed,
      difficulty: finalDifficulty,
      pattern: finalPattern,
      problemName: finalProblemName,
      lastAttemptDate: new Date(),
      updatedAt: new Date()
    }

    if (completed) {
      updateData.completedDate = new Date()
    } else {
      updateData.completedDate = null
    }

    const result = await progressCollection.findOneAndUpdate(
      { userId: user.id, questionId },
      {
        $set: updateData,
        $inc: { attempts: 1 },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true, returnDocument: 'after' }
    )

    console.log("Progress updated successfully:", {
      questionId,
      pattern: finalPattern,
      difficulty: finalDifficulty,
      problemName: finalProblemName,
      questionFound: !!questionData
    })

    return NextResponse.json({
      success: true,
      progress: result
    })
  } catch (error) {
    console.error("Update progress error:", error)
    return NextResponse.json(
      { error: "Failed to update progress", details: error.message },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
