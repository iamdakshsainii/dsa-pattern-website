import { getCurrentUser } from "@/lib/auth"
import { getRoadmaps, getUserActiveRoadmaps } from "@/lib/db"
import RoadmapsClient from "./roadmaps-client"

export const metadata = {
  title: "Learning Roadmaps | DSA Patterns",
  description: "Structured learning paths for mastering DSA, Data Science, Web Development and more"
}

export default async function RoadmapsPage() {
  const currentUser = await getCurrentUser()
  const roadmaps = await getRoadmaps()

  let userActiveRoadmaps = []
  if (currentUser) {
    userActiveRoadmaps = await getUserActiveRoadmaps(currentUser.id)
  }

  return (
    <RoadmapsClient
      initialRoadmaps={roadmaps}
      userActiveRoadmaps={userActiveRoadmaps}
      currentUser={currentUser}
    />
  )
}
