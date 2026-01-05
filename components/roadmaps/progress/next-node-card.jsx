'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock } from "lucide-react"

export default function NextNodeCard({ node, roadmapSlug }) {
  const handleContinue = () => {
    const nodeElement = document.getElementById(`node-${node.nodeId}`)
    if (nodeElement) {
      nodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Auto-expand the node
      setTimeout(() => {
        nodeElement.click()
      }, 500)
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-primary/20">
      <div className="flex items-start gap-2 mb-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
          →
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">UP NEXT</p>
          <h4 className="font-semibold text-sm">{node.title}</h4>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Clock className="h-3 w-3" />
        Est: {node.estimatedHours}h
        {node.subtopics && (
          <>
            <span>•</span>
            <span>{node.subtopics.length} subtopics</span>
          </>
        )}
      </div>

      <Button
        onClick={handleContinue}
        className="w-full"
        size="sm"
      >
        Continue Learning
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </Card>
  )
}
