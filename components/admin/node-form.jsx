"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import SubtopicList from "./subtopic-list"

export default function NodeForm({ roadmapId, node }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nodeId: node?.nodeId || `${roadmapId}-node-${Date.now()}`,
    roadmapId,
    weekNumber: node?.weekNumber || 1,
    title: node?.title || "",
    description: node?.description || "",
    subtopics: node?.subtopics || []
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = node
        ? `/api/admin/nodes/${node.nodeId}`
        : "/api/admin/nodes"

      const method = node ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/admin/roadmaps/${roadmapId}/nodes`)
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="weekNumber">Week Number</Label>
        <Input
          id="weekNumber"
          type="number"
          value={formData.weekNumber}
          onChange={(e) => setFormData({...formData, weekNumber: parseInt(e.target.value)})}
          required
        />
      </div>

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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>

      <SubtopicList
        subtopics={formData.subtopics}
        onChange={(subtopics) => setFormData({...formData, subtopics})}
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : node ? "Update Node" : "Create Node"}
      </Button>
    </form>
  )
}
