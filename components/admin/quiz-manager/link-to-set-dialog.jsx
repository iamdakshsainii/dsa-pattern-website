"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Link as LinkIcon, Loader2 } from "lucide-react"

export default function LinkToSetDialog({ open, onOpenChange, question, onSuccess }) {
  const [roadmaps, setRoadmaps] = useState([])
  const [selectedRoadmap, setSelectedRoadmap] = useState("")
  const [quizSets, setQuizSets] = useState([])
  const [selectedSet, setSelectedSet] = useState("")
  const [linking, setLinking] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchRoadmaps()
    }
  }, [open])

  useEffect(() => {
    if (selectedRoadmap) {
      fetchQuizSets(selectedRoadmap)
    } else {
      setQuizSets([])
      setSelectedSet("")
    }
  }, [selectedRoadmap])

  async function fetchRoadmaps() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/roadmaps')
      const data = await res.json()
      setRoadmaps(data.roadmaps || [])
    } catch (error) {
      console.error('Failed to fetch roadmaps:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchQuizSets(roadmapSlug) {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/roadmaps/${roadmapSlug}/quiz-bank`)
      const data = await res.json()
      setQuizSets(data.quizzes || [])
    } catch (error) {
      console.error('Failed to fetch quiz sets:', error)
      setQuizSets([])
    } finally {
      setLoading(false)
    }
  }

  async function handleLink() {
    if (!selectedSet) {
      alert("Select a quiz set")
      return
    }

    setLinking(true)

    try {
      const res = await fetch(`/api/admin/quiz-manager/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          sourceSetId: question.setId,
          targetSetId: selectedSet,
          roadmapSlug: selectedRoadmap
        })
      })

      if (res.ok) {
        onSuccess()
        onOpenChange(false)
      } else {
        alert("Failed to link question")
      }
    } catch (error) {
      console.error("Link error:", error)
      alert("Failed to link question")
    } finally {
      setLinking(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Link Question to Quiz Set</DialogTitle>
          <DialogDescription>
            Select a roadmap and quiz set to link this question
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className="p-3 bg-muted">
            <div className="text-sm">
              <div className="font-medium mb-1">Question:</div>
              <div className="text-muted-foreground line-clamp-2">{question?.question}</div>
            </div>
          </Card>

          <div className="space-y-4">
            <div>
              <Label>Select Roadmap</Label>
              <Select value={selectedRoadmap} onValueChange={setSelectedRoadmap}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose roadmap..." />
                </SelectTrigger>
                <SelectContent>
                  {roadmaps.map(roadmap => (
                    <SelectItem key={roadmap.slug} value={roadmap.slug}>
                      {roadmap.icon} {roadmap.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRoadmap && (
              <div>
                <Label>Select Quiz Set</Label>
                {loading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Loading quiz sets...
                  </div>
                ) : quizSets.length === 0 ? (
                  <Card className="p-4 text-center text-muted-foreground text-sm">
                    No quiz sets found for this roadmap
                  </Card>
                ) : (
                  <Select value={selectedSet} onValueChange={setSelectedSet}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose quiz set..." />
                    </SelectTrigger>
                    <SelectContent>
                      {quizSets.map(set => (
                        <SelectItem key={set.quizId} value={set.quizId}>
                          {set.quizName} ({set.questions?.length || 0} questions)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleLink} disabled={!selectedSet || linking}>
            {linking ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Linking...
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4 mr-2" />
                Link to Set
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
