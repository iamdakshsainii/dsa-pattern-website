'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CompletionRatesChart from '@/components/admin/analytics/quizzes/completion-rates-chart';
import WeakTopicsTable from '@/components/admin/analytics/quizzes/weak-topics-table';
import TimeAnalysisChart from '@/components/admin/analytics/quizzes/time-analysis-chart';
import AttemptDistributionChart from '@/components/admin/analytics/quizzes/attempt-distribution-chart';

export default function QuizAnalyticsClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics/quizzes');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch quiz analytics:', error);
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
        <div className="text-center text-red-600">Failed to load quiz analytics</div>
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
            <h1 className="text-3xl font-bold">Quiz Analytics</h1>
            <p className="text-muted-foreground">Performance insights and trends</p>
          </div>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Completion Rates Chart */}
      <CompletionRatesChart data={data.completionRates} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <WeakTopicsTable topics={data.weakTopics} />

        {/* Time Analysis */}
        <TimeAnalysisChart data={data.timeAnalysis} />
      </div>

      {/* Attempt Distribution */}
      <AttemptDistributionChart data={data.attemptDistribution} />
    </div>
  );
}
