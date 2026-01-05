import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getFullUserProfile, updateUserProfile } from "@/lib/db"

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await getFullUserProfile(user.id)

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const completionFields = [
      profile.profile?.bio,
      profile.profile?.location,
      profile.profile?.college,
      profile.profile?.graduationYear,
      profile.profile?.currentRole,
      profile.profile?.avatar,
      profile.profile?.github,
      profile.profile?.linkedin,
      profile.profile?.skills?.length > 0 ? 'hasSkills' : null,
    ]

    const completed = completionFields.filter(field => field && field.toString().trim() !== '').length
    const completionPercentage = Math.round((completed / completionFields.length) * 100)

    return NextResponse.json({
      ...profile,
      completionPercentage
    })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const allowedFields = [
      'bio',
      'location',
      'college',
      'graduationYear',
      'currentRole',
      'company',
      'experience',
      'github',
      'linkedin',
      'leetcode',
      'codeforces',
      'website',
      'skills'
    ]

    const profileData = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'skills') {
          if (!Array.isArray(body[field])) {
            return NextResponse.json(
              { error: "Skills must be an array" },
              { status: 400 }
            )
          }
          profileData[field] = body[field].slice(0, 20)
        } else {
          const value = typeof body[field] === 'string'
            ? body[field].trim()
            : body[field]
          profileData[field] = value === '' ? null : value
        }
      }
    }

    const urlFields = ['github', 'linkedin', 'leetcode', 'codeforces', 'website']
    for (const field of urlFields) {
      if (profileData[field]) {
        try {
          new URL(profileData[field])
        } catch (e) {
          return NextResponse.json(
            { error: `Invalid URL for ${field}` },
            { status: 400 }
          )
        }
      }
    }

    if (profileData.graduationYear) {
      const year = parseInt(profileData.graduationYear)
      const currentYear = new Date().getFullYear()
      if (isNaN(year) || year < 1950 || year > currentYear + 10) {
        return NextResponse.json(
          { error: "Invalid graduation year" },
          { status: 400 }
        )
      }
    }

    if (profileData.experience) {
      const validExperience = ['0', '1', '2', '3', '4', '5']
      if (!validExperience.includes(profileData.experience)) {
        return NextResponse.json(
          { error: "Invalid experience value" },
          { status: 400 }
        )
      }
    }

    await updateUserProfile(user.id, profileData)

    const updatedProfile = await getFullUserProfile(user.id)

    return NextResponse.json({
      success: true,
      profile: updatedProfile
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await updateUserProfile(user.id, {
      bio: null,
      location: null,
      college: null,
      graduationYear: null,
      currentRole: null,
      company: null,
      experience: null,
      github: null,
      linkedin: null,
      leetcode: null,
      codeforces: null,
      website: null,
      avatar: null,
      skills: []
    })

    return NextResponse.json({
      success: true,
      message: "Profile reset successfully"
    })
  } catch (error) {
    console.error("Delete profile error:", error)
    return NextResponse.json(
      { error: "Failed to reset profile" },
      { status: 500 }
    )
  }
}
