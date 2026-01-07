import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"

// GET /api/admin/nodes?roadmapId=xxx
export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const roadmapId = searchParams.get('roadmapId')

    const { db } = await connectToDatabase()

   const query = roadmapId ? { roadmapId } : {}
const nodes = await db.collection("roadmap_nodes")
  .find(query)
  .sort({ weekNumber: 1, order: 1 })  
  .toArray()

    return NextResponse.json({
      nodes: nodes.map(n => ({
        ...n,
        _id: n._id.toString()
      }))
    })
  } catch (error) {
    console.error("Get nodes error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/admin/nodes
export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()

    // Generate nodeId from title (slug)
    const nodeId = body.nodeId || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Generate subtopicIds
    const subtopics = body.subtopics?.map((sub, idx) => ({
      ...sub,
      subtopicId: sub.subtopicId || `${nodeId}-sub-${idx + 1}`,
      order: idx,
      resourceLinks: {
        youtube: sub.resourceLinks?.youtube || [],
        article: sub.resourceLinks?.article || [],
        practice: sub.resourceLinks?.practice || []
      }
    })) || []

    const nodeData = {
      nodeId,
      roadmapId: body.roadmapId,
      title: body.title,
      description: body.description,
      weekNumber: parseInt(body.weekNumber) || 1,
      estimatedHours: parseInt(body.estimatedHours) || 0,
      order: parseInt(body.order) || 999,
      subtopics,
      published: body.published !== undefined ? body.published : false,
      publishedAt: body.published ? new Date() : null,
      lastEditedAt: new Date(),
      lastEditedBy: user.email,
      createdAt: new Date(),
      createdBy: user.email,
      completionRate: 0,
      averageTimeSpent: 0
    }

    const result = await db.collection("roadmap_nodes").insertOne(nodeData)

    return NextResponse.json({
      success: true,
      nodeId: result.insertedId.toString(),
      node: nodeData
    })
  } catch (error) {
    console.error("Create node error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
