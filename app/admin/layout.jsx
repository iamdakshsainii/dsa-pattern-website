import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import ResponsiveSidebar from "@/components/admin/responsive-sidebar"
import { getAdminNotifications } from "@/lib/notifications"
import { connectToDatabase } from "@/lib/db"

export const metadata = {
  title: "Admin Dashboard"
}

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser()

  if (!user || !isAdmin(user)) {
    redirect("/dashboard")
  }

  let notifications = []
  try {
    const { db } = await connectToDatabase()
    notifications = await getAdminNotifications(10, false)
  } catch (error) {
    console.error('❌ DB Error:', error.message)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <ResponsiveSidebar user={user} notifications={notifications} />
      <main className="flex-1 min-h-screen">
        {children}
      </main>
    </div>
  )
}
