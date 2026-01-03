import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { uploadAvatar } from "@/lib/cloudinary"
import { updateAvatar } from "@/lib/db"

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Upload to Cloudinary
    const result = await uploadAvatar(image, user.id)

    // Save URL to database
    await updateAvatar(user.id, result.url)

    return NextResponse.json({
      success: true,
      avatarUrl: result.url
    })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 }
    )
  }
}
