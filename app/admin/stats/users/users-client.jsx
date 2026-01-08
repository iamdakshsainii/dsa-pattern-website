
'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import UserRetentionCard from '@/components/admin/analytics/users/user-retention-card';
import EngagementHeatmap from '@/components/admin/analytics/users/engagement-heatmap';
import TopLearnersTable from '@/components/admin/analytics/users/top-learners-table';
import ChurnRiskList from '@/components/admin/analytics/users/churn-risk-list';
import GeographyChart from '@/components/admin/analytics/users/geography-chart';

export default function UserAnalyticsClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics/users');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch user analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="text-center text-red-600">Failed to load user analytics</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/stats">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Overview
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">User Analytics</h1>
            <p className="text-muted-foreground">Detailed insights into user behavior and engagement</p>
          </div>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Retention Card */}
      <UserRetentionCard data={data.retention} />

      {/* Engagement Heatmap */}
      <EngagementHeatmap data={data.heatmap} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Learners */}
        <TopLearnersTable learners={data.topLearners} />

        {/* Churn Risk Users */}
        <ChurnRiskList users={data.churnRisk} />
      </div>

      {/* Geographic Distribution */}
      <GeographyChart data={data.geography} />
    </div>
  );
}

