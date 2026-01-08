'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileQuestion, Map, Award, User,
  CheckCircle, XCircle, Clock
} from 'lucide-react';

const activityConfig = {
  quiz: {
    passed_quiz: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      label: 'Passed Quiz'
    },
    failed_quiz: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      label: 'Failed Quiz'
    }
  },
  roadmap: {
    started_roadmap: {
      icon: Map,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      label: 'Started Roadmap'
    }
  },
  certificate: {
    earned_certificate: {
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      label: 'Earned Certificate'
    }
  },
  profile: {
    updated_profile: {
      icon: User,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      label: 'Updated Profile'
    }
  }
};

function getRelativeTime(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function ActivityTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Clock className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No activity recorded yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {timeline.map((item, idx) => {
          const config = activityConfig[item.type]?.[item.action];
          if (!config) return null;

          const Icon = config.icon;

          return (
            <div key={idx} className="flex gap-4">
              <div className={`${config.bgColor} p-2 rounded-lg h-fit`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h4 className="font-medium">{config.label}</h4>
                    {item.data.roadmapId && (
                      <p className="text-sm text-muted-foreground">
                        Roadmap: {item.data.roadmapId}
                      </p>
                    )}
                  </div>
                  <time className="text-sm text-muted-foreground">
                    {getRelativeTime(item.timestamp)}
                  </time>
                </div>

                {item.type === 'quiz' && item.data.score !== undefined && (
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline">
                      Score: {item.data.score}%
                    </Badge>
                    <Badge variant="outline">
                      Attempt #{item.data.attemptNumber}
                    </Badge>
                  </div>
                )}

                {item.type === 'roadmap' && item.data.progress !== undefined && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{item.data.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${item.data.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
