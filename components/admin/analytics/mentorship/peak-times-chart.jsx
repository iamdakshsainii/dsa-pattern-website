'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

export default function PeakTimesChart({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Peak Request Times</h2>
          <p className="text-sm text-muted-foreground">When do users need help most?</p>
        </div>
        <Calendar className="h-6 w-6 text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Hour of Day */}
        <div>
          <h3 className="text-sm font-medium mb-3">By Hour of Day</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.byHour}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                style={{ fontSize: '10px' }}
              />
              <YAxis style={{ fontSize: '10px' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-2 border rounded shadow-lg">
                        <p className="text-sm font-semibold">
                          {payload[0].payload.hour}:00
                        </p>
                        <p className="text-sm text-indigo-600">
                          {payload[0].value} requests
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By Day of Week */}
        <div>
          <h3 className="text-sm font-medium mb-3">By Day of Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.byDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                style={{ fontSize: '10px' }}
              />
              <YAxis style={{ fontSize: '10px' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-2 border rounded shadow-lg">
                        <p className="text-sm font-semibold">
                          {payload[0].payload.day}
                        </p>
                        <p className="text-sm text-indigo-600">
                          {payload[0].value} requests
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
