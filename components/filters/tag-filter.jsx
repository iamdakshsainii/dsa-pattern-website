'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tag } from "lucide-react"

export default function TagFilter({ selected, onChange, tags }) {
  if (!tags || tags.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      <Tag className="h-4 w-4 text-muted-foreground" />
      <Select value={selected || 'All'} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Tags</SelectItem>
          {tags.map(tag => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
