import { getPattern, getQuestionsByPattern, getSolution, getUserProgress } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
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
    userProgress = await getUserProgress(currentUser.userId)
  }

  return (
    <PatternDetailPage
      pattern={pattern}
      questions={questions}
      solutions={solutions}
      userProgress={userProgress}
      currentUser={currentUser}
    />
  )
}
