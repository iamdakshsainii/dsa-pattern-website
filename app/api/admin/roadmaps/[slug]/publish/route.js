import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { connectToDatabase } from "@/lib/db"

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
    const { db } = await connectToDatabase()

    await db.collection('roadmaps').updateOne(
      { slug },
      {
        $set: {
          published: true,
          quizBankStatus: 'ready',
          publishedAt: new Date(),
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error publishing roadmap:", error)
    return NextResponse.json(
      { error: "Failed to publish" },
      { status: 500 }
    )
  }
}
