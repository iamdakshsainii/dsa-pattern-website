import clientPromise from "./mongodb"
import { promises as fs } from 'fs'
import path from 'path'

let cachedDb = null

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb
  }
  const client = await clientPromise
  const db = client.db("dsa_patterns")
  cachedDb = { db, client }
  return cachedDb
}

function serializeDoc(doc) {
  if (!doc) return null
  return {
    ...doc,
    _id: doc._id.toString(),
    pattern_id: doc.pattern_id?.toString ? doc.pattern_id.toString() : doc.pattern_id,
  }
}

function serializeDocs(docs) {
  return docs.map(serializeDoc)
}

// ============================================
// PATTERN & QUESTION FUNCTIONS
// ============================================

export async function getPatterns() {
  const { db } = await connectToDatabase()
  const patterns = await db.collection("patterns").find({}).sort({ order: 1 }).toArray()
  return serializeDocs(patterns)
}

export async function getPattern(slug) {
  const { db } = await connectToDatabase()
  const pattern = await db.collection("patterns").findOne({ slug })
  return serializeDoc(pattern)
}

export async function getPatternBySlug(slug) {
  return await getPattern(slug)
}

export async function getQuestionsByPattern(patternSlug) {
  const { db } = await connectToDatabase()
  const questions = await db.collection("questions")
    .find({ pattern_id: patternSlug })
    .sort({ order: 1 })
    .toArray()
  return serializeDocs(questions)
}

export async function getQuestion(id) {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")
  const question = await db.collection("questions").findOne({ _id: new ObjectId(id) })
  return serializeDoc(question)
}

export async function getSolution(questionId) {
  try {
    const question = await getQuestion(questionId)
    if (!question) {
      return null
    }
    const pattern = await getPattern(question.pattern_id)
    if (!pattern) {
      console.log(`Pattern not found for question: ${question.title}`)
      return null
    }
    const solutionPath = path.join(
      process.cwd(),
      'solutions',
      pattern.slug,
      `${question.slug}.json`
    )
    try {
      const fileContents = await fs.readFile(solutionPath, 'utf8')
      const solution = JSON.parse(fileContents)
      return solution
    } catch (fileError) {
      console.log(`Solution file not found: ${solutionPath}`)
      return null
    }
  } catch (error) {
    console.error('Error getting solution:', error)
    return null
  }
}

// ============================================
// USER & AUTH FUNCTIONS
// ============================================

export async function getUser(email) {
  const { db } = await connectToDatabase()
  const user = await db.collection("users").findOne({ email })
  return serializeDoc(user)
}

export async function createUser(userData) {
  const { db } = await connectToDatabase()
  const result = await db.collection("users").insertOne({
    ...userData,
    created_at: new Date(),
  })
  return result
}

// ============================================
// PROGRESS FUNCTIONS
// ============================================

export async function getUserProgress(userId) {
  const { db } = await connectToDatabase()
  const allProgress = await db.collection("user_progress").find({ user_id: userId }).toArray()
  const bookmarks = await db.collection("bookmarks").find({ user_id: userId }).toArray()
  const completed = allProgress.filter((p) => p.status === "completed").map((p) => p.question_id)
  const inProgress = allProgress.filter((p) => p.status === "in_progress").map((p) => p.question_id)
  return {
    completed,
    inProgress,
    bookmarks: bookmarks.map((b) => b.question_id),
  }
}

export async function getAllUserProgress(userId) {
  const { db } = await connectToDatabase()
  const progress = await db.collection("user_progress").find({ user_id: userId }).toArray()
  return serializeDocs(progress)
}

export async function updateUserProgress(userId, questionId, data) {
  const { db } = await connectToDatabase()
  const result = await db
    .collection("user_progress")
    .updateOne(
      { user_id: userId, question_id: questionId },
      { $set: { ...data, updated_at: new Date() } },
      { upsert: true },
    )
  return result
}

// ============================================
// BOOKMARK FUNCTIONS
// ============================================

export async function getUserBookmarks(userId) {
  const { db } = await connectToDatabase()
  const bookmarks = await db.collection("bookmarks").find({ user_id: userId }).toArray()
  return serializeDocs(bookmarks)
}

