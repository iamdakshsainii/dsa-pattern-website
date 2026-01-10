import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import {
  getAnalyticsOverview,
  getUserGrowthData,
  getActiveUsersData,
  getQuizPerformanceByRoadmap,
  getPopularRoadmaps
} from '@/lib/db';

export async function GET(request) {
  try {
    const user = await getCurrentUser();

    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const [overview, userGrowth, activeUsers, quizPerformance, popularRoadmaps] = await Promise.all([
      getAnalyticsOverview(),
      getUserGrowthData(days),
      getActiveUsersData(days),
      getQuizPerformanceByRoadmap(),
      getPopularRoadmaps(5)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview,
        userGrowth,
        activeUsers,
        quizPerformance,
        popularRoadmaps
      }
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: error.message },
      { status: 500 }
    );
  }
}
