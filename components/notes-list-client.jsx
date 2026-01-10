"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, ArrowRight, Calendar, Search, Download, ExternalLink } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportAsPDF, exportAsMarkdown, exportAsHTML, copyToClipboard } from "@/lib/note-utils"
import { useToast } from "@/hooks/use-toast"

export default function NotesListClient({ notes }) {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.questionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.patternName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
      case "hard":
        return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800"
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getPlainTextPreview = (markdown) => {
    const text = markdown
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/`{3}[\s\S]*?```/g, '')
      .replace(/`(.+?)`/g, '$1')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.+?)\]\(.*?\)/g, '$1')
      .replace(/^>\s+/gm, '')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/\|/g, ' ')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return text.length > 120 ? text.substring(0, 120) + '...' : text;
  };

  const handleExport = (note, type) => {
    const title = `${note.questionTitle} - Notes`

    switch(type) {
      case 'pdf':
        exportAsPDF(note.content, title)
        break
      case 'markdown':
        exportAsMarkdown(note.content, title)
        break
      case 'html':
        exportAsHTML(note.content, title)
        break
      case 'copy':
        copyToClipboard(note.content)
        break
    }

    toast({
      title: type === 'copy' ? "Copied!" : "Downloaded!",
      description: `Notes ${type === 'copy' ? 'copied to clipboard' : 'downloaded successfully'}`,
    })
  }

  if (notes.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
          <p className="text-muted-foreground mb-6">
            Start solving problems and save your notes to see them here!
          </p>
          <Link href="/patterns">
            <Button>
              Browse Problems
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in notes, questions, or patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Showing {filteredNotes.length} of {notes.length} notes
          </p>
          <Badge variant="secondary" className="text-xs">{notes.length} Total</Badge>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notes found matching "{searchQuery}"</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const noteId = note._id?.toString() || note._id;
            const plainPreview = getPlainTextPreview(note.content);

            return (
              <Card
                key={noteId}
                className="group p-5 bg-card hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-xs h-5 transition-transform duration-200 group-hover:scale-105 ${getDifficultyColor(note.difficulty)}`}
                        >
                          {note.difficulty || "Medium"}
                        </Badge>
                        <Badge variant="secondary" className="text-xs h-5 transition-transform duration-200 group-hover:scale-105">
                          {note.patternName}
                        </Badge>
                      </div>
                      <h3 className="text-base font-semibold mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-200">
                        {note.questionTitle}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(note.updated_at)}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={() => handleExport(note, 'pdf')}
                          className="cursor-pointer text-sm"
                        >
                          Export as PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleExport(note, 'markdown')}
                          className="cursor-pointer text-sm"
                        >
                          Export as Markdown
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleExport(note, 'html')}
                          className="cursor-pointer text-sm"
                        >
                          Export as HTML
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleExport(note, 'copy')}
                          className="cursor-pointer text-sm"
                        >
                          Copy to Clipboard
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {plainPreview}
                  </p>

                  <div className="flex gap-2">
                    <Link href={`/questions/${note.question_id}/notes/${noteId}`} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-sm h-9 group-hover:border-primary/30 transition-colors duration-200"
                      >
                        View Note
                      </Button>
                    </Link>
                    <Link href={`/questions/${note.question_id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm h-9 px-3 hover:bg-primary/10 transition-colors duration-200"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  )
}
