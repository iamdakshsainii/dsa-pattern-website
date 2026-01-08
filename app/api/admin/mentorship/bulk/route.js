import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { bulkUpdateMentorshipStatus } from '@/lib/db';

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { action, requestIds } = body;

    if (!requestIds || requestIds.length === 0) {
      return NextResponse.json({ error: 'No requests selected' }, { status: 400 });
    }

    const validStatuses = ['pending', 'replied', 'closed'];
    if (!validStatuses.includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const result = await bulkUpdateMentorshipStatus(requestIds, action);

    return NextResponse.json({
      success: true,
      message: `${result.modified} requests updated`,
      modified: result.modified
    });
  } catch (error) {
    console.error('Error bulk updating requests:', error);
    return NextResponse.json({ error: 'Failed to update requests' }, { status: 500 });
  }
}
