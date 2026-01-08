'use client';

import { Card } from '@/components/ui/card';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

export default function UserStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-semibold">Total Users</h3>
        </div>
        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <UserCheck className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="font-semibold">Active Users</h3>
        </div>
        <p className="text-3xl font-bold text-green-600">{stats.total - (stats.blocked || 0)}</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <UserX className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="font-semibold">Blocked</h3>
        </div>
        <p className="text-3xl font-bold text-red-600">{stats.blocked || 0}</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="font-semibold">Page</h3>
        </div>
        <p className="text-3xl font-bold text-purple-600">{stats.page} / {stats.totalPages}</p>
      </Card>
    </div>
  );
}
