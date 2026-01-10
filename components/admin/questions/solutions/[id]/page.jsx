import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { redirect } from "next/navigation"
import SolutionEditorClient from "@/components/admin/solutions/solution-editor-client"

export default async function SolutionEditorPage({ params }) {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user)) {
    redirect("/admin/login")
  }

  const { id } = await params

  return <SolutionEditorClient questionId={id} />
}
