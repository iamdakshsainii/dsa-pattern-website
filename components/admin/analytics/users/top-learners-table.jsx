'use client';

import { Trophy, Award, Target } from 'lucide-react';

export default function TopLearnersTable({ learners }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Top Learners</h2>
        <Trophy className="h-6 w-6 text-yellow-600" />
      </div>

      <div className="space-y-3">
        {learners.map((learner, index) => (
          <div
            key={learner._id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              {/* Rank Badge */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index === 0 ? 'bg-yellow-100 text-yellow-700' :
                index === 1 ? 'bg-gray-100 text-gray-700' :
                index === 2 ? 'bg-orange-100 text-orange-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {index + 1}
              </div>

              {/* User Info */}
              <div>
                <div className="font-medium">{learner.name || 'Anonymous'}</div>
                <div className="text-xs text-muted-foreground">{learner.email}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="flex items-center gap-1 text-green-600">
                  <Award className="h-4 w-4" />
                  <span className="font-semibold">{learner.quizzesPassed}</span>
                </div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-blue-600">
                  <Target className="h-4 w-4" />
                  <span className="font-semibold">{learner.avgScore}%</span>
                </div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </div>
            </div>
          </div>
        ))}

        {learners.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No learners data available yet
          </div>
        )}
      </div>
    </div>
  );
}
