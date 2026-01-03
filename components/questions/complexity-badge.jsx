import { Badge } from "@/components/ui/badge"
import { Clock, Database } from "lucide-react"

export default function ComplexityBadge({ time, space, showIcons = true }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        {showIcons && <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Time:</span>
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700 font-mono">
          {time}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        {showIcons && <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Space:</span>
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700 font-mono">
          {space}
        </Badge>
      </div>
    </div>
  )
}
