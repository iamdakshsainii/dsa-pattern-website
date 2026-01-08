'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';

export default function AttemptDistributionChart({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Attempt Distribution</h2>
          <p className="text-sm text-muted-foreground">How many attempts does it take to pass?</p>
        </div>
        <Target className="h-6 w-6 text-blue-600" />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="attempt"
            label={{ value: 'Attempt Number', position: 'insideBottom', offset: -5 }}
          />
          <YAxis label={{ value: 'Number of Users', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                    <p className="font-semibold mb-2">Attempt {data.attempt}</p>
                    <p className="text-sm">Total Users: {data.totalUsers}</p>
                    <p className="text-sm text-green-600">Passed: {data.passedUsers}</p>
                    <p className="text-sm text-blue-600">Pass Rate: {data.passRate}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="totalUsers" name="Total Users" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          <Bar dataKey="passedUsers" name="Passed Users" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.length > 0 ? data[0].passRate : 0}%
          </div>
          <div className="text-xs text-muted-foreground">Pass on 1st attempt</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.length > 1 ? data[1].passRate : 0}%
          </div>
          <div className="text-xs text-muted-foreground">Pass on 2nd attempt</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {data.reduce((sum, item) => sum + item.totalUsers, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Total attempts tracked</div>
        </div>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No attempt data available
        </div>
      )}
    </div>
  );
}
