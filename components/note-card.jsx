"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreVertical,
  Trash2,
  Download,
  Eye,
  Calendar,
  Edit,
  Code,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  exportAsPDF,
  exportAsMarkdown,
  exportAsHTML,
} from "@/lib/note-utils";

export default function NoteCard({ note, questionId, onDelete }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const noteId = note._id?.toString() || note._id;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/notes?noteId=${noteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Note deleted",
          description: "Your note has been deleted successfully",
        });
        onDelete(noteId);
      } else {
        throw new Error("Failed to delete note");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleExport = (type) => {
    switch (type) {
      case "pdf":
        exportAsPDF(note.content, note.title);
        break;
      case "markdown":
        exportAsMarkdown(note.content, note.title);
        break;
      case "html":
        exportAsHTML(note.content, note.title);
        break;
    }
    toast({
      title: "Exported",
      description: `Note exported as ${type.toUpperCase()}`,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

  const preview = getPlainTextPreview(note.content);
  const wordCount = note.content.split(/\s+/).filter(Boolean).length;
  const hasCode = note.content.includes('```');
  const hasImages = note.content.includes('![');

  return (
    <>
      <Card className="group p-5 bg-card hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-primary flex-1 group-hover:text-primary/90 transition-colors duration-200">
              {note.title}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={() => handleExport("pdf")}
                  className="gap-2 cursor-pointer text-sm"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport("markdown")}
                  className="gap-2 cursor-pointer text-sm"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export as Markdown
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport("html")}
                  className="gap-2 cursor-pointer text-sm"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export as HTML
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="gap-2 cursor-pointer text-sm text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(note.updated_at)}</span>
            </div>
            <Badge variant="secondary" className="text-xs h-5 transition-transform duration-200 group-hover:scale-105">
              {wordCount} words
            </Badge>
            {hasCode && (
              <Badge variant="outline" className="gap-1 text-xs h-5 transition-transform duration-200 group-hover:scale-105">
                <Code className="h-3 w-3" />
                Code
              </Badge>
            )}
            {hasImages && (
              <Badge variant="outline" className="gap-1 text-xs h-5 transition-transform duration-200 group-hover:scale-105">
                <ImageIcon className="h-3 w-3" />
                Images
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {preview}
          </p>

          <div className="flex gap-2 pt-1">
            <Link href={`/questions/${questionId}/notes/${noteId}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full gap-1.5 h-9 text-sm group-hover:border-primary/30 transition-colors duration-200">
                <Eye className="h-3.5 w-3.5" />
                View
              </Button>
            </Link>
            <Link href={`/questions/${questionId}/notes/${noteId}/edit`} className="flex-1">
              <Button size="sm" className="w-full gap-1.5 h-9 text-sm hover:scale-105 transition-transform duration-200">
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{note.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
