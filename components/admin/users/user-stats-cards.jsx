'use client';

import { Card } from '@/components/ui/card';
import { Users, UserCheck, Ban, TrendingUp } from 'lucide-react';

export default function UserStatsCards({ stats, users = [] }) {
  const totalUsers = stats.total || 0;
  const blockedCount = users.filter(u => u.isBlocked).length;
  const activeCount = users.filter(u => !u.isBlocked).length;
  const currentPage = stats.page || 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Total Users</h3>
        </div>
        <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Active Users</h3>
        </div>
        <p className="text-3xl font-bold text-green-600">{activeCount}</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Ban className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Blocked</h3>
        </div>
        <p className="text-3xl font-bold text-red-600">{blockedCount}</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Page</h3>
        </div>
        <p className="text-3xl font-bold text-purple-600">{currentPage} / {stats.totalPages || 1}</p>
      </Card>
    </div>
  );
}
