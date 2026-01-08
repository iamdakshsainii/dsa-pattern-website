import { NextResponse } from 'next/server';
import { markAllAsRead } from '@/lib/notifications';

export async function POST() {
  try {
    await markAllAsRead();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking all as read:', error);
    return NextResponse.json({ error: 'Failed to mark all as read' }, { status: 500 });
  }
}
