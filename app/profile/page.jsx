import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getFullUserProfile, calculateProfileCompletion } from "@/lib/db"
import ProfileView from "@/components/profile/profile-view"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const fullProfile = await getFullUserProfile(user.id)
  const completion = calculateProfileCompletion(fullProfile?.profile)

  return (
    <ProfileView
      user={{
        id: fullProfile.id,
        name: fullProfile.name,
        email: fullProfile.email,
        createdAt: fullProfile.createdAt
      }}
      profile={fullProfile.profile}
      completionPercentage={completion}
      resume={fullProfile.resume}
    />
  )
}
