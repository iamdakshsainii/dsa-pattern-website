import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import QuizManagerClient from "@/components/admin/quiz-manager/quiz-manager-client"

export const metadata = {
  title: "Quiz Manager - Admin"
}

export default async function QuizManagerPage() {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user)) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
        <QuizManagerClient />
      </div>
    </div>
  )
}
