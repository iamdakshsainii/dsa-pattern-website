import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getQuestion } from "@/lib/db";
import NoteEditor from "@/components/note-editor";

export default async function NewNotePage({ params }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth/login");
  }

  const question = await getQuestion(id);
  if (!question) {
    redirect("/");
  }

  return (
    <NoteEditor
      questionId={id}
      questionTitle={question.title}
      mode="create"
    />
  );
}
