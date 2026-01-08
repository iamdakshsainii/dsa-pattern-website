import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import {
  getMentorshipRequestVolume,
  getMentorshipResponseTimeStats,
  getMentorshipCommonTopics,
  getMentorshipResolutionRate,
  getMentorshipPeakTimes
} from '@/lib/db';

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [volume, responseTime, topics, resolution, peakTimes] = await Promise.all([
      getMentorshipRequestVolume(30),
      getMentorshipResponseTimeStats(),
      getMentorshipCommonTopics(),
      getMentorshipResolutionRate(),
      getMentorshipPeakTimes()
    ]);

    return NextResponse.json({
      volume,
      responseTime,
      topics,
      resolution,
      peakTimes
    });
  } catch (error) {
    console.error('Mentorship analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentorship analytics' },
      { status: 500 }
    );
  }
}
