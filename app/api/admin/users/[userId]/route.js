import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { getUserDetailedInfo, deleteUser, moveUserToDeletedLog } from '@/lib/db';
import { logActivity } from '@/lib/logger';
import { createNotification } from '@/lib/notifications';

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = await params;
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

    const { userId } = await params;
    const body = await request.json();
    const { reason } = body;

    const userToDelete = await getUserDetailedInfo(userId);

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Move to deleted_users log BEFORE deletion
    await moveUserToDeletedLog(
      userId,
      reason || 'No reason provided',
      user.email
    );

    // Now delete from all collections
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
      `User ${userToDelete?.user?.name || 'Unknown'} (${userToDelete?.user?.email || 'N/A'}) was deleted by admin`,
      {
        userId,
        deletedBy: user.email,
        reason
      }
    );

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
