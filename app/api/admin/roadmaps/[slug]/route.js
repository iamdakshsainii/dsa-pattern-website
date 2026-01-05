import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { updateRoadmap, deleteRoadmap } from "@/lib/db"

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { slug } = await params
    const body = await request.json()

    const result = await updateRoadmap(slug, body)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Update roadmap error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { slug } = await params

    const result = await deleteRoadmap(slug)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Delete roadmap error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
