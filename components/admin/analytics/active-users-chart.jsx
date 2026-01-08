'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fillMissingDates, formatDate } from '@/lib/analytics';

export default function ActiveUsersChart({ data }) {
  const filledData = fillMissingDates(data, 30).map(item => ({ date: formatDate(item.date), active: item.count }));
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Active Users</h3>
        <p className="text-sm text-muted-foreground">Daily active users over the last 30 days</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={filledData}>
          <defs>
            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
          <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
          <Area type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
