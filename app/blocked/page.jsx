import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import BlockedPageClient from '@/components/blocked-page-client';

export const metadata = {
  title: 'Account Suspended'
};

export default async function BlockedPage({ searchParams }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const params = await searchParams;
  const reason = params.reason || 'Your account has been suspended';
  const blockedDate = params.date || null;

  return (
    <BlockedPageClient
      user={user}
      reason={reason}
      blockedDate={blockedDate}
    />
  );
}
