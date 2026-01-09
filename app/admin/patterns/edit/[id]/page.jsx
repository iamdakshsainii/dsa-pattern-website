import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { redirect } from "next/navigation"
import PatternCreateClient from "@/components/admin/patterns/pattern-create-client"

export const metadata = {
  title: "Edit Pattern - Admin"
}

export default async function EditPatternPage({ params }) {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user)) {
    redirect("/admin/login")
  }

  const { id } = await params

  return <PatternCreateClient editId={id} />
}
