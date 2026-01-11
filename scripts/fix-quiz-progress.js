// Run with: node scripts/fix-quiz-progress.js
import { MongoClient } from 'mongodb';

// 🔥 UPDATE THIS - Get from .env.local
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dakshsaini:%40Daksh2003@cluster0.rcxv8zy.mongodb.net/dsa_patterns?retryWrites=true&w=majority';

async function recalculateProgress(userId, roadmapId, db) {
  const progress = await db.collection("roadmap_progress").findOne({
    userId,
    roadmapId,
  });

  if (!progress) {
    console.log(`❌ No progress found for user ${userId} on roadmap ${roadmapId}`);
    return;
  }

  const allNodes = await db
    .collection("roadmap_nodes")
    .find({ roadmapId, published: true })
    .toArray();

  let totalSubtopics = 0;
  let completedSubtopics = 0;

  for (const node of allNodes) {
    totalSubtopics += node.subtopics?.length || 0;
  }

  for (const nodeProgress of progress.nodesProgress) {
    completedSubtopics += nodeProgress.completedSubtopics?.length || 0;
  }

  const quizStatus = await db.collection("user_quiz_attempts").findOne({
    userId: userId.toString(),
    roadmapId,
  });

  const hasPassedQuiz = quizStatus?.status === "mastered";

  let rawProgress =
    totalSubtopics > 0
      ? Math.round((completedSubtopics / totalSubtopics) * 100)
      : 0;

  const overallProgress = hasPassedQuiz
    ? Math.min(100, rawProgress)
    : Math.min(90, rawProgress);

  console.log(`\n📊 Progress Calculation:`);
  console.log(`  Completed Subtopics: ${completedSubtopics}/${totalSubtopics}`);
  console.log(`  Raw Progress: ${rawProgress}%`);
  console.log(`  Quiz Status: ${quizStatus?.status || "not_started"}`);
  console.log(`  Has Passed Quiz: ${hasPassedQuiz}`);
  console.log(`  Final Progress: ${overallProgress}%`);

  await db.collection("roadmap_progress").updateOne(
    { _id: progress._id },
    {
      $set: {
        overallProgress,
        completionPercentage: overallProgress,
        updatedAt: new Date(),
      },
    }
  );

  console.log(`✅ Progress updated from ${progress.overallProgress}% → ${overallProgress}%`);
}

async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db("dsa_patterns");

    const TEST_USER_ID = "694e7e801336f9894f786818";
    const TEST_ROADMAP_ID = "data-analyst-roadmap";

    console.log(`\n🔍 Checking user: ${TEST_USER_ID}`);
    console.log(`🔍 Roadmap: ${TEST_ROADMAP_ID}`);

    const quizStatus = await db.collection("user_quiz_attempts").findOne({
      userId: TEST_USER_ID,
      roadmapId: TEST_ROADMAP_ID,
    });

    console.log(`\n📝 Current Quiz Status:`, quizStatus);

    const results = await db
      .collection("quiz_results")
      .find({
        userId: TEST_USER_ID,
        roadmapId: TEST_ROADMAP_ID,
      })
      .sort({ completedAt: -1 })
      .limit(5)
      .toArray();

    console.log(`\n🎯 Last 5 Quiz Results:`);
    if (results.length === 0) {
      console.log(`  ❌ No quiz results found. Take some quizzes first!`);
    } else {
      results.forEach((r, i) => {
        console.log(
          `  ${i + 1}. Score: ${r.percentage}% - ${r.passed ? '✅ PASSED' : '❌ FAILED'} (${new Date(r.completedAt).toLocaleString()})`
        );
      });
    }

    const passed = results.filter((r) => r.passed).length;
    console.log(`\n📈 Passed ${passed}/${results.length} quizzes`);

    if (passed >= 3) {
      console.log(`\n🎉 User qualifies for "mastered" status!`);

      await db.collection("user_quiz_attempts").updateOne(
        {
          userId: TEST_USER_ID,
          roadmapId: TEST_ROADMAP_ID,
        },
        {
          $set: {
            status: "mastered",
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      console.log(`✅ Updated quiz status to "mastered"`);
    } else {
      console.log(
        `\n⚠️ User needs to pass ${3 - passed} more quizzes to qualify for "mastered" status`
      );
    }

    await recalculateProgress(TEST_USER_ID, TEST_ROADMAP_ID, db);

    console.log(`\n✨ Done! Refresh your browser to see updated progress.`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

main();
