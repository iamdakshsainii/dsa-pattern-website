'use client';

import { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

export default function EditAttemptsDialog({ open, onOpenChange, user }) {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState('');
  const [attempts, setAttempts] = useState('10');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (open && user) {
      fetchUserRoadmaps();
    }
  }, [open, user]);

  useEffect(() => {
    if (!open) {
      setSelectedRoadmap('');
      setAttempts('10');
      setLoading(false);
      setRoadmaps([]);
    }
  }, [open]);

  const fetchUserRoadmaps = async () => {
    try {
      const res = await fetch(`/api/admin/users/${user._id}/roadmaps`);
      if (res.ok) {
        const data = await res.json();
        setRoadmaps(data.roadmaps || []);
      }
    } catch (error) {
      console.error('Failed to fetch roadmaps:', error);
    }
  };

  const handleSave = async () => {
    if (!selectedRoadmap) {
      toast({
        title: 'Select roadmap',
        description: 'Please select a roadmap',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${user._id}/attempts`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmapId: selectedRoadmap,
          attempts: parseInt(attempts)
        })
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Quiz attempts updated successfully'
        });
        onOpenChange(false);
        router.refresh();
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update attempts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen) => {
    if (!loading) {
      onOpenChange(newOpen);
    }
  };

  if (!user) return null;

  return (
    <Dialog key={`attempts-${user._id}-${open}`} open={open} onOpenChange={handleOpenChange} modal={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Quiz Attempts</DialogTitle>
          <DialogDescription>
            Override quiz attempt limits for {user.name || user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Roadmap</Label>
            <Select value={selectedRoadmap} onValueChange={setSelectedRoadmap}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a roadmap" />
              </SelectTrigger>
              <SelectContent>
                {roadmaps.map((roadmap) => (
                  <SelectItem key={roadmap.roadmapId} value={roadmap.roadmapId}>
                    {roadmap.roadmap?.title || roadmap.roadmapId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Custom Attempts Limit</Label>
            <Input
              type="number"
              min="0"
              max="999"
              value={attempts}
              onChange={(e) => setAttempts(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Default system allows 5 base + up to 3 bonus (max 8). You can override to any number.
            </p>
          </div>

          {selectedRoadmap && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border">
              <p className="text-sm">
                <strong>Current:</strong> {roadmaps.find(r => r.roadmapId === selectedRoadmap)?.quizAttempts?.used || 0} used /
                {roadmaps.find(r => r.roadmapId === selectedRoadmap)?.quizAttempts?.unlocked || 5} unlocked
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
