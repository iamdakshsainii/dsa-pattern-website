import { getQuestion, getSolution, getPattern } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import QuestionDetailClient from "@/components/question-detail-client"

export default async function QuestionDetailPage({ params }) {
  const { slug, id } = await params

  const [pattern, question, solution, currentUser] = await Promise.all([
    getPattern(slug),
    getQuestion(id),
    getSolution(id), 
    getCurrentUser()
  ])

  return (
    <QuestionDetailClient
      pattern={pattern}
      question={question}
      solution={solution}
      currentUser={currentUser}
      patternSlug={slug}
    />
  )
}
