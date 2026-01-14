'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, PlayCircle, Circle } from 'lucide-react'

export default function RoadmapCardCompact({ roadmap, currentUser }) {
  const router = useRouter()
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      fetchProgress()
    } else {
      setLoading(false)
    }
  }, [roadmap.slug, currentUser])

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/roadmaps/progress?roadmapId=${roadmap.slug}`)
      const data = await response.json()
      setProgress(data.progress)
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const progressPercent = progress?.overallProgress || 0
  const isCompleted = progressPercent === 100
  const isInProgress = progressPercent > 0 && progressPercent < 100

  const handleClick = () => {
    router.push(`/roadmaps/${roadmap.slug}`)
  }

  return (
    <Card
      className="p-4 hover:shadow-md transition-all cursor-pointer border-2"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="text-3xl w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
            {roadmap.icon}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{roadmap.title}</h4>
              <Badge variant="secondary" className="text-xs">
                {roadmap.difficulty}
              </Badge>
            </div>

            {currentUser && !loading ? (
              <div className="flex items-center gap-3">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : isInProgress ? (
                  <PlayCircle className="w-4 h-4 text-blue-600" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
                <div className="flex-1">
                  <Progress value={progressPercent} className="h-1.5" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {progressPercent}%
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {roadmap.estimatedWeeks} weeks • {roadmap.category}
              </p>
            )}
          </div>
        </div>

        <Button
          size="sm"
          variant={isCompleted ? "outline" : isInProgress ? "default" : "outline"}
        >
          {isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
        </Button>
      </div>
    </Card>
  )
}
