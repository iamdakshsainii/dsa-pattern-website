import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { blockUser, unblockUser } from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = params;
    const body = await request.json();
    const { action, reason, blockedBy } = body;

    if (action === 'block') {
      if (!reason || !reason.trim()) {
        return NextResponse.json({ error: 'Reason is required for blocking' }, { status: 400 });
      }
      await blockUser(userId, reason, blockedBy);
    } else if (action === 'unblock') {
      await unblockUser(userId);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: action === 'block' ? 'User blocked successfully' : 'User unblocked successfully'
    });
  } catch (error) {
    console.error('Error updating user block status:', error);
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
  }
}
