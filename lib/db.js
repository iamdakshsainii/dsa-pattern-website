import { ObjectId } from "mongodb";
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

// PATTERNS
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

// QUESTIONS
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

// SOLUTIONS
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

// USERS
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

// USER PROGRESS
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

// BOOKMARKS
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

// NOTES
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

// SHEETS
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

// STATS & ANALYTICS
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

// USER PROFILES
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

// ACHIEVEMENTS
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

// ROADMAPS
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
    .find({ roadmapId, published: true })
    .sort({ order: 1 })
    .toArray();

  return serializeDocs(nodes);
}



export async function getAllRoadmapNodesAdmin(roadmapId) {
  const { db } = await connectToDatabase();
  const nodes = await db
    .collection("roadmap_nodes")
    .find({ roadmapId })
    .sort({ weekNumber: 1, order: 1 })
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
  const { db } = await connectToDatabase();

  const progress = await db.collection("roadmap_progress").findOne({
    userId,
    roadmapId,
  });

  if (!progress) return;

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
    roadmapId
  });

  const hasPassedQuiz = quizStatus?.status === "mastered";

  let rawProgress = totalSubtopics > 0
    ? Math.round((completedSubtopics / totalSubtopics) * 100)
    : 0;

  const overallProgress = hasPassedQuiz
    ? Math.min(100, rawProgress)
    : Math.min(90, rawProgress);

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
}

export async function cleanOrphanedProgress(userId, roadmapId) {
  const { db } = await connectToDatabase();

  const progress = await db.collection("roadmap_progress").findOne({
    userId,
    roadmapId,
  });

  if (!progress) return;

  const allNodes = await db
    .collection("roadmap_nodes")
    .find({ roadmapId, published: true })
    .toArray();

  const validNodeIds = new Set(allNodes.map(n => n.nodeId));

  const cleanedProgress = progress.nodesProgress.filter(np =>
    validNodeIds.has(np.nodeId)
  );

  await db.collection("roadmap_progress").updateOne(
    { _id: progress._id },
    {
      $set: {
        nodesProgress: cleanedProgress,
        updatedAt: new Date()
      }
    }
  );

  await recalculateRoadmapProgress(userId, roadmapId);

  return { success: true, removed: progress.nodesProgress.length - cleanedProgress.length };
}

export async function getAllRoadmapsAdmin() {
  const { db } = await connectToDatabase();
  const roadmaps = await db
    .collection("roadmaps")
    .find({})
    .sort({ order: 1 })
    .toArray();
  return serializeDocs(roadmaps);
}

