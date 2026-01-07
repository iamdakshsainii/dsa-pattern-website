'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function QuestionEditor({ question, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    question: question?.question || "",
    options: question?.options || ["", "", "", ""],
    correctAnswers: question?.correctAnswers || [],
    type: question?.type || "single",
    difficulty: question?.difficulty || "medium",
    topic: question?.topic || "",
    explanation: question?.explanation || "",
    imageUrl: question?.imageUrl || "",
    codeSnippet: question?.codeSnippet || "",
    resources: question?.resources || []
  })

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ""] })
  }

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index)
    setFormData({ ...formData, options: newOptions })
  }

  const toggleCorrectAnswer = (option) => {
    if (formData.type === "single") {
      setFormData({ ...formData, correctAnswers: [option] })
    } else {
      const isSelected = formData.correctAnswers.includes(option)
      const newAnswers = isSelected
        ? formData.correctAnswers.filter(a => a !== option)
        : [...formData.correctAnswers, option]
      setFormData({ ...formData, correctAnswers: newAnswers })
    }
  }

  const addResource = () => {
    setFormData({
      ...formData,
      resources: [...formData.resources, { type: 'article', title: '', url: '' }]
    })
  }

  const updateResource = (index, field, value) => {
    const newResources = [...formData.resources]
    newResources[index][field] = value
    setFormData({ ...formData, resources: newResources })
  }

  const removeResource = (index) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validResources = formData.resources.filter(r => r.url.trim() && r.title.trim())
    onSave({ ...formData, resources: validResources })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Question Text *</Label>
        <Textarea
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          placeholder="Enter your question..."
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Question Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Choice</SelectItem>
              <SelectItem value="multiple">Multiple Choice</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Difficulty</Label>
          <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Topic *</Label>
        <Input
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          placeholder="e.g., Arrays, Strings, Data Structures"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Used to identify weak topics for students
        </p>
      </div>

      <div>
        <Label>Options * (Click to mark as correct)</Label>
        <div className="space-y-2 mt-2">
          {formData.options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
                className={formData.correctAnswers.includes(option) ? "border-green-500 border-2" : ""}
                onClick={() => option && toggleCorrectAnswer(option)}
              />
              {formData.options.length > 2 && (
                <Button type="button" variant="destructive" size="icon" onClick={() => removeOption(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-2">
          <Plus className="h-4 w-4 mr-2" />
          Add Option
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Selected: {formData.correctAnswers.length > 0 ? formData.correctAnswers.join(", ") : "None"}
        </p>
      </div>

      <div>
        <Label>Explanation</Label>
        <Textarea
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          placeholder="Explain why the answer is correct..."
          rows={3}
        />
      </div>

      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <Label className="text-base">Learning Resources (For Weak Topics)</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Add resources to help students who struggle with this topic
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addResource}>
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>

        {formData.resources.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No resources added yet. Resources will be shown to students who get this question wrong.
          </p>
        ) : (
          <div className="space-y-3">
            {formData.resources.map((resource, index) => (
              <Card key={index} className="p-3 bg-white dark:bg-gray-800">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Select
                      value={resource.type}
                      onValueChange={(value) => updateResource(index, 'type', value)}
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
                      onChange={(e) => updateResource(index, 'title', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeResource(index)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://..."
                      value={resource.url}
                      onChange={(e) => updateResource(index, 'url', e.target.value)}
                    />
                    {resource.url && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <div>
        <Label>Image URL (Optional)</Label>
        <Input
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.png"
        />
      </div>

      <div>
        <Label>Code Snippet (Optional)</Label>
        <Textarea
          value={formData.codeSnippet}
          onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
          placeholder="// Your code here..."
          rows={5}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={formData.correctAnswers.length === 0}>
          Save Question
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
