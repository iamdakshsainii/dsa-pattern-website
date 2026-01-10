import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import BugReportsClient from './bug-reports-client';

export const metadata = {
  title: 'Bug Reports | Admin',
  description: 'Manage user bug reports'
};

export default async function BugReportsPage() {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  return (
    <div className="p-8">
      <BugReportsClient />
    </div>
  );
}
