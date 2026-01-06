import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, TrendingUp, ArrowRight } from "lucide-react"

export default function QuizSummaryCard({ stats }) {
  const { totalAttempts = 0, passed = 0, failed = 0, avgScore = 0 } = stats || {}

  return (
    <Card className="p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <Trophy className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Quiz Performance</h3>
            <p className="text-sm text-muted-foreground">
              {totalAttempts} total attempt{totalAttempts !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{passed}</div>
          <div className="text-xs text-muted-foreground">Passed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{failed}</div>
          <div className="text-xs text-muted-foreground">Failed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{avgScore}%</div>
          <div className="text-xs text-muted-foreground">Avg Score</div>
        </div>
      </div>

      <Link href="/activity/quizzes">
        <Button variant="outline" className="w-full">
          View All Activity
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </Card>
  )
}
