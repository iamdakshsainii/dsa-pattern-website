"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Loader2, Check, Lock, AlertCircle, Info } from 'lucide-react'
import Link from 'next/link'

export default function ProfileEditForm({ user, profile }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: user.username || '',
    bio: profile?.bio || '',
    college: profile?.college || '',
    graduationYear: profile?.graduationYear || '',
    currentYear: profile?.currentYear || '',
    location: profile?.location || '',
    skills: profile?.skills || [],
    socialLinks: {
      linkedin: profile?.socialLinks?.linkedin || '',
      github: profile?.socialLinks?.github || '',
      leetcode: profile?.socialLinks?.leetcode || '',
      portfolio: profile?.socialLinks?.portfolio || '',
      twitter: profile?.socialLinks?.twitter || ''
    }
  })
  const [newSkill, setNewSkill] = useState('')
  const [loading, setLoading] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: '' })
  const [canChangeUsername, setCanChangeUsername] = useState(true)
  const [daysUntilChange, setDaysUntilChange] = useState(0)

  useEffect(() => {
    // Check if username can be changed (14-day rule)
    if (profile?.usernameLastChanged) {
      const lastChanged = new Date(profile.usernameLastChanged)
      const now = new Date()
      const daysSinceChange = Math.floor((now - lastChanged) / (1000 * 60 * 60 * 24))

      if (daysSinceChange < 14) {
        setCanChangeUsername(false)
        setDaysUntilChange(14 - daysSinceChange)
      }
    }
  }, [profile])

  useEffect(() => {
    const checkUsername = async () => {
      // Don't check if username hasn't changed or can't be changed
      if (!formData.username || formData.username === user.username || !canChangeUsername) {
        setUsernameStatus({ checking: false, available: null, message: '' })
        return
      }

      if (formData.username.length < 3) {
        setUsernameStatus({ checking: false, available: false, message: 'Username must be at least 3 characters' })
        return
      }

      setUsernameStatus({ checking: true, available: null, message: 'Checking...' })

      try {
        const response = await fetch(`/api/profile/username?username=${formData.username}`)
        const data = await response.json()
        setUsernameStatus({
          checking: false,
          available: data.available,
          message: data.available ? 'Username available!' : 'Username taken'
        })
      } catch (error) {
        setUsernameStatus({ checking: false, available: false, message: 'Check failed' })
      }
    }

    const debounce = setTimeout(checkUsername, 500)
    return () => clearTimeout(debounce)
  }, [formData.username, user.username, canChangeUsername])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim()) && formData.skills.length < 20) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Only update username if it changed and is allowed
      if (formData.username && formData.username !== user.username && canChangeUsername) {
        const usernameRes = await fetch('/api/profile/username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: formData.username })
        })
        if (!usernameRes.ok) {
          alert('Username is taken or invalid')
          setLoading(false)
          return
        }
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : null
        })
      })

      if (response.ok) {
        router.push('/profile')
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update profile')
      }
    } catch (error) {
      alert('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const hasUsername = !!user.username

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link href="/profile">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </Link>

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="yourname"
                  className="mt-2"
                  disabled={hasUsername && !canChangeUsername}
                />
                {hasUsername && !canChangeUsername && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 mt-1">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>

              {hasUsername && !canChangeUsername ? (
                <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
                  <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      You can change your username again in <strong>{daysUntilChange} days</strong>. Usernames can only be changed once every 14 days.
                    </span>
                  </p>
                </div>
              ) : hasUsername ? (
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                  <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      You can change your username now, but you won't be able to change it again for 14 days.
                    </span>
                  </p>
                </div>
              ) : null}

              {!hasUsername && formData.username && (
                <>
                  {usernameStatus.checking && (
                    <p className="text-sm text-gray-500 mt-1">Checking availability...</p>
                  )}
                  {usernameStatus.available === true && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <Check className="h-4 w-4" /> {usernameStatus.message}
                    </p>
                  )}
                  {usernameStatus.available === false && (
                    <p className="text-sm text-red-600 mt-1">{usernameStatus.message}</p>
                  )}
                </>
              )}

              {canChangeUsername && hasUsername && formData.username !== user.username && (
                <>
                  {usernameStatus.checking && (
                    <p className="text-sm text-gray-500 mt-1">Checking availability...</p>
                  )}
                  {usernameStatus.available === true && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <Check className="h-4 w-4" /> {usernameStatus.message}
                    </p>
                  )}
                  {usernameStatus.available === false && (
                    <p className="text-sm text-red-600 mt-1">{usernameStatus.message}</p>
                  )}
                </>
              )}
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Tell others about yourself... Share your journey, interests, and what you're working on!"
                rows={4}
                maxLength={500}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="college">College/University</Label>
                <Input
                  id="college"
                  value={formData.college}
                  onChange={(e) => handleChange('college', e.target.value)}
                  placeholder="e.g., IIT Delhi"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="currentYear">Current Year</Label>
                <select
                  id="currentYear"
                  value={formData.currentYear}
                  onChange={(e) => handleChange('currentYear', e.target.value)}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) => handleChange('graduationYear', e.target.value)}
                  placeholder="2025"
                  min="2020"
                  max="2035"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="City, Country"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Skills</Label>
              <p className="text-xs text-gray-500 mb-2">Add your technical skills, programming languages, and technologies</p>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="e.g., JavaScript, React, Python"
                  disabled={formData.skills.length >= 20}
                />
                <Button
                  type="button"
                  onClick={addSkill}
                  disabled={!newSkill.trim() || formData.skills.length >= 20}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{formData.skills.length}/20 skills</p>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-1 text-sm py-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Social Links</Label>
              <p className="text-xs text-gray-500 mb-3">Connect your social profiles to showcase your work</p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="linkedin" className="text-sm text-gray-600">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourname"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="github" className="text-sm text-gray-600">GitHub</Label>
                  <Input
                    id="github"
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    placeholder="https://github.com/yourname"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="leetcode" className="text-sm text-gray-600">LeetCode</Label>
                  <Input
                    id="leetcode"
                    type="url"
                    value={formData.socialLinks.leetcode}
                    onChange={(e) => handleSocialLinkChange('leetcode', e.target.value)}
                    placeholder="https://leetcode.com/yourname"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="portfolio" className="text-sm text-gray-600">Portfolio Website</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    value={formData.socialLinks.portfolio}
                    onChange={(e) => handleSocialLinkChange('portfolio', e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={loading || (usernameStatus.available === false && formData.username !== user.username)}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Link href="/profile">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
