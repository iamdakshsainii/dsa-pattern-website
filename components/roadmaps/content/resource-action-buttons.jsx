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

export default function ResourceActionButtons({
  resourceLinks,
  subtopicId,
  roadmapSlug,
  nodeId,
  currentUser
}) {
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const router = useRouter()

  // Debug logging
  console.log('🔍 ResourceActionButtons - currentUser:', currentUser)
  console.log('🔍 ResourceActionButtons - currentUser?.email:', currentUser?.email)
  console.log('🔍 ResourceActionButtons - currentUser?._id:', currentUser?._id)

  if (!resourceLinks) return null

  // Better check for logged-in user - check for _id OR email
  const isLoggedIn = currentUser && (currentUser.email || currentUser._id)

  console.log('🔍 ResourceActionButtons - isLoggedIn:', isLoggedIn)

  const handleProtectedClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault()
      setShowLoginDialog(true)
    }
  }

  const buttons = []

  if (resourceLinks.youtube) {
    buttons.push({
      key: 'youtube',
      href: `/roadmaps/${roadmapSlug}/${nodeId}/${subtopicId}?type=youtube`,
      icon: Youtube,
      label: 'Watch',
      variant: 'default',
      protected: true
    })
  }

  if (resourceLinks.article) {
    buttons.push({
      key: 'article',
      href: `/roadmaps/${roadmapSlug}/${nodeId}/${subtopicId}?type=article`,
      icon: FileText,
      label: 'Read',
      variant: 'outline',
      protected: true
    })
  }

  if (resourceLinks.practice) {
    buttons.push({
      key: 'practice',
      href: `/roadmaps/${roadmapSlug}/${nodeId}/${subtopicId}?type=practice`,
      icon: Code,
      label: 'Practice',
      variant: 'outline',
      protected: true
    })
  }

  if (resourceLinks.pdf) {
    buttons.push({
      key: 'pdf',
      href: resourceLinks.pdf,
      icon: Download,
      label: 'Download',
      variant: 'outline',
      external: true,
      protected: true
    })
  }

  if (buttons.length === 0) return null

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-3">
        {buttons.map((button) => {
          // If user is logged in, show normal buttons
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
          }

          // If user is NOT logged in, show locked buttons
          return (
            <Button
              key={button.key}
              variant={button.variant}
              size="sm"
              onClick={handleProtectedClick}
              className="relative"
            >
              <Lock className="h-4 w-4 mr-2" />
              {button.label}
            </Button>
          )
        })}
      </div>

      {/* Login Dialog */}
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
