
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import QuizAnalyticsClient from './quizzes-client';

export const metadata = {
  title: 'Quiz Analytics | Admin',
  description: 'Detailed quiz performance analytics'
};

export default async function QuizAnalyticsPage() {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  return <QuizAnalyticsClient />;
}
