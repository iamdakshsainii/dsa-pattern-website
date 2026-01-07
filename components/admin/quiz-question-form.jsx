'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"

export default function QuizQuestionForm({ onSubmit, editingQuestion, onCancel }) {
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswers: [],
    type: 'single',
    topic: '',
    difficulty: 'medium',
    explanation: '',
    resources: []
  })

  useEffect(() => {
    if (editingQuestion) {
      setFormData(editingQuestion)
    }
  }, [editingQuestion])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.question.trim()) return
    if (formData.options.filter(o => o.trim()).length < 2) return
    if (formData.correctAnswers.length === 0) return

    onSubmit(formData)

    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswers: [],
      type: 'single',
      topic: '',
      difficulty: 'medium',
      explanation: '',
      resources: []
    })
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const toggleCorrectAnswer = (option) => {
    if (formData.type === 'single') {
      setFormData({ ...formData, correctAnswers: [option] })
    } else {
      const isSelected = formData.correctAnswers.includes(option)
      setFormData({
        ...formData,
        correctAnswers: isSelected
          ? formData.correctAnswers.filter(a => a !== option)
          : [...formData.correctAnswers, option]
      })
    }
  }

  const addResource = () => {
    setFormData({
      ...formData,
      resources: [...formData.resources, { type: 'youtube', title: '', url: '' }]
    })
  }

  const removeResource = (index) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter((_, i) => i !== index)
    })
  }

  const updateResource = (index, field, value) => {
    const newResources = [...formData.resources]
    newResources[index][field] = value
    setFormData({ ...formData, resources: newResources })
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">
        {editingQuestion ? 'Edit Question' : 'Add Question'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Question Text*</Label>
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
            <Label>Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({
                ...formData,
                type: value,
                correctAnswers: []
              })}
            >
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
            <Select
              value={formData.difficulty}
              onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
            >
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
          <Label>Topic (for weak topic tracking)</Label>
          <Input
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="e.g., Arrays, Dynamic Programming"
          />
        </div>

        <div>
          <Label>Answer Options*</Label>
          <div className="space-y-2 mt-2">
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type={formData.type === 'single' ? 'radio' : 'checkbox'}
                  checked={formData.correctAnswers.includes(option)}
                  onChange={() => toggleCorrectAnswer(option)}
                  disabled={!option.trim()}
                  className="h-4 w-4"
                />
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Explanation (optional)</Label>
          <Textarea
            value={formData.explanation}
            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
            placeholder="Explain the correct answer..."
            rows={2}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Learning Resources (optional)</Label>
            <Button type="button" variant="outline" size="sm" onClick={addResource}>
              <Plus className="h-4 w-4 mr-1" />
              Add Resource
            </Button>
          </div>

          {formData.resources.length > 0 && (
            <div className="space-y-2">
              {formData.resources.map((resource, index) => (
                <Card key={index} className="p-3 bg-muted">
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
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="https://..."
                      value={resource.url}
                      onChange={(e) => updateResource(index, 'url', e.target.value)}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit">
            {editingQuestion ? 'Update Question' : 'Add Question'}
          </Button>
          {editingQuestion && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
