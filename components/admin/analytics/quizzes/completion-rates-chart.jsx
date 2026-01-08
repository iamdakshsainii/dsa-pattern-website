'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle } from 'lucide-react';

export default function CompletionRatesChart({ data }) {
  const chartData = data.map(item => ({
    name: item.roadmapName,
    'Completion Rate': Math.round(item.completionRate),
    'Pass Rate': Math.round(item.passRate),
    attempts: item.totalAttempts
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Quiz Completion & Pass Rates</h2>
          <p className="text-sm text-muted-foreground">By roadmap</p>
        </div>
        <CheckCircle className="h-6 w-6 text-green-600" />
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={120}
            style={{ fontSize: '12px' }}
          />
          <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                    <p className="font-semibold mb-2">{payload[0].payload.name}</p>
                    <p className="text-sm text-blue-600">
                      Completion: {payload[0].value}%
                    </p>
                    <p className="text-sm text-green-600">
                      Pass Rate: {payload[1].value}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total Attempts: {payload[0].payload.attempts}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="Completion Rate" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Pass Rate" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {data.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No quiz data available
        </div>
      )}
    </div>
  );
}
