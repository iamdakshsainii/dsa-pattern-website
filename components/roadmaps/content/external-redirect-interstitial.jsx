'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ExternalLink,
  Youtube,
  FileText,
  Code,
  Clock,
  ChevronRight
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ExternalRedirectInterstitial({
  roadmap,
  node,
  subtopic,
  resourceUrl,
  resourceType,
  currentUser
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [countdown, setCountdown] = useState(3)
  const [markComplete, setMarkComplete] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  const getResourceIcon = () => {
    switch (resourceType) {
      case 'youtube':
        return <Youtube className="h-6 w-6 text-red-600" />
      case 'article':
        return <FileText className="h-6 w-6 text-blue-600" />
      case 'practice':
        return <Code className="h-6 w-6 text-green-600" />
      default:
        return <ExternalLink className="h-6 w-6" />
    }
  }

  const getProviderName = () => {
    try {
      const url = new URL(resourceUrl)
      return url.hostname.replace('www.', '')
    } catch {
      return 'External Site'
    }
  }

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !redirecting) {
      handleRedirect()
    }
  }, [countdown, redirecting])

  const handleRedirect = async () => {
    setRedirecting(true)

    if (markComplete && currentUser) {
      try {
        await fetch('/api/roadmaps/subtopic/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roadmapId: roadmap.slug,
            nodeId: node.nodeId,
            subtopicId: subtopic.subtopicId
          })
        })
      } catch (error) {
        console.error("Failed to mark complete:", error)
      }
    }

    window.open(resourceUrl, '_blank')

    setTimeout(() => {
      router.back()
    }, 500)
  }

  const handleManualRedirect = () => {
    setCountdown(0)
    handleRedirect()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 max-w-3xl">
          <Link href={`/roadmaps/${roadmap.slug}/${node.nodeId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Node
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            {getResourceIcon()}
          </div>

          <h1 className="text-2xl font-bold mb-2">Opening External Resource</h1>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <span>{roadmap.title}</span>
            <ChevronRight className="h-4 w-4" />
            <span>{node.title}</span>
            <ChevronRight className="h-4 w-4" />
            <span>{subtopic.title}</span>
          </div>

          <div className="bg-muted rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-lg mb-2">{subtopic.title}</h2>
            {subtopic.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {subtopic.description}
              </p>
            )}

            <div className="flex items-center justify-center gap-4 text-sm">
              <Badge variant="outline">
                {getProviderName()}
              </Badge>
              {subtopic.estimatedMinutes && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{subtopic.estimatedMinutes} min</span>
                </div>
              )}
            </div>
          </div>

          {currentUser ? (
            <div className="flex items-center justify-center gap-2 mb-6">
              <Checkbox
                id="mark-complete"
                checked={markComplete}
                onCheckedChange={setMarkComplete}
              />
              <label
                htmlFor="mark-complete"
                className="text-sm cursor-pointer"
              >
                Mark as complete after opening
              </label>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-6">
              Login to track your progress
            </p>
          )}

          {!redirecting ? (
            <>
              <Button
                onClick={handleManualRedirect}
                size="lg"
                className="mb-4"
              >
                Continue to Resource
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>

              <p className="text-sm text-muted-foreground">
                Redirecting automatically in {countdown}...
              </p>
            </>
          ) : (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
              <span>Opening resource...</span>
            </div>
          )}
        </Card>

        <div className="mt-6 text-center">
          <Link href={`/roadmaps/${roadmap.slug}/${node.nodeId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel and go back
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
