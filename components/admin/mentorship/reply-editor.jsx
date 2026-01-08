'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Send, X } from 'lucide-react';

export default function ReplyEditor({ requestId, currentAdmin, onSuccess }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: 'Error',
        description: 'Please write a reply message',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`/api/admin/mentorship/${requestId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          adminEmail: currentAdmin.email,
          adminName: currentAdmin.name || currentAdmin.email.split('@')[0]
        })
      });

      if (res.ok) {
        toast({
          title: 'Reply sent',
          description: 'Your reply has been sent to the student'
        });
        setMessage('');
        if (onSuccess) onSuccess();
        router.refresh();
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reply',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Reply to Student</h3>
      <div className="space-y-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your reply here... Provide guidance, resources, or schedule a call."
          rows={8}
          className="resize-none"
        />
        <div className="flex gap-2">
          <Button onClick={handleSend} disabled={sending} className="gap-2">
            <Send className="h-4 w-4" />
            {sending ? 'Sending...' : 'Send Reply'}
          </Button>
          {onSuccess && (
            <Button variant="outline" onClick={onSuccess}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
