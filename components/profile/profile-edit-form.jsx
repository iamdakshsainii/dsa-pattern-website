'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import ProfileAvatarUpload from './profile-avatar-upload'
import SkillsInput from './skills-input'

export default function ProfileEditForm({ user, profile }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    bio: profile?.bio || '',
    location: profile?.location || '',
    college: profile?.college || '',
    graduationYear: profile?.graduationYear || '',
    currentRole: profile?.currentRole || '',
    company: profile?.company || '',
    experience: profile?.experience || '',
    github: profile?.github || '',
    linkedin: profile?.linkedin || '',
    leetcode: profile?.leetcode || '',
    codeforces: profile?.codeforces || '',
    website: profile?.website || '',
    skills: profile?.skills || [],
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Profile updated successfully!')
        setTimeout(() => {
          router.push('/profile')
          router.refresh()
        }, 1500)
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/profile">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Update your information
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
            <ProfileAvatarUpload
              currentAvatar={profile?.avatar}
              userName={user.name}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Skills</h2>
            <SkillsInput
              value={formData.skills}
              onChange={(skills) => handleChange('skills', skills)}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Education</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="college">College/University</Label>
                <Input
                  id="college"
                  placeholder="e.g., MIT"
                  value={formData.college}
                  onChange={(e) => handleChange('college', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Select
                  value={formData.graduationYear}
                  onValueChange={(value) => handleChange('graduationYear', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Professional Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentRole">Current Role</Label>
                <Input
                  id="currentRole"
                  placeholder="e.g., Software Engineer"
                  value={formData.currentRole}
                  onChange={(e) => handleChange('currentRole', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="e.g., Google"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) => handleChange('experience', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Student/Fresher</SelectItem>
                    <SelectItem value="1">0-1 years</SelectItem>
                    <SelectItem value="2">1-2 years</SelectItem>
                    <SelectItem value="3">2-3 years</SelectItem>
                    <SelectItem value="4">3-5 years</SelectItem>
                    <SelectItem value="5">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Social Links</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  placeholder="https://github.com/username"
                  value={formData.github}
                  onChange={(e) => handleChange('github', e.target.value)}
                  type="url"
                />
              </div>

              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  type="url"
                />
              </div>

              <div>
                <Label htmlFor="leetcode">LeetCode</Label>
                <Input
                  id="leetcode"
                  placeholder="https://leetcode.com/username"
                  value={formData.leetcode}
                  onChange={(e) => handleChange('leetcode', e.target.value)}
                  type="url"
                />
              </div>

              <div>
                <Label htmlFor="codeforces">Codeforces</Label>
                <Input
                  id="codeforces"
                  placeholder="https://codeforces.com/profile/username"
                  value={formData.codeforces}
                  onChange={(e) => handleChange('codeforces', e.target.value)}
                  type="url"
                />
              </div>

              <div>
                <Label htmlFor="website">Personal Website</Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  type="url"
                />
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
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
      </div>
    </div>
  )
}
