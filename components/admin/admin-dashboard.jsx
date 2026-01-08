"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Map, BookOpen, TrendingUp, BarChart3, Bug, HelpCircle } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRoadmaps: 0,
    totalNodes: 0,
    activeLearners: 0
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats")
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }
    fetchStats()
  }, [])

  return (
  <div className="min-h-screen pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">Welcome back, Daksh Saini</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-6 bg-blue-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-gray-700">Total Users</h3>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-blue-600">{stats.totalUsers}</p>
        </Card>

        <Card className="p-4 sm:p-6 bg-green-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Map className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-gray-700">Roadmaps</h3>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-green-600">{stats.totalRoadmaps}</p>
        </Card>

        <Card className="p-4 sm:p-6 bg-purple-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-gray-700">Total Nodes</h3>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-purple-600">{stats.totalNodes}</p>
        </Card>

        <Card className="p-4 sm:p-6 bg-orange-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-gray-700">Active Learners</h3>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-orange-600">{stats.activeLearners}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Link href="/admin/stats">
          <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">Statistics</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">View detailed analytics</p>
                </div>
              </div>
              <div className="text-gray-400">→</div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/roadmaps">
          <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-green-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Map className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-green-800">Roadmaps</h3>
                  <p className="text-green-600 text-xs sm:text-sm">Manage learning paths</p>
                </div>
              </div>
              <div className="text-green-600">→</div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/quiz-manager">
          <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">Quiz Manager</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">Create and edit quizzes</p>
                </div>
              </div>
              <div className="text-gray-400">→</div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/bug-reports">
          <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Bug className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">Bug Reports</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">Review user feedback</p>
                </div>
              </div>
              <div className="text-gray-400">→</div>
            </div>
          </Card>
        </Link>
      </div>

      <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">
              Ready to Create a New Roadmap?
            </h2>
            <p className="text-sm sm:text-base text-green-50">
              Our new 3-step process makes it easy: Basic Info → Weak Topics → Quiz Bank
            </p>
          </div>
          <Link href="/admin/roadmaps/create">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              + Create Roadmap
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  </div>
)}
