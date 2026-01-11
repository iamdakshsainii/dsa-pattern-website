import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import UserFeedbackList from "@/components/dashboard/user-feedback-list"

async function getUserFeedback(userId) {
  const { db } = await connectToDatabase()

  const feedback = await db.collection("bug_reports")
    .find({ userId: userId.toString() })
    .sort({ createdAt: -1 })
    .toArray()

  return feedback.map(f => ({
    ...f,
    _id: f._id.toString(),
    createdAt: f.createdAt,
    updatedAt: f.updatedAt || f.createdAt
  }))
}

export default async function UserFeedbackPage() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token")

  if (!authToken) {
    redirect("/auth/login")
  }

  let userId
  try {
    const payload = verifyToken(authToken.value)
    if (!payload) {
      redirect("/auth/login")
    }
    userId = payload.id
  } catch (error) {
    redirect("/auth/login")
  }

  const feedback = await getUserFeedback(userId)

  return <UserFeedbackList feedback={feedback} />
}
