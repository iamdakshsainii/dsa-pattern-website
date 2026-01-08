
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import MentorshipAnalyticsClient from './mentorship-client';

export const metadata = {
  title: 'Mentorship Analytics | Admin',
  description: 'Mentorship request insights and performance'
};

export default async function MentorshipAnalyticsPage() {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  return <MentorshipAnalyticsClient />;
}
