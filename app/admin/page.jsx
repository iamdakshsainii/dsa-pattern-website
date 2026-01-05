import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import AdminDashboard from "./admin-dashboard"

export const metadata = {
  title: "Admin Panel | DSA Patterns",
  description: "Admin dashboard for managing roadmaps and platform content"
}

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || !isAdmin(user)) {
    redirect('/')
  }

  return <AdminDashboard currentUser={user} />
}
