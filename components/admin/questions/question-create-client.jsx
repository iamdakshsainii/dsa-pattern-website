'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import {
  ArrowLeft, Save, Upload, FileJson, Eye, Plus,
  Sparkles, CheckCircle, AlertCircle, RefreshCw
} from 'lucide-react'
import Link from 'next/link'

export default function QuestionCreateClient({ editId }) {
  const router = useRouter()
  const { toast } = useToast()

  const [mode, setMode] = useState('single') // 'single' or 'bulk'
  const [tab, setTab] = useState('form') // 'form', 'import', 'code'
  const [loading, setLoading] = useState(false)
  const [patterns, setPatterns] = useState([])
  const [nextOrder, setNextOrder] = useState(1)

  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Medium',
    pattern_id: '',
    slug: '',
    order: 1,
    links: {
      leetcode: '',
      youtube: '',
      gfg: '',
      article: ''
    }
  })

  const [jsonData, setJsonData] = useState('')
  const [bulkJsonData, setBulkJsonData] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)

  useEffect(() => {
    fetchPatterns()
    if (editId) {
      fetchQuestion(editId)
    }
  }, [editId])

  const fetchPatterns = async () => {
    try {
      const res = await fetch('/api/all-patterns')
      const data = await res.json()
      setPatterns(data.patterns || [])
    } catch (error) {
      console.error('Failed to load patterns:', error)
    }
  }

  const fetchQuestion = async (id) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/questions/${id}`)
      const data = await res.json()

      if (data.question) {
        setFormData({
          title: data.question.title || '',
          difficulty: data.question.difficulty || 'Medium',
          pattern_id: data.question.pattern_id || '',
          slug: data.question.slug || '',
          order: data.question.order || 1,
          links: data.question.links || { leetcode: '', youtube: '', gfg: '', article: '' }
        })
        setJsonData(JSON.stringify(data.question, null, 2))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load question",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchNextOrder = async (patternId) => {
    try {
      const res = await fetch(`/api/admin/questions/next-order?pattern=${patternId}`)
      const data = await res.json()
      setNextOrder(data.nextOrder || 1)
      setFormData(prev => ({ ...prev, order: data.nextOrder || 1 }))
    } catch (error) {
      console.error('Failed to fetch next order:', error)
    }
  }

  const handlePatternChange = (patternId) => {
    setFormData(prev => ({ ...prev, pattern_id: patternId }))
    if (patternId && !editId) {
      fetchNextOrder(patternId)
    }
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (title) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }))
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result
        if (mode === 'single') {
          setJsonData(content)
        } else {
          setBulkJsonData(content)
        }
        setUploadedFile(file.name)
        toast({
          title: "File loaded",
          description: `${file.name} uploaded successfully`
        })
      } catch (error) {
        toast({
          title: "Invalid file",
          description: "Please upload a valid JSON file",
          variant: "destructive"
        })
      }
    }
    reader.readAsText(file)
  }

  const validateQuestion = (q) => {
    if (!q.title || !q.pattern_id || !q.slug) {
      return { valid: false, error: 'Missing required fields: title, pattern_id, slug' }
    }
    return { valid: true }
  }

  const handleSubmitSingle = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let dataToSubmit = formData

      if (tab === 'import' || tab === 'code') {
        try {
          dataToSubmit = JSON.parse(jsonData)
        } catch {
          toast({
            title: "Invalid JSON",
            description: "Please check your JSON syntax",
            variant: "destructive"
          })
          setLoading(false)
          return
        }
      }

      const validation = validateQuestion(dataToSubmit)
      if (!validation.valid) {
        toast({
          title: "Validation Error",
          description: validation.error,
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      const res = await fetch('/api/admin/questions', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dataToSubmit,
          _id: editId
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save')
      }

      toast({
        title: "Success",
        description: `Question ${editId ? 'updated' : 'created'} successfully`
      })

      router.push('/admin/questions')
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitBulk = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let questions = []

      try {
        questions = JSON.parse(bulkJsonData)
      } catch {
        toast({
          title: "Invalid JSON",
          description: "Please check your JSON syntax",
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      if (!Array.isArray(questions)) {
        questions = [questions]
      }

      // Validate all questions
      for (let i = 0; i < questions.length; i++) {
        const validation = validateQuestion(questions[i])
        if (!validation.valid) {
          toast({
            title: `Question ${i + 1} invalid`,
            description: validation.error,
            variant: "destructive"
          })
          setLoading(false)
          return
        }
      }

      const res = await fetch('/api/admin/questions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create questions')
      }

      const data = await res.json()

      toast({
        title: "Success",
        description: `${data.created} questions created successfully`
      })

      router.push('/admin/questions')
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading && editId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/questions">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-blue-600">
                {editId ? 'Edit Question' : 'Create Question'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {editId ? 'Update existing question' : 'Add new questions to the platform'}
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selection (only for create, not edit) */}
        {!editId && (
          <Card className="p-6">
            <Label className="text-base font-semibold mb-4 block">Creation Mode</Label>
            <RadioGroup value={mode} onValueChange={setMode} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Single Question
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Create one question at a time</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bulk" id="bulk" />
                <Label htmlFor="bulk" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Bulk Import
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Import multiple questions from JSON</p>
                </Label>
              </div>
            </RadioGroup>
          </Card>
        )}

        {/* Single Question Form */}
        {(mode === 'single' || editId) && (
          <form onSubmit={handleSubmitSingle}>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="form">Manual Form</TabsTrigger>
                <TabsTrigger value="import">Import JSON</TabsTrigger>
                <TabsTrigger value="code">Write JSON</TabsTrigger>
              </TabsList>

              {/* Form Tab */}
              <TabsContent value="form" className="space-y-6">
                <Card className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label>Question Title *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g., Two Sum"
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Pattern *</Label>
                      <Select value={formData.pattern_id} onValueChange={handlePatternChange}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select pattern" />
                        </SelectTrigger>
                        <SelectContent>
                          {patterns.map(p => (
                            <SelectItem key={p.slug} value={p.slug}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Difficulty *</Label>
                      <Select value={formData.difficulty} onValueChange={(v) => setFormData(prev => ({ ...prev, difficulty: v }))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Slug *</Label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="auto-generated-slug"
                        required
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Auto-generated from title (editable)
                      </p>
                    </div>

                    <div>
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.pattern_id ? `Next available: ${nextOrder}` : 'Select pattern first'}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-base font-semibold">Practice Links</Label>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label className="text-sm">LeetCode</Label>
                          <Input
                            value={formData.links.leetcode}
                            onChange={(e) => setFormData(prev => ({ ...prev, links: { ...prev.links, leetcode: e.target.value }}))}
                            placeholder="https://leetcode.com/problems/..."
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">YouTube</Label>
                          <Input
                            value={formData.links.youtube}
                            onChange={(e) => setFormData(prev => ({ ...prev, links: { ...prev.links, youtube: e.target.value }}))}
                            placeholder="https://youtube.com/watch?v=..."
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">GeeksforGeeks</Label>
                          <Input
                            value={formData.links.gfg}
                            onChange={(e) => setFormData(prev => ({ ...prev, links: { ...prev.links, gfg: e.target.value }}))}
                            placeholder="https://www.geeksforgeeks.org/..."
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Article</Label>
                          <Input
                            value={formData.links.article}
                            onChange={(e) => setFormData(prev => ({ ...prev, links: { ...prev.links, article: e.target.value }}))}
                            placeholder="https://..."
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Preview */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-4 h-4" />
                    <Label className="text-base font-semibold">Preview</Label>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <h3 className="font-semibold text-lg mb-2">{formData.title || 'Untitled Question'}</h3>
                    <div className="flex gap-2 mb-4">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${getDifficultyColor(formData.difficulty)}`}>
                        {formData.difficulty}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-muted font-medium">
                        {patterns.find(p => p.slug === formData.pattern_id)?.name || 'No pattern'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Slug: <code className="bg-muted px-1 py-0.5 rounded">{formData.slug || 'auto-generated'}</code></p>
                      <p>Order: {formData.order}</p>
                      {Object.values(formData.links).some(link => link) && (
                        <div className="mt-2">
                          <p className="font-medium mb-1">Practice Links:</p>
                          <ul className="space-y-1">
                            {formData.links.leetcode && <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-600" /> LeetCode</li>}
                            {formData.links.youtube && <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-600" /> YouTube</li>}
                            {formData.links.gfg && <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-600" /> GeeksforGeeks</li>}
                            {formData.links.article && <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-600" /> Article</li>}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Import JSON Tab */}
              <TabsContent value="import" className="space-y-6">
                <Card className="p-6">
                  <Label className="text-base font-semibold mb-4 block">Upload JSON File</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a JSON file containing question data
                    </p>
                    <Input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="max-w-xs mx-auto"
                    />
                    {uploadedFile && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {uploadedFile} loaded
                      </p>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <Label className="text-base font-semibold mb-4 block">Or Paste JSON</Label>
                  <Textarea
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    rows={15}
                    className="font-mono text-sm"
                    placeholder='{"title": "Two Sum", "difficulty": "Easy", ...}'
                  />
                </Card>
              </TabsContent>

              {/* Write JSON Tab */}
              <TabsContent value="code" className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">JSON Editor</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setJsonData(JSON.stringify(formData, null, 2))}
                    >
                      <FileJson className="w-4 h-4 mr-2" />
                      Load from Form
                    </Button>
                  </div>
                  <Textarea
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                    placeholder='Write your question JSON here...'
                  />
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <strong>Tip:</strong> You can write JSON directly or click "Load from Form" to convert your form data to JSON for editing.
                    </p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Submit Button */}
            <Card className="p-6 mt-6">
              <div className="flex justify-end gap-3">
                <Link href="/admin/questions">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editId ? 'Update Question' : 'Create Question'}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </form>
        )}

        {/* Bulk Import Form */}
        {mode === 'bulk' && !editId && (
          <form onSubmit={handleSubmitBulk}>
            <div className="space-y-6">
              <Card className="p-6">
                <Label className="text-base font-semibold mb-4 block">Upload JSON File</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a JSON file containing an array of questions
                  </p>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                  {uploadedFile && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {uploadedFile} loaded
                    </p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <Label className="text-base font-semibold mb-4 block">Or Paste JSON Array</Label>
                <Textarea
                  value={bulkJsonData}
                  onChange={(e) => setBulkJsonData(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                  placeholder='[{"title": "Two Sum", "difficulty": "Easy", ...}, {"title": "Three Sum", ...}]'
                />
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900">
                  <div className="flex gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">Expected Format</p>
                  </div>
                  <pre className="text-xs bg-white dark:bg-gray-900 p-3 rounded mt-2 overflow-x-auto">
{`[
  {
    "title": "Two Sum",
    "difficulty": "Easy",
    "pattern_id": "array",
    "slug": "two-sum",
    "order": 1,
    "links": {
      "leetcode": "https://..."
    }
  }
]`}
                  </pre>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex justify-end gap-3">
                  <Link href="/admin/questions">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Questions
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
