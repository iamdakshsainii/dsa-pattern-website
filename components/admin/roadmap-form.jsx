"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function RoadmapForm({ roadmap }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: roadmap?.title || "",
    slug: roadmap?.slug || "",
    description: roadmap?.description || "",
    category: roadmap?.category || "",
    color: roadmap?.color || "blue",
    icon: roadmap?.icon || "",
    published: roadmap?.published ?? false,
    order: roadmap?.order || 0
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = roadmap
        ? `/api/admin/roadmaps/${roadmap.slug}`
        : "/api/admin/roadmaps"

      const method = roadmap ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        router.push("/admin/roadmaps")
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({...formData, slug: e.target.value})}
          required
          disabled={!!roadmap}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          required
        />
      </div>

      <div>
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          value={formData.color}
          onChange={(e) => setFormData({...formData, color: e.target.value})}
        />
      </div>

      <div>
        <Label htmlFor="icon">Icon</Label>
        <Input
          id="icon"
          value={formData.icon}
          onChange={(e) => setFormData({...formData, icon: e.target.value})}
        />
      </div>

      <div>
        <Label htmlFor="order">Order</Label>
        <Input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) => setFormData({...formData, published: checked})}
        />
        <Label htmlFor="published">Published</Label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : roadmap ? "Update Roadmap" : "Create Roadmap"}
      </Button>
    </form>
  )
}
