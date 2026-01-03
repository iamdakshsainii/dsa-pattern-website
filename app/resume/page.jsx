'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from 'lucide-react'
import ResumeUploadCard from '@/components/resume/resume-upload-card'
import ResumeDisplay from '@/components/resume/resume-display'

export default function ResumePage() {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResume()
  }, [])

  const fetchResume = async () => {
    try {
      const response = await fetch('/api/upload/resume', {
        credentials: 'include',
        cache: 'no-store'
      })

      if (response.ok) {
        const data = await response.json()
        setResume(data.resume)
      } else if (response.status === 404) {
        setResume(null)
      }
    } catch (error) {
      console.error('Failed to fetch resume:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = (data) => {
    setResume({
      fileName: data.fileName,
      fileUrl: data.resumeUrl,
      uploadedAt: new Date(),
      downloadCount: 0
    })
  }

  const handleDelete = () => {
    setResume(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto flex h-16 items-center gap-4 px-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Resume Manager</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container max-w-4xl mx-auto p-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💼 Keep your resume updated and ready to share with recruiters. Your resume will be visible on your profile.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6">
          {!resume ? (
            <ResumeUploadCard onUploadSuccess={handleUploadSuccess} />
          ) : (
            <>
              <ResumeDisplay resume={resume} onDelete={handleDelete} />
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Upload New Resume</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Uploading a new resume will replace your current one.
                </p>
                <ResumeUploadCard onUploadSuccess={handleUploadSuccess} />
              </div>
            </>
          )}
        </div>

        {/* Resume Tips */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border">
          <h3 className="font-semibold mb-3">📝 Resume Best Practices</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>✅ <strong>Keep it concise:</strong> 1-2 pages maximum</p>
            <p>✅ <strong>Use action verbs:</strong> "Developed", "Implemented", "Optimized"</p>
            <p>✅ <strong>Quantify achievements:</strong> Include numbers and percentages</p>
            <p>✅ <strong>Tailor for each role:</strong> Highlight relevant skills</p>
            <p>✅ <strong>Include keywords:</strong> Match job descriptions</p>
            <p>✅ <strong>Proofread carefully:</strong> No typos or errors</p>
          </div>
        </div>
      </div>
    </div>
  )
}
