'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, ExternalLink, ArrowLeft, TrendingDown, Edit, FileJson, Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function WeakTopicsManager({ roadmap, existingResources }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [topicResources, setTopicResources] = useState(existingResources)
  const [studentWeakTopics, setStudentWeakTopics] = useState([])
  const [suggestedTopics, setSuggestedTopics] = useState([])
  const [loadingTopics, setLoadingTopics] = useState(true)
  const [jsonText, setJsonText] = useState('')
  const [newTopic, setNewTopic] = useState({
    topic: '',
    resources: [{ type: 'youtube', title: '', url: '' }]
  })

  useEffect(() => {
    fetchWeakTopics()
  }, [])

  const fetchWeakTopics = async () => {
    try {
      const [studentRes, suggestedRes] = await Promise.all([
        fetch(`/api/admin/roadmaps/${roadmap.slug}/student-weak-topics`),
        fetch(`/api/admin/roadmaps/${roadmap.slug}/suggested-topics`)
      ])

      if (studentRes.ok) {
        const data = await studentRes.json()
        setStudentWeakTopics(data)
      }

      if (suggestedRes.ok) {
        const data = await suggestedRes.json()
        setSuggestedTopics(data)
      }
    } catch (error) {
      console.error("Error fetching topics:", error)
    } finally {
      setLoadingTopics(false)
    }
  }

  const addTopicResource = () => {
    if (!newTopic.topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic name",
        variant: "destructive"
      })
      return
    }

    const validResources = newTopic.resources.filter(r => r.url.trim() && r.title.trim())
    if (validResources.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one valid resource",
        variant: "destructive"
      })
      return
    }

    setTopicResources([...topicResources, {
      topic: newTopic.topic.trim(),
      resources: validResources
    }])

    setNewTopic({
      topic: '',
      resources: [{ type: 'youtube', title: '', url: '' }]
    })

    toast({
      title: "Success",
      description: "Topic resources added"
    })
  }

  const removeTopicResource = (index) => {
    setTopicResources(topicResources.filter((_, i) => i !== index))
  }

  const addResourceToNewTopic = () => {
    setNewTopic(prev => ({
      ...prev,
      resources: [...prev.resources, { type: 'youtube', title: '', url: '' }]
    }))
  }

  const removeResourceFromNewTopic = (index) => {
    setNewTopic(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }))
  }

  const updateNewTopicResource = (index, field, value) => {
    setNewTopic(prev => ({
      ...prev,
      resources: prev.resources.map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      )
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/roadmaps/${roadmap.slug}/weak-topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicResources })
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      toast({
        title: "Success",
        description: "Weak topic resources saved"
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resources",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const useSuggestedTopic = (topic) => {
    setNewTopic(prev => ({ ...prev, topic }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonText)

      if (!Array.isArray(parsed.topicResources)) {
        throw new Error('JSON must contain "topicResources" array')
      }

      setTopicResources([...topicResources, ...parsed.topicResources])
      setJsonText('')
      toast({ title: "Success", description: `Imported ${parsed.topicResources.length} topics` })
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)

        if (!Array.isArray(parsed.topicResources)) {
          throw new Error('JSON must contain "topicResources" array')
        }

        setTopicResources([...topicResources, ...parsed.topicResources])
        toast({ title: "Success", description: `Imported ${parsed.topicResources.length} topics from ${file.name}` })
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const exampleJson = {
    topicResources: [
      {
        topic: "Arrays and Strings",
        resources: [
          { type: "youtube", title: "Array Basics", url: "https://youtube.com/..." },
          { type: "article", title: "String Methods", url: "https://..." }
        ]
      }
    ]
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-7xl">
        <Link href={`/admin/roadmaps/${roadmap.slug}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-2">Manage Weak Topic Resources</h1>
        <p className="text-muted-foreground mb-6">{roadmap.title}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {topicResources.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Current Topic Resources</h3>
                {topicResources.map((topicRes, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{topicRes.topic}</h4>
                        <p className="text-sm text-muted-foreground">
                          {topicRes.resources.length} resource{topicRes.resources.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTopicResource(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {topicRes.resources.map((resource, resIdx) => (
                        <div key={resIdx} className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                          <span className="font-medium capitalize">{resource.type}:</span>
                          <span className="flex-1 truncate">{resource.title}</span>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 text-blue-600" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <Tabs defaultValue="manual">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="manual">
                  <Edit className="h-4 w-4 mr-2" />
                  Manual
                </TabsTrigger>
                <TabsTrigger value="paste">
                  <FileJson className="h-4 w-4 mr-2" />
                  Paste JSON
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Add New Topic Resources</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Topic Name</Label>
                      <Input
                        placeholder="e.g., Arrays, Strings, Dynamic Programming"
                        value={newTopic.topic}
                        onChange={(e) => setNewTopic({ ...newTopic, topic: e.target.value })}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Resources</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addResourceToNewTopic}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Resource
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {newTopic.resources.map((resource, index) => (
                          <Card key={index} className="p-3 bg-muted">
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Select
                                  value={resource.type}
                                  onValueChange={(value) => updateNewTopicResource(index, 'type', value)}
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="youtube">🎥 YouTube</SelectItem>
                                    <SelectItem value="article">📄 Article</SelectItem>
                                    <SelectItem value="practice">💻 Practice</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  placeholder="Resource title"
                                  value={resource.title}
                                  onChange={(e) => updateNewTopicResource(index, 'title', e.target.value)}
                                />
                                {newTopic.resources.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeResourceFromNewTopic(index)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                )}
                              </div>
                              <Input
                                placeholder="https://..."
                                value={resource.url}
                                onChange={(e) => updateNewTopicResource(index, 'url', e.target.value)}
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={addTopicResource}
                      variant="secondary"
                      className="w-full"
                    >
                      Add Topic with Resources
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
                      rows={12}
                      className="font-mono text-sm mt-2"
                    />
                  </div>
                  <Button onClick={handleJsonImport} disabled={!jsonText.trim()}>
                    Import Topics
                  </Button>
                  <div className="p-3 bg-muted rounded text-xs">
                    <p className="font-semibold mb-1">Example:</p>
                    <pre className="overflow-x-auto">{JSON.stringify(exampleJson, null, 2)}</pre>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="upload">
                <Card className="p-6">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <Label htmlFor="weak-topics-file" className="cursor-pointer">
                      <span className="text-sm">Click to upload or drag and drop</span>
                      <br />
                      <span className="text-xs text-muted-foreground">JSON files only</span>
                    </Label>
                    <input
                      id="weak-topics-file"
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleSave}
              disabled={loading}
              size="lg"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="space-y-6">
            {studentWeakTopics.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold">Student Weak Topics</h3>
                </div>
                <div className="space-y-2">
                  {studentWeakTopics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => useSuggestedTopic(topic.topic)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <span className="font-medium">{topic.topic}</span>
                      <Badge variant="destructive">{topic.count}</Badge>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Click a topic to add resources
                </p>
              </Card>
            )}

            {!loadingTopics && studentWeakTopics.length === 0 && suggestedTopics.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Suggested Topics</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on roadmap content
                </p>
                <div className="space-y-2">
                  {suggestedTopics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => useSuggestedTopic(topic)}
                      className="w-full p-3 rounded-lg hover:bg-muted transition-colors text-left text-sm"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
