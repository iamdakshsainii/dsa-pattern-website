'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import UserStatsCards from './user-stats-cards';
import UserFilters from './user-filters';
import UserTable from './user-table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function UserManagementClient({ initialData, currentAdmin, filters }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const router = useRouter();

  const handleExportCSV = async () => {
    const res = await fetch('/api/admin/users/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters, userIds: selectedUsers })
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage all platform users and their activities
          </p>
        </div>
        <Button onClick={handleExportCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <UserStatsCards stats={initialData.pagination} users={initialData.users} />

      <Card className="p-6 mb-6">
        <UserFilters initialFilters={filters} />
      </Card>

      <UserTable
        users={initialData.users}
        pagination={initialData.pagination}
        selectedUsers={selectedUsers}
        onSelectUsers={setSelectedUsers}
        currentAdmin={currentAdmin}
      />
    </div>
  );
}
