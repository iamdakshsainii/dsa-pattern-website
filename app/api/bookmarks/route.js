import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("dsa_patterns")

    // Get bookmarks
    const bookmarks = await db
      .collection("bookmarks")
      .find({ user_id: user.id })
      .toArray()

    const bookmarkIds = bookmarks.map(b => b.question_id)

    // Get user progress for status indicators
    const allProgress = await db
      .collection("user_progress")
      .find({ user_id: user.id })
      .toArray()

    const completed = allProgress
      .filter(p => p.status === "completed")
      .map(p => p.question_id)

    const inProgress = allProgress
      .filter(p => p.status === "in_progress")
      .map(p => p.question_id)

    // Fetch full question details
    let questions = []
    if (bookmarkIds.length > 0) {
      const { ObjectId } = await import("mongodb")

      const objectIds = bookmarkIds
        .filter(id => ObjectId.isValid(id))
        .map(id => new ObjectId(id))

      if (objectIds.length > 0) {
        const foundQuestions = await db
          .collection("questions")
          .find({ _id: { $in: objectIds } })
          .toArray()

        questions = foundQuestions.map(q => ({
          ...q,
          _id: q._id.toString(),
          pattern: q.pattern_id || q.pattern,
          pattern_id: q.pattern_id
        }))
      }
    }

    return NextResponse.json({
      questions,
      bookmarkIds,
      userProgress: {
        completed,
        inProgress,
        bookmarks: bookmarkIds
      }
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
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { questionId } = body

    if (!questionId) {
      return NextResponse.json(
        { error: "questionId is required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("dsa_patterns")
    const bookmarksCollection = db.collection("bookmarks")

    const existing = await bookmarksCollection.findOne({
      user_id: user.id,
      question_id: questionId
    })

    if (existing) {
      await bookmarksCollection.deleteOne({
        user_id: user.id,
        question_id: questionId
      })

      return NextResponse.json({
        success: true,
        bookmarked: false
      })
    } else {
      await bookmarksCollection.insertOne({
        user_id: user.id,
        question_id: questionId,
        created_at: new Date()
      })

      return NextResponse.json({
        success: true,
        bookmarked: true
      })
    }
  } catch (error) {
    console.error("Update bookmark error:", error)
    return NextResponse.json(
      { error: "Failed to update bookmark", details: error.message },
      { status: 500 }
    )
  }
}
