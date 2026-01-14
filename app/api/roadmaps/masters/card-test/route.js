import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import {
  getMasterRoadmap,
  getUserRoadmapProgress,
  getUserMasterProgress,
  calculateYearProgress,
  isYearUnlocked
} from "@/lib/db";

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { masterId, cardSlug, yearNumber, answers } = await request.json();

    if (!masterId || !cardSlug || !yearNumber || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const userId = currentUser.id.toString();

    // Check 1-hour cooldown
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const lastAttempt = await db.collection('quiz_results').findOne(
      {
        userId,
        roadmapId: cardSlug,
        isCardTest: true,
        completedAt: { $gte: oneHourAgo }
      },
      { sort: { completedAt: -1 } }
    );

    if (lastAttempt) {
      const timeRemaining = Math.ceil((new Date(lastAttempt.completedAt).getTime() - oneHourAgo.getTime()) / 1000 / 60);
      return NextResponse.json(
        { error: `Please wait ${timeRemaining} minutes before retrying` },
        { status: 429 }
      );
    }

    // Get questions to check answers
    const questionIds = answers.map(a => a.questionId);
    const allQuizzes = await db.collection('quiz_bank').find({ roadmapId: cardSlug }).toArray();

    const allQuestions = [];
    allQuizzes.forEach(quiz => {
      if (quiz.questions) {
        allQuestions.push(...quiz.questions);
      }
    });

    // Grade answers
    let correct = 0;
    const evaluatedAnswers = answers.map(answer => {
      const question = allQuestions.find(q => q.id === answer.questionId);
      const isCorrect = question && question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) correct++;

      return {
        questionId: answer.questionId,
        question: question?.question || "",
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question?.correctAnswer || "",
        isCorrect,
        explanation: question?.explanation || ""
      };
    });

    const score = correct;
    const percentage = Math.round((correct / answers.length) * 100);
    const passed = percentage >= 80;

    // Get current progress before update
    const cardProgressBefore = await getUserRoadmapProgress(userId, cardSlug);
    const yearProgressBefore = await calculateYearProgress(userId, masterId, yearNumber);

    // Save attempt
    const previousAttempts = await db.collection('quiz_results').countDocuments({
      userId,
      roadmapId: cardSlug,
      isCardTest: true
    });

    await db.collection('quiz_results').insertOne({
      userId,
      roadmapId: cardSlug,
      score,
      totalQuestions: answers.length,
      percentage,
      answers: evaluatedAnswers,
      timeTaken: 0,
      attemptNumber: previousAttempts + 1,
      passed,
      isCardTest: true,
      cardProgressImpact: null, // Will update after progress update
      completedAt: new Date(),
      createdAt: new Date()
    });

    let progressImpact = null;

    // If passed, update roadmap progress to 100%
    if (passed) {
      await db.collection('roadmap_progress').updateOne(
        { userId, roadmapId: cardSlug },
        {
          $set: {
            overallProgress: 100,
            completionPercentage: 100,
            completedAt: new Date(),
            updatedAt: new Date()
          },
          $setOnInsert: {
            userId,
            roadmapId: cardSlug,
            startedAt: new Date(),
            createdAt: new Date()
          }
        },
        { upsert: true }
      );

      // Recalculate year progress
      const yearProgressAfter = await calculateYearProgress(userId, masterId, yearNumber);

      // Update master progress
      const master = await getMasterRoadmap(masterId);
      const masterProgress = await getUserMasterProgress(userId, masterId);

      if (masterProgress) {
        const updatedYearProgress = masterProgress.yearProgress.map(yp => {
          if (yp.year === yearNumber) {
            const completedRoadmaps = [...(yp.completedRoadmaps || [])];
            if (!completedRoadmaps.includes(cardSlug)) {
              completedRoadmaps.push(cardSlug);
            }

            return {
              ...yp,
              completionPercent: yearProgressAfter,
              completedRoadmaps
            };
          }
          return yp;
        });

        await db.collection('master_progress').updateOne(
          { userId, masterId },
          {
            $set: {
              yearProgress: updatedYearProgress,
              updatedAt: new Date()
            }
          }
        );

        // Check if next year should unlock
        if (yearNumber < master.years.length) {
          const nextYear = master.years.find(y => y.yearNumber === yearNumber + 1);
          if (nextYear && yearProgressAfter >= nextYear.requiredProgress) {
            // Next year unlocked!
          }
        }
      }

      progressImpact = {
        cardBefore: cardProgressBefore?.overallProgress || 0,
        cardAfter: 100,
        yearBefore: yearProgressBefore,
        yearAfter: await calculateYearProgress(userId, masterId, yearNumber)
      };

      // Update the quiz result with progress impact
      await db.collection('quiz_results').updateOne(
        { userId, roadmapId: cardSlug, isCardTest: true, completedAt: { $exists: true } },
        { $set: { cardProgressImpact: progressImpact } },
        { sort: { completedAt: -1 }, limit: 1 }
      );
    }

    return NextResponse.json({
      success: true,
      passed,
      score,
      percentage,
      attemptNumber: previousAttempts + 1,
      progressImpact
    });

  } catch (error) {
    console.error('Card test error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
