import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { getAllActivityLogs } from '@/lib/db';
import { getActivityStats } from '@/lib/logger';

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const filters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
      action: searchParams.get('action') || null,
      resourceType: searchParams.get('resourceType') || null,
      actor: searchParams.get('actor') || null,
      startDate: searchParams.get('startDate') || null,
      endDate: searchParams.get('endDate') || null
    };

    const [data, stats] = await Promise.all([
      getAllActivityLogs(filters),
      getActivityStats()
    ]);

    return NextResponse.json({
      ...data,
      stats
    });
  } catch (error) {
    console.error('Activity logs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}
