"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ProfileAvatar from "./profile-avatar"
import AvatarUploadDialog from "./avatar-upload-dialog"
import { Edit, MapPin, GraduationCap, Calendar, Linkedin, Github, ExternalLink, Camera, ArrowLeft, FileText, Download, Eye, Code, Globe } from "lucide-react"

export default function ProfileView({ user, profile, completionPercentage, resume }) {
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const handleAvatarUpload = (url) => {
    setAvatarUrl(url)
    window.location.reload()
  }

  const hasAnySocialLinks = profile?.github || profile?.linkedin || profile?.leetcode || profile?.codeforces || profile?.website

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <ProfileAvatar
                src={avatarUrl}
                name={user.name}
                size="2xl"
              />
              <button
                onClick={() => setUploadDialogOpen(true)}
                className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{completionPercentage}%</span>
              </div>

              {completionPercentage < 100 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Complete your profile to unlock all features
                </p>
              )}

              <Link href="/profile/edit">
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              {profile?.bio ? (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No bio added yet. Tell others about yourself!
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No skills added yet
                </p>
              )}
            </Card>

            {hasAnySocialLinks && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Social Links</h2>
                <div className="space-y-3">
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <Github className="h-5 w-5" />
                      <span className="flex-1">GitHub</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span className="flex-1">LinkedIn</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {profile.leetcode && (
                    <a
                      href={profile.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                    >
                      <Code className="h-5 w-5" />
                      <span className="flex-1">LeetCode</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {profile.codeforces && (
                    <a
                      href={profile.codeforces}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                    >
                      <Code className="h-5 w-5" />
                      <span className="flex-1">Codeforces</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                      <span className="flex-1">Personal Website</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                </div>
              </Card>
            )}

            {resume && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Resume</h2>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{resume.fileName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(resume.fileUrl, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(resume.fileUrl, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Link href="/resume">
                  <Button variant="link" size="sm" className="mt-2 px-0">
                    Manage Resume
                  </Button>
                </Link>
              </Card>
            )}

            {profile?.currentRole && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Professional</h2>
                <div className="space-y-2">
                  <p className="font-medium text-lg">{profile.currentRole}</p>
                  {profile.company && (
                    <p className="text-gray-600 dark:text-gray-400">{profile.company}</p>
                  )}
                  {profile.experience && (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {profile.experience === '0' ? 'Student/Fresher' :
                       profile.experience === '1' ? '0-1 years experience' :
                       profile.experience === '2' ? '1-2 years experience' :
                       profile.experience === '3' ? '2-3 years experience' :
                       profile.experience === '4' ? '3-5 years experience' :
                       '5+ years experience'}
                    </p>
                  )}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="space-y-3">
                {profile?.college && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{profile.college}</p>
                    </div>
                  </div>
                )}
                {profile?.graduationYear && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Graduating in {profile.graduationYear}
                      </p>
                    </div>
                  </div>
                )}
                {!profile?.college && !profile?.graduationYear && (
                  <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                    No education info added
                  </p>
                )}
              </div>
            </Card>

            {profile?.location && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700 dark:text-gray-300">{profile.location}</p>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Member Since</h2>
              <p className="text-gray-700 dark:text-gray-300">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </Card>
          </div>
        </div>
      </div>

      <AvatarUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleAvatarUpload}
      />
    </div>
  )
}
