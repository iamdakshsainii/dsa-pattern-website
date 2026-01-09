import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

// GET - Fetch all patterns with question counts
export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get all patterns
    const patterns = await db
      .collection("patterns")
      .find({})
      .sort({ name: 1 })
      .toArray()

    // Get question count for each pattern
    const patternsWithCounts = await Promise.all(
      patterns.map(async (pattern) => {
        const questionCount = await db
          .collection("questions")
          .countDocuments({ pattern_id: pattern.slug })

        return {
          ...pattern,
          _id: pattern._id.toString(),
          questionCount
        }
      })
    )

    return NextResponse.json({
      success: true,
      patterns: patternsWithCounts
    })
  } catch (error) {
    console.error("Get patterns error:", error)
    return NextResponse.json(
      { error: "Failed to fetch patterns" },
      { status: 500 }
    )
  }
}

// POST - Create new pattern
export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()

    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug" },
        { status: 400 }
      )
    }

    // Check for duplicate slug
    const existing = await db.collection("patterns").findOne({ slug: body.slug })
    if (existing) {
      return NextResponse.json(
        { error: "Pattern with this slug already exists" },
        { status: 400 }
      )
    }

    const patternData = {
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      difficulty: body.difficulty || '',
      icon: body.icon || '',
      color: body.color || '#3B82F6',
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await db.collection("patterns").insertOne(patternData)

    return NextResponse.json({
      success: true,
      patternId: result.insertedId.toString()
    })
  } catch (error) {
    console.error("Create pattern error:", error)
    return NextResponse.json(
      { error: "Failed to create pattern" },
      { status: 500 }
    )
  }
}

// PUT - Update pattern
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
        { error: "Pattern ID is required" },
        { status: 400 }
      )
    }

    const { _id, ...updateData } = body

    const result = await db.collection("patterns").updateOne(
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
        { error: "Pattern not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update pattern error:", error)
    return NextResponse.json(
      { error: "Failed to update pattern" },
      { status: 500 }
    )
  }
}

// DELETE - Delete pattern
export async function DELETE(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { patternId } = await request.json()
    const { db } = await connectToDatabase()

    if (!patternId) {
      return NextResponse.json(
        { error: "Pattern ID is required" },
        { status: 400 }
      )
    }

    // Check if pattern has questions
    const pattern = await db.collection("patterns").findOne({ _id: new ObjectId(patternId) })
    if (!pattern) {
      return NextResponse.json(
        { error: "Pattern not found" },
        { status: 404 }
      )
    }

    const questionCount = await db
      .collection("questions")
      .countDocuments({ pattern_id: pattern.slug })

    if (questionCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete pattern with ${questionCount} questions. Delete questions first.` },
        { status: 400 }
      )
    }

    const result = await db.collection("patterns").deleteOne({
      _id: new ObjectId(patternId)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Pattern not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete pattern error:", error)
    return NextResponse.json(
      { error: "Failed to delete pattern" },
      { status: 500 }
    )
  }
}
