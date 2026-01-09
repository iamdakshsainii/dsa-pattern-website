import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import AchievementsGallery from "@/components/achievements/achievements-gallery"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function AchievementsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
              <span className="text-4xl">🏆</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold">Your Achievements</h1>
              <p className="text-muted-foreground text-lg">
                Unlock badges by solving problems and reaching milestones
              </p>
            </div>
          </div>
        </div>

        <AchievementsGallery userId={user.id} />
      </div>
    </div>
  )
}
