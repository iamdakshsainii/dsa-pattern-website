"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Check, Edit, FileJson, Upload, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function CreateRoadmapPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [createdSlug, setCreatedSlug] = useState("")

  const [step1Data, setStep1Data] = useState({
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
    quizAttemptLimit: "3",
  })

  const [step2Data, setStep2Data] = useState([])
  const [jsonText1, setJsonText1] = useState('')
  const [jsonText2, setJsonText2] = useState('')

  const [newTopic, setNewTopic] = useState({
    topicName: '',
    description: '',
    weekNumber: 1,
    resources: { youtube: '', article: '' }
  })

  const steps = [
    { number: 1, title: "Basic Info", active: currentStep === 1, completed: currentStep > 1 },
    { number: 2, title: "Weak Topics", active: currentStep === 2, completed: currentStep > 2 },
    { number: 3, title: "Quiz Bank", active: currentStep === 3, completed: false },
  ]

  const exampleJsonStep1 = {
    slug: "machine-learning-roadmap",
    icon: "🤖",
    title: "Machine Learning Engineer Roadmap",
    description: "Complete guide to becoming a Machine Learning Engineer",
    category: "Data Science",
    difficulty: "Advanced",
    estimatedWeeks: "20",
    color: "#8b5cf6",
    order: "1",
    prerequisites: "Python, Linear algebra, Calculus",
    learningOutcomes: "Supervised Learning, Neural Networks, Deep Learning",
    targetRoles: "ML Engineer, AI Engineer, Data Scientist",
    quizAttemptLimit: "3"
  }

  const exampleJsonStep2 = {
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

  const handleStep1Change = (e) => {
    const { name, value } = e.target
    setStep1Data(prev => ({ ...prev, [name]: value }))
  }

  const handleStep1Submit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...step1Data,
        estimatedWeeks: parseInt(step1Data.estimatedWeeks) || 0,
        order: parseInt(step1Data.order) || 0,
        quizAttemptLimit: parseInt(step1Data.quizAttemptLimit) || 3,
        prerequisites: step1Data.prerequisites.split(",").map(s => s.trim()).filter(Boolean),
        learningOutcomes: step1Data.learningOutcomes.split(",").map(s => s.trim()).filter(Boolean),
        targetRoles: step1Data.targetRoles.split(",").map(s => s.trim()).filter(Boolean),
        published: false,
        quizBankStatus: "incomplete",
        weakTopicResourcesStatus: "incomplete",
        quizBankIds: [],
      }

      const response = await fetch("/api/admin/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to create roadmap")

      const result = await response.json()
      setCreatedSlug(result.slug)
      toast({ title: "Success", description: "Roadmap created" })
      setCurrentStep(2)
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleJsonStep1 = async () => {
    setLoading(true)
    try {
      const parsed = JSON.parse(jsonText1)

      const payload = {
        ...parsed,
        estimatedWeeks: parseInt(parsed.estimatedWeeks) || 0,
        order: parseInt(parsed.order) || 0,
        quizAttemptLimit: parseInt(parsed.quizAttemptLimit) || 3,
        prerequisites: typeof parsed.prerequisites === 'string'
          ? parsed.prerequisites.split(",").map(s => s.trim()).filter(Boolean)
          : parsed.prerequisites || [],
        learningOutcomes: typeof parsed.learningOutcomes === 'string'
          ? parsed.learningOutcomes.split(",").map(s => s.trim()).filter(Boolean)
          : parsed.learningOutcomes || [],
        targetRoles: typeof parsed.targetRoles === 'string'
          ? parsed.targetRoles.split(",").map(s => s.trim()).filter(Boolean)
          : parsed.targetRoles || [],
        published: false,
        quizBankStatus: "incomplete",
        weakTopicResourcesStatus: "incomplete",
        quizBankIds: [],
      }

      const response = await fetch("/api/admin/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to create roadmap")

      const result = await response.json()
      setCreatedSlug(result.slug)
      setStep1Data(parsed)
      toast({ title: "Success", description: "Roadmap created from JSON" })
      setCurrentStep(2)
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleFileStep1 = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      setLoading(true)
      try {
        const parsed = JSON.parse(event.target.result)

        const payload = {
          ...parsed,
          estimatedWeeks: parseInt(parsed.estimatedWeeks) || 0,
          order: parseInt(parsed.order) || 0,
          quizAttemptLimit: parseInt(parsed.quizAttemptLimit) || 3,
          prerequisites: typeof parsed.prerequisites === 'string'
            ? parsed.prerequisites.split(",").map(s => s.trim()).filter(Boolean)
            : parsed.prerequisites || [],
          learningOutcomes: typeof parsed.learningOutcomes === 'string'
            ? parsed.learningOutcomes.split(",").map(s => s.trim()).filter(Boolean)
            : parsed.learningOutcomes || [],
          targetRoles: typeof parsed.targetRoles === 'string'
            ? parsed.targetRoles.split(",").map(s => s.trim()).filter(Boolean)
            : parsed.targetRoles || [],
          published: false,
          quizBankStatus: "incomplete",
          weakTopicResourcesStatus: "incomplete",
          quizBankIds: [],
        }

        const response = await fetch("/api/admin/roadmaps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) throw new Error("Failed to create roadmap")

        const result = await response.json()
        setCreatedSlug(result.slug)
        setStep1Data(parsed)
        toast({ title: "Success", description: `Imported ${file.name}` })
        setCurrentStep(2)
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleAddTopic = () => {
    if (!newTopic.topicName.trim() || !newTopic.description.trim()) {
      toast({ title: "Error", description: "Fill in all fields", variant: "destructive" })
      return
    }

    setStep2Data([...step2Data, { ...newTopic, id: `topic_${Date.now()}` }])
    setNewTopic({
      topicName: '',
      description: '',
      weekNumber: 1,
      resources: { youtube: '', article: '' }
    })
    toast({ title: "Success", description: "Topic added" })
  }

  const handleDeleteTopic = (id) => {
    setStep2Data(step2Data.filter(t => t.id !== id))
    toast({ title: "Success", description: "Topic removed" })
  }

  const handleJsonStep2 = () => {
    try {
      const parsed = JSON.parse(jsonText2)

      if (!Array.isArray(parsed.topics) || parsed.topics.length === 0) {
        throw new Error('Topics must be a non-empty array')
      }

      const topicsWithIds = parsed.topics.map((t, idx) => ({
        ...t,
        id: `topic_${Date.now()}_${idx}`,
        resources: t.resources || { youtube: '', article: '' }
      }))

      setStep2Data([...step2Data, ...topicsWithIds])
      setJsonText2('')
      toast({ title: "Success", description: `Imported ${topicsWithIds.length} topics` })
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleFileStep2 = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)

        if (!Array.isArray(parsed.topics) || parsed.topics.length === 0) {
          throw new Error('Topics must be a non-empty array')
        }

        const topicsWithIds = parsed.topics.map((t, idx) => ({
          ...t,
          id: `topic_${Date.now()}_${idx}`,
          resources: t.resources || { youtube: '', article: '' }
        }))

        setStep2Data([...step2Data, ...topicsWithIds])
        toast({ title: "Success", description: `Imported ${topicsWithIds.length} topics from ${file.name}` })
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleStep2Submit = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/roadmaps/${createdSlug}/weak-topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: step2Data })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({ title: "Success", description: "Weak topics saved" })
      setCurrentStep(3)
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSkipStep2 = () => {
    setCurrentStep(3)
  }

  const handleSkipStep3 = () => {
    router.push('/admin/roadmaps')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/admin/roadmaps">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roadmaps
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-2">Create New Roadmap</h1>
      <p className="text-muted-foreground mb-6">
        Complete all 3 steps to publish your roadmap
      </p>

      <div className="flex items-center justify-between mb-8">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step.completed
                  ? "bg-green-600 text-white"
                  : step.active
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {step.completed ? <Check className="h-5 w-5" /> : step.number}
              </div>
              <span className={`text-sm mt-2 ${step.active ? "font-semibold" : "text-muted-foreground"}`}>
                {step.title}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${step.completed ? "bg-green-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {currentStep === 1 && (
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
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="slug">Slug (URL)*</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={step1Data.slug}
                      onChange={handleStep1Change}
                      placeholder="machine-learning-roadmap"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="icon">Icon (Emoji)*</Label>
                    <Input
                      id="icon"
                      name="icon"
                      value={step1Data.icon}
                      onChange={handleStep1Change}
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
                    value={step1Data.title}
                    onChange={handleStep1Change}
                    placeholder="Machine Learning Engineer Roadmap"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description*</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={step1Data.description}
                    onChange={handleStep1Change}
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
                      value={step1Data.category}
                      onChange={handleStep1Change}
                      placeholder="Data Science"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty*</Label>
                    <Input
                      id="difficulty"
                      name="difficulty"
                      value={step1Data.difficulty}
                      onChange={handleStep1Change}
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
                      value={step1Data.estimatedWeeks}
                      onChange={handleStep1Change}
                      placeholder="20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="color">Color (Hex)*</Label>
                    <Input
                      id="color"
                      name="color"
                      value={step1Data.color}
                      onChange={handleStep1Change}
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
                      value={step1Data.order}
                      onChange={handleStep1Change}
                      placeholder="1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quizAttemptLimit">Quiz Attempts*</Label>
                    <Input
                      id="quizAttemptLimit"
                      name="quizAttemptLimit"
                      type="number"
                      value={step1Data.quizAttemptLimit}
                      onChange={handleStep1Change}
                      placeholder="3"
                      min="1"
                      max="10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="prerequisites">Prerequisites (comma-separated)</Label>
                  <Textarea
                    id="prerequisites"
                    name="prerequisites"
                    value={step1Data.prerequisites}
                    onChange={handleStep1Change}
                    rows={2}
                    placeholder="Python programming, Linear algebra, Calculus"
                  />
                </div>

                <div>
                  <Label htmlFor="learningOutcomes">Learning Outcomes (comma-separated)</Label>
                  <Textarea
                    id="learningOutcomes"
                    name="learningOutcomes"
                    value={step1Data.learningOutcomes}
                    onChange={handleStep1Change}
                    rows={2}
                    placeholder="Supervised Learning, Neural Networks, Deep Learning"
                  />
                </div>

                <div>
                  <Label htmlFor="targetRoles">Target Roles (comma-separated)</Label>
                  <Textarea
                    id="targetRoles"
                    name="targetRoles"
                    value={step1Data.targetRoles}
                    onChange={handleStep1Change}
                    rows={2}
                    placeholder="Machine Learning Engineer, AI Engineer, Data Scientist"
                  />
                </div>

                <Button type="submit" disabled={loading} size="lg">
                  {loading ? "Creating..." : "Continue to Step 2 →"}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="paste">
            <Card className="p-6 space-y-4">
              <div>
                <Label>JSON Data</Label>
                <Textarea
                  value={jsonText1}
                  onChange={(e) => setJsonText1(e.target.value)}
                  placeholder={JSON.stringify(exampleJsonStep1, null, 2)}
                  rows={16}
                  className="font-mono text-sm mt-2"
                />
              </div>
              <Button onClick={handleJsonStep1} disabled={!jsonText1.trim() || loading}>
                {loading ? "Creating..." : "Create & Continue →"}
              </Button>
              <div className="p-3 bg-muted rounded text-xs">
                <p className="font-semibold mb-1">Example JSON:</p>
                <pre className="overflow-x-auto">{JSON.stringify(exampleJsonStep1, null, 2)}</pre>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card className="p-6">
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <Label htmlFor="step1-file" className="cursor-pointer">
                  <span className="text-lg font-semibold">Click to upload or drag and drop</span>
                  <br />
                  <span className="text-sm text-muted-foreground">JSON files only</span>
                </Label>
                <input
                  id="step1-file"
                  type="file"
                  accept=".json"
                  onChange={handleFileStep1}
                  className="hidden"
                  disabled={loading}
                />
              </div>
              {loading && <p className="text-center mt-4 text-sm">Processing...</p>}
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {currentStep === 2 && (
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
                      value={jsonText2}
                      onChange={(e) => setJsonText2(e.target.value)}
                      placeholder={JSON.stringify(exampleJsonStep2, null, 2)}
                      rows={12}
                      className="font-mono text-sm mt-2"
                    />
                  </div>
                  <Button onClick={handleJsonStep2} disabled={!jsonText2.trim()}>
                    Import Topics
                  </Button>
                  <div className="p-3 bg-muted rounded text-xs">
                    <p className="font-semibold mb-1">Example:</p>
                    <pre className="overflow-x-auto">{JSON.stringify(exampleJsonStep2, null, 2)}</pre>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="upload">
                <Card className="p-6">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <Label htmlFor="step2-file" className="cursor-pointer">
                      <span className="text-sm">Click to upload or drag and drop</span>
                      <br />
                      <span className="text-xs text-muted-foreground">JSON files only</span>
                    </Label>
                    <input
                      id="step2-file"
                      type="file"
                      accept=".json"
                      onChange={handleFileStep2}
                      className="hidden"
                    />
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {step2Data.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Added Topics ({step2Data.length})</h3>
                <div className="space-y-3">
                  {step2Data.map((topic) => (
                    <div key={topic.id} className="flex items-start justify-between p-3 border rounded">
                      <div className="flex-1">
                        <h4 className="font-semibold">{topic.topicName}</h4>
                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">Week {topic.weekNumber}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTopic(topic.id)}>
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
                  <span className="font-semibold">{step2Data.length}</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t space-y-3">
                <Button onClick={() => setCurrentStep(1)} variant="outline" className="w-full">
                  ← Back to Step 1
                </Button>
                <Button onClick={handleStep2Submit} disabled={loading} className="w-full" size="lg">
                  {loading ? "Saving..." : "Save & Continue →"}
                </Button>
                <Button onClick={handleSkipStep2} variant="outline" className="w-full" size="lg">
                  Skip to Quiz Bank
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Step 3: Quiz Bank Setup</h2>
          <p className="text-muted-foreground mb-8">
            Quiz bank configuration will be available in the roadmap management page
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setCurrentStep(2)} variant="outline">
              ← Back to Step 2
            </Button>
            <Button onClick={() => router.push(`/admin/roadmaps/${createdSlug}/setup/quiz-bank`)} size="lg">
              Go to Quiz Bank Setup
            </Button>
            <Button onClick={handleSkipStep3} variant="outline" size="lg">
              Complete Setup Later
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
