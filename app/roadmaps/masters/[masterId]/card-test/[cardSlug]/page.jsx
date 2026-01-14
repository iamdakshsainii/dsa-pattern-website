import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMasterRoadmap, getRoadmap } from "@/lib/db";
import CardTestClient from "./card-test-client";
import { connectToDatabase } from "@/lib/db";

export default async function CardTestPage({ params }) {
  const { masterId, cardSlug } = params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(`/login?callbackUrl=/roadmaps/masters/${masterId}/card-test/${cardSlug}`);
  }

  const master = await getMasterRoadmap(masterId);
  if (!master) {
    notFound();
  }

  const roadmap = await getRoadmap(cardSlug);
  if (!roadmap) {
    notFound();
  }

  let yearNumber = 1;
  for (const year of master.years) {
    if (year.roadmaps.some(r => r.roadmapSlug === cardSlug)) {
      yearNumber = year.yearNumber;
      break;
    }
  }

  const { db } = await connectToDatabase();
  const allQuestions = await db
    .collection("quiz_bank")
    .find({ roadmapId: cardSlug })
    .toArray();

  if (allQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
          <p className="text-muted-foreground mb-6">
            This roadmap doesn't have test questions yet.
          </p>
          <a
            href={`/roadmaps/masters/${masterId}`}
            className="text-primary hover:underline"
          >
            ← Back to Journey
          </a>
        </div>
      </div>
    );
  }

  const questions = [];
  for (const quizSet of allQuestions) {
    if (quizSet.questions && Array.isArray(quizSet.questions)) {
      questions.push(
        ...quizSet.questions.map(q => ({
          ...q,
          setId: quizSet.quizId,
          setName: quizSet.quizName,
        }))
      );
    }
  }

  const shuffled = questions.sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, Math.min(10, shuffled.length));

  const finalQuestions = selectedQuestions.map(q => ({
    ...q,
    options: [...q.options].sort(() => 0.5 - Math.random()),
  }));

  const lastAttempt = await db.collection("quiz_results").findOne(
    {
      userId: currentUser.id.toString(),
      roadmapId: cardSlug,
      isCardTest: true,
    },
    { sort: { completedAt: -1 } }
  );

  let cooldownRemaining = 0;
  if (lastAttempt) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (new Date(lastAttempt.completedAt) > oneHourAgo) {
      const diff =
        new Date(lastAttempt.completedAt).getTime() -
        oneHourAgo.getTime();
      cooldownRemaining = Math.ceil(diff / 1000 / 60);
    }
  }

  return (
    <CardTestClient
      masterId={masterId}
      cardSlug={cardSlug}
      roadmapTitle={roadmap.title}
      roadmapIcon={roadmap.icon}
      yearNumber={yearNumber}
      questions={finalQuestions}
      cooldownRemaining={cooldownRemaining}
      lastAttempt={
        lastAttempt
          ? {
              score: lastAttempt.score,
              percentage: lastAttempt.percentage,
              passed: lastAttempt.passed,
              completedAt: lastAttempt.completedAt,
            }
          : null
      }
    />
  );
}
