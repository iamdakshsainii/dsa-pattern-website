import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { db } = await connectToDatabase()

    const pattern = await db.collection("patterns").findOne({
      _id: new ObjectId(id)
    })

    if (!pattern) {
      return NextResponse.json({ error: "Pattern not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      pattern: {
        ...pattern,
        _id: pattern._id.toString()
      }
    })
  } catch (error) {
    console.error("Get pattern error:", error)
    return NextResponse.json(
      { error: "Failed to fetch pattern" },
      { status: 500 }
    )
  }
}
