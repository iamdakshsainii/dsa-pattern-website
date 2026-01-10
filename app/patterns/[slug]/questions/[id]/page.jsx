import { getPattern, getQuestionWithFullData } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { notFound } from "next/navigation"
import QuestionDetailClient from "@/components/question-detail-client"

export default async function QuestionDetailPage({ params }) {
  const { slug: patternSlug, id: questionSlug } = await params

  const [pattern, question, currentUser] = await Promise.all([
    getPattern(patternSlug),
    getQuestionWithFullData(questionSlug, patternSlug),
    getCurrentUser().catch(() => null)
  ])

  if (!question) {
    notFound()
  }

  return (
    <QuestionDetailClient
      pattern={pattern}
      question={question}
      currentUser={currentUser}
      patternSlug={patternSlug}
    />
  )
}
