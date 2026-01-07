import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { db } = await connectToDatabase()

    const [
      totalUsers,
      totalRoadmaps,
      totalNodes,
      activeUsers
    ] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('roadmaps').countDocuments({ published: true }),
      db.collection('roadmap_nodes').countDocuments({ published: true }),
      db.collection('user_progress').distinct('user_id').then(ids => ids.length)
    ])

    return NextResponse.json({
      totalUsers,
      totalRoadmaps,
      totalNodes,
      activeUsers
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
