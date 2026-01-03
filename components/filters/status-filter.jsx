'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock } from "lucide-react"

export default function StatusFilter({ selected, onChange, counts }) {
  const statuses = [
    { value: 'All', label: 'All', icon: null },
    { value: 'Todo', label: 'Todo', icon: Circle },
    { value: 'Solved', label: 'Solved', icon: CheckCircle2 },
    { value: 'Attempted', label: 'Attempted', icon: Clock }
  ]

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium text-muted-foreground">
        Status:
      </span>
      {statuses.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={selected === value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(value)}
          className="transition-all"
        >
          {Icon && <Icon className="w-3.5 h-3.5 mr-1.5" />}
          {label}
          {counts && counts[value] !== undefined && (
            <Badge
              variant="secondary"
              className="ml-2 text-xs"
            >
              {counts[value]}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  )
}
