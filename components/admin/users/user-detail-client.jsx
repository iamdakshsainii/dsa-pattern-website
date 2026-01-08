'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Mail, Calendar, Shield, Ban, Trash2 } from 'lucide-react';
import AdminNotesSection from './admin-notes-section';
import ActivityTimeline from './activity-timeline';
import BlockUserDialog from './block-user-dialog';
import DeleteUserDialog from './delete-user-dialog';

export default function UserDetailClient({ userInfo, timeline, currentAdmin }) {
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { user, profile, roadmaps, quizResults, stats } = userInfo;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-6">
        <Link href="/admin/users">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.name?.[0] || user.email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.name || 'No Name'}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {user.isBlocked ? (
              <Badge variant="destructive" className="gap-1">
                <Ban className="h-3 w-3" />
                Blocked
              </Badge>
            ) : (
              <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900/30 gap-1">
                <Shield className="h-3 w-3" />
                Active
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Roadmaps</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalRoadmaps}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Quiz Attempts</p>
          <p className="text-3xl font-bold text-purple-600">{stats.totalQuizzes}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Passed Quizzes</p>
          <p className="text-3xl font-bold text-green-600">{stats.passedQuizzes}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Pass Rate</p>
          <p className="text-3xl font-bold text-orange-600">
            {stats.totalQuizzes > 0 ? Math.round((stats.passedQuizzes / stats.totalQuizzes) * 100) : 0}%
          </p>
        </Card>
      </div>

      <div className="flex gap-2 mb-6">
        <Button variant="outline" onClick={() => setBlockDialogOpen(true)} className="gap-2">
          <Ban className="h-4 w-4" />
          {user.isBlocked ? 'Unblock User' : 'Block User'}
        </Button>
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete User
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="roadmaps">Roadmaps ({roadmaps.length})</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes ({quizResults.length})</TabsTrigger>
          <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
          <TabsTrigger value="notes">Admin Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm">{user._id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium">{new Date(user.created_at).toLocaleString()}</p>
                </div>
                {profile?.bio && (
                  <div>
                    <p className="text-sm text-muted-foreground">Bio</p>
                    <p className="font-medium">{profile.bio}</p>
                  </div>
                )}
              </div>
            </Card>

            {user.isBlocked && (
              <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-900/10">
                <h3 className="text-lg font-semibold mb-4 text-red-600">Block Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p className="font-medium">{user.blockReason}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blocked By</p>
                    <p className="font-medium">{user.blockedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blocked At</p>
                    <p className="font-medium">{new Date(user.blockedAt).toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="roadmaps">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roadmaps.length === 0 ? (
              <Card className="p-8 col-span-full text-center">
                <p className="text-muted-foreground">No roadmaps started yet</p>
              </Card>
            ) : (
              roadmaps.map((item) => (
                <Card key={item.roadmapId} className="p-4">
                  <h4 className="font-semibold mb-2">{item.roadmap?.title || item.roadmapId}</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{item.overallProgress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${item.overallProgress || 0}%` }}
                        />
                      </div>
                    </div>
                    {item.quizAttempts && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">Quiz Attempts</p>
                        <p className="text-sm font-medium">
                          {item.quizAttempts.used} / {item.quizAttempts.unlocked} used
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="quizzes">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                  <tr>
                    <th className="p-4 text-left font-semibold">Roadmap</th>
                    <th className="p-4 text-left font-semibold">Attempt #</th>
                    <th className="p-4 text-left font-semibold">Score</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Completed At</th>
                  </tr>
                </thead>
                <tbody>
                  {quizResults.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No quiz attempts yet
                      </td>
                    </tr>
                  ) : (
                    quizResults.map((quiz, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-4">{quiz.roadmapId}</td>
                        <td className="p-4">#{quiz.attemptNumber}</td>
                        <td className="p-4 font-medium">{quiz.percentage}%</td>
                        <td className="p-4">
                          {quiz.passed ? (
                            <Badge variant="success" className="bg-green-100 text-green-800">Passed</Badge>
                          ) : (
                            <Badge variant="destructive">Failed</Badge>
                          )}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(quiz.completedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <ActivityTimeline timeline={timeline} />
        </TabsContent>

        <TabsContent value="notes">
          <AdminNotesSection userId={user._id} initialNotes={user.adminNotes || ''} />
        </TabsContent>
      </Tabs>

      <BlockUserDialog
        open={blockDialogOpen}
        onOpenChange={setBlockDialogOpen}
        user={user}
        currentAdmin={currentAdmin}
      />
      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={user}
      />
    </div>
  );
}
