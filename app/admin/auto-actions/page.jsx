import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import AutoActionsClient from './auto-actions-client';

export const metadata = {
  title: 'Auto-Actions | Admin',
  description: 'Automated escalations and smart insights'
};

export default async function AutoActionsPage() {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  return <AutoActionsClient />;
}
