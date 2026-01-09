'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Youtube, FileText, Code, Download, Lock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ResourceActionButtons({
  resourceLinks,
  subtopicId,
  roadmapSlug,
  nodeId,
  currentUser
}) {
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const router = useRouter()

  if (!resourceLinks) return null

  const isLoggedIn = currentUser && (currentUser.email || currentUser._id)

  const handleProtectedClick = (e) => {
    e.preventDefault()
    setShowLoginDialog(true)
  }

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
    <>
      <div className="flex flex-wrap gap-2">
        {buttons.map((button) => {
          const ButtonIcon = button.icon

          if (isLoggedIn) {
            return button.external ? (
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
                  <ButtonIcon className="h-4 w-4 mr-2" />
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
                  <ButtonIcon className="h-4 w-4 mr-2" />
                  {button.label}
                </Link>
              </Button>
            )
          }

          return (
            <TooltipProvider key={button.key}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleProtectedClick}
                    className="opacity-60"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {button.label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm font-medium">🔒 Login Required</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sign in to access learning resources
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to access learning resources.
              Create a free account to start learning!
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              className="flex-1"
              onClick={() => router.push('/auth/signup')}
            >
              Sign Up Free
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/auth/login')}
            >
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
