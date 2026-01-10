'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function BlockUserDialog({ open, onOpenChange, user, currentAdmin }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleBlock = async () => {
    if (!user.isBlocked && !reason.trim()) {
      toast({
        title: 'Reason required',
        description: 'Please provide a reason for blocking',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${user._id}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: user.isBlocked ? 'unblock' : 'block',
          reason,
          blockedBy: currentAdmin.email
        })
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: user.isBlocked ? 'User unblocked successfully' : 'User blocked successfully'
        });
        onOpenChange(false);

        // Force full page reload to get fresh data
        window.location.reload();
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {user.isBlocked ? 'Unblock User' : 'Block User'}
          </DialogTitle>
          <DialogDescription>
            {user.isBlocked
              ? `Remove block from ${user.name || user.email}?`
              : `Block ${user.name || user.email} from accessing the platform?`
            }
          </DialogDescription>
        </DialogHeader>

        {!user.isBlocked && (
          <div className="space-y-2">
            <Label>Reason for blocking *</Label>
            <Textarea
              placeholder="Enter reason for blocking this user..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        )}

        {user.isBlocked && user.blockReason && (
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <p className="text-sm font-medium mb-1">Current block reason:</p>
            <p className="text-sm text-muted-foreground">{user.blockReason}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBlock}
            disabled={loading}
            variant={user.isBlocked ? 'default' : 'destructive'}
          >
            {loading ? 'Processing...' : (user.isBlocked ? 'Unblock User' : 'Block User')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
