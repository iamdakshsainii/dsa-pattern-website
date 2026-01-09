import { getPattern, getQuestionsByPattern } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import PatternDetailPage from "@/components/pattern-detail-page"

export default async function PatternPage({ params }) {
  const { slug: patternSlug } = await params
  const slug = patternSlug

  const currentUser = await getCurrentUser()

  const [pattern, questions, userProgressData] = await Promise.all([
    getPattern(slug),
    getQuestionsByPattern(slug),
    currentUser ? getUserProgressForPattern(currentUser.id, slug) : null
  ])

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

async function getUserProgressForPattern(userId, patternSlug) {
  const client = await clientPromise
  const db = client.db("dsa_patterns")
  const progressCollection = db.collection("user_progress")

  const allProgress = await progressCollection
    .find({ user_id: userId })
    .toArray()

  const completed = allProgress
    .filter(p => p.status === "completed")
    .map(p => p.question_id)

  const bookmarks = await db.collection("bookmarks")
    .find({ user_id: userId })
    .toArray()

  const inProgress = allProgress
    .filter(p => p.status === "in_progress")
    .map(p => p.question_id)

  return {
    completed,
    bookmarks: bookmarks.map(b => b.question_id),
    inProgress
  }
}
