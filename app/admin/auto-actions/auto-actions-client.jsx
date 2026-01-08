'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActiveEscalationsList from '@/components/admin/auto-actions/active-escalations-list';
import SmartInsightsPanel from '@/components/admin/auto-actions/smart-insights-panel';
import AutoActionsSettings from '@/components/admin/auto-actions/auto-actions-settings';

export default function AutoActionsClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auto-actions');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch auto-actions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolve = async (escalationId) => {
    try {
      await fetch('/api/admin/auto-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve', escalationId })
      });
      fetchData();
    } catch (error) {
      console.error('Failed to resolve escalation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Auto-Actions & Smart Insights</h1>
            <p className="text-muted-foreground">Automated platform intelligence</p>
          </div>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Active Escalations */}
      <ActiveEscalationsList
        escalations={data?.escalations || []}
        onResolve={handleResolve}
      />

      {/* Smart Insights */}
      <SmartInsightsPanel insights={data?.insights || []} />

      {/* Settings */}
      <AutoActionsSettings />
    </div>
  );
}

