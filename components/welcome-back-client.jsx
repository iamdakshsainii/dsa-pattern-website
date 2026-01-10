'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, Home } from 'lucide-react';

export default function WelcomeBackClient({ user, adminReply, adminName }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    setLoading(true);

    try {
      // Call API to remove welcome flag
      const res = await fetch('/api/user/clear-welcome-flag', {
        method: 'POST'
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      console.error('Error:', error);
      // Even if API fails, redirect to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8 shadow-2xl">
        {/* Success Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              Welcome Back, {user.name}!
            </h1>
            <p className="text-muted-foreground">
              Your account has been restored
            </p>
          </div>
        </div>

        {/* Admin Reply */}
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <span className="text-lg">💬</span>
            Message from {adminName}
          </h3>
          <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
            {adminReply}
          </p>
        </div>

        {/* Warning */}
        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-3 text-orange-900 dark:text-orange-300 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Important Notice
          </h3>
          <p className="text-orange-800 dark:text-orange-200 mb-3">
            Your account has been restored, but please note:
          </p>
          <ul className="list-disc list-inside space-y-2 text-orange-800 dark:text-orange-200 text-sm">
            <li>Follow all platform guidelines and rules</li>
            <li>Respect other users and maintain professionalism</li>
            <li>Any future violations may result in <strong>permanent account deletion</strong></li>
            <li>Contact support if you have any questions</li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleContinue}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? 'Loading...' : (
              <>
                <Home className="h-5 w-5 mr-2" />
                I Understand - Continue to Dashboard
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By continuing, you acknowledge that you've read and understood the warning above
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-center text-muted-foreground">
            Need help? Contact us at{' '}
            <a href="mailto:sainidaksh70@gmail.com" className="text-primary hover:underline">
              sainidaksh70@gmail.com
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
