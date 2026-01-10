import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { getAppealById, updateAppealStatus, addAppealMessage, unblockUser } from '@/lib/db';
import { createNotification } from '@/lib/notifications';

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { appealId } = await params;
    const appeal = await getAppealById(appealId);

    if (!appeal) {
      return NextResponse.json({ error: 'Appeal not found' }, { status: 404 });
    }

    return NextResponse.json(appeal);
  } catch (error) {
    console.error('Error fetching appeal:', error);
    return NextResponse.json({ error: 'Failed to fetch appeal' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { appealId } = await params;
    const body = await request.json();
    const { action, message } = body;

    const appeal = await getAppealById(appealId);
    if (!appeal) {
      return NextResponse.json({ error: 'Appeal not found' }, { status: 404 });
    }

    if (action === 'approve') {
      await unblockUser(appeal.appeal.userId);
      await updateAppealStatus(appealId, 'approved', message);

      await createNotification(
        'appeal_approved',
        'Appeal Approved',
        `Appeal from ${appeal.appeal.userName} has been approved`,
        { appealId, userId: appeal.appeal.userId }
      );

      return NextResponse.json({ success: true, message: 'User unblocked' });
    }

    if (action === 'reject') {
      await updateAppealStatus(appealId, 'rejected', message);

      await createNotification(
        'appeal_rejected',
        'Appeal Rejected',
        `Appeal from ${appeal.appeal.userName} has been rejected`,
        { appealId, userId: appeal.appeal.userId }
      );

      return NextResponse.json({ success: true, message: 'Appeal rejected' });
    }

    if (action === 'reply') {
      if (!message || !message.trim()) {
        return NextResponse.json({ error: 'Message required' }, { status: 400 });
      }

      await addAppealMessage(appealId, {
        sender: 'admin',
        senderName: user.name || user.email,
        senderEmail: user.email,
        message,
        sentAt: new Date()
      });

      await updateAppealStatus(appealId, 'in_review', null);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing appeal:', error);
    return NextResponse.json({ error: 'Failed to process appeal' }, { status: 500 });
  }
}
