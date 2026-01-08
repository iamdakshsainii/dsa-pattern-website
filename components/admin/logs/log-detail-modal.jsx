'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LogDetailModal({ log, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Activity Log Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Timestamp</div>
              <div className="font-medium">{new Date(log.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Action</div>
              <div className="font-medium capitalize">{log.action}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Actor</div>
              <div className="font-medium">{log.actor}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Actor Type</div>
              <div className="font-medium capitalize">{log.actorType}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Resource Type</div>
              <div className="font-medium capitalize">{log.resourceType}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Resource ID</div>
              <div className="font-mono text-sm break-all">{log.resourceId}</div>
            </div>
          </div>

          {/* IP & User Agent */}
          {(log.ipAddress || log.userAgent) && (
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-3">Request Details</h3>
              {log.ipAddress && (
                <div className="mb-2">
                  <div className="text-sm text-muted-foreground">IP Address</div>
                  <div className="font-mono text-sm">{log.ipAddress}</div>
                </div>
              )}
              {log.userAgent && (
                <div>
                  <div className="text-sm text-muted-foreground">User Agent</div>
                  <div className="font-mono text-xs break-all">{log.userAgent}</div>
                </div>
              )}
            </div>
          )}

          {/* Changes */}
          {log.changes && (
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-3">Changes Made</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Before */}
                {log.changes.before && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Before</div>
                    <pre className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.changes.before, null, 2)}
                    </pre>
                  </div>
                )}
                {/* After */}
                {log.changes.after && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">After</div>
                    <pre className="bg-green-50 dark:bg-green-900/20 p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.changes.after, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
