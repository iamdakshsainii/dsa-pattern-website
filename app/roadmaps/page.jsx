import { getCurrentUser } from "@/lib/auth"
import { getRoadmaps, getUserActiveRoadmaps, getMasterRoadmaps, getUserMasterProgress } from "@/lib/db"
import RoadmapsClient from "./roadmaps-client"

export const metadata = {
  title: "Learning Roadmaps | DSA Patterns",
  description: "Structured learning paths for mastering DSA, Data Science, Web Development and more"
}

export default async function RoadmapsPage() {
  const currentUser = await getCurrentUser()
  const roadmaps = await getRoadmaps()
  const masterRoadmaps = await getMasterRoadmaps()

  let userActiveRoadmaps = []
  let userMasterProgress = []

  if (currentUser) {
    userActiveRoadmaps = await getUserActiveRoadmaps(currentUser.id)

    userMasterProgress = await Promise.all(
      masterRoadmaps.map(m => getUserMasterProgress(currentUser.id, m.masterId))
    )
  }

  return (
    <RoadmapsClient
      initialRoadmaps={roadmaps}
      masterRoadmaps={masterRoadmaps}
      userMasterProgress={userMasterProgress}
      userActiveRoadmaps={userActiveRoadmaps}
      currentUser={currentUser}
    />
  )
}
