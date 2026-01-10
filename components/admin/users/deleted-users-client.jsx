'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, Calendar, User, Mail } from 'lucide-react';
import Link from 'next/link';

export default function DeletedUsersClient({ initialData, filters }) {
  const [search, setSearch] = useState(filters.search);
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    router.push(`/admin/users/deleted?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <Link href="/admin/users">
        <Button variant="ghost" className="mb-6 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Deleted Users History</h1>
        <p className="text-muted-foreground">
          Audit log of all permanently deleted user accounts
        </p>
      </div>

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
      </Card>

      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Deleted Users</h2>
            <Badge variant="secondary">
              Total: {initialData.pagination.total}
            </Badge>
          </div>

          {initialData.users.length === 0 ? (
            <div className="text-center py-12">
              <Trash2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No deleted users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {initialData.users.map((deletedUser) => (
                <div
                  key={deletedUser._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">{deletedUser.name}</h3>
                        {deletedUser.metadata?.isBlocked && (
                          <Badge variant="destructive">Was Blocked</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Mail className="h-4 w-4" />
                        {deletedUser.email}
                      </div>
                      {deletedUser.username && (
                        <p className="text-sm text-muted-foreground">
                          Username: @{deletedUser.username}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded p-3">
                      <p className="text-xs text-muted-foreground mb-1">Deleted By</p>
                      <p className="text-sm font-medium">{deletedUser.deletedBy}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded p-3">
                      <p className="text-xs text-muted-foreground mb-1">Deleted On</p>
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(deletedUser.deletedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {deletedUser.deleteReason && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded p-3">
                      <p className="text-xs text-red-900 dark:text-red-300 font-medium mb-1">
                        Delete Reason:
                      </p>
                      <p className="text-sm text-red-800 dark:text-red-200">
                        {deletedUser.deleteReason}
                      </p>
                    </div>
                  )}

                  {deletedUser.metadata?.blockReason && (
                    <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900 rounded p-3">
                      <p className="text-xs text-yellow-900 dark:text-yellow-300 font-medium mb-1">
                        Previous Block Reason:
                      </p>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {deletedUser.metadata.blockReason}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3 pt-3 border-t">
                    <span>User ID: {deletedUser.originalId}</span>
                    <span>•</span>
                    <span>
                      Joined: {new Date(deletedUser.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {initialData.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {filters.page > 1 && (
                <Link href={`/admin/users/deleted?page=${filters.page - 1}${search ? `&search=${search}` : ''}`}>
                  <Button variant="outline" size="sm">Previous</Button>
                </Link>
              )}
              <span className="flex items-center px-4 text-sm">
                Page {filters.page} of {initialData.pagination.totalPages}
              </span>
              {filters.page < initialData.pagination.totalPages && (
                <Link href={`/admin/users/deleted?page=${filters.page + 1}${search ? `&search=${search}` : ''}`}>
                  <Button variant="outline" size="sm">Next</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
