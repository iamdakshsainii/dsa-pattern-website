"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileEdit, Save } from "lucide-react"

export default function NotesSection({ questionId }) {
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Call API to save notes
    // For now, just simulate save
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    setIsEditing(false)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <FileEdit className="h-5 w-5 text-primary" />
          My Notes
        </h3>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit Notes
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your approach, insights, or anything you want to remember about this problem..."
            className="min-h-[200px]"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Notes"}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="min-h-[100px] p-4 bg-muted/30 rounded-lg">
          {notes ? (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{notes}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No notes yet. Click "Edit Notes" to add your thoughts.
            </p>
          )}
        </div>
      )}
    </Card>
  )
}
