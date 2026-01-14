import { NextResponse } from "next/server"
import { getRoadmaps, searchRoadmaps, getMasterRoadmaps } from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')

    let roadmaps

    if (search) {
      roadmaps = await searchRoadmaps(search)
    } else {
      const filters = {}
      if (category) filters.category = category
      if (difficulty) filters.difficulty = difficulty

      roadmaps = await getRoadmaps(filters)
    }

    const masterRoadmaps = await getMasterRoadmaps()

    return NextResponse.json({
      masterRoadmaps,
      roadmaps,
      count: roadmaps.length + masterRoadmaps.length
    })
  } catch (error) {
    console.error("Error fetching roadmaps:", error)
    return NextResponse.json(
      { error: "Failed to fetch roadmaps" },
      { status: 500 }
    )
  }
}
