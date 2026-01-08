'use client';

import { CheckCircle2, Circle, Clock } from 'lucide-react';

export default function ResolutionRateCard({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Resolution Rate</h2>
          <p className="text-sm text-muted-foreground">Request status breakdown</p>
        </div>
        <CheckCircle2 className="h-6 w-6 text-green-600" />
      </div>

      {/* Overall Resolution Rate */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="text-sm text-muted-foreground mb-1">Overall Resolution</div>
        <div className="text-4xl font-bold text-green-600">
          {data.resolutionRate}%
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="space-y-3">
        {/* Resolved */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="font-medium">Resolved</span>
          </div>
          <span className="text-lg font-bold text-green-600">{data.resolved}</span>
        </div>

        {/* Replied */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center gap-2">
            <Circle className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Replied</span>
          </div>
          <span className="text-lg font-bold text-blue-600">{data.replied}</span>
        </div>

        {/* Pending */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <span className="font-medium">Pending</span>
          </div>
          <span className="text-lg font-bold text-orange-600">{data.pending}</span>
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t text-center">
        <div className="text-sm text-muted-foreground">Total Requests</div>
        <div className="text-2xl font-bold">{data.total}</div>
      </div>
    </div>
  );
}


