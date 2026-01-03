import { Clock, Database } from "lucide-react"

export default function ComplexityBadges({ complexity }) {
  if (!complexity) return null

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      {complexity.time && (
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">
            {complexity.time}
          </code>
        </div>
      )}
      {complexity.space && (
        <div className="flex items-center gap-1.5">
          <Database className="h-3.5 w-3.5" />
          <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">
            {complexity.space}
          </code>
        </div>
      )}
    </div>
  )
}
