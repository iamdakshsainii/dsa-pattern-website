import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import SettingsPageClient from './settings-client';

export const metadata = {
  title: 'Settings | Admin',
  description: 'Platform configuration'
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }
  return <SettingsPageClient />;
}
