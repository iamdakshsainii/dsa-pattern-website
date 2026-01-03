import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter, CheckCircle2, XCircle } from "lucide-react"

export default function StatsPanel({ stats, totalQuestions }) {
  const { total, completed, remaining } = stats

  const isFiltered = total !== totalQuestions
  const filteredOut = totalQuestions - total

  return (
    <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">
              Showing {total} of {totalQuestions}
            </span>
          </div>

          {isFiltered && (
            <Badge variant="outline" className="gap-1">
              <XCircle className="h-3 w-3" />
              {filteredOut} filtered out
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm">
              <span className="font-bold text-green-600">{completed}</span>
              <span className="text-muted-foreground"> completed</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">
              <span className="font-bold text-orange-600">{remaining}</span>
              <span className="text-muted-foreground"> remaining</span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
