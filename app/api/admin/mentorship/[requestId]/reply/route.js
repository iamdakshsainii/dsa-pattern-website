import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { addMentorshipReply } from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { requestId } = params;
    const body = await request.json();
    const { message, adminEmail, adminName } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Reply message is required' }, { status: 400 });
    }

    const result = await addMentorshipReply(requestId, {
      message: message.trim(),
      adminEmail: adminEmail || user.email,
      adminName: adminName || user.name || user.email.split('@')[0]
    });

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully'
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}
