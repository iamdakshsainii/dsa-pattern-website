import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getNote, getQuestion } from "@/lib/db";
import NoteViewer from "@/components/note-viewer";

export default async function NoteViewPage({ params }) {
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
    <NoteViewer
      note={note}
      questionId={id}
      questionTitle={question.title}
    />
  );
}
