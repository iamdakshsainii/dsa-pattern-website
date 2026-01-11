import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"
import { cookies } from "next/headers"
import { verifyToken, isSuperAdmin } from "@/lib/auth"

async function verifyAdmin() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")

    if (!token) return null

    const user = await verifyToken(token.value)
    if (!user || !isSuperAdmin(user)) return null

    return user
  } catch {
    return null
  }
}

export async function PATCH(request, { params }) {
  const admin = await verifyAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { bugId } = await params
    const { status } = await request.json()
    const { db } = await connectToDatabase()

    const result = await db.collection("bug_reports").updateOne(
      { _id: new ObjectId(bugId) },
      {
        $set: {
          status,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const admin = await verifyAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { bugId } = await params
    const { reply } = await request.json()
    const { db } = await connectToDatabase()

    const replyData = {
      adminEmail: admin.email,
      adminName: admin.name,
      message: reply,
      repliedAt: new Date()
    }

    const result = await db.collection("bug_reports").updateOne(
      { _id: new ObjectId(bugId) },
      {
        $push: { replies: replyData },
        $set: {
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const admin = await verifyAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { bugId } = await params
    const { db } = await connectToDatabase()

    const result = await db.collection("bug_reports").deleteOne({
      _id: new ObjectId(bugId)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
