'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, X, AlertCircle, Loader2 } from 'lucide-react'

export default function ResumeUploadCard({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null)

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
      } else {
        setError('Please upload a PDF file')
      }
      return
    }

    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading
  })

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)
      setError(null)
      setUploadProgress(0)

      // Convert file to base64
      const reader = new FileReader()
      reader.readAsDataURL(selectedFile)

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 50 // First 50% for reading
          setUploadProgress(progress)
        }
      }

      reader.onload = async () => {
        const base64data = reader.result

        setUploadProgress(50) // Reading complete

        // Upload to API
        const response = await fetch('/api/upload/resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            file: base64data,
            fileName: selectedFile.name
          })
        })

        setUploadProgress(90)

        if (response.ok) {
          const data = await response.json()
          setUploadProgress(100)

          // Success callback
          if (onUploadSuccess) {
            onUploadSuccess(data)
          }

          // Reset after short delay
          setTimeout(() => {
            setSelectedFile(null)
            setUploadProgress(0)
            setUploading(false)
          }, 1000)
        } else {
          const error = await response.json()
          setError(error.error || 'Failed to upload resume')
          setUploading(false)
          setUploadProgress(0)
        }
      }

      reader.onerror = () => {
        setError('Failed to read file')
        setUploading(false)
        setUploadProgress(0)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Failed to upload resume')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    setError(null)
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Upload Resume</h3>

      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-900'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">Drop your resume here...</p>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Drag & drop your resume, or click to select
              </p>
              <p className="text-xs text-gray-500">
                PDF only, up to 5MB
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Selected File Preview */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <FileText className="h-8 w-8 text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            {!uploading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelectedFile}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Uploading...</span>
                <span className="font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Resume
              </>
            )}
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          💡 Resume Tips:
        </p>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Keep it to 1-2 pages maximum</li>
          <li>• Include your contact information</li>
          <li>• Highlight technical skills and projects</li>
          <li>• Use action verbs and quantify achievements</li>
        </ul>
      </div>
    </Card>
  )
}
