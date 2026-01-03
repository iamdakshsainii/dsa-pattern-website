'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { User, Check, X, ArrowRight } from 'lucide-react'

export default function ProfileCompletionWidget() {
  const [profile, setProfile] = useState(null)
  const [completion, setCompletion] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setCompletion(calculateCompletion(data.profile))
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateCompletion = (profile) => {
    if (!profile) return 0

    const fields = [
      profile?.avatar,
      profile?.bio,
      profile?.college,
      profile?.graduationYear,
      profile?.location,
      profile?.skills?.length > 0,
      profile?.socialLinks?.linkedin,
      profile?.socialLinks?.github,
      profile?.socialLinks?.leetcode,
      profile?.resumeUrl
    ]

    const completed = fields.filter(Boolean).length
    return Math.round((completed / fields.length) * 100)
  }

  const getCompletionItems = () => {
    if (!profile) return []

    return [
      { label: 'Profile Picture', completed: !!profile?.avatar },
      { label: 'Bio', completed: !!profile?.bio },
      { label: 'College', completed: !!profile?.college },
      { label: 'Skills', completed: profile?.skills?.length > 0 },
      { label: 'Social Links', completed: !!profile?.socialLinks?.linkedin || !!profile?.socialLinks?.github },
      { label: 'Resume', completed: !!profile?.resumeUrl }
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

  if (completion === 100) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Profile Complete! 🎉</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your profile is fully set up and ready to showcase.
            </p>
          </div>
        </div>
      </Card>
    )
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

          {/* Completion Checklist */}
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
