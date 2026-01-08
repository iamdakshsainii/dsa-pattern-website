import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import {
  getActiveEscalations,
  generateSmartInsights,
  resolveEscalation
} from '@/lib/auto-actions';

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [escalations, insights] = await Promise.all([
      getActiveEscalations(),
      generateSmartInsights()
    ]);

    return NextResponse.json({
      escalations,
      insights
    });
  } catch (error) {
    console.error('Auto-actions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch auto-actions data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, escalationId } = await request.json();

    if (action === 'resolve' && escalationId) {
      await resolveEscalation(escalationId, user.email);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auto-actions POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process auto-action' },
      { status: 500 }
    );
  }
}

