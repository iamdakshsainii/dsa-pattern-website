import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { redirect } from "next/navigation"
import SolutionManagerClient from "@/components/admin/solutions/solution-manager-client"

export const metadata = {
  title: "Solution Manager - Admin"
}

export default async function SolutionManagerPage() {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user)) {
    redirect("/admin/login")
  }

  return <SolutionManagerClient />
}
