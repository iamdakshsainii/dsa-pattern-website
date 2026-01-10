import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getQuizAttempt } from "@/lib/db";
import QuizReportClient from "@/components/quiz-report-client";

export default async function QuizReportPage({ params }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { attemptId } = params;
  const attempt = await getQuizAttempt(attemptId);

  if (!attempt || attempt.userId !== user.id) {
    redirect("/dashboard");
  }

  return <QuizReportClient attempt={attempt} />;
}
