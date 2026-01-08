"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Save, Trash2, Eye, FileText, BookOpen, ArrowLeft } from "lucide-react"
import Link from "next/link"

const categories = ["DSA", "Web Development", "System Design", "Database", "Programming"]
const difficulties = ["Beginner", "Intermediate", "Advanced"]

export default function RoadmapEditorClient({ roadmap: initialRoadmap }) {
  const router = useRouter()
  const [roadmap, setRoadmap] = useState(initialRoadmap)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function handleChange(field, value) {
    setRoadmap(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/roadmaps/${roadmap.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roadmap)
      })

      if (res.ok) {
        alert("Roadmap updated successfully")
      } else {
        alert("Failed to update roadmap")
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to update roadmap")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this roadmap permanently? This cannot be undone.")) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/roadmaps/${roadmap.slug}`, {
        method: "DELETE"
      })

      if (res.ok) {
        router.push("/admin/roadmaps")
      } else {
        alert("Failed to delete roadmap")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete roadmap")
    } finally {
      setDeleting(false)
    }
  }

  async function handlePublish() {
    try {
      const res = await fetch(`/api/admin/roadmaps/${roadmap.slug}/publish`, {
        method: "POST"
      })

      if (res.ok) {
        setRoadmap(prev => ({ ...prev, published: true }))
        alert("Roadmap published successfully")
      }
    } catch (error) {
      console.error("Publish error:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Edit Roadmap
              {roadmap.published ? (
                <Badge>Published</Badge>
              ) : (
                <Badge variant="secondary">Draft</Badge>
              )}
            </h1>
            <p className="text-muted-foreground">{roadmap.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/roadmaps/${roadmap.slug}`}>
              <Eye className="w-4 h-4 mr-2" />
              View Live
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/roadmaps/${roadmap.slug}/nodes`}>
              <FileText className="w-4 h-4 mr-2" />
              Manage Nodes
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/roadmaps/${roadmap.slug}/quiz-bank`}>
              <BookOpen className="w-4 h-4 mr-2" />
              Manage Quizzes
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Nodes</div>
          <div className="text-2xl font-bold">{roadmap.stats?.totalNodes || 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Resources</div>
          <div className="text-2xl font-bold">{roadmap.stats?.totalResources || 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Followers</div>
          <div className="text-2xl font-bold">{roadmap.stats?.followers || 0}</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={roadmap.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug (Read-only)</Label>
              <Input value={roadmap.slug} disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={roadmap.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Input
                value={roadmap.icon}
                onChange={(e) => handleChange("icon", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={roadmap.category} onValueChange={(v) => handleChange("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={roadmap.difficulty} onValueChange={(v) => handleChange("difficulty", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(diff => (
                    <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input
                type="number"
                value={roadmap.order}
                onChange={(e) => handleChange("order", parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Published</Label>
                <p className="text-sm text-muted-foreground">Make roadmap visible to users</p>
              </div>
              <Switch
                checked={roadmap.published}
                onCheckedChange={(v) => handleChange("published", v)}
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? "Deleting..." : "Delete Roadmap"}
            </Button>
            <div className="flex gap-2">
              {!roadmap.published && (
                <Button variant="outline" onClick={handlePublish}>
                  Publish Roadmap
                </Button>
              )}
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
