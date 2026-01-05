import { NextResponse } from "next/server"
import { bulkCreateNodes, getRoadmap } from "@/lib/db"

export async function POST(request) {
  try {
    const { roadmapId, nodes } = await request.json()

    const roadmap = await getRoadmap(roadmapId)
    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 })
    }

    const result = await bulkCreateNodes(roadmapId, nodes)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
