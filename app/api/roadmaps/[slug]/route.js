import { NextResponse } from "next/server"
import { getRoadmap, getRoadmapStats } from "@/lib/db"

// GET /api/roadmaps/[slug]
export async function GET(request, { params }) {
  try {
    const { slug } = params

    const roadmap = await getRoadmap(slug)

    if (!roadmap) {
      return NextResponse.json(
        { error: "Roadmap not found" },
        { status: 404 }
      )
    }

    const stats = await getRoadmapStats(slug)
    roadmap.stats = stats

    return NextResponse.json({ roadmap })
  } catch (error) {
    console.error("Error fetching roadmap:", error)
    return NextResponse.json(
      { error: "Failed to fetch roadmap" },
      { status: 500 }
    )
  }
}
