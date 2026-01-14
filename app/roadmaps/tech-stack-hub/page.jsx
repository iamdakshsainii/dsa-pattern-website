import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import TechStackClient from "./tech-stack-client"

export const metadata = {
  title: "Tech Stack Hub",
  description: "Choose your specialization for Year 3"
}

export default async function TechStackHubPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login?callbackUrl=/roadmaps/tech-stack-hub")
  }

  const { db } = await connectToDatabase()

  const techStacks = await db.collection('roadmaps')
    .find({
      techStackCategory: { $exists: true, $ne: null },
      published: true
    })
    .sort({ order: 1 })
    .toArray()

  const serializedStacks = techStacks.map(stack => ({
    ...stack,
    _id: stack._id.toString(),
    createdAt: stack.createdAt?.toISOString(),
    updatedAt: stack.updatedAt?.toISOString()
  }))

  const masterProgress = await db.collection('master_roadmap_progress').findOne({
    userId: currentUser.id.toString(),
    masterId: "4-year-cs-journey"
  })

  const currentChoice = masterProgress?.chosenTechStack || null

  let currentChoiceProgress = null
  if (currentChoice) {
    const progressDoc = await db.collection('roadmap_progress').findOne({
      userId: currentUser.id.toString(),
      roadmapId: currentChoice
    })
    currentChoiceProgress = progressDoc?.overallProgress || 0
  }

  return (
    <TechStackClient
      techStacks={serializedStacks}
      currentChoice={currentChoice}
      currentChoiceProgress={currentChoiceProgress}
      userId={currentUser.id}
    />
  )
}
