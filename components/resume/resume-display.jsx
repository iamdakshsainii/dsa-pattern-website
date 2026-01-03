'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Trash2, Eye, Calendar, BarChart } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ResumeDisplay({ resume, onDelete }) {
  const [deleting, setDeleting] = useState(false)

  if (!resume) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No resume uploaded yet</p>
          <p className="text-xs text-gray-400">
            Upload your resume to share with recruiters
          </p>
        </div>
      </Card>
    )
  }

  const handleDownload = () => {
    window.open(resume.fileUrl, '_blank')
  }

  const handleView = () => {
    window.open(resume.fileUrl, '_blank')
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await fetch('/api/upload/resume', {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        if (onDelete) {
          onDelete()
        }
      }
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Resume</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Resume Info Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg truncate mb-1">
              {resume.fileName}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Uploaded {formatDate(resume.uploadedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>{resume.downloadCount || 0} downloads</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Keep your resume updated to improve your chances with recruiters
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your uploaded resume. You can upload a new one anytime.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  )
}
