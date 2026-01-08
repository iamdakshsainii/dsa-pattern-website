'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import OverviewStatsCards from '@/components/admin/analytics/overview-stats-cards';
import UserGrowthChart from '@/components/admin/analytics/user-growth-chart';
import ActiveUsersChart from '@/components/admin/analytics/active-users-chart';
import QuizPerformanceChart from '@/components/admin/analytics/quiz-performance-chart';
import PopularRoadmapsList from '@/components/admin/analytics/popular-roadmaps-list';
import ExportStatsButton from '@/components/admin/analytics/export-stats-button';

export default function StatsPageClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics/overview?days=30');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Overview</h1>
          <p className="text-muted-foreground mt-1">Platform performance and insights</p>
        </div>
        <ExportStatsButton data={data} />
      </div>

      <OverviewStatsCards stats={data.overview} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart data={data.userGrowth} />
        <ActiveUsersChart data={data.activeUsers} />
      </div>

      <QuizPerformanceChart data={data.quizPerformance} />

      <PopularRoadmapsList roadmaps={data.popularRoadmaps} />
    </div>
  );
}
