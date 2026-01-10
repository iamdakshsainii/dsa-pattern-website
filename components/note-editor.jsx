"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EnhancedMDEditor from "./enhanced-md-editor";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NoteEditor({
  questionId,
  questionTitle,
  mode = "create",
  existingNote = null,
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState(existingNote?.title || "");
  const [content, setContent] = useState(existingNote?.content || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your note",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const isEditing = mode === "edit";
      const url = "/api/notes";
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing
        ? { noteId: existingNote._id, title, content }
        : { questionId, title, content };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast({
          title: isEditing ? "Note updated" : "Note created",
          description: `Your note has been ${
            isEditing ? "updated" : "created"
          } successfully`,
        });
        router.push(`/questions/${questionId}`);
      } else {
        throw new Error("Failed to save note");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4 max-w-6xl">
          <Link href={`/questions/${questionId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">
              {mode === "create" ? "Create New Note" : "Edit Note"}
            </h1>
            <p className="text-sm text-muted-foreground">{questionTitle}</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Note
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Note Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title..."
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label>Note Content</Label>
              <div className="mt-2">
                <EnhancedMDEditor
                  value={content}
                  onChange={setContent}
                  height={600}
                  placeholder="Write your notes here...

**Tips:**
- Use markdown for formatting
- Add code blocks with ```language
- Create lists and tables
- Record your approach and insights
- Add images with ![alt](url)"
                />
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
