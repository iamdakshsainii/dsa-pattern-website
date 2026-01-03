import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import DifficultyStats from "./difficulty-stats"

export default function ProgressBreakdown({ stats }) {
  const { byDifficulty, completedByDifficulty } = stats

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Progress by Difficulty
      </h3>
      <div className="space-y-4">
        <DifficultyStats
          difficulty="Easy"
          completed={completedByDifficulty.Easy || 0}
          total={byDifficulty.Easy || 0}
        />
        <DifficultyStats
          difficulty="Medium"
          completed={completedByDifficulty.Medium || 0}
          total={byDifficulty.Medium || 0}
        />
        <DifficultyStats
          difficulty="Hard"
          completed={completedByDifficulty.Hard || 0}
          total={byDifficulty.Hard || 0}
        />
      </div>
    </Card>
  )
}
