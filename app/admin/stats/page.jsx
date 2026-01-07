import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"

export const metadata = {
  title: "Statistics | Admin",
  description: "View platform statistics"
}

export default async function StatsPage() {
  const user = await getCurrentUser()

  if (!user || !isAdmin(user)) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Platform Statistics</h1>
        <p className="text-muted-foreground">Detailed analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <p className="text-muted-foreground">
            Detailed statistics dashboard coming soon. For now, view quick stats on the admin dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
