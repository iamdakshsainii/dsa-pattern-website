import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import {
  getUserRetentionData,
  getUserEngagementHeatmap,
  getTopLearners,
  getChurnRiskUsers,
  getUserGeographicDistribution
} from '@/lib/db';

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [retention, heatmap, topLearners, churnRisk, geography] = await Promise.all([
      getUserRetentionData(),
      getUserEngagementHeatmap(),
      getTopLearners(),
      getChurnRiskUsers(),
      getUserGeographicDistribution()
    ]);

    return NextResponse.json({
      retention,
      heatmap,
      topLearners,
      churnRisk,
      geography
    });
  } catch (error) {
    console.error('User analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user analytics' },
      { status: 500 }
    );
  }
}
