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
  if (typeof doc !== "object") return doc;

  if (Array.isArray(doc)) {
    return doc.map((item) => serializeDoc(item));
  }

  const serialized = {};

  for (const [key, value] of Object.entries(doc)) {
    if (value === null || value === undefined) {
      serialized[key] = value;
    } else if (value.constructor && value.constructor.name === "ObjectId") {
      serialized[key] = value.toString();
    } else if (Array.isArray(value)) {
      serialized[key] = value.map((item) => serializeDoc(item));
    } else if (
      typeof value === "object" &&
      value.constructor.name === "Object"
    ) {
      serialized[key] = serializeDoc(value);
    } else if (value instanceof Date) {
      serialized[key] = value;
    } else {
      serialized[key] = value;
    }
  }

  return serialized;
}

function serializeDocs(docs) {
  if (!Array.isArray(docs)) return [];
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

export async function getQuestionsByPattern(patternSlug) {
  try {
    const { db } = await connectToDatabase();

    const questions = await db
      .collection("questions")
      .find({ pattern_id: patternSlug })
      .sort({ order: 1 })
      .toArray();

    return questions.map((q, index) => ({
      _id: q._id.toString(),
      title: q.title,
      difficulty: q.difficulty || "Medium",
      acceptanceRate: q.acceptanceRate || null,
      slug: q.slug,
      pattern: patternSlug,
      pattern_id: patternSlug,
      order: q.order || index + 1,
      tags: q.tags || [],
      companies: q.companies || [],
      complexity: q.complexity || null,
      questionSlug: q.slug,
      links: q.links || {},
      approaches: q.approaches || [],
      hints: q.hints || [],
      resources: q.resources || null,
      commonMistakes: q.commonMistakes || [],
    }));
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

export async function getQuestionWithFullData(questionSlugOrId, patternSlug) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  let question = null;

  // Try to find by ObjectId first (if valid)
  if (ObjectId.isValid(questionSlugOrId)) {
    question = await db.collection("questions").findOne({
      _id: new ObjectId(questionSlugOrId),
    });
  }

  // If not found, try by slug with pattern
  if (!question) {
    question = await db.collection("questions").findOne({
      slug: questionSlugOrId,
      pattern_id: patternSlug,
    });
  }

  // If still not found, try slug without pattern
  if (!question) {
    question = await db.collection("questions").findOne({
      slug: questionSlugOrId,
    });
  }

  if (!question) return null;

  // Return complete question with all fields
  return serializeDoc({
    ...question,
    // Ensure arrays exist (even if empty)
    approaches: question.approaches || [],
    tags: question.tags || [],
    companies: question.companies || [],
    hints: question.hints || [],
    commonMistakes: question.commonMistakes || [],
    followUp: question.followUp || [],
    relatedProblems: question.relatedProblems || [],
    // Ensure objects exist
    resources: question.resources || null,
    links: question.links || {},
    complexity: question.complexity || null,
  });
}

// SOLUTIONS
export async function getSolution(questionId) {
  try {
    const { db } = await connectToDatabase();

    // Try to find by _id first
    let question = null;

    try {
      const { ObjectId } = await import("mongodb");
      if (ObjectId.isValid(questionId)) {
        question = await db.collection("questions").findOne({
          _id: new ObjectId(questionId),
        });
      }
    } catch (err) {
      //   console.log("Not an ObjectId, trying as string:", questionId);
    }

    // If not found by _id, try slug
    if (!question) {
      question = await db.collection("questions").findOne({
        slug: questionId,
      });
    }

    if (!question) {
      //   console.log(`Solution not found for questionId: ${questionId}`);
      return null;
    }

    // Get pattern info
    const pattern = await db.collection("patterns").findOne({
      slug: question.pattern_id,
    });

    return {
      questionId: question._id.toString(),
      title: question.title,
      difficulty: question.difficulty || "Medium",
      pattern: question.pattern_id,
      patternName: pattern?.name || question.pattern_id,
      tags: question.tags || [],
      companies: question.companies || [],
      links: question.links || {},
      questionSlug: question.slug,
      approaches: [], // Add if you have approaches in MongoDB
    };
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
    isBlocked: false,
    blockReason: null,
    blockedBy: null,
    blockedAt: null,
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

export async function getBookmarksCountFixed(userId) {
  const { db } = await connectToDatabase();
  const count = await db
    .collection("bookmarks")
    .countDocuments({ user_id: userId });
  return count;
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

export async function getUserStats(userId) {
  const { db } = await connectToDatabase();

  // COUNT FROM MONGODB (not filesystem)
  const totalQuestions = await db.collection("questions").countDocuments();

  const allProgress = await db
    .collection("user_progress")
    .find({ user_id: userId })
    .toArray();

  const completed = allProgress.filter((p) => p.status === "completed");
  const inProgress = allProgress.filter((p) => p.status === "in_progress");

  // Get patterns from MongoDB
  const patternsData = await db.collection("patterns").find({}).toArray();
  const patternStats = {};

  for (const pattern of patternsData) {
    // Get questions from MongoDB (not filesystem)
    const patternQuestions = await db
      .collection("questions")
      .find({ pattern_id: pattern.slug })
      .toArray();

    // FIX: Convert ObjectId to string for comparison
    const completedInPattern = completed.filter((p) =>
      patternQuestions.some((q) => q._id.toString() === p.question_id)
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
      // Get questions from MongoDB (not filesystem)
      const patternQuestions = await db
        .collection("questions")
        .find({ pattern_id: pattern.slug })
        .toArray();

      // FIX: Convert ObjectId to string for comparison
      const completedInPattern = userProgress.filter(
        (p) =>
          patternQuestions.some((q) => q._id.toString() === p.question_id) &&
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
    username: user.username || null,
    createdAt: user.created_at,
    profile: profile
      ? {
          bio: profile.bio || "",
          location: profile.location || "",
          college: profile.college || "",
          graduationYear: profile.graduationYear || "",
          currentYear: profile.currentYear || "",
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
          usernameLastChanged: profile.usernameLastChanged || null,
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

  // FIX: Properly handle null/undefined values
  const completed = fields.filter(
    (field) =>
      field !== null &&
      field !== undefined &&
      field !== "" &&
      field.toString().trim() !== ""
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
      const nodes = await getRoadmapNodes(progress.roadmapId);

      const currentNode = progress.currentNodeId
        ? await getRoadmapNode(progress.currentNodeId)
        : null;

      const completedNodes =
        progress.nodesProgress?.filter((n) => n.status === "completed")
          .length || 0;

      const quizAttempts = await db.collection("user_quiz_attempts").findOne({
        userId: userId.toString(),
        roadmapId: progress.roadmapId,
      });

      return {
        ...serializeDoc(progress),
        roadmap,
        currentNodeId: progress.currentNodeId || null,
        currentNodeTitle: currentNode?.title || null,
        completedNodes,
        totalNodes: nodes.length,
        quizAttempts: quizAttempts
          ? {
              used: quizAttempts.attemptsUsed || 0,
              unlocked: quizAttempts.attemptsUnlocked || 5,
              status: quizAttempts.status || "not_started",
            }
          : null,
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

  const validNodeIds = new Set(allNodes.map((n) => n.nodeId));

  const cleanedProgress = progress.nodesProgress.filter((np) =>
    validNodeIds.has(np.nodeId)
  );

  await db.collection("roadmap_progress").updateOne(
    { _id: progress._id },
    {
      $set: {
        nodesProgress: cleanedProgress,
        updatedAt: new Date(),
      },
    }
  );

  await recalculateRoadmapProgress(userId, roadmapId);

  return {
    success: true,
    removed: progress.nodesProgress.length - cleanedProgress.length,
  };
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

export async function bulkCreateNodes(roadmapId, nodes) {
  const { db } = await connectToDatabase();

  if (!Array.isArray(nodes) || nodes.length === 0) {
    throw new Error("Nodes must be a non-empty array");
  }

  const nodesToInsert = nodes.map((node) => ({
    nodeId: node.nodeId,
    roadmapId: roadmapId,
    title: node.title,
    weekNumber: node.weekNumber || null,
    order: node.order || 0,
    subtopics: node.subtopics || [],
    resources: node.resources || [],
    published: node.published ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const result = await db.collection("roadmap_nodes").insertMany(nodesToInsert);

  return {
    success: true,
    inserted: result.insertedCount,
    nodeIds: Object.values(result.insertedIds).map(id => id.toString())
  };
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

export async function saveQuizResult(
  userId,
  roadmapId,
  score,
  answers,
  timeTaken,
  quizId
) {
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
          completedAt: new Date(),
        },
      },
      $set: {
        lastAttemptAt: new Date(),
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId: userId.toString(),
        roadmapId,
        attemptsUnlocked: 5,
        status: "in_progress",
        createdAt: new Date(),
      },
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
    evaluation,
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

export async function getUserQuizStats(userId) {
  const { db } = await connectToDatabase();
  const userIdStr = userId.toString();

  const results = await db
    .collection("quiz_results")
    .find({ userId: userIdStr })
    .sort({ completedAt: -1 })
    .toArray();

  if (results.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      bestScore: 0,
      passedCount: 0,
      failedCount: 0,
      improvement: 0,
      recentAttempts: [],
      availableQuizzes: [],
      lockedQuizzes: [],
      recentQuiz: null,
    };
  }

  const totalAttempts = results.length;
  const passedResults = results.filter((r) => r.passed);
  const failedResults = results.filter((r) => !r.passed);
  const passedCount = passedResults.length;
  const failedCount = failedResults.length;

  const scores = results.map((r) => r.percentage || 0);
  const averageScore = Math.round(
    scores.reduce((sum, s) => sum + s, 0) / scores.length
  );
  const bestScore = Math.max(...scores);

  let improvement = 0;
  if (results.length >= 10) {
    const recent5 = results.slice(0, 5);
    const previous5 = results.slice(5, 10);
    const recentAvg =
      recent5.reduce((sum, r) => sum + (r.percentage || 0), 0) / 5;
    const previousAvg =
      previous5.reduce((sum, r) => sum + (r.percentage || 0), 0) / 5;
    improvement = Math.round(recentAvg - previousAvg);
  }

  const recentAttempts = await Promise.all(
    results.slice(0, 10).map(async (result) => {
      const roadmap = await getRoadmap(result.roadmapId);
      return {
        attemptId: result._id.toString(),
        patternName: roadmap?.title || result.roadmapId,
        roadmapId: result.roadmapId,
        score: result.percentage || 0,
        passed: result.passed || false,
        date: result.completedAt,
        timeTaken: result.timeTaken || 0,
      };
    })
  );

  const allRoadmaps = await db
    .collection("roadmaps")
    .find({ published: true })
    .toArray();

  const userProgress = await db
    .collection("roadmap_progress")
    .find({ userId: userIdStr })
    .toArray();

  const availableQuizzes = [];
  const lockedQuizzes = [];

  for (const roadmap of allRoadmaps) {
    const progress = userProgress.find((p) => p.roadmapId === roadmap.slug);
    const progressPercent = progress?.overallProgress || 0;

    if (progressPercent >= 90) {
      availableQuizzes.push({
        roadmapId: roadmap.slug,
        title: roadmap.title,
        icon: roadmap.icon,
      });
    } else {
      lockedQuizzes.push({
        roadmapId: roadmap.slug,
        title: roadmap.title,
        icon: roadmap.icon,
        requiredProgress: 90,
        currentProgress: progressPercent,
      });
    }
  }

  const recentQuiz = recentAttempts[0] || null;

  return {
    totalAttempts,
    averageScore,
    bestScore,
    passedCount,
    failedCount,
    improvement,
    recentAttempts,
    availableQuizzes,
    lockedQuizzes,
    recentQuiz,
  };
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
      status: "not_started",
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
  const { db } = await connectToDatabase();

  const quizResults = await db
    .collection("quiz_results")
    .find({ roadmapId })
    .toArray();

  if (quizResults.length === 0) {
    return [];
  }

  const topicFrequency = {};

  quizResults.forEach((result) => {
    if (!result.answers) return;

    const answersArray = Array.isArray(result.answers)
      ? result.answers
      : Object.values(result.answers || {});

    answersArray.forEach((answer) => {
      if (!answer || typeof answer !== "object") return;

      const topic =
        answer.topic && typeof answer.topic === "string"
          ? answer.topic
          : "General";

      if (!answer.isCorrect) {
        topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
      }
    });
  });

  return Object.entries(topicFrequency)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export async function generateSuggestedTopics(roadmapSlug) {
  const { db } = await connectToDatabase();

  const nodes = await db
    .collection("roadmap_nodes")
    .find({ roadmapId: roadmapSlug, published: true })
    .toArray();

  const topics = new Set();

  nodes.forEach((node) => {
    if (node.subtopics && Array.isArray(node.subtopics)) {
      node.subtopics.forEach((sub) => {
        if (sub.name) topics.add(sub.name);
      });
    }
  });

  return Array.from(topics).slice(0, 6);
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

  quizSets.forEach((set) => {
    if (set.questions && Array.isArray(set.questions)) {
      set.questions.forEach((q) => {
        allQuestions.push({
          ...q,
          setId: set.quizId,
          setName: set.quizName,
        });
      });
    }
  });

  return allQuestions;
}

export async function generateRandomQuiz(
  roadmapId,
  difficulty = { easy: 3, medium: 4, hard: 3 }
) {
  const allQuestions = await getQuestionPoolForRoadmap(roadmapId);

  if (allQuestions.length === 0) {
    return null;
  }

  const easyQuestions = allQuestions.filter((q) => q.difficulty === "easy");
  const mediumQuestions = allQuestions.filter((q) => q.difficulty === "medium");
  const hardQuestions = allQuestions.filter((q) => q.difficulty === "hard");

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
    ...shuffleArray(hardQuestions).slice(0, difficulty.hard),
  ];

  const finalQuestions = shuffleArray(selectedQuestions).map((q) => ({
    ...q,
    options: shuffleArray(q.options || []),
  }));

  return {
    questions: finalQuestions,
    settings: {
      timeLimit: 20,
      passingScore: 70,
      shuffleQuestions: true,
      shuffleOptions: true,
    },
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

  const shuffledQuestions = shuffleArray(quiz.questions).map((q) => ({
    ...q,
    options: shuffleArray(q.options || []),
  }));

  return {
    ...quiz,
    questions: shuffledQuestions,
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
      message: null,
    };
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  if (passed >= 3) {
    return {
      shouldUnlock: false,
      unlockCount: 0,
      status: "mastered",
      message:
        "Congratulations! You've mastered this roadmap. No need for more quizzes - start applying for jobs and ace those interviews! Come back anytime to revise concepts.",
    };
  }

  if (failed >= 3) {
    return {
      shouldUnlock: true,
      unlockCount: 3,
      status: "struggling",
      message:
        "We noticed you're struggling. Keep learning! 3 bonus attempts unlocked.",
    };
  }

  if ((passed === 2 && failed === 3) || (passed === 3 && failed === 2)) {
    return {
      shouldUnlock: true,
      unlockCount: 2,
      status: "improving",
      message:
        "You're almost there! 2 more attempts to solidify your knowledge.",
    };
  }

  return {
    shouldUnlock: false,
    unlockCount: 0,
    status: "in_progress",
    message: null,
  };
}

export async function unlockBonusAttempts(userId, roadmapId, count) {
  const { db } = await connectToDatabase();

  const result = await db.collection("user_quiz_attempts").updateOne(
    { userId: userId.toString(), roadmapId },
    {
      $inc: { attemptsUnlocked: count },
      $set: { updatedAt: new Date() },
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
        updatedAt: new Date(),
      },
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

  const enriched = results.map((result) => ({
    ...serializeDoc(result),
    roadmapTitle: roadmap?.title || roadmapId,
    roadmapIcon: roadmap?.icon || "📚",
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
    roadmapId,
  });

  const results = await db
    .collection("quiz_results")
    .find({ userId: userId.toString(), roadmapId })
    .sort({ completedAt: -1 })
    .toArray();

  const attemptsUsed = attempts?.attemptsUsed || 0;
  const attemptsUnlocked = attempts?.attemptsUnlocked || 5;
  const status = attempts?.status || "not_started";

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const bestScore =
    results.length > 0 ? Math.max(...results.map((r) => r.percentage)) : 0;

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
    lastAttemptAt: attempts?.lastAttemptAt || null,
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
      perfectQuizScore: false,
    };
  }

  const passes = quizResults.filter((r) => r.passed).length;
  const hasPerfectScore = quizResults.some((r) => r.percentage === 100);

  const roadmapGroups = {};
  quizResults.forEach((result) => {
    if (!roadmapGroups[result.roadmapId]) {
      roadmapGroups[result.roadmapId] = [];
    }
    roadmapGroups[result.roadmapId].push(result);
  });

  let firstTryPass80Plus = false;
  let quizComebackStory = false;

  Object.values(roadmapGroups).forEach((attempts) => {
    attempts.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

    if (attempts[0]?.passed && attempts[0]?.percentage >= 80) {
      firstTryPass80Plus = true;
    }

    const failures = attempts.filter((a) => !a.passed).length;
    const hasPassAfterFailures =
      failures >= 3 && attempts.some((a) => a.passed);
    if (hasPassAfterFailures) {
      quizComebackStory = true;
    }
  });

  return {
    quizAttempts: quizResults.length,
    quizPasses: passes,
    firstTryPass80Plus,
    quizComebackStory,
    perfectQuizScore: hasPerfectScore,
  };
}

// ==========================================
// ADMIN USER MANAGEMENT
// ==========================================

export async function getAllUsers(filters = {}) {
  const { db } = await connectToDatabase();

  const query = {};

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
    ];
  }

  if (filters.status === "blocked") {
    query.isBlocked = true;
  } else if (filters.status === "active") {
    query.isBlocked = { $ne: true };
  }

  const users = await db
    .collection("users")
    .find(query)
    .sort({ created_at: -1 })
    .toArray();

  return serializeDocs(users);
}

export async function getUserById(userId) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const user = await db.collection("users").findOne({
    _id: new ObjectId(userId),
  });

  return serializeDoc(user);
}

export async function blockUser(userId, reason, blockedBy) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        isBlocked: true,
        blockReason: reason,
        blockedBy: blockedBy,
        blockedAt: new Date(),
      },
    }
  );

  return { success: result.modifiedCount > 0 };
}

export async function unblockUser(userId) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        isBlocked: false,
        blockReason: null,
        blockedBy: null,
        blockedAt: null,
        showWelcomeBack: true,
        unblockedAt: new Date(),
      },
    }
  );

  return { success: result.modifiedCount > 0 };
}

export async function deleteUser(userId) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  await db.collection("users").deleteOne({ _id: new ObjectId(userId) });
  await db
    .collection("user_progress")
    .deleteMany({ user_id: userId.toString() });
  await db.collection("user_profiles").deleteOne({ userId: userId.toString() });
  await db
    .collection("roadmap_progress")
    .deleteMany({ userId: userId.toString() });
  await db.collection("quiz_results").deleteMany({ userId: userId.toString() });

  return { success: true };
}

export async function updateUserAttempts(userId, roadmapId, attempts) {
  const { db } = await connectToDatabase();

  const result = await db.collection("user_quiz_attempts").updateOne(
    { userId: userId.toString(), roadmapId },
    {
      $set: {
        customAttempts: attempts,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return { success: true };
}

export async function getAdminDashboardStats() {
  const { db } = await connectToDatabase();

  const totalUsers = await db.collection("users").countDocuments();
  const totalRoadmaps = await db
    .collection("roadmaps")
    .countDocuments({ published: true });
  const totalNodes = await db
    .collection("roadmap_nodes")
    .countDocuments({ published: true });

  const activeLearners = await db
    .collection("roadmap_progress")
    .distinct("userId", {
      lastAccessedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

  const popularRoadmaps = await db
    .collection("roadmap_progress")
    .aggregate([
      { $group: { _id: "$roadmapId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ])
    .toArray();

  const enrichedRoadmaps = await Promise.all(
    popularRoadmaps.map(async (item) => {
      const roadmap = await getRoadmap(item._id);
      return {
        ...serializeDoc(roadmap),
        followers: item.count,
      };
    })
  );

  return {
    totalUsers,
    totalRoadmaps,
    totalNodes,
    activeLearners: activeLearners.length,
    popularRoadmaps: enrichedRoadmaps,
  };
}

export async function logAdminAction(
  adminId,
  action,
  resourceType,
  resourceId,
  changes = null
) {
  const { db } = await connectToDatabase();

  await db.collection("activity_logs").insertOne({
    actor: adminId,
    actorType: "admin",
    action,
    resourceType,
    resourceId,
    changes,
    timestamp: new Date(),
  });
}

// ==========================================
// PHASE 2: USER MANAGEMENT FUNCTIONS
// ==========================================

export async function getUserDetailedInfo(userId) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const userObjectId =
    typeof userId === "string" ? new ObjectId(userId) : userId;
  const userIdStr = userId.toString();

  const user = await db.collection("users").findOne({ _id: userObjectId });
  if (!user) return null;

  const [profile, roadmapProgress, quizResults, quizAttempts] =
    await Promise.all([
      db.collection("user_profiles").findOne({ userId: userIdStr }),
      db.collection("roadmap_progress").find({ userId: userIdStr }).toArray(),
      db
        .collection("quiz_results")
        .find({ userId: userIdStr })
        .sort({ completedAt: -1 })
        .toArray(),
      db.collection("user_quiz_attempts").find({ userId: userIdStr }).toArray(),
    ]);

  const enrichedRoadmaps = await Promise.all(
    roadmapProgress.map(async (progress) => {
      const roadmap = await getRoadmap(progress.roadmapId);
      const attemptInfo = quizAttempts.find(
        (a) => a.roadmapId === progress.roadmapId
      );
      return {
        ...serializeDoc(progress),
        roadmap: roadmap ? serializeDoc(roadmap) : null,
        quizAttempts: attemptInfo
          ? {
              used: attemptInfo.attemptsUsed || 0,
              unlocked: attemptInfo.attemptsUnlocked || 5,
              status: attemptInfo.status || "not_started",
            }
          : null,
      };
    })
  );

  return {
    user: serializeDoc(user),
    profile: profile ? serializeDoc(profile) : null,
    roadmaps: enrichedRoadmaps,
    quizResults: serializeDocs(quizResults),
    quizAttempts: serializeDocs(quizAttempts),
    stats: {
      totalRoadmaps: roadmapProgress.length,
      totalQuizzes: quizResults.length,
      passedQuizzes: quizResults.filter((q) => q.passed).length,
    },
  };
}

export async function getUserActivityTimeline(userId, limit = 50) {
  const { db } = await connectToDatabase();
  const userIdStr = userId.toString();

  const [quizResults, roadmapProgress, certificates, profileUpdates] =
    await Promise.all([
      db
        .collection("quiz_results")
        .find({ userId: userIdStr })
        .sort({ completedAt: -1 })
        .limit(limit)
        .toArray(),
      db
        .collection("roadmap_progress")
        .find({ userId: userIdStr })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .toArray(),
      db
        .collection("certificates")
        .find({ userId: userIdStr })
        .sort({ issuedAt: -1 })
        .toArray(),
      db
        .collection("user_profiles")
        .find({ userId: userIdStr })
        .sort({ updatedAt: -1 })
        .limit(10)
        .toArray(),
    ]);

  const timeline = [];

  quizResults.forEach((quiz) => {
    timeline.push({
      type: "quiz",
      action: quiz.passed ? "passed_quiz" : "failed_quiz",
      timestamp: quiz.completedAt,
      data: {
        roadmapId: quiz.roadmapId,
        score: quiz.percentage,
        attemptNumber: quiz.attemptNumber,
      },
    });
  });

  roadmapProgress.forEach((progress) => {
    if (progress.startedAt) {
      timeline.push({
        type: "roadmap",
        action: "started_roadmap",
        timestamp: progress.startedAt,
        data: {
          roadmapId: progress.roadmapId,
          progress: progress.overallProgress,
        },
      });
    }
  });

  certificates.forEach((cert) => {
    timeline.push({
      type: "certificate",
      action: "earned_certificate",
      timestamp: cert.issuedAt,
      data: {
        roadmapId: cert.roadmapId,
        certificateId: cert.certificateId,
      },
    });
  });

  profileUpdates.forEach((profile) => {
    if (profile.updatedAt) {
      timeline.push({
        type: "profile",
        action: "updated_profile",
        timestamp: profile.updatedAt,
        data: {},
      });
    }
  });

  return timeline
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit)
    .map((item) => ({
      ...item,
      timestamp: item.timestamp,
    }));
}

export async function bulkBlockUsers(userIds, reason, blockedBy) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const objectIds = userIds.map((id) => new ObjectId(id));

  const result = await db.collection("users").updateMany(
    { _id: { $in: objectIds } },
    {
      $set: {
        isBlocked: true,
        blockReason: reason,
        blockedBy: blockedBy,
        blockedAt: new Date(),
      },
    }
  );

  return { success: true, modified: result.modifiedCount };
}

export async function bulkDeleteUsers(userIds) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const objectIds = userIds.map((id) => new ObjectId(id));
  const userIdStrs = userIds.map((id) => id.toString());

  await Promise.all([
    db.collection("users").deleteMany({ _id: { $in: objectIds } }),
    db.collection("user_progress").deleteMany({ user_id: { $in: userIdStrs } }),
    db.collection("user_profiles").deleteMany({ userId: { $in: userIdStrs } }),
    db
      .collection("roadmap_progress")
      .deleteMany({ userId: { $in: userIdStrs } }),
    db.collection("quiz_results").deleteMany({ userId: { $in: userIdStrs } }),
    db
      .collection("user_quiz_attempts")
      .deleteMany({ userId: { $in: userIdStrs } }),
  ]);

  return { success: true, deleted: userIds.length };
}

export async function updateAdminNotes(userId, notes) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        adminNotes: notes,
        adminNotesUpdatedAt: new Date(),
      },
    }
  );

  return { success: result.modifiedCount > 0 };
}

export async function getAllUsersWithStats(filters = {}) {
  const { db } = await connectToDatabase();

  const query = {};

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
    ];
  }

  if (filters.status === "blocked") {
    query.isBlocked = true;
  } else if (filters.status === "active") {
    query.isBlocked = { $ne: true };
  }

  const page = filters.page || 1;
  const limit = 50;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    db
      .collection("users")
      .find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection("users").countDocuments(query),
  ]);

  const enrichedUsers = await Promise.all(
    users.map(async (user) => {
      const userIdStr = user._id.toString();

      const [roadmapCount, quizCount, quizAttempts] = await Promise.all([
        db.collection("roadmap_progress").countDocuments({ userId: userIdStr }),
        db.collection("quiz_results").countDocuments({ userId: userIdStr }),
        db
          .collection("user_quiz_attempts")
          .find({ userId: userIdStr })
          .toArray(),
      ]);

      return {
        ...serializeDoc(user),
        stats: {
          roadmaps: roadmapCount,
          quizzes: quizCount,
          attempts: serializeDocs(quizAttempts),
        },
      };
    })
  );

  return {
    users: enrichedUsers,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}

// ==========================================
// PHASE 3: MENTORSHIP MANAGEMENT FUNCTIONS
// ==========================================

export async function createMentorshipRequest(data) {
  const { db } = await connectToDatabase();

  const request = {
    userId: data.userId,
    userName: data.userName,
    userEmail: data.userEmail,
    userPhone: data.userPhone || null,
    type: data.type || "general",
    subject: data.subject || "General Inquiry",
    message: data.message,
    status: "pending",
    replies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("mentorship_requests").insertOne(request);
  return serializeDoc({ ...request, _id: result.insertedId });
}

export async function getAllMentorshipRequests(filters = {}) {
  const { db } = await connectToDatabase();

  const query = {};

  if (filters.search) {
    query.$or = [
      { userName: { $regex: filters.search, $options: "i" } },
      { userEmail: { $regex: filters.search, $options: "i" } },
      { subject: { $regex: filters.search, $options: "i" } },
    ];
  }

  if (filters.status && filters.status !== "all") {
    query.status = filters.status;
  }

  if (filters.type && filters.type !== "all") {
    query.type = filters.type;
  }

  const page = filters.page || 1;
  const limit = 50;
  const skip = (page - 1) * limit;

  const [requests, total] = await Promise.all([
    db
      .collection("mentorship_requests")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection("mentorship_requests").countDocuments(query),
  ]);

  return {
    requests: serializeDocs(requests),
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}

export async function getMentorshipRequestById(requestId) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const request = await db.collection("mentorship_requests").findOne({
    _id: new ObjectId(requestId),
  });

  if (!request) return null;

  let user = null;
  if (request.userId) {
    user = await getUserById(request.userId);
  }

  return {
    request: serializeDoc(request),
    user: user ? serializeDoc(user) : null,
  };
}

export async function addMentorshipReply(requestId, reply) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const result = await db.collection("mentorship_requests").updateOne(
    { _id: new ObjectId(requestId) },
    {
      $push: {
        replies: {
          adminEmail: reply.adminEmail,
          adminName: reply.adminName || reply.adminEmail.split("@")[0],
          message: reply.message,
          repliedAt: new Date(),
        },
      },
      $set: {
        status: "replied",
        updatedAt: new Date(),
      },
    }
  );

  return { success: result.modifiedCount > 0 };
}

export async function updateMentorshipStatus(requestId, status) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const result = await db.collection("mentorship_requests").updateOne(
    { _id: new ObjectId(requestId) },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    }
  );

  return { success: result.modifiedCount > 0 };
}

