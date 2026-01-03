'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react'

export default function DailyChallengeCard({ userProgress }) {
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    fetchDailyChallenge()
  }, [])

  useEffect(() => {
    if (challenge && userProgress?.completed) {
      setIsCompleted(userProgress.completed.includes(challenge._id))
    }
  }, [challenge, userProgress])

  const fetchDailyChallenge = async () => {
    try {
      const response = await fetch('/api/daily-challenge', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setChallenge(data.challenge)
      }
    } catch (error) {
      console.error('Error fetching daily challenge:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'Hard':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </Card>
    )
  }

  if (!challenge) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-3">No challenge available</p>
          <Button variant="outline" size="sm" onClick={fetchDailyChallenge}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-6 ${isCompleted ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'border-2 border-blue-200 dark:border-blue-800'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Daily Challenge</h3>
        {isCompleted && (
          <Badge className="ml-auto bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-base mb-2">{challenge.title}</h4>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
            {challenge.pattern && (
              <Badge variant="outline" className="text-xs">
                {challenge.pattern.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            )}
          </div>
          {challenge.tags && challenge.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {challenge.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <Link href={`/patterns/${challenge.pattern}/questions/${challenge._id}`}>
          <Button className="w-full" variant={isCompleted ? "outline" : "default"}>
            {isCompleted ? 'Review Problem' : 'Start Challenge'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>

        <p className="text-xs text-gray-500 text-center">
          🔥 New challenge every day at midnight
        </p>
      </div>
    </Card>
  )
}
