import { getCurrentUser } from '@/lib/auth';
import { getUserDetailedInfo, getUserActivityTimeline } from '@/lib/db';
import { notFound } from 'next/navigation';
import UserDetailClient from '@/components/admin/users/user-detail-client';

export default async function UserDetailPage({ params }) {
  const currentUser = await getCurrentUser();
  const { userId } = await params;

  const [userInfo, timeline] = await Promise.all([
    getUserDetailedInfo(userId),
    getUserActivityTimeline(userId, 50)
  ]);

  if (!userInfo) {
    notFound();
  }

  return (
    <UserDetailClient
      userInfo={userInfo}
      timeline={timeline}
      currentAdmin={currentUser}
    />
  );
}
