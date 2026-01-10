'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Mail } from 'lucide-react';

export default function BlockedPageClient({ user, reason, blockedDate }) {
  const [appealMessage, setAppealMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmitAppeal = async () => {
    if (!appealMessage.trim()) {
      toast({
        title: 'Message required',
        description: 'Please explain why you believe this was a mistake',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/appeals/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          message: appealMessage,
          blockReason: reason
        })
      });

      if (res.ok) {
        setSubmitted(true);
        toast({
          title: 'Appeal submitted',
          description: 'Your appeal has been sent to the admin team'
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit appeal. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8 shadow-2xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
              Account Suspended
            </h1>
            <p className="text-muted-foreground">
              Your account has been temporarily suspended
            </p>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-2 text-red-900 dark:text-red-300">Reason for suspension:</h3>
          <p className="text-red-800 dark:text-red-200">{reason}</p>
          {blockedDate && (
            <p className="text-sm text-red-700 dark:text-red-300 mt-2">
              Date: {new Date(blockedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>

        {!submitted ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Appeal this decision
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you believe this was a mistake, please explain your situation below. Our admin team will review your appeal.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Your Message</Label>
              <Textarea
                placeholder="Explain why you believe this suspension was a mistake..."
                value={appealMessage}
                onChange={(e) => setAppealMessage(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 50 characters. Be clear and respectful.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmitAppeal}
                disabled={loading || appealMessage.length < 50}
                className="flex-1"
              >
                {loading ? 'Submitting...' : 'Submit Appeal'}
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
              Appeal Submitted
            </h3>
            <p className="text-muted-foreground">
              Your appeal has been sent to our admin team. You'll receive an email response within 24-48 hours.
            </p>
            <Button variant="outline" onClick={handleLogout} className="mt-4">
              Logout
            </Button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-center text-muted-foreground">
            If you need immediate assistance, contact us at{' '}
            <a href="mailto:sainidaksh70@gmail.com" className="text-primary hover:underline">
              sainidaksh70@gmail.com
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