export async function bulkUpdateMentorshipStatus(requestIds, status) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const objectIds = requestIds.map((id) => new ObjectId(id));

  const result = await db.collection("mentorship_requests").updateMany(
    { _id: { $in: objectIds } },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    }
  );

  return { success: true, modified: result.modifiedCount };
}

export async function getMentorshipStats() {
  const { db } = await connectToDatabase();

  const [total, pending, replied, closed, byType] = await Promise.all([
    db.collection("mentorship_requests").countDocuments(),
    db.collection("mentorship_requests").countDocuments({ status: "pending" }),
    db.collection("mentorship_requests").countDocuments({ status: "replied" }),
    db.collection("mentorship_requests").countDocuments({ status: "closed" }),
    db
      .collection("mentorship_requests")
      .aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }])
      .toArray(),
  ]);

  const typeStats = {};
  byType.forEach((item) => {
    typeStats[item._id] = item.count;
  });

  return {
    total,
    pending,
    replied,
    closed,
    byType: typeStats,
  };
}

// ==========================================
// ANALYTICS FUNCTIONS \
// ==========================================

export async function getUserGrowthData(days = 30) {
  const { db } = await connectToDatabase();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const users = await db
    .collection("users")
    .find({ created_at: { $gte: startDate } })
    .toArray();

  const byDate = {};
  users.forEach((user) => {
    const date = new Date(user.created_at).toISOString().split("T")[0];
    byDate[date] = (byDate[date] || 0) + 1;
  });

  return Object.entries(byDate)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

export async function getActiveUsersData(days = 30) {
  const { db } = await connectToDatabase();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const quizActivity = await db
    .collection("quiz_results")
    .find({ completedAt: { $gte: startDate } })
    .toArray();

  const progressActivity = await db
    .collection("user_progress")
    .find({
      updated_at: { $gte: startDate },
      status: "completed",
    })
    .toArray();

  const byDate = {};

  [...quizActivity, ...progressActivity].forEach((activity) => {
    const date = new Date(activity.completedAt || activity.updated_at)
      .toISOString()
      .split("T")[0];
    const userId = activity.userId || activity.user_id;

    if (!byDate[date]) byDate[date] = new Set();
    byDate[date].add(userId);
  });

  return Object.entries(byDate)
    .map(([date, users]) => ({
      date,
      count: users.size,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

export async function getQuizPerformanceByRoadmap() {
  const { db } = await connectToDatabase();

  const results = await db.collection("quiz_results").find({}).toArray();

  const byRoadmap = {};

  results.forEach((result) => {
    if (!byRoadmap[result.roadmapId]) {
      byRoadmap[result.roadmapId] = {
        roadmapId: result.roadmapId,
        total: 0,
        passed: 0,
        failed: 0,
        totalScore: 0,
      };
    }

    byRoadmap[result.roadmapId].total++;
    if (result.passed) {
      byRoadmap[result.roadmapId].passed++;
    } else {
      byRoadmap[result.roadmapId].failed++;
    }
    byRoadmap[result.roadmapId].totalScore += result.percentage || 0;
  });

  const enriched = await Promise.all(
    Object.values(byRoadmap).map(async (stat) => {
      const roadmap = await getRoadmap(stat.roadmapId);
      return {
        roadmapId: stat.roadmapId,
        roadmapTitle: roadmap?.title || stat.roadmapId,
        roadmapIcon: roadmap?.icon || "📚",
        total: stat.total,
        passed: stat.passed,
        failed: stat.failed,
        passRate: Math.round((stat.passed / stat.total) * 100),
        avgScore: Math.round(stat.totalScore / stat.total),
      };
    })
  );

  return enriched.sort((a, b) => b.total - a.total);
}

export async function getPopularRoadmaps(limit = 5) {
  const { db } = await connectToDatabase();

  const progress = await db
    .collection("roadmap_progress")
    .aggregate([
      { $group: { _id: "$roadmapId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ])
    .toArray();

  const enriched = await Promise.all(
    progress.map(async (item) => {
      const roadmap = await getRoadmap(item._id);
      return {
        roadmapId: item._id,
        title: roadmap?.title || item._id,
        icon: roadmap?.icon || "📚",
        category: roadmap?.category || "General",
        followers: item.count,
      };
    })
  );

  return enriched;
}

export async function getAverageQuizScores() {
  const { db } = await connectToDatabase();

  const results = await db.collection("quiz_results").find({}).toArray();

  if (results.length === 0) return 0;

  const totalScore = results.reduce((sum, r) => sum + (r.percentage || 0), 0);
  return Math.round(totalScore / results.length);
}

export async function getAnalyticsOverview() {
  const { db } = await connectToDatabase();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsersThisWeek,
    newUsersLastWeek,
    totalRoadmaps,
    totalQuizzes,
    activeUsers,
    avgQuizScore,
  ] = await Promise.all([
    db.collection("users").countDocuments(),
    db.collection("users").countDocuments({
      created_at: { $gte: sevenDaysAgo },
    }),
    db.collection("users").countDocuments({
      created_at: {
        $gte: new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
        $lt: sevenDaysAgo,
      },
    }),
    db.collection("roadmaps").countDocuments({ published: true }),
    db.collection("quiz_results").countDocuments(),
    db
      .collection("roadmap_progress")
      .distinct("userId", {
        lastAccessedAt: { $gte: sevenDaysAgo },
      })
      .then((users) => users.length),
    getAverageQuizScores(),
  ]);

  return {
    totalUsers,
    newUsersThisWeek,
    userGrowthRate: calculateGrowthRate(newUsersThisWeek, newUsersLastWeek),
    totalRoadmaps,
    totalQuizzes,
    activeUsers,
    avgQuizScore,
  };
}

function calculateGrowthRate(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export async function getPendingMentorshipCount() {
  const { db } = await connectToDatabase();

  const [pending, urgent] = await Promise.all([
    db.collection("mentorship_requests").countDocuments({ status: "pending" }),
    db.collection("mentorship_requests").countDocuments({
      status: "pending",
      createdAt: {
        $lt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
    }),
  ]);

  return { pending, urgent };
}

export async function getPlatformSettings() {
  const { db } = await connectToDatabase();
  const settings = await db.collection("platform_settings").find({}).toArray();
  const settingsObj = {};
  settings.forEach((s) => {
    settingsObj[s.key] = s.value;
  });
  return settingsObj;
}

export async function updatePlatformSetting(key, value, adminEmail) {
  const { db } = await connectToDatabase();
  const result = await db.collection("platform_settings").updateOne(
    { key },
    {
      $set: { value, updatedBy: adminEmail, updatedAt: new Date() },
      $setOnInsert: { key, createdAt: new Date() },
    },
    { upsert: true }
  );
  return { success: true };
}

export async function getDefaultSettings() {
  return {
    "quiz.base_attempts": 5,
    "quiz.max_bonus": 3,
    "quiz.passing_score": 70,
    "quiz.certificate_passes": 3,
    "quiz.unlock_progress": 90,
    "mentorship.auto_escalate_hours": 48,
    "security.max_login_attempts": 5,
    "notifications.email_enabled": false,
    "notifications.sms_enabled": false,
    "notifications.admin_email": "sainidaskh70@gmail.com",
    "notifications.frequency": "instant",
    "backup.auto_enabled": false,
    "backup.frequency_hours": 24,
  };
}

export async function initializeSettings() {
  const { db } = await connectToDatabase();
  const existing = await db.collection("platform_settings").countDocuments();
  if (existing === 0) {
    const defaults = await getDefaultSettings();
    const docs = Object.entries(defaults).map(([key, value]) => ({
      key,
      value,
      updatedBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await db.collection("platform_settings").insertMany(docs);
  }
}

export async function getUserRetentionData() {
  const { db } = await connectToDatabase();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalUsers, active7Days, active30Days] = await Promise.all([
    db.collection("users").countDocuments(),
    db
      .collection("users")
      .countDocuments({ lastLogin: { $gte: sevenDaysAgo } }),
    db
      .collection("users")
      .countDocuments({ lastLogin: { $gte: thirtyDaysAgo } }),
  ]);

  return {
    total: totalUsers,
    active7Days,
    active30Days,
    retention7Days:
      totalUsers > 0 ? Math.round((active7Days / totalUsers) * 100) : 0,
    retention30Days:
      totalUsers > 0 ? Math.round((active30Days / totalUsers) * 100) : 0,
  };
}

export async function getUserEngagementHeatmap() {
  const { db } = await connectToDatabase();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const users = await db
    .collection("users")
    .find({ lastLogin: { $gte: thirtyDaysAgo } })
    .toArray();

  const heatmap = Array(7)
    .fill(0)
    .map(() => Array(24).fill(0));

  users.forEach((user) => {
    if (user.lastLogin) {
      const date = new Date(user.lastLogin);
      const day = date.getDay();
      const hour = date.getHours();
      heatmap[day][hour]++;
    }
  });

  return heatmap;
}

export async function getTopLearners(limit = 10) {
  const { db } = await connectToDatabase();

  const topLearners = await db
    .collection("users")
    .aggregate([
      {
        $lookup: {
          from: "quizzes",
          localField: "_id",
          foreignField: "userId",
          as: "quizzes",
        },
      },
      {
        $addFields: {
          quizzesPassed: {
            $size: {
              $filter: {
                input: "$quizzes",
                as: "quiz",
                cond: { $gte: ["$$quiz.score", 70] },
              },
            },
          },
          totalQuizzes: { $size: "$quizzes" },
          avgScore: { $avg: "$quizzes.score" },
        },
      },
      { $sort: { quizzesPassed: -1, avgScore: -1 } },
      { $limit: limit },
      {
        $project: {
          name: 1,
          email: 1,
          quizzesPassed: 1,
          totalQuizzes: 1,
          avgScore: { $round: ["$avgScore", 0] },
          createdAt: 1,
        },
      },
    ])
    .toArray();

  return topLearners;
}

export async function getChurnRiskUsers() {
  const { db } = await connectToDatabase();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const churnRisk = await db
    .collection("users")
    .find({
      lastLogin: { $lt: thirtyDaysAgo, $gte: sixtyDaysAgo },
      createdAt: { $lt: sixtyDaysAgo },
    })
    .sort({ lastLogin: 1 })
    .limit(20)
    .toArray();

  return churnRisk.map((user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    lastLogin: user.lastLogin,
    daysSinceLogin: Math.floor(
      (new Date() - new Date(user.lastLogin)) / (1000 * 60 * 60 * 24)
    ),
  }));
}

export async function getUserGeographicDistribution() {
  const { db } = await connectToDatabase();

  const distribution = await db
    .collection("users")
    .aggregate([
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])
    .toArray();

  return distribution.map((item) => ({
    location: item._id || "Unknown",
    count: item.count,
  }));
}
export async function getQuizCompletionRates() {
  const { db } = await connectToDatabase();

  const stats = await db
    .collection("quizzes")
    .aggregate([
      {
        $group: {
          _id: "$roadmapId",
          totalAttempts: { $sum: 1 },
          completedAttempts: {
            $sum: { $cond: [{ $ne: ["$score", null] }, 1, 0] },
          },
          passedAttempts: {
            $sum: { $cond: [{ $gte: ["$score", 70] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "roadmaps",
          localField: "_id",
          foreignField: "_id",
          as: "roadmap",
        },
      },
      { $unwind: { path: "$roadmap", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          roadmapName: { $ifNull: ["$roadmap.title", "Unknown"] },
          totalAttempts: 1,
          completedAttempts: 1,
          passedAttempts: 1,
          completionRate: {
            $multiply: [
              { $divide: ["$completedAttempts", "$totalAttempts"] },
              100,
            ],
          },
          passRate: {
            $multiply: [
              { $divide: ["$passedAttempts", "$totalAttempts"] },
              100,
            ],
          },
        },
      },
      { $sort: { totalAttempts: -1 } },
    ])
    .toArray();

  return stats;
}

export async function getWeakTopicsAnalysis() {
  const { db } = await connectToDatabase();

  const weakTopics = await db
    .collection("quizzes")
    .aggregate([
      { $match: { score: { $lt: 70 } } },
      {
        $lookup: {
          from: "roadmaps",
          localField: "roadmapId",
          foreignField: "_id",
          as: "roadmap",
        },
      },
      { $unwind: { path: "$roadmap", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$roadmapId",
          roadmapName: { $first: "$roadmap.title" },
          failureCount: { $sum: 1 },
          avgScore: { $avg: "$score" },
        },
      },
      { $sort: { failureCount: -1 } },
      { $limit: 10 },
    ])
    .toArray();

  return weakTopics.map((topic) => ({
    roadmapName: topic.roadmapName || "Unknown",
    failureCount: topic.failureCount,
    avgScore: Math.round(topic.avgScore),
  }));
}

export async function getQuizTimeAnalysis() {
  const { db } = await connectToDatabase();

  const timeStats = await db
    .collection("quizzes")
    .aggregate([
      {
        $match: {
          startedAt: { $exists: true },
          completedAt: { $exists: true },
        },
      },
      {
        $addFields: {
          timeSpent: {
            $divide: [
              { $subtract: ["$completedAt", "$startedAt"] },
              1000 * 60, // Convert to minutes
            ],
          },
        },
      },
      {
        $lookup: {
          from: "roadmaps",
          localField: "roadmapId",
          foreignField: "_id",
          as: "roadmap",
        },
      },
      { $unwind: { path: "$roadmap", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$roadmapId",
          roadmapName: { $first: "$roadmap.title" },
          avgTime: { $avg: "$timeSpent" },
          minTime: { $min: "$timeSpent" },
          maxTime: { $max: "$timeSpent" },
        },
      },
      { $sort: { avgTime: -1 } },
    ])
    .toArray();

  return timeStats.map((stat) => ({
    roadmapName: stat.roadmapName || "Unknown",
    avgTime: Math.round(stat.avgTime),
    minTime: Math.round(stat.minTime),
    maxTime: Math.round(stat.maxTime),
  }));
}

export async function getAttemptDistribution() {
  const { db } = await connectToDatabase();

  const distribution = await db
    .collection("quizzes")
    .aggregate([
      {
        $group: {
          _id: { userId: "$userId", roadmapId: "$roadmapId" },
          attempts: { $sum: 1 },
          passed: {
            $max: { $cond: [{ $gte: ["$score", 70] }, 1, 0] },
          },
        },
      },
      {
        $group: {
          _id: "$attempts",
          count: { $sum: 1 },
          passedCount: { $sum: "$passed" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 10 },
    ])
    .toArray();

  return distribution.map((item) => ({
    attempt: item._id,
    totalUsers: item.count,
    passedUsers: item.passedCount,
    passRate: Math.round((item.passedCount / item.count) * 100),
  }));
}

export async function getMentorshipRequestVolume(days = 30) {
  const { db } = await connectToDatabase();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const volume = await db
    .collection("mentorship_requests")
    .aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  return volume.map((item) => ({
    date: item._id,
    count: item.count,
  }));
}

export async function getMentorshipResponseTimeStats() {
  const { db } = await connectToDatabase();

  const stats = await db
    .collection("mentorship_requests")
    .aggregate([
      {
        $match: {
          status: { $in: ["replied", "resolved"] },
          repliedAt: { $exists: true },
        },
      },
      {
        $addFields: {
          responseTime: {
            $divide: [
              { $subtract: ["$repliedAt", "$createdAt"] },
              1000 * 60 * 60, // Convert to hours
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: "$responseTime" },
          minResponseTime: { $min: "$responseTime" },
          maxResponseTime: { $max: "$responseTime" },
          totalReplied: { $sum: 1 },
        },
      },
    ])
    .toArray();

  if (stats.length === 0) {
    return {
      avgResponseTime: 0,
      minResponseTime: 0,
      maxResponseTime: 0,
      totalReplied: 0,
    };
  }

  return {
    avgResponseTime: Math.round(stats[0].avgResponseTime * 10) / 10,
    minResponseTime: Math.round(stats[0].minResponseTime * 10) / 10,
    maxResponseTime: Math.round(stats[0].maxResponseTime * 10) / 10,
    totalReplied: stats[0].totalReplied,
  };
}

export async function getMentorshipCommonTopics() {
  const { db } = await connectToDatabase();

  const topics = await db
    .collection("mentorship_requests")
    .aggregate([
      {
        $group: {
          _id: "$requestType",
          count: { $sum: 1 },
          avgResponseTime: {
            $avg: {
              $cond: [
                { $and: [{ $ne: ["$repliedAt", null] }] },
                {
                  $divide: [
                    { $subtract: ["$repliedAt", "$createdAt"] },
                    1000 * 60 * 60,
                  ],
                },
                null,
              ],
            },
          },
        },
      },
      { $sort: { count: -1 } },
    ])
    .toArray();

  return topics.map((topic) => ({
    type: topic._id || "General",
    count: topic.count,
    avgResponseTime: topic.avgResponseTime
      ? Math.round(topic.avgResponseTime * 10) / 10
      : null,
  }));
}

export async function getMentorshipResolutionRate() {
  const { db } = await connectToDatabase();

  const stats = await db
    .collection("mentorship_requests")
    .aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const total = stats.reduce((sum, item) => sum + item.count, 0);
  const resolved = stats.find((item) => item._id === "resolved")?.count || 0;
  const replied = stats.find((item) => item._id === "replied")?.count || 0;
  const pending = stats.find((item) => item._id === "pending")?.count || 0;

  return {
    total,
    resolved,
    replied,
    pending,
    resolutionRate:
      total > 0 ? Math.round(((resolved + replied) / total) * 100) : 0,
  };
}

export async function getMentorshipPeakTimes() {
  const { db } = await connectToDatabase();

  const requests = await db.collection("mentorship_requests").find().toArray();

  const hourCounts = Array(24).fill(0);
  const dayCounts = Array(7).fill(0);

  requests.forEach((req) => {
    const date = new Date(req.createdAt);
    hourCounts[date.getHours()]++;
    dayCounts[date.getDay()]++;
  });

  return {
    byHour: hourCounts.map((count, hour) => ({ hour, count })),
    byDay: dayCounts.map((count, day) => ({
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day],
      count,
    })),
  };
}
export async function createActivityLog(logData) {
  const { db } = await connectToDatabase();
  const result = await db.collection("activity_logs").insertOne({
    ...logData,
    timestamp: new Date(),
  });
  return result;
}

export async function getAllActivityLogs(filters = {}) {
  const { db } = await connectToDatabase();

  const {
    page = 1,
    limit = 50,
    action,
    resourceType,
    actor,
    startDate,
    endDate,
  } = filters;

  const query = {};

  if (action && action !== "all") query.action = action;
  if (resourceType && resourceType !== "all") query.resourceType = resourceType;
  if (actor) query.actor = { $regex: actor, $options: "i" };
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const [logs, total] = await Promise.all([
    db
      .collection("activity_logs")
      .find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    db.collection("activity_logs").countDocuments(query),
  ]);

  return {
    logs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ==========================================
// STREAK SYSTEM - USES VISITS COLLECTION
// ==========================================

export async function getStreakData(userId) {
  const { db } = await connectToDatabase();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const visits = await db
    .collection("visits")
    .find({ userId })
    .sort({ date: -1 })
    .toArray();

  if (visits.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: null,
      totalDays: 0,
    };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  let checkDate = today.getTime();

  // Calculate current streak
  for (let i = 0; i < visits.length; i++) {
    const visitDate = new Date(visits[i].date);
    visitDate.setHours(0, 0, 0, 0);
    const visitTime = visitDate.getTime();

    const diffDays = Math.floor(
      (checkDate - visitTime) / (1000 * 60 * 60 * 24)
    );

    if (i === 0) {
      if (diffDays === 0 || diffDays === 1) {
        currentStreak = 1;
        checkDate = visitTime;
      } else {
        currentStreak = 0;
        break;
      }
    } else {
      const prevVisitDate = new Date(visits[i - 1].date);
      prevVisitDate.setHours(0, 0, 0, 0);
      const prevVisitTime = prevVisitDate.getTime();

      const daysBetween = Math.floor(
        (prevVisitTime - visitTime) / (1000 * 60 * 60 * 24)
      );

      if (daysBetween === 1) {
        currentStreak++;
        checkDate = visitTime;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  tempStreak = 1;
  for (let i = 0; i < visits.length - 1; i++) {
    const currentDate = new Date(visits[i].date);
    currentDate.setHours(0, 0, 0, 0);
    const currentTime = currentDate.getTime();

    const nextDate = new Date(visits[i + 1].date);
    nextDate.setHours(0, 0, 0, 0);
    const nextTime = nextDate.getTime();

    const daysBetween = Math.floor(
      (currentTime - nextTime) / (1000 * 60 * 60 * 24)
    );

    if (daysBetween === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    currentStreak,
    longestStreak,
    lastVisit: visits[0].lastVisit,
    totalDays: visits.length,
  };
}

export async function recordDailyVisit(userId) {
  const { db } = await connectToDatabase();

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  // Check if already visited today
  const existing = await db.collection("visits").findOne({
    userId,
    date: today,
  });

  if (existing) {
    // Update last visit time
    await db
      .collection("visits")
      .updateOne({ _id: existing._id }, { $set: { lastVisit: now } });

    return {
      isFirstVisit: false,
      currentStreak: existing.currentStreak || 0,
      longestStreak: existing.longestStreak || 0,
    };
  }

  // New visit today - calculate streak
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayVisit = await db.collection("visits").findOne({
    userId,
    date: yesterday,
  });

  const currentStreak = yesterdayVisit
    ? (yesterdayVisit.currentStreak || 0) + 1
    : 1;

  // Get all visits to calculate longest streak
  const allVisits = await db
    .collection("visits")
    .find({ userId })
    .sort({ date: -1 })
    .toArray();

  let longestStreak = currentStreak;
  let tempStreak = 1;

  for (let i = 0; i < allVisits.length - 1; i++) {
    const currentDate = new Date(allVisits[i].date);
    currentDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(allVisits[i + 1].date);
    nextDate.setHours(0, 0, 0, 0);

    const diff = Math.floor(
      (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  // Insert new visit
  await db.collection("visits").insertOne({
    userId,
    date: today,
    lastVisit: now,
    currentStreak,
    longestStreak,
    createdAt: now,
  });

  return {
    isFirstVisit: true,
    currentStreak,
    longestStreak,
  };
}

export async function getTodayActivityCount(userId) {
  const { db } = await connectToDatabase();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [problemsSolved, quizzesTaken] = await Promise.all([
    db.collection("user_progress").countDocuments({
      user_id: userId,
      status: "completed",
      updated_at: { $gte: today, $lt: tomorrow },
    }),
    db.collection("quiz_results").countDocuments({
      userId: userId.toString(),
      completedAt: { $gte: today, $lt: tomorrow },
    }),
  ]);

  return {
    problemsSolved,
    quizzesTaken,
    total: problemsSolved + quizzesTaken,
  };
}

export async function checkUsernameAvailable(username) {
  const { db } = await connectToDatabase();
  const existingUser = await db.collection("users").findOne({
    username: username.toLowerCase(),
  });
  return !existingUser;
}

export async function updateUsername(userId, username) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  // Update username in users collection with timestamp
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        username: username.toLowerCase(),
      },
    }
  );

  await db.collection("user_profiles").updateOne(
    { userId: userId.toString() },
    {
      $set: {
        usernameLastChanged: new Date(),
      },
    },
    { upsert: true }
  );

  return true;
}

export async function getUserByUsername(username) {
  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne({
    username: username.toLowerCase(),
  });
  return user;
}

// ==========================================
// APPEAL SYSTEM FUNCTIONS - ADD TO lib/db.js
// ==========================================

export async function createAppeal(appealData) {
  const { db } = await connectToDatabase();

  const appeal = {
    ...appealData,
    status: "pending",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("user_appeals").insertOne(appeal);
  return { ...appeal, _id: result.insertedId };
}

export async function getAppealById(appealId) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const appeal = await db.collection("user_appeals").findOne({
    _id: new ObjectId(appealId),
  });

  if (!appeal) return null;

  // Get user details
  let user = null;
  if (appeal.userId) {
    user = await getUserById(appeal.userId);
  }

  // Get messages
  const messages = await db
    .collection("appeal_messages")
    .find({ appealId: appealId.toString() })
    .sort({ sentAt: 1 })
    .toArray();

  return {
    appeal: serializeDoc(appeal),
    user: user ? serializeDoc(user) : null,
    messages: serializeDocs(messages),
  };
}

export async function getAllAppeals(filters = {}) {
  const { db } = await connectToDatabase();

  const query = {};

  if (filters.userId) {
    query.userId = filters.userId;
  }

  if (filters.status && filters.status !== "all") {
    query.status = filters.status;
  }

  if (filters.search) {
    query.$or = [
      { userName: { $regex: filters.search, $options: "i" } },
      { userEmail: { $regex: filters.search, $options: "i" } },
    ];
  }

  const page = filters.page || 1;
  const limit = 50;
  const skip = (page - 1) * limit;

  const [appeals, total] = await Promise.all([
    db
      .collection("user_appeals")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection("user_appeals").countDocuments(query),
  ]);

  return {
    appeals: serializeDocs(appeals),
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}

export async function updateAppealStatus(appealId, status, adminResponse) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const updateData = {
    status,
    updatedAt: new Date(),
  };

  if (adminResponse) {
    updateData.adminResponse = adminResponse;
    updateData.respondedAt = new Date();
  }

  if (status === "approved") {
    updateData.approvedAt = new Date();
  } else if (status === "rejected") {
    updateData.rejectedAt = new Date();
  }

  const result = await db
    .collection("user_appeals")
    .updateOne({ _id: new ObjectId(appealId) }, { $set: updateData });

  return { success: result.modifiedCount > 0 };
}

export async function addAppealMessage(appealId, messageData) {
  const { db } = await connectToDatabase();

  const message = {
    appealId: appealId.toString(),
    ...messageData,
    createdAt: new Date(),
  };

  await db.collection("appeal_messages").insertOne(message);

  // Also push to appeal.messages array for quick access
  await db.collection("user_appeals").updateOne(
    { _id: new ObjectId(appealId) },
    {
      $push: { messages: messageData },
      $set: { updatedAt: new Date() },
    }
  );

  return { success: true };
}

export async function getAppealStats() {
  const { db } = await connectToDatabase();

  const [total, pending, inReview, approved, rejected] = await Promise.all([
    db.collection("user_appeals").countDocuments(),
    db.collection("user_appeals").countDocuments({ status: "pending" }),
    db.collection("user_appeals").countDocuments({ status: "in_review" }),
    db.collection("user_appeals").countDocuments({ status: "approved" }),
    db.collection("user_appeals").countDocuments({ status: "rejected" }),
  ]);

  return {
    total,
    pending,
    inReview,
    approved,
    rejected,
  };
}

// ==========================================
// DELETED USERS AUDIT LOG
// ==========================================

export async function moveUserToDeletedLog(userId, reason, deletedBy) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");

  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new Error("User not found");
  }

  await db.collection("deleted_users").insertOne({
    originalId: user._id.toString(),
    name: user.name,
    email: user.email,
    username: user.username || null,
    createdAt: user.created_at,
    deletedAt: new Date(),
    deletedBy,
    deleteReason: reason,
    metadata: {
      isBlocked: user.isBlocked || false,
      blockReason: user.blockReason || null,
    },
  });

  return { success: true };
}

export async function getDeletedUsers(filters = {}) {
  const { db } = await connectToDatabase();

  const query = {};

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
    ];
  }

  const page = filters.page || 1;
  const limit = 50;
  const skip = (page - 1) * limit;

  const [deletedUsers, total] = await Promise.all([
    db
      .collection("deleted_users")
      .find(query)
      .sort({ deletedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection("deleted_users").countDocuments(query),
  ]);

  return {
    users: serializeDocs(deletedUsers),
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}

export async function getLatestAppealReply(userId) {
  const { db } = await connectToDatabase();

  const appeal = await db.collection("user_appeals").findOne(
    {
      userId: userId.toString(),
      status: "approved",
    },
    {
      sort: { updatedAt: -1 },
      limit: 1,
    }
  );

  if (!appeal || !appeal.messages || appeal.messages.length === 0) {
    return null;
  }
  const adminMessages = appeal.messages.filter(
    (msg) => msg.senderType === "admin"
  );
  const lastAdminMessage = adminMessages[adminMessages.length - 1];

  return lastAdminMessage || null;
}
