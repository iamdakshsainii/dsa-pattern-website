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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle } from 'lucide-react';

export default function DeleteUserDialog({ open, onOpenChange, user }) {
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast({
        title: 'Confirmation required',
        description: 'Please type DELETE to confirm',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast({
          title: 'User deleted',
          description: 'User and all associated data has been deleted'
        });
        onOpenChange(false);
        router.refresh();
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete User Permanently
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 p-4 bg-red-50 dark:bg-red-900/10 rounded border border-red-200 dark:border-red-900">
          <p className="font-medium">User: {user.name || user.email}</p>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            <li>User account and profile</li>
            <li>All roadmap progress</li>
            <li>All quiz results and attempts</li>
            <li>All bookmarks and notes</li>
            <li>All certificates earned</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Label>Type <span className="font-bold">DELETE</span> to confirm</Label>
          <Input
            placeholder="DELETE"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading || confirmText !== 'DELETE'}
          >
            {loading ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
