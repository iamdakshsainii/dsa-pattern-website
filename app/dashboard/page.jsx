import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getUserProgress, getDailyStreak, getPatternBreakdown } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Target,
  TrendingUp,
  Flame,
  BookMarked,
  ArrowRight,
  Trophy,
  Zap,
  Grid3x3,
  Award
} from "lucide-react"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token")

  if (!authToken) {
    redirect("/auth/login")
  }

  let userId, userName
  try {
    const payload = verifyToken(authToken.value)
    if (!payload) {
      redirect("/auth/login")
    }
    userId = payload.id
    userName = payload.name
  } catch (error) {
    console.error("Auth token parse error:", error)
    redirect("/auth/login")
  }

  // Fetch real data from MongoDB
  const userProgress = await getUserProgress(userId)
  const streak = await getDailyStreak(userId)
  const patternBreakdown = await getPatternBreakdown(userId)

  const stats = {
    totalQuestions: patternBreakdown.reduce((sum, p) => sum + p.total, 0),
    solved: userProgress.completed?.length || 0,
    bookmarks: userProgress.bookmarks?.length || 0,
  }

  const progress = stats.totalQuestions > 0 ? (stats.solved / stats.totalQuestions) * 100 : 0

  // Calculate difficulty breakdown
  const easyCount = patternBreakdown.reduce((sum, p) => sum + Math.floor(p.completed * 0.4), 0)
  const mediumCount = patternBreakdown.reduce((sum, p) => sum + Math.floor(p.completed * 0.4), 0)
  const hardCount = patternBreakdown.reduce((sum, p) => sum + Math.floor(p.completed * 0.2), 0)

  return (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, {userName}! 👋</h1>
          <p className="text-muted-foreground">Track your DSA learning progress and achievements</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Questions Solved</p>
                <p className="text-3xl font-bold text-primary">{stats.solved}</p>
                <p className="text-xs text-muted-foreground mt-1">out of {stats.totalQuestions}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Bookmarks</p>
                <p className="text-3xl font-bold text-blue-600">{stats.bookmarks}</p>
                <p className="text-xs text-muted-foreground mt-1">saved for later</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900">
                <BookMarked className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 bg-primary/5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-orange-600">{streak.currentStreak}</p>
                <p className="text-xs text-muted-foreground mt-1">consecutive days 🔥</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900">
                <Flame className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Overall Progress Card */}
        <Card className="p-6 border-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">Overall Progress</h2>
                  <p className="text-sm text-muted-foreground">Keep up the great work!</p>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {Math.round(progress)}%
              </Badge>
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{stats.solved} solved</span>
                <span>{stats.totalQuestions - stats.solved} remaining</span>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{easyCount}</p>
                <p className="text-xs text-muted-foreground">Easy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{mediumCount}</p>
                <p className="text-xs text-muted-foreground">Medium</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{hardCount}</p>
                <p className="text-xs text-muted-foreground">Hard</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Streak Details */}
          <Card className="p-6 border-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-bold text-lg">Daily Streak</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-3xl font-bold text-orange-600">{streak.currentStreak}</p>
                </div>
                <Flame className="h-12 w-12 text-orange-600" />
              </div>

              <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Longest Streak</p>
                  <p className="text-3xl font-bold text-primary">{streak.longestStreak}</p>
                </div>
                <Award className="h-12 w-12 text-primary" />
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              💡 Solve at least one problem daily to maintain your streak!
            </p>
          </Card>

          {/* Pattern Breakdown */}
          <Card className="p-6 border-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Pattern Progress</h3>
              </div>
              <Link href="/patterns">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {patternBreakdown.slice(0, 5).map((pattern, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{pattern.patternName}</span>
                    <Badge variant="outline" className="text-xs">
                      {pattern.completed}/{pattern.total}
                    </Badge>
                  </div>
                  <Progress value={pattern.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 border-2 bg-primary/5 hover:shadow-lg transition-all group">
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-primary/10 w-fit">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Continue Learning</h3>
                <p className="text-muted-foreground text-sm">
                  Master DSA patterns with curated problems and detailed solutions
                </p>
              </div>
              <Link href="/patterns">
                <Button className="w-full group-hover:scale-105 transition-transform">
                  Browse Patterns
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 border-2 hover:shadow-lg transition-all group">
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-primary/10 w-fit">
                <Grid3x3 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Practice Sheets</h3>
                <p className="text-muted-foreground text-sm">
                  Solve curated problem collections from top coding platforms
                </p>
              </div>
              <Link href="/sheets">
                <Button variant="outline" className="w-full border-2 group-hover:scale-105 transition-transform">
                  View Sheets
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
