import { getCurrentUser } from '@/lib/auth';
import { getAllUsersWithStats } from '@/lib/db';
import UserManagementClient from '@/components/admin/users/user-management-client';

export const metadata = {
  title: 'User Management | Admin',
  description: 'Manage all platform users'
};

export default async function UsersPage({ searchParams }) {
  const currentUser = await getCurrentUser();
  const params = await searchParams;

  const filters = {
    search: params.search || '',
    status: params.status || 'all',
    page: parseInt(params.page || '1')
  };

  const data = await getAllUsersWithStats(filters);

  return (
    <UserManagementClient
      initialData={data}
      currentAdmin={currentUser}
      filters={filters}
    />
  );
}
