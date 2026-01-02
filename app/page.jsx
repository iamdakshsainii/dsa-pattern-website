import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Code2,
  Target,
  TrendingUp,
  Youtube,
  Zap,
  Brain,
  BookOpen,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Terminal,
  GitBranch
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="container px-4 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="space-y-6">
              <Badge className="w-fit" variant="outline">
                <Sparkles className="h-3 w-3 mr-1" />
                Pattern-Based Learning
              </Badge>

              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                Master DSA Through
                <span className="block text-primary mt-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Pattern Recognition
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Stop memorizing solutions. Start recognizing patterns. Learn the <span className="font-semibold text-foreground">thinking process</span> behind every problem and ace your coding interviews.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/patterns">
                  <Button size="lg" className="gap-2 text-lg px-8 shadow-lg hover:shadow-xl transition-all">
                    <Terminal className="h-5 w-5" />
                    Start Coding
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" variant="outline" className="gap-2 text-lg px-8 border-2">
                    Sign Up Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-6 pt-4 border-t">
                <div>
                  <p className="text-2xl font-bold">27+</p>
                  <p className="text-sm text-muted-foreground">Patterns</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">200+</p>
                  <p className="text-sm text-muted-foreground">Problems</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-sm text-muted-foreground">Free</p>
                </div>
              </div>
            </div>

            {/* Right - Code Preview Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 blur-3xl rounded-full"></div>
              <Card className="relative p-6 border-2 bg-card/50 backdrop-blur-sm shadow-2xl">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">pattern-recognition.js</span>
                </div>

                <div className="font-mono text-sm space-y-2">
                  <div className="flex gap-3">
                    <span className="text-muted-foreground select-none">1</span>
                    <span className="text-purple-500">function</span>
                    <span className="text-blue-500">masterDSA</span>
                    <span>() {'{'}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-muted-foreground select-none">2</span>
                    <span className="ml-4 text-muted-foreground">// Learn patterns, not solutions</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-muted-foreground select-none">3</span>
                    <span className="ml-4"><span className="text-purple-500">const</span> skill = <span className="text-green-500">"problem solving"</span>;</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-muted-foreground select-none">4</span>
                    <span className="ml-4"><span className="text-purple-500">return</span> practice(skill);</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-muted-foreground select-none">5</span>
                    <span>{'}'}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Pattern identified</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Two Pointers
                  </Badge>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              <Code2 className="h-3 w-3 mr-1" />
              Why Pattern Recognition?
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">Built for Serious Coders</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Master the meta-skill of problem solving. Learn once, apply everywhere.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-2 hover:shadow-xl hover:border-primary/50 transition-all group">
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-primary/10 w-fit group-hover:scale-110 transition-transform">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl">27+ Patterns</h3>
                <p className="text-muted-foreground">
                  From sliding window to dynamic programming. Master every algorithmic pattern with detailed explanations and visual guides.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Two Pointers</Badge>
                  <Badge variant="secondary" className="text-xs">Sliding Window</Badge>
                  <Badge variant="secondary" className="text-xs">DP</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 hover:shadow-xl hover:border-primary/50 transition-all group">
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-blue-500/10 w-fit group-hover:scale-110 transition-transform">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl">200+ Curated Problems</h3>
                <p className="text-muted-foreground">
                  Hand-picked questions with pattern triggers, edge cases, and multiple approaches. Learn when to apply each pattern.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Pattern identification guides</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Common pitfalls explained</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 hover:shadow-xl hover:border-primary/50 transition-all group">
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-orange-500/10 w-fit group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-bold text-xl">Track Your Progress</h3>
                <p className="text-muted-foreground">
                  Monitor your journey with detailed analytics. Track streak, pattern mastery, and time complexity understanding.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs">
                    <span>Pattern Mastery</span>
                    <span className="font-semibold">67%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-primary to-blue-600"></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              <GitBranch className="h-3 w-3 mr-1" />
              Learning Path
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">Master DSA in 3 Steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute top-0 left-8 w-0.5 h-full bg-gradient-to-b from-primary to-transparent hidden md:block"></div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg">
                    1
                  </div>
                  <h3 className="font-bold text-xl">Learn Patterns</h3>
                </div>
                <p className="text-muted-foreground ml-20">
                  Start with comprehensive pattern guides. Understand the core concept, when to use it, and common variations.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-8 w-0.5 h-full bg-gradient-to-b from-primary to-transparent hidden md:block"></div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg">
                    2
                  </div>
                  <h3 className="font-bold text-xl">Practice Problems</h3>
                </div>
                <p className="text-muted-foreground ml-20">
                  Solve curated problems that reinforce the pattern. Each with hints, multiple solutions, and complexity analysis.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="font-bold text-xl">Track & Master</h3>
              </div>
              <p className="text-muted-foreground ml-20">
                Monitor your progress, maintain streaks, and build confidence. See your pattern recognition skills grow over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Section */}
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
                  <Trophy className="h-6 w-6 text-primary" />
                  Inspired by Padho with Pratyush
                </h3>
                <p className="text-muted-foreground mb-4">
                  This platform is built on the excellent DSA pattern methodology created by Pratyush Narain.
                  His structured approach has helped thousands master data structures and algorithms.
                </p>
                <a
                  href="https://www.youtube.com/@padho_with_pratyush"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2 border-2">
                    <Youtube className="h-4 w-4" />
                    Visit YouTube Channel
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 border-2 text-center bg-gradient-to-br from-primary/10 via-card to-blue-500/10">
            <div className="space-y-6">
              <div className="flex justify-center">
                <Badge className="text-lg px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Your Journey Today
                </Badge>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold">
                Ready to Master DSA?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of developers who've transformed their problem-solving skills through pattern recognition.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Link href="/patterns">
                  <Button size="lg" className="gap-2 text-lg px-10 shadow-xl hover:shadow-2xl transition-all">
                    <Code2 className="h-5 w-5" />
                    Explore Patterns
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="lg" variant="outline" className="gap-2 text-lg px-10 border-2">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
