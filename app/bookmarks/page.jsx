import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import BookmarksClient from "@/components/bookmarks-client"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export default async function BookmarksPage() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token")

  if (!authToken) {
    redirect("/auth/login")
  }

  let userId
  try {
    const payload = verifyToken(authToken.value)
    if (!payload) {
      redirect("/auth/login")
    }
    userId = payload.id
  } catch (error) {
    console.error("Auth token parse error:", error)
    redirect("/auth/login")
  }

  //Fetch bookmarks with proper error handling
  let questions = []
  let userProgress = {
    completed: [],
    inProgress: [],
    bookmarks: []
  }

  try {
    const client = await clientPromise
    const db = client.db("dsa_patterns")
    const progressCollection = db.collection("progress")
    const questionsCollection = db.collection("questions")

    // Get all bookmarked items
    const bookmarks = await progressCollection
      .find({ userId: userId, bookmarked: true })
      .toArray()

    const bookmarkIds = bookmarks.map(b => b.questionId || b.problemId)

    // Get all progress for completed/in-progress status
    const allProgress = await progressCollection
      .find({ userId: userId })
      .toArray()

    const completed = allProgress
      .filter(p => p.completed)
      .map(p => p.questionId || p.problemId)

    const inProgress = allProgress
      .filter(p => !p.completed && p.attempts > 0)
      .map(p => p.questionId || p.problemId)

    // Fetch full question details
    if (bookmarkIds.length > 0) {
      const objectIds = bookmarkIds
        .filter(id => ObjectId.isValid(id))
        .map(id => new ObjectId(id))

      if (objectIds.length > 0) {
        const foundQuestions = await questionsCollection
          .find({ _id: { $in: objectIds } })
          .toArray()

        // Serialize questions
        questions = foundQuestions.map(q => ({
          ...q,
          _id: q._id.toString(),
          pattern: q.pattern_id || q.pattern,
          pattern_id: q.pattern_id
        }))
      }
    }

    userProgress = {
      completed,
      inProgress,
      bookmarks: bookmarkIds
    }

  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    // Continue with empty data instead of crashing
  }

  return (
    <BookmarksClient
      questions={questions}
      userProgress={userProgress}
      userId={userId}
    />
  )
}
