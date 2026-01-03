import { z } from 'zod'

// Profile validation schema
export const profileSchema = z.object({
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional().nullable(),
  college: z.string().max(200, 'College name too long').optional().nullable(),
  graduationYear: z.number().int().min(2020).max(2035).optional().nullable(),
  currentYear: z.enum(['1st', '2nd', '3rd', '4th', 'Graduate']).optional().nullable(),
  location: z.string().max(100, 'Location too long').optional().nullable(),
  skills: z.array(z.string()).max(20, 'Maximum 20 skills allowed').optional(),
  socialLinks: z.object({
    linkedin: z.string().url('Invalid LinkedIn URL').optional().nullable().or(z.literal('')),
    github: z.string().url('Invalid GitHub URL').optional().nullable().or(z.literal('')),
    leetcode: z.string().url('Invalid LeetCode URL').optional().nullable().or(z.literal('')),
    portfolio: z.string().url('Invalid Portfolio URL').optional().nullable().or(z.literal('')),
    twitter: z.string().url('Invalid Twitter URL').optional().nullable().or(z.literal(''))
  }).optional()
})

// Validate profile data
export function validateProfile(data) {
  try {
    const validated = profileSchema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    return {
      success: false,
      errors: error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    }
  }
}

// Calculate profile completion percentage
export function calculateCompletion(profile) {
  if (!profile) return 0

  const fields = {
    avatar: !!profile.avatar,
    bio: !!profile.bio,
    college: !!profile.college,
    graduationYear: !!profile.graduationYear,
    currentYear: !!profile.currentYear,
    location: !!profile.location,
    skills: profile.skills && profile.skills.length > 0,
    linkedin: !!profile.socialLinks?.linkedin,
    github: !!profile.socialLinks?.github,
    leetcode: !!profile.socialLinks?.leetcode,
    portfolio: !!profile.socialLinks?.portfolio
  }

  const completedFields = Object.values(fields).filter(Boolean).length
  const totalFields = Object.keys(fields).length

  return Math.round((completedFields / totalFields) * 100)
}

export default profileSchema
