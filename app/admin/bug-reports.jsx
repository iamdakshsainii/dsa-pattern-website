'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, X, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BugReports() {
  const [bugs, setBugs] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    fetchBugs()
  }, [])

  const fetchBugs = async () => {
    try {
      const res = await fetch('/api/admin/bugs')
      if (res.ok) {
        const data = await res.json()
        setBugs(data.bugs || [])
      }
    } catch (error) {
      console.error('Failed to fetch bugs:', error)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/bugs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (res.ok) {
        toast({ title: `Bug marked as ${status}` })
        fetchBugs()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bug status",
        variant: "destructive"
      })
    }
  }

  const deleteBug = async (id) => {
    if (!confirm('Delete this bug report?')) return

    try {
      const res = await fetch(`/api/admin/bugs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: "Bug report deleted" })
        fetchBugs()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bug",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-700'
      case 'resolved': return 'bg-green-500/10 text-green-700'
      case 'closed': return 'bg-gray-500/10 text-gray-700'
      default: return 'bg-gray-500/10'
    }
  }

  const pendingCount = bugs.filter(b => b.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bug Reports</h2>
        <Badge variant="outline">{pendingCount} Pending</Badge>
      </div>

      {bugs.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No bug reports yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {bugs.map((bug) => (
            <Card key={bug._id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getStatusColor(bug.status)}>
                      {bug.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(bug.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{bug.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{bug.description}</p>
                  <div className="text-xs text-muted-foreground">
                    Reported by: {bug.userEmail}
                    {bug.page && ` • Page: ${bug.page}`}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {bug.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(bug._id, 'resolved')}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Resolve
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteBug(bug._id)}
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
