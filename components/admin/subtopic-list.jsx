"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SubtopicList({ subtopics, onChange }) {
  const [expanded, setExpanded] = useState(null)

  const addSubtopic = () => {
    const newSubtopic = {
      id: `subtopic-${Date.now()}`,
      title: "",
      description: "",
      resources: { youtube: "", article: "", practice: "" }
    }
    onChange([...subtopics, newSubtopic])
    setExpanded(newSubtopic.id)
  }

  const updateSubtopic = (id, field, value) => {
    onChange(subtopics.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  const updateResource = (id, type, value) => {
    onChange(subtopics.map(s =>
      s.id === id ? { ...s, resources: { ...s.resources, [type]: value } } : s
    ))
  }

  const removeSubtopic = (id) => {
    onChange(subtopics.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Subtopics ({subtopics.length})</Label>
        <Button type="button" onClick={addSubtopic} size="sm">
          Add Subtopic
        </Button>
      </div>

      {subtopics.map((subtopic) => (
        <Card key={subtopic.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-base">
              <span>{subtopic.title || "New Subtopic"}</span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setExpanded(expanded === subtopic.id ? null : subtopic.id)}
                >
                  {expanded === subtopic.id ? "Collapse" : "Expand"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeSubtopic(subtopic.id)}
                >
                  Remove
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          {expanded === subtopic.id && (
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={subtopic.title}
                  onChange={(e) => updateSubtopic(subtopic.id, "title", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={subtopic.description}
                  onChange={(e) => updateSubtopic(subtopic.id, "description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Resources</Label>
                <Input
                  placeholder="YouTube URL"
                  value={subtopic.resources.youtube}
                  onChange={(e) => updateResource(subtopic.id, "youtube", e.target.value)}
                />
                <Input
                  placeholder="Article URL"
                  value={subtopic.resources.article}
                  onChange={(e) => updateResource(subtopic.id, "article", e.target.value)}
                />
                <Input
                  placeholder="Practice URL"
                  value={subtopic.resources.practice}
                  onChange={(e) => updateResource(subtopic.id, "practice", e.target.value)}
                />
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
