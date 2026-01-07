import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase, updateRoadmapSetupStatus } from "@/lib/db"

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser()

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { slug } = await params
    const { topicResources } = await request.json()

    const { db } = await connectToDatabase()

    await db.collection('custom_quizzes').updateOne(
      { roadmapId: slug },
      {
        $set: {
          'settings.topicResources': topicResources,
          updatedAt: new Date()
        },
        $setOnInsert: {
          roadmapId: slug,
          mode: 'custom',
          questions: [],
          createdAt: new Date()
        }
      },
      { upsert: true }
    )

    await updateRoadmapSetupStatus(slug, 'weakTopicResourcesStatus', 'ready')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving weak topics:", error)
    return NextResponse.json(
      { error: "Failed to save" },
      { status: 500 }
    )
  }
}
