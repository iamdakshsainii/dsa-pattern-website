import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { getAllUsersWithStats } from '@/lib/db';

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { filters = {}, userIds = [] } = body;

    let usersToExport = [];

    if (userIds.length > 0) {
      const allData = await getAllUsersWithStats({ ...filters, page: 1 });
      usersToExport = allData.users.filter(u => userIds.includes(u._id));
    } else {
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const data = await getAllUsersWithStats({ ...filters, page });
        usersToExport.push(...data.users);
        hasMore = data.pagination.hasMore;
        page++;

        if (page > 100) break;
      }
    }

    const csvHeader = 'Name,Email,Join Date,Status,Roadmaps,Quizzes,Pass Rate,User ID\n';
    const csvRows = usersToExport.map(u => {
      const passRate = u.stats?.quizzes > 0
        ? Math.round((u.stats.passedQuizzes || 0) / u.stats.quizzes * 100)
        : 0;

      return [
        `"${(u.name || 'No Name').replace(/"/g, '""')}"`,
        `"${u.email.replace(/"/g, '""')}"`,
        new Date(u.created_at).toLocaleDateString(),
        u.isBlocked ? 'Blocked' : 'Active',
        u.stats?.roadmaps || 0,
        u.stats?.quizzes || 0,
        `${passRate}%`,
        u._id
      ].join(',');
    }).join('\n');

    const csv = csvHeader + csvRows;

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="users_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Error exporting users:', error);
    return NextResponse.json({ error: 'Failed to export users' }, { status: 500 });
  }
}
