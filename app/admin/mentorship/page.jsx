import { getCurrentUser } from '@/lib/auth';
import { getAllMentorshipRequests, getMentorshipStats } from '@/lib/db';
import MentorshipClient from '@/components/admin/mentorship/mentorship-client';

export const metadata = {
  title: 'Mentorship Requests | Admin',
  description: 'Manage mentorship requests'
};

export default async function MentorshipPage({ searchParams }) {
  const currentUser = await getCurrentUser();
  const params = await searchParams;

  const filters = {
    search: params.search || '',
    status: params.status || 'all',
    type: params.type || 'all',
    page: parseInt(params.page || '1')
  };

  const [data, stats] = await Promise.all([
    getAllMentorshipRequests(filters),
    getMentorshipStats()
  ]);

  return (
    <MentorshipClient
      initialData={data}
      stats={stats}
      currentAdmin={currentUser}
      filters={filters}
    />
  );
}
