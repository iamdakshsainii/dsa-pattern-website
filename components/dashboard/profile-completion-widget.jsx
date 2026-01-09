'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { User, Check, X, ArrowRight } from 'lucide-react'

export default function ProfileCompletionWidget() {
  const [completionData, setCompletionData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()

    const interval = setInterval(fetchProfile, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        credentials: 'include',
        cache: 'no-store'
      })

      if (response.ok) {
        const data = await response.json()
        setCompletionData({
          profile: data.profile,
          completion: data.completionPercentage || 0
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCompletionItems = () => {
    if (!completionData?.profile) return []

    const profile = completionData.profile

    return [
      { label: 'Profile Picture', completed: !!profile.avatar },
      { label: 'Bio', completed: !!profile.bio },
      { label: 'College', completed: !!profile.college },
      { label: 'Skills', completed: profile.skills?.length > 0 },
      { label: 'Location', completed: !!profile.location },
      { label: 'GitHub', completed: !!profile.github },
      { label: 'LinkedIn', completed: !!profile.linkedin }
    ]
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </div>
      </Card>
    )
  }

  const completion = completionData?.completion || 0

  if (completion === 100) {
    return null
  }

  return (
    <Card className="p-6 border-2 border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">Complete Your Profile</h3>
            <span className="text-2xl font-bold text-blue-600">{completion}%</span>
          </div>
          <Progress value={completion} className="h-2 mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Add more details to make your profile stand out to recruiters and peers.
          </p>

          <div className="space-y-2 mb-4">
            {getCompletionItems().slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {item.completed ? (
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
                )}
                <span className={item.completed ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <Link href="/profile/edit">
            <Button className="w-full">
              Complete Profile
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
