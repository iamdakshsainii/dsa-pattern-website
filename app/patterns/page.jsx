export const dynamic = 'force-dynamic'
import Link from "next/link"
import { getPatterns } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen } from "lucide-react"
import PatternsClientPage from "@/components/patterns-client-page"

export default async function PatternsPage() {
  const patterns = await getPatterns()

  // Get current user and their progress
  const currentUser = await getCurrentUser()
  let userProgress = null

  if (currentUser) {
    const client = await clientPromise
    const db = client.db("dsa_patterns")
    const progressCollection = db.collection("progress")

    const allProgress = await progressCollection
      .find({ userId: currentUser.id })
      .toArray()

    const completed = allProgress
      .filter(p => p.completed)
      .map(p => p.questionId || p.problemId)

    const bookmarks = allProgress
      .filter(p => p.bookmarked)
      .map(p => p.questionId || p.problemId)

    userProgress = {
      completed,
      bookmarks,
      inProgress: allProgress
        .filter(p => !p.completed && p.attempts > 0)
        .map(p => p.questionId || p.problemId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container flex h-16 items-center gap-4 px-4 max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">DSA Patterns</h1>
          </div>
        </div>
      </header>

      <PatternsClientPage
        patterns={patterns}
        userProgress={userProgress}
        currentUser={currentUser}
      />
    </div>
  )
}
