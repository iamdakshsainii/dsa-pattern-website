'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Upload, Loader2, X, Camera } from 'lucide-react'
import ProfileAvatar from './profile-avatar'
import { useRouter } from 'next/navigation'

export default function ProfileAvatarUpload({ currentAvatar, userName }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentAvatar)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef(null)
  const router = useRouter()

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setError('')
    setUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Convert to base64 for upload
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Upload to API
      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ image: base64 }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Avatar updated successfully!')
        setPreview(data.avatarUrl)

        // Refresh the page to show new avatar everywhere
        setTimeout(() => {
          router.refresh()
          setSuccess('')
        }, 1500)
      } else {
        setError(data.error || 'Failed to upload avatar')
        setPreview(currentAvatar) // Revert preview on error
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload avatar. Please try again.')
      setPreview(currentAvatar) // Revert preview on error
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    if (!confirm('Are you sure you want to remove your avatar?')) return

    setUploading(true)
    setError('')

    try {
      const response = await fetch('/api/upload/avatar', {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Avatar removed successfully!')
        setPreview(null)

        setTimeout(() => {
          router.refresh()
          setSuccess('')
        }, 1500)
      } else {
        setError(data.error || 'Failed to remove avatar')
      }
    } catch (err) {
      console.error('Remove error:', err)
      setError('Failed to remove avatar. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        {/* Avatar Preview */}
        <div className="relative">
          <ProfileAvatar
            src={preview}
            name={userName}
            size="2xl"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
              Profile Picture
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleButtonClick}
              disabled={uploading}
              size="sm"
              variant="outline"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </>
              )}
            </Button>

            {preview && (
              <Button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={uploading}
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}
    </div>
  )
}
