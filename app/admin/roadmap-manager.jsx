'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Edit, Trash2, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const CATEGORIES = ["DSA", "Data Science", "Web Development", "Cybersecurity", "Mobile Development", "DevOps", "Machine Learning"]
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"]

export default function RoadmapManager() {
  const [roadmaps, setRoadmaps] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingRoadmap, setEditingRoadmap] = useState(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
    category: "DSA",
    difficulty: "Beginner",
    estimatedWeeks: 12,
    icon: "🗺️",
    color: "#3b82f6",
    prerequisites: "",
    outcomes: "",
    targetRoles: "",
    order: 999
  })

  useEffect(() => {
    fetchRoadmaps()
  }, [])

  const fetchRoadmaps = async () => {
    try {
      const res = await fetch('/api/admin/roadmaps')
      if (res.ok) {
        const data = await res.json()
        setRoadmaps(data.roadmaps || [])
      }
    } catch (error) {
      console.error('Failed to fetch roadmaps:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const roadmapData = {
      ...formData,
      prerequisites: formData.prerequisites.split(',').map(s => s.trim()).filter(Boolean),
      outcomes: formData.outcomes.split(',').map(s => s.trim()).filter(Boolean),
      targetRoles: formData.targetRoles.split(',').map(s => s.trim()).filter(Boolean),
      estimatedWeeks: parseInt(formData.estimatedWeeks),
      order: parseInt(formData.order)
    }

    try {
      const url = editingRoadmap
        ? `/api/admin/roadmaps/${editingRoadmap._id}`
        : '/api/admin/roadmaps'

      const method = editingRoadmap ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roadmapData)
      })

      if (res.ok) {
        toast({
          title: editingRoadmap ? "Roadmap updated" : "Roadmap created"
        })
        fetchRoadmaps()
        resetForm()
        setIsCreating(false)
      } else {
        const error = await res.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save roadmap",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save roadmap",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (roadmap) => {
    setEditingRoadmap(roadmap)
    setFormData({
      slug: roadmap.slug,
      title: roadmap.title,
      description: roadmap.description,
      category: roadmap.category,
      difficulty: roadmap.difficulty,
      estimatedWeeks: roadmap.estimatedWeeks,
      icon: roadmap.icon,
      color: roadmap.color,
      prerequisites: roadmap.prerequisites?.join(', ') || "",
      outcomes: roadmap.outcomes?.join(', ') || "",
      targetRoles: roadmap.targetRoles?.join(', ') || "",
      order: roadmap.order || 999
    })
    setIsCreating(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this roadmap? This will also delete all associated nodes.')) return

    try {
      const res = await fetch(`/api/admin/roadmaps/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast({ title: "Roadmap deleted" })
        fetchRoadmaps()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete roadmap",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      description: "",
      category: "DSA",
      difficulty: "Beginner",
      estimatedWeeks: 12,
      icon: "🗺️",
      color: "#3b82f6",
      prerequisites: "",
      outcomes: "",
      targetRoles: "",
      order: 999
    })
    setEditingRoadmap(null)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500/10 text-green-700"
      case "Intermediate": return "bg-yellow-500/10 text-yellow-700"
      case "Advanced": return "bg-red-500/10 text-red-700"
      default: return "bg-gray-500/10"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Roadmap Manager</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsCreating(true); }} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Roadmap
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRoadmap ? "Edit Roadmap" : "Create New Roadmap"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Slug (URL-friendly)</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="data-analyst-roadmap"
                    required
                    disabled={!!editingRoadmap}
                  />
                </div>
                <div>
                  <Label>Icon (Emoji)</Label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="📊"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Data Analyst Roadmap"
                  required
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Master data analysis from scratch..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) => setFormData({...formData, category: val})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(val) => setFormData({...formData, difficulty: val})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map(diff => (
                        <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Estimated Weeks</Label>
                  <Input
                    type="number"
                    value={formData.estimatedWeeks}
                    onChange={(e) => setFormData({...formData, estimatedWeeks: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Color (Hex)</Label>
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    placeholder="#3b82f6"
                  />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Prerequisites (comma-separated)</Label>
                <Input
                  value={formData.prerequisites}
                  onChange={(e) => setFormData({...formData, prerequisites: e.target.value})}
                  placeholder="Basic programming, High school math"
                />
              </div>

              <div>
                <Label>Learning Outcomes (comma-separated)</Label>
                <Textarea
                  value={formData.outcomes}
                  onChange={(e) => setFormData({...formData, outcomes: e.target.value})}
                  placeholder="SQL Mastery, Data Visualization, Python"
                  rows={2}
                />
              </div>

              <div>
                <Label>Target Roles (comma-separated)</Label>
                <Input
                  value={formData.targetRoles}
                  onChange={(e) => setFormData({...formData, targetRoles: e.target.value})}
                  placeholder="Data Analyst, Business Analyst"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingRoadmap ? "Update Roadmap" : "Create Roadmap"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { resetForm(); setIsCreating(false); }}
                  className="flex-1 sm:flex-initial"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {roadmaps.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No roadmaps created yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {roadmaps.map((roadmap) => (
            <Card key={roadmap._id} className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{roadmap.icon}</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-1">{roadmap.title}</h3>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {roadmap.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {roadmap.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <BookOpen className="h-3 w-3 flex-shrink-0" />
                <span>{roadmap.stats?.totalNodes || 0} topics</span>
                <span>•</span>
                <span>{roadmap.estimatedWeeks}w</span>
              </div>

              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleEdit(roadmap)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2"
                  onClick={() => handleDelete(roadmap._id)}
                >
                  <Trash2 className="h-3 w-3 text-red-600" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
