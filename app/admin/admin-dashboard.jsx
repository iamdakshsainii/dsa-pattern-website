'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Map,
  BookOpen,
  Bug,
  Users,
  TrendingUp,
  ArrowRight,
  FileQuestion,
  Plus
} from "lucide-react"

export default function AdminDashboard({ currentUser }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.name || currentUser?.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Total Users</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Map className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Roadmaps</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats?.totalRoadmaps || 0}</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Total Nodes</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats?.totalNodes || 0}</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Active Learners</h3>
            </div>
            <p className="text-3xl font-bold text-orange-600">{stats?.activeLearners || 0}</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/admin/stats">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-500 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">Statistics</h3>
                    <p className="text-sm text-muted-foreground">View detailed analytics</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>

          <Link href="/admin/roadmaps">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-500 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <Map className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-green-600 transition-colors">Roadmaps</h3>
                    <p className="text-sm text-muted-foreground">Manage learning paths</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>

          <Link href="/admin/quiz-manager">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-500 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                    <FileQuestion className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-purple-600 transition-colors">Quiz Manager</h3>
                    <p className="text-sm text-muted-foreground">Create and edit quizzes</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>

          <Link href="/admin/bug-reports">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-red-500 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                    <Bug className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-red-600 transition-colors">Bug Reports</h3>
                    <p className="text-sm text-muted-foreground">Review user feedback</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>
        </div>

        {/* Create New Roadmap CTA */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to Create a New Roadmap?</h3>
              <p className="text-green-50 mb-4">
                Our new 3-step process makes it easy: Basic Info → Weak Topics → Quiz Bank
              </p>
            </div>
            <Link href="/admin/roadmaps/create">
              <Button size="lg" variant="secondary" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Roadmap
              </Button>
            </Link>
          </div>
        </Card>

        {/* Popular Roadmaps */}
        {stats?.popularRoadmaps && stats.popularRoadmaps.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Popular Roadmaps</h2>
              <Link href="/admin/roadmaps">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.popularRoadmaps.map((roadmap) => (
                <Card key={roadmap.slug} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{roadmap.icon || '📚'}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{roadmap.title}</h3>
                      <p className="text-sm text-muted-foreground">{roadmap.category}</p>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {roadmap.followers}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/roadmaps/${roadmap.slug}/nodes`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Nodes
                      </Button>
                    </Link>
                    <Link href={`/admin/roadmaps/${roadmap.slug}/quiz-bank`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <FileQuestion className="h-4 w-4 mr-1" />
                        Quizzes
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity Notice */}
        <Card className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                New Quiz Bank System Active
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                All new roadmaps now support multiple quiz variations with attempt limits.
                Students get random quizzes from your bank on each attempt!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
