import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId, masterId, techStackSlug } = await request.json()

    if (!masterId || !techStackSlug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (userId !== currentUser.id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const roadmap = await db.collection('roadmaps').findOne({
      slug: techStackSlug,
      techStackCategory: { $exists: true }
    })

    if (!roadmap) {
      return NextResponse.json(
        { error: "Invalid tech stack" },
        { status: 400 }
      )
    }

    const result = await db.collection('master_progress').updateOne(
      {
        userId: userId.toString(),
        masterId
      },
      {
        $set: {
          chosenTechStack: techStackSlug,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      return NextResponse.json(
        { error: "Failed to save choice" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      chosenTechStack: techStackSlug
    })

  } catch (error) {
    console.error('Tech stack selection error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const masterId = searchParams.get('masterId') || "4-year-cs-journey"

    const { db } = await connectToDatabase()

    const masterProgress = await db.collection('master_progress').findOne({
      userId: currentUser.id.toString(),
      masterId
    })

    return NextResponse.json({
      chosenTechStack: masterProgress?.chosenTechStack || null
    })

  } catch (error) {
    console.error('Get tech stack error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
