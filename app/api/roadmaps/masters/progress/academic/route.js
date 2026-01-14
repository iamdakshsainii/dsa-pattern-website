import { NextResponse } from "next/server"
import { updateAcademicInfo } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

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
    const { masterId, academicInfo } = body

    if (!masterId || !academicInfo) {
      return NextResponse.json(
        { error: "masterId and academicInfo are required" },
        { status: 400 }
      )
    }

    const result = await updateAcademicInfo(currentUser.id, masterId, academicInfo)

    return NextResponse.json({
      success: result.success,
      message: result.success ? "Academic info updated" : "Failed to update academic info"
    })
  } catch (error) {
    console.error("Error updating academic info:", error)
    return NextResponse.json(
      { error: "Failed to update academic info" },
      { status: 500 }
    )
  }
}
