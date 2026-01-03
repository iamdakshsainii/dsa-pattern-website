"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Upload, X, Loader2 } from "lucide-react"

export default function AvatarUploadDialog({ open, onClose, onUpload }) {
  const [image, setImage] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [uploading, setUploading] = useState(false)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.src = url
    })

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', 0.95)
    })
  }

  const handleUpload = async () => {
    if (!image || !croppedAreaPixels) return

    try {
      setUploading(true)

      // Get cropped image blob
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels)

      // Convert blob to base64
      const reader = new FileReader()
      reader.readAsDataURL(croppedImageBlob)
      reader.onloadend = async () => {
        const base64data = reader.result

        // Upload to API
        const response = await fetch('/api/upload/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ image: base64data })
        })

        if (response.ok) {
          const data = await response.json()
          onUpload(data.avatarUrl)
          handleClose()
        } else {
          alert('Failed to upload avatar')
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setImage(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!image ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-primary hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-sm text-gray-600">Drop the image here...</p>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-2">
                    Drag & drop an image, or click to select
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setImage(null)}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Choose Different Image
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!image || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
