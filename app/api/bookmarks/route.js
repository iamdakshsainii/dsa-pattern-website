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
    const questionsCollection = db.collection("questions")

    // Get all bookmarked items from progress
    const bookmarks = await progressCollection
      .find({ userId: user.id, bookmarked: true })
      .toArray()

    const bookmarkIds = bookmarks.map(b => b.questionId || b.problemId)

    // Fetch full question details for bookmarked questions
    const questions = []
    if (bookmarkIds.length > 0) {
      // Convert string IDs to ObjectIds where valid
      const objectIds = bookmarkIds
        .filter(id => ObjectId.isValid(id))
        .map(id => new ObjectId(id))

      if (objectIds.length > 0) {
        const foundQuestions = await questionsCollection
          .find({ _id: { $in: objectIds } })
          .toArray()

        // Serialize questions
        foundQuestions.forEach(q => {
          questions.push({
            ...q,
            _id: q._id.toString(),
            pattern: q.pattern_id || q.pattern,
            pattern_id: q.pattern_id
          })
        })
      }
    }

    return NextResponse.json({
      success: true,
      bookmarks,
      bookmarkIds,
      questions
    })
  } catch (error) {
    console.error("Get bookmarks error:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookmarks", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  console.log("POST /api/bookmarks called")

  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Bookmark request body:", body)

    const { questionId, difficulty, pattern, problemName } = body

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

    // Try to get question from DB
    let questionData = null
    try {
      if (ObjectId.isValid(questionId)) {
        questionData = await questionsCollection.findOne({
          _id: new ObjectId(questionId)
        })
      }
    } catch (err) {
      console.log("Question not found in DB")
    }

    // Get existing progress
    const existing = await progressCollection.findOne({
      userId: user.id,
      questionId
    })

    // Toggle bookmark status
    const newBookmarked = !(existing?.bookmarked || false)

    // Update progress with bookmark status
    await progressCollection.findOneAndUpdate(
      { userId: user.id, questionId },
      {
        $set: {
          bookmarked: newBookmarked,
          questionId,
          problemId: questionId,
          problemName: problemName || questionData?.title || questionId,
          pattern: pattern || questionData?.pattern_id || questionData?.pattern || "unknown",
          difficulty: difficulty || questionData?.difficulty || "Medium",
          updatedAt: new Date()
        },
        $setOnInsert: {
          userId: user.id,
          completed: false,
          attempts: 0,
          createdAt: new Date()
        }
      },
      { upsert: true }
    )

    console.log("Bookmark updated:", { questionId, bookmarked: newBookmarked })

    return NextResponse.json({
      success: true,
      bookmarked: newBookmarked
    })
  } catch (error) {
    console.error("Update bookmark error:", error)
    return NextResponse.json(
      { error: "Failed to update bookmark", details: error.message },
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
