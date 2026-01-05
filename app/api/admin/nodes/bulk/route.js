import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

// POST /api/admin/nodes/bulk
export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { action, nodeIds } = body

    if (!action || !nodeIds || !Array.isArray(nodeIds)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const objectIds = nodeIds.map(id => new ObjectId(id))

    let result

    switch (action) {
      case 'publish':
        result = await db.collection("roadmap_nodes").updateMany(
          { _id: { $in: objectIds } },
          {
            $set: {
              published: true,
              publishedAt: new Date(),
              lastEditedAt: new Date(),
              lastEditedBy: user.email
            }
          }
        )
        break

      case 'unpublish':
        result = await db.collection("roadmap_nodes").updateMany(
          { _id: { $in: objectIds } },
          {
            $set: {
              published: false,
              lastEditedAt: new Date(),
              lastEditedBy: user.email
            }
          }
        )
        break

      case 'delete':
        result = await db.collection("roadmap_nodes").deleteMany({
          _id: { $in: objectIds }
        })
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount || result.deletedCount || 0
    })
  } catch (error) {
    console.error("Bulk operation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
