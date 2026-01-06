'use client'

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Lock, CheckCircle2 } from "lucide-react"

export default function QuizUnlockBanner({
  roadmapSlug,
  roadmapTitle,
  overallProgress = 0,
  isUnlocked = false
}) {
  const remaining = 100 - overallProgress

  if (isUnlocked) {
    return (
      <Card className="mt-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">🎉 Quiz Unlocked!</h3>
              <p className="text-sm text-muted-foreground">
                You've completed this roadmap. Take the final quiz to earn your certificate!
              </p>
            </div>
          </div>
          <Link href={`/roadmaps/${roadmapSlug}/quiz`}>
            <Button size="lg" className="gap-2">
              <Trophy className="h-5 w-5" />
              Take Quiz
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <Card className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">Final Quiz Locked</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete {remaining}% more of this roadmap to unlock the certification quiz
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>10 questions • 20 minutes • Certificate on passing</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
