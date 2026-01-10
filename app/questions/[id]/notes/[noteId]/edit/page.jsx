import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getNote, getQuestion } from "@/lib/db";
import NoteEditor from "@/components/note-editor";

export default async function EditNotePage({ params }) {
  const { id, noteId } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth/login");
  }

  const [note, question] = await Promise.all([
    getNote(noteId, currentUser.id),
    getQuestion(id),
  ]);

  if (!note || !question) {
    redirect(`/questions/${id}`);
  }

  return (
    <NoteEditor
      questionId={id}
      questionTitle={question.title}
      mode="edit"
      existingNote={note}
    />
  );
}
