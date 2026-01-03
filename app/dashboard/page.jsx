import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import DashboardRealTime from "@/components/dashboard-realtime"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token")

  if (!authToken) {
    redirect("/auth/login")
  }

  let userId, userName, userEmail
  try {
    const payload = verifyToken(authToken.value)
    if (!payload) {
      redirect("/auth/login")
    }
    userId = payload.id
    userName = payload.name
    userEmail = payload.email
  } catch (error) {
    console.error("Auth token parse error:", error)
    redirect("/auth/login")
  }

  return <DashboardRealTime userId={userId} userName={userName} userEmail={userEmail} />
}
