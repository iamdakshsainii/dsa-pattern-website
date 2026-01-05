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
   if (!fullProfile) {
    redirect("/auth/login")
  }
  const completion = calculateProfileCompletion(fullProfile?.profile)

  return (
    <ProfileView
      user={{
        id: fullProfile._id,
        name: fullProfile.name,
        email: fullProfile.email,
        createdAt: user.createdAt || new Date()
      }}
      profile={fullProfile.profile}
      completionPercentage={completion}
      resume={fullProfile.resume}
    />
  )
}
