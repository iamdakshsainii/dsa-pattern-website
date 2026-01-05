'use client'

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered } from "lucide-react"
import { useState } from "react"

// Simplified rich text editor (you can upgrade to Tiptap later)
export default function RichTextEditor({ value, onChange, placeholder, rows = 4 }) {
  const [isFocused, setIsFocused] = useState(false)

  const wrapText = (prefix, suffix = prefix) => {
    const textarea = document.activeElement
    if (textarea.tagName !== 'TEXTAREA') return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    const newText =
      value.substring(0, start) +
      prefix + selectedText + suffix +
      value.substring(end)

    onChange(newText)
  }

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      {isFocused && (
        <div className="flex gap-1 p-2 border rounded-t-lg bg-muted">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => wrapText('**')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => wrapText('*')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => wrapText('\n- ', '')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => wrapText('\n1. ', '')}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Textarea */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        placeholder={placeholder}
        rows={rows}
        className={isFocused ? 'rounded-t-none' : ''}
      />

      <p className="text-xs text-muted-foreground">
        Supports: **bold**, *italic*, bullet lists
      </p>
    </div>
  )
}
