
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import {
  getQuizCompletionRates,
  getWeakTopicsAnalysis,
  getQuizTimeAnalysis,
  getAttemptDistribution
} from '@/lib/db';

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [completionRates, weakTopics, timeAnalysis, attemptDistribution] = await Promise.all([
      getQuizCompletionRates(),
      getWeakTopicsAnalysis(),
      getQuizTimeAnalysis(),
      getAttemptDistribution()
    ]);

    return NextResponse.json({
      completionRates,
      weakTopics,
      timeAnalysis,
      attemptDistribution
    });
  } catch (error) {
    console.error('Quiz analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz analytics' },
      { status: 500 }
    );
  }
}
