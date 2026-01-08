'use client';

import { Settings } from 'lucide-react';

export default function AutoActionsSettings() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-6 w-6 text-gray-600" />
        <h2 className="text-xl font-semibold">Auto-Action Configuration</h2>
      </div>

      <div className="space-y-4">
        {/* Mentorship Escalation */}
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <h3 className="font-medium mb-2">Mentorship Escalation</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Automatically escalate mentorship requests that haven't been replied to within a set time period.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="escalate-enabled"
              defaultChecked
              className="rounded"
            />
            <label htmlFor="escalate-enabled" className="text-sm">
              Enable auto-escalation after <strong>48 hours</strong>
            </label>
          </div>
        </div>

        {/* Failed Login Blocking */}
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <h3 className="font-medium mb-2">Failed Login Blocking</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Automatically block users after excessive failed login attempts to prevent brute force attacks.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="block-enabled"
              defaultChecked
              className="rounded"
            />
            <label htmlFor="block-enabled" className="text-sm">
              Block after <strong>5 failed attempts</strong> in 24 hours
            </label>
          </div>
        </div>

        {/* Smart Insights */}
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <h3 className="font-medium mb-2">Smart Insights</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Automatically analyze user behavior and generate actionable insights.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="insights-enabled"
              defaultChecked
              className="rounded"
            />
            <label htmlFor="insights-enabled" className="text-sm">
              Enable smart insights (updates hourly)
            </label>
          </div>
        </div>

        {/* Cron Job Info */}
        <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium mb-2 text-blue-900 dark:text-blue-100">
            🔄 Automated Checks
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Auto-actions run every hour via cron job at:
          </p>
          <code className="block mt-2 p-2 bg-white dark:bg-gray-800 rounded text-xs">
            GET /api/cron/check-escalations
          </code>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            Set up cron job: https://cron-job.org or Vercel Cron
          </p>
        </div>
      </div>
    </div>
  );
}
