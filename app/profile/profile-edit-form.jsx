"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Loader2, X } from "lucide-react"

export default function ProfileEditForm({ user, profile }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [newSkill, setNewSkill] = useState("")

  const [formData, setFormData] = useState({
    bio: profile?.bio || "",
    college: profile?.college || "",
    graduationYear: profile?.graduationYear || "",
    currentYear: profile?.currentYear || "",
    location: profile?.location || "",
    skills: profile?.skills || [],
    socialLinks: {
      linkedin: profile?.socialLinks?.linkedin || "",
      github: profile?.socialLinks?.github || "",
      leetcode: profile?.socialLinks?.leetcode || "",
      portfolio: profile?.socialLinks?.portfolio || "",
      twitter: profile?.socialLinks?.twitter || ""
    }
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill("")
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
    setSaving(true)

    try {
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
      console.error('Save error:', error)
      alert('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

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
            {/* Bio */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Tell others about yourself..."
                rows={4}
                maxLength={500}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Education */}
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
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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

            {/* Skills */}
            <div>
              <Label>Skills</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill (e.g., JavaScript)"
                  disabled={formData.skills.length >= 20}
                />
                <Button
                  type="button"
                  onClick={addSkill}
                  disabled={!newSkill.trim() || formData.skills.length >= 20}
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.skills.length}/20 skills
              </p>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
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

            {/* Social Links */}
            <div>
              <Label>Social Links</Label>
              <div className="space-y-3 mt-2">
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
                  <Label htmlFor="portfolio" className="text-sm text-gray-600">Portfolio</Label>
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

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
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
        </Card>
      </div>
    </div>
  )
}
