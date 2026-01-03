import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { v2 as cloudinary } from 'cloudinary'
import clientPromise from "@/lib/mongodb"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { file, fileName } = await request.json()

    if (!file || !fileName) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Upload PDF to Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      folder: 'dsa-resumes',
      public_id: `resume_${user.id}_${Date.now()}`,
      resource_type: 'raw', // Important for PDFs
      overwrite: true
    })

    // Save to database
    const client = await clientPromise
    const db = client.db("dsa_patterns")

    // Delete old resume if exists
    await db.collection("user_resumes").deleteMany({ userId: user.id })

    // Insert new resume
    await db.collection("user_resumes").insertOne({
      userId: user.id,
      fileName: fileName,
      fileUrl: result.secure_url,
      fileSize: result.bytes,
      uploadedAt: new Date(),
      downloadCount: 0
    })

    // Update profile with resume URL
    await db.collection("user_profiles").updateOne(
      { userId: user.id },
      {
        $set: {
          resumeUrl: result.secure_url,
          resumeFileName: fileName,
          resumeUploadedAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      resumeUrl: result.secure_url,
      fileName: fileName
    })
  } catch (error) {
    console.error("Resume upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    )
  }
}

// GET - Download/View resume
export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("dsa_patterns")

    const resume = await db.collection("user_resumes").findOne({ userId: user.id })

    if (!resume) {
      return NextResponse.json({ error: "No resume found" }, { status: 404 })
    }

    // Increment download count
    await db.collection("user_resumes").updateOne(
      { userId: user.id },
      {
        $inc: { downloadCount: 1 },
        $set: { lastDownloadedAt: new Date() }
      }
    )

    return NextResponse.json({
      success: true,
      resume: {
        fileName: resume.fileName,
        fileUrl: resume.fileUrl,
        uploadedAt: resume.uploadedAt,
        downloadCount: resume.downloadCount + 1
      }
    })
  } catch (error) {
    console.error("Resume fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    )
  }
}

// DELETE - Remove resume
export async function DELETE(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("dsa_patterns")

    // Delete from database
    await db.collection("user_resumes").deleteMany({ userId: user.id })

    // Remove from profile
    await db.collection("user_profiles").updateOne(
      { userId: user.id },
      {
        $unset: {
          resumeUrl: "",
          resumeFileName: "",
          resumeUploadedAt: ""
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: "Resume deleted successfully"
    })
  } catch (error) {
    console.error("Resume delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    )
  }
}
