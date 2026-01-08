'use client';
import { TrendingUp } from 'lucide-react';

export default function PopularRoadmapsList({ roadmaps }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Popular Roadmaps</h3>
          <p className="text-sm text-muted-foreground">Most enrolled roadmaps</p>
        </div>
        <TrendingUp className="h-5 w-5 text-blue-600" />
      </div>
      <div className="space-y-4">
        {roadmaps.map((roadmap, index) => (
          <div key={roadmap.roadmapId} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-bold text-sm">
                {index + 1}
              </div>
              <div className="text-2xl">{roadmap.icon}</div>
              <div>
                <p className="font-medium">{roadmap.title}</p>
                <p className="text-xs text-muted-foreground">{roadmap.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{roadmap.followers}</p>
              <p className="text-xs text-muted-foreground">learners</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
