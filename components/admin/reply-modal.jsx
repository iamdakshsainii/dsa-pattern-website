'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Send } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ReplyModal({ bug, onClose, isOpen, onSubmit }) {
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  if (!isOpen || !bug) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!reply.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply",
        variant: "destructive"
      })
      return
    }

    setSending(true)

    try {
      if (onSubmit) {
        await onSubmit(reply.trim())
        setReply('')
      } else {
        const response = await fetch(`/api/admin/bugs/${bug._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reply: reply.trim()
          })
        })

        if (!response.ok) throw new Error('Failed to send reply')

        toast({
          title: "Success",
          description: "Reply sent successfully"
        })

        setReply('')
        onClose()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive"
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Reply to Feedback</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{bug.type || 'bug'}</Badge>
              <Badge>{bug.status}</Badge>
            </div>
            <h3 className="font-semibold text-lg mb-2">{bug.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{bug.description}</p>
            <p className="text-xs text-muted-foreground">
              From: {bug.userEmail} • {new Date(bug.createdAt).toLocaleDateString()}
            </p>
          </div>

          {bug.replies && bug.replies.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Previous Replies:</h4>
              <div className="space-y-3">
                {bug.replies.map((r, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <p className="text-sm font-semibold mb-1">
                      {r.adminName || r.adminEmail}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">{r.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.repliedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="border-t pt-4">
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply here..."
              rows={6}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={sending}>
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
