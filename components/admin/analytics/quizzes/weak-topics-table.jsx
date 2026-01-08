'use client';

import { AlertCircle } from 'lucide-react';

export default function WeakTopicsTable({ topics }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Weak Topics</h2>
          <p className="text-sm text-muted-foreground">Most failed quizzes</p>
        </div>
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>

      <div className="space-y-3">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          >
            <div className="flex-1">
              <div className="font-medium">{topic.roadmapName}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {topic.failureCount} failures • Avg score: {topic.avgScore}%
              </div>
            </div>

            {/* Severity Indicator */}
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              topic.avgScore < 40 ? 'bg-red-100 text-red-700' :
              topic.avgScore < 60 ? 'bg-orange-100 text-orange-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {topic.avgScore < 40 ? 'Critical' :
               topic.avgScore < 60 ? 'High' : 'Medium'}
            </div>
          </div>
        ))}

        {topics.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No weak topics identified 🎉
          </div>
        )}
      </div>
    </div>
  );
}
