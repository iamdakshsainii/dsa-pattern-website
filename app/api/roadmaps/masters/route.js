import { NextResponse } from "next/server"
import { getMasterRoadmaps } from "@/lib/db"

export async function GET(request) {
  try {
    const masterRoadmaps = await getMasterRoadmaps()

    return NextResponse.json({
      masterRoadmaps,
      count: masterRoadmaps.length
    })
  } catch (error) {
    console.error("Error fetching master roadmaps:", error)
    return NextResponse.json(
      { error: "Failed to fetch master roadmaps" },
      { status: 500 }
    )
  }
}
