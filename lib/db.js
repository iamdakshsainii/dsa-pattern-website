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
// JSON READING HELPERS
// ============================================

async function readJSON(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Error reading JSON from ${filePath}:`, error.message)
    return null
  }
}

function extractTitleFromFilename(filename) {
  return filename
    .replace('.json', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
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

/**
 * Get questions for a pattern by reading JSON files
 * Returns array of question objects with difficulty, companies, tags from JSON
 */
export async function getQuestionsByPattern(patternSlug) {
  try {
    const solutionsDir = path.join(process.cwd(), 'solutions', patternSlug)

    // Check if directory exists
    try {
      await fs.access(solutionsDir)
    } catch {
      console.log(`Solutions directory not found: ${solutionsDir}`)
      return []
    }

    const files = await fs.readdir(solutionsDir)
    const jsonFiles = files.filter(f => f.endsWith('.json'))

    const questions = await Promise.all(
      jsonFiles.map(async (file, index) => {
        const filePath = path.join(solutionsDir, file)
        const solution = await readJSON(filePath)

        if (!solution) return null

        // Extract ALL data from solution JSON
        return {
          _id: solution.questionId || `${patternSlug}-${index}`,
          title: solution.title || extractTitleFromFilename(file),
          difficulty: solution.difficulty || 'Medium',
          slug: file.replace('.json', ''),
          pattern: patternSlug,
          order: index + 1,
          tags: solution.tags || [],
          companies: solution.companies || [],
          // Keep solution reference for later use
          questionSlug: solution.questionSlug || file.replace('.json', '')
        }
      })
    )

    // Filter nulls and ensure unique questions
    const validQuestions = questions.filter(q => q !== null)

    // Remove duplicates based on questionId
    const uniqueQuestions = []
    const seenIds = new Set()

    for (const q of validQuestions) {
      if (!seenIds.has(q._id)) {
        seenIds.add(q._id)
        uniqueQuestions.push(q)
      }
    }

    return uniqueQuestions
  } catch (error) {
    console.error(`Error getting questions for pattern ${patternSlug}:`, error)
    return []
  }
}

export async function getQuestion(id) {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")
  const question = await db.collection("questions").findOne({ _id: new ObjectId(id) })
  return serializeDoc(question)
}

/**
 * Get solution by reading JSON file
 * Now includes difficulty and title from JSON
 */
export async function getSolution(questionId) {
  try {
    // Try to find the JSON file across all patterns
    const solutionsBaseDir = path.join(process.cwd(), 'solutions')
    const patterns = await fs.readdir(solutionsBaseDir)

    for (const pattern of patterns) {
      const patternPath = path.join(solutionsBaseDir, pattern)
      const stat = await fs.stat(patternPath)

      if (!stat.isDirectory()) continue

      const files = await fs.readdir(patternPath)

      for (const file of files) {
        if (!file.endsWith('.json')) continue

        const filePath = path.join(patternPath, file)
        const solution = await readJSON(filePath)

        if (solution && solution.questionId === questionId) {
          // Return solution with difficulty and title
          return {
            ...solution,
            pattern: pattern,
            difficulty: solution.difficulty || 'Medium',
            title: solution.title || extractTitleFromFilename(file)
          }
        }
      }
    }

    console.log(`Solution not found for questionId: ${questionId}`)
    return null
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
  const bookmarks = await db.collection("bookmarks")
    .find({ user_id: userId })
    .toArray()

  if (bookmarks.length === 0) {
    return {
      questions: [],
      userProgress: { completed: [], inProgress: [], bookmarks: [] }
    }
  }

  // Get question details from JSON files
  const questions = []

  for (const bookmark of bookmarks) {
    const solution = await getSolution(bookmark.question_id)
    if (solution) {
      questions.push({
        _id: bookmark.question_id,
        title: solution.title,
        difficulty: solution.difficulty,
        pattern: solution.pattern,
        slug: solution.questionSlug,
        tags: solution.tags || [],
        companies: solution.companies || []
      })
    }
  }

  const userProgress = await getUserProgress(userId)

  return {
    questions,
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

  const notes = await db.collection("notes")
    .find({
      user_id: userId,
      content: { $ne: "" }
    })
    .sort({ updated_at: -1 })
    .toArray()

  // Enrich notes with question details from JSON
  const enrichedNotes = await Promise.all(
    notes.map(async (note) => {
      const solution = await getSolution(note.question_id)

      return {
        ...serializeDoc(note),
        questionTitle: solution?.title || "Unknown Question",
        questionSlug: solution?.questionSlug || "",
        patternName: solution?.pattern || "Unknown Pattern",
        patternSlug: solution?.pattern || "",
        difficulty: solution?.difficulty || "Medium"
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

  // Count total questions from JSON files
  let totalQuestions = 0
  const solutionsDir = path.join(process.cwd(), 'solutions')
  const patterns = await fs.readdir(solutionsDir)

  for (const pattern of patterns) {
    const patternPath = path.join(solutionsDir, pattern)
    const stat = await fs.stat(patternPath)
    if (stat.isDirectory()) {
      const files = await fs.readdir(patternPath)
      totalQuestions += files.filter(f => f.endsWith('.json')).length
    }
  }

  const completed = allProgress.filter(p => p.status === "completed")
  const inProgress = allProgress.filter(p => p.status === "in_progress")

  const patternsData = await db.collection("patterns").find({}).toArray()
  const patternStats = {}

  for (const pattern of patternsData) {
    const patternQuestions = await getQuestionsByPattern(pattern.slug)
    const completedInPattern = completed.filter(p =>
      patternQuestions.some(q => q._id === p.question_id)
    ).length

    patternStats[pattern.name] = {
      total: patternQuestions.length,
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
  const recentProgress = await db.collection("user_progress")
    .find({ user_id: userId, status: "completed" })
    .sort({ updated_at: -1 })
    .limit(limit)
    .toArray()

  const activities = await Promise.all(
    recentProgress.map(async (progress) => {
      const solution = await getSolution(progress.question_id)

      return {
        questionId: progress.question_id,
        questionTitle: solution?.title || 'Unknown',
        questionDifficulty: solution?.difficulty || 'Medium',
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
      const patternQuestions = await getQuestionsByPattern(pattern.slug)

      const completedInPattern = userProgress.filter(p =>
        patternQuestions.some(q => q._id === p.question_id) && p.status === "completed"
      ).length

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
