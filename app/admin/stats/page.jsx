import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import StatsPageClient from '@/components/admin/analytics/overview-client';

export const metadata = {
  title: 'Analytics Overview | Admin',
  description: 'Platform analytics and insights'
};

export default async function StatsPage() {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  return <StatsPageClient />;
}
