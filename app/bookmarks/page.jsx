import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import BookmarksClient from "@/components/bookmarks-client"
import clientPromise from "@/lib/mongodb"

export default async function BookmarksPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  let questions = []
  let userProgress = {
    completed: [],
    inProgress: [],
    bookmarks: []
  }

  try {
    const client = await clientPromise
    const db = client.db("dsa_patterns")

    // Get bookmarks from NEW bookmarks collection
    const bookmarks = await db
      .collection("bookmarks")
      .find({ user_id: user.id })
      .toArray()

    const bookmarkIds = bookmarks.map(b => b.question_id)

    // Get user progress
    const allProgress = await db
      .collection("user_progress")
      .find({ user_id: user.id })
      .toArray()

    const completed = allProgress
      .filter(p => p.status === "completed")
      .map(p => p.question_id)

    const inProgress = allProgress
      .filter(p => p.status === "in_progress")
      .map(p => p.question_id)

    // Fetch question details
    if (bookmarkIds.length > 0) {
      const { ObjectId } = await import("mongodb")

      const objectIds = bookmarkIds
        .filter(id => ObjectId.isValid(id))
        .map(id => new ObjectId(id))

      if (objectIds.length > 0) {
        const foundQuestions = await db
          .collection("questions")
          .find({ _id: { $in: objectIds } })
          .toArray()

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
  }

  return (
    <BookmarksClient
      questions={questions}
      userProgress={userProgress}
      userId={user.id}
    />
  )
}
