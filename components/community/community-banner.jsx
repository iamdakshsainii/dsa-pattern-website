'use client'

import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { COMMUNITY_CONFIG, getPrimaryCommunityLink } from '@/lib/community-config'

export default function CommunityBanner() {
  const [visible, setVisible] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if banner was dismissed
    const dismissed = localStorage.getItem('community-banner-dismissed')
    if (!dismissed && COMMUNITY_CONFIG.banner.enabled) {
      setVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    if (COMMUNITY_CONFIG.banner.dismissible) {
      localStorage.setItem('community-banner-dismissed', 'true')
    }
  }

  const handleJoin = () => {
    window.open(getPrimaryCommunityLink(), '_blank')
  }

  if (!isClient || !visible || !COMMUNITY_CONFIG.banner.enabled) {
    return null
  }

  return (
    <div className={`relative bg-gradient-to-r ${COMMUNITY_CONFIG.banner.backgroundColor} text-white py-3 px-4 shadow-lg`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">🎉</span>
          <p className="text-sm md:text-base font-medium">
            {COMMUNITY_CONFIG.banner.message}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleJoin}
            size="sm"
            variant="secondary"
            className="bg-white text-green-700 hover:bg-gray-100 font-semibold whitespace-nowrap"
          >
            {COMMUNITY_CONFIG.banner.ctaText}
          </Button>

          {COMMUNITY_CONFIG.banner.dismissible && (
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
