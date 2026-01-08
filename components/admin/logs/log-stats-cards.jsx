'use client';

import { FileText, Activity, TrendingUp } from 'lucide-react';

export default function LogStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Logs</div>
            <div className="text-3xl font-bold">{stats.totalLogs.toLocaleString()}</div>
          </div>
          <FileText className="h-10 w-10 text-blue-600 opacity-20" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Last 30 Days</div>
            <div className="text-3xl font-bold text-green-600">{stats.recentLogs.toLocaleString()}</div>
          </div>
          <Activity className="h-10 w-10 text-green-600 opacity-20" />
        </div>
      </div>

      {/* Most Common Action */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Top Action</div>
            <div className="text-xl font-bold capitalize">
              {stats.actionBreakdown[0]?.action || 'None'}
            </div>
            <div className="text-sm text-muted-foreground">
              {stats.actionBreakdown[0]?.count || 0} times
            </div>
          </div>
          <TrendingUp className="h-10 w-10 text-purple-600 opacity-20" />
        </div>
      </div>
    </div>
  );
}
