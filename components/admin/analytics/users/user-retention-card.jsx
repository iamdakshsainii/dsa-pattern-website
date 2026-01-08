
'use client';

import { Users, TrendingUp, TrendingDown } from 'lucide-react';

export default function UserRetentionCard({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">User Retention</h2>
        <Users className="h-6 w-6 text-blue-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Users */}
        <div>
          <div className="text-sm text-muted-foreground mb-1">Total Users</div>
          <div className="text-3xl font-bold">{data.total.toLocaleString()}</div>
        </div>

        {/* 7-Day Active */}
        <div>
          <div className="text-sm text-muted-foreground mb-1">Active (7 Days)</div>
          <div className="text-3xl font-bold text-green-600">{data.active7Days.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-medium">{data.retention7Days}% retention</span>
          </div>
        </div>

        {/* 30-Day Active */}
        <div>
          <div className="text-sm text-muted-foreground mb-1">Active (30 Days)</div>
          <div className="text-3xl font-bold text-blue-600">{data.active30Days.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1 text-sm">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-blue-600 font-medium">{data.retention30Days}% retention</span>
          </div>
        </div>

        {/* Inactive */}
        <div>
          <div className="text-sm text-muted-foreground mb-1">Inactive (30+ Days)</div>
          <div className="text-3xl font-bold text-orange-600">
            {(data.total - data.active30Days).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm">
            <TrendingDown className="h-4 w-4 text-orange-600" />
            <span className="text-orange-600 font-medium">
              {Math.round(((data.total - data.active30Days) / data.total) * 100)}% inactive
            </span>
          </div>
        </div>
      </div>
    </div>
  );}