export async function toggleBookmark(userId, questionId) {
  const { db } = await connectToDatabase()
  const existing = await db.collection("bookmarks").findOne({
    user_id: userId,
    question_id: questionId
  })
  if (existing) {
    await db.collection("bookmarks").deleteOne({
      user_id: userId,
      question_id: questionId
    })
    return { bookmarked: false }
  } else {
    await db.collection("bookmarks").insertOne({
      user_id: userId,
      question_id: questionId,
      created_at: new Date(),
    })
    return { bookmarked: true }
  }
}

export async function getBookmarkedQuestions(userId) {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")
  const bookmarks = await db.collection("bookmarks")
    .find({ user_id: userId })
    .toArray()
  if (bookmarks.length === 0) {
    return {
      questions: [],
      userProgress: { completed: [], inProgress: [], bookmarks: [] }
    }
  }
  const questionIds = bookmarks.map(b => new ObjectId(b.question_id))
  const questions = await db.collection("questions")
    .find({ _id: { $in: questionIds } })
    .toArray()
  const userProgress = await getUserProgress(userId)
  return {
    questions: serializeDocs(questions),
    userProgress
  }
}

// ============================================
// NOTES FUNCTIONS
// ============================================

export async function getUserNotes(userId, questionId) {
  const { db } = await connectToDatabase()
  const note = await db.collection("notes").findOne({
    user_id: userId,
    question_id: questionId
  })
  return serializeDoc(note)
}

export async function saveUserNote(userId, questionId, content) {
  const { db } = await connectToDatabase()
  const result = await db
    .collection("notes")
    .updateOne(
      { user_id: userId, question_id: questionId },
      {
        $set: {
          content,
          updated_at: new Date()
        },
        $setOnInsert: {
          user_id: userId,
          question_id: questionId,
          created_at: new Date()
        }
      },
      { upsert: true },
    )
  return result
}

export async function getAllUserNotes(userId) {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")

  // Get all notes for user that have content
  const notes = await db.collection("notes")
    .find({
      user_id: userId,
      content: { $ne: "" }
    })
    .sort({ updated_at: -1 })
    .toArray()

  // Enrich notes with question details
  const enrichedNotes = await Promise.all(
    notes.map(async (note) => {
      const question = await db.collection("questions")
        .findOne({ _id: new ObjectId(note.question_id) })

      const pattern = question
        ? await db.collection("patterns").findOne({ slug: question.pattern_id })
        : null

      return {
        ...serializeDoc(note),
        questionTitle: question?.title || "Unknown Question",
        questionSlug: question?.slug || "",
        patternName: pattern?.name || "Unknown Pattern",
        patternSlug: pattern?.slug || "",
        difficulty: question?.difficulty || "medium"
      }
    })
  )

  return enrichedNotes
}

// ============================================
// SHEETS FUNCTIONS
// ============================================

export async function getAllSheets() {
  const { db } = await connectToDatabase()
  const sheets = await db.collection("sheets").find({}).sort({ order: 1 }).toArray()
  return serializeDocs(sheets)
}

export async function getSheetBySlug(slug) {
  const { db } = await connectToDatabase()
  const sheet = await db.collection("sheets").findOne({ slug })
  return serializeDoc(sheet)
}

export async function getQuestionsForSheet(sheetName) {
  const { db } = await connectToDatabase()
  const questions = await db.collection("questions")
    .find({ sheet: sheetName })
    .sort({ order: 1 })
    .toArray()
  return serializeDocs(questions)
}

// ============================================
// STATS & ANALYTICS FUNCTIONS
// ============================================

export async function getUserStats(userId) {
  const { db } = await connectToDatabase()
  const allProgress = await db.collection("user_progress")
    .find({ user_id: userId })
    .toArray()
  const totalQuestions = await db.collection("questions").countDocuments()
  const completed = allProgress.filter(p => p.status === "completed")
  const inProgress = allProgress.filter(p => p.status === "in_progress")
  const patterns = await db.collection("patterns").find({}).toArray()
  const patternStats = {}
  for (const pattern of patterns) {
    const patternQuestions = await db.collection("questions")
      .countDocuments({ pattern_id: pattern.slug })
    const completedInPattern = completed.filter(p => {
      const question = allProgress.find(q => q.question_id === p.question_id)
      return question?.pattern_id === pattern.slug
    }).length
    patternStats[pattern.name] = {
      total: patternQuestions,
      completed: completedInPattern
    }
  }
  return {
    totalQuestions,
    completedCount: completed.length,
    inProgressCount: inProgress.length,
    completionRate: totalQuestions > 0 ? (completed.length / totalQuestions) * 100 : 0,
    patternStats
  }
}

