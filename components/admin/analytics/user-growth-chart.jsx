'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fillMissingDates, formatDate } from '@/lib/analytics';

export default function UserGrowthChart({ data }) {
  const filledData = fillMissingDates(data, 30).map(item => ({ date: formatDate(item.date), users: item.count }));
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">User Growth</h3>
        <p className="text-sm text-muted-foreground">New signups over the last 30 days</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filledData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
          <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
          <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
