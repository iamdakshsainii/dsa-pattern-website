import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function DifficultyStats({ difficulty, completed, total }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  const colorClasses = {
    Easy: {
      dot: 'bg-green-500',
      text: 'text-green-600',
      progress: 'bg-green-500'
    },
    Medium: {
      dot: 'bg-yellow-500',
      text: 'text-yellow-600',
      progress: 'bg-yellow-500'
    },
    Hard: {
      dot: 'bg-red-500',
      text: 'text-red-600',
      progress: 'bg-red-500'
    }
  }

  const colors = colorClasses[difficulty] || colorClasses.Easy

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${colors.dot}`}></div>
          <span className="text-sm font-medium">{difficulty}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${colors.text}`}>
            {completed}/{total}
          </span>
          <Badge variant="outline" className="text-xs">
            {percentage}%
          </Badge>
        </div>
      </div>
      <Progress
        value={percentage}
        className="h-2"
      />
    </div>
  )
}
