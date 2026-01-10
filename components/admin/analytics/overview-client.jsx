'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, FileQuestion, Target, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import OverviewStatsCards from './overview-stats-cards';

export default function OverviewClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchData();
  }, [days]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?days=${days}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load analytics data</p>
        <Button onClick={fetchData} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Overview</h1>
          <p className="text-muted-foreground mt-1">Platform insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={days === 7 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDays(7)}
          >
            7 Days
          </Button>
          <Button
            variant={days === 30 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDays(30)}
          >
            30 Days
          </Button>
        </div>
      </div>

      <OverviewStatsCards stats={data.overview} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">User Growth</h3>
            <Link href="/admin/stats/users">
              <Button variant="ghost" size="sm" className="gap-2">
                View Details <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
            {data.userGrowth.length > 0 ? (
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">
                  {data.userGrowth[data.userGrowth.length - 1]?.count || 0}
                </p>
                <p className="text-sm text-muted-foreground mt-2">New users in last {days} days</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Popular Roadmaps</h3>
            <Link href="/admin/roadmaps">
              <Button variant="ghost" size="sm" className="gap-2">
                Manage <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {data.popularRoadmaps.length > 0 ? (
              data.popularRoadmaps.slice(0, 5).map((roadmap, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{roadmap.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{roadmap.title}</p>
                      <p className="text-xs text-muted-foreground">{roadmap.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{roadmap.followers}</p>
                    <p className="text-xs text-muted-foreground">learners</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No roadmaps yet</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/stats/users">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Users className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold mb-1">User Analytics</h3>
            <p className="text-sm text-muted-foreground">View detailed user insights and trends</p>
          </Card>
        </Link>

        <Link href="/admin/stats/quizzes">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <FileQuestion className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-semibold mb-1">Quiz Analytics</h3>
            <p className="text-sm text-muted-foreground">Monitor quiz performance and completion</p>
          </Card>
        </Link>

        <Link href="/admin/stats/mentorship">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Target className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold mb-1">Mentorship Requests</h3>
            <p className="text-sm text-muted-foreground">Track and manage support requests</p>
          </Card>
        </Link>
      </div>

      {data.quizPerformance.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quiz Performance by Roadmap</h3>
            <Link href="/admin/stats/quizzes">
              <Button variant="ghost" size="sm" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold">Roadmap</th>
                  <th className="p-3 text-right text-sm font-semibold">Attempts</th>
                  <th className="p-3 text-right text-sm font-semibold">Pass Rate</th>
                  <th className="p-3 text-right text-sm font-semibold">Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {data.quizPerformance.slice(0, 5).map((item, index) => (
                  <tr key={index} className="border-b dark:border-gray-800">
                    <td className="p-3 flex items-center gap-2">
                      <span>{item.roadmapIcon}</span>
                      <span className="font-medium">{item.roadmapTitle}</span>
                    </td>
                    <td className="p-3 text-right">{item.total}</td>
                    <td className="p-3 text-right">
                      <span className={`font-medium ${item.passRate >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.passRate}%
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">{item.avgScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
