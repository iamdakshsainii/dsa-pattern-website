import Link from "next/link"
import { getPatterns } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Clock, Database } from "lucide-react"

export default async function PatternsPage() {
  const patterns = await getPatterns()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container flex h-16 items-center gap-4 px-4 max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">DSA Patterns</h1>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {patterns.length} Patterns Available
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Master the Fundamentals
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn these essential patterns to solve any coding problem with confidence
          </p>
        </div>

        {/* Patterns Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {patterns.map((pattern) => (
            <Link key={pattern._id.toString()} href={`/patterns/${pattern.slug}`}>
              <Card className="group p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full bg-card/50 backdrop-blur border-muted hover:border-primary/50">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {pattern.name}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="shrink-0 ml-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    {pattern.questionCount || 0}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[3.5rem]">
                  {pattern.description}
                </p>

                {/* Complexity */}
                {pattern.complexity && (
                  <div className="mt-auto pt-4 border-t border-muted space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Time:</span>
                      <code className="px-2 py-0.5 rounded bg-muted text-foreground font-mono">
                        {pattern.complexity.time}
                      </code>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Database className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Space:</span>
                      <code className="px-2 py-0.5 rounded bg-muted text-foreground font-mono">
                        {pattern.complexity.space}
                      </code>
                    </div>
                  </div>
                )}

                {/* Hover Arrow */}
                <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View Problems
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State (if needed) */}
        {patterns.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No patterns yet</h3>
            <p className="text-muted-foreground">Check back soon for new patterns!</p>
          </div>
        )}
      </main>
    </div>
  )
}
