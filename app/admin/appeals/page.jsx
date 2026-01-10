import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { redirect } from 'next/navigation';
import { getAllAppeals, getAppealStats } from '@/lib/db';
import AppealsClient from '@/components/admin/appeals/appeals-client';

export const metadata = {
  title: 'Appeals | Admin',
  description: 'Review user appeals'
};

export default async function AppealsPage({ searchParams }) {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  const params = await searchParams;

  const filters = {
    status: params.status || 'all',
    search: params.search || '',
    page: parseInt(params.page || '1')
  };

  const [data, stats] = await Promise.all([
    getAllAppeals(filters),
    getAppealStats()
  ]);

  return (
    <AppealsClient
      initialData={data}
      stats={stats}
      filters={filters}
    />
  );
}
