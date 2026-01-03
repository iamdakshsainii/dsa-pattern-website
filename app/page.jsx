export const dynamic = 'force-dynamic'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Code2,
  Target,
  Brain,
  Trophy,
  ArrowRight,
  Sparkles,
  Terminal,
  GitBranch,
  Youtube,
  Heart,
  Coffee,
  Clock,
  Zap,
  BookOpen,
  CheckCircle2
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

export default async function HomePage() {
  const currentUser = await getCurrentUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <section className="container px-4 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="w-fit" variant="outline">
                <Heart className="h-3 w-3 mr-1 text-red-500" />
                Made by Students, For Students
              </Badge>

              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                From
                <span className="text-red-500"> "Why didn't I see that?" </span>
                to
                <span className="block text-primary mt-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  "I know this pattern!"
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                We know the struggle. Staring at LeetCode for hours. Feeling lost in interviews.
                <span className="block mt-2 font-semibold text-foreground">
                  This platform teaches you to <span className="text-primary">think</span>, not memorize.
                </span>
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/patterns">
                  <Button size="lg" className="gap-2 text-lg px-8 shadow-lg hover:shadow-xl transition-all">
                    <Terminal className="h-5 w-5" />
                    Start Learning
                  </Button>
                </Link>
                {!currentUser ? (
                  <Link href="/auth/signup">
                    <Button size="lg" variant="outline" className="gap-2 text-lg px-8 border-2">
                      Sign Up Free
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="gap-2 text-lg px-8 border-2">
                      Continue Learning
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">No fake promises. Just proven patterns.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">100% free. Forever. Built with ❤️</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Learn once, solve hundreds of problems.</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 blur-3xl rounded-full"></div>
              <Card className="relative p-6 border-2 bg-card/50 backdrop-blur-sm shadow-2xl">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">your-journey.js</span>
                </div>

                <div className="font-mono text-sm space-y-2">
                  <div className="flex gap-3">
                    <span className="text-muted-foreground select-none">1</span>
                    <span className="text-muted-foreground">// Before: Random LeetCode grinding</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-muted-foreground select-none">2</span>
                    <span className="line-through text-red-500">solve(random_problem); // Lost</span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <span className="text-muted-foreground select-none">3</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-muted-foreground select-none">4</span>
                    <span className="text-muted-foreground">// After: Pattern recognition</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-muted-foreground select-none">5</span>
                    <span><span className="text-purple-500">if</span> (seeSortedArray) {'{'}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-muted-foreground select-none">6</span>
                    <span className="ml-4 text-green-500">// Think: Two Pointers!</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-muted-foreground select-none">7</span>
                    <span className="ml-4"><span className="text-purple-500">return</span> solve(confidently);</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-muted-foreground select-none">8</span>
                    <span>{'}'}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Pattern Recognition: Activated ✨</span>
                    <Badge variant="outline" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Two Pointers
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              We've Been There Too
            </h2>
            <p className="text-xl text-muted-foreground">
              The journey from confusion to clarity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <Card className="p-8 h-full border-2 hover:shadow-xl transition-all">
                <div className="absolute -top-4 left-8">
                  <div className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                    1
                  </div>
                </div>
                <div className="pt-6 space-y-4">
                  <div className="text-4xl">😰</div>
                  <h3 className="text-xl font-bold">The Struggle</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Solved 200+ problems but still panic in interviews. Every new problem feels completely foreign.
                  </p>
                  <div className="pt-2 text-sm text-red-600 font-medium">
                    "Why can't I solve this?"
                  </div>
                </div>
              </Card>
            </div>

            <div className="relative">
              <Card className="p-8 h-full border-2 hover:shadow-xl transition-all border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20 dark:border-yellow-900">
                <div className="absolute -top-4 left-8">
                  <div className="bg-yellow-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                    2
                  </div>
                </div>
                <div className="pt-6 space-y-4">
                  <div className="text-4xl">💡</div>
                  <h3 className="text-xl font-bold">The Aha Moment</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    This is just Two Pointers! I've seen this pattern before. It's not a new problem type.
                  </p>
                  <div className="pt-2 text-sm text-yellow-700 dark:text-yellow-500 font-medium">
                    "Wait... I know this!"
                  </div>
                </div>
              </Card>
            </div>

            <div className="relative">
              <Card className="p-8 h-full border-2 hover:shadow-xl transition-all border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
                <div className="absolute -top-4 left-8">
                  <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                    3
                  </div>
                </div>
                <div className="pt-6 space-y-4">
                  <div className="text-4xl">🚀</div>
                  <h3 className="text-xl font-bold">The Confidence</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Pattern identified in seconds. Clear approach. Multiple variations solved with same technique.
                  </p>
                  <div className="pt-2 text-sm text-green-700 dark:text-green-500 font-medium">
                    "I got this!"
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground italic">
              Pattern recognition changes everything. Let's get you from step 1 to step 3.
            </p>
          </div>
        </div>
      </section>

      <section className="container px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              <Brain className="h-3 w-3 mr-1" />
              The Pattern Mindset
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Stop Grinding. Start Thinking.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              There are only ~27 core patterns. Learn them once, solve thousands of problems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 hover:shadow-xl transition-all">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-red-500/10">
                    <Coffee className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">The Old Way (Exhausting)</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✗</span>
                        <span>Solve 500+ random problems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✗</span>
                        <span>Forget solutions after a week</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✗</span>
                        <span>Panic when problem looks different</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✗</span>
                        <span>Feel like you're not improving</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2 border-green-500/50 bg-green-500/5 hover:shadow-xl transition-all">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">The Pattern Way (Smart)</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Learn 27 patterns deeply</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Recognize pattern in 30 seconds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Know exactly how to approach</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Confidence in every interview</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="container px-4 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What You'll Actually Get (No BS)
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-2 hover:shadow-xl transition-all group">
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-primary/10 w-fit group-hover:scale-110 transition-transform">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl">27 Core Patterns</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  From Two Pointers to Dynamic Programming. Each pattern explained like your senior would - clear, practical, with real examples.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary" className="text-xs">Sliding Window</Badge>
                  <Badge variant="secondary" className="text-xs">Two Pointers</Badge>
                  <Badge variant="secondary" className="text-xs">DP</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 hover:shadow-xl transition-all group">
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-blue-500/10 w-fit group-hover:scale-110 transition-transform">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl">Curated Problems</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  No random grinding. Every problem teaches you something new about the pattern. Pattern triggers, common mistakes, multiple approaches.
                </p>
                <div className="space-y-2 pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span>When to use this pattern</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span>Common pitfalls explained</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span>Brute force → Optimal solution</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 hover:shadow-xl transition-all group">
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-purple-500/10 w-fit group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-xl">Your Progress, Your Way</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Track what matters: streak, pattern mastery, problems solved. Take notes. Bookmark tough ones. Build your own study guide.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Your journey starts here</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-gradient-to-r from-primary to-blue-600 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="container px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              <GitBranch className="h-3 w-3 mr-1" />
              Your Learning Journey
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">
              It's Actually Simple
            </h2>
            <p className="text-muted-foreground mt-4">
              No complicated roadmaps. Just 3 clear steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg">
                  1
                </div>
              </div>
              <h3 className="font-bold text-xl">Pick a Pattern</h3>
              <p className="text-muted-foreground">
                Start with basics like Two Pointers or Sliding Window. Read the guide, understand when to use it.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>~15 min per pattern</span>
              </div>
            </div>

            <div className="relative space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg">
                  2
                </div>
              </div>
              <h3 className="font-bold text-xl">Solve Problems</h3>
              <p className="text-muted-foreground">
                Practice with curated problems. See hints if stuck. Learn multiple approaches. Take notes.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>5-10 problems per pattern</span>
              </div>
            </div>

            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg">
                  3
                </div>
              </div>
              <h3 className="font-bold text-xl">Master & Move On</h3>
              <p className="text-muted-foreground">
                Feel confident? Move to the next pattern. Track your progress. Build your pattern recognition muscle.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                <Trophy className="h-4 w-4" />
                <span>Real confidence, not fake it</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 border-2 bg-gradient-to-br from-card to-primary/5">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-xl">
                  <Youtube className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-2xl mb-2 flex items-center gap-2 justify-center md:justify-start">
                  <Heart className="h-6 w-6 text-red-500" />
                  Built on Pratyush's Foundation
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  This platform uses the DSA pattern methodology by <span className="font-semibold">Pratyush Narain</span> (Padho with Pratyush).
                  His structured approach helped thousands of students crack their interviews. We just made it easier to practice.
                </p>
                <Link
                  href="https://www.youtube.com/@padho_with_pratyush"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2 border-2">
                    <Youtube className="h-4 w-4" />
                    Check His YouTube Channel
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="container px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 border-2 text-center bg-gradient-to-br from-primary/10 via-card to-blue-500/10">
            <div className="space-y-6">
              <div className="flex justify-center">
                <Badge className="text-lg px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Ready When You Are
                </Badge>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold">
                Let's Do This Together
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                No pressure. No fake urgency. Just start learning patterns at your own pace.
                <span className="block mt-2 font-semibold text-foreground">
                  Future you will thank present you. 🚀
                </span>
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Link href="/patterns">
                  <Button size="lg" className="gap-2 text-lg px-10 shadow-xl hover:shadow-2xl transition-all">
                    <Code2 className="h-5 w-5" />
                    Start Learning Now
                  </Button>
                </Link>
                {!currentUser && (
                  <Link href="/auth/signup">
                    <Button size="lg" variant="outline" className="gap-2 text-lg px-10 border-2">
                      Create Free Account
                    </Button>
                  </Link>
                )}
              </div>
              <p className="text-sm text-muted-foreground pt-4">
                100% free. No credit card. No BS. Just learn.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
