'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AppealsClient({ initialData, stats, filters }) {
  const [search, setSearch] = useState(filters.search);
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filters.status !== 'all') params.set('status', filters.status);
    router.push(`/admin/appeals?${params.toString()}`);
  };

  const handleStatusFilter = (status) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('status', status);
    router.push(`/admin/appeals?${params.toString()}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_review': return <AlertCircle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in_review': return 'default';
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">User Appeals</h1>
        <p className="text-muted-foreground">
          Review and respond to user account suspension appeals
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Appeals</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-md" onClick={() => handleStatusFilter('pending')}>
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-md" onClick={() => handleStatusFilter('in_review')}>
          <p className="text-sm text-muted-foreground">In Review</p>
          <p className="text-2xl font-bold text-blue-600">{stats.inReview}</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-md" onClick={() => handleStatusFilter('approved')}>
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-md" onClick={() => handleStatusFilter('rejected')}>
          <p className="text-sm text-muted-foreground">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex gap-3">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="flex gap-2 mt-3">
          {['all', 'pending', 'in_review', 'approved', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={filters.status === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter(status)}
            >
              {status.replace('_', ' ').toUpperCase()}
            </Button>
          ))}
        </div>
      </Card>

      {/* Appeals Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Appeals List</h2>

          {initialData.appeals.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No appeals found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {initialData.appeals.map((appeal) => (
                <div
                  key={appeal._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{appeal.userName}</h3>
                        <Badge variant={getStatusVariant(appeal.status)} className="flex items-center gap-1">
                          {getStatusIcon(appeal.status)}
                          {appeal.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{appeal.userEmail}</p>
                      <p className="text-sm">
                        <span className="font-medium">Block Reason:</span> {appeal.blockReason}
                      </p>
                    </div>
                    <Link href={`/admin/appeals/${appeal._id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm">
                    <p className="text-muted-foreground mb-1">Appeal Message:</p>
                    <p className="line-clamp-2">{appeal.message}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Submitted: {new Date(appeal.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
