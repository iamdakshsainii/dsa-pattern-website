import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getFullUserProfile } from "@/lib/db"
import ProfileEditForm from "@/components/profile/profile-edit-form"

export default async function EditProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const fullProfile = await getFullUserProfile(user.id)

  return (
    <ProfileEditForm
      user={{
        id: fullProfile.id,
        name: fullProfile.name,
        email: fullProfile.email
      }}
      profile={fullProfile.profile}
    />
  )
}
