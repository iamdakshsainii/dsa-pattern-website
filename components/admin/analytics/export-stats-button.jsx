'use client';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/analytics';

export default function ExportStatsButton({ data }) {
  const handleExport = () => {
    const exportData = [
      { metric: 'Total Users', value: data.overview.totalUsers },
      { metric: 'Active Users (7 days)', value: data.overview.activeUsers },
      { metric: 'Total Quizzes', value: data.overview.totalQuizzes },
      { metric: 'Average Quiz Score', value: `${data.overview.avgQuizScore}%` },
      { metric: 'Total Roadmaps', value: data.overview.totalRoadmaps }
    ];
    exportToCSV(exportData, 'platform-analytics');
  };
  return (
    <Button onClick={handleExport} variant="outline" className="gap-2">
      <Download className="h-4 w-4" />
      Export to CSV
    </Button>
  );
}
