import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, TrendingUp } from "lucide-react";

export function SuccessCard({ roadmap, passedCount, attemptNumber, percentage }) {
  return (
    <Card className="p-8 mb-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-4 border-green-500">
      <div className="text-center">
        <div className="inline-block p-6 bg-green-500 rounded-full mb-6 shadow-xl animate-bounce">
          <Award className="h-16 w-16 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-green-800 dark:text-green-300 mb-3">
          🎉 Congratulations! 🎉
        </h2>
        <p className="text-xl text-green-700 dark:text-green-400 mb-6">
          You've mastered the {roadmap.title}!
        </p>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg mb-6">
          <h3 className="font-bold text-lg mb-4">🏆 Your Achievement:</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {passedCount}
              </div>
              <div className="text-sm text-muted-foreground">Passes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {attemptNumber}
              </div>
              <div className="text-sm text-muted-foreground">Attempts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {percentage}%
              </div>
              <div className="text-sm text-muted-foreground">Best Score</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Link href={`/roadmaps/${roadmap.slug}/certificate`}>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
            >
              <Award className="h-5 w-5 mr-2" />
              Download Certificate
            </Button>
          </Link>
          <Link href="/jobs">
            <Button size="lg" variant="outline" className="w-full border-2">
              <TrendingUp className="h-5 w-5 mr-2" />
              Apply for Jobs
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
