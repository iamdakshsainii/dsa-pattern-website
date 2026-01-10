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

    const { searchParams } = new URL(request.url)
    const pattern = searchParams.get("pattern")
    const difficulty = searchParams.get("difficulty")
    const search = searchParams.get("search")

    const { db } = await connectToDatabase()

    let query = {}
    if (pattern && pattern !== "all") query.pattern_id = pattern
    if (difficulty && difficulty !== "all") query.difficulty = difficulty
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } }
      ]
    }

    const questions = await db.collection("questions")
      .find(query)
      .sort({ pattern_id: 1, order: 1 })
      .toArray()

    return NextResponse.json({
      questions: questions.map(q => ({
        ...q,
        _id: q._id.toString()
      }))
    })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
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
    if (!body.title || !body.difficulty || !body.pattern_id) {
      return NextResponse.json({
        error: "Missing required fields: title, difficulty, pattern_id"
      }, { status: 400 })
    }

    // Auto-generate slug if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    // Check for duplicate slug
    const existing = await db.collection("questions").findOne({
      slug: body.slug,
      pattern_id: body.pattern_id
    })

    if (existing) {
      return NextResponse.json({
        error: "A question with this slug already exists in this pattern"
      }, { status: 400 })
    }

    // Prepare question document with ALL fields
    const questionDoc = {
      // Basic fields
      title: body.title,
      difficulty: body.difficulty,
      pattern_id: body.pattern_id,
      slug: body.slug,
      order: body.order || 999,

      // Metadata
      tags: body.tags || [],
      companies: body.companies || [],

      // Links (backward compatibility)
      links: body.links || {},

      // Full solution data (new fields)
      approaches: body.approaches || [],
      resources: body.resources || null,
      complexity: body.complexity || null,
      patternTriggers: body.patternTriggers || null,
      hints: body.hints || [],
      commonMistakes: body.commonMistakes || [],
      followUp: body.followUp || [],
      relatedProblems: body.relatedProblems || [],

      // Audit
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("questions").insertOne(questionDoc)

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      question: {
        ...questionDoc,
        _id: result.insertedId.toString()
      }
    })
  } catch (error) {
    console.error("Error creating question:", error)
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 })
  }
}

// PUT - Update existing question
export async function PUT(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { _id, ...updateData } = body

    if (!_id) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Prepare update document
    const updateDoc = {
      title: updateData.title,
      difficulty: updateData.difficulty,
      pattern_id: updateData.pattern_id,
      slug: updateData.slug,
      order: updateData.order,

      // Metadata
      tags: updateData.tags || [],
      companies: updateData.companies || [],

      // Links
      links: updateData.links || {},

      // Full solution data
      approaches: updateData.approaches || [],
      resources: updateData.resources || null,
      complexity: updateData.complexity || null,
      patternTriggers: updateData.patternTriggers || null,
      hints: updateData.hints || [],
      commonMistakes: updateData.commonMistakes || [],
      followUp: updateData.followUp || [],
      relatedProblems: updateData.relatedProblems || [],

      // Update timestamp
      updatedAt: new Date()
    }

    const result = await db.collection("questions").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateDoc }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      modified: result.modifiedCount
    })
  } catch (error) {
    console.error("Error updating question:", error)
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 })
  }
}

// DELETE - Delete question
export async function DELETE(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("questions").deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 })
  }
}
