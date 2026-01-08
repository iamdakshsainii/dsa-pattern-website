'use client';

import { AlertTriangle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChurnRiskList({ users }) {
  const handleSendReminder = (email) => {
    // Fallback: Open email client with pre-filled template
    const subject = encodeURIComponent('We miss you! Come back to continue learning');
    const body = encodeURIComponent(
      `Hi there!\n\nWe noticed you haven't logged in for a while. We'd love to see you back on the platform!\n\nYour progress is waiting for you. Continue your learning journey today.\n\nBest regards,\nAdmin Team`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Churn Risk Users</h2>
        <AlertTriangle className="h-6 w-6 text-orange-600" />
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Users inactive for 30+ days but previously active
      </p>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-3 rounded-lg border hover:border-orange-300 transition-colors"
          >
            <div className="flex-1">
              <div className="font-medium">{user.name || 'Anonymous'}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
              <div className="text-xs text-orange-600 mt-1">
                Last seen {user.daysSinceLogin} days ago
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSendReminder(user.email)}
              className="ml-2"
            >
              <Mail className="h-4 w-4 mr-1" />
              Send Reminder
            </Button>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No users at churn risk 🎉
          </div>
        )}
      </div>
    </div>
  );
}

