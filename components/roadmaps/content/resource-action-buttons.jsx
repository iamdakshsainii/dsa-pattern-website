'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Youtube, FileText, Code, Download } from "lucide-react"

export default function ResourceActionButtons({
  resourceLinks,
  subtopicId,
  roadmapSlug,
  nodeId
}) {
  if (!resourceLinks) return null

  const buttons = []

  if (resourceLinks.youtube) {
    buttons.push({
      key: 'youtube',
      href: `/roadmaps/${roadmapSlug}/${nodeId}/${subtopicId}?type=youtube`,
      icon: Youtube,
      label: 'Watch',
      variant: 'default'
    })
  }

  if (resourceLinks.article) {
    buttons.push({
      key: 'article',
      href: `/roadmaps/${roadmapSlug}/${nodeId}/${subtopicId}?type=article`,
      icon: FileText,
      label: 'Read',
      variant: 'outline'
    })
  }

  if (resourceLinks.practice) {
    buttons.push({
      key: 'practice',
      href: `/roadmaps/${roadmapSlug}/${nodeId}/${subtopicId}?type=practice`,
      icon: Code,
      label: 'Practice',
      variant: 'outline'
    })
  }

  if (resourceLinks.pdf) {
    buttons.push({
      key: 'pdf',
      href: resourceLinks.pdf,
      icon: Download,
      label: 'Download',
      variant: 'outline',
      external: true
    })
  }

  if (buttons.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {buttons.map((button) => (
        button.external ? (
          <Button
            key={button.key}
            variant={button.variant}
            size="sm"
            asChild
          >
            <a
              href={button.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button.icon className="h-4 w-4 mr-2" />
              {button.label}
            </a>
          </Button>
        ) : (
          <Button
            key={button.key}
            variant={button.variant}
            size="sm"
            asChild
          >
            <Link href={button.href}>
              <button.icon className="h-4 w-4 mr-2" />
              {button.label}
            </Link>
          </Button>
        )
      ))}
    </div>
  )
}
