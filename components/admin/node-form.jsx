"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Edit, FileJson, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import SubtopicList from "./subtopic-list"

export default function NodeForm({ roadmapId, node }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [jsonText, setJsonText] = useState('')
  const [formData, setFormData] = useState({
    nodeId: node?.nodeId || `${roadmapId}-node-${Date.now()}`,
    roadmapId,
    weekNumber: node?.weekNumber || 1,
    title: node?.title || "",
    description: node?.description || "",
    subtopics: node?.subtopics || []
  })

  const saveNode = async (data) => {
    const url = node ? `/api/admin/nodes/${node.nodeId}` : "/api/admin/nodes"
    const method = node ? "PUT" : "POST"

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (result.success) {
      toast({ title: "Success", description: node ? "Node updated" : "Node created" })
      router.push(`/admin/roadmaps/${roadmapId}/nodes`)
      router.refresh()
    }
    return result
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await saveNode(formData)
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleJsonImport = async () => {
    setLoading(true)
    try {
      const parsed = JSON.parse(jsonText)
      const payload = {
        nodeId: parsed.nodeId || `${roadmapId}-node-${Date.now()}`,
        roadmapId,
        weekNumber: parseInt(parsed.weekNumber) || 1,
        title: parsed.title || "",
        description: parsed.description || "",
        subtopics: parsed.subtopics || []
      }
      await saveNode(payload)
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
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
        const payload = {
          nodeId: parsed.nodeId || `${roadmapId}-node-${Date.now()}`,
          roadmapId,
          weekNumber: parseInt(parsed.weekNumber) || 1,
          title: parsed.title || "",
          description: parsed.description || "",
          subtopics: parsed.subtopics || []
        }
        await saveNode(payload)
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const exampleJson = {
    weekNumber: 1,
    title: "Introduction to JavaScript",
    description: "Learn JavaScript fundamentals",
    subtopics: [
      {
        id: "subtopic-1",
        title: "Variables and Data Types",
        description: "Understanding var, let, const",
        resources: { youtube: "", article: "", practice: "" }
      }
    ]
  }

  return (
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
          <div className="space-y-6">
            <div>
              <Label htmlFor="weekNumber">Week Number</Label>
              <Input
                id="weekNumber"
                type="number"
                value={formData.weekNumber}
                onChange={(e) => setFormData({...formData, weekNumber: parseInt(e.target.value) || 1})}
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

            <Button onClick={(e) => { e.preventDefault(); handleSubmit(e); }} disabled={loading}>
              {loading ? "Saving..." : node ? "Update Node" : "Create Node"}
            </Button>
          </div>
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
          <Button onClick={handleJsonImport} disabled={!jsonText.trim() || loading}>
            {loading ? "Saving..." : node ? "Update from JSON" : "Create from JSON"}
          </Button>
          <div className="p-3 bg-muted rounded text-xs">
            <p className="font-semibold mb-1">Example JSON:</p>
            <pre className="overflow-x-auto">{JSON.stringify(exampleJson, null, 2)}</pre>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="upload">
        <Card className="p-6">
          <div className="border-2 border-dashed rounded-lg p-12 text-center">
            <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <Label htmlFor="node-file" className="cursor-pointer">
              <span className="text-lg font-semibold">Click to upload or drag and drop</span>
              <br />
              <span className="text-sm text-muted-foreground">JSON files only</span>
            </Label>
            <input
              id="node-file"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              disabled={loading}
            />
          </div>
          {loading && <p className="text-center mt-4 text-sm">Processing...</p>}
        </Card>
      </TabsContent>
    </Tabs>
  )
}
