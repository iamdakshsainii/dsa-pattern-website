'use client';

import { Clock, TrendingDown, TrendingUp } from 'lucide-react';

export default function ResponseTimeStats({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Response Time</h2>
          <p className="text-sm text-muted-foreground">Average time to first reply</p>
        </div>
        <Clock className="h-6 w-6 text-purple-600" />
      </div>

      <div className="space-y-4">
        {/* Average Response Time */}
        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <div className="text-sm text-muted-foreground mb-1">Average</div>
          <div className="text-3xl font-bold text-purple-600">
            {data.avgResponseTime}h
          </div>
          {data.avgResponseTime <= 24 && (
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingDown className="h-4 w-4" />
              <span>Great response time!</span>
            </div>
          )}
          {data.avgResponseTime > 48 && (
            <div className="flex items-center gap-1 mt-2 text-sm text-orange-600">
              <TrendingUp className="h-4 w-4" />
              <span>Could be improved</span>
            </div>
          )}
        </div>

        {/* Min/Max */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="text-xs text-muted-foreground mb-1">Fastest</div>
            <div className="text-xl font-bold text-green-600">
              {data.minResponseTime}h
            </div>
          </div>
          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <div className="text-xs text-muted-foreground mb-1">Slowest</div>
            <div className="text-xl font-bold text-orange-600">
              {data.maxResponseTime}h
            </div>
          </div>
        </div>

        {/* Total Replied */}
        <div className="text-center p-3 border rounded-lg">
          <div className="text-sm text-muted-foreground">Total Replied</div>
          <div className="text-2xl font-bold">{data.totalReplied}</div>
        </div>
      </div>
    </div>
  );
}


