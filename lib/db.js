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

export async function getQuestionsByPattern(patternId) {
  const { db } = await connectToDatabase()
  const questions = await db.collection("questions").find({ pattern_id: patternId }).sort({ order: 1 }).toArray()
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
  const { ObjectId } = await import("mongodb")
  const result = await db
    .collection("user_progress")
    .updateOne(
      { user_id: userId, question_id: questionId },
      { $set: { ...data, updated_at: new Date() } },
      { upsert: true },
    )
  return result
}

export async function getUserBookmarks(userId) {
  const { db } = await connectToDatabase()
  const bookmarks = await db.collection("bookmarks").find({ user_id: userId }).toArray()
  return serializeDocs(bookmarks)
}

export async function toggleBookmark(userId, questionId) {
  const { db } = await connectToDatabase()
  const existing = await db.collection("bookmarks").findOne({ user_id: userId, question_id: questionId })

  if (existing) {
    await db.collection("bookmarks").deleteOne({ user_id: userId, question_id: questionId })
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

export async function getUserNotes(userId, questionId) {
  const { db } = await connectToDatabase()
  const note = await db.collection("notes").findOne({ user_id: userId, question_id: questionId })
  return serializeDoc(note)
}

export async function saveUserNote(userId, questionId, content) {
  const { db } = await connectToDatabase()
  const result = await db
    .collection("notes")
    .updateOne(
      { user_id: userId, question_id: questionId },
      { $set: { content, updated_at: new Date() } },
      { upsert: true },
    )
  return result
}

export async function getAllSheets() {
  const { db } = await connectToDatabase()
  const sheets = await db.collection("sheets").find({}).sort({ order: 1 }).toArray()
  return serializeDocs(sheets)
}
