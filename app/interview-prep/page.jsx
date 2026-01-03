'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ClipboardCheck, BookOpen, Users, Target } from 'lucide-react'
import InterviewChecklist from '@/components/career/interview-checklist'

export default function InterviewPrepPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto flex h-16 items-center gap-4 px-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Interview Preparation</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container max-w-6xl mx-auto p-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">🎯 Get Interview Ready</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Use this checklist to prepare systematically for your technical interviews.
            Complete all items to maximize your chances of success!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Checklist - 2 columns */}
          <div className="lg:col-span-2">
            <InterviewChecklist />
          </div>

          {/* Sidebar - Resources */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold">Quick Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>Practice coding out loud to simulate real interviews</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>Always ask clarifying questions before coding</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>Discuss time & space complexity after your solution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>Prepare 2-3 questions to ask the interviewer</span>
                </li>
              </ul>
            </Card>

            {/* Resources */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Resources</h3>
              </div>
              <div className="space-y-2">
                <Link
                  href="/patterns"
                  className="block p-3 rounded-lg bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                >
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    DSA Patterns
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Practice by pattern
                  </p>
                </Link>
                <Link
                  href="/resume"
                  className="block p-3 rounded-lg bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                >
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Resume Manager
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Keep it updated
                  </p>
                </Link>
              </div>
            </Card>

            {/* Community */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Join Community</h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Connect with peers preparing for interviews
              </p>
              <Link href="/community">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Join Codex Community
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Interview Types */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">📋 Common Interview Rounds</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                🧮 Technical Round
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• DSA problem solving</li>
                <li>• Live coding (45-60 min)</li>
                <li>• Complexity analysis</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">
                💼 Behavioral Round
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Past experiences</li>
                <li>• STAR method answers</li>
                <li>• Team collaboration</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                🏗️ System Design
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Scalability discussions</li>
                <li>• Trade-offs analysis</li>
                <li>• Architecture diagrams</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
