'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MessageCircle,
  Users,
  Star,
  ExternalLink,
  Sparkles,
  Calendar,
  Briefcase,
  UserPlus,
  MessageSquare,
  Play,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Youtube
} from 'lucide-react'
import { COMMUNITY_CONFIG, getPrimaryCommunityLink } from '@/lib/community-config'

export default function CommunityPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const handleJoinPlatform = () => {
    window.open(getPrimaryCommunityLink(), '_blank')
  }

  const communityFeatures = [
    {
      icon: <MessageSquare className="h-7 w-7" />,
      title: "Connect with Peers",
      description: "Chat with like-minded students preparing for placements and internships",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: "Learn from Alumni",
      description: "Get guidance from seniors working at top companies",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Briefcase className="h-7 w-7" />,
      title: "Opportunities Updates",
      description: "Latest internships, hackathons, and job openings shared daily",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Calendar className="h-7 w-7" />,
      title: "Events & Workshops",
      description: "Join coding sessions, mock interviews, and tech talks",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <UserPlus className="h-7 w-7" />,
      title: "Team Building",
      description: "Find teammates for hackathons and collaborative projects",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <TrendingUp className="h-7 w-7" />,
      title: "Study Together",
      description: "Group discussions on DSA, system design, and interview prep",
      gradient: "from-yellow-500 to-orange-500"
    }
  ]

  const youtubeVideos = [
    {
      id: "pMxbFpXs9T0",
      url: "https://www.youtube.com/watch?v=pMxbFpXs9T0",
      title: "ZERO to 27 LPA: Rahul Kumar's Incredible Juspay Journey",
      views: "2.2K views",
      duration: "21:55"
    },
    {
      id: "KRJYOfRub28",
      url: "https://www.youtube.com/watch?v=KRJYOfRub28",
      title: "Tier-3 Student Rejects 40 LPA Offer for Juspay",
      views: "594 views",
      duration: "12:21"
    },
    {
      id: "SLAM7iPwiQY",
      url: "https://www.youtube.com/watch?v=SLAM7iPwiQY",
      title: "Zero Skill to Win any Hackathon: Strategies & Mindset",
      views: "580 views",
      duration: "25:56"
    },
     {
      id: "SLAM7iPwiQY",
      url: "https://www.youtube.com/watch?v=SLAM7iPwiQY",
      title: "Zero Skill to Win any Hackathon: Strategies & Mindset",
      views: "580 views",
      duration: "25:56"
    }
  ]

  const nextVideo = () => {
    setCurrentVideoIndex((prev) =>
      prev + 3 >= youtubeVideos.length ? 0 : prev + 3
    )
  }

  const prevVideo = () => {
    setCurrentVideoIndex((prev) =>
      prev - 3 < 0 ? Math.max(0, youtubeVideos.length - 3) : prev - 3
    )
  }

  const visibleVideos = youtubeVideos.slice(currentVideoIndex, currentVideoIndex + 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto flex h-16 items-center gap-4 px-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">{COMMUNITY_CONFIG.name}</h1>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-6 shadow-lg">
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold">{COMMUNITY_CONFIG.stats.members} Active Members</span>
          </div>

          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Connect, Learn & Grow Together
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join our WhatsApp community founded by <span className="font-semibold text-green-600">{COMMUNITY_CONFIG.founder}</span> where students connect with alumni, share opportunities, and prepare for placements together
          </p>

          <div className="flex items-center justify-center gap-8 mb-10">
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border-2 border-green-100 dark:border-green-900">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {COMMUNITY_CONFIG.stats.members}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Active Members</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border-2 border-blue-100 dark:border-blue-900">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {COMMUNITY_CONFIG.stats.companies}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Companies</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border-2 border-purple-100 dark:border-purple-900">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Daily
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Opportunities</div>
            </div>
          </div>

          <Button
            onClick={handleJoinPlatform}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <MessageCircle className="h-5 w-5" />
            Join WhatsApp Community
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-10">What You'll Get</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityFeatures.map((feature, index) => (
              <Card key={index} className="group p-6 hover:shadow-2xl transition-all duration-300 border-2 hover:border-transparent hover:scale-105 bg-white dark:bg-gray-800 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-4 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Play className="h-8 w-8 text-red-500" />
              <h3 className="text-3xl font-bold">Alumni Stories & Insights</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Hear directly from students who've made it to top companies</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 italic">Watch their journeys, learn their strategies, and get inspired! ✨</p>
          </div>

          <div className="relative">
            {youtubeVideos.length > 3 && (
              <>
                <button
                  onClick={prevVideo}
                  disabled={currentVideoIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-gray-800 p-3 rounded-full shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextVideo}
                  disabled={currentVideoIndex + 3 >= youtubeVideos.length}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-gray-800 p-3 rounded-full shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visibleVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-red-500/50">
                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                      <div className="relative">
                        <img
                          src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                          alt={video.title}
                          className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-600 rounded-full p-4 group-hover:scale-125 transition-all duration-300 shadow-2xl">
                            <Play className="h-10 w-10 text-white fill-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-2 py-1 rounded font-semibold">
                          {video.duration}
                        </div>
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Youtube className="h-3 w-3" />
                          Watch
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold mb-2 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{video.views}</p>
                      </div>
                    </a>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="https://www.youtube.com/@CodeX-Network8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="gap-2 border-2 border-red-500 hover:bg-red-50 dark:hover:bg-red-950 group"
              >
                <Youtube className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Subscribe to our YouTube Channel</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Get notified about new interviews, tutorials, and placement tips!
            </p>
          </div>
        </div>

        <Card className="p-12 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white text-center relative overflow-hidden shadow-2xl border-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
          <div className="relative z-10">
            <div className="inline-flex p-4 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Users className="h-16 w-16" />
            </div>
            <h3 className="text-4xl font-bold mb-4">Ready to Join?</h3>
            <p className="mb-8 text-green-50 max-w-2xl mx-auto text-lg leading-relaxed">
              Be part of a supportive community where students help each other succeed. Get daily updates on opportunities, connect with seniors, and grow together!
            </p>
            <Button
              onClick={handleJoinPlatform}
              size="lg"
              className="bg-white text-green-600 hover:bg-green-50 gap-2 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" />
              Join {COMMUNITY_CONFIG.name}
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
