'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function QuizPerformanceChart({ data }) {
  const chartData = data.slice(0, 5).map(item => ({
    name: item.roadmapIcon + ' ' + item.roadmapTitle.substring(0, 15),
    passed: item.passed,
    failed: item.failed,
    passRate: item.passRate
  }));
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Quiz Performance by Roadmap</h3>
        <p className="text-sm text-muted-foreground">Pass vs Fail rates for top roadmaps</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#6b7280" />
          <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
          <Legend />
          <Bar dataKey="passed" fill="#10b981" name="Passed" radius={[8, 8, 0, 0]} />
          <Bar dataKey="failed" fill="#ef4444" name="Failed" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
