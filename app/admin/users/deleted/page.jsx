import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { redirect } from 'next/navigation';
import { getDeletedUsers } from '@/lib/db';
import DeletedUsersClient from '@/components/admin/users/deleted-users-client';

export const metadata = {
  title: 'Deleted Users | Admin'
};

export default async function DeletedUsersPage({ searchParams }) {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  const params = await searchParams;
  const filters = {
    search: params.search || '',
    page: parseInt(params.page || '1')
  };

  const data = await getDeletedUsers(filters);

  return (
    <DeletedUsersClient
      initialData={data}
      filters={filters}
    />
  );
}
