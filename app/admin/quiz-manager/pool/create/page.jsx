import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import PoolQuizCreator from "./pool-quiz-creator"

export const metadata = {
  title: "Create Pool Quiz Set"
}

export default async function CreatePoolQuizPage() {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user)) {
    redirect("/dashboard")
  }

  return <PoolQuizCreator />
}