export async function getRecentActivity(userId, limit = 10) {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")
  const recentProgress = await db.collection("user_progress")
    .find({ user_id: userId, status: "completed" })
    .sort({ updated_at: -1 })
    .limit(limit)
    .toArray()
  const activities = await Promise.all(
    recentProgress.map(async (progress) => {
      const question = await db.collection("questions")
        .findOne({ _id: new ObjectId(progress.question_id) })
      return {
        questionId: progress.question_id,
        questionTitle: question?.title || 'Unknown',
        questionDifficulty: question?.difficulty || 'medium',
        solvedAt: progress.updated_at,
        status: progress.status
      }
    })
  )
  return serializeDocs(activities)
}

export async function getDailyStreak(userId) {
  const { db } = await connectToDatabase()
  const completedQuestions = await db.collection("user_progress")
    .find({ user_id: userId, status: "completed" })
    .sort({ updated_at: -1 })
    .toArray()
  if (completedQuestions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null
    }
  }
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dateMap = new Map()
  completedQuestions.forEach(q => {
    const date = new Date(q.updated_at)
    date.setHours(0, 0, 0, 0)
    const dateKey = date.getTime()
    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, true)
    }
  })
  const sortedDates = Array.from(dateMap.keys()).sort((a, b) => b - a)
  let checkDate = today.getTime()
  for (const dateKey of sortedDates) {
    const daysDiff = Math.floor((checkDate - dateKey) / (1000 * 60 * 60 * 24))
    if (daysDiff <= 1) {
      currentStreak++
      checkDate = dateKey
    } else {
      break
    }
  }
  let prevDate = null
  for (const dateKey of sortedDates) {
    if (prevDate === null) {
      tempStreak = 1
    } else {
      const daysDiff = Math.floor((prevDate - dateKey) / (1000 * 60 * 60 * 24))
      if (daysDiff === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
    prevDate = dateKey
  }
  longestStreak = Math.max(longestStreak, tempStreak)
  return {
    currentStreak,
    longestStreak,
    lastActiveDate: completedQuestions[0].updated_at
  }
}

export async function getPatternBreakdown(userId) {
  const { db } = await connectToDatabase()
  const patterns = await db.collection("patterns").find({}).sort({ order: 1 }).toArray()
  const userProgress = await db.collection("user_progress")
    .find({ user_id: userId })
    .toArray()
  const breakdown = await Promise.all(
    patterns.map(async (pattern) => {
      const patternQuestions = await db.collection("questions")
        .find({ pattern_id: pattern.slug })
        .toArray()
      const completedInPattern = userProgress.filter(p => {
        const question = patternQuestions.find(q => q._id.toString() === p.question_id)
        return question && p.status === "completed"
      }).length
      return {
        patternName: pattern.name,
        patternSlug: pattern.slug,
        total: patternQuestions.length,
        completed: completedInPattern,
        percentage: patternQuestions.length > 0
          ? Math.round((completedInPattern / patternQuestions.length) * 100)
          : 0
      }
    })
  )
  return breakdown
}

export async function getActivityHeatmap(userId) {
  const { db } = await connectToDatabase()
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  const activities = await db.collection("user_progress")
    .find({
      user_id: userId,
      status: "completed",
      updated_at: { $gte: ninetyDaysAgo }
    })
    .toArray()
  const heatmapData = {}
  activities.forEach(activity => {
    const date = new Date(activity.updated_at)
    const dateKey = date.toISOString().split('T')[0]
    if (!heatmapData[dateKey]) {
      heatmapData[dateKey] = 0
    }
    heatmapData[dateKey]++
  })
  return heatmapData
}
