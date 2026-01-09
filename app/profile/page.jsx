import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getFullUserProfile, calculateProfileCompletion, getUserById } from "@/lib/db";
import ProfileView from "@/components/profile/profile-view";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const dbUser = await getUserById(user.id);
  const fullProfile = await getFullUserProfile(user.id);

  if (!fullProfile) {
    redirect("/auth/login");
  }

  const completion = calculateProfileCompletion(fullProfile?.profile);

  return (
    <>
      <ProfileView
        user={{
          id: fullProfile.id,
          name: fullProfile.name,
          email: fullProfile.email,
          username: dbUser.username || null,
          createdAt: fullProfile.createdAt || new Date(),
        }}
        profile={fullProfile.profile}
        completionPercentage={completion}
        resume={fullProfile.resume}
      />

      <div className="container mx-auto px-4 max-w-6xl mt-6">
        <Link href="/profile/certificates">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🏆</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Your Certificates</h3>
                  <p className="text-sm text-muted-foreground">
                    View all earned certificates from completed roadmaps
                  </p>
                </div>
              </div>
              <Button variant="ghost">View All →</Button>
            </div>
          </Card>
        </Link>
      </div>
    </>
  );
}
