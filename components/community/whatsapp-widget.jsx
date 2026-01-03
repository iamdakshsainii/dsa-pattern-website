'use client'

import Link from 'next/link'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Users, ArrowRight } from 'lucide-react'
import { COMMUNITY_CONFIG, getPrimaryCommunityLink } from '@/lib/community-config'

export default function WhatsAppWidget() {
  const handleJoin = () => {
    window.open(getPrimaryCommunityLink(), '_blank')
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {COMMUNITY_CONFIG.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Active Community
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
          Live
        </Badge>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
        {COMMUNITY_CONFIG.tagline}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
          <Users className="h-4 w-4 text-green-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Members</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{COMMUNITY_CONFIG.stats.members}</p>
        </div>
        <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
          <MessageCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Placements</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{COMMUNITY_CONFIG.stats.placements}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span className="text-green-500">✓</span>
          <span>Daily DSA discussions</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span className="text-green-500">✓</span>
          <span>Mock interviews & tips</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span className="text-green-500">✓</span>
          <span>Job referrals</span>
        </div>
      </div>

      <Button
        onClick={handleJoin}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        size="sm"
      >
        Join Community
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>

      <Link href="/community" className="block mt-3">
        <p className="text-xs text-center text-green-600 dark:text-green-400 hover:underline">
          Learn more about our community →
        </p>
      </Link>
    </Card>
  )
}
