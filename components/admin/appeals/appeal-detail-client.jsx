'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft, CheckCircle, XCircle, MessageSquare,
  User, Mail, Calendar, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AppealDetailClient({ appealData, currentAdmin }) {
  const { appeal, user, messages } = appealData;
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleAction = async (action, customMessage = null) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/appeals/${appeal._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          message: customMessage || replyMessage
        })
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: `Appeal ${action}d successfully`
        });
        router.refresh();
        if (action === 'reply') setReplyMessage('');
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} appeal`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <Link href="/admin/appeals">
        <Button variant="ghost" className="mb-6 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Appeals
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{appeal.userName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {appeal.userEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="text-xs font-mono">{appeal.userId}</p>
              </div>
              {user && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                  <Link href={`/admin/users/${user._id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View Full Profile
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Block Details</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded">
                <p className="text-sm font-medium text-red-900 dark:text-red-300 mb-1">Reason:</p>
                <p className="text-sm text-red-800 dark:text-red-200">{appeal.blockReason}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Appeal Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Appeal Details</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Submitted {new Date(appeal.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <Badge className={getStatusColor(appeal.status)}>
                {appeal.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                User's Message
              </h3>
              <p className="text-sm whitespace-pre-wrap">{appeal.message}</p>
            </div>

            {/* Messages Thread */}
            {messages && messages.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold">Conversation</h3>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${
                      msg.sender === 'admin'
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold">
                        {msg.sender === 'admin' ? msg.senderName : appeal.userName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(msg.sentAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Section */}
            {appeal.status !== 'approved' && appeal.status !== 'rejected' && (
              <div className="space-y-3">
                <h3 className="font-semibold">Send Reply</h3>
                <Textarea
                  placeholder="Type your response to the user..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAction('reply')}
                    disabled={loading || !replyMessage.trim()}
                    variant="outline"
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {appeal.status !== 'approved' && appeal.status !== 'rejected' && (
              <div className="flex gap-3 mt-6 pt-6 border-t">
                <Button
                  onClick={() => handleAction('approve', 'Your appeal has been approved. Your account has been unblocked.')}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve & Unblock
                </Button>
                <Button
                  onClick={() => handleAction('reject', 'Your appeal has been reviewed and rejected. The block will remain in place.')}
                  disabled={loading}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Appeal
                </Button>
              </div>
            )}

            {/* Final Response Display */}
            {appeal.adminResponse && (
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                      Admin Response
                    </p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      {appeal.adminResponse}
                    </p>
                    {appeal.respondedAt && (
                      <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-2">
                        Responded on {new Date(appeal.respondedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
