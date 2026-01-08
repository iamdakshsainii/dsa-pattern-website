import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { redirect } from "next/navigation"
import RoadmapListClient from "@/components/admin/roadmaps/roadmap-list-client"

export const metadata = {
  title: "Roadmap Management - Admin"
}

export default async function AdminRoadmapsPage() {
  const user = await getCurrentUser()

  if (!user || !isAdmin(user)) {
    redirect("/admin/login")
  }

  return <RoadmapListClient />
}
