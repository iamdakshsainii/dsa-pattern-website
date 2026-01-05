"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useState } from "react"

export default function AuthCTABanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="sticky top-0 z-50 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl">🔒</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold">Sign up free to track your progress</span>
              <span className="text-sm text-blue-100 hidden sm:inline">
                • Save completion status • Earn certificates • Get personalized recommendations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/auth/signup">
              <Button size="sm" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Sign Up
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                Login
              </Button>
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 hover:bg-white/20 rounded transition-colors ml-2"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
