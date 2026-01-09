import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { redirect } from "next/navigation"
import PatternCreateClient from "@/components/admin/patterns/pattern-create-client"

export const metadata = {
  title: "Create Pattern - Admin"
}

export default async function CreatePatternPage({ searchParams }) {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user)) {
    redirect("/admin/login")
  }

  const params = await searchParams
  const editId = params.edit || null

  return <PatternCreateClient editId={editId} />
}
