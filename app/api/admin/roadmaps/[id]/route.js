import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

// PUT update roadmap
export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()

    await db.collection("roadmaps").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...body,
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating roadmap:", error)
    return NextResponse.json({ error: "Failed to update roadmap" }, { status: 500 })
  }
}

// DELETE roadmap
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Delete roadmap
    await db.collection("roadmaps").deleteOne({ _id: new ObjectId(params.id) })

    // Delete associated nodes
    const roadmap = await db.collection("roadmaps").findOne({ _id: new ObjectId(params.id) })
    if (roadmap) {
      await db.collection("roadmap_nodes").deleteMany({ roadmapId: roadmap.slug })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting roadmap:", error)
    return NextResponse.json({ error: "Failed to delete roadmap" }, { status: 500 })
  }
}
