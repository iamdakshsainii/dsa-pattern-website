import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import UserAnalyticsClient from './users-client';

export const metadata = {
  title: 'User Analytics | Admin',
  description: 'Detailed user analytics and insights'
};

export default async function UserAnalyticsPage() {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  return <UserAnalyticsClient />;
}
