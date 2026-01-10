"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  StickyNote,
  Save,
  CheckCircle2,
  Loader2,
  Trash2,
  AlertCircle,
  Download,
  Copy,
  FileText,
  FileCode,
  Globe
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { exportAsPDF, exportAsMarkdown, exportAsHTML, copyToClipboard } from "@/lib/note-utils"

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
)

export default function NotesSection({ questionId, userId, questionTitle }) {
  const [content, setContent] = useState("")
  const [originalContent, setOriginalContent] = useState("")
  const [saveStatus, setSaveStatus] = useState("saved")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()

  // Check authentication on mount
  useEffect(() => {
    if (userId) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
      setLoading(false)
    }
  }, [userId])

  // Fetch notes when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    const fetchNotes = async () => {
      try {
        const response = await fetch(
          `/api/notes?questionId=${questionId}`,
          { credentials: "include" }
        )

        if (response.ok) {
          const data = await response.json()
          const noteContent = data.note || ""
          setContent(noteContent)
          setOriginalContent(noteContent)
          setSaveStatus("saved")
        } else {
          throw new Error("Failed to fetch notes")
        }
      } catch (err) {
        console.error("Failed to fetch notes:", err)
        setError("Failed to load notes")
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [questionId, isAuthenticated])

  // Track changes
  useEffect(() => {
    if (content !== originalContent) {
      setSaveStatus("unsaved")
    } else {
      setSaveStatus("saved")
    }
  }, [content, originalContent])

  const saveNote = async () => {
    if (!isAuthenticated) return

    setSaveStatus("saving")
    setError(null)

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ questionId, content }),
      })

      if (response.ok) {
        setSaveStatus("saved")
        setOriginalContent(content)
        setError(null)
        toast({
          title: "Notes saved",
          description: "Your notes have been saved successfully",
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to save note")
      }
    } catch (err) {
      console.error("Save error:", err)
      setSaveStatus("unsaved")
      setError(err.message || "Failed to save note")
      toast({
        title: "Error",
        description: err.message || "Failed to save note",
        variant: "destructive",
      })
    }
  }

  const handleClear = async () => {
    setContent("")
    setShowClearDialog(false)
    setSaveStatus("saving")

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ questionId, content: "" }),
      })

      if (response.ok) {
        setSaveStatus("saved")
        setOriginalContent("")
        setError(null)
        toast({
          title: "Notes cleared",
          description: "Your notes have been deleted",
        })
      }
    } catch (err) {
      console.error("Clear error:", err)
      setError("Failed to clear note")
    }
  }

  const handleExportPDF = () => {
    exportAsPDF(content, questionTitle || "Question Notes")
    toast({
      title: "PDF Downloaded",
      description: "Your notes have been exported as PDF",
    })
  }

  const handleExportMarkdown = () => {
    exportAsMarkdown(content, questionTitle || "Question Notes")
    toast({
      title: "Markdown Downloaded",
      description: "Your notes have been exported as Markdown",
    })
  }

  const handleExportHTML = () => {
    exportAsHTML(content, questionTitle || "Question Notes")
    toast({
      title: "HTML Downloaded",
      description: "Your notes have been exported as HTML",
    })
  }

  const handleCopy = async () => {
    const success = await copyToClipboard(content)
    if (success) {
      toast({
        title: "Copied to clipboard",
        description: "Your notes have been copied",
      })
    } else {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <Card className="p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <StickyNote className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Personal Notes</h3>
            <p className="text-sm text-muted-foreground">
              Login to save your personal notes, thoughts, and insights for this question!
            </p>
          </div>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading your notes...</span>
        </div>
      </Card>
    )
  }

  const hasChanges = saveStatus === "unsaved"

  return (
    <>
      <Card className="p-6 border-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-blue-600" />
            Your Notes
          </h3>
          <div className="flex items-center gap-2">
            {saveStatus === "saving" && (
              <Badge variant="outline" className="gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </Badge>
            )}
            {saveStatus === "saved" && !hasChanges && (
              <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                <CheckCircle2 className="h-3 w-3" />
                Saved
              </Badge>
            )}
            {hasChanges && (
              <Badge variant="outline" className="gap-1 text-orange-600 border-orange-600">
                <AlertCircle className="h-3 w-3" />
                Unsaved changes
              </Badge>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-4" data-color-mode="light">
          <MDEditor
            value={content}
            onChange={setContent}
            height={400}
            preview="edit"
            placeholder="Write your notes here...

**Tips:**
- Use markdown for formatting
- Add code blocks with ```
- Create lists and tables
- Record your approach and insights"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {hasChanges ? "💡 Click Save to keep your changes" : "✅ All changes saved"}
          </p>
          <div className="flex items-center gap-2">
            {content && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
                      <FileText className="h-4 w-4" />
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportMarkdown} className="gap-2 cursor-pointer">
                      <FileCode className="h-4 w-4" />
                      Export as Markdown
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportHTML} className="gap-2 cursor-pointer">
                      <Globe className="h-4 w-4" />
                      Export as HTML
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopy} className="gap-2 cursor-pointer">
                      <Copy className="h-4 w-4" />
                      Copy to Clipboard
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearDialog(true)}
                  className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
              </>
            )}
            <Button
              size="sm"
              onClick={saveNote}
              disabled={!hasChanges || saveStatus === "saving"}
              className="gap-2"
            >
              {saveStatus === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Notes
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all notes?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your notes for this question. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-700"
            >
              Clear Notes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
