'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Youtube, FileText, Code, Link as LinkIcon, Trash2, Plus } from "lucide-react"

function detectLinkType(url) {
  if (!url) return 'unknown'

  const urlLower = url.toLowerCase()

  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'youtube'
  }
  if (urlLower.includes('medium.com') || urlLower.includes('dev.to') ||
      urlLower.includes('blog') || urlLower.includes('article')) {
    return 'article'
  }
  if (urlLower.includes('leetcode.com') || urlLower.includes('hackerrank') ||
      urlLower.includes('codewars') || urlLower.includes('exercism')) {
    return 'practice'
  }

  return 'article'
}

function getIcon(type) {
  switch (type) {
    case 'youtube':
      return <Youtube className="h-4 w-4 text-red-600" />
    case 'article':
      return <FileText className="h-4 w-4 text-blue-600" />
    case 'practice':
      return <Code className="h-4 w-4 text-green-600" />
    default:
      return <LinkIcon className="h-4 w-4 text-gray-600" />
  }
}

export default function ResourceLinkInput({
  links = [],
  onChange,
  placeholder = "Add resource link"
}) {
  const [newLink, setNewLink] = useState('')

  const safeLinks = Array.isArray(links) ? links : []

  const handleAdd = () => {
    if (!newLink.trim()) return

    const type = detectLinkType(newLink)
    const linkData = {
      url: newLink.trim(),
      type,
      addedAt: new Date().toISOString()
    }

    onChange([...safeLinks, linkData])
    setNewLink('')
  }

  const handleRemove = (index) => {
    onChange(safeLinks.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-2">
      {safeLinks.length > 0 && (
        <div className="space-y-2">
          {safeLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50">
              {getIcon(link.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{link.url}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  {link.type}
                </Badge>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => handleRemove(index)}
              >
                <Trash2 className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          size="sm"
          onClick={handleAdd}
          disabled={!newLink.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {newLink && (
        <p className="text-xs text-muted-foreground">
          Auto-detected as: <strong>{detectLinkType(newLink)}</strong>
        </p>
      )}
    </div>
  )
}
