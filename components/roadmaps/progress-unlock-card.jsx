"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Award, TrendingUp, BookmarkPlus } from "lucide-react"

export default function ProgressUnlockCard() {
  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
            <span className="text-3xl">🎯</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Want to track your progress?
            </h3>
            <p className="text-gray-600 text-sm">
              Create a free account to unlock all features
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left py-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Save Progress</p>
                <p className="text-xs text-gray-600">Track completed subtopics</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Award className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Earn Certificates</p>
                <p className="text-xs text-gray-600">Get completion certificates</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Track Stats</p>
                <p className="text-xs text-gray-600">View your learning analytics</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <BookmarkPlus className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Bookmark Topics</p>
                <p className="text-xs text-gray-600">Save for later review</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Link href="/auth/signup" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Create Free Account
              </Button>
            </Link>
            <p className="text-xs text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
