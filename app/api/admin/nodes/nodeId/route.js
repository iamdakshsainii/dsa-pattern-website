import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

// GET /api/admin/nodes/[nodeId]
export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { nodeId } = await params
    const { db } = await connectToDatabase()

    // Try to find by ObjectId first, then by nodeId field
    let node
    try {
      node = await db.collection("roadmap_nodes").findOne({
       _id: ObjectId.createFromTime(parseInt(nodeId)) 
      })
    } catch {
      // If ObjectId conversion fails, try nodeId field
      node = await db.collection("roadmap_nodes").findOne({ nodeId })
    }

    if (!node) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 })
    }

    return NextResponse.json({
      node: {
        ...node,
        _id: node._id.toString()
      }
    })
  } catch (error) {
    console.error("Get node error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/admin/nodes/[nodeId]
export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { nodeId } = await params
    const body = await request.json()
    const { db } = await connectToDatabase()

    console.log('PUT request for nodeId:', nodeId)

    // Process subtopics with proper structure
    const subtopics = body.subtopics?.map((sub, idx) => ({
      ...sub,
      subtopicId: sub.subtopicId || `${body.roadmapId}-${Date.now()}-sub-${idx + 1}`,
      order: idx,
      resourceLinks: {
        youtube: sub.resourceLinks?.youtube || [],
        article: sub.resourceLinks?.article || [],
        practice: sub.resourceLinks?.practice || []
      }
    })) || []

    const updateData = {
      title: body.title,
      description: body.description,
      weekNumber: parseInt(body.weekNumber) || 1,
      estimatedHours: parseInt(body.estimatedHours) || 0,
      order: parseInt(body.order) || 999,
      roadmapId: body.roadmapId,
      subtopics,
      published: body.published,
      publishedAt: body.published && !body.wasPublished ? new Date() : body.publishedAt,
      lastEditedAt: new Date(),
      lastEditedBy: user.email
    }

    // Try to update by ObjectId first, then by nodeId field
    let result
    try {
      result = await db.collection("roadmap_nodes").updateOne(
        { _id: new ObjectId(nodeId) },
        { $set: updateData }
      )
    } catch {
      // If ObjectId conversion fails, try nodeId field
      result = await db.collection("roadmap_nodes").updateOne(
        { nodeId: nodeId },
        { $set: updateData }
      )
    }

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 })
    }

    console.log('Update successful:', result)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update node error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/admin/nodes/[nodeId]
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { nodeId } = await params
    const { db } = await connectToDatabase()

    // Try to delete by ObjectId first, then by nodeId field
    let result
    try {
      result = await db.collection("roadmap_nodes").deleteOne({
        _id: new ObjectId(nodeId)
      })
    } catch {
      // If ObjectId conversion fails, try nodeId field
      result = await db.collection("roadmap_nodes").deleteOne({ nodeId })
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete node error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
