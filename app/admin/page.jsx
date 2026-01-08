import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { redirect } from "next/navigation"
import AdminDashboard from "@/components/admin/admin-dashboard"

export const metadata = {
  title: "Admin Dashboard"
}

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || !isAdmin(user)) {
    redirect("/admin/login")
  }

  return <AdminDashboard />
}
