"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StickyNote, Plus, Loader2 } from "lucide-react";
import NoteCard from "./note-card";

export default function NotesManager({ questionId, userId, questionTitle }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/notes?questionId=${questionId}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [questionId, userId]);

  const handleDelete = (noteId) => {
    setNotes((prev) => prev.filter((n) => n._id !== noteId));
  };

  if (!userId) {
    return (
      <Card className="p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <StickyNote className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Personal Notes</h3>
            <p className="text-sm text-muted-foreground">
              Login to save your personal notes, thoughts, and insights for this
              question!
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-2 text-muted-foreground py-8">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading your notes...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-blue-600" />
          Your Notes ({notes.length})
        </h3>
        <Link href={`/questions/${questionId}/notes/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Note
          </Button>
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <StickyNote className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium mb-2">No notes yet</p>
          <p className="text-sm mb-4">
            Click "Add Note" to create your first note for this question
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              questionId={questionId}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
