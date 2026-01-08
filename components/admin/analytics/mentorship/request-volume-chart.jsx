'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatDate, fillMissingDates } from '@/lib/analytics';

export default function RequestVolumeChart({ data }) {
  const chartData = fillMissingDates(data, 30);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Request Volume Trend</h2>
          <p className="text-sm text-muted-foreground">Last 30 days</p>
        </div>
        <TrendingUp className="h-6 w-6 text-blue-600" />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="formattedDate"
            style={{ fontSize: '12px' }}
          />
          <YAxis />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                    <p className="font-semibold">{payload[0].payload.formattedDate}</p>
                    <p className="text-sm text-blue-600">
                      Requests: {payload[0].value}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
