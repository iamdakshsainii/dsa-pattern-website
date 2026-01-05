'use client'

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  AlertCircle
} from "lucide-react"

export default function InternalContentRenderer({
  roadmap,
  node,
  subtopic,
  currentUser
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <Link href={`/roadmaps/${roadmap.slug}/${node.nodeId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Node
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>{roadmap.title}</span>
          <ChevronRight className="h-4 w-4" />
          <span>{node.title}</span>
          <ChevronRight className="h-4 w-4" />
          <span>{subtopic.title}</span>
        </div>

        <h1 className="text-4xl font-bold mb-6">{subtopic.title}</h1>

        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-muted rounded-full">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-2">Internal Content Coming Soon</h2>
          <p className="text-muted-foreground mb-6">
            We're working on creating rich internal content for this topic. For now, please use the external resources provided.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>This feature will be available in Phase 3</span>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Link href={`/roadmaps/${roadmap.slug}/${node.nodeId}`}>
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Learning Path
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
