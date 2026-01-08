'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, Calendar, User, MessageSquare } from 'lucide-react';
import ReplyEditor from './reply-editor';

export default function RequestDetailClient({ request, user, currentAdmin }) {
  const [showReplyEditor, setShowReplyEditor] = useState(request.status === 'pending');

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
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <Link href="/admin/mentorship">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Requests
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{request.subject}</h1>
                <div className="flex items-center gap-2">
                  {getTypeBadge(request.type)}
                  {getStatusBadge(request.status)}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Student's Message:</h3>
              <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
                <p className="whitespace-pre-wrap">{request.message}</p>
              </Card>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Submitted on {new Date(request.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {request.replies && request.replies.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Reply History ({request.replies.length})
              </h3>
              <div className="space-y-4">
                {request.replies.map((reply, idx) => (
                  <Card key={idx} className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{reply.adminName || reply.adminEmail}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(reply.repliedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                  </Card>
                ))}
              </div>
            </Card>
          )}

          {showReplyEditor && (
            <ReplyEditor
              requestId={request._id}
              currentAdmin={currentAdmin}
              onSuccess={() => setShowReplyEditor(false)}
            />
          )}

          {!showReplyEditor && request.status !== 'closed' && (
            <Button onClick={() => setShowReplyEditor(true)} className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Another Reply
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{request.userName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${request.userEmail}`} className="font-medium text-blue-600 hover:underline">
                    {request.userEmail}
                  </a>
                </div>
              </div>
              {request.userPhone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${request.userPhone}`} className="font-medium">
                      {request.userPhone}
                    </a>
                  </div>
                </div>
              )}
              {user && (
                <div className="pt-3 border-t">
                  <Link href={`/admin/users/${user._id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Full Profile
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {request.status !== 'closed' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={async () => {
                    const res = await fetch(`/api/admin/mentorship/${request._id}/status`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'closed' })
                    });
                    if (res.ok) window.location.reload();
                  }}
                >
                  Mark as Closed
                </Button>
              )}
              {request.status === 'closed' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={async () => {
                    const res = await fetch(`/api/admin/mentorship/${request._id}/status`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'pending' })
                    });
                    if (res.ok) window.location.reload();
                  }}
                >
                  Reopen Request
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
