// Replace: app/patterns/[slug]/page.jsx
// ⚡ SPEED OPTIMIZATION: Parallel queries instead of sequential

import { getPattern, getQuestionsByPattern } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import PatternDetailPage from "@/components/pattern-detail-page"

export default async function PatternPage({ params }) {
  const { slug: patternSlug } = await params
  const slug = patternSlug

  // ⚡ OPTIMIZATION 1: Fetch user first (needed for progress query)
  const currentUser = await getCurrentUser()

  // ⚡ OPTIMIZATION 2: Parallel fetch - Run ALL queries at once
  const [pattern, questions, userProgressData] = await Promise.all([
    getPattern(slug),
    getQuestionsByPattern(slug), // Already includes companies/tags from JSON
    currentUser ? getUserProgressForPattern(currentUser.id, slug) : null
  ])

  // ⚡ OPTIMIZATION 3: Questions already have all data - no need for getSolution()
  // Build solutions object from questions (they already have the data)
  const solutions = {}
  questions.forEach(question => {
    solutions[question._id] = {
      questionId: question._id,
      questionSlug: question.questionSlug || question.slug,
      title: question.title,
      difficulty: question.difficulty,
      tags: question.tags || [],
      companies: question.companies || [],
      pattern: slug
    }
  })

  // Build userProgress
  let userProgress = null
  if (currentUser && userProgressData) {
    const patternQuestionIds = questions.map(q => q._id)

    userProgress = {
      completed: userProgressData.completed.filter(id => patternQuestionIds.includes(id)),
      bookmarks: userProgressData.bookmarks,
      inProgress: userProgressData.inProgress.filter(id => patternQuestionIds.includes(id))
    }
  }

  return (
    <PatternDetailPage
      pattern={pattern}
      questions={questions}
      solutions={solutions}
      userProgress={userProgress}
      currentUser={currentUser}
      patternSlug={slug}
    />
  )
}

// ⚡ HELPER: Optimized progress fetch
async function getUserProgressForPattern(userId, patternSlug) {
  const client = await clientPromise
  const db = client.db("dsa_patterns")
  const progressCollection = db.collection("progress")

  const allProgress = await progressCollection
    .find({ userId: userId })
    .toArray()

  const completed = allProgress
    .filter(p => p.completed)
    .map(p => p.questionId || p.problemId)

  const bookmarks = allProgress
    .filter(p => p.bookmarked)
    .map(p => p.questionId || p.problemId)

  const inProgress = allProgress
    .filter(p => !p.completed && p.attempts > 0)
    .map(p => p.questionId || p.problemId)

  return {
    completed,
    bookmarks,
    inProgress
  }
}
