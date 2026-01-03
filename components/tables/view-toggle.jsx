'use client'

import { LayoutGrid, Table } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ViewToggle({ view, onViewChange }) {
  return (
    <div className="flex items-center gap-1 border rounded-lg p-1">
      <Button
        variant={view === 'card' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('card')}
        className="gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        Cards
      </Button>
      <Button
        variant={view === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className="gap-2"
      >
        <Table className="h-4 w-4" />
        Table
      </Button>
    </div>
  )
}
