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
    const roadmaps = await db.collection("roadmaps")
      .find({})
      .sort({ order: 1 })
      .toArray()

    return NextResponse.json({
      roadmaps: roadmaps.map(r => ({...r, _id: r._id.toString()}))
    })
  } catch (error) {
    console.error("Error fetching roadmaps:", error)
    return NextResponse.json({ error: "Failed to fetch roadmaps" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { db } = await connectToDatabase()

    const existing = await db.collection("roadmaps").findOne({ slug: body.slug })
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    const roadmap = {
      ...body,
      stats: { totalNodes: 0, totalResources: 0, followers: 0, avgRating: 0 },
      published: body.published !== undefined ? body.published : false,
      order: body.order || 999,
      quizBankStatus: body.quizBankStatus || 'incomplete',
      weakTopicResourcesStatus: body.weakTopicResourcesStatus || 'incomplete',
      quizBankIds: body.quizBankIds || [],
      quizAttemptLimit: body.quizAttemptLimit || 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("roadmaps").insertOne(roadmap)

    return NextResponse.json({
      success: true,
      roadmapId: result.insertedId.toString(),
      slug: body.slug
    })
  } catch (error) {
    console.error("Error creating roadmap:", error)
    return NextResponse.json({ error: "Failed to create roadmap" }, { status: 500 })
  }
}
