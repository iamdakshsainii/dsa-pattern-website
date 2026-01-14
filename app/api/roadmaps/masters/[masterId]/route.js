import { NextResponse } from "next/server"
import { getMasterRoadmap, getUserMasterProgress, isYearUnlocked } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    const { masterId } = await params
    const currentUser = await getCurrentUser()

    const masterRoadmap = await getMasterRoadmap(masterId)

    if (!masterRoadmap) {
      return NextResponse.json(
        { error: "Master roadmap not found" },
        { status: 404 }
      )
    }

    let userProgress = null
    let unlockedYears = [1]

    if (currentUser) {
      userProgress = await getUserMasterProgress(currentUser.id, masterId)

      for (let year of masterRoadmap.years) {
        const isUnlocked = await isYearUnlocked(currentUser.id, masterId, year.yearNumber)
        if (isUnlocked && !unlockedYears.includes(year.yearNumber)) {
          unlockedYears.push(year.yearNumber)
        }
      }
    }

    return NextResponse.json({
      masterRoadmap,
      userProgress,
      unlockedYears
    })
  } catch (error) {
    console.error("Error fetching master roadmap:", error)
    return NextResponse.json(
      { error: "Failed to fetch master roadmap" },
      { status: 500 }
    )
  }
}
