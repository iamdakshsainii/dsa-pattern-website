"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ImportRoadmapPage() {
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [roadmapId, setRoadmapId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      const response = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmapId: roadmapId || data.roadmapId,
          nodes: data.nodes
        })
      })

      const result = await response.json()
      setResult(result)

      if (!result.error) {
        setTimeout(() => {
          router.push('/admin/roadmaps')
        }, 2000)
      }
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Link href="/admin/roadmaps">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roadmaps
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-6 text-center">Import Roadmap Nodes</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>JSON Format Example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`{
  "roadmapId": "machine-learning-roadmap",
  "nodes": [
    {
      "nodeId": "ml-node-1",
      "weekNumber": 1,
      "title": "Introduction to ML",
      "description": "...",
      "subtopics": [
        {
          "id": "subtopic-1",
          "title": "What is Machine Learning?",
          "description": "...",
          "resources": {
            "youtube": "https://...",
            "article": "https://...",
            "practice": "https://..."
          }
        }
      ]
    }
  ]
}`}
            </pre>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="roadmapId">Roadmap ID (optional if in JSON)</Label>
            <Input
              id="roadmapId"
              value={roadmapId}
              onChange={(e) => setRoadmapId(e.target.value)}
              placeholder="machine-learning-roadmap"
            />
          </div>

          <div>
            <Label htmlFor="file">Upload JSON File</Label>
            <Input
              id="file"
              type="file"
              accept=".json"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>

          <Button type="submit" disabled={loading || !file} className="w-full">
            {loading ? "Importing..." : "Import Nodes"}
          </Button>
        </form>

        {result && (
          <Alert className="mt-4" variant={result.error ? "destructive" : "default"}>
            <AlertDescription>
              {result.error || `Successfully imported ${result.count} nodes`}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
