import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { redirect } from "next/navigation"
import PatternManagementClient from "@/components/admin/patterns/pattern-management-client"

export const metadata = {
  title: "Pattern Management - Admin"
}

export default async function AdminPatternsPage() {
  const user = await getCurrentUser()

  if (!user || !isAdmin(user)) {
    redirect("/admin/login")
  }

  return <PatternManagementClient />
}
