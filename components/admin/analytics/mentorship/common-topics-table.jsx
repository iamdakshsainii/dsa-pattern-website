'use client';

import { MessageSquare } from 'lucide-react';

export default function CommonTopicsTable({ topics }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Common Request Topics</h2>
          <p className="text-sm text-muted-foreground">Most frequent request types</p>
        </div>
        <MessageSquare className="h-6 w-6 text-blue-600" />
      </div>

      <div className="space-y-2">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <div className="font-medium capitalize">{topic.type}</div>
                {topic.avgResponseTime && (
                  <div className="text-xs text-muted-foreground">
                    Avg response: {topic.avgResponseTime}h
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{topic.count}</div>
              <div className="text-xs text-muted-foreground">requests</div>
            </div>
          </div>
        ))}

        {topics.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No mentorship requests yet
          </div>
        )}
      </div>
    </div>
  );
}
