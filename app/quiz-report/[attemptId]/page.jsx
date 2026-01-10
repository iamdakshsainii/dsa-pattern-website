import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getQuizAttempt } from "@/lib/db";
import { connectToDatabase } from "@/lib/db";
import QuizResultClient from "@/app/roadmaps/[slug]/quiz/result/[attemptId]/quiz-result-client";

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

  const { db } = await connectToDatabase();

  const roadmap = await db.collection("roadmaps").findOne({ slug: attempt.roadmapId });

  const allResults = await db
    .collection("quiz_results")
    .find({ userId: user.id, roadmapId: attempt.roadmapId })
    .sort({ completedAt: -1 })
    .toArray();

  const evaluation = attempt.evaluation || null;
  const passed = allResults.filter((r) => r.passed).length;
  const isMastered = passed >= 3;

  return (
    <QuizResultClient
      result={{
        ...attempt,
        _id: attempt._id.toString(),
        attemptNumber: attempt.attemptNumber || 1,
      }}
      roadmap={{
        ...roadmap,
        _id: roadmap._id.toString(),
        slug: roadmap.slug,
        title: roadmap.title,
        icon: roadmap.icon,
      }}
      evaluation={evaluation}
      isMastered={isMastered}
      totalPasses={passed}
    />
  );
}
