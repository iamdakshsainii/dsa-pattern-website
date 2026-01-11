import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Rocket, Bell, ArrowRight } from "lucide-react"

export default function EmptySolutionState() {
  return (
    <Card className="p-12 border-2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 border-blue-200 dark:border-blue-800 shadow-xl">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="relative inline-flex">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative p-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-2xl">
            <Rocket className="h-16 w-16 text-white animate-bounce" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Solution Coming Soon! 🚀
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We're crafting a comprehensive solution with detailed explanations, multiple approaches, and optimized code examples.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 text-left pt-6">
          <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-sm">Expected Timeline</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Within 1 week
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                <ArrowRight className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-sm">What to Expect</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Multiple approaches with complexity analysis
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-pink-200 dark:border-pink-800 hover:shadow-lg transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors">
                <Bell className="h-5 w-5 text-pink-600" />
              </div>
              <h3 className="font-bold text-sm">Stay Updated</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Bookmark this question to track progress
            </p>
          </div>
        </div>

        <div className="pt-6 space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Meanwhile:</span> Try solving this problem on your own! Understanding the problem deeply before seeing solutions will strengthen your problem-solving skills.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
