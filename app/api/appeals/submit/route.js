import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createAppeal } from '@/lib/db';
import { createNotification } from '@/lib/notifications';

export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, userName, userEmail, message, blockReason } = body;

    if (!message || message.length < 50) {
      return NextResponse.json(
        { error: 'Message must be at least 50 characters' },
        { status: 400 }
      );
    }

    const appeal = await createAppeal({
      userId,
      userName,
      userEmail,
      message,
      blockReason,
      status: 'pending',
      submittedAt: new Date()
    });

    // Notify all admins
    await createNotification(
      'appeal_submitted',
      'New Appeal Submitted',
      `${userName} (${userEmail}) has submitted an appeal`,
      {
        appealId: appeal._id.toString(),
        userId,
        userName,
        userEmail
      }
    );

    return NextResponse.json({
      success: true,
      appealId: appeal._id.toString()
    });
  } catch (error) {
    console.error('Error submitting appeal:', error);
    return NextResponse.json(
      { error: 'Failed to submit appeal' },
      { status: 500 }
    );
  }
}
