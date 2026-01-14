import { NextResponse } from "next/server"
import { getUserMasterProgress, initializeMasterProgress, updateMasterProgress } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const masterId = searchParams.get('masterId')

    if (!masterId) {
      return NextResponse.json(
        { error: "masterId is required" },
        { status: 400 }
      )
    }

    const progress = await getUserMasterProgress(currentUser.id, masterId)

    return NextResponse.json({ progress })
  } catch (error) {
    console.error("Error fetching master progress:", error)
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { masterId, academicInfo, action } = body

    if (!masterId) {
      return NextResponse.json(
        { error: "masterId is required" },
        { status: 400 }
      )
    }

    if (action === 'initialize') {
      const existing = await getUserMasterProgress(currentUser.id, masterId)

      if (existing) {
        return NextResponse.json({
          success: true,
          progress: existing,
          message: "Progress already exists"
        })
      }

      const progress = await initializeMasterProgress(currentUser.id, masterId, academicInfo)

      return NextResponse.json({
        success: true,
        progress
      })
    }

    if (action === 'update') {
      await updateMasterProgress(currentUser.id, masterId)
      const updatedProgress = await getUserMasterProgress(currentUser.id, masterId)

      return NextResponse.json({
        success: true,
        progress: updatedProgress
      })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error updating master progress:", error)
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    )
  }
}
