import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getFullUserProfile, getUserById } from "@/lib/db";
import ProfileEditForm from "@/components/profile/profile-edit-form";

export default async function ProfileEditPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const dbUser = await getUserById(user.id);
  const fullProfile = await getFullUserProfile(user.id);

  return (
    <ProfileEditForm
      user={{
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        username: dbUser.username || null,
      }}
      profile={fullProfile?.profile}
    />
  );
}
