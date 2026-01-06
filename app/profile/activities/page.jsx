import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import ActivitiesClient from "./activities-client"

export const metadata = {
  title: "Activity Dashboard | Learning Analytics",
  description: "Track your quiz performance and identify areas for improvement"
}

export default async function ActivitiesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <ActivitiesClient />
}
