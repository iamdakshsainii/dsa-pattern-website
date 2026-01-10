import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import QuizResultClient from "@/app/roadmaps/[slug]/quiz/result/[attemptId]/quiz-result-client";

export default async function QuizResultPage({ params }) {
  const { slug, attemptId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");

  if (!token) {
    redirect("/auth/login");
  }

  const user = await verifyToken(token.value);
  if (!user) {
    redirect("/auth/login");
  }

  const { db } = await connectToDatabase();

  let result;
  try {
    result = await db.collection("quiz_results").findOne({
      _id: new ObjectId(attemptId),
      userId: user.id,
    });
  } catch (error) {
    notFound();
  }

  if (!result) {
    notFound();
  }

  const roadmap = await db.collection("roadmaps").findOne({ slug });

  if (!roadmap) {
    notFound();
  }

  const allResults = await db
    .collection("quiz_results")
    .find({ userId: user.id, roadmapId: slug })
    .sort({ completedAt: -1 })
    .toArray();

  const evaluation = result.evaluation || null;
  const passed = allResults.filter((r) => r.passed).length;
  const isMastered = passed >= 3;

  return (
    <QuizResultClient
      result={{
        ...result,
        _id: result._id.toString(),
        roadmapId: slug,
        completedAt: result.completedAt,
        score: result.score,
        totalQuestions: result.totalQuestions,
        percentage: result.percentage,
        passed: result.passed,
        timeTaken: result.timeTaken,
        answers: result.answers,
        attemptNumber: result.attemptNumber || 1,
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
