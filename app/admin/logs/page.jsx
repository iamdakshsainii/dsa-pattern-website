import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import ActivityLogsClient from './logs-client';

export const metadata = {
  title: 'Activity Logs | Admin',
  description: 'Audit trail of all admin and user actions'
};

export default async function ActivityLogsPage() {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  return <ActivityLogsClient />;
}
