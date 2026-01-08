'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, CheckCircle, Archive } from 'lucide-react';
import RequestFilters from './request-filters';
import RequestTable from './request-table';

export default function MentorshipClient({ initialData, stats, currentAdmin, filters }) {
  const [selectedRequests, setSelectedRequests] = useState([]);

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Mentorship Requests</h1>
        <p className="text-muted-foreground">
          Manage and respond to student mentorship requests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold">Total Requests</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="font-semibold">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold">Replied</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.replied}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Archive className="h-5 w-5 text-gray-600" />
            </div>
            <h3 className="font-semibold">Closed</h3>
          </div>
          <p className="text-3xl font-bold text-gray-600">{stats.closed}</p>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <RequestFilters initialFilters={filters} />
      </Card>

      <RequestTable
        requests={initialData.requests}
        pagination={initialData.pagination}
        selectedRequests={selectedRequests}
        onSelectRequests={setSelectedRequests}
        currentAdmin={currentAdmin}
      />
    </div>
  );
}
