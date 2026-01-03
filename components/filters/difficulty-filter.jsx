'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DifficultyFilter({ selected, onChange, counts }) {
  const difficulties = ['All', 'Easy', 'Medium', 'Hard']

  const getColor = (diff) => {
    switch(diff) {
      case 'Easy': return 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Hard': return 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium text-muted-foreground">
        Difficulty:
      </span>
      {difficulties.map(diff => (
        <Button
          key={diff}
          variant={selected === diff ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(diff)}
          className={`transition-all ${
            selected === diff
              ? ''
              : getColor(diff)
          }`}
        >
          {diff}
          {counts && counts[diff] !== undefined && (
            <Badge
              variant="secondary"
              className="ml-2 text-xs"
            >
              {counts[diff]}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  )
}
