import { getPattern, getQuestionsByPattern, getSolution } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import PatternDetailPage from "@/components/pattern-detail-page"

export default async function PatternPage({ params }) {
  const { slug } = await params
  const pattern = await getPattern(slug)

  // Fetch questions using slug
  const questions = await getQuestionsByPattern(slug)

  // Fetch solutions for all questions
  const solutions = {}
  await Promise.all(
    questions.map(async (question) => {
      const solution = await getSolution(question._id)
      if (solution) {
        solutions[question._id] = solution
      }
    })
  )

  // Get current user and their progress
  const currentUser = await getCurrentUser()
  let userProgress = null

  if (currentUser) {
    // Fetch progress from MongoDB directly
    const client = await clientPromise
    const db = client.db("dsa_patterns")
    const progressCollection = db.collection("progress")

    const allProgress = await progressCollection
      .find({ userId: currentUser.id })
      .toArray()

    // Get question IDs for THIS pattern only
    const patternQuestionIds = questions.map(q => q._id)

    // Filter progress to only include questions in this pattern
    const completed = allProgress
      .filter(p => p.completed && patternQuestionIds.includes(p.questionId || p.problemId))
      .map(p => p.questionId || p.problemId)

    const bookmarks = allProgress
      .filter(p => p.bookmarked)
      .map(p => p.questionId || p.problemId)

    userProgress = {
      completed,
      bookmarks,
      inProgress: allProgress
        .filter(p => !p.completed && p.attempts > 0 && patternQuestionIds.includes(p.questionId || p.problemId))
        .map(p => p.questionId || p.problemId)
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
