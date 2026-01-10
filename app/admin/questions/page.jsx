import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { redirect } from "next/navigation"
import QuestionManagementClient from "@/components/admin/questions/question-management-client"

export const metadata = {
  title: "Question Management - Admin"
}

export default async function QuestionManagementPage() {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user)) {
    redirect("/admin/login")
  }

  return <QuestionManagementClient />
}
