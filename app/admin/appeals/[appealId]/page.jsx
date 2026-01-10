import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { redirect } from 'next/navigation';
import { getAppealById } from '@/lib/db';
import AppealDetailClient from '@/components/admin/appeals/appeal-detail-client';

export default async function AppealDetailPage({ params }) {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  const { appealId } = await params;
  const appealData = await getAppealById(appealId);

  if (!appealData) {
    redirect('/admin/appeals');
  }

  return (
    <AppealDetailClient
      appealData={appealData}
      currentAdmin={user}
    />
  );
}