export async function createRoadmap(roadmapData) {
  const { db } = await connectToDatabase();

  const existing = await db
    .collection("roadmaps")
    .findOne({ slug: roadmapData.slug });
  if (existing) {
    throw new Error("Slug already exists");
  }

  const result = await db.collection("roadmaps").insertOne({
    ...roadmapData,
    stats: { totalNodes: 0, totalResources: 0, followers: 0, avgRating: 0 },
    published: roadmapData.published ?? false,
    quizBankStatus: roadmapData.quizBankStatus || "incomplete",
    weakTopicResourcesStatus:
      roadmapData.weakTopicResourcesStatus || "incomplete",
    quizBankIds: roadmapData.quizBankIds || [],
    quizAttemptLimit: roadmapData.quizAttemptLimit || 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { success: true, slug: roadmapData.slug };
}

export async function updateRoadmap(slug, roadmapData) {
  const { db } = await connectToDatabase();

  const result = await db.collection("roadmaps").updateOne(
    { slug },
    {
      $set: {
        ...roadmapData,
        updatedAt: new Date(),
      },
    }
  );

  return { success: true, modified: result.modifiedCount };
}

export async function deleteRoadmap(slug) {
  const { db } = await connectToDatabase();

  await db.collection("roadmaps").deleteOne({ slug });
  await db.collection("roadmap_nodes").deleteMany({ roadmapId: slug });

  return { success: true };
}

export async function createRoadmapNode(nodeData) {
  const { db } = await connectToDatabase();

  const result = await db.collection("roadmap_nodes").insertOne({
    ...nodeData,
    published: nodeData.published ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { success: true, nodeId: nodeData.nodeId };
}

export async function updateRoadmapNode(nodeId, nodeData) {
  const { db } = await connectToDatabase();

  const result = await db.collection("roadmap_nodes").updateOne(
    { nodeId },
    {
      $set: {
        ...nodeData,
        updatedAt: new Date(),
      },
    }
  );

  return { success: true, modified: result.modifiedCount };
}

export async function deleteRoadmapNode(nodeId) {
  const { db } = await connectToDatabase();

  await db.collection("roadmap_nodes").deleteOne({ nodeId });

  return { success: true };
}

// ==========================================
// QUIZ FUNCTIONS
// ==========================================

export async function saveQuizResult(userId, roadmapId, score, answers, timeTaken, quizId) {
  const { db } = await connectToDatabase();

  const totalQuestions = 10;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 70;

  const previousAttempts = await db
    .collection("quiz_results")
    .countDocuments({ userId: userId.toString(), roadmapId });

  const validatedAnswers = Array.isArray(answers)
    ? answers.map((answer, index) => {
        if (typeof answer !== "object" || answer === null) {
          return {
            questionId: `q_${index}`,
            question: "",
            options: [],
            userAnswer: String(answer || ""),
            correctAnswer: "",
            isCorrect: false,
            topic: "General",
            difficulty: "medium",
            explanation: "",
            resources: [],
          };
        }

        return {
          questionId: answer.questionId || answer.id || `q_${index}`,
          question: answer.question || answer.text || "",
          options: Array.isArray(answer.options) ? answer.options : [],
          userAnswer: answer.userAnswer || answer.selectedAnswer || "",
          correctAnswer: answer.correctAnswer || answer.correct || "",
          correctAnswers: answer.correctAnswers || [
            answer.correctAnswer || answer.correct || "",
          ],
          isCorrect: Boolean(answer.isCorrect),
          topic: answer.topic || answer.category || "General",
          difficulty: answer.difficulty || "medium",
          explanation: answer.explanation || "",
          resources: Array.isArray(answer.resources) ? answer.resources : [],
        };
      })
    : [];

  const evaluation = await evaluateQuizPerformance(userId, roadmapId);

  const result = await db.collection("quiz_results").insertOne({
    userId: userId.toString(),
    roadmapId,
    score,
    totalQuestions,
    percentage,
    answers: validatedAnswers,
    timeTaken: timeTaken || 0,
    attemptNumber: previousAttempts + 1,
    passed,
    quizId: quizId || null,
    evaluation,
    completedAt: new Date(),
    createdAt: new Date(),
  });

  await db.collection("user_quiz_attempts").updateOne(
    { userId: userId.toString(), roadmapId },
    {
      $inc: { attemptsUsed: 1 },
      $push: {
        history: {
          attemptNumber: previousAttempts + 1,
          score,
          percentage,
          passed,
          quizId: quizId || null,
          completedAt: new Date()
        }
      },
      $set: {
        lastAttemptAt: new Date(),
        updatedAt: new Date()
      },
      $setOnInsert: {
        userId: userId.toString(),
        roadmapId,
        attemptsUnlocked: 5,
        status: "in_progress",
        createdAt: new Date()
      }
    },
    { upsert: true }
  );

  if (evaluation.shouldUnlock) {
    await unlockBonusAttempts(userId, roadmapId, evaluation.unlockCount);
  }

  if (evaluation.status === "mastered") {
    await updateQuizStatus(userId, roadmapId, "mastered");
  }

  return {
    success: true,
    score,
    percentage,
    passed,
    insertedId: result.insertedId.toString(),
    attemptId: result.insertedId.toString(),
    evaluation
  };
}

export async function getQuizResult(userId, roadmapId) {
  const { db } = await connectToDatabase();

  const result = await db
    .collection("quiz_results")
    .findOne({ userId, roadmapId }, { sort: { completedAt: -1 } });

  return serializeDoc(result);
}

export async function isQuizUnlocked(userId, roadmapId) {
  const progress = await getUserRoadmapProgress(userId, roadmapId);
  return progress && progress.overallProgress >= 90;  
}

export async function generateCertificateRecord(userId, roadmapId, quizScore) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const userObjectId =
    typeof userId === "string" ? new ObjectId(userId) : userId;
  const user = await db.collection("users").findOne({ _id: userObjectId });
  const roadmap = await getRoadmap(roadmapId);
  const quizResult = await getQuizResult(userId.toString(), roadmapId);

  if (!quizResult || !quizResult.passed) {
    throw new Error("Quiz not passed");
  }

  const existing = await db
    .collection("certificates")
    .findOne({ userId: userId.toString(), roadmapId });

  if (existing) {
    return serializeDoc(existing);
  }

  const certificateId = `CERT-${roadmapId
    .substring(0, 3)
    .toUpperCase()}-${new Date().getFullYear()}-${Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase()}`;

  const certificate = {
    userId: userId.toString(),
    roadmapId,
    certificateId,
    userName: user.name,
    roadmapTitle: roadmap.title,
    roadmapIcon: roadmap.icon,
    completionDate: new Date(),
    quizScore: `${quizResult.score}/${quizResult.totalQuestions} (${quizResult.percentage}%)`,
    certificateUrl: null,
    issuedAt: new Date(),
    createdAt: new Date(),
  };

  const result = await db.collection("certificates").insertOne(certificate);

  return {
    ...certificate,
    _id: result.insertedId.toString(),
  };
}

export async function getUserCertificates(userId) {
  const { db } = await connectToDatabase();

  const certificates = await db
    .collection("certificates")
    .find({ userId: userId.toString() })
    .sort({ issuedAt: -1 })
    .toArray();

  return serializeDocs(certificates);
}

export async function getAllQuizResults(userId) {
  const { db } = await connectToDatabase();

  const results = await db
    .collection("quiz_results")
    .find({ userId: userId.toString() })
    .sort({ completedAt: -1 })
    .toArray();

  return serializeDocs(results);
}

export async function getQuizStats(userId) {
  const { db } = await connectToDatabase();

  const results = await db
    .collection("quiz_results")
    .find({ userId: userId.toString() })
    .toArray();

  const totalAttempts = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts
        )
      : 0;

  return { totalAttempts, passed, failed, avgScore };
}

// ==========================================
// ADMIN QUIZ MANAGEMENT FUNCTIONS
// ==========================================

export async function getQuizConfig(roadmapId) {
  const { db } = await connectToDatabase();

  const customQuiz = await db
    .collection("custom_quizzes")
    .findOne({ roadmapId });

  if (customQuiz) {
    return serializeDoc(customQuiz);
  }

  // Return default config for auto-generated quizzes
  return {
    roadmapId,
    mode: "auto",
    settings: {
      timeLimit: 20,
      passingScore: 70,
      maxAttempts: 5,
      shuffleQuestions: true,
      shuffleOptions: true,
      showExplanations: "after_submit",
    },
    questions: [],
  };
}

export async function saveCustomQuiz(roadmapId, quizData) {
  const { db } = await connectToDatabase();

  const result = await db.collection("custom_quizzes").updateOne(
    { roadmapId },
    {
      $set: {
        ...quizData,
        roadmapId,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  return {
    success: true,
    modified: result.modifiedCount || result.upsertedCount,
  };
}

export async function setQuizMode(roadmapId, mode) {
  const { db } = await connectToDatabase();

  if (mode === "none" || mode === "auto") {
    // Delete custom quiz if switching away from custom
    await db.collection("custom_quizzes").deleteOne({ roadmapId });
    return { success: true, mode };
  }

  // Create empty custom quiz if switching to custom
  await db.collection("custom_quizzes").updateOne(
    { roadmapId },
    {
      $set: {
        mode: "custom",
        settings: {
          timeLimit: 20,
          passingScore: 70,
          maxAttempts: 5,
          shuffleQuestions: true,
          shuffleOptions: true,
          showExplanations: "after_submit",
        },
        questions: [],
        updatedAt: new Date(),
      },
      $setOnInsert: {
        roadmapId,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  return { success: true, mode: "custom" };
}

export async function addQuizQuestion(roadmapId, questionData) {
  const { db } = await connectToDatabase();

  const questionId = `q_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const result = await db.collection("custom_quizzes").updateOne(
    { roadmapId },
    {
      $push: {
        questions: {
          id: questionId,
          ...questionData,
          createdAt: new Date(),
        },
      },
      $set: { updatedAt: new Date() },
    }
  );

  return { success: true, questionId };
}

export async function updateQuizQuestion(roadmapId, questionId, questionData) {
  const { db } = await connectToDatabase();

  const result = await db.collection("custom_quizzes").updateOne(
    { roadmapId, "questions.id": questionId },
    {
      $set: {
        "questions.$": {
          ...questionData,
          id: questionId,
          updatedAt: new Date(),
        },
        updatedAt: new Date(),
      },
    }
  );

  return { success: true, modified: result.modifiedCount };
}

export async function deleteQuizQuestion(roadmapId, questionId) {
  const { db } = await connectToDatabase();

  const result = await db.collection("custom_quizzes").updateOne(
    { roadmapId },
    {
      $pull: { questions: { id: questionId } },
      $set: { updatedAt: new Date() },
    }
  );

  return { success: true, deleted: result.modifiedCount };
}

export async function updateQuizSettings(roadmapId, settings) {
  const { db } = await connectToDatabase();

  const result = await db.collection("custom_quizzes").updateOne(
    { roadmapId },
    {
      $set: {
        settings,
        updatedAt: new Date(),
      },
    }
  );

  return { success: true, modified: result.modifiedCount };
}

export async function getAllQuizzesForAdmin() {
  const { db } = await connectToDatabase();

  const roadmaps = await db
    .collection("roadmaps")
    .find({})
    .sort({ order: 1 })
    .toArray();

  const customQuizzes = await db
    .collection("custom_quizzes")
    .find({})
    .toArray();

  const quizMap = {};
  customQuizzes.forEach((quiz) => {
    quizMap[quiz.roadmapId] = quiz;
  });

  const result = roadmaps.map((roadmap) => {
    const customQuiz = quizMap[roadmap.slug];
    return {
      ...serializeDoc(roadmap),
      quizMode: customQuiz ? customQuiz.mode : "auto",
      questionCount: customQuiz?.questions?.length || 0,
      hasCustomQuiz: !!customQuiz,
    };
  });

  return result;
}

export async function getUserActivityDashboard(userId) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  // Convert userId to string for consistent querying
  const userIdStr = userId.toString();

  // Get all quiz results
  const quizResults = await db
    .collection("quiz_results")
    .find({ userId: userIdStr })
    .sort({ completedAt: -1 })
    .toArray();

  // Get all roadmap progress
  const roadmapProgress = await db
    .collection("roadmap_progress")
    .find({ userId: userIdStr })
    .sort({ lastAccessedAt: -1 })
    .toArray();

  // Enrich roadmap progress with roadmap details
  const enrichedProgress = await Promise.all(
    roadmapProgress.map(async (progress) => {
      const roadmap = await getRoadmap(progress.roadmapId);
      const nodes = await getRoadmapNodes(progress.roadmapId);

      return {
        ...serializeDoc(progress),
        roadmap,
        totalNodes: nodes.length,
        completedNodes:
          progress.nodesProgress?.filter((n) => n.status === "completed")
            .length || 0,
      };
    })
  );

  // Get user_progress for problem solving stats
  const problemProgress = await db
    .collection("user_progress")
    .find({ user_id: userIdStr })
    .toArray();

  const completedProblems = problemProgress.filter(
    (p) => p.status === "completed"
  );

  // Calculate streak
  const streakData = await getDailyStreak(userIdStr);

  // Calculate active days from both quiz and problem activities
  const activityDates = new Set();

  quizResults.forEach((q) => {
    const date = new Date(q.completedAt).toISOString().split("T")[0];
    activityDates.add(date);
  });

  completedProblems.forEach((p) => {
    const date = new Date(p.updated_at).toISOString().split("T")[0];
    activityDates.add(date);
  });

  // Get achievements
  const achievements = await getUserAchievements(userIdStr);

  return {
    roadmaps: enrichedProgress,
    quizResults: serializeDocs(quizResults),
    achievements: achievements,
    streak: streakData,
    totalRoadmaps: enrichedProgress.length,
    activeRoadmaps: enrichedProgress.filter((r) => !r.completedAt).length,
    completedRoadmaps: enrichedProgress.filter((r) => r.completedAt).length,
    totalProblemsSolved: completedProblems.length,
    totalQuizzesTaken: quizResults.length,
    totalActiveDays: activityDates.size,
    currentStreak: streakData.currentStreak,
  };
}

export async function getUserQuizAnalytics(userId) {
  const { db } = await connectToDatabase();

  // Convert userId to string for consistent querying
  const userIdStr = userId.toString();

  // Fetch all quiz results for this user
  const results = await db
    .collection("quiz_results")
    .find({ userId: userIdStr })
    .sort({ completedAt: -1 })
    .toArray();

  if (results.length === 0) {
    return {
      totalQuizzesTaken: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      totalPassed: 0,
      totalFailed: 0,
      passRate: 0,
      recentQuizzes: [],
      byRoadmap: [],
    };
  }

  // Calculate analytics
  const totalQuizzes = results.length;
  const scores = results.map((r) => r.percentage || 0);
  const averageScore = scores.reduce((sum, s) => sum + s, 0) / totalQuizzes;
  const bestScore = Math.max(...scores);
  const worstScore = Math.min(...scores);
  const totalPassed = results.filter((r) => r.passed).length;
  const totalFailed = results.filter((r) => !r.passed).length;
  const passRate = (totalPassed / totalQuizzes) * 100;

  // Group by roadmap
  const byRoadmap = {};
  results.forEach((result) => {
    if (!byRoadmap[result.roadmapId]) {
      byRoadmap[result.roadmapId] = {
        roadmapId: result.roadmapId,
        attempts: 0,
        passed: 0,
        scores: [],
      };
    }
    byRoadmap[result.roadmapId].attempts++;
    if (result.passed) byRoadmap[result.roadmapId].passed++;
    byRoadmap[result.roadmapId].scores.push(result.percentage || 0);
  });

  // Calculate roadmap averages
  Object.values(byRoadmap).forEach((roadmap) => {
    roadmap.averageScore = Math.round(
      roadmap.scores.reduce((sum, s) => sum + s, 0) / roadmap.scores.length
    );
    delete roadmap.scores;
  });

  // Get recent quizzes with roadmap info
  const recentQuizzes = await Promise.all(
    results.slice(0, 10).map(async (result) => {
      const roadmap = await getRoadmap(result.roadmapId);
      return {
        ...serializeDoc(result),
        roadmapTitle: roadmap?.title || result.roadmapId,
        roadmapIcon: roadmap?.icon || "📚",
        score: result.percentage || 0,
      };
    })
  );

  return {
    totalQuizzesTaken: totalQuizzes,
    averageScore: Math.round(averageScore),
    bestScore: Math.round(bestScore),
    worstScore: Math.round(worstScore),
    totalPassed,
    totalFailed,
    passRate: Math.round(passRate),
    recentQuizzes,
    byRoadmap: Object.values(byRoadmap),
  };
}

export async function getUserWeakTopics(userId) {
  const { db } = await connectToDatabase();
  const userIdStr = userId.toString();

  const quizResults = await db
    .collection("quiz_results")
    .find({ userId: userIdStr })
    .toArray();

  if (quizResults.length === 0) {
    return [];
  }

  const topicStats = {};

  quizResults.forEach((result) => {
    if (!result.answers) return;

    let answersArray = Array.isArray(result.answers)
      ? result.answers
      : Object.values(result.answers || {});

    answersArray.forEach((answer) => {
      if (!answer || typeof answer !== "object") return;

      const topic =
        answer.topic && typeof answer.topic === "string"
          ? answer.topic
          : "General";

      if (!topicStats[topic]) {
        topicStats[topic] = {
          topic,
          totalAttempts: 0,
          correctAttempts: 0,
          roadmapId: result.roadmapId,
          resources: [],
        };
      }

      topicStats[topic].totalAttempts++;
      if (answer.isCorrect) {
        topicStats[topic].correctAttempts++;
      }

      if (answer.resources && Array.isArray(answer.resources)) {
        answer.resources.forEach((res) => {
          const resource =
            typeof res === "string"
              ? { url: res, title: "Resource", type: detectType(res) }
              : {
                  url: res.url,
                  title: res.title || "Resource",
                  type: res.type || detectType(res.url),
                };

          if (
            !topicStats[topic].resources.some((r) => r.url === resource.url)
          ) {
            topicStats[topic].resources.push(resource);
          }
        });
      }
    });
  });

  const weakTopics = [];

  for (const [topicName, stat] of Object.entries(topicStats)) {
    const correctPercentage = Math.round(
      (stat.correctAttempts / stat.totalAttempts) * 100
    );

    if (correctPercentage < 70 && stat.totalAttempts >= 3) {
      let roadmapTitle = null;
      let relatedTopics = [];

      try {
        const roadmap = await db
          .collection("roadmaps")
          .findOne({ slug: stat.roadmapId });
        roadmapTitle = roadmap?.title;

        const nodes = await db
          .collection("roadmap_nodes")
          .find({ roadmapId: stat.roadmapId, published: true })
          .toArray();

        nodes.forEach((node) => {
          if (node.subtopics) {
            node.subtopics.forEach((sub) => {
              const subName = sub.name || "";
              const topicLower = topicName.toLowerCase();
              if (
                subName.toLowerCase().includes(topicLower) ||
                topicLower.includes(subName.toLowerCase())
              ) {
                relatedTopics.push(sub.name);
              }
            });
          }
        });
      } catch (err) {
        console.error("Error fetching roadmap data:", err);
      }

      weakTopics.push({
        topic: topicName,
        totalAttempts: stat.totalAttempts,
        correctAttempts: stat.correctAttempts,
        correctPercentage,
        roadmapId: stat.roadmapId,
        roadmapTitle,
        resources: stat.resources.slice(0, 6),
        relatedTopics: [...new Set(relatedTopics)].slice(0, 5),
      });
    }
  }

  return weakTopics
    .sort((a, b) => a.correctPercentage - b.correctPercentage)
    .slice(0, 5);
}

function detectType(url) {
  if (!url) return "article";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("leetcode.com") || url.includes("practice"))
    return "practice";
  return "article";
}

export async function getUserStudyPatterns(userId) {
  const { db } = await connectToDatabase();

  // Convert userId to string
  const userIdStr = userId.toString();

  // Get quiz completion times
  const quizResults = await db
    .collection("quiz_results")
    .find({ userId: userIdStr })
    .toArray();

  // Get problem completion times
  const problemProgress = await db
    .collection("user_progress")
    .find({ user_id: userIdStr, status: "completed" })
    .toArray();

  const allActivities = [
    ...quizResults.map((q) => q.completedAt),
    ...problemProgress.map((p) => p.updated_at),
  ];

  if (allActivities.length === 0) {
    return {
      mostActiveHours: [],
      mostActiveDays: [],
      averageSessionDuration: 0,
      totalActivities: 0,
    };
  }

  // Analyze by hour and day
  const byHour = {};
  const byDay = {};

  allActivities.forEach((timestamp) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const day = date.getDay();

    byHour[hour] = (byHour[hour] || 0) + 1;
    byDay[day] = (byDay[day] || 0) + 1;
  });

  // Get top 3 hours and days
  const mostActiveHours = Object.entries(byHour)
    .map(([hour, count]) => ({ _id: parseInt(hour), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const mostActiveDays = Object.entries(byDay)
    .map(([day, count]) => ({
      _id: parseInt(day),
      dayName: dayNames[day],
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Calculate average time spent on quizzes
  const totalTimeMinutes = quizResults.reduce(
    (sum, q) => sum + (q.timeTaken || 0),
    0
  );
  const averageSessionDuration =
    quizResults.length > 0
      ? Math.round(totalTimeMinutes / quizResults.length)
      : 0;

  return {
    mostActiveHours,
    mostActiveDays,
    averageSessionDuration,
    totalActivities: allActivities.length,
  };
}

export async function getProgressTrends(userId, timeframeDays = 30) {
  const { db } = await connectToDatabase();

  // Convert userId to string
  const userIdStr = userId.toString();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeframeDays);

  // Get quiz results in timeframe
  const quizResults = await db
    .collection("quiz_results")
    .find({
      userId: userIdStr,
      completedAt: { $gte: startDate },
    })
    .sort({ completedAt: 1 })
    .toArray();

  // Get problem progress in timeframe
  const problemProgress = await db
    .collection("user_progress")
    .find({
      user_id: userIdStr,
      status: "completed",
      updated_at: { $gte: startDate },
    })
    .sort({ updated_at: 1 })
    .toArray();

  // Group by date
  const dailyData = {};

  // Add quiz data
  quizResults.forEach((result) => {
    const dateKey = new Date(result.completedAt).toISOString().split("T")[0];
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = {
        date: dateKey,
        quizzesCompleted: 0,
        quizScores: [],
        problemsSolved: 0,
      };
    }
    dailyData[dateKey].quizzesCompleted++;
    dailyData[dateKey].quizScores.push(result.percentage || 0);
  });

  // Add problem data
  problemProgress.forEach((problem) => {
    const dateKey = new Date(problem.updated_at).toISOString().split("T")[0];
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = {
        date: dateKey,
        quizzesCompleted: 0,
        quizScores: [],
        problemsSolved: 0,
      };
    }
    dailyData[dateKey].problemsSolved++;
  });

  // Calculate averages and format
  const trends = Object.values(dailyData)
    .map((day) => ({
      date: day.date,
      formattedDate: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      quizzesCompleted: day.quizzesCompleted,
      averageQuizScore:
        day.quizScores.length > 0
          ? Math.round(
              day.quizScores.reduce((sum, s) => sum + s, 0) /
                day.quizScores.length
            )
          : 0,
      problemsSolved: day.problemsSolved,
      totalActivities: day.quizzesCompleted + day.problemsSolved,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return trends;
}

export async function getQuizAttempt(attemptId) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  try {
    const attempt = await db.collection("quiz_results").findOne({
      _id: new ObjectId(attemptId),
    });
    return serializeDoc(attempt);
  } catch (error) {
    console.error("Error fetching quiz attempt:", error);
    return null;
  }
}

export async function deleteQuizAttempt(attemptId, userId) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  try {
    const result = await db.collection("quiz_results").deleteOne({
      _id: new ObjectId(attemptId),
      userId: userId,
    });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting quiz attempt:", error);
    return false;
  }
}

export async function createQuizInBank(roadmapId, quizData) {
  const { db } = await connectToDatabase();

  const quizId = `quiz_${roadmapId}_${Date.now()}`;

  const quiz = {
    quizId,
    roadmapId,
    quizName: quizData.quizName || `Quiz Set ${Date.now()}`,
    questions: quizData.questions || [],
    settings: quizData.settings || {
      timeLimit: 20,
      passingScore: 70,
      shuffleQuestions: true,
      shuffleOptions: true,
      showExplanations: "after_submit",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection("quiz_bank").insertOne(quiz);

  await db.collection("roadmaps").updateOne(
    { slug: roadmapId },
    {
      $addToSet: { quizBankIds: quizId },
      $set: { updatedAt: new Date() },
    }
  );

  return { success: true, quizId };
}

export async function getQuizBank(roadmapId) {
  const { db } = await connectToDatabase();

  const quizzes = await db
    .collection("quiz_bank")
    .find({ roadmapId })
    .sort({ createdAt: 1 })
    .toArray();

  return serializeDocs(quizzes);
}

export async function getQuizFromBank(quizId) {
  const { db } = await connectToDatabase();

  const quiz = await db.collection("quiz_bank").findOne({ quizId });
  return serializeDoc(quiz);
}

export async function updateQuizInBank(quizId, quizData) {
  const { db } = await connectToDatabase();

  const result = await db.collection("quiz_bank").updateOne(
    { quizId },
    {
      $set: {
        ...quizData,
        updatedAt: new Date(),
      },
    }
  );

  return { success: true, modified: result.modifiedCount };
}

export async function deleteQuizFromBank(quizId) {
  const { db } = await connectToDatabase();

  const quiz = await db.collection("quiz_bank").findOne({ quizId });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  const roadmapQuizzes = await db
    .collection("quiz_bank")
    .countDocuments({ roadmapId: quiz.roadmapId });

  if (roadmapQuizzes <= 2) {
    throw new Error("Cannot delete: Minimum 2 quizzes required");
  }

  await db.collection("quiz_bank").deleteOne({ quizId });

  await db.collection("roadmaps").updateOne(
    { slug: quiz.roadmapId },
    {
      $pull: { quizBankIds: quizId },
      $set: { updatedAt: new Date() },
    }
  );

  return { success: true };
}

export async function getUserQuizAttempts(userId, roadmapId) {
  const { db } = await connectToDatabase();

  const attempts = await db.collection("user_quiz_attempts").findOne({
    userId: userId.toString(),
    roadmapId,
  });

  if (!attempts) {
    return {
      userId: userId.toString(),
      roadmapId,
      attemptsUsed: 0,
      attemptsUnlocked: 5,
      quizzesUsed: [],
      history: [],
      status: "not_started"
    };
  }

  return serializeDoc(attempts);
}

export async function incrementQuizAttempt(userId, roadmapId, quizId) {
  const { db } = await connectToDatabase();

  const result = await db.collection("user_quiz_attempts").updateOne(
    { userId: userId.toString(), roadmapId },
    {
      $addToSet: { quizzesUsed: quizId },
      $set: {
        lastAttemptAt: new Date(),
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId: userId.toString(),
        roadmapId,
        attemptsUsed: 0,
        attemptsUnlocked: 5,
        status: "in_progress",
        history: [],
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  return { success: true };
}

export async function resetQuizAttempts(userId, roadmapId) {
  const { db } = await connectToDatabase();

  const result = await db.collection("user_quiz_attempts").updateOne(
    { userId: userId.toString(), roadmapId },
    {
      $set: {
        attemptsUsed: 0,
        quizzesUsed: [],
        updatedAt: new Date(),
      },
    }
  );

  return { success: true, modified: result.modifiedCount };
}

export async function getRandomAvailableQuiz(userId, roadmapId) {
  const { db } = await connectToDatabase();

  const roadmap = await db.collection("roadmaps").findOne({ slug: roadmapId });

  if (!roadmap || !roadmap.quizBankIds || roadmap.quizBankIds.length === 0) {
    return null;
  }

  const userAttempts = await getUserQuizAttempts(userId, roadmapId);
  const usedQuizzes = userAttempts?.quizzesUsed || [];

  let availableQuizIds = roadmap.quizBankIds.filter(
    (id) => !usedQuizzes.includes(id)
  );

  if (availableQuizIds.length === 0) {
    await db
      .collection("user_quiz_attempts")
      .updateOne(
        { userId: userId.toString(), roadmapId },
        { $set: { quizzesUsed: [] } }
      );
    availableQuizIds = roadmap.quizBankIds;
  }

  const randomQuizId =
    availableQuizIds[Math.floor(Math.random() * availableQuizIds.length)];

  const quiz = await getQuizFromBank(randomQuizId);
  return quiz;
}

export async function updateRoadmapSetupStatus(slug, field, status) {
  const { db } = await connectToDatabase();

  const result = await db.collection("roadmaps").updateOne(
    { slug },
    {
      $set: {
        [field]: status,
        updatedAt: new Date(),
      },
    }
  );

  return { success: true, modified: result.modifiedCount };
}

export async function getRoadmapSetupStatus(slug) {
  const { db } = await connectToDatabase();

  const roadmap = await db.collection("roadmaps").findOne(
    { slug },
    {
      projection: {
        quizBankStatus: 1,
        weakTopicResourcesStatus: 1,
        quizAttemptLimit: 1,
        quizBankIds: 1,
      },
    }
  );

  return serializeDoc(roadmap);
}

export async function getStudentWeakTopicsByRoadmap(roadmapId) {
  const { db } = await connectToDatabase()

  const quizResults = await db
    .collection("quiz_results")
    .find({ roadmapId })
    .toArray()

  if (quizResults.length === 0) {
    return []
  }

  const topicFrequency = {}

  quizResults.forEach((result) => {
    if (!result.answers) return

    const answersArray = Array.isArray(result.answers)
      ? result.answers
      : Object.values(result.answers || {})

    answersArray.forEach((answer) => {
      if (!answer || typeof answer !== "object") return

      const topic =
        answer.topic && typeof answer.topic === "string"
          ? answer.topic
          : "General"

      if (!answer.isCorrect) {
        topicFrequency[topic] = (topicFrequency[topic] || 0) + 1
      }
    })
  })

  return Object.entries(topicFrequency)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

export async function generateSuggestedTopics(roadmapSlug) {
  const { db } = await connectToDatabase()

  const nodes = await db
    .collection("roadmap_nodes")
    .find({ roadmapId: roadmapSlug, published: true })
    .toArray()

  const topics = new Set()

  nodes.forEach((node) => {
    if (node.subtopics && Array.isArray(node.subtopics)) {
      node.subtopics.forEach((sub) => {
        if (sub.name) topics.add(sub.name)
      })
    }
  })

  return Array.from(topics).slice(0, 6)
}


// ==========================================
// ENHANCED QUIZ SYSTEM FUNCTIONS
// ==========================================

export async function getQuestionPoolForRoadmap(roadmapId) {
  const { db } = await connectToDatabase();

  const quizSets = await db
    .collection("quiz_bank")
    .find({ roadmapId })
    .toArray();

  const allQuestions = [];

  quizSets.forEach(set => {
    if (set.questions && Array.isArray(set.questions)) {
      set.questions.forEach(q => {
        allQuestions.push({
          ...q,
          setId: set.quizId,
          setName: set.quizName
        });
      });
    }
  });

  return allQuestions;
}

export async function generateRandomQuiz(roadmapId, difficulty = { easy: 3, medium: 4, hard: 3 }) {
  const allQuestions = await getQuestionPoolForRoadmap(roadmapId);

  if (allQuestions.length === 0) {
    return null;
  }

  const easyQuestions = allQuestions.filter(q => q.difficulty === 'easy');
  const mediumQuestions = allQuestions.filter(q => q.difficulty === 'medium');
  const hardQuestions = allQuestions.filter(q => q.difficulty === 'hard');

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const selectedQuestions = [
    ...shuffleArray(easyQuestions).slice(0, difficulty.easy),
    ...shuffleArray(mediumQuestions).slice(0, difficulty.medium),
    ...shuffleArray(hardQuestions).slice(0, difficulty.hard)
  ];

  const finalQuestions = shuffleArray(selectedQuestions).map(q => ({
    ...q,
    options: shuffleArray(q.options || [])
  }));

  return {
    questions: finalQuestions,
    settings: {
      timeLimit: 20,
      passingScore: 70,
      shuffleQuestions: true,
      shuffleOptions: true
    }
  };
}

export async function getNextQuizForUser(userId, roadmapId) {
  const { db } = await connectToDatabase();

  const roadmap = await db.collection("roadmaps").findOne({ slug: roadmapId });

  if (!roadmap) {
    return null;
  }

  const hasSets = roadmap.quizBankIds && roadmap.quizBankIds.length > 0;

  if (!hasSets) {
    return await generateRandomQuiz(roadmapId);
  }

  const userAttempts = await getUserQuizAttempts(userId, roadmapId);
  const usedQuizzes = userAttempts?.quizzesUsed || [];

  let availableQuizIds = roadmap.quizBankIds.filter(id => !usedQuizzes.includes(id));

  if (availableQuizIds.length === 0) {
    await db.collection("user_quiz_attempts").updateOne(
      { userId: userId.toString(), roadmapId },
      { $set: { quizzesUsed: [] } }
    );
    availableQuizIds = roadmap.quizBankIds;
  }

  const randomQuizId = availableQuizIds[Math.floor(Math.random() * availableQuizIds.length)];
  const quiz = await getQuizFromBank(randomQuizId);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return await generateRandomQuiz(roadmapId);
  }

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const shuffledQuestions = shuffleArray(quiz.questions).map(q => ({
    ...q,
    options: shuffleArray(q.options || [])
  }));

  return {
    ...quiz,
    questions: shuffledQuestions
  };
}

export async function evaluateQuizPerformance(userId, roadmapId) {
  const { db } = await connectToDatabase();

  const results = await db
    .collection("quiz_results")
    .find({ userId: userId.toString(), roadmapId })
    .sort({ completedAt: -1 })
    .limit(5)
    .toArray();

  if (results.length < 5) {
    return {
      shouldUnlock: false,
      unlockCount: 0,
      status: "in_progress",
      message: null
    };
  }

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  if (passed >= 3) {
    return {
      shouldUnlock: false,
      unlockCount: 0,
      status: "mastered",
      message: "Congratulations! You've mastered this roadmap. No need for more quizzes - start applying for jobs and ace those interviews! Come back anytime to revise concepts."
    };
  }

  if (failed >= 3) {
    return {
      shouldUnlock: true,
      unlockCount: 3,
      status: "struggling",
      message: "We noticed you're struggling. Keep learning! 3 bonus attempts unlocked."
    };
  }

  if (passed === 2 && failed === 3 || passed === 3 && failed === 2) {
    return {
      shouldUnlock: true,
      unlockCount: 2,
      status: "improving",
      message: "You're almost there! 2 more attempts to solidify your knowledge."
    };
  }

  return {
    shouldUnlock: false,
    unlockCount: 0,
    status: "in_progress",
    message: null
  };
}

export async function unlockBonusAttempts(userId, roadmapId, count) {
  const { db } = await connectToDatabase();

  const result = await db.collection("user_quiz_attempts").updateOne(
    { userId: userId.toString(), roadmapId },
    {
      $inc: { attemptsUnlocked: count },
      $set: { updatedAt: new Date() }
    },
    { upsert: true }
  );

  return { success: true, unlocked: count };
}

export async function updateQuizStatus(userId, roadmapId, status) {
  const { db } = await connectToDatabase();

  const result = await db.collection("user_quiz_attempts").updateOne(
    { userId: userId.toString(), roadmapId },
    {
      $set: {
        status,
        updatedAt: new Date()
      }
    },
    { upsert: true }
  );

  return { success: true, status };
}

export async function getQuizHistoryWithDetails(userId, roadmapId) {
  const { db } = await connectToDatabase();

  const results = await db
    .collection("quiz_results")
    .find({ userId: userId.toString(), roadmapId })
    .sort({ completedAt: -1 })
    .toArray();

  const roadmap = await getRoadmap(roadmapId);

  const enriched = results.map(result => ({
    ...serializeDoc(result),
    roadmapTitle: roadmap?.title || roadmapId,
    roadmapIcon: roadmap?.icon || "📚"
  }));

  return enriched;
}

export async function getQuizStatusForUser(userId, roadmapId) {
  const { db } = await connectToDatabase();

  const roadmap = await db.collection("roadmaps").findOne({ slug: roadmapId });

  if (!roadmap) {
    return null;
  }

  const attempts = await db.collection("user_quiz_attempts").findOne({
    userId: userId.toString(),
    roadmapId
  });

  const results = await db
    .collection("quiz_results")
    .find({ userId: userId.toString(), roadmapId })
    .sort({ completedAt: -1 })
    .toArray();

  const attemptsUsed = attempts?.attemptsUsed || 0;
  const attemptsUnlocked = attempts?.attemptsUnlocked || 5;
  const status = attempts?.status || "not_started";

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const bestScore = results.length > 0 ? Math.max(...results.map(r => r.percentage)) : 0;

  return {
    roadmapId,
    attemptsUsed,
    attemptsUnlocked,
    attemptsRemaining: Math.max(0, attemptsUnlocked - attemptsUsed),
    status,
    totalAttempts: results.length,
    passed,
    failed,
    bestScore,
    canTakeQuiz: attemptsUsed < attemptsUnlocked && status !== "mastered",
    lastAttemptAt: attempts?.lastAttemptAt || null
  };
}

export async function getUserQuizBadgeStats(userId) {
  const { db } = await connectToDatabase();

  const quizResults = await db
    .collection("quiz_results")
    .find({ userId: userId.toString() })
    .sort({ completedAt: -1 })
    .toArray();

  if (quizResults.length === 0) {
    return {
      quizAttempts: 0,
      quizPasses: 0,
      firstTryPass80Plus: false,
      quizComebackStory: false,
      perfectQuizScore: false
    };
  }

  const passes = quizResults.filter(r => r.passed).length;
  const hasPerfectScore = quizResults.some(r => r.percentage === 100);

  const roadmapGroups = {};
  quizResults.forEach(result => {
    if (!roadmapGroups[result.roadmapId]) {
      roadmapGroups[result.roadmapId] = [];
    }
    roadmapGroups[result.roadmapId].push(result);
  });

  let firstTryPass80Plus = false;
  let quizComebackStory = false;

  Object.values(roadmapGroups).forEach(attempts => {
    attempts.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

    if (attempts[0]?.passed && attempts[0]?.percentage >= 80) {
      firstTryPass80Plus = true;
    }

    const failures = attempts.filter(a => !a.passed).length;
    const hasPassAfterFailures = failures >= 3 && attempts.some(a => a.passed);
    if (hasPassAfterFailures) {
      quizComebackStory = true;
    }
  });

  return {
    quizAttempts: quizResults.length,
    quizPasses: passes,
    firstTryPass80Plus,
    quizComebackStory,
    perfectQuizScore: hasPerfectScore
  };
}
