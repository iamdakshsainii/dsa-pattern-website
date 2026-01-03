
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function AcceptanceRate({ rate, showIcon = false, variant = "default" }) {
  // Determine color based on rate
  const getColorClass = () => {
    if (rate >= 60) return "text-green-600 dark:text-green-400"
    if (rate >= 45) return "text-blue-600 dark:text-blue-400"
    if (rate >= 30) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getBarColor = () => {
    if (rate >= 60) return "bg-green-500"
    if (rate >= 45) return "bg-blue-500"
    if (rate >= 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getIcon = () => {
    if (rate >= 50) return <TrendingUp className="h-3 w-3" />
    if (rate >= 35) return <Minus className="h-3 w-3" />
    return <TrendingDown className="h-3 w-3" />
  }

  if (variant === "detailed") {
    return (
      <div className="inline-flex items-center gap-2">
        <div className="relative w-16 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full ${getBarColor()} transition-all`}
            style={{ width: `${rate}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${getColorClass()}`}>
          {rate}%
        </span>
        {showIcon && getIcon()}
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <span className={`text-sm font-medium ${getColorClass()}`}>
        {rate}%
      </span>
    )
  }

  // Default: bar + percentage
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="relative w-12 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${getBarColor()}`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span className={`text-sm font-medium ${getColorClass()}`}>
        {rate}%
      </span>
    </div>
  )
}

// Alternative: Badge style
export function AcceptanceRateBadge({ rate }) {
  const getBadgeClass = () => {
    if (rate >= 60) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (rate >= 45) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    if (rate >= 30) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getBadgeClass()}`}>
      {rate}%
    </span>
  )
}
