import clientPromise from "./mongodb";
import { promises as fs } from "fs";
import path from "path";

let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await clientPromise;
  const db = client.db("dsa_patterns");
  cachedDb = { db, client };
  return cachedDb;
}

function serializeDoc(doc) {
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
    pattern_id: doc.pattern_id?.toString
      ? doc.pattern_id.toString()
      : doc.pattern_id,
  };
}

function serializeDocs(docs) {
  return docs.map(serializeDoc);
}

async function readJSON(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading JSON from ${filePath}:`, error.message);
    return null;
  }
}

function extractTitleFromFilename(filename) {
  return filename
    .replace(".json", "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function getPatterns() {
  const { db } = await connectToDatabase();
  const patterns = await db
    .collection("patterns")
    .find({})
    .sort({ order: 1 })
    .toArray();
  return serializeDocs(patterns);
}

export async function getPattern(slug) {
  const { db } = await connectToDatabase();
  const pattern = await db.collection("patterns").findOne({ slug });
  return serializeDoc(pattern);
}

export async function getPatternBySlug(slug) {
  return await getPattern(slug);
}

export async function getQuestionsByPattern(patternSlug) {
  try {
    const solutionsDir = path.join(process.cwd(), "solutions", patternSlug);

    try {
      await fs.access(solutionsDir);
    } catch {
      console.log(`Solutions directory not found: ${solutionsDir}`);
      return [];
    }

    const files = await fs.readdir(solutionsDir);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const questions = await Promise.all(
      jsonFiles.map(async (file, index) => {
        const filePath = path.join(solutionsDir, file);
        const solution = await readJSON(filePath);

        if (!solution) return null;

        const optimalApproach =
          solution.approaches?.find((a) => a.name === "Optimal") ||
          solution.approaches?.[0];

        return {
          _id: solution.questionId || `${patternSlug}-${index}`,
          title: solution.title || extractTitleFromFilename(file),
          difficulty: solution.difficulty || "Medium",
          acceptanceRate: solution.acceptanceRate || null,
          slug: file.replace(".json", ""),
          pattern: patternSlug,
          order: index + 1,
          tags: solution.tags || [],
          companies: solution.companies || [],
          complexity: optimalApproach
            ? {
                time: optimalApproach.complexity?.time || null,
                space: optimalApproach.complexity?.space || null,
              }
            : null,
          questionSlug: solution.questionSlug || file.replace(".json", ""),
        };
      })
    );

    const validQuestions = questions.filter((q) => q !== null);
    const uniqueQuestions = [];
    const seenIds = new Set();

    for (const q of validQuestions) {
      if (!seenIds.has(q._id)) {
        seenIds.add(q._id);
        uniqueQuestions.push(q);
      }
    }

    return uniqueQuestions;
  } catch (error) {
    console.error(`Error getting questions for pattern ${patternSlug}:`, error);
    return [];
  }
}

export async function getQuestion(id) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");
  const question = await db
    .collection("questions")
    .findOne({ _id: new ObjectId(id) });
  return serializeDoc(question);
}

export async function getSolution(questionId) {
  try {
    const solutionsBaseDir = path.join(process.cwd(), "solutions");
    const patterns = await fs.readdir(solutionsBaseDir);

    for (const pattern of patterns) {
      const patternPath = path.join(solutionsBaseDir, pattern);
      const stat = await fs.stat(patternPath);

      if (!stat.isDirectory()) continue;

      const files = await fs.readdir(patternPath);

      for (const file of files) {
        if (!file.endsWith(".json")) continue;

        const filePath = path.join(patternPath, file);
        const solution = await readJSON(filePath);

        if (solution && solution.questionId === questionId) {
          return {
            ...solution,
            pattern: pattern,
            difficulty: solution.difficulty || "Medium",
            title: solution.title || extractTitleFromFilename(file),
          };
        }
      }
    }

    console.log(`Solution not found for questionId: ${questionId}`);
    return null;
  } catch (error) {
    console.error("Error getting solution:", error);
    return null;
  }
}

export async function getUser(email) {
  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne({ email });
  return serializeDoc(user);
}

export async function createUser(userData) {
  const { db } = await connectToDatabase();
  const result = await db.collection("users").insertOne({
    ...userData,
    created_at: new Date(),
  });
  return result;
}

export async function getUserProgress(userId) {
  const { db } = await connectToDatabase();
  const allProgress = await db
    .collection("user_progress")
    .find({ user_id: userId })
    .toArray();
  const bookmarks = await db
    .collection("bookmarks")
    .find({ user_id: userId })
    .toArray();
  const completed = allProgress
    .filter((p) => p.status === "completed")
    .map((p) => p.question_id);
  const inProgress = allProgress
    .filter((p) => p.status === "in_progress")
    .map((p) => p.question_id);
  return {
    completed,
    inProgress,
    bookmarks: bookmarks.map((b) => b.question_id),
  };
}

export async function getAllUserProgress(userId) {
  const { db } = await connectToDatabase();
  const progress = await db
    .collection("user_progress")
    .find({ user_id: userId })
    .toArray();
  return serializeDocs(progress);
}

export async function updateUserProgress(userId, questionId, data) {
  const { db } = await connectToDatabase();
  const result = await db
    .collection("user_progress")
    .updateOne(
      { user_id: userId, question_id: questionId },
      { $set: { ...data, updated_at: new Date() } },
      { upsert: true }
    );
  return result;
}

export async function getUserBookmarks(userId) {
  const { db } = await connectToDatabase();
  const bookmarks = await db
    .collection("bookmarks")
    .find({ user_id: userId })
    .toArray();
  return serializeDocs(bookmarks);
}

export async function toggleBookmark(userId, questionId) {
  const { db } = await connectToDatabase();
  const existing = await db.collection("bookmarks").findOne({
    user_id: userId,
    question_id: questionId,
  });
  if (existing) {
    await db.collection("bookmarks").deleteOne({
      user_id: userId,
      question_id: questionId,
    });
    return { bookmarked: false };
  } else {
    await db.collection("bookmarks").insertOne({
      user_id: userId,
      question_id: questionId,
      created_at: new Date(),
    });
    return { bookmarked: true };
  }
}

export async function getBookmarkedQuestions(userId) {
  const { db } = await connectToDatabase();
  const bookmarks = await db
    .collection("bookmarks")
    .find({ user_id: userId })
    .toArray();

  if (bookmarks.length === 0) {
    return {
      questions: [],
      userProgress: { completed: [], inProgress: [], bookmarks: [] },
    };
  }

  const questions = [];

  for (const bookmark of bookmarks) {
    const solution = await getSolution(bookmark.question_id);
    if (solution) {
      questions.push({
        _id: bookmark.question_id,
        title: solution.title,
        difficulty: solution.difficulty,
        pattern: solution.pattern,
        slug: solution.questionSlug,
        tags: solution.tags || [],
        companies: solution.companies || [],
      });
    }
  }

  const userProgress = await getUserProgress(userId);

  return {
    questions,
    userProgress,
  };
}

export async function getUserNotes(userId, questionId) {
  const { db } = await connectToDatabase();
  const note = await db.collection("notes").findOne({
    user_id: userId,
    question_id: questionId,
  });
  return serializeDoc(note);
}

export async function saveUserNote(userId, questionId, content) {
  const { db } = await connectToDatabase();
  const result = await db.collection("notes").updateOne(
    { user_id: userId, question_id: questionId },
    {
      $set: {
        content,
        updated_at: new Date(),
      },
      $setOnInsert: {
        user_id: userId,
        question_id: questionId,
        created_at: new Date(),
      },
    },
    { upsert: true }
  );
  return result;
}

export async function getAllUserNotes(userId) {
  const { db } = await connectToDatabase();

  const notes = await db
    .collection("notes")
    .find({
      user_id: userId,
      content: { $ne: "" },
    })
    .sort({ updated_at: -1 })
    .toArray();

  const enrichedNotes = await Promise.all(
    notes.map(async (note) => {
      const solution = await getSolution(note.question_id);

      return {
        ...serializeDoc(note),
        questionTitle: solution?.title || "Unknown Question",
        questionSlug: solution?.questionSlug || "",
        patternName: solution?.pattern || "Unknown Pattern",
        patternSlug: solution?.pattern || "",
        difficulty: solution?.difficulty || "Medium",
      };
    })
  );

  return enrichedNotes;
}

export async function getAllSheets() {
  const { db } = await connectToDatabase();
  const sheets = await db
    .collection("sheets")
    .find({})
    .sort({ order: 1 })
    .toArray();
  return serializeDocs(sheets);
}

export async function getSheetBySlug(slug) {
  const { db } = await connectToDatabase();
  const sheet = await db.collection("sheets").findOne({ slug });
  return serializeDoc(sheet);
}

export async function getQuestionsForSheet(sheetName) {
  const { db } = await connectToDatabase();
  const questions = await db
    .collection("questions")
    .find({ sheet: sheetName })
    .sort({ order: 1 })
    .toArray();
  return serializeDocs(questions);
}

export async function getUserStats(userId) {
  const { db } = await connectToDatabase();
  const allProgress = await db
    .collection("user_progress")
    .find({ user_id: userId })
    .toArray();

  let totalQuestions = 0;
  const solutionsDir = path.join(process.cwd(), "solutions");
  const patterns = await fs.readdir(solutionsDir);

  for (const pattern of patterns) {
    const patternPath = path.join(solutionsDir, pattern);
    const stat = await fs.stat(patternPath);
    if (stat.isDirectory()) {
      const files = await fs.readdir(patternPath);
      totalQuestions += files.filter((f) => f.endsWith(".json")).length;
    }
  }

  const completed = allProgress.filter((p) => p.status === "completed");
  const inProgress = allProgress.filter((p) => p.status === "in_progress");

  const patternsData = await db.collection("patterns").find({}).toArray();
  const patternStats = {};

  for (const pattern of patternsData) {
    const patternQuestions = await getQuestionsByPattern(pattern.slug);
    const completedInPattern = completed.filter((p) =>
      patternQuestions.some((q) => q._id === p.question_id)
    ).length;

    patternStats[pattern.name] = {
      total: patternQuestions.length,
      completed: completedInPattern,
    };
  }

  return {
    totalQuestions,
    completedCount: completed.length,
    inProgressCount: inProgress.length,
    completionRate:
      totalQuestions > 0 ? (completed.length / totalQuestions) * 100 : 0,
    patternStats,
  };
}

export async function getRecentActivity(userId, limit = 10) {
  const { db } = await connectToDatabase();
  const recentProgress = await db
    .collection("user_progress")
    .find({ user_id: userId, status: "completed" })
    .sort({ updated_at: -1 })
    .limit(limit)
    .toArray();

  const activities = await Promise.all(
    recentProgress.map(async (progress) => {
      const solution = await getSolution(progress.question_id);

      return {
        questionId: progress.question_id,
        questionTitle: solution?.title || "Unknown",
        questionDifficulty: solution?.difficulty || "Medium",
        solvedAt: progress.updated_at,
        status: progress.status,
      };
    })
  );

  return serializeDocs(activities);
}

export async function getDailyStreak(userId) {
  const { db } = await connectToDatabase();
  const completedQuestions = await db
    .collection("user_progress")
    .find({ user_id: userId, status: "completed" })
    .sort({ updated_at: -1 })
    .toArray();
  if (completedQuestions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
    };
  }
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateMap = new Map();
  completedQuestions.forEach((q) => {
    const date = new Date(q.updated_at);
    date.setHours(0, 0, 0, 0);
    const dateKey = date.getTime();
    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, true);
    }
  });
  const sortedDates = Array.from(dateMap.keys()).sort((a, b) => b - a);
  let checkDate = today.getTime();
  for (const dateKey of sortedDates) {
    const daysDiff = Math.floor((checkDate - dateKey) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 1) {
      currentStreak++;
      checkDate = dateKey;
    } else {
      break;
    }
  }
  let prevDate = null;
  for (const dateKey of sortedDates) {
    if (prevDate === null) {
      tempStreak = 1;
    } else {
      const daysDiff = Math.floor((prevDate - dateKey) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    prevDate = dateKey;
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  return {
    currentStreak,
    longestStreak,
    lastActiveDate: completedQuestions[0].updated_at,
  };
}

export async function getPatternBreakdown(userId) {
  const { db } = await connectToDatabase();
  const patterns = await db
    .collection("patterns")
    .find({})
    .sort({ order: 1 })
    .toArray();
  const userProgress = await db
    .collection("user_progress")
    .find({ user_id: userId })
    .toArray();

  const breakdown = await Promise.all(
    patterns.map(async (pattern) => {
      const patternQuestions = await getQuestionsByPattern(pattern.slug);

      const completedInPattern = userProgress.filter(
        (p) =>
          patternQuestions.some((q) => q._id === p.question_id) &&
          p.status === "completed"
      ).length;

      return {
        patternName: pattern.name,
        patternSlug: pattern.slug,
        total: patternQuestions.length,
        completed: completedInPattern,
        percentage:
          patternQuestions.length > 0
            ? Math.round((completedInPattern / patternQuestions.length) * 100)
            : 0,
      };
    })
  );

  return breakdown;
}

export async function getActivityHeatmap(userId) {
  const { db } = await connectToDatabase();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const activities = await db
    .collection("user_progress")
    .find({
      user_id: userId,
      status: "completed",
      updated_at: { $gte: ninetyDaysAgo },
    })
    .toArray();
  const heatmapData = {};
  activities.forEach((activity) => {
    const date = new Date(activity.updated_at);
    const dateKey = date.toISOString().split("T")[0];
    if (!heatmapData[dateKey]) {
      heatmapData[dateKey] = 0;
    }
    heatmapData[dateKey]++;
  });
  return heatmapData;
}

export async function getUserProfile(userId) {
  const { db } = await connectToDatabase();
  const profile = await db.collection("user_profiles").findOne({ userId });
  return serializeDoc(profile);
}

export async function getFullUserProfile(userId) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const userObjectId =
    typeof userId === "string" ? new ObjectId(userId) : userId;

  const user = await db.collection("users").findOne({ _id: userObjectId });
  const profile = await db
    .collection("user_profiles")
    .findOne({ userId: userId.toString() });
  const resume = await db
    .collection("user_resumes")
    .findOne({ userId: userId.toString() });

  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    profile: profile
      ? {
          bio: profile.bio || "",
          location: profile.location || "",
          college: profile.college || "",
          graduationYear: profile.graduationYear || "",
          currentRole: profile.currentRole || "",
          company: profile.company || "",
          experience: profile.experience || "",
          github: profile.github || "",
          linkedin: profile.linkedin || "",
          leetcode: profile.leetcode || "",
          codeforces: profile.codeforces || "",
          website: profile.website || "",
          skills: profile.skills || [],
          avatar: profile.avatar || null,
          updatedAt: profile.updatedAt,
        }
      : null,
    resume: resume
      ? {
          fileName: resume.fileName,
          fileUrl: resume.fileUrl,
          uploadedAt: resume.uploadedAt,
        }
      : null,
  };
}

export async function updateUserProfile(userId, profileData) {
  const { db } = await connectToDatabase();

  if (profileData.skills && !Array.isArray(profileData.skills)) {
    throw new Error("Skills must be an array");
  }

  const result = await db.collection("user_profiles").updateOne(
    { userId },
    {
      $set: {
        ...profileData,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  return result;
}

export async function updateAvatar(userId, avatarUrl) {
  const { db } = await connectToDatabase();
  const result = await db.collection("user_profiles").updateOne(
    { userId },
    {
      $set: {
        avatar: avatarUrl,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );
  return result;
}

export async function deleteAvatar(userId) {
  const { db } = await connectToDatabase();

  await db.collection("user_profiles").updateOne(
    { userId },
    {
      $set: {
        avatar: null,
        updatedAt: new Date(),
      },
    }
  );

  return { success: true };
}

export async function deleteUserProfile(userId) {
  const { db } = await connectToDatabase();
  const result = await db.collection("user_profiles").deleteOne({ userId });
  return result;
}

export function calculateProfileCompletion(profile) {
  if (!profile) return 0;

  const fields = [
    profile.bio,
    profile.location,
    profile.college,
    profile.graduationYear,
    profile.currentRole,
    profile.avatar,
    profile.github,
    profile.linkedin,
    profile.skills?.length > 0 ? "hasSkills" : null,
  ];

  const completed = fields.filter(
    (field) => field && field.toString().trim() !== ""
  ).length;
  return Math.round((completed / fields.length) * 100);
}

export async function upsertUserProfile(userId, profileData) {
  return await updateUserProfile(userId, profileData);
}

export async function getUserAchievements(userId) {
  const { db } = await connectToDatabase();
  const achievements = await db
    .collection("user_achievements")
    .find({ userId })
    .sort({ unlockedAt: -1 })
    .toArray();
  return serializeDocs(achievements);
}

export async function unlockAchievement(userId, badgeId) {
  const { db } = await connectToDatabase();

  const existing = await db.collection("user_achievements").findOne({
    userId,
    badgeId,
  });

  if (existing) {
    return { alreadyUnlocked: true };
  }

  const result = await db.collection("user_achievements").insertOne({
    userId,
    badgeId,
    unlockedAt: new Date(),
  });

  return { success: true, insertedId: result.insertedId };
}

export async function getEnhancedUserStats(userId) {
  const { db } = await connectToDatabase();

  const allProgress = await db
    .collection("user_progress")
    .find({ user_id: userId })
    .toArray();

  const completed = allProgress.filter((p) => p.status === "completed");

  const patterns = await db.collection("patterns").find({}).toArray();

  const completedByPattern = {};
  const totalByPattern = {};

  for (const pattern of patterns) {
    const patternQuestions = await getQuestionsByPattern(pattern.slug);
    totalByPattern[pattern.slug] = patternQuestions.length;

    const completedInPattern = completed.filter((p) =>
      patternQuestions.some((q) => q._id === p.question_id)
    ).length;

    completedByPattern[pattern.slug] = completedInPattern;
  }

  const problemsByDate = {};
  completed.forEach((p) => {
    const date = new Date(p.updated_at).toISOString().split("T")[0];
    problemsByDate[date] = (problemsByDate[date] || 0) + 1;
  });
  const maxProblemsInDay = Math.max(...Object.values(problemsByDate), 0);

  const hasEarlyMorningSolve = completed.some((p) => {
    const hour = new Date(p.updated_at).getHours();
    return hour < 8;
  });

  const hasLateNightSolve = completed.some((p) => {
    const hour = new Date(p.updated_at).getHours();
    return hour >= 23;
  });

  const streakData = await getDailyStreak(userId);

  return {
    solved: completed.length,
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    maxProblemsInDay,
    hasEarlyMorningSolve,
    hasLateNightSolve,
    completedByPattern,
    totalByPattern,
  };
}

export async function getRoadmaps(filters = {}) {
  const { db } = await connectToDatabase();

  const query = { published: true };

  if (filters.category && filters.category !== "All") {
    query.category = filters.category;
  }

  if (filters.difficulty && filters.difficulty !== "All") {
    query.difficulty = filters.difficulty;
  }

  const roadmaps = await db
    .collection("roadmaps")
    .find(query)
    .sort({ order: 1 })
    .toArray();

  return serializeDocs(roadmaps);
}

export async function getRoadmap(slug) {
  const { db } = await connectToDatabase();
  const roadmap = await db.collection("roadmaps").findOne({ slug });
  return serializeDoc(roadmap);
}

export async function getRoadmapNodes(roadmapId) {
  const { db } = await connectToDatabase();
  const nodes = await db
    .collection("roadmap_nodes")
    .find({ roadmapId })
    .sort({ order: 1 })
    .toArray();

  return serializeDocs(nodes);
}

export async function getRoadmapNode(nodeId) {
  const { db } = await connectToDatabase();
  const node = await db.collection("roadmap_nodes").findOne({ nodeId });
  return serializeDoc(node);
}

export async function getUserRoadmapProgress(userId, roadmapId) {
  const { db } = await connectToDatabase();
  const progress = await db.collection("roadmap_progress").findOne({
    userId,
    roadmapId,
  });
  return serializeDoc(progress);
}

export async function getUserActiveRoadmaps(userId) {
  const { db } = await connectToDatabase();
  const progressList = await db
    .collection("roadmap_progress")
    .find({
      userId,
      completedAt: null,
    })
    .sort({ lastAccessedAt: -1 })
    .limit(5)
    .toArray();

  const enriched = await Promise.all(
    progressList.map(async (progress) => {
      const roadmap = await getRoadmap(progress.roadmapId);
      return {
        ...serializeDoc(progress),
        roadmap,
      };
    })
  );

  return enriched;
}

export async function saveRoadmapProgress(userId, roadmapId, progressData) {
  const { db } = await connectToDatabase();

  const result = await db.collection("roadmap_progress").updateOne(
    { userId, roadmapId },
    {
      $set: {
        ...progressData,
        lastAccessedAt: new Date(),
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId,
        roadmapId,
        startedAt: new Date(),
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  return result;
}

export async function updateNodeProgress(
  userId,
  roadmapId,
  nodeId,
  status,
  completedSubtopics = []
) {
  const { db } = await connectToDatabase();

  const node = await getRoadmapNode(nodeId);
  if (!node) {
    throw new Error("Node not found");
  }

  const totalSubtopics = node.subtopics?.length || 0;

  const progress = await getUserRoadmapProgress(userId, roadmapId);

  if (!progress) {
    await saveRoadmapProgress(userId, roadmapId, {
      overallProgress: 0,
      currentNodeId: nodeId,
      nodesProgress: [
        {
          nodeId,
          status,
          completedSubtopics,
          totalSubtopics,
          timeSpentMinutes: 0,
          startedAt: new Date(),
          completedAt: status === "completed" ? new Date() : null,
        },
      ],
      streaks: {
        current: 0,
        longest: 0,
        lastActivityDate: new Date(),
      },
    });
  } else {
    const nodeProgressIndex = progress.nodesProgress.findIndex(
      (n) => n.nodeId === nodeId
    );

    if (nodeProgressIndex === -1) {
      await db.collection("roadmap_progress").updateOne(
        { userId, roadmapId },
        {
          $push: {
            nodesProgress: {
              nodeId,
              status,
              completedSubtopics,
              totalSubtopics,
              timeSpentMinutes: 0,
              startedAt: new Date(),
              completedAt: status === "completed" ? new Date() : null,
            },
          },
          $set: {
            currentNodeId: nodeId,
            lastAccessedAt: new Date(),
            updatedAt: new Date(),
          },
        }
      );
    } else {
      await db.collection("roadmap_progress").updateOne(
        { userId, roadmapId, "nodesProgress.nodeId": nodeId },
        {
          $set: {
            "nodesProgress.$.status": status,
            "nodesProgress.$.completedSubtopics": completedSubtopics,
            "nodesProgress.$.totalSubtopics": totalSubtopics,
            "nodesProgress.$.completedAt":
              status === "completed" ? new Date() : null,
            currentNodeId: nodeId,
            lastAccessedAt: new Date(),
            updatedAt: new Date(),
          },
        }
      );
    }

    await recalculateRoadmapProgress(userId, roadmapId);
  }

  return { success: true };
}

export async function getRoadmapStats(roadmapId) {
  const { db } = await connectToDatabase();

  const nodes = await getRoadmapNodes(roadmapId);
  const totalNodes = nodes.length;

  let totalResources = 0;
  nodes.forEach((node) => {
    if (node.resources) {
      totalResources += node.resources.length;
    }
  });

  const followers = await db
    .collection("roadmap_progress")
    .countDocuments({ roadmapId });

  return {
    totalNodes,
    totalResources,
    followers,
    avgRating: 0,
  };
}

export async function searchRoadmaps(searchQuery) {
  const { db } = await connectToDatabase();

  const roadmaps = await db
    .collection("roadmaps")
    .find({
      published: true,
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ],
    })
    .sort({ order: 1 })
    .toArray();

  return serializeDocs(roadmaps);
}

export async function toggleSubtopicCompletion(
  userId,
  roadmapId,
  nodeId,
  subtopicId
) {
  const { db } = await connectToDatabase();

  const progress = await db.collection("roadmap_progress").findOne({
    userId,
    roadmapId,
  });

  if (!progress) {
    const node = await getRoadmapNode(nodeId);
    if (!node) {
      throw new Error("Node not found");
    }

    const totalSubtopics = node.subtopics?.length || 0;

    await db.collection("roadmap_progress").insertOne({
      userId,
      roadmapId,
      overallProgress: 0,
      currentNodeId: nodeId,
      nodesProgress: [
        {
          nodeId,
          status: "in-progress",
          completedSubtopics: [subtopicId],
          totalSubtopics,
          timeSpentMinutes: 0,
          startedAt: new Date(),
          markedAt: new Date(),
        },
      ],
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await recalculateRoadmapProgress(userId, roadmapId);
    return { completed: true };
  }

  const nodeProgress = progress.nodesProgress.find((n) => n.nodeId === nodeId);

  if (!nodeProgress) {
    const node = await getRoadmapNode(nodeId);
    if (!node) {
      throw new Error("Node not found");
    }

    const totalSubtopics = node.subtopics?.length || 0;

    await db.collection("roadmap_progress").updateOne(
      { userId, roadmapId },
      {
        $push: {
          nodesProgress: {
            nodeId,
            status: "in-progress",
            completedSubtopics: [subtopicId],
            totalSubtopics,
            timeSpentMinutes: 0,
            startedAt: new Date(),
            markedAt: new Date(),
          },
        },
        $set: {
          currentNodeId: nodeId,
          lastAccessedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    await recalculateRoadmapProgress(userId, roadmapId);
    return { completed: true };
  }

  const isCompleted =
    nodeProgress.completedSubtopics?.includes(subtopicId) || false;
  const node = await getRoadmapNode(nodeId);
  const totalSubtopics =
    node?.subtopics?.length || nodeProgress.totalSubtopics || 0;

  if (isCompleted) {
    // UNMARK SUBTOPIC
    await db.collection("roadmap_progress").updateOne(
      { userId, roadmapId, "nodesProgress.nodeId": nodeId },
      {
        $pull: { "nodesProgress.$.completedSubtopics": subtopicId },
        $set: {
          "nodesProgress.$.unmarkedAt": new Date(),
          "nodesProgress.$.status": "in-progress",
          "nodesProgress.$.totalSubtopics": totalSubtopics,
          updatedAt: new Date(),
        },
      }
    );
  } else {
    // MARK SUBTOPIC COMPLETE
    const newCompletedSubtopics = [
      ...(nodeProgress.completedSubtopics || []),
      subtopicId,
    ];
    const allComplete = newCompletedSubtopics.length === totalSubtopics;

    await db.collection("roadmap_progress").updateOne(
      { userId, roadmapId, "nodesProgress.nodeId": nodeId },
      {
        $addToSet: { "nodesProgress.$.completedSubtopics": subtopicId },
        $set: {
          "nodesProgress.$.markedAt": new Date(),
          "nodesProgress.$.totalSubtopics": totalSubtopics,
          // 🎯 CRITICAL FIX: Auto-update status to "completed" if all done
          "nodesProgress.$.status": allComplete ? "completed" : "in-progress",
          "nodesProgress.$.completedAt": allComplete ? new Date() : null,
          updatedAt: new Date(),
        },
      }
    );
  }

  await recalculateRoadmapProgress(userId, roadmapId);

  return { completed: !isCompleted };
}

export async function markAllSubtopicsComplete(userId, roadmapId, nodeId) {
  const { db } = await connectToDatabase();

  const node = await getRoadmapNode(nodeId);
  if (!node || !node.subtopics) {
    throw new Error("Node or subtopics not found");
  }

  const allSubtopicIds = node.subtopics.map((s) => s.subtopicId);
  const totalSubtopics = allSubtopicIds.length;

  const progress = await getUserRoadmapProgress(userId, roadmapId);

  if (!progress) {
    await db.collection("roadmap_progress").insertOne({
      userId,
      roadmapId,
      overallProgress: 0,
      currentNodeId: nodeId,
      nodesProgress: [
        {
          nodeId,
          status: "completed",
          completedSubtopics: allSubtopicIds,
          totalSubtopics,
          timeSpentMinutes: 0,
          startedAt: new Date(),
          completedAt: new Date(),
        },
      ],
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    const nodeProgress = progress.nodesProgress.find(
      (n) => n.nodeId === nodeId
    );

    if (!nodeProgress) {
      await db.collection("roadmap_progress").updateOne(
        { userId, roadmapId },
        {
          $push: {
            nodesProgress: {
              nodeId,
              status: "completed",
              completedSubtopics: allSubtopicIds,
              totalSubtopics,
              timeSpentMinutes: 0,
              startedAt: new Date(),
              completedAt: new Date(),
            },
          },
          $set: {
            currentNodeId: nodeId,
            lastAccessedAt: new Date(),
            updatedAt: new Date(),
          },
        }
      );
    } else {
      await db.collection("roadmap_progress").updateOne(
        { userId, roadmapId, "nodesProgress.nodeId": nodeId },
        {
          $set: {
            "nodesProgress.$.completedSubtopics": allSubtopicIds,
            "nodesProgress.$.totalSubtopics": totalSubtopics,
            "nodesProgress.$.status": "completed",
            "nodesProgress.$.completedAt": new Date(),
            updatedAt: new Date(),
          },
        }
      );
    }
  }

  await recalculateRoadmapProgress(userId, roadmapId);

  return { success: true };
}

export async function getNodeWithSubtopics(nodeId) {
  const { db } = await connectToDatabase();
  const node = await db.collection("roadmap_nodes").findOne({ nodeId });
  return serializeDoc(node);
}

async function recalculateRoadmapProgress(userId, roadmapId) {
  const { db } = await connectToDatabase()

  const progress = await db.collection('roadmap_progress').findOne({
    userId,
    roadmapId
  })

  if (!progress) return

  // 🎯 FIX: Get ALL published nodes for this roadmap
  const allNodes = await db.collection('roadmap_nodes')
    .find({ roadmapId, published: true })
    .toArray()

  let totalSubtopics = 0
  let completedSubtopics = 0

  // Calculate total from ALL nodes in roadmap
  for (const node of allNodes) {
    totalSubtopics += node.subtopics?.length || 0
  }

  // Calculate completed from user progress
  for (const nodeProgress of progress.nodesProgress) {
    completedSubtopics += nodeProgress.completedSubtopics?.length || 0
  }

  const overallProgress = totalSubtopics > 0
    ? Math.round((completedSubtopics / totalSubtopics) * 100)
    : 0

  await db.collection('roadmap_progress').updateOne(
    { _id: progress._id },
    {
      $set: {
        overallProgress,
        updatedAt: new Date()
      }
    }
  )
}
