'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActivityLogTable from '@/components/admin/logs/activity-log-table';
import LogFilters from '@/components/admin/logs/log-filters';
import LogStatsCards from '@/components/admin/logs/log-stats-cards';
import { exportToCSV } from '@/lib/analytics';

export default function ActivityLogsClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    action: 'all',
    resourceType: 'all',
    actor: '',
    startDate: '',
    endDate: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        ...(filters.action !== 'all' && { action: filters.action }),
        ...(filters.resourceType !== 'all' && { resourceType: filters.resourceType }),
        ...(filters.actor && { actor: filters.actor }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const res = await fetch(`/api/admin/logs?${params}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleExport = () => {
    if (!data?.logs || data.logs.length === 0) return;

    const exportData = data.logs.map(log => ({
      Timestamp: new Date(log.timestamp).toLocaleString(),
      Actor: log.actor,
      Type: log.actorType,
      Action: log.action,
      Resource: log.resourceType,
      'Resource ID': log.resourceId,
      'IP Address': log.ipAddress || 'N/A'
    }));

    exportToCSV(exportData, 'activity-logs');
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground">Complete audit trail of platform activities</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {data?.stats && <LogStatsCards stats={data.stats} />}

      {/* Filters */}
      <LogFilters filters={filters} setFilters={setFilters} />

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : (
        <ActivityLogTable
          logs={data?.logs || []}
          pagination={{
            page: data?.page || 1,
            totalPages: data?.totalPages || 1,
            total: data?.total || 0
          }}
          onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
        />
      )}
    </div>
  );
}
