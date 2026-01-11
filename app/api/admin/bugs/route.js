import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { cookies } from "next/headers"
import { verifyToken, isSuperAdmin } from "@/lib/auth"

async function verifyAdmin() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")

    if (!token) {
      console.log("❌ No token found")
      return null
    }

    const user = await verifyToken(token.value)
    console.log("🔍 Decoded user from token:", JSON.stringify(user, null, 2))

    if (!user || !isSuperAdmin(user)) {
      console.log("❌ Not admin. User email:", user?.email)
      return null
    }

    console.log("✅ Admin verified:", user.email)
    return user
  } catch (error) {
    console.log("❌ Error in verifyAdmin:", error)
    return null
  }
}

export async function GET() {
  console.log("📥 GET /api/admin/bugs called")
  const admin = await verifyAdmin()

  if (!admin) {
    console.log("❌ Admin verification failed, returning 401")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { db } = await connectToDatabase()
    const bugs = await db.collection("bug_reports")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    const formatted = bugs.map(bug => ({
      ...bug,
      _id: bug._id.toString(),
      userId: bug.userId?.toString()
    }))

    console.log(`✅ Returning ${formatted.length} bug reports`)
    return NextResponse.json({ bugs: formatted })
  } catch (error) {
    console.log("❌ Error fetching bugs:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyToken(token.value)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, title, description, page } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("bug_reports").insertOne({
      type: type || "bug",
      title,
      description,
      page: page || "",
      userEmail: user.email,
      userId: user.id,
      status: "pending",
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString()
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 })
  }
}
