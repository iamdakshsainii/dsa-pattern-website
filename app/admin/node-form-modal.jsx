'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Plus, Trash2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import RichTextEditor from "@/components/admin/rich-text-editor"
import ResourceLinkInput from "@/components/admin/resource-link-input"

export default function NodeFormModal({ isOpen, onClose, node, roadmapId, onSuccess }) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [expandedSubtopic, setExpandedSubtopic] = useState(0)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    weekNumber: 1,
    estimatedHours: 6,
    order: 999,
    published: false,
    subtopics: []
  })

  useEffect(() => {
    if (node) {
      setFormData({
        title: node.title || '',
        description: node.description || '',
        weekNumber: node.weekNumber || 1,
        estimatedHours: node.estimatedHours || 6,
        order: node.order || 999,
        published: node.published || false,
        subtopics: node.subtopics || []
      })
    } else {
      setFormData({
        title: '',
        description: '',
        weekNumber: 1,
        estimatedHours: 6,
        order: 999,
        published: false,
        subtopics: []
      })
    }
  }, [node, isOpen])

  const addSubtopic = () => {
    setFormData({
      ...formData,
      subtopics: [
        ...formData.subtopics,
        {
          title: '',
          description: '',
          estimatedMinutes: 30,
          resourceLinks: {
            youtube: [],
            article: [],
            practice: []
          }
        }
      ]
    })
    setExpandedSubtopic(formData.subtopics.length)
  }

  const removeSubtopic = (index) => {
    setFormData({
      ...formData,
      subtopics: formData.subtopics.filter((_, i) => i !== index)
    })
  }

  const updateSubtopic = (index, field, value) => {
    const updatedSubtopics = [...formData.subtopics]
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      updatedSubtopics[index][parent][child] = value
    } else {
      updatedSubtopics[index][field] = value
    }
    setFormData({ ...formData, subtopics: updatedSubtopics })
  }

  const handleSubmit = async (publishNow = false) => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Title and description are required",
        variant: "destructive"
      })
      return
    }

    setSaving(true)

    try {
      // Use either _id or nodeId depending on what the node has
      const nodeIdentifier = node?._id || node?.nodeId
      const url = nodeIdentifier
        ? `/api/admin/nodes/${nodeIdentifier}`
        : '/api/admin/nodes'
      const method = nodeIdentifier ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        roadmapId,
        published: publishNow || formData.published,
        wasPublished: node?.published
      }

      console.log('Submitting to:', url, 'Method:', method)

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast({
          title: publishNow ? "Node published!" : node ? "Node updated" : "Node created",
          description: publishNow ? "Node is now live" : "Changes saved successfully"
        })
        onSuccess()
      } else {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save node')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to save node",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {node ? "Edit Node" : "Create New Node"}
          </DialogTitle>
          <DialogDescription>
            {node
              ? "Update the node details below. Changes will be saved to your roadmap."
              : "Fill in the details to create a new learning node for your roadmap."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Node Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Introduction to Databases"
              />
            </div>

            <div className="col-span-2">
              <Label>Description *</Label>
              <RichTextEditor
                value={formData.description}
                onChange={(val) => setFormData({ ...formData, description: val })}
                placeholder="Learn what databases are and why they're essential..."
                rows={3}
              />
            </div>

            <div>
              <Label>Week Number</Label>
              <Input
                type="number"
                value={formData.weekNumber}
                onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) })}
                min="1"
              />
            </div>

            <div>
              <Label>Estimated Hours</Label>
              <Input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) })}
                min="1"
              />
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Publish Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.published ? "Published - visible to users" : "Draft - only visible to admins"}
                  </p>
                </div>
                <Switch
                  checked={formData.published}
                  onCheckedChange={(val) => setFormData({ ...formData, published: val })}
                />
              </div>
            </div>
          </div>

          {/* Subtopics */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg">Subtopics ({formData.subtopics.length})</Label>
              <Button type="button" size="sm" onClick={addSubtopic}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subtopic
              </Button>
            </div>

            {formData.subtopics.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <p className="text-muted-foreground">No subtopics added yet</p>
                <Button type="button" size="sm" variant="outline" className="mt-2" onClick={addSubtopic}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Subtopic
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {formData.subtopics.map((subtopic, index) => {
                  const isExpanded = expandedSubtopic === index

                  return (
                    <Card key={index} className="p-4">
                      {/* Subtopic Header */}
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedSubtopic(isExpanded ? -1 : index)}
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          <div>
                            <p className="font-medium">
                              {subtopic.title || `Subtopic ${index + 1}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {subtopic.estimatedMinutes || 0} min •
                              {(subtopic.resourceLinks?.youtube?.length || 0) +
                               (subtopic.resourceLinks?.article?.length || 0) +
                               (subtopic.resourceLinks?.practice?.length || 0)} resources
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeSubtopic(index)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>

                      {/* Subtopic Details */}
                      {isExpanded && (
                        <div className="mt-4 space-y-4 pt-4 border-t">
                          <div>
                            <Label>Subtopic Title *</Label>
                            <Input
                              value={subtopic.title}
                              onChange={(e) => updateSubtopic(index, 'title', e.target.value)}
                              placeholder="What are Databases?"
                            />
                          </div>

                          <div>
                            <Label>Description</Label>
                            <RichTextEditor
                              value={subtopic.description || ''}
                              onChange={(val) => updateSubtopic(index, 'description', val)}
                              placeholder="Brief overview of database concepts..."
                              rows={2}
                            />
                          </div>

                          <div>
                            <Label>Estimated Minutes</Label>
                            <Input
                              type="number"
                              value={subtopic.estimatedMinutes || 30}
                              onChange={(e) => updateSubtopic(index, 'estimatedMinutes', parseInt(e.target.value))}
                              min="1"
                            />
                          </div>

                          {/* Resources */}
                          <div className="space-y-3 pt-3 border-t">
                            <Label className="text-sm font-semibold">📺 YouTube Resources</Label>
                            <ResourceLinkInput
                              links={subtopic.resourceLinks?.youtube || []}
                              onChange={(links) => updateSubtopic(index, 'resourceLinks.youtube', links)}
                              placeholder="Add YouTube link (auto-detected)"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-semibold">📄 Article Resources</Label>
                            <ResourceLinkInput
                              links={subtopic.resourceLinks?.article || []}
                              onChange={(links) => updateSubtopic(index, 'resourceLinks.article', links)}
                              placeholder="Add article link (auto-detected)"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-semibold">💻 Practice Resources</Label>
                            <ResourceLinkInput
                              links={subtopic.resourceLinks?.practice || []}
                              onChange={(links) => updateSubtopic(index, 'resourceLinks.practice', links)}
                              placeholder="Add practice link (auto-detected)"
                            />
                          </div>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {formData.published ? "Save Changes" : "Save as Draft"}
            </Button>
            {!formData.published && (
              <Button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={saving}
                className="flex-1"
              >
                Publish Now
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
