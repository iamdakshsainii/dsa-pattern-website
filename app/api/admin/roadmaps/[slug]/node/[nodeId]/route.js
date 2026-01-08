import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { updateRoadmapNode, deleteRoadmapNode } from "@/lib/db"

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { nodeId } = await params
    const body = await request.json()

    const result = await updateRoadmapNode(nodeId, body)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating node:", error)
    return NextResponse.json({ error: "Failed to update node" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { nodeId } = await params

    const result = await deleteRoadmapNode(nodeId)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting node:", error)
    return NextResponse.json({ error: "Failed to delete node" }, { status: 500 })
  }
}
