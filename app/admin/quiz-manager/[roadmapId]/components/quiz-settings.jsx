'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"

export default function QuizSettings({ settings, onSave, saving }) {
  const [formData, setFormData] = useState({
    timeLimit: settings?.timeLimit || 20,
    passingScore: settings?.passingScore || 70,
    maxAttempts: settings?.maxAttempts || 5,
    shuffleQuestions: settings?.shuffleQuestions ?? true,
    shuffleOptions: settings?.shuffleOptions ?? true,
    showExplanations: settings?.showExplanations || "after_submit"
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Time Limit (minutes)</Label>
            <Input
              type="number"
              value={formData.timeLimit}
              onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
              min="1"
              max="120"
            />
          </div>

          <div>
            <Label>Passing Score (%)</Label>
            <Input
              type="number"
              value={formData.passingScore}
              onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
              min="0"
              max="100"
            />
          </div>

          <div>
            <Label>Max Attempts</Label>
            <Input
              type="number"
              value={formData.maxAttempts}
              onChange={(e) => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) })}
              min="1"
              max="10"
            />
          </div>

          <div>
            <Label>Show Explanations</Label>
            <Select value={formData.showExplanations} onValueChange={(value) => setFormData({ ...formData, showExplanations: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="after_submit">After Submit</SelectItem>
                <SelectItem value="immediately">Immediately</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Shuffle Questions</Label>
              <p className="text-sm text-muted-foreground">Randomize question order for each attempt</p>
            </div>
            <Switch
              checked={formData.shuffleQuestions}
              onCheckedChange={(checked) => setFormData({ ...formData, shuffleQuestions: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Shuffle Options</Label>
              <p className="text-sm text-muted-foreground">Randomize answer options for each attempt</p>
            </div>
            <Switch
              checked={formData.shuffleOptions}
              onCheckedChange={(checked) => setFormData({ ...formData, shuffleOptions: checked })}
            />
          </div>
        </div>

        <Button type="submit" disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Card>
  )
}
