import { getPattern, getQuestionsByPattern, getSolution } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Lightbulb, AlertCircle } from "lucide-react"
import QuestionList from "@/components/question-list"
import BackNavigation from "@/components/back-navigation"

export default async function PatternDetailPage({ params }) {
  const { slug } = await params
  const pattern = await getPattern(slug)

  // ✅ FIX: Use slug instead of pattern._id
  const questions = await getQuestionsByPattern(slug)

  // ✅ Fetch solutions for all questions (from JSON files)
  const solutions = {}
  await Promise.all(
    questions.map(async (question) => {
      const solution = await getSolution(question._id)
      if (solution) {
        solutions[question._id] = solution
      }
    })
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4 px-4">
          <BackNavigation label="Patterns" href="/patterns" />
          <h1 className="text-2xl font-bold">{pattern.name}</h1>
        </div>
      </div>

      <main className="container px-4 py-8 space-y-8">
        {/* Pattern Explanation */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            When to Use This Pattern
          </h2>
          <p className="text-muted-foreground mb-4">{pattern.description}</p>

          {pattern.whenToUse && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Pattern Triggers:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {pattern.whenToUse.map((trigger, i) => (
                  <li key={i}>{trigger}</li>
                ))}
              </ul>
            </div>
          )}

          {pattern.commonMistakes && (
            <div className="mt-6 space-y-2">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Common Mistakes to Avoid:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {pattern.commonMistakes.map((mistake, i) => (
                  <li key={i}>{mistake}</li>
                ))}
              </ul>
            </div>
          )}

          {pattern.complexity && (
            <div className="mt-6 flex gap-8 text-sm">
              <div>
                <span className="font-medium">Time: </span>
                <Badge variant="outline">{pattern.complexity.time}</Badge>
              </div>
              <div>
                <span className="font-medium">Space: </span>
                <Badge variant="outline">{pattern.complexity.space}</Badge>
              </div>
            </div>
          )}
        </Card>

        {/* Questions */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Problems ({questions.length})</h2>
          <QuestionList
            questions={questions}
            patternSlug={slug}
            solutions={solutions}
          />
        </div>
      </main>
    </div>
  )
}
