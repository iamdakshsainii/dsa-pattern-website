import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

// GET - Fetch all questions
export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const questions = await db
      .collection("questions")
      .find({})
      .sort({ pattern_id: 1, order: 1 })
      .toArray()

    return NextResponse.json({
      success: true,
      questions: questions.map(q => ({
        ...q,
        _id: q._id.toString()
      }))
    })
  } catch (error) {
    console.error("Get questions error:", error)
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    )
  }
}

// POST - Create new question
export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()

    // Validate required fields
    if (!body.title || !body.pattern_id || !body.slug) {
      return NextResponse.json(
        { error: "Missing required fields: title, pattern_id, slug" },
        { status: 400 }
      )
    }

    // Check for duplicate slug
    const existing = await db.collection("questions").findOne({ slug: body.slug })
    if (existing) {
      return NextResponse.json(
        { error: "Question with this slug already exists" },
        { status: 400 }
      )
    }

    const questionData = {
      title: body.title,
      difficulty: body.difficulty || "Medium",
      pattern_id: body.pattern_id,
      slug: body.slug,
      order: body.order || 1,
      links: body.links || {},
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await db.collection("questions").insertOne(questionData)

    return NextResponse.json({
      success: true,
      questionId: result.insertedId.toString()
    })
  } catch (error) {
    console.error("Create question error:", error)
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    )
  }
}

// PUT - Update question
export async function PUT(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()

    if (!body._id) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      )
    }

    const { _id, ...updateData } = body

    const result = await db.collection("questions").updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          ...updateData,
          updated_at: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update question error:", error)
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    )
  }
}

// DELETE - Delete question
export async function DELETE(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { questionId } = await request.json()
    const { db } = await connectToDatabase()

    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      )
    }

    const result = await db.collection("questions").deleteOne({
      _id: new ObjectId(questionId)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete question error:", error)
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    )
  }
}
