import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload avatar to Cloudinary
export async function uploadAvatar(file, userId) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'dsa-avatars',
      public_id: `user_${userId}`,
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload avatar')
  }
}

// Delete avatar from Cloudinary
export async function deleteAvatar(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId)
    return { success: true }
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete avatar')
  }
}

// Get optimized avatar URL
export function getAvatarUrl(publicId, size = 200) {
  if (!publicId) return null

  return cloudinary.url(publicId, {
    transformation: [
      { width: size, height: size, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  })
}

export default cloudinary

