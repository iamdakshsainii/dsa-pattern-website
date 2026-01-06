'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Edit, Trash2, Copy, Eye, FileText, Archive } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import NodeFormModal from "./node-form-modal"

export default function NodeManager() {
  const [roadmaps, setRoadmaps] = useState([])
  const [selectedRoadmap, setSelectedRoadmap] = useState('')
  const [nodes, setNodes] = useState([])
  const [selectedNodes, setSelectedNodes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNode, setEditingNode] = useState(null)
  const [filterMode, setFilterMode] = useState('all')
  const { toast } = useToast()

  useEffect(() => {
    fetchRoadmaps()
  }, [])

  useEffect(() => {
    if (selectedRoadmap) {
      fetchNodes()
    }
  }, [selectedRoadmap])

  const fetchRoadmaps = async () => {
    try {
      const res = await fetch('/api/admin/roadmaps')
      if (res.ok) {
        const data = await res.json()
        setRoadmaps(data.roadmaps || [])
        if (data.roadmaps?.length > 0) {
          setSelectedRoadmap(data.roadmaps[0].slug)
        }
      }
    } catch (error) {
      console.error('Failed to fetch roadmaps:', error)
    }
  }

  const fetchNodes = async () => {
    try {
      const res = await fetch(`/api/admin/nodes?roadmapId=${selectedRoadmap}`)
      if (res.ok) {
        const data = await res.json()
        setNodes(data.nodes || [])
      }
    } catch (error) {
      console.error('Failed to fetch nodes:', error)
    }
  }

  const handleEdit = (node) => {
    setEditingNode(node)
    setIsModalOpen(true)
  }

  const handleDelete = async (nodeId) => {
    if (!confirm('Delete this node? This cannot be undone.')) return

    try {
      const res = await fetch(`/api/admin/nodes/${nodeId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast({ title: "Node deleted" })
        fetchNodes()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete node",
        variant: "destructive"
      })
    }
  }

  const handleClone = async (node) => {
    const clonedNode = {
      ...node,
      title: `${node.title} (Copy)`,
      published: false
    }
    delete clonedNode._id
    delete clonedNode.nodeId

    setEditingNode(clonedNode)
    setIsModalOpen(true)
  }

  const handleBulkAction = async (action) => {
    if (selectedNodes.length === 0) {
      toast({
        title: "No nodes selected",
        description: "Select at least one node",
        variant: "destructive"
      })
      return
    }

    if (action === 'delete' && !confirm(`Delete ${selectedNodes.length} nodes?`)) {
      return
    }

    try {
      const res = await fetch('/api/admin/nodes/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          nodeIds: selectedNodes
        })
      })

      if (res.ok) {
        toast({ title: `Bulk ${action} completed` })
        setSelectedNodes([])
        fetchNodes()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} nodes`,
        variant: "destructive"
      })
    }
  }

  const toggleNodeSelection = (nodeId) => {
    setSelectedNodes(prev =>
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    )
  }

  const filteredNodes = nodes.filter(n => {
    if (filterMode === 'published') return n.published
    if (filterMode === 'draft') return !n.published
    return true
  })

  const publishedCount = nodes.filter(n => n.published).length
  const draftCount = nodes.filter(n => !n.published).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Node Manager</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage learning nodes and subtopics
          </p>
        </div>
        <Button onClick={() => { setEditingNode(null); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Node
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Select Roadmap</label>
            <Select value={selectedRoadmap} onValueChange={setSelectedRoadmap}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roadmaps.map(roadmap => (
                  <SelectItem key={roadmap.slug} value={roadmap.slug}>
                    {roadmap.icon} {roadmap.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border">
              <Button
                size="sm"
                variant={filterMode === 'all' ? "default" : "ghost"}
                onClick={() => setFilterMode('all')}
                className="rounded-r-none"
              >
                <Eye className="h-4 w-4 mr-2" />
                All ({nodes.length})
              </Button>
              <Button
                size="sm"
                variant={filterMode === 'published' ? "default" : "ghost"}
                onClick={() => setFilterMode('published')}
                className="rounded-none border-x"
              >
                <FileText className="h-4 w-4 mr-2" />
                Published ({publishedCount})
              </Button>
              <Button
                size="sm"
                variant={filterMode === 'draft' ? "default" : "ghost"}
                onClick={() => setFilterMode('draft')}
                className="rounded-l-none"
              >
                <Archive className="h-4 w-4 mr-2" />
                Drafts ({draftCount})
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {selectedNodes.length > 0 && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {selectedNodes.length} node{selectedNodes.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('publish')}>
                Publish
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('unpublish')}>
                Unpublish
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                Delete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {filteredNodes.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            {selectedRoadmap
              ? `No ${filterMode === 'all' ? '' : filterMode} nodes found for this roadmap`
              : 'Select a roadmap to view nodes'}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredNodes.map((node) => (
            <Card key={node._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedNodes.includes(node._id)}
                  onCheckedChange={() => toggleNodeSelection(node._id)}
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{node.title}</h3>
                        {!node.published && (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Week {node.weekNumber} • {node.estimatedHours}h • {node.subtopics?.length || 0} subtopics
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(node)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleClone(node)}>
                      <Copy className="h-3 w-3 mr-1" />
                      Clone
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(node._id)}>
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <NodeFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingNode(null)
        }}
        node={editingNode}
        roadmapId={selectedRoadmap}
        onSuccess={() => {
          setIsModalOpen(false)
          setEditingNode(null)
          fetchNodes()
        }}
      />
    </div>
  )
}
