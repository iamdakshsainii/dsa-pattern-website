import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { getUserDetailedInfo, deleteUser } from '@/lib/db';
import { logActivity } from '@/lib/logger';
import { createNotification } from '@/lib/notifications';

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = params;
    const userInfo = await getUserDetailedInfo(userId);

    if (!userInfo) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userInfo);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = params;
    const userToDelete = await getUserDetailedInfo(userId);

    await deleteUser(userId);

    await logActivity({
      actor: user.email,
      actorType: 'admin',
      action: 'delete_user',
      resourceType: 'user',
      resourceId: userId,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent')
    });

    await createNotification(
      'user_deleted',
      'User Deleted',
      `User ${userToDelete?.name || 'Unknown'} (${userToDelete?.email || 'N/A'}) was deleted by admin`,
      {
        userId,
        deletedBy: user.email
      }
    );

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
