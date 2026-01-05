"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateRoadmapPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    slug: "",
    icon: "",
    title: "",
    description: "",
    category: "",
    difficulty: "",
    estimatedWeeks: "",
    color: "",
    order: "",
    prerequisites: "",
    learningOutcomes: "",
    targetRoles: "",
    published: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        estimatedWeeks: parseInt(formData.estimatedWeeks) || 0,
        order: parseInt(formData.order) || 0,
        prerequisites: formData.prerequisites.split(",").map(s => s.trim()).filter(Boolean),
        learningOutcomes: formData.learningOutcomes.split(",").map(s => s.trim()).filter(Boolean),
        targetRoles: formData.targetRoles.split(",").map(s => s.trim()).filter(Boolean),
      }

      const response = await fetch("/api/admin/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to create roadmap")
      }

      router.push("/admin/roadmaps")
      router.refresh()
    } catch (error) {
      alert("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/admin/roadmaps">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roadmaps
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-6">Create New Roadmap</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="slug">Slug (URL)*</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="machine-learning-roadmap"
                required
              />
            </div>
            <div>
              <Label htmlFor="icon">Icon (Emoji)*</Label>
              <Input
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="🤖"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title*</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Machine Learning Engineer Roadmap"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Complete guide to becoming a Machine Learning Engineer..."
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category*</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Data Science"
                required
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty*</Label>
              <Input
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                placeholder="Advanced"
                required
              />
            </div>
            <div>
              <Label htmlFor="estimatedWeeks">Weeks*</Label>
              <Input
                id="estimatedWeeks"
                name="estimatedWeeks"
                type="number"
                value={formData.estimatedWeeks}
                onChange={handleChange}
                placeholder="20"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="color">Color (Hex)*</Label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="#8b5cf6"
                required
              />
            </div>
            <div>
              <Label htmlFor="order">Display Order*</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
                placeholder="1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="prerequisites">Prerequisites (comma-separated)</Label>
            <Textarea
              id="prerequisites"
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleChange}
              rows={2}
              placeholder="Python programming, Linear algebra, Calculus"
            />
          </div>

          <div>
            <Label htmlFor="learningOutcomes">Learning Outcomes (comma-separated)</Label>
            <Textarea
              id="learningOutcomes"
              name="learningOutcomes"
              value={formData.learningOutcomes}
              onChange={handleChange}
              rows={2}
              placeholder="Supervised Learning, Neural Networks, Deep Learning"
            />
          </div>

          <div>
            <Label htmlFor="targetRoles">Target Roles (comma-separated)</Label>
            <Textarea
              id="targetRoles"
              name="targetRoles"
              value={formData.targetRoles}
              onChange={handleChange}
              rows={2}
              placeholder="Machine Learning Engineer, AI Engineer, Data Scientist"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Roadmap"}
            </Button>
            <Link href="/admin/roadmaps">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
