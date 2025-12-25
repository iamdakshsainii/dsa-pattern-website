import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getUserProgress } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, Target, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token")

  if (!authToken) {
    redirect("/auth/login")
  }

  let userId
  try {
    const payload = JSON.parse(Buffer.from(authToken.value, "base64").toString())
    userId = payload.userId
  } catch (error) {
    console.error("Auth token parse error:", error)
    redirect("/auth/login")
  }

  const userProgress = await getUserProgress(userId)

  const stats = {
    totalQuestions: 200,
    solved: userProgress.completed?.length || 0,
    inProgress: userProgress.inProgress?.length || 0,
    bookmarks: userProgress.bookmarks?.length || 0,
  }

  const progress = (stats.solved / stats.totalQuestions) * 100

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Track your DSA learning progress</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Solved</p>
                <p className="text-2xl font-bold">{stats.solved}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bookmarked</p>
                <p className="text-2xl font-bold">{stats.bookmarks}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{Math.round(progress)}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="p-6">
          <h2 className="font-semibold text-lg mb-4">Overall Progress</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {stats.solved} of {stats.totalQuestions} questions solved
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">Continue Learning</h3>
            <p className="text-sm text-muted-foreground mb-4">Pick up where you left off with your patterns</p>
            <Link href="/patterns">
              <Button className="w-full">Browse Patterns</Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">Explore Sheets</h3>
            <p className="text-sm text-muted-foreground mb-4">Practice with curated problem lists</p>
            <Link href="/sheets">
              <Button variant="outline" className="w-full bg-transparent">
                View Sheets
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  )
}
