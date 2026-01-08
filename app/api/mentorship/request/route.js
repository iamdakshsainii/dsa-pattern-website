import { NextResponse } from 'next/server';
import { createMentorshipRequest } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, userName, userEmail, userPhone, type, subject, message } = body;

    if (!userName || !userEmail || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const mentorshipRequest = await createMentorshipRequest({
      userId: userId || null,
      userName,
      userEmail,
      userPhone,
      type: type || 'general',
      subject: subject || 'General Mentorship Request',
      message
    });

    return NextResponse.json({
      success: true,
      message: 'Mentorship request submitted successfully',
      request: mentorshipRequest
    });
  } catch (error) {
    console.error('Error creating mentorship request:', error);
    return NextResponse.json(
      { error: 'Failed to submit request' },
      { status: 500 }
    );
  }
}
