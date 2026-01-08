import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import ResponsiveSidebar from "@/components/admin/responsive-sidebar"
import { getAdminNotifications } from "@/lib/notifications"

export const metadata = {
  title: "Admin Dashboard"
}

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser()

  if (!user || !isAdmin(user)) {
    redirect("/dashboard")
  }

  const notifications = await getAdminNotifications(10, false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ResponsiveSidebar user={user} notifications={notifications} />
      <main className="lg:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
