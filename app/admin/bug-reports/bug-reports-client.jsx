"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, X, MessageSquare, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ReplyModal from "@/components/admin/reply-modal"

export default function BugReportsClient() {
  const [bugs, setBugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBug, setSelectedBug] = useState(null)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchBugs()
  }, [])

  const fetchBugs = async () => {
    try {
      const res = await fetch("/api/admin/bugs")
      if (res.ok) {
        const data = await res.json()
        setBugs(data.bugs)
      }
    } catch (error) {
      console.error("Failed to fetch bugs:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (bugId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/bugs/${bugId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        setBugs(bugs.map(bug =>
          bug._id === bugId ? { ...bug, status: newStatus } : bug
        ))
        toast({
          title: "Status Updated",
          description: `Report marked as ${newStatus}`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      })
    }
  }

  const deleteBug = async (bugId) => {
    if (!confirm("Are you sure you want to delete this report?")) return

    try {
      const res = await fetch(`/api/admin/bugs/${bugId}`, {
        method: "DELETE"
      })

      if (res.ok) {
        setBugs(bugs.filter(bug => bug._id !== bugId))
        toast({
          title: "Deleted",
          description: "Report deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive"
      })
    }
  }

  const handleReply = (bug) => {
    setSelectedBug(bug)
    setIsReplyModalOpen(true)
  }

  const handleReplySubmit = async (reply) => {
    try {
      const res = await fetch(`/api/admin/bugs/${selectedBug._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply })
      })

      if (res.ok) {
        // Refresh bugs to show new reply
        await fetchBugs()
        setIsReplyModalOpen(false)
        setSelectedBug(null)
        toast({
          title: "Reply Sent",
          description: "Your reply has been sent to the user",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      pending: { color: "bg-yellow-500", label: "Pending", icon: Clock },
      resolved: { color: "bg-green-500", label: "Resolved", icon: CheckCircle2 },
      rejected: { color: "bg-red-500", label: "Rejected", icon: X },
      replied: { color: "bg-blue-500", label: "Replied", icon: MessageSquare }
    }

    const variant = variants[status] || variants.pending
    const Icon = variant.icon

    return (
      <Badge className={`${variant.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {variant.label}
      </Badge>
    )
  }

  const getTypeBadge = (type) => {
    const colors = {
      bug: "bg-red-100 text-red-800",
      feature: "bg-blue-100 text-blue-800",
      improvement: "bg-purple-100 text-purple-800",
      question: "bg-green-100 text-green-800"
    }

    return (
      <Badge variant="outline" className={colors[type] || colors.bug}>
        {type || "bug"}
      </Badge>
    )
  }

  const filterBugs = (status) => {
    if (status === "all") return bugs
    return bugs.filter(bug => bug.status === status)
  }

  const renderBugCard = (bug) => (
    <Card key={bug._id} className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getTypeBadge(bug.type)}
            {getStatusBadge(bug.status)}
          </div>
          <h3 className="text-lg font-semibold mb-1">{bug.title}</h3>
          <p className="text-sm text-muted-foreground">{bug.description}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">From:</span>
          <span>{bug.userEmail}</span>
        </div>
        {bug.page && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Page:</span>
            <span>{bug.page}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="font-medium">Submitted:</span>
          <span>{new Date(bug.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Replies Section */}
      {bug.replies && bug.replies.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Replies ({bug.replies.length})
          </h4>
          <div className="space-y-2">
            {bug.replies.map((reply, index) => (
              <div key={index} className="text-sm p-3 bg-white dark:bg-slate-900 rounded border">
                <p className="text-muted-foreground mb-1">{reply.message}</p>
                <p className="text-xs text-muted-foreground">
                  By {reply.adminName} • {new Date(reply.repliedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleReply(bug)}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Reply
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="text-green-600 hover:text-green-700"
          onClick={() => updateStatus(bug._id, "resolved")}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Resolve
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="text-red-600 hover:text-red-700"
          onClick={() => updateStatus(bug._id, "rejected")}
        >
          <X className="w-4 h-4 mr-2" />
          Reject
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="ml-auto text-red-600 hover:text-red-700"
          onClick={() => deleteBug(bug._id)}
        >
          Delete
        </Button>
      </div>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bug Reports & Feedback</h1>
        <p className="text-muted-foreground">
          Manage user-submitted reports and feedback
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="all">
            All ({bugs.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            <Clock className="w-4 h-4 mr-2" />
            Pending ({filterBugs("pending").length})
          </TabsTrigger>
          <TabsTrigger value="replied">
            <MessageSquare className="w-4 h-4 mr-2" />
            Replied ({filterBugs("replied").length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Resolved ({filterBugs("resolved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            <X className="w-4 h-4 mr-2" />
            Rejected ({filterBugs("rejected").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {bugs.length === 0 ? (
            <Card className="p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No reports yet</p>
            </Card>
          ) : (
            bugs.map(renderBugCard)
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterBugs("pending").length === 0 ? (
            <Card className="p-8 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No pending reports</p>
            </Card>
          ) : (
            filterBugs("pending").map(renderBugCard)
          )}
        </TabsContent>

        <TabsContent value="replied" className="space-y-4">
          {filterBugs("replied").length === 0 ? (
            <Card className="p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No replied reports</p>
            </Card>
          ) : (
            filterBugs("replied").map(renderBugCard)
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {filterBugs("resolved").length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No resolved reports</p>
            </Card>
          ) : (
            filterBugs("resolved").map(renderBugCard)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filterBugs("rejected").length === 0 ? (
            <Card className="p-8 text-center">
              <X className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No rejected reports</p>
            </Card>
          ) : (
            filterBugs("rejected").map(renderBugCard)
          )}
        </TabsContent>
      </Tabs>

      <ReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => {
          setIsReplyModalOpen(false)
          setSelectedBug(null)
        }}
        onSubmit={handleReplySubmit}
        bug={selectedBug}
      />
    </div>
  )
}
