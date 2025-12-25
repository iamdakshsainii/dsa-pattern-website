import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Target, TrendingUp, Youtube } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-balance">
            Master DSA Through <span className="text-primary">Pattern Recognition</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Stop memorizing solutions. Start recognizing patterns. Learn the thinking process behind every problem.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/patterns">
              <Button size="lg" className="gap-2">
                <Target className="h-5 w-5" />
                Explore Patterns
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="lg" variant="outline">
                Start Learning
              </Button>
            </Link>
          </div>
        </div>

        {/* Credit Section */}
        <Card className="max-w-2xl mx-auto mt-16 p-6 flex items-center gap-6 bg-card/50 backdrop-blur">
          <img
            src="/images/creator-credit.png"
            alt="Padho with Pratyush"
            className="h-20 w-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              Inspired by Padho with Pratyush
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              This platform is based on the excellent DSA pattern sheet created by Pratyush Narain.
            </p>
            <a
              href="https://www.youtube.com/@padho_with_pratyush"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline mt-2 inline-block"
            >
              Visit YouTube Channel →
            </a>
          </div>
        </Card>
      </section>

      {/* Features */}
      <section className="container px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 space-y-3">
            <BookOpen className="h-10 w-10 text-primary" />
            <h3 className="font-semibold text-lg">27+ Patterns</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive coverage of all major algorithmic patterns with detailed explanations
            </p>
          </Card>
          <Card className="p-6 space-y-3">
            <Target className="h-10 w-10 text-primary" />
            <h3 className="font-semibold text-lg">200+ Problems</h3>
            <p className="text-sm text-muted-foreground">
              Curated problems with pattern triggers, common mistakes, and multiple solution approaches
            </p>
          </Card>
          <Card className="p-6 space-y-3">
            <TrendingUp className="h-10 w-10 text-primary" />
            <h3 className="font-semibold text-lg">Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your learning journey with confidence levels, notes, and pattern mastery visualization
            </p>
          </Card>
        </div>
      </section>
    </div>
  )
}
