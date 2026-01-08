import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";

export function QuizResultHeader({
  roadmap,
  attemptNumber,
  attemptsUnlocked,
  passedCount,
  canRetake,
  isMastered,
  attemptsRemaining
}) {
  return (
    <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 max-w-6xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link href={`/roadmaps/${roadmap.slug}`}>
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{roadmap.title}</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-sm px-3 py-1.5 font-semibold ${
                  attemptsRemaining <= 1 && attemptsRemaining > 0
                    ? 'border-orange-500 text-orange-700 bg-orange-50'
                    : attemptsRemaining === 0
                    ? 'border-red-500 text-red-700 bg-red-50'
                    : 'border-blue-500 text-blue-700'
                }`}
              >
                Attempt {attemptNumber}/{attemptsUnlocked}
                {attemptsRemaining > 0 && (
                  <span className="ml-1 text-xs opacity-75">
                    • {attemptsRemaining} left
                  </span>
                )}
              </Badge>

              <Badge
                variant={passedCount >= 3 ? "default" : "secondary"}
                className={`text-sm px-3 py-1.5 ${
                  passedCount >= 3
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : passedCount >= 2
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {passedCount}/3 passes
              </Badge>
            </div>

            {isMastered ? (
              <Link href={`/roadmaps/${roadmap.slug}/certificate`}>
                <Button
                  size="sm"
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md"
                >
                  <Trophy className="h-4 w-4" />
                  <span className="hidden sm:inline">Get Certificate</span>
                  <span className="sm:hidden">Certificate</span>
                </Button>
              </Link>
            ) : canRetake ? (
              <Link href={`/roadmaps/${roadmap.slug}/quiz`}>
                <Button
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Retake Quiz</span>
                  <span className="sm:hidden">Retake</span>
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
