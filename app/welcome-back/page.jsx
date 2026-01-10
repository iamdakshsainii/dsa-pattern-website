import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import WelcomeBackClient from '@/components/welcome-back-client';
import { getLatestAppealReply } from '@/lib/db';

export const metadata = {
  title: 'Welcome Back'
};

export default async function WelcomeBackPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Get the latest appeal reply for this user
  const appealReply = await getLatestAppealReply(user.id);

  return (
    <WelcomeBackClient
      user={user}
      adminReply={appealReply?.message || "Your appeal has been reviewed and approved. Welcome back!"}
      adminName={appealReply?.adminName || "Admin Team"}
    />
  );
}
