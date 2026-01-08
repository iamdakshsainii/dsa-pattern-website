'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function RequestTable({ requests, pagination, selectedRequests, onSelectRequests, currentAdmin }) {
  const [bulkAction, setBulkAction] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const toggleRequest = (requestId) => {
    if (selectedRequests.includes(requestId)) {
      onSelectRequests(selectedRequests.filter(id => id !== requestId));
    } else {
      onSelectRequests([...selectedRequests, requestId]);
    }
  };

  const toggleAll = () => {
    if (selectedRequests.length === requests.length) {
      onSelectRequests([]);
    } else {
      onSelectRequests(requests.map(r => r._id));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedRequests.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/mentorship/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: bulkAction,
          requestIds: selectedRequests
        })
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: `${selectedRequests.length} requests updated`
        });
        onSelectRequests([]);
        setBulkAction('');
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update requests',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-orange-100 text-orange-700 border-orange-300',
      replied: 'bg-green-100 text-green-700 border-green-300',
      closed: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return <Badge variant="outline" className={styles[status]}>{status}</Badge>;
  };

  const getTypeBadge = (type) => {
    const styles = {
      career: 'bg-blue-100 text-blue-700',
      technical: 'bg-purple-100 text-purple-700',
      general: 'bg-gray-100 text-gray-700'
    };
    return <Badge className={styles[type] || styles.general}>{type}</Badge>;
  };

  return (
    <>
      {selectedRequests.length > 0 && (
        <Card className="p-4 mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <div className="flex items-center gap-4">
            <span className="font-medium">{selectedRequests.length} selected</span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm"
            >
              <option value="">Choose action...</option>
              <option value="replied">Mark as Replied</option>
              <option value="closed">Mark as Closed</option>
              <option value="pending">Mark as Pending</option>
            </select>
            <Button onClick={handleBulkAction} disabled={loading || !bulkAction} size="sm">
              Apply
            </Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedRequests.length === requests.length && requests.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="p-4 text-left font-semibold">Student</th>
                <th className="p-4 text-left font-semibold">Type</th>
                <th className="p-4 text-left font-semibold">Subject</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Date</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedRequests.includes(request._id)}
                      onCheckedChange={() => toggleRequest(request._id)}
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{request.userName}</div>
                      <div className="text-sm text-muted-foreground">{request.userEmail}</div>
                    </div>
                  </td>
                  <td className="p-4">{getTypeBadge(request.type)}</td>
                  <td className="p-4">
                    <div className="max-w-xs truncate">{request.subject}</div>
                  </td>
                  <td className="p-4">{getStatusBadge(request.status)}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/mentorship/${request._id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {requests.length} of {pagination.total} requests
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => router.push(`/admin/mentorship?page=${pagination.page - 1}`)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasMore}
              onClick={() => router.push(`/admin/mentorship?page=${pagination.page + 1}`)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
