import { getCurrentUser } from '@/lib/auth';
import { getMentorshipRequestById } from '@/lib/db';
import { notFound } from 'next/navigation';
import RequestDetailClient from '@/components/admin/mentorship/request-detail-client';

export default async function RequestDetailPage({ params }) {
  const currentUser = await getCurrentUser();
  const { requestId } = params;

  const data = await getMentorshipRequestById(requestId);

  if (!data) {
    notFound();
  }

  return (
    <RequestDetailClient
      request={data.request}
      user={data.user}
      currentAdmin={currentUser}
    />
  );
}
