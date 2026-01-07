'use client'

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function NodesPageClient({ roadmap, initialNodes }) {
  const [nodes, setNodes] = useState(initialNodes)
  const { toast } = useToast()
  const router = useRouter()

  const publishedCount = nodes.filter(n => n.published).length
  const draftCount = nodes.filter(n => !n.published).length

  const handleTogglePublish = async (nodeId, currentPublished) => {
    try {
      const res = await fetch('/api/admin/nodes/toggle-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeId,
          published: !currentPublished
        })
      })

      if (res.ok) {
        setNodes(nodes.map(n =>
          n.nodeId === nodeId
            ? { ...n, published: !currentPublished }
            : n
        ))
        toast({
          title: currentPublished ? "Node unpublished" : "Node published",
          description: currentPublished
            ? "Node is now a draft"
            : "Node is now live"
        })
      } else {
        throw new Error('Failed to toggle publish')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (nodeId) => {
    if (!confirm('Delete this node? This cannot be undone.')) return

    try {
      const res = await fetch(`/api/admin/nodes/${nodeId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setNodes(nodes.filter(n => n.nodeId !== nodeId))
        toast({ title: "Node deleted" })
      } else {
        throw new Error('Failed to delete node')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{roadmap.title} - Nodes</h1>
          <p className="text-muted-foreground">
            Manage weeks and subtopics • {publishedCount} published, {draftCount} drafts
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/roadmaps/${roadmap.slug}/nodes/create`}>
            <Button>Add Node</Button>
          </Link>
          <Link href="/admin/roadmaps/import">
            <Button variant="outline">Bulk Import</Button>
          </Link>
        </div>
      </div>

      {nodes.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No nodes yet</p>
          <Link href={`/admin/roadmaps/${roadmap.slug}/nodes/create`}>
            <Button>Create First Node</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {nodes.map((node) => (
            <Card key={node.nodeId}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span>Week {node.weekNumber}: {node.title}</span>
                    {!node.published && (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                    {node.published && (
                      <Badge variant="default">Published</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTogglePublish(node.nodeId, node.published)}
                    >
                      {node.published ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Publish
                        </>
                      )}
                    </Button>
                    <Link href={`/admin/roadmaps/${roadmap.slug}/nodes/${node.nodeId}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(node.nodeId)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{node.description}</p>
                <p className="text-xs">
                  Subtopics: {node.subtopics?.length || 0} •
                  Created: {new Date(node.createdAt).toLocaleDateString()} •
                  By: {node.createdBy}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
