'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MessageCircle,
  Users,
  Zap,
  Star,
  ExternalLink
} from 'lucide-react'
import { COMMUNITY_CONFIG, getPrimaryCommunityLink } from '@/lib/community-config'

export default function CommunityPage() {
  const handleJoinPlatform = () => {
    window.open(getPrimaryCommunityLink(), '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto flex h-16 items-center gap-4 px-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            <h1 className="text-2xl font-bold">{COMMUNITY_CONFIG.name}</h1>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-600 hover:bg-green-700">
            Active Community
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            {COMMUNITY_CONFIG.description}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Founded by {COMMUNITY_CONFIG.founder}, connect with peers, practice together,
            and land your dream job at top tech companies
          </p>

          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {COMMUNITY_CONFIG.stats.members}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {COMMUNITY_CONFIG.stats.companies}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {COMMUNITY_CONFIG.stats.placements}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Placements</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              onClick={handleJoinPlatform}
              size="lg"
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Join WhatsApp Community
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {COMMUNITY_CONFIG.features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">
            <Star className="inline h-6 w-6 text-yellow-500 mb-1" /> Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMMUNITY_CONFIG.testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center">
          <Users className="h-16 w-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Ready to Join?</h3>
          <p className="mb-6 text-green-100 max-w-2xl mx-auto">
            Start your journey with {COMMUNITY_CONFIG.stats.members} students
            who are preparing for top tech companies. Daily problems, mock interviews,
            referrals, and more!
          </p>
          <Button
            onClick={handleJoinPlatform}
            size="lg"
            className="bg-white text-green-600 hover:bg-green-50 gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            Join {COMMUNITY_CONFIG.name}
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Card>
      </div>
    </div>
  )
}
