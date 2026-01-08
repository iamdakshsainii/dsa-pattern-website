'use client';

import { Clock } from 'lucide-react';

export default function TimeAnalysisChart({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Time Analysis</h2>
          <p className="text-sm text-muted-foreground">Average time spent per quiz</p>
        </div>
        <Clock className="h-6 w-6 text-purple-600" />
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{item.roadmapName}</div>
              <div className="text-lg font-bold text-purple-600">
                {item.avgTime} min
              </div>
            </div>

            {/* Time Range Bar */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Min: {item.minTime}m</span>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full"
                  style={{
                    width: `${(item.avgTime / item.maxTime) * 100}%`
                  }}
                />
              </div>
              <span>Max: {item.maxTime}m</span>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No time data available
          </div>
        )}
      </div>
    </div>
  );
}
