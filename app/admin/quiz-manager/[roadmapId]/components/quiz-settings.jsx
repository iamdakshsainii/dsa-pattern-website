'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, ExternalLink } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function QuizSettings({ settings, onSave, saving }) {
  const [formData, setFormData] = useState({
    timeLimit: settings?.timeLimit || 20,
    passingScore: settings?.passingScore || 70,
    maxAttempts: settings?.maxAttempts || 5,
    shuffleQuestions: settings?.shuffleQuestions ?? true,
    shuffleOptions: settings?.shuffleOptions ?? true,
    showExplanations: settings?.showExplanations || 'after_submit',
    topicResources: settings?.topicResources || []
  })

  const [newTopic, setNewTopic] = useState({
    topic: '',
    resources: [{ type: 'youtube', title: '', url: '' }]
  })

  function handleChange(field, value) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  function addTopicResource() {
    if (!newTopic.topic.trim()) {
      alert('Please enter a topic name')
      return
    }

    const validResources = newTopic.resources.filter(r => r.url.trim() && r.title.trim())

    if (validResources.length === 0) {
      alert('Please add at least one valid resource')
      return
    }

    const updatedTopicResources = [
      ...formData.topicResources,
      {
        topic: newTopic.topic.trim(),
        resources: validResources
      }
    ]

    setFormData(prev => ({
      ...prev,
      topicResources: updatedTopicResources
    }))

    setNewTopic({
      topic: '',
      resources: [{ type: 'youtube', title: '', url: '' }]
    })
  }

  function removeTopicResource(index) {
    setFormData(prev => ({
      ...prev,
      topicResources: prev.topicResources.filter((_, i) => i !== index)
    }))
  }

  function addResourceToNewTopic() {
    setNewTopic(prev => ({
      ...prev,
      resources: [...prev.resources, { type: 'youtube', title: '', url: '' }]
    }))
  }

  function removeResourceFromNewTopic(index) {
    setNewTopic(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }))
  }

  function updateNewTopicResource(index, field, value) {
    setNewTopic(prev => ({
      ...prev,
      resources: prev.resources.map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      )
    }))
  }

  function handleSave() {
    onSave(formData)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quiz Settings</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="5"
                max="120"
                value={formData.timeLimit}
                onChange={(e) => handleChange('timeLimit', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="passingScore">Passing Score (%)</Label>
              <Input
                id="passingScore"
                type="number"
                min="0"
                max="100"
                value={formData.passingScore}
                onChange={(e) => handleChange('passingScore', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="maxAttempts">Max Attempts</Label>
              <Input
                id="maxAttempts"
                type="number"
                min="1"
                max="10"
                value={formData.maxAttempts}
                onChange={(e) => handleChange('maxAttempts', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Label htmlFor="shuffleQuestions">Shuffle Questions</Label>
            <Switch
              id="shuffleQuestions"
              checked={formData.shuffleQuestions}
              onCheckedChange={(checked) => handleChange('shuffleQuestions', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Label htmlFor="shuffleOptions">Shuffle Options</Label>
            <Switch
              id="shuffleOptions"
              checked={formData.shuffleOptions}
              onCheckedChange={(checked) => handleChange('shuffleOptions', checked)}
            />
          </div>

          <div>
            <Label htmlFor="showExplanations">Show Explanations</Label>
            <Select
              value={formData.showExplanations}
              onValueChange={(value) => handleChange('showExplanations', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="after_submit">After Submit</SelectItem>
                <SelectItem value="after_each">After Each Question</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Fallback Topic Resources</h3>
          <p className="text-sm text-muted-foreground">
            Add backup learning resources for specific topics. These will be shown to students who struggle with a topic if the question itself doesn't have resources.
          </p>
        </div>

        {formData.topicResources.length > 0 && (
          <div className="space-y-3 mb-4">
            {formData.topicResources.map((topicRes, index) => (
              <Card key={index} className="p-4 bg-white dark:bg-gray-800">
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
                    <div key={resIdx} className="flex items-center gap-2 text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="font-medium capitalize">{resource.type}:</span>
                      <span className="flex-1 truncate">{resource.title}</span>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="p-4 border-2 border-dashed">
          <h4 className="font-semibold mb-3">Add New Topic Resources</h4>

          <div className="space-y-3">
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

              <div className="space-y-2">
                {newTopic.resources.map((resource, index) => (
                  <Card key={index} className="p-3 bg-gray-50 dark:bg-gray-800">
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
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  )
}
