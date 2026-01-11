'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MessageSquare, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function UserFeedbackList({ feedback }) {
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'replied': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'resolved': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'suggestion': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'feedback': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  if (selectedFeedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedFeedback(null)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Feedback
          </Button>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getTypeColor(selectedFeedback.type)}>
                    {selectedFeedback.type}
                  </Badge>
                  <Badge className={getStatusColor(selectedFeedback.status)}>
                    {selectedFeedback.status}
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold mb-2">{selectedFeedback.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Submitted on {new Date(selectedFeedback.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Your Message:</h3>
              <p className="text-muted-foreground mb-4">{selectedFeedback.description}</p>

              {selectedFeedback.page && (
                <p className="text-xs text-muted-foreground mb-4">
                  Page: {selectedFeedback.page}
                </p>
              )}
            </div>

            {selectedFeedback.replies && selectedFeedback.replies.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-4">Admin Responses:</h3>
                <div className="space-y-4">
                  {selectedFeedback.replies.map((reply, index) => (
                    <div key={index} className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {reply.adminName?.[0] || 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{reply.adminName || reply.adminEmail}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(reply.repliedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">{reply.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Feedback</h1>
            <p className="text-muted-foreground mt-1">
              Track your bug reports and suggestions
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {feedback.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No feedback yet</h3>
            <p className="text-muted-foreground mb-4">
              Use the feedback button to report bugs or suggest improvements
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {feedback.map((item) => (
              <Card
                key={item._id}
                className="p-4 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedFeedback(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(item.type)}>
                        {item.type}
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      {item.replies && item.replies.length > 0 && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          {item.replies.length} {item.replies.length === 1 ? 'reply' : 'replies'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
