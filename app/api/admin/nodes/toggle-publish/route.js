import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { nodeId, published } = body

    const { db } = await connectToDatabase()

    const result = await db.collection("roadmap_nodes").updateOne(
      { nodeId },
      {
        $set: {
          published,
          publishedAt: published ? new Date() : null,
          lastEditedAt: new Date(),
          lastEditedBy: user.email
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Toggle publish error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
