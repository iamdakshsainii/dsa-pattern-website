import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"

// GET all bug reports
export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const bugs = await db.collection("bug_reports")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      bugs: bugs.map(b => ({...b, _id: b._id.toString()}))
    })
  } catch (error) {
    console.error("Error fetching bugs:", error)
    return NextResponse.json({ error: "Failed to fetch bugs" }, { status: 500 })
  }
}

// POST create bug report (public endpoint)
export async function POST(request) {
  try {
    const user = await getCurrentUser()
    const body = await request.json()

    const { db } = await connectToDatabase()

    const bug = {
      title: body.title,
      description: body.description,
      page: body.page || null,
      userEmail: user?.email || "anonymous",
      userId: user?.id || null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("bug_reports").insertOne(bug)

    return NextResponse.json({
      success: true,
      bugId: result.insertedId.toString()
    })
  } catch (error) {
    console.error("Error creating bug report:", error)
    return NextResponse.json({ error: "Failed to create bug report" }, { status: 500 })
  }
}
