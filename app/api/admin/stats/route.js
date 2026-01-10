import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    

    const { db } = await connectToDatabase()

    const [totalUsers, totalRoadmaps, nodes, activeLearners] = await Promise.all([
      db.collection("users").countDocuments({}),
      db.collection("roadmaps").countDocuments({}),
      db.collection("roadmap_nodes").countDocuments({}),
      db.collection("roadmap_progress").distinct("userId").then(users => users.length)
    ])

    return NextResponse.json({
      totalUsers,
      totalRoadmaps,
      totalNodes: nodes,
      activeLearners
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
