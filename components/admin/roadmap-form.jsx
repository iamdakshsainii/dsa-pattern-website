"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ArrowLeft, FileJson, Upload, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RoadmapForm({ roadmap }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [jsonText, setJsonText] = useState('')
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

  const exampleJson = {
    title: "Machine Learning Roadmap",
    slug: "machine-learning",
    description: "Complete ML learning path",
    category: "AI & ML",
    color: "blue",
    icon: "🤖",
    published: false,
    order: 0,
    nodes: [
      {
        weekNumber: 1,
        title: "Introduction to ML",
        description: "Learn ML basics",
        subtopics: [
          {
            title: "What is Machine Learning?",
            description: "Understanding ML fundamentals",
            resources: {
              youtube: "https://youtube.com/...",
              article: "https://...",
              practice: "https://..."
            }
          }
        ]
      }
    ]
  }

  const handleManualSubmit = async (e) => {
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
        toast({
          title: "Success",
          description: roadmap ? "Roadmap updated" : "Roadmap created"
        })
        router.push(roadmap ? `/admin/roadmaps/${roadmap.slug}` : "/admin/roadmaps")
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save roadmap",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const validateAndParse = (jsonData) => {
    if (!jsonData.title || typeof jsonData.title !== 'string') {
      throw new Error('Missing or invalid title')
    }
    if (!jsonData.slug || typeof jsonData.slug !== 'string') {
      throw new Error('Missing or invalid slug')
    }
    if (!jsonData.description || typeof jsonData.description !== 'string') {
      throw new Error('Missing or invalid description')
    }
    if (!jsonData.category || typeof jsonData.category !== 'string') {
      throw new Error('Missing or invalid category')
    }

    if (jsonData.nodes && Array.isArray(jsonData.nodes)) {
      jsonData.nodes.forEach((node, idx) => {
        if (!node.weekNumber || typeof node.weekNumber !== 'number') {
          throw new Error(`Node ${idx + 1}: Missing weekNumber`)
        }
        if (!node.title || typeof node.title !== 'string') {
          throw new Error(`Node ${idx + 1}: Missing title`)
        }
        if (!node.description || typeof node.description !== 'string') {
          throw new Error(`Node ${idx + 1}: Missing description`)
        }
        if (node.subtopics && Array.isArray(node.subtopics)) {
          node.subtopics.forEach((sub, subIdx) => {
            if (!sub.title || typeof sub.title !== 'string') {
              throw new Error(`Node ${idx + 1}, Subtopic ${subIdx + 1}: Missing title`)
            }
          })
        }
      })
    }

    return jsonData
  }

  const handleJsonSubmit = async () => {
    setLoading(true)
    try {
      const parsed = JSON.parse(jsonText)
      const validated = validateAndParse(parsed)

      const roadmapResponse = await fetch(roadmap ? `/api/admin/roadmaps/${roadmap.slug}` : "/api/admin/roadmaps", {
        method: roadmap ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: validated.title,
          slug: validated.slug,
          description: validated.description,
          category: validated.category,
          color: validated.color || "blue",
          icon: validated.icon || "",
          published: validated.published ?? false,
          order: validated.order || 0
        })
      })

      const roadmapResult = await roadmapResponse.json()

      if (roadmapResult.success && validated.nodes && validated.nodes.length > 0) {
        const nodesWithIds = validated.nodes.map((node, idx) => ({
          ...node,
          nodeId: `${validated.slug}-node-${Date.now()}-${idx}`,
          roadmapId: validated.slug,
          subtopics: node.subtopics?.map((sub, subIdx) => ({
            ...sub,
            id: `subtopic-${Date.now()}-${idx}-${subIdx}`,
            resources: sub.resources || {}
          })) || []
        }))

        await fetch("/api/admin/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roadmapId: validated.slug,
            nodes: nodesWithIds
          })
        })

        toast({
          title: "Success",
          description: `Created roadmap with ${validated.nodes.length} nodes`
        })
      } else {
        toast({
          title: "Success",
          description: "Roadmap created"
        })
      }

      router.push("/admin/roadmaps")
      router.refresh()
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      setLoading(true)
      try {
        const parsed = JSON.parse(event.target.result)
        const validated = validateAndParse(parsed)

        const roadmapResponse = await fetch(roadmap ? `/api/admin/roadmaps/${roadmap.slug}` : "/api/admin/roadmaps", {
          method: roadmap ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: validated.title,
            slug: validated.slug,
            description: validated.description,
            category: validated.category,
            color: validated.color || "blue",
            icon: validated.icon || "",
            published: validated.published ?? false,
            order: validated.order || 0
          })
        })

        const roadmapResult = await roadmapResponse.json()

        if (roadmapResult.success && validated.nodes && validated.nodes.length > 0) {
          const nodesWithIds = validated.nodes.map((node, idx) => ({
            ...node,
            nodeId: `${validated.slug}-node-${Date.now()}-${idx}`,
            roadmapId: validated.slug,
            subtopics: node.subtopics?.map((sub, subIdx) => ({
              ...sub,
              id: `subtopic-${Date.now()}-${idx}-${subIdx}`,
              resources: sub.resources || {}
            })) || []
          }))

          await fetch("/api/admin/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              roadmapId: validated.slug,
              nodes: nodesWithIds
            })
          })

          toast({
            title: "Success",
            description: `Imported ${file.name} with ${validated.nodes.length} nodes`
          })
        } else {
          toast({
            title: "Success",
            description: `Imported ${file.name}`
          })
        }

        router.push("/admin/roadmaps")
        router.refresh()
      } catch (error) {
        toast({
          title: "Import Failed",
          description: error.message,
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-6">
        {roadmap ? "Edit Roadmap" : "Create New Roadmap"}
      </h1>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="manual">
            <Edit className="h-4 w-4 mr-2" />
            Manual Form
          </TabsTrigger>
          <TabsTrigger value="paste">
            <FileJson className="h-4 w-4 mr-2" />
            Paste JSON
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <Card className="p-6">
            <form onSubmit={handleManualSubmit} className="space-y-4">
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
          </Card>
        </TabsContent>

        <TabsContent value="paste">
          <Card className="p-6 space-y-4">
            <div>
              <Label>JSON Data</Label>
              <Textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder={JSON.stringify(exampleJson, null, 2)}
                rows={16}
                className="font-mono text-sm mt-2"
              />
            </div>
            <Button onClick={handleJsonSubmit} disabled={!jsonText.trim() || loading}>
              {loading ? "Creating..." : "Create Roadmap from JSON"}
            </Button>
            <div className="mt-4 p-3 bg-muted rounded text-xs">
              <p className="font-semibold mb-1">Example JSON Structure:</p>
              <pre className="overflow-x-auto">{JSON.stringify(exampleJson, null, 2)}</pre>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card className="p-6">
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <Label htmlFor="roadmap-file-upload" className="cursor-pointer">
                <span className="text-lg font-semibold">Click to upload or drag and drop</span>
                <br />
                <span className="text-sm text-muted-foreground">JSON files only</span>
              </Label>
              <input
                id="roadmap-file-upload"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
            </div>
            {loading && (
              <p className="text-center mt-4 text-sm text-muted-foreground">
                Processing file...
              </p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
