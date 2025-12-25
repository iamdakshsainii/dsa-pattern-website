import Link from "next/link"
import { getPatterns } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

export default async function PatternsPage() {
  const patterns = await getPatterns()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">DSA Patterns</h1>
        </div>
      </header>

      <main className="container px-4 py-8">
        <p className="text-muted-foreground mb-8">
          Master these {patterns.length} fundamental patterns to solve any coding problem
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patterns.map((pattern) => (
            <Link key={pattern._id.toString()} href={`/patterns/${pattern.slug}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{pattern.name}</h3>
                  <Badge variant="secondary">{pattern.questionCount || 0} problems</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{pattern.description}</p>
                {pattern.complexity && (
                  <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                    <div>Time: {pattern.complexity.time}</div>
                    <div>Space: {pattern.complexity.space}</div>
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
