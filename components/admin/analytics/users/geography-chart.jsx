'use client';

import { MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GeographyChart({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Geographic Distribution</h2>
          <p className="text-sm text-muted-foreground">Top 10 locations</p>
        </div>
        <MapPin className="h-6 w-6 text-green-600" />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="location"
            angle={-45}
            textAnchor="end"
            height={100}
            style={{ fontSize: '12px' }}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {data.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No geographic data available
        </div>
      )}
    </div>
  );
}
