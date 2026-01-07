'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, ArrowLeft, Check, Edit, FileJson, Upload } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function WeakTopicsSetup({ roadmap }) {
  const router = useRouter()
  const { toast } = useToast()
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(false)
  const [jsonText, setJsonText] = useState('')
  const [newTopic, setNewTopic] = useState({
    topicName: '',
    description: '',
    weekNumber: 1,
    resources: { youtube: '', article: '' }
  })

  const steps = [
    { number: 1, title: "Basic Info", active: false, completed: true },
    { number: 2, title: "Weak Topics", active: true, completed: false },
    { number: 3, title: "Quiz Bank", active: false, completed: false }
  ]

  const exampleJson = {
    topics: [
      {
        topicName: "Array Manipulation",
        description: "Understanding array methods",
        weekNumber: 1,
        resources: {
          youtube: "https://youtube.com/...",
          article: "https://..."
        }
      }
    ]
  }

  const handleAddTopic = () => {
    if (!newTopic.topicName.trim() || !newTopic.description.trim()) {
      toast({
        title: "Error",
        description: "Fill in all fields",
        variant: "destructive"
      })
      return
    }

    setTopics([...topics, { ...newTopic, id: `topic_${Date.now()}` }])
    setNewTopic({
      topicName: '',
      description: '',
      weekNumber: 1,
      resources: { youtube: '', article: '' }
    })
    toast({
      title: "Success",
      description: "Topic added"
    })
  }

  const handleDeleteTopic = (id) => {
    setTopics(topics.filter(t => t.id !== id))
    toast({
      title: "Success",
      description: "Topic removed"
    })
  }

  const validateAndParse = (jsonData) => {
    if (!Array.isArray(jsonData.topics) || jsonData.topics.length === 0) {
      throw new Error('Topics must be a non-empty array')
    }

    jsonData.topics.forEach((topic, index) => {
      if (!topic.topicName || typeof topic.topicName !== 'string') {
        throw new Error(`Topic ${index + 1}: Missing topicName`)
      }
      if (!topic.description || typeof topic.description !== 'string') {
        throw new Error(`Topic ${index + 1}: Missing description`)
      }
      if (!topic.weekNumber || typeof topic.weekNumber !== 'number') {
        throw new Error(`Topic ${index + 1}: Missing weekNumber`)
      }
    })

    return jsonData
  }

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonText)
      const validated = validateAndParse(parsed)

      const topicsWithIds = validated.topics.map((t, idx) => ({
        ...t,
        id: `topic_${Date.now()}_${idx}`,
        resources: t.resources || { youtube: '', article: '' }
      }))

      setTopics([...topics, ...topicsWithIds])
      setJsonText('')

      toast({
        title: "Success",
        description: `Imported ${topicsWithIds.length} topics`
      })
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        const validated = validateAndParse(parsed)

        const topicsWithIds = validated.topics.map((t, idx) => ({
          ...t,
          id: `topic_${Date.now()}_${idx}`,
          resources: t.resources || { youtube: '', article: '' }
        }))

        setTopics([...topics, ...topicsWithIds])

        toast({
          title: "Success",
          description: `Imported ${topicsWithIds.length} topics from ${file.name}`
        })
      } catch (error) {
        toast({
          title: "Import Failed",
          description: error.message,
          variant: "destructive"
        })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/roadmaps/${roadmap.slug}/weak-topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics })
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      toast({
        title: "Success",
        description: "Weak topics saved"
      })

      router.push(`/admin/roadmaps/${roadmap.slug}/setup/quiz-bank`)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/admin/roadmaps">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roadmaps
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-2">Setup: {roadmap.title}</h1>
      <p className="text-muted-foreground mb-6">Step 2 of 3: Configure weak topics</p>

      <div className="flex items-center justify-between mb-8">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step.completed
                  ? 'bg-green-600 text-white'
                  : step.active
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step.completed ? <Check className="h-5 w-5" /> : step.number}
              </div>
              <span className={`text-sm mt-2 ${step.active ? 'font-semibold' : 'text-muted-foreground'}`}>
                {step.title}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${step.completed ? 'bg-green-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="manual">
            <TabsList className="grid w-full grid-cols-3">
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
                <h3 className="font-semibold mb-4">Add Weak Topic</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Topic Name</Label>
                    <Input
                      value={newTopic.topicName}
                      onChange={(e) => setNewTopic({...newTopic, topicName: e.target.value})}
                      placeholder="e.g., Array Manipulation"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newTopic.description}
                      onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                      placeholder="Describe the topic"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Week Number</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newTopic.weekNumber}
                      onChange={(e) => setNewTopic({...newTopic, weekNumber: parseInt(e.target.value) || 1})}
                    />
                  </div>

                  <div>
                    <Label>YouTube Resource (optional)</Label>
                    <Input
                      value={newTopic.resources.youtube}
                      onChange={(e) => setNewTopic({
                        ...newTopic,
                        resources: {...newTopic.resources, youtube: e.target.value}
                      })}
                      placeholder="https://youtube.com/..."
                    />
                  </div>

                  <div>
                    <Label>Article Resource (optional)</Label>
                    <Input
                      value={newTopic.resources.article}
                      onChange={(e) => setNewTopic({
                        ...newTopic,
                        resources: {...newTopic.resources, article: e.target.value}
                      })}
                      placeholder="https://..."
                    />
                  </div>

                  <Button onClick={handleAddTopic}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Topic
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
                  <p className="font-semibold mb-1">Required JSON Structure:</p>
                  <pre className="overflow-x-auto">{JSON.stringify(exampleJson, null, 2)}</pre>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="upload">
              <Card className="p-6">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <Label htmlFor="weak-topics-file" className="cursor-pointer">
                    <span className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </span>
                    <br />
                    <span className="text-xs text-muted-foreground">
                      JSON files only
                    </span>
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

          {topics.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Added Topics ({topics.length})</h3>
              <div className="space-y-3">
                {topics.map((topic) => (
                  <div key={topic.id} className="flex items-start justify-between p-3 border rounded">
                    <div className="flex-1">
                      <h4 className="font-semibold">{topic.topicName}</h4>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Week {topic.weekNumber}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTopic(topic.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6 sticky top-6">
            <h3 className="font-semibold mb-4">Setup Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Topics Added:</span>
                <span className="font-semibold">{topics.length}</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t space-y-3">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "Saving..." : "Save & Continue"}
              </Button>
              <Button
                onClick={() => router.push(`/admin/roadmaps/${roadmap.slug}/setup/quiz-bank`)}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Skip to Quiz Bank
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
