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

    const totalUsers = await db.collection("users").countDocuments()
    const totalRoadmaps = await db.collection("roadmaps").countDocuments()
    const totalNodes = await db.collection("roadmap_nodes").countDocuments()
    const activeLearners = await db.collection("roadmap_progress").countDocuments()

    const popularRoadmaps = await db.collection("roadmaps")
      .find({})
      .sort({ "stats.followers": -1 })
      .limit(5)
      .toArray()

    return NextResponse.json({
      stats: {
        totalUsers,
        totalRoadmaps,
        totalNodes,
        activeLearners,
        popularRoadmaps: popularRoadmaps.map(r => ({
          title: r.title,
          icon: r.icon,
          category: r.category,
          followers: r.stats?.followers || 0
        }))
      }
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
