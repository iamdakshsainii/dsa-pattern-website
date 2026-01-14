import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import DashboardRealTime from "@/components/dashboard-realtime"
import ExamCountdownWidget from "@/components/exam-countdown-widget"

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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <DashboardRealTime
            userId={userId}
            userName={userName}
            userEmail={userEmail}
          />
        </div>

        <aside className="space-y-4">
          <ExamCountdownWidget
            userId={userId}
            masterId="4-year-cs-journey"
          />
        </aside>
      </div>
    </div>
  )
}
