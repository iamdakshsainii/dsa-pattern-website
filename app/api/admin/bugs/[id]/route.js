import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

// PATCH update bug status
export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()

    await db.collection("bug_reports").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status: body.status,
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating bug:", error)
    return NextResponse.json({ error: "Failed to update bug" }, { status: 500 })
  }
}

// DELETE bug report
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    await db.collection("bug_reports").deleteOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bug:", error)
    return NextResponse.json({ error: "Failed to delete bug" }, { status: 500 })
  }
}
