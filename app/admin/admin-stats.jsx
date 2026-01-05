'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Users, MapPin, BookOpen, TrendingUp } from "lucide-react"

export default function AdminStats() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  if (!stats) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Platform Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
            </div>
            <Users className="h-10 w-10 text-blue-600 opacity-80" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Roadmaps</p>
              <p className="text-3xl font-bold mt-2">{stats.totalRoadmaps}</p>
            </div>
            <MapPin className="h-10 w-10 text-green-600 opacity-80" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Nodes</p>
              <p className="text-3xl font-bold mt-2">{stats.totalNodes}</p>
            </div>
            <BookOpen className="h-10 w-10 text-purple-600 opacity-80" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Learners</p>
              <p className="text-3xl font-bold mt-2">{stats.activeLearners}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-orange-600 opacity-80" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Most Popular Roadmaps</h3>
        <div className="space-y-3">
          {stats.popularRoadmaps?.map((roadmap, idx) => (
            <div key={idx} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{roadmap.icon}</span>
                <div>
                  <p className="font-medium">{roadmap.title}</p>
                  <p className="text-sm text-muted-foreground">{roadmap.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{roadmap.followers}</p>
                <p className="text-xs text-muted-foreground">learners</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
