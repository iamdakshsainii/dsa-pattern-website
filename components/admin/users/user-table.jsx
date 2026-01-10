'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MoreVertical, Eye, Ban, Trash2, Edit,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import BlockUserDialog from './block-user-dialog';
import DeleteUserDialog from './delete-user-dialog';
import EditAttemptsDialog from './edit-attempts-dialog';

export default function UserTable({ users, pagination, selectedUsers, onSelectUsers, currentAdmin }) {
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attemptsDialogOpen, setAttemptsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const router = useRouter();

  const toggleUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      onSelectUsers(selectedUsers.filter(id => id !== userId));
    } else {
      onSelectUsers([...selectedUsers, userId]);
    }
  };

  const toggleAll = () => {
    if (selectedUsers.length === users.length) {
      onSelectUsers([]);
    } else {
      onSelectUsers(users.map(u => u._id));
    }
  };

  const openBlockDialog = (user) => {
    setSelectedUser(user);
    setDropdownOpen(null);
    setBlockDialogOpen(true);
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setDropdownOpen(null);
    setDeleteDialogOpen(true);
  };

  const openAttemptsDialog = (user) => {
    setSelectedUser(user);
    setDropdownOpen(null);
    setAttemptsDialogOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="p-4 text-left font-semibold">User</th>
                <th className="p-4 text-left font-semibold">Email</th>
                <th className="p-4 text-left font-semibold">Joined</th>
                <th className="p-4 text-left font-semibold">Roadmaps</th>
                <th className="p-4 text-left font-semibold">Quizzes</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedUsers.includes(user._id)}
                      onCheckedChange={() => toggleUser(user._id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user.name?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{user.name || 'No Name'}</div>
                        <div className="text-xs text-muted-foreground">ID: {user._id.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{user.email}</td>
                  <td className="p-4 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm">
                    <Badge variant="outline">{user.stats?.roadmaps || 0}</Badge>
                  </td>
                  <td className="p-4 text-sm">
                    <Badge variant="outline">{user.stats?.quizzes || 0}</Badge>
                  </td>
                  <td className="p-4">
                    {user.isBlocked ? (
                      <Badge variant="destructive">Blocked</Badge>
                    ) : (
                      <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900/30">Active</Badge>
                    )}
                  </td>
                  <td className="p-4">
                    <DropdownMenu
                      open={dropdownOpen === user._id}
                      onOpenChange={(open) => setDropdownOpen(open ? user._id : null)}
                      modal={false}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${user._id}`} className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openAttemptsDialog(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Attempts
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openBlockDialog(user)}>
                          <Ban className="h-4 w-4 mr-2" />
                          {user.isBlocked ? 'Unblock User' : 'Block User'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(user)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {users.length} of {pagination.total} users
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => router.push(`/admin/users?page=${pagination.page - 1}`)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasMore}
              onClick={() => router.push(`/admin/users?page=${pagination.page + 1}`)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {selectedUser && (
        <>
          <BlockUserDialog
            key={`block-${selectedUser._id}-${blockDialogOpen}`}
            open={blockDialogOpen}
            onOpenChange={setBlockDialogOpen}
            user={selectedUser}
            currentAdmin={currentAdmin}
          />
          <DeleteUserDialog
            key={`delete-${selectedUser._id}-${deleteDialogOpen}`}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            user={selectedUser}
          />
          <EditAttemptsDialog
            key={`attempts-${selectedUser._id}-${attemptsDialogOpen}`}
            open={attemptsDialogOpen}
            onOpenChange={setAttemptsDialogOpen}
            user={selectedUser}
          />
        </>
      )}
    </>
  );
}
