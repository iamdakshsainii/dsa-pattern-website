import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { updateAdminNotes, getUserById } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = params;
    const targetUser = await getUserById(userId);

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      notes: targetUser.adminNotes || '',
      updatedAt: targetUser.adminNotesUpdatedAt || null
    });
  } catch (error) {
    console.error('Error fetching admin notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = params;
    const body = await request.json();
    const { notes } = body;

    if (notes === undefined) {
      return NextResponse.json({ error: 'Notes content is required' }, { status: 400 });
    }

    const result = await updateAdminNotes(userId, notes);

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to update notes' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin notes updated successfully',
      notes
    });
  } catch (error) {
    console.error('Error updating admin notes:', error);
    return NextResponse.json({ error: 'Failed to update notes' }, { status: 500 });
  }
}
