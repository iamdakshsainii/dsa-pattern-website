'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import RequestVolumeChart from '@/components/admin/analytics/mentorship/request-volume-chart';
import ResponseTimeStats from '@/components/admin/analytics/mentorship/response-time-stats';
import CommonTopicsTable from '@/components/admin/analytics/mentorship/common-topics-table';
import ResolutionRateCard from '@/components/admin/analytics/mentorship/resolution-rate-card';
import PeakTimesChart from '@/components/admin/analytics/mentorship/peak-times-chart';

export default function MentorshipAnalyticsClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics/mentorship');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch mentorship analytics:', error);
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
        <div className="text-center text-red-600">Failed to load mentorship analytics</div>
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
            <h1 className="text-3xl font-bold">Mentorship Analytics</h1>
            <p className="text-muted-foreground">Request trends and performance metrics</p>
          </div>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Request Volume Chart */}
      <RequestVolumeChart data={data.volume} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Stats */}
        <ResponseTimeStats data={data.responseTime} />

        {/* Resolution Rate */}
        <ResolutionRateCard data={data.resolution} />
      </div>

      {/* Common Topics */}
      <CommonTopicsTable topics={data.topics} />

      {/* Peak Times */}
      <PeakTimesChart data={data.peakTimes} />
    </div>
  );
}
