import { notFound } from "next/navigation";
import { getUserByUsername, getFullUserProfile, getUserStats, getUserCertificates, getAllQuizResults, getStreakData } from "@/lib/db";
import PublicProfileView from "@/components/profile/profile-view";

export async function generateMetadata({ params }) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    return { title: "User Not Found" };
  }

  const profile = await getFullUserProfile(user._id);

  return {
    title: `${user.name} (@${username}) - DSA Patterns Platform`,
    description: profile?.profile?.bio || `Check out ${user.name}'s coding profile`,
    openGraph: {
      title: `${user.name} (@${username})`,
      description: profile?.profile?.bio || `Check out ${user.name}'s coding profile`,
      images: [profile?.profile?.avatar || "/default-avatar.png"],
    },
  };
}

export default async function PublicProfilePage({ params }) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  const [profile, stats, certificates, quizResults, streakData] = await Promise.all([
    getFullUserProfile(user._id),
    getUserStats(user._id.toString()),
    getUserCertificates(user._id.toString()),
    getAllQuizResults(user._id.toString()),
    getStreakData(user._id.toString()),
  ]);

  const quizStats = {
    total: quizResults.length,
    passed: quizResults.filter(q => q.passed).length,
    avgScore: quizResults.length > 0
      ? Math.round(quizResults.reduce((sum, q) => sum + (q.percentage || 0), 0) / quizResults.length)
      : 0,
  };

  const serializedUser = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    username: user.username,
    created_at: user.created_at?.toISOString() || null,
    isBlocked: user.isBlocked || false,
  };

  return (
    <PublicProfileView
      user={serializedUser}
      profile={profile}
      stats={stats}
      certificates={certificates}
      quizStats={quizStats}
      streak={streakData}
    />
  );
}
