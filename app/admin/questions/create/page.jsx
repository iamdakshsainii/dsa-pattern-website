import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { redirect } from "next/navigation"
import QuestionCreateClient from "@/components/admin/questions/question-create-client"

export const metadata = {
  title: "Edit Question - Admin"
}

export default async function EditQuestionPage({ params }) {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user)) {
    redirect("/admin/login")
  }

  const { id } = await params

  return <QuestionCreateClient editId={id} />
}
