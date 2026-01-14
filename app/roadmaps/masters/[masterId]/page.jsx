import { getCurrentUser } from "@/lib/auth"
import { getMasterRoadmap, getUserMasterProgress, isYearUnlocked } from "@/lib/db"
import MasterDetailClient from "./master-detail-client"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }) {
  const { masterId } = await params
  const master = await getMasterRoadmap(masterId)

  if (!master) {
    return {
      title: "Roadmap Not Found"
    }
  }

  return {
    title: `${master.title} | DSA Patterns`,
    description: master.description
  }
}

export default async function MasterRoadmapPage({ params }) {
  const { masterId } = await params
  const currentUser = await getCurrentUser()

  const masterRoadmap = await getMasterRoadmap(masterId)

  if (!masterRoadmap) {
    notFound()
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

  return (
    <MasterDetailClient
      masterRoadmap={masterRoadmap}
      userProgress={userProgress}
      unlockedYears={unlockedYears}
      currentUser={currentUser}
    />
  )
}
