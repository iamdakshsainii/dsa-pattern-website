'use client';

import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ActiveEscalationsList({ escalations, onResolve }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'escalate_mentorship':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'block_user':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'escalate_mentorship':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'block_user':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Active Escalations</h2>
          <p className="text-sm text-muted-foreground">
            {escalations.length} pending action{escalations.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          escalations.length > 0
            ? 'bg-orange-100 text-orange-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {escalations.length > 0 ? 'Needs Attention' : 'All Clear'}
        </div>
      </div>

      <div className="space-y-3">
        {escalations.map((escalation) => (
          <div
            key={escalation._id}
            className={`p-4 rounded-lg border ${getTypeColor(escalation.type)}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                {getTypeIcon(escalation.type)}
                <div className="flex-1">
                  <div className="font-medium mb-1">
                    {escalation.type.split('_').map(word =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {escalation.reason}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Triggered: {new Date(escalation.triggeredAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => onResolve(escalation._id)}
                className="shrink-0"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Mark Resolved
              </Button>
            </div>
          </div>
        ))}

        {escalations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-600 opacity-50" />
            <p>No active escalations</p>
            <p className="text-sm">All systems running smoothly!</p>
          </div>
        )}
      </div>
    </div>
  );
}

