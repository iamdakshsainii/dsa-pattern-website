import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { updateUserAttempts } from '@/lib/db';

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = params;
    const body = await request.json();
    const { roadmapId, attempts } = body;

    if (!roadmapId) {
      return NextResponse.json({ error: 'Roadmap ID is required' }, { status: 400 });
    }

    if (attempts === undefined || attempts === null) {
      return NextResponse.json({ error: 'Attempts count is required' }, { status: 400 });
    }

    const attemptsNum = parseInt(attempts);
    if (isNaN(attemptsNum) || attemptsNum < 0) {
      return NextResponse.json({ error: 'Invalid attempts count' }, { status: 400 });
    }

    await updateUserAttempts(userId, roadmapId, attemptsNum);

    return NextResponse.json({
      success: true,
      message: 'Quiz attempts updated successfully',
      attempts: attemptsNum
    });
  } catch (error) {
    console.error('Error updating user attempts:', error);
    return NextResponse.json({ error: 'Failed to update attempts' }, { status: 500 });
  }
}
